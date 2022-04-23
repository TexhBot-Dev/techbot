import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'owofy',
	description: 'Only for the true owoers.',
	detailedDescription: 'owo <string>'
})
export class OwOCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const owoifiedText = interaction.options
			.getString('text', true)
			.replace(/r/g, 'w')
			.replace(/R/g, 'W')
			.replace(/l/g, 'w')
			.replace(/L/g, 'W')
			.replace(/n/g, 'ny')
			.replace(/N/g, 'Ny')
			.replace(/\?/g, '？')
			.replace(/!/g, '！')
			.replace(/\s+/g, ' owo ');

		return void interaction.reply(owoifiedText);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('text').setDescription('The text to owoify.').setRequired(true)),
			{ idHints: ['944646065439801374'] }
		);
	}
}
