import type { User } from 'discord.js';
import { container } from '@sapphire/framework';

export const updateWallet = async (user: User, amount: number) => {
	if (amount < 0) throw new Error('Amount must be positive');
	return container.prisma.$executeRaw`
		UPDATE "User"
		SET wallet = wallet + ${amount}
		WHERE id = ${user.id}
	`;
};

export const updateBank = async (user: User, amount: number) => {
	if (amount < 0) throw new Error('Amount must be positive');
	return await container.prisma.$executeRaw`
		UPDATE "User"
		SET bank = bank + ${amount}
		WHERE id = ${user.id}
	`;
};
