import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: '8ball',
	description: 'RNG chooses your fate.',
	detailedDescription: '8ball <question>'
})
export class EightballCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const optionsArray = [
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
		return interaction.reply(`:8ball: ${optionsArray[Math.floor(Math.random() * optionsArray.length)]}`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('question').setDescription('The question to ask').setRequired(true)),
			{ idHints: ['944645894249250867'] }
		);
	}
}
