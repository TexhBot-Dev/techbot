import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandInteraction } from 'discord.js';
import { generateErrorEmbed } from '../../lib/helpers';
import type { User } from 'discord.js';
import type { PrismaClient } from '@prisma/client';

const updatePerferedEmojuColor = async (user: User, color: string, prisma: PrismaClient) => {
	return await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			preferredEmojiColor: color
		}
	});
}

@ApplyOptions<CommandOptions>({
	name: 'setting',
	description: 'Allows you to change your default emoji',
	detailedDescription: 'settings'
})
export default class SettingCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const option = interaction.options.getString('string', true);

		switch (option.toLowerCase()) {
			case 'emojicolor':
			case 'coloremoji':
				const toggle = interaction.options.getString('toggle', true);
				let colorName: string | null;
				switch (toggle) {
					case 'default':
					case 'yellow':
						await updatePerferedEmojuColor(interaction.user, 'default', this.container.prisma);
						colorName = 'default';
						break;
					case 'pale':
					case 'white':
						await updatePerferedEmojuColor(interaction.user, 'pale', this.container.prisma);
						colorName = 'pale';
						break;
					case 'cream':
					case 'cream white':
						await updatePerferedEmojuColor(interaction.user, 'cream_white', this.container.prisma);
						colorName = 'cream_white';
						break;
					case 'brown':
						await updatePerferedEmojuColor(interaction.user, 'brown', this.container.prisma);
						colorName = 'brown';
						break;
					case 'dark brown':
						await updatePerferedEmojuColor(interaction.user, 'dark_brown', this.container.prisma);
						colorName = 'dark_brown';
						break;
					case 'black':
					case 'dark':
						await updatePerferedEmojuColor(interaction.user, 'black', this.container.prisma);
						colorName = 'black';
						break;
					default:
						colorName = null;
				}
				if (toggle === '' || colorName === null)
					return interaction.reply({
						embeds: [
							generateErrorEmbed(
								`Invalid preferred emoji color name '${toggle}' provided as the second argument.\nValid options: \`default\`, \`pale\`, \`cream white\`, \`brown\`, \`dark brown\`, \`black\``
							)
						]
					});

				await interaction.reply(
					`Changed your preferred emoji color to **${colorName.toProperCase()}**.`
				);
				break;
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('option')
						.setDescription('What to Do.')
						.setChoices([
							['emojicolor', 'emojicolor'],
							['coloremoji', 'coloremoji']
						])
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('toggle')
						.setDescription('Color for your new emoji')
						.setChoices([
							['default', 'default'],
							['yellow', 'yellow'],
							['pale', 'pale'],
							['white', 'white'],
							['cream', 'cream'],
							['cream white', 'cream white'],
							['brown', 'brown'],
							['dark brown', 'dark brown'],
							['black', 'black'],
							['dark', 'dark']
						])
						.setRequired(true)
				), {idHints:['944645805313257482']}
		);
	}
}
