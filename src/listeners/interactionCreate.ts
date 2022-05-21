import type { Interaction } from 'discord.js';
import { ItemNames, JobNames, PetTypes } from '@prisma/client';
import { Listener } from '@sapphire/framework';

export class InteractionListener extends Listener {
	public async run(interaction: Interaction) {
		if (!interaction.isAutocomplete()) return;
		const focusedValue = interaction.options.getFocused().toString().toLowerCase();
		switch (interaction.commandName) {
			case 'buy':
			case 'shop':
			case 'sell':
				await interaction.respond(fuzzyAutocomplete(ItemNames, focusedValue));
				break;
			case 'job':
				await interaction.respond(fuzzyAutocomplete(JobNames, focusedValue));
				break;
			case 'help':
				{
					const choices = this.container.stores.get('commands').map((command) => command.name.toProperCase());
					let filtered = choices.filter((choice) => choice.toLowerCase().startsWith(focusedValue));
					if (filtered.length === 0)
						filtered = choices.filter(
							(choice) => choice.toLowerCase().includes(focusedValue) || focusedValue.includes(choice.toLowerCase())
						);

					await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
				}
				break;
			case 'pets':
				{
					const subcommandName = interaction.options.getSubcommand(true).toLocaleLowerCase();
					if (subcommandName === 'buy') {
						await interaction.respond(fuzzyAutocomplete(PetTypes, focusedValue));
					} else if (subcommandName === 'feed') {
						const userPets = (
							await this.container.prisma.pet.findMany({
								where: {
									userID: interaction.user.id
								},
								select: {
									name: true
								}
							})
						).map((pet) => pet.name);
						console.log(userPets);
						await interaction.respond(fuzzyAutocomplete(userPets, focusedValue));
					}
				}
				break;
		}
	}
}

function fuzzyAutocomplete(options: string[] | object, focusedValue: string) {
	const choices = Array.isArray(options)
		? options.map((el: string) => el.toProperCase())
		: Object.values(options).map((el: string) => el.toLowerCase());

	let filtered = choices.filter((choice) => choice.toLowerCase().startsWith(focusedValue) || focusedValue.startsWith(choice));
	if (filtered.length === 0)
		filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue) || focusedValue.includes(choice.toLowerCase()));
	return filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25);
}
