import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'reverse',
	description: 'Reverse your text.',
	detailedDescription: 'reverse <string>'
})
export class ReverseCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const text_to_reverse = interaction.options.getString('text_to_reverse') as string;
		return interaction.reply(
			text_to_reverse
				.split('')
				.reverse()
				.join('')
				.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>')
		);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((options) =>
					options
						.setName('text_to_reverse')
						.setDescription('The text to reverse.')
						.setRequired(true)
				), {idHints:['944646066324787270']}
		);
	}
}
