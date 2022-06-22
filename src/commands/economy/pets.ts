import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { PetTypes } from '@prisma/client';
import { isNullish } from '@sapphire/utilities';
import { fetchPetMetaData, subtractFromWallet } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'pets',
	description: 'Lets your manage your pets.',
	detailedDescription: '/pet'
})
export default class PetCommands extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const subcommand = interaction.options.getSubcommand(true);

		switch (subcommand) {
			case 'buy':
				return this.buy(interaction);
			case 'feed':
				return this.feed(interaction);
			default:
				return interaction.reply(`${subcommand} is not a valid subcommand.`);
		}
	}

	public async buy(interaction: CommandInteraction) {
		const petToBuy = interaction.options.getString('petToBuy', true);
		if (isNullish(PetTypes[petToBuy as PetTypes])) {
			return interaction.reply('Invalid pet type.');
		}
		const petName = interaction.options.getString('petName', true);
		await this.container.prisma.pet.create({
			data: {
				name: petName,
				petType: PetTypes[petToBuy as PetTypes],
				userID: interaction.user.id,
				lastFed: new Date()
			}
		});

		const petMetaData = await fetchPetMetaData(petToBuy as PetTypes);
		await subtractFromWallet(interaction.user, petMetaData.price);

		return interaction.reply(`You bought a ${petToBuy.toTitleCase()} named ${petName} for ${petMetaData.price}.`);
	}

	public async feed(interaction: CommandInteraction) {
		const petToFeed = interaction.options.getString('petToFeed', true);
		const pet = await this.container.prisma.pet.findFirst({
			where: {
				name: petToFeed,
				userID: interaction.user.id
			}
		});
		if (isNullish(pet)) {
			return interaction.reply('You do not own a pet with that name.');
		}
		await subtractFromWallet(interaction.user, 500);
		await this.container.prisma.pet.update({
			where: {
				userID_petType: {
					userID: interaction.user.id,
					petType: pet.petType
				}
			},
			data: {
				lastFed: new Date()
			}
		});

		return interaction.reply(`You fed ${petToFeed.toTitleCase()}.`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('buy')
							.setDescription('Buy a pet.')
							.addStringOption((option) => {
								return option.setName('pet_to_buy').setDescription('The pet you want to buy.').setAutocomplete(true);
							});
					})
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('feed')
							.setDescription('Feed a pet.')
							.addStringOption((option) => {
								return option.setName('pet_to_feed').setDescription('The pet you want to feed.').setAutocomplete(true);
							});
					}),
			{
				idHints: ['977784389121499205']
			}
		);
	}
}
