import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { randomUnitInterval } from '../../lib/helpers';

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
			idHints: ['944645979150372874']
		});
	}
}
