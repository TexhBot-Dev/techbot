import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { generateEmbed } from '../../lib/helpers/index.js';

@ApplyOptions<CommandOptions>({
	name: 'cat',
	description: 'Shows a cute cat image.',
	detailedDescription: 'cat'
})
export default class CatCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const headers: HeadersInit = {
			'X-API-Key': process.env.THE_CAT_API_KEY!
		};

		// Create query string
		const queryParams = new URLSearchParams([
			['limit', '1'],
			['size', 'small'],
			['mime_types', 'jpg,png'],
			['has_breeds', 'true'],
			['sub_id', interaction.user.id]
		]).toString();

		const cat = (
			await fetch<Cat[]>(
				`https://api.thecatapi.com/v1/images/search?${queryParams}`,
				{
					headers
				},
				FetchResultTypes.JSON
			)
		)[0];
		const catEmbed = generateEmbed('Cat', '', 'BLUE')
			.setImage(cat.url)
			.setFooter({
				text: `Breed: ${cat.breeds[0].name}\nLife Span: ${cat.breeds[0].life_span}\nTemperament: ${cat.breeds[0].temperament}`
			});

		return interaction.reply({ embeds: [catEmbed] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645460482723881']
		});
	}
}

export interface Cat {
	breeds: Breed[];
	id: string;
	url: string;
	width: number;
	height: number;
}

export interface Breed {
	weight: Weight;
	id: string;
	name: string;
	temperament: string;
	origin: string;
	country_codes: string;
	country_code: string;
	description: string;
	life_span: string;
	indoor: number;
	alt_names: string;
	adaptability: number;
	affection_level: number;
	child_friendly: number;
	dog_friendly: number;
	energy_level: number;
	grooming: number;
	health_issues: number;
	intelligence: number;
	shedding_level: number;
	social_needs: number;
	stranger_friendly: number;
	vocalisation: number;
	experimental: number;
	hairless: number;
	natural: number;
	rare: number;
	rex: number;
	suppressed_tail: number;
	short_legs: number;
	wikipedia_url: string;
	hypoallergenic: number;
	reference_image_id: string;
}

export interface Weight {
	imperial: string;
	metric: string;
}
