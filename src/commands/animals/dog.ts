import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { isNullOrUndefined } from '@sapphire/utilities';
import { generateEmbed } from '../../lib/helpers/embed';

@ApplyOptions<CommandOptions>({
	name: 'dog',
	description: 'Shows a cute dog image.',
	detailedDescription: 'dog'
})
export default class DogCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const dog = (await fetch<Dog[]>('https://api.thedogapi.com/v1/images/search', FetchResultTypes.JSON))[0];
		const dogEmbed = generateEmbed('Dog', '', 'BLUE', {
			image: {
				url: dog.url,
				height: dog.height,
				width: dog.width
			}
		});

		if (!isNullOrUndefined(dog.breeds) && dog.breeds.length > 0) {
			dogEmbed.setFooter({
				text: `Breed: ${dog.breeds[0].name} | life-span: ${dog.breeds[0].life_span} | Temperament: ${dog.breeds[0].temperament}`
			});
		}
		return interaction.reply({ embeds: [dogEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645460860223510']
		});
	}
}

type Dog = {
	breeds?: BreedsEntityDog[] | null;
	id: string;
	url: string;
	width: number;
	height: number;
};
type BreedsEntityDog = {
	weight: WeightOrHeightDog;
	height: WeightOrHeightDog;
	id: number;
	name: string;
	bred_for: string;
	breed_group: string;
	life_span: string;
	temperament: string;
	reference_image_id: string;
};
type WeightOrHeightDog = {
	imperial: string;
	metric: string;
};
