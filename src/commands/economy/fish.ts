import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';
import { fetchInventory, fetchItemByName } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Lets you fish!',
	detailedDescription: ''
})
export class FishCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const doesUserHaveFishingPole = await fetchInventory(
			interaction.user,
			await fetchItemByName('fishing_pole')
		);

		if (doesUserHaveFishingPole.amount === 0) return interaction.reply('You do not have a fishing pole!');
		const fishing_success = !!Math.random();

		if (fishing_success) {
			const fish = await fetchItemByName('fish');
			fetchInventory(interaction.user, fish).then(async (inventory) => {
				const fish_amount = Math.round(Math.random() * (10 - 1) + 1);
				inventory.amount += fish_amount;
				await inventory.save();
			});
			return interaction.reply(`You caught a ${fish.name}!`);
		} else return interaction.reply('You failed to catch anything!');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description), {idHints:['944645631291572244']}
		);
	}
}
