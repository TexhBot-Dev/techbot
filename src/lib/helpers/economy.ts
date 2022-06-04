import type { User } from 'discord.js';
import { container } from '@sapphire/framework';
import { isSafeInteger } from '#lib/helpers';
import type { ItemNames } from '@prisma/client';

/**
 * Adds to a user's balance.
 * @param user The user to add money to.
 * @param amount The amount of money to add.
 * @returns The number of rows affected.
 */
export const addToWallet = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer.');
	return container.prisma.user.upsert({
		where: {
			id: user.id
		},
		update: {
			wallet: {
				increment: amount
			}
		},
		create: {
			id: user.id,
			wallet: amount
		}
	});
};

/**
 * @param user The user to remove money from.
 * @param amount The amount of money to remove.
 * @returns The number of rows affected.
 */
export const addToBank = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer.');
	return container.prisma.user.upsert({
		where: {
			id: user.id
		},
		update: {
			bank: {
				increment: amount
			}
		},
		create: {
			id: user.id,
			bank: amount
		}
	});
};

/**
 * Subtracts money from the user's wallet.
 * ```ts
 *	const dbUser = await fetchUser(interaction.user);
 *	subtractFromWallet(dbUser, 100).then(() => { interaction.reply(`You now have ${dbUser.wallet} coins in your wallet.`); }).catch(() => noop);
 * ```
 * @param user
 * @param amount
 * @return number The number of rows affected
 */
export const subtractFromWallet = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return container.prisma.user.upsert({
		where: {
			id: user.id
		},
		update: {
			wallet: {
				decrement: amount
			}
		},
		create: {
			id: user.id
		}
	});
};

/**
 * Subtracts from a user's bank
 * @param user The user to remove money from.
 * @param amount The amount of money to remove.
 * @return number The number of rows affected
 */
export const subtractFromBank = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return container.prisma.user.upsert({
		where: {
			id: user.id
		},
		update: {
			bank: {
				decrement: amount
			}
		},
		create: {
			id: user.id
		}
	});
};

/**
 * Add a number of items to a user's inventory.
 * @param user The user to add items to.
 * @param name The name of the item to add.
 * @param amount The amount of items to add.
 * @returns The user's inventory.
 */
export const incrementItemCount = async (user: User, name: ItemNames, amount = 1) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return container.prisma.inventory.upsert({
		where: {
			userID_itemID: {
				itemID: name,
				userID: user.id
			}
		},
		update: {
			count: {
				increment: amount
			}
		},
		create: {
			itemID: name,
			count: amount,
			userID: user.id
		}
	});
};

/**
 * Remove a number of items to a user's inventory.
 * @param user The user to remove items from.
 * @param name The name of the item to remove.
 * @param amount The amount of items to remove.
 * @returns The user's inventory.
 */
export const decrementItemCount = async (user: User, name: ItemNames, amount = 1) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return container.prisma.inventory.upsert({
		where: {
			userID_itemID: {
				itemID: name,
				userID: user.id
			}
		},
		update: {
			count: {
				decrement: amount
			}
		},
		create: {
			itemID: name,
			count: amount,
			userID: user.id
		}
	});
};
