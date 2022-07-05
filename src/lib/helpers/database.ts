import type { Guild, Inventory, ItemMetaData, ItemNames, PetMetaData, User, PetTypes, Pet } from '@prisma/client';
import type { Guild as DiscordGuild, User as DiscordUser } from 'discord.js';
import { container, UserError } from '@sapphire/framework';

/**
 * Fetches pet metadata.
 * @param petRaceName The type of pet to fetch.
 */
export const fetchPetMetaData = async (petRaceName: PetTypes): Promise<PetMetaData> => {
	return (await container.prisma.petMetaData.findFirst({
		where: {
			type: petRaceName
		}
	})) as PetMetaData;
};

/**
 * Fetches a user's pets.
 * @param user The user to fetch the pets of.
 */
export const fetchUserPets = async (user: DiscordUser): Promise<Pet[]> => {
	return container.prisma.pet.findMany({
		where: {
			userID: user.id
		}
	});
};

/**
 * Fetches an item's metadata.
 * @param itemName The item to fetch.
 */
export const fetchItemMetaData = async (itemName: ItemNames): Promise<ItemMetaData> => {
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

/**
 * Fetches a user's inventory.
 * @param user The user to fetch the inventory of.
 */
export const fetchUserInventories = async (user: DiscordUser): Promise<Inventory[]> => {
	return container.prisma.inventory.findMany({
		where: {
			userID: user.id
		}
	});
};

/**
 * Fetch a item from the user's inventory.
 * @param user The user to fetch the inventory of.
 * @param itemID The item to get data for.
 */
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

/**
 * Fetch a user from the database.
 * @param user The user to fetch.
 */
export const fetchUser = async (user: DiscordUser): Promise<User> => {
	const userData = await container.prisma.user.findFirst({
		where: {
			id: user.id
		}
	});

	// Create new user in database if they don't exist.
	if (userData === null)
		return await container.prisma.user.create({
			data: {
				id: user.id
			}
		});

	return userData;
};

/**
 * Fetches a guild from the database.
 * @param guild The guild to fetch.
 */
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
