import { CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { addToWallet, randomInt, randomUnitInterval, subtractFromWallet } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'highlow',
	description: 'Bet if a number is lower/higher/precise another number.',
	detailedDescription: 'highlow'
})
export default class HighlowCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const num = Math.floor(Math.random() * 100) + 1;
		const embed = new MessageEmbed()
			.setDescription(
				`The first number is **${num}**.\nDo you think the second number will be \`higher\`, \`lower\`, or exactly (\`jackpot\`) it?`
			)
			.setColor('BLUE')
			.setTitle('Highlow Bet');

		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('lower').setLabel('Lower').setStyle('SECONDARY'),
			new MessageButton().setCustomId('jackpot').setLabel('Jackpot').setStyle('SECONDARY'),
			new MessageButton().setCustomId('higher').setLabel('Higher').setStyle('SECONDARY')
		);

		await interaction.reply({ content: 'Made highlow bet successfully!', ephemeral: true });
		const msg = await interaction.channel?.send({ embeds: [embed], components: [row] });

		const filter = (interaction: MessageComponentInteraction) =>
			interaction.customId === 'higher' || interaction.customId === 'jackpot' || interaction.customId === 'lower';
		await msg?.awaitMessageComponent({ filter, time: 30_000 }).then(async (interaction) => {
			const bet = interaction.customId;
			const testNum = randomInt(101);

			let won: boolean;
			if (bet === 'higher' && num < testNum) {
				won = true;
			} else if (bet === 'lower' && num > testNum) {
				won = true;
			} else won = bet === 'jackpot' && num === testNum;

			const amount =
				bet === 'jackpot' && won
					? Math.round(randomUnitInterval() * (10000 - 2000) + 2000)
					: Math.round(randomUnitInterval() * (800 - 75) + 75);

			won ? await addToWallet(interaction.user, amount) : await subtractFromWallet(interaction.user, amount);

			const newEmbed = new MessageEmbed()
				.setTitle('Highlow')
				.setDescription(
					`You bet **${bet.toProperCase()}**, the first number was **${num}** and the second was **${testNum}**. So, you ${
						won ? 'won' : 'lost'
					} **$${amount}**.`
				)
				.setColor(won ? 'GREEN' : 'RED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

			await interaction.reply({ embeds: [newEmbed] });
			return msg.delete();
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['977784300453916672']
		});
	}
}
