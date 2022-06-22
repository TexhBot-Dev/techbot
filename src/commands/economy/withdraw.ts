import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

import { addToWallet, subtractFromWallet, generateErrorEmbed, fetchUser, isSafeInteger, parseAmount } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'withdraw',
	description: 'Allows you withdraw coins into your bank account.',
	detailedDescription: '/withdraw <amount>'
})
export default class WithdrawCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const arg = interaction.options.getString('amount', true);
		const amountToWithdraw = parseAmount(user.bank, arg as any);

		if (!isSafeInteger(amountToWithdraw)) {
			return interaction.reply({
				embeds: [
					generateErrorEmbed(`'${arg}' is a not a valid integer.\nUsage: \`$/${this.detailedDescription as string}\``, 'Unsafe Integer')
				],
				ephemeral: true
			});
		}

		if (amountToWithdraw > user.bank) {
			return interaction.reply({
				embeds: [generateErrorEmbed("You don't have enough money in your bank to withdraw that much", 'Invalid amount')],
				ephemeral: true
			});
		}

		await addToWallet(interaction.user, amountToWithdraw);
		await subtractFromWallet(interaction.user, amountToWithdraw);

		const response = new MessageEmbed()
			.setDescription(`You withdrew **$${amountToWithdraw.toLocaleString()}** from your bank account.`)
			.setTitle('Withdraw')
			.setColor('BLUE');

		return interaction.reply({ embeds: [response] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('amount').setRequired(true).setDescription('The amount of money to withdraw')),
			{ idHints: ['977784649969438770'] }
		);
	}
}
