import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import {fetch, FetchResultTypes} from "@sapphire/fetch";

@ApplyOptions<CommandOptions>({
	name: 'dog',
	description: 'Shows a cute dog image.',
	detailedDescription: 'dog'
})
export default class DogCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const dogEmbed = new MessageEmbed();
		const dog = (await fetch<Dog[]>('https://api.thedogapi.com/v1/images/search', FetchResultTypes.JSON))[0];

		dogEmbed.setImage(dog.url);

		if (dog.breeds !== null && dog.breeds !== undefined) {
			dogEmbed.setFooter({
				text: `Breed: ${dog.breeds[0].name} | life-span: ${dog.breeds[0].life_span} | Temperament: ${dog.breeds[0].temperament}`
			});
		}
		return interaction.reply({ embeds: [dogEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description)
		);
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