import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed, User, WebhookClient } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser, generateErrorEmbed, parseAmount, pluralize } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'giveMoney',
	aliases: ['give', 'share'],
	description: 'Allows you give money to another user.',
	detailedDescription: 'share <user> <amount>'
})
export default class GiveMoneyCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const receiver = interaction.options.getUser('user') as User;
		const author = await fetchUser(interaction.user);
		const amount = parseAmount(interaction.options.getString('amount') as string, author);

		if (receiver.bot || receiver.id === interaction.user.id) {
			return interaction.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		}

		if (isNaN(amount) || amount < 0) {
			return interaction.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			});
		}

		if (author.wallet < amount) {
			return interaction.reply({ embeds: [generateErrorEmbed('You do not have that much money!')] });
		}

		await this.container.prisma.user.update({
			where: {
				id: author.id
			},
			data: {
				wallet: author.wallet - amount
			}
		});

		const user = await fetchUser(receiver);
		await this.container.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				wallet: user.wallet + amount
			}
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('User gave money!')
			.setDescription(
				`${interaction.user.tag} has given ${amount.toLocaleString()} to ${receiver.tag}.`
			)
			.setColor('#00ff00')
			.setTimestamp();

		await webhook.send({ embeds: [embed] });

		const response = new MessageEmbed()
			.setTitle('Money Transferred')
			.setDescription(
				`You gave **$${amount.toLocaleString()}** ${pluralize('coin', amount)} to **${
					receiver.tag
				}**.`
			)
			.addField(
				'Your Balance',
				`\`\`\`diff\n+ Before: ${(
					author.wallet + amount
				).toLocaleString()}\n- After: ${author.wallet.toLocaleString()}\`\`\``,
				true
			)
			.addField(
				`${receiver.tag}'s Balance`,
				`\`\`\`diff\n- Before: ${(
					user.wallet - amount
				).toLocaleString()}\n+ After: ${user.wallet.toLocaleString()}\`\`\``,
				true
			)
			.setColor('BLUE');

		return interaction.reply({ embeds: [response] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setDescription('The user to give money to.').setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setDescription('The amount of money to give to the user.')
						.setRequired(true)
				), {idHints:['944645632411435049']}
		);
	}
}
