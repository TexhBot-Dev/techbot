import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandInteraction, User } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'setting',
	description: 'Customize your settings.',
	detailedDescription: 'settings <subcommand> <...values>'
})
export default class SettingCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		const subcommand = interaction.options.getSubcommand(true);

		switch (subcommand) {
			case 'emoji_color':
				{
					const newColor = interaction.options.getString('new_color') ?? 'default';
					void this.updatePreferredEmojiColor(interaction.user, newColor);
					void interaction.reply({ content: `Changed your preferred emoji color to **${newColor.toProperCase()}**.`, ephemeral: true });
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
									.setChoices([
										['Default 👋', 'default'],
										['Pale 👋🏻', 'pale'],
										['Cream 👋🏼', 'cream'],
										['Brown 👋🏽', 'brown'],
										['Dark Drown 👋🏾', 'dark_brown'],
										['Black 👋🏿', 'black']
									])
									.setRequired(true)
							)
					),
			{ idHints: ['944645805313257482'] }
		);
	}

	private async updatePreferredEmojiColor(user: User, color: string) {
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
