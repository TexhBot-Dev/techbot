import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'coinflip',
	aliases: ['flip', 'coin-flip'],
	description: 'Flip a coin!',
	detailedDescription: 'coinflip'
})
export class CoinFlipCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		if (Math.random() > 0.5) return interaction.reply('Heads');
		else return interaction.reply('Tails');
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645979150372874']
		});
	}
}
