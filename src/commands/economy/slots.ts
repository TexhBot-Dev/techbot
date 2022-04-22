import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';

import { ApplyOptions } from '@sapphire/decorators';
import { fetchGuild, fetchUser } from '../../lib/helpers/database';
import { parseAmount } from '../../lib/helpers/numbers';

@ApplyOptions<CommandOptions>({
	name: 'slots',
	description: 'Lets you gamble your money in a slot machine',
	detailedDescription: 'slots <amount>'
})
export default class SlotsCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const amount = parseAmount(user.wallet, interaction.options.getString('amount') as any);

		if (amount < 20) return interaction.reply('Please gamble a proper amount, a.k.a above 20');
		if (user.wallet < amount) return interaction.reply('You dont have enough money...');

		const guild = await fetchGuild(interaction.guild!);

		const slotEmoji = ':money_mouth:';
		const items = ['💵', '💍', '💯'];

		const randomNumber = Math.floor(Math.random() * (100 - 10 + 1)) + 10;

		const firstRoll = items[Math.floor(items.length * Math.random())];
		const secondRoll = guild.slotsWinMultiplier < randomNumber ? items[Math.floor(items.length * Math.random())] : firstRoll;
		const thirdRoll = guild.slotsWinMultiplier < randomNumber ? items[Math.floor(items.length * Math.random())] : firstRoll;

		const play = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription('• ' + slotEmoji + '  ' + slotEmoji + '  ' + slotEmoji + ' •')
			.setColor('BLUE')
			.setFooter({ text: 'Are you feeling lucky?' });

		const firstRollEmbed = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${slotEmoji}   ${slotEmoji} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });

		const secondRollEmbed = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${secondRoll}   ${slotEmoji} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });

		const thirdRollEmbed = new MessageEmbed()
			.setTitle('Slot Machine')
			.setDescription(`• ${firstRoll}   ${secondRoll}   ${thirdRoll} •`)
			.setColor('RANDOM')
			.setFooter({ text: 'Are you feeling lucky?' });

		await interaction.reply({ embeds: [play] });
		setTimeout(() => {
			interaction.editReply({ embeds: [firstRollEmbed] });
		}, 600);
		setTimeout(() => {
			interaction.editReply({ embeds: [secondRollEmbed] });
		}, 1200);
		setTimeout(() => {
			interaction.editReply({ embeds: [thirdRollEmbed] });
		}, 1800);

		if (firstRoll === secondRoll && firstRoll === thirdRoll) {
			setTimeout(async () => {
				const moneyEarned = guild.slotsMoneyPool;
				await this.container.prisma.user.update({
					where: {
						id: interaction.user.id
					},
					data: {
						wallet: (user.wallet += moneyEarned)
					}
				});

				await this.container.prisma.guild.update({
					where: {
						id: interaction.guild?.id
					},
					data: {
						slotsWinMultiplier: 0,
						slotsMoneyPool: 0
					}
				});

				return interaction.followUp({ content: `CONGRATS! You won **$${moneyEarned}**` });
			}, 2000);
		} else {
			setTimeout(async () => {
				await this.container.prisma.guild.update({
					where: {
						id: interaction.guild?.id
					},
					data: {
						slotsWinMultiplier: guild.slotsWinMultiplier++,
						slotsMoneyPool: (guild.slotsMoneyPool += amount)
					}
				});

				return interaction.followUp({ content: 'Sorry, you lost your money!' });
			}, 2000);
		}
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('amount').setDescription('The amount of money you want to gamble').setRequired(true)),
			{ idHints: ['944645806814793779'] }
		);
	}
}
