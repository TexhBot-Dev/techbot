import type { Guild as DBGuild, Item, ItemType, User as DBUser } from '@prisma/client';
import type { Guild as DiscordGuild, User as DiscordUser } from 'discord.js';
import { isSafeInteger } from './numberHelpers';
import { container } from '@sapphire/framework';

/**
 * Parses Strings/Numbers for use with DBUser
 * @param amount
 * @param user
 * @param useWallet
 *
 * @example
 * parseInt('1') // 1
 */
export const parseAmount = (amount: string | number, user: DBUser, useWallet: boolean = true): number => {
	amount = String(amount).toLowerCase().replace(/\+/gi, '');

	if (useWallet) {
		if (amount === 'all') return user.wallet;
		if (amount === 'half') return Math.trunc(user.wallet / 2);
		if (amount === 'third') return Math.trunc(user.wallet / 3);
		if (amount === 'quarter' || amount === 'fourth') return Math.trunc(user.wallet / 4);
	} else {
		if (amount === 'all') return user.bank;
		if (amount === 'half') return Math.trunc(user.bank / 2);
		if (amount === 'third') return Math.trunc(user.bank / 3);
		if (amount === 'quarter' || amount === 'fourth') return Math.trunc(user.bank / 4);
	}

	if (/^([+])?(\d+)\.?(\d*)[eE]([+]?\d+)$/.test(amount)) return Math.trunc(Number(amount));
	if (isNaN(parseInt(amount))) return parseInt(amount.replace(/[^0-9]/g, ''));
	if (!isNaN(parseInt(amount))) return parseInt(amount);
	return 0;
};

/**
 * Fetches items by name
 * @param name
 *
 * @example
 * const item = await fetchItem('apple');
 * console.log(item.name) // 'apple'
 */
export const fetchItemByName = async (name: ItemType['name']): Promise<ItemType | null> => {
	const item = await container.prisma.itemType.findFirst({ where: { name } });
	if (item === null) {
		throw new Error(`Item with name ${name} not found`);
	}
	return item;
};

/**
 * Fetches Users data from the DB
 * @param user
 *
 * @example
 * const user = await fetchUser(message.author);
 */
export const fetchUser = async (user: DiscordUser): Promise<DBUser> => {
	// Look for user if it doesn't already exist make new one and return
	let userData = await container.prisma.user.findFirst({ where: { id: user.id } });

	if (userData === null) {
		userData = await container.prisma.user.create({
			data: {
				id: user.id,
				wallet: 0,
				bank: 0
			}
		});
	}
	if (!isSafeInteger(userData.wallet) || !isSafeInteger(userData.bank)) {
		userData = await container.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				wallet: 0,
				bank: 0
			}
		});
	}
	return userData;
};

/**
 * Fetches a Users' Inventory
 * @param user
 *
 * @example
 * const inventory = await fetchInventory(message.author);
 * console.log(inventory.amount) // 1
 */
export const fetchInventories = async (user: DiscordUser): Promise<Item[]> => {
	return await container.prisma.item.findMany({
		where: {
			userID: user.id
		}
	});
};

/**
 * Fetches a Guilds Data from the DB
 * @param guild
 *
 * @example
 * const guildData = await fetchGuild(message.guild);
 * console.log(guildData.id) // '!'
 */
export const fetchGuild = async (guild: DiscordGuild): Promise<DBGuild> => {
	if (guild === null) {
		throw new Error('Guild is undefined');
	}
	let guildData = await container.prisma.guild.findFirst({ where: { id: guild.id } });
	if (guildData === null) {
		guildData = await container.prisma.guild.create({
			data: {
				id: guild.id,
				slotsMoneyPool: 0,
				slotsWinMultiplier: 0
			}
		});
	}
	return guildData;
};
