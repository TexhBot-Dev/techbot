import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'howgay',
	aliases: ['how-gay'],
	description: 'How gay are you?',
	detailedDescription: 'howgay [user]'
})
export class HowGayCommand extends Command {
	chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser('user', false) || interaction.user;
		if (user.id === interaction.user.id)
			return interaction.reply(`You are **${Math.floor(Math.random() * 110)}%** gay! 🏳️‍🌈`);
		return interaction.reply(`${user.tag} is **${Math.floor(Math.random() * 110)}%** gay! 🏳️‍🌈`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((options) =>
					options
						.setName('user')
						.setDescription('The user to get the gay percentage for.')
						.setRequired(false)
				), {idHints:['944645980672917534']}
		);
	}
}
