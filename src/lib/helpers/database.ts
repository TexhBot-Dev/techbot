import type { Inventory, ItemNames, User, Guild, ItemMetaData } from '@prisma/client';
import type { User as DiscordUser, Guild as DiscordGuild } from 'discord.js';
import { container } from '@sapphire/framework';

export const fetchItemMetaData = async (itemName: ItemNames): Promise<ItemMetaData> => {
	return (await container.prisma.itemMetaData.findFirst({
		where: {
			name: itemName
		}
	})) as ItemMetaData;
};

export const fetchUserInventories = async (user: DiscordUser): Promise<Inventory[]> => {
	return container.prisma.inventory.findMany({
		where: {
			userID: user.id
		}
	});
};

export const fetchUserInventory = async (user: DiscordUser, itemID: ItemNames): Promise<Inventory> => {
	const inv = await container.prisma.inventory.findFirst({
		where: {
			userID: user.id,
			itemID
		}
	});

	if (inv === null) {
		throw new Error('User does not have this item');
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
