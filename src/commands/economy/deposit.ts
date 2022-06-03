import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

import { addToBank, subtractFromWallet, generateErrorEmbed, isSafeInteger, parseAmount, fetchUser } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'deposit',
	description: 'Deposit coins from your wallet into your bank account.',
	detailedDescription: 'deposit <amount>'
})
export default class DepositCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const userData = await fetchUser(interaction.user);
		const arg = interaction.options.getString('amount', true);
		const amountToDeposit = parseAmount(userData.bank, arg);

		if (!isSafeInteger(amountToDeposit)) {
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to deposit '${arg}'.\nUsage: ${Formatters.inlineCode(this.detailedDescription as string)}`,
						'Invalid Amount'
					)
				],
				ephemeral: true
			});
		}

		await subtractFromWallet(interaction.user, amountToDeposit);
		await addToBank(interaction.user, amountToDeposit);

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
			{ idHints: ['977784476249772032'] }
		);
	}
}
