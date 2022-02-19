import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { User } from '../../lib/entities/economy/user';

@ApplyOptions<CommandOptions>({
	name: 'leaderboard',
	description: 'Shows the global economy leaderboard.',
	detailedDescription: 'leaderboard',
	flags: ['guildOnly', 'ownerOnly', 'bankOnly', 'overallMoney']
})
export default class LeaderboardCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const flags = interaction.options.getString('flags', true).split('--');
		const guildOnly = flags.includes('guildOnly');
		const walletOnly = flags.includes('walletOnly');
		const bankOnly = flags.includes('bankOnly');
		const overallMoney = flags.includes('overallMoney');

		if (guildOnly && walletOnly) {
			return interaction.reply('Please Only Specify Either Bank or Wallet or Overall');
		}

		const topUsers = await User.createQueryBuilder('user')
			.orderBy('user.wallet', 'DESC')
			.limit(10)
			.getMany();
		const leaderboardEmbed = new MessageEmbed();
		const leaderboardData: string[] = [];

		let counter = 1;

		const validUsers = topUsers.filter((user) => {
			if (user.wallet + user.bank < 0) return false;
			if (!guildOnly) return false;
			return true;
		});

		for (const user of validUsers) {
			const userInformation = await this.container.client.users.fetch(user.id);

			const valueForEmbed = (): number => {
				if (overallMoney) return user.wallet + user.bank;
				if (bankOnly) return user.bank;
				return user.wallet;
			};

			switch (counter) {
				// Removed unnecessary {} around case statements
				case 1:
					// Made all lines single lines so its actually readable, for the love of god change your max line length
					leaderboardData.push(
						`:first_place: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
					break;
				case 2:
					leaderboardData.push(
						`:second_place: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
					break;
				case 3:
					leaderboardData.push(
						`:third_place: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
					break;
				default:
					leaderboardData.push(
						`:${this.numToEnglish(counter)}: • ${userInformation.tag} - ${
							valueForEmbed() ? valueForEmbed().toLocaleString() : 0
						}`
					);
			}
			counter++;
		}

		leaderboardEmbed.setDescription(leaderboardData.join('\n'));
		return interaction.reply({ embeds: [leaderboardEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('flags')
						.setDescription('Flags to use')
						.setChoices([
							['Only show guilds', '--guildOnly'],
							['Only show wallets', '--walletOnly'],
							['Only show banks', '--bankOnly'],
							['Show overall money', '--overallMoney']
						])
				), {idHints:['944645719409713183']}
		);
	}

	private numToEnglish(number: number): string {
		const num = [
			'zero',
			'one',
			'two',
			'three',
			'four',
			'five',
			'six',
			'seven',
			'eight',
			'nine',
			'ten',
			'eleven',
			'twelve',
			'thirteen',
			'fourteen',
			'fifteen',
			'sixteen',
			'seventeen',
			'eighteen',
			'nineteen'
		];
		if (number < 20) return num[number];
		const tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

		const digit = number % 10;
		// 												Added strict if check here instead of ambiguous
		if (number < 100) return `${tens[~~(number / 10) - 2]}${digit !== 0 ? '-' + num[digit] : ''}`;
		// Changed return types to string so its actually clear whats returned
		if (number < 1000)
			return `${num[~~(number / 100)]} hundred ${
				number % 100 == 0 ? '' : ' ' + this.numToEnglish(number % 100)
			}`;
		return `${this.numToEnglish(~~(number / 1000))} thousand ${
			number % 1000 != 0 ? ' ' + this.numToEnglish(number % 1000) : ''
		}`;
	}
}
