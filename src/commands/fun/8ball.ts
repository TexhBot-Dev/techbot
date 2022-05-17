import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

const eightBallResponses = [
	'Yes!',
	'No!',
	'Nope!',
	'Go ask a friend.',
	'It seems so.',
	'For sure.',
	'Maybe.',
	'Of course!',
	'Nah',
	'Possibly',
	'That seems correct.'
];

@ApplyOptions<CommandOptions>({
	name: '8ball',
	description: 'RNG chooses your fate.',
	detailedDescription: '8ball <question>'
})
export class EightballCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(`:8ball: ${eightBallResponses.randomElement()}`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('question').setDescription('The question to ask.').setRequired(false)),
			{ idHints: ['944645894249250867'] }
		);
	}
}
