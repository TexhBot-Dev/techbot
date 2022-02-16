import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed, WebhookClient } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser, generateErrorEmbed, isSafeInteger, parseAmount } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	name: 'deposit',
	description: 'Lets your deposit coins into your bank account',
	aliases: ['dep', 'depos'],
	detailedDescription: 'deposit <amount>'
})
export default class DepositCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const arg = interaction.options.getString('amount') as string;
		const amountToDeposit = parseAmount(arg, user, true);

		if (isNaN(amountToDeposit))
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`'${arg}' is not a parsable integer.\nUsage: \`/${this.detailedDescription}\``,
						'Invalid Number'
					)
				],
				ephemeral: true
			});
		if (amountToDeposit > user.wallet)
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to deposit '${arg}'.\nUsage: \`/${this.detailedDescription}\``,
						'Invalid Amount'
					)
				],
				ephemeral: true
			});
		if (!isSafeInteger(amountToDeposit))
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`'${arg}' is a not a valid [safe integer](https://gist.github.com/DevSpen/25ef4e1098231100262f36659e80534a).\nUsage: \`/${this.detailedDescription}\``,
						'Unsafe Integer'
					)
				],
				ephemeral: true
			});

		user.wallet -= amountToDeposit;
		user.bank += amountToDeposit;
		await user.save();

		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		await webhook.send({
			embeds: [
				{
					title: 'User Deposit',
					description: `${interaction.user.tag} (${
						interaction.user.id
					}) has deposited ${amountToDeposit.toLocaleString()} coins into their account.`,
					color: '#00ff00',
					timestamp: new Date()
				}
			]
		});

		const response = new MessageEmbed()
			.setDescription(`You deposited **$${amountToDeposit.toLocaleString()}** into your bank account.`)
			.setTitle('Deposit')
			.setColor('BLUE');

		return interaction.reply({ embeds: [response] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setDescription('The amount of money to deposit')
						.setRequired(true)
				)
		);
	}
}
