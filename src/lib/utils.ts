import { send } from '@sapphire/plugin-editable-commands';
import {Message, MessageEmbed, Guild as DiscordGuild, User as DiscordUser, ColorResolvable} from 'discord.js';
import { RandomLoadingMessage } from './constants';
import { Inventory } from './entities/economy/inventory';
import { Item } from './entities/economy/item';
import { User as DBUser } from './entities/economy/user';
import { Guild as DBGuild } from './entities/guild';
import type {SapphireClient} from "@sapphire/framework";

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export const pickRandom = <T>(array: readonly T[]): T =>{
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export const sendLoadingMessage = (message: Message): Promise<typeof message>  => {
	return send(message, { embeds: [new MessageEmbed().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
}

/**
 * Determines if a provided integer is safe
 * @param value
 *
 * @example
 * isSafeInteger(1) // true
 *
 * @example
 * isSafeInteger(-1) // false
 */
export const isSafeInteger = (value: number): boolean => {
	value = Math.floor(value);

	if (!Number.isSafeInteger(value)) {
		return false;
	}
	if (value < 0) {
		return false;
	}
	return value <= 1000000000000;
}

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
 */
export const fetchItemByName = (name: string): Promise<Item> => {
	const item = Item.findOne({ where: { name: name } });
	if (item === undefined) {
		throw new Error(`Item with name ${name} not found`);
	}
	return item as Promise<Item>;
};

/**
 * Fetches Users
 * @param user
 *
 * @example
 * const user = await fetchUser(message.author);
 */
export const fetchUser = async (user: DiscordUser): Promise<DBUser> => {
	// Look for user if doesn't already exist make new one and return
	let userData = await DBUser.findOne({ where: { id: user.id } });
	if (userData === undefined) {
		userData = new DBUser();
		userData.id = user.id;
		userData.wallet = 0;
		userData.bank = 0;
		await userData.save();
	}
	if (!isSafeInteger(userData.wallet) || !isSafeInteger(userData.bank)) {
		userData.wallet = 0;
		userData.bank = 0;
		await userData.save();
	}
	return userData;
};

/**
 * Fetchers A Users Inventory
 * @param user
 * @param item
 *
 * @example
 * const inventory = await fetchInventory(message.author, await fetchItemByName('apple'));
 */
export const fetchInventory = async (user: DiscordUser, item: Item): Promise<Inventory> => {
	const userData = await fetchUser(user);
	let inventory = await Inventory.findOne({ where: { userId: userData.id, itemID: item.id } });
	if (inventory === undefined) {
		inventory = new Inventory();
		inventory.userId = user.id;
		inventory.itemID = item.id;
		inventory.amount = 0;
		await inventory.save();
	}
	return inventory;
};

/**
 * Fetchers a Users information from the DB
 * @param guild
 *
 * @example
 * const guildData = await fetchGuild(message.guild);
 */
export const fetchGuild = async (guild: DiscordGuild): Promise<DBGuild> => {
	if (guild === undefined) {
		throw new Error('Guild is undefined');
	}
	let guildData = await DBGuild.findOne({ where: { id: guild.id } });
	if (guildData === undefined) {
		guildData = new DBGuild();
		guildData.id = guild.id;
		guildData.prefix = '-';
		guildData.slotsMoneyPool = 0;
		guildData.slotsWinMultiplier = 0;
		await guildData.save();
	}
	return guildData;
};

/**
 * Generates an error embed
 * @param error
 * @param errorType
 */
export const generateErrorEmbed = (error: string, errorType: string = ''): MessageEmbed => {
	const errType = errorType !== '' ? `: ${errorType}` : '';

	return new MessageEmbed()
		.setColor('#ED4245')
		.setTitle(`Error${errType}`)
		.setDescription(error);
};

/**
 * Generates an embed
 * @param description
 * @param title
 * @param color
 */
export const generateEmbed = (
	description: string,
	title: string,
	color: ColorResolvable = 'BLUE'
): MessageEmbed => {
	return new MessageEmbed().setColor(color).setTitle(title).setDescription(description);
};

/**
 * Cleans text of naughty stuff
 * @param text
 * @param client
 */
export const clean = (text: string, client: SapphireClient): string => {
	return text
		.replace(/@everyone|@here|<@&?(\d{17,19})>/gim, '<mention>')
		.replace(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gim, '<link>')
		.replaceAll(client.token as string, '');
};

/**
 * Replaces stuff in text
 * @param string
 * @param object
 * @param regexFlag
 */
export const replacer = (string: string, object: object, regexFlag: string = ''): string => {
	for (const [key, value] of Object.entries(object)) {
		let reg = new RegExp(key, regexFlag);
		string = string.replace(reg, value);
	}
	return string;
};

export const pluralize = (text: string, num: number, suffix: string = 's'): string => {
	return text + (num !== 1 ? suffix : '');
};
