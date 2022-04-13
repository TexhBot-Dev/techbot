import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'choose',
	description: 'Chooses a argument from a string randomly.',
	detailedDescription: 'choose <string>, ...'
})
export class ChooseCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		let arg = interaction.options
			.getString('choices', true)
			.replace(/@everyone|@here|<@&?(\d{17,19})>/gim, '<mention>')
			.replace(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gim, '<link>');
		const splitArg = arg.split(/,\s?/g);
		return interaction.reply(splitArg[Math.floor(Math.random() * splitArg.length)]);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('choices').setRequired(true).setDescription('The choices separated by ", "')),
			{ idHints: ['944645895163633714'] }
		);
	}
}
