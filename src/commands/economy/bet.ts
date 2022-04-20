import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { addToWallet, subtractFromWallet } from '../../lib/helpers/economy';
import { parseAmount } from '../../lib/helpers/numbers';
import { fetchUser } from '../../lib/helpers/database';
import { generateEmbed } from '../../lib/helpers/embed';

@ApplyOptions<CommandOptions>({
	name: 'bet',
	description: 'Gives you a 50/50 chance to earn double what you bet.',
	detailedDescription: 'bet <bet amount>'
})
export default class BetCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const userDetails = await fetchUser(interaction.user);
		const betAmount = parseAmount(userDetails.wallet, interaction.options.getString('amount', true) as any);

		if (betAmount < 10) {
			return interaction.reply('Please bet a valid amount above 10!');
		}

		if (userDetails.wallet < betAmount) {
			return interaction.reply(`Sorry ${interaction.user.username}, you don't have enough money!`);
		}

		if (Math.random() < 0.5) {
			return await addToWallet(interaction.user, betAmount).then(() => {
				interaction.reply({
					embeds: [
						generateEmbed('Bet Won', `Congrats ${interaction.user.username}, you won **$${betAmount.toLocaleString()}**!`, 'DARK_GREEN')
					]
				});
			});
		} else {
			return await subtractFromWallet(interaction.user, betAmount).then(() => {
				interaction.reply({
					embeds: [generateEmbed('Bet Lost', `${interaction.user.username}, you lost **$${betAmount.toLocaleString()}**!`, 'RED')]
				});
			});
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
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
