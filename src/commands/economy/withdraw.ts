import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed, WebhookClient } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { isSafeInteger, parseAmount } from '../../lib/helpers/numbers';
import { fetchUser } from '../../lib/helpers/database';
import { generateErrorEmbed } from '../../lib/helpers/embed';
import { addToWallet, subtractFromWallet } from '../../lib/helpers/economy';

@ApplyOptions<CommandOptions>({
	name: 'withdraw',
	description: 'Allows you withdraw coins into your bank account.',
	aliases: ['with', 'withdrow'],
	detailedDescription: 'with <amount>'
})
export default class WithdrawCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const arg = interaction.options.getString('amount', true);
		const amountToWithdraw = parseAmount(user.bank, arg as any);

		if (!isSafeInteger(amountToWithdraw)) {
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`'${arg}' is a not a valid [safe integer](https://gist.github.com/DevSpen/25ef4e1098231100262f36659e80534a).\nUsage: \`$/${this.detailedDescription}\``,
						'Unsafe Integer'
					)
				],
				ephemeral: true
			});
		}

		if (amountToWithdraw > user.bank) {
			return interaction.reply({
				embeds: [generateErrorEmbed("You don't have enough money in your bank to withdraw that much")],
				ephemeral: true
			});
		}

		await addToWallet(interaction.user, amountToWithdraw);
		await subtractFromWallet(interaction.user, amountToWithdraw);

		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('Withdraw')
			.setDescription(
				`${interaction.user.tag} (${interaction.user.id}) has withdrawn ${amountToWithdraw.toLocaleString()} coins from their bank account.`
			)
			.setColor('#00ff00')
			.setTimestamp();

		await webhook.send({ embeds: [embed] });

		const response = new MessageEmbed()
			.setDescription(`You withdrew **$${amountToWithdraw.toLocaleString()}** from your bank account.`)
			.setTitle('Withdraw')
			.setColor('BLUE');

		return interaction.reply({ embeds: [response] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('amount').setRequired(true).setDescription('The amount of money to withdraw')),
			{ idHints: ['944645891850117150'] }
		);
	}
}
