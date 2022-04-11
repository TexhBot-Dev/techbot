import type { User } from 'discord.js';
import { container } from '@sapphire/framework';

export const updateWallet = async (user: User, amount: number) => {
	if (amount < 0) throw new Error('Amount must be positive');
	await container.prisma.$executeRaw`
		UPDATE user
		SET money = money + ${amount}
		WHERE id = ${user.id}
	`;
	return;
};
