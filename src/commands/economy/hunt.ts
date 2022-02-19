import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'hunt',
	description: 'Lets you hunt and potentially earn money',
	detailedDescription: 'hunt'
})
export class HuntCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		// TODO: Implement
		return interaction.reply('Not implemented yet');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description), {idHints:['944645717232848907']}
		);
	}
}
