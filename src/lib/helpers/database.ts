import type { Inventory, ItemNames, User } from '@prisma/client';
import type { User as DiscordUser, Guild as DiscordGuild } from 'discord.js';
import { container } from '@sapphire/framework';

export const fetchUserInventories = async (user: DiscordUser): Promise<Inventory[]> => {
	return await container.prisma.inventory.findMany({
		where: {
			userID: user.id
		}
	});
};

export const fetchUserInventory = async (user: DiscordUser, itemID: ItemNames): Promise<Inventory | null> => {
	return await container.prisma.inventory.findFirst({
		where: {
			userID: user.id,
			itemID
		}
	});
};

export const fetchUser = async (user: DiscordUser): Promise<User | null> => {
	return await container.prisma.user.findFirst({
		where: {
			id: user.id
		}
	});
};
