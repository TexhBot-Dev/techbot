import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';
import { fetchUserInventory } from '../../lib/helpers/database';
import { incrementItemCount } from '../../lib/helpers/economy';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Lets you fish!',
	detailedDescription: ''
})
export class FishCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const doesUserHaveFishingPole = (await fetchUserInventory(interaction.user, 'FISHING_POLE')).count > 0;

		if (!doesUserHaveFishingPole) return interaction.reply('You do not have a fishing pole!');

		if (Math.random() > 0.5) {
			await incrementItemCount(interaction.user, 'FISH', Math.round(Math.random() * (10 - 1) + 1));
			return interaction.reply('You caught Fish!');
		}
		return interaction.reply('You failed to catch anything!');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645631291572244']
		});
	}
}
