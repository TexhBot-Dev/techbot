import type { Interaction } from 'discord.js';
import { ItemNames } from '@prisma/client';
import { Listener } from '@sapphire/framework';

export class InteractionListener extends Listener {
	public async run(interaction: Interaction) {
		if (!interaction.isAutocomplete()) return;
		const focusedValue = interaction.options.getFocused().toString();
		switch (interaction.commandName) {
			case 'buy':
			case 'shop':
			case 'sell':
				{
					const choices = Object.values(ItemNames).map((el) => el.toProperCase());

					let filtered = choices.filter(
						(choice) => choice.toLowerCase().startsWith(focusedValue.toLowerCase()) || focusedValue.toLowerCase().startsWith(choice)
					);
					if (filtered.length === 0)
						filtered = choices.filter(
							(choice) =>
								choice.toLowerCase().includes(focusedValue.toLowerCase()) || focusedValue.toLowerCase().includes(choice.toLowerCase())
						);

					await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
				}
				break;
			case 'help': {
				const choices = this.container.stores.get('commands').map((command) => command.name.toProperCase());
				let filtered = choices.filter((choice) => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
				if (filtered.length === 0)
					filtered = choices.filter(
						(choice) =>
							choice.toLowerCase().includes(focusedValue.toLowerCase()) || focusedValue.toLowerCase().includes(choice.toLowerCase())
					);

				await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
			}
		}
	}
}
