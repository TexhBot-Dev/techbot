import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'leaderboard',
	description: 'Shows the global economy leaderboard.',
	detailedDescription: 'leaderboard',
	flags: ['guildOnly', 'ownerOnly', 'bankOnly', 'overallMoney']
})
export default class LeaderboardCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const flags = (interaction.options.getString('flags', false) ?? '').split('--');
		const guildOnly = flags.includes('guildOnly');
		const walletOnly = flags.includes('walletOnly');
		const bankOnly = flags.includes('bankOnly');
		const overallMoney = flags.includes('overallMoney');

		if ((overallMoney && walletOnly) || (overallMoney && bankOnly)) {
			return interaction.reply('Please Only Specify Either Bank or Wallet or Overall');
		}

		const topTenUsers = (
			await this.container.prisma.user.findMany({
				take: 10,
				orderBy: {
					wallet: 'desc'
				},
				where: {
					wallet: {
						gt: 0
					}
				}
			})
		)
			.map(async (user, position) => {
				if (guildOnly && !interaction.guild?.members.fetch(user.id)) return false;
				const positionText = (() => {
					switch (position) {
						case 0:
							return 'first_place';
						case 1:
							return 'second_place';
						case 2:
							return 'third_place';
						default:
							return this.numToEnglish(position + 1);
					}
				})();
				const discordUserData = await this.container.client.users.fetch(user.id);
				const moneyCount = (() => {
					let money = user.wallet;
					if (overallMoney) money += user.bank;
					return money;
				})();
				return `:${positionText}: ${discordUserData?.username} - ${moneyCount}`;
			})
			.join('\n');

		if (topTenUsers.length === 0) return;

		const leaderboardEmbed = new MessageEmbed().setDescription(topTenUsers).setColor('BLUE').setTimestamp();
		return interaction.reply({ embeds: [leaderboardEmbed] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('flags')
							.setDescription('Flags to use')
							.setChoices(
								{ name: 'Only show guilds', value: '--guildOnly' },
								{ name: 'Only show wallets', value: '--walletOnly' },
								{ name: 'Only show banks', value: '--bankOnly' },
								{ name: 'Show overall money', value: '--overallMoney' }
							)
					),
			{ idHints: ['977784302026768434'] }
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
		// Added strict if check here instead of ambiguous
		if (number < 100) return `${tens[~~(number / 10) - 2]}${digit === 0 ? '' : `-${num[digit]}`}`;
		// Changed return types to string so its actually clear whats returned
		if (number < 1000) return `${num[~~(number / 100)]} hundred ${number % 100 === 0 ? '' : ` ${this.numToEnglish(number % 100)}`}`;
		return `${this.numToEnglish(~~(number / 1000))} thousand ${number % 1000 === 0 ? '' : ` ${this.numToEnglish(number % 1000)}`}`;
	}
}
