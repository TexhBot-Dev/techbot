import type { ApplicationCommandRegistry } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputSubcommandMappings, SubcommandMappingsArray, SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { Milliseconds } from '#root/types/enums/Milliseconds.js';
import { dog } from './dog.js';
import { cat } from './cat.js';

@ApplyOptions<SubCommandPluginCommand.Options>({
	name: 'animal',
	description: 'Shows a cute image of an animal.',
	detailedDescription: '/animal <cat | dog>',
	cooldownDelay: Milliseconds.Second * 10 //10 seconds
})
export default class CatCommand extends SubCommandPluginCommand {
	protected readonly subcommandMappings: SubcommandMappingsArray = [
		new ChatInputSubcommandMappings([
			{
				name: 'dog',
				to: (interaction) => dog(interaction)
			},
			{
				name: 'cat',
				to: (interaction) => cat(interaction)
			}
		])
	];

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((builder) => builder.setName('cat').setDescription('Shows a cute cat image.'))
					.addSubcommand((builder) => builder.setName('dog').setDescription('Shows a cute dog image.')),
			{
				idHints: ['977784735218696242']
			}
		);
	}
}
