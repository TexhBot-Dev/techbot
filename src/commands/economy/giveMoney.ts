import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed, WebhookClient } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { pluralize, addToWallet, subtractFromWallet, generateErrorEmbed, isSafeInteger, parseAmount, fetchUser } from '../../lib/helpers/index.js';

@ApplyOptions<CommandOptions>({
	name: 'giveMoney',
	description: 'Allows you give money to another user.',
	detailedDescription: 'share <user> <amount>'
})
export default class GiveMoneyCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const receiver = interaction.options.getUser('user', true);
		const author = await fetchUser(interaction.user);
		const amount = parseAmount(author.wallet, interaction.options.getString('amount') as any);

		if (receiver.bot || receiver.id === interaction.user.id) {
			return interaction.reply({ embeds: [generateErrorEmbed('Invalid User Specified!', 'Invalid user')] });
		}

		if (isSafeInteger(amount)) {
			return interaction.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw', 'Invalid amount')]
			});
		}

		if (author.wallet < amount) {
			return interaction.reply({ embeds: [generateErrorEmbed('You do not have that much money!', 'Invalid amount')] });
		}

		await subtractFromWallet(interaction.user, amount);
		await addToWallet(receiver, amount);

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('User gave money!')
			.setDescription(`${interaction.user.tag} has given ${amount.toLocaleString()} to ${receiver.tag}.`)
			.setColor('#00ff00')
			.setTimestamp();

		await webhook.send({ embeds: [embed] });

		const userData = await fetchUser(receiver);

		const response = new MessageEmbed()
			.setTitle('Money Transferred')
			.setDescription(`You gave **$${amount.toLocaleString()}** ${pluralize('coin', amount)} to **${receiver.tag}**.`)
			.addField(
				'Your Balance',
				`\`\`\`diff\n+ Before: ${(author.wallet + amount).toLocaleString()}\n- After: ${author.wallet.toLocaleString()}\`\`\``,
				true
			)
			.addField(
				`${receiver.tag}'s Balance`,
				`\`\`\`diff\n- Before: ${(userData.wallet - amount).toLocaleString()}\n+ After: ${userData.wallet.toLocaleString()}\`\`\``,
				true
			)
			.setColor('BLUE');

		return interaction.reply({ embeds: [response] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) => option.setName('user').setDescription('The user to give money to.').setRequired(true))
					.addStringOption((option) =>
						option.setName('amount').setDescription('The amount of money to give to the user.').setRequired(true)
					),
			{ idHints: ['944645632411435049'] }
		);
	}
}
