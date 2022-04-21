import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandInteraction } from 'discord.js';
import type { User } from 'discord.js';
import type { PrismaClient } from '@prisma/client';

const updatePreferredEmojiColor = async (user: User, color: string, prisma: PrismaClient) => {
	return await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			preferredEmojiColor: color
		}
	});
};

@ApplyOptions<CommandOptions>({
	name: 'setting',
	description: 'Customize your settings.',
	detailedDescription: 'settings <subcommand> <...values>'
})
export default class SettingCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const option = interaction.options.getSubcommand(true);

		switch (option) {
			case 'emoji_color':
				{
					const toggle = interaction.options.getString('new_color') ?? 'default';
					updatePreferredEmojiColor(interaction.user, toggle, this.container.prisma);
					interaction.reply({ content: `Changed your preferred emoji color to **${toggle.toProperCase()}**.`, ephemeral: true });
				}
				break;
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
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
}
