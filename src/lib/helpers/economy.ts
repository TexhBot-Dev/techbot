import type { User } from 'discord.js';
import { container } from '@sapphire/framework';
import { isSafeInteger } from './numbers';
import type { ItemNames } from '@prisma/client';

/**
 * Adds to a user's balance.
 * @param user
 * @param amount
 * @return number The number of rows affected
 */
export const addToWallet = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return container.prisma.$executeRaw`
		UPDATE "User"
		SET wallet = wallet + ${amount}
		WHERE id = ${user.id}
	`;
};

/**
 *
 * @param user
 * @param amount
 * @return number The number of rows affected
 */
export const addToBank = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return await container.prisma.$executeRaw`
		UPDATE "User"
		SET bank = bank + ${amount}
		WHERE id = ${user.id}
	`;
};

/**
 * Subtracts from the user's wallet.
 * @param user
 * @param amount
 * @return number The number of rows affected
 */
export const subtractFromWallet = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return container.prisma.$executeRaw`
		UPDATE "User"
		SET wallet = wallet - ${amount}
		WHERE id = ${user.id}
	`;
};

/**
 * Subtracts from a user's bank
 * @param user
 * @param amount
 * @return number The number of rows affected
 */
export const subtractFromBank = async (user: User, amount: number) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return await container.prisma.$executeRaw`
		UPDATE "User"
		SET bank = bank - ${amount}
		WHERE id = ${user.id}
	`;
};

export const incrementItemCount = async (user: User, name: ItemNames, amount = 1) => {
	if (!isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return await container.prisma.$executeRaw`
		UPDATE Inventory
		SET count = count + ${amount}
		WHERE userID = ${user.id}
		AND itemID = ${name}
	`;
};

export const decrementItemCount = async (user: User, name: ItemNames, amount = 1) => {
	if (isSafeInteger(amount)) throw new Error('Amount must be a safe integer');
	return await container.prisma.$executeRaw`
		UPDATE Inventory
		SET count = count - ${amount}
		WHERE userID = ${user.id}
		AND itemID = ${name}
	`;
};
