import type { User } from 'discord.js';
import { container } from '@sapphire/framework';
import { isSafeInteger } from '#lib/helpers';
import type { ItemNames } from '@prisma/client';

/**
 * Adds to a user's balance.
 * @param user
 * @param amount
 * @return number The number of rows affected
 */
export const addToWallet = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
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
 *
 * @param user
 * @param amount
 * @return number The number of rows affected
 */
export const addToBank = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
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
 * Subtracts from the user's wallet.
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
 * @param user
 * @param amount
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

export const decrementItemCount = async (user: User, name: ItemNames, amount = 1) => {
	if (isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
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
