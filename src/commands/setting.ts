import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandInteraction, User } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'setting',
	description: 'Customize your settings.',
	detailedDescription: '/settings <subcommand> <...values>'
})
export default class SettingCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const subcommand = interaction.options.getSubcommand(true);

		switch (subcommand) {
			case 'emoji_color':
				{
					const newColor = interaction.options.getString('new_color') ?? 'default';
					await this.updatePreferredEmojiColor(interaction.user, newColor);
					await interaction.reply({ content: `Changed your preferred emoji color to **${newColor}**.`, ephemeral: true });
				}
				break;
		}
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('emoji_color')
							.setDescription('Modify preferred color of emojis.')
							.addStringOption((option) =>
								option
									.setName('new_color')
									.setDescription('Color for your new emoji')
									.setChoices(
										{ name: 'Default 👋', value: 'default' },
										{ name: 'Pale 👋🏻', value: 'pale' },
										{ name: 'Cream White 👋🏼', value: 'cream_white' },
										{ name: 'Brown 👋🏽', value: 'brown' },
										{ name: 'Dark Brown 👋🏾', value: 'dark_brown' },
										{ name: 'Black 👋🏿', value: 'black' }
									)
									.setRequired(true)
							)
					),
			{ idHints: ['977784299296288798'] }
		);
	}

	private updatePreferredEmojiColor(user: User, color: string) {
		return this.container.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				preferredEmojiColor: color
			}
		});
	}
}
