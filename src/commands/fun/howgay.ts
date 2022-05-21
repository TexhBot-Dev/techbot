import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { randomInt } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'howgay',
	description: 'How gay are you?',
	detailedDescription: 'howgay [user]'
})
export class HowGayCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser('user', false) ?? interaction.user;
		return interaction.reply(`${user.tag === interaction.user.tag ? 'You are' : `${user.tag} is`} **${randomInt(0, 105)}%** gay! 🏳️‍🌈`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((options) =>
						options.setName('user').setDescription('The user to get the gay percentage for.').setRequired(false)
					),
			{ idHints: ['944645980672917534'] }
		);
	}
}
