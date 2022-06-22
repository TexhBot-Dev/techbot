import type { CommandInteraction } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { generateEmbed } from '#lib/helpers';

/**
 * Returns a random image of a dog.
 */
export const dog = async (interaction: CommandInteraction) => {
	const headers: HeadersInit = {
		'X-API-Key': process.env.THE_DOG_API_KEY!
	};

	// Create query string
	const queryParams = new URLSearchParams([
		['limit', '1'],
		['size', 'small'],
		['mime_types', 'jpg,png'],
		['has_breeds', 'true'],
		['sub_id', interaction.user.id]
	]).toString();
	const dog = (await fetch<Dog[]>(`https://api.thedogapi.com/v1/images/search?${queryParams}`, { headers }, FetchResultTypes.JSON))[0];
	const dogEmbed = generateEmbed('Dog', '', 'BLUE')
		.setImage(dog.url)
		.setFooter({
			text: `Breed: ${dog.breeds[0].name} | life-span: ${dog.breeds[0].life_span} | Temperament: ${dog.breeds[0].temperament}`
		});

	return interaction.reply({ embeds: [dogEmbed] });
};

export interface Dog {
	breeds: Breed[];
	id: string;
	url: string;
	width: number;
	height: number;
}

export interface Breed {
	weight: Eight;
	height: Eight;
	id: number;
	name: string;
	bred_for: string;
	breed_group: string;
	life_span: string;
	temperament: string;
	reference_image_id: string;
}

export interface Eight {
	imperial: string;
	metric: string;
}
