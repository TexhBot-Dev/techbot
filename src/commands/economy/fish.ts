import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { incrementItemCount, fetchUserInventory, randomUnitInterval, randomInt } from '../../lib/helpers';

import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Going fishing and attempt to catch something!',
	detailedDescription: 'fish'
})
export class FishCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const hasFishingPole = ((await fetchUserInventory(interaction.user, 'FISHING_POLE'))?.count ?? 0) > 0;

		if (!hasFishingPole) return void interaction.reply('You do not have a fishing pole!');

		const fishEarned = randomInt(1, 4);

		if (randomUnitInterval() > 0.5) {
			await incrementItemCount(interaction.user, 'FISH', fishEarned);
			return void interaction.reply(`You caught **${fishEarned}** fish!`);
		}
		return void interaction.reply('You failed to catch anything!');
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645631291572244']
		});
	}
}
