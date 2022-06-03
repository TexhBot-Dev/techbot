import type { Guild, Inventory, ItemMetaData, ItemNames, PetMetaData, User, PetTypes, Pet } from '@prisma/client';
import type { Guild as DiscordGuild, User as DiscordUser } from 'discord.js';
import { container, UserError } from '@sapphire/framework';

export const fetchPetMetaData = async (petRaceName: PetTypes): Promise<PetMetaData> => {
	return (await container.prisma.petMetaData.findFirst({
		where: {
			type: petRaceName
		}
	})) as PetMetaData;
};

export const fetchUserPets = async (user: DiscordUser): Promise<Pet[]> => {
	return container.prisma.pet.findMany({
		where: {
			userID: user.id
		}
	});
};

export const fetchItemMetaData = async (itemName: ItemNames) => {
	const itemMetaData = await container.prisma.itemMetaData.findFirst({
		where: {
			name: itemName
		}
	});

	if (itemMetaData === null) {
		throw new UserError({
			identifier: 'item-not-found',
			message: `The item ${itemName} does not exist.`,
			context: {
				itemName
			}
		});
	}

	return itemMetaData;
};

export const fetchUserInventories = async (user: DiscordUser): Promise<Inventory[]> => {
	return container.prisma.inventory.findMany({
		where: {
			userID: user.id
		}
	});
};

export const fetchUserInventory = async (user: DiscordUser, itemID: ItemNames): Promise<Inventory | null> => {
	const inv = await container.prisma.inventory.findFirst({
		where: {
			userID: user.id,
			itemID
		}
	});

	if (inv === null) {
		return null;
	}

	return inv;
};

export const fetchUser = async (user: DiscordUser): Promise<User> => {
	// Fetch User data and create if it doesn't exist
	let userData = await container.prisma.user.findFirst({
		where: {
			id: user.id
		}
	});

	if (userData === null) {
		userData = await container.prisma.user.create({
			data: {
				id: user.id
			}
		});
	}

	return userData;
};

export const fetchGuild = async (guild: DiscordGuild): Promise<Guild> => {
	let guildData = await container.prisma.guild.findFirst({
		where: {
			id: guild.id
		}
	});

	if (guildData === null) {
		guildData = await container.prisma.guild.create({
			data: {
				id: guild.id
			}
		});
	}

	return guildData;
};
