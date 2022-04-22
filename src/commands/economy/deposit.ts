import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed, WebhookClient } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../lib/helpers/database';
import { isSafeInteger, parseAmount } from '../../lib/helpers/numbers';
import { generateErrorEmbed } from '../../lib/helpers/embed';
import { addToBank, subtractFromWallet } from '../../lib/helpers/economy';

@ApplyOptions<CommandOptions>({
	name: 'deposit',
	description: 'Lets your deposit coins into your bank account',
	aliases: ['dep', 'depos'],
	detailedDescription: 'deposit <amount>'
})
export default class DepositCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const userData = await fetchUser(interaction.user);
		const arg = interaction.options.getString('amount');
		const amountToDeposit = parseAmount(userData.bank, arg as any);

		if (isSafeInteger(amountToDeposit)) {
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to deposit '${arg}'.\nUsage: \`/${this.detailedDescription as string}\``,
						'Invalid Amount'
					)
				],
				ephemeral: true
			});
		}

		await subtractFromWallet(interaction.user, amountToDeposit);
		await addToBank(interaction.user, amountToDeposit);

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

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('amount').setDescription('The amount of money to deposit').setRequired(true)),
			{ idHints: ['944645630704377936'] }
		);
	}
}
