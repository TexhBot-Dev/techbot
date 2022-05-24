import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { randomUnitInterval } from '#lib/helpers';

import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'coinflip',
	description: 'Flip a coin!',
	detailedDescription: 'coinflip'
})
export class CoinFlipCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		if (randomUnitInterval() > 0.5) return void interaction.reply('Heads');
		return interaction.reply('Tails');
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['977784824708362241']
		});
	}
}
