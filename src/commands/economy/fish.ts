import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';
import { fetchInventories, fetchItemByName } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'fish',
	description: 'Lets you fish!',
	detailedDescription: ''
})
export class FishCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const itemData = await fetchItemByName('FISHING_POLE');
		if (itemData === null) {
			return interaction.reply("You don't have a fishing pole.");
		}
		const doesUserHaveFishingPole =
			(await fetchInventories(interaction.user).then((invs) => invs.find((inv) => inv.itemID === itemData.name)))!.count > 0;

		if (!doesUserHaveFishingPole) return interaction.reply('You do not have a fishing pole!');
		const fishing_success = !!Math.random();

		if (fishing_success) {
			const fish = await fetchItemByName('FISH');
			if (fish === null) return;
			fetchInventories(interaction.user).then(async (inventory) => {
				const inv = inventory.find((inv) => inv.itemID === fish.name);
				const fish_amount = Math.round(Math.random() * (10 - 1) + 1);

				await this.container.prisma.item.update({
					where: {
						id: inv!.id
					},
					data: {
						count: (inv!.count += fish_amount)
					}
				});
			});
			return interaction.reply(`You caught a ${fish.name}!`);
		} else return interaction.reply('You failed to catch anything!');
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645631291572244']
		});
	}
}
