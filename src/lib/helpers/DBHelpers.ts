import { Inventory } from '../entities/economy/inventory';
import { Item } from '../entities/economy/item';
import { User as DBUser } from '../entities/economy/user';
import { Guild as DBGuild } from '../entities/guild';
import type { Guild as DiscordGuild, User as DiscordUser} from 'discord.js';
import { isSafeInteger } from './numberHelpers';

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
