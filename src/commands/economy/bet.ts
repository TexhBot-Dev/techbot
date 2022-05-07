import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { generateEmbed, fetchUser, parseAmount, addToWallet, subtractFromWallet, randomUnitInterval } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'bet',
	description: 'Gives you a 50/50 chance to earn double what you bet.',
	detailedDescription: 'bet <bet amount>'
})
export default class BetCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const userDetails = await fetchUser(interaction.user);
		const betAmount = parseAmount(userDetails.wallet, interaction.options.getString('amount', true) as any);

		if (betAmount < 10) {
			return interaction.reply('Please bet a valid amount above 10!');
		}

		if (userDetails.wallet < betAmount) {
			return interaction.reply(`Sorry ${interaction.user.username}, you don't have enough money!`);
		}

		if (randomUnitInterval() < 0.5) {
			void addToWallet(interaction.user, betAmount).then(() => {
				return interaction.reply({
					embeds: [
						generateEmbed('Bet Won', `Congrats ${interaction.user.username}, you won **$${betAmount.toLocaleString()}**!`, 'DARK_GREEN')
					]
				});
			});
		}

		await subtractFromWallet(interaction.user, betAmount);

		return interaction.reply({
			embeds: [generateEmbed('Bet Lost', `${interaction.user.username}, you lost **$${betAmount.toLocaleString()}**!`, 'RED')]
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('amount').setDescription('The amount of money to bet.').setRequired(true)),
			{ idHints: ['944645545480290344'] }
		);
	}
}
