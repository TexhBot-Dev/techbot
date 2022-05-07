import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'reverse',
	description: 'Reverse your text.',
	detailedDescription: 'reverse <string>'
})
export class ReverseCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		const text = interaction.options.getString('text') as string;
		return interaction.reply(
			text
				.split('')
				.reverse()
				.join('')
				.replace(/@everyone|@here|<@&?(\d{17,19})>/g, '<mention>')
		);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((options) => options.setName('text').setDescription('The text to reverse.').setRequired(true)),
			{ idHints: ['944646066324787270'] }
		);
	}
}
