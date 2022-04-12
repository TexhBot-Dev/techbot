import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

@ApplyOptions<CommandOptions>({
	name: 'joke',
	description: 'Gives you a nice joke.',
	detailedDescription: 'joke'
})
export default class JokeCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const joke = (await fetch<{ joke: string }>('https://api.popcat.xyz/joke', FetchResultTypes.JSON)).joke;
		return interaction.reply(joke);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944646064831610900']
		});
	}
}
