import type { ApplicationCommandRegistry } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputSubcommandMappings, SubcommandMappingsArray, SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { Milliseconds } from '#root/types/enums/Milliseconds';
import { generateEmbed } from '#lib/helpers';
import { FetchResultTypes, fetch } from '@sapphire/fetch';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<SubCommandPluginCommand.Options>({
	name: 'animal',
	description: 'Shows a cute image of an animal.',
	detailedDescription: '/animal <cat | dog>',
	cooldownDelay: Milliseconds.Second * 10 //10 seconds
})
export default class CatCommand extends SubCommandPluginCommand {
	protected readonly subcommandMappings: SubcommandMappingsArray = [
		new ChatInputSubcommandMappings([
			{
				name: 'dog',
				to: (interaction) => this.dog(interaction)
			},
			{
				name: 'cat',
				to: (interaction) => this.cat(interaction)
			}
		])
	];

	private async dog(interaction: CommandInteraction) {
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
	}

	private async cat(interaction: CommandInteraction) {
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
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((builder) => builder.setName('cat').setDescription('Shows a cute cat image.'))
					.addSubcommand((builder) => builder.setName('dog').setDescription('Shows a cute dog image.')),
			{
				idHints: ['977784735218696242']
			}
		);
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

export interface Dog {
	breeds: Breed[];
	id: string;
	url: string;
	width: number;
	height: number;
}

export interface DogBreed {
	weight: Weight;
	height: Weight;
	id: number;
	name: string;
	bred_for: string;
	breed_group: string;
	life_span: string;
	temperament: string;
	reference_image_id: string;
}
