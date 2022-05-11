import { PrismaClient } from '@prisma/client';
import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export class PepeClient extends SapphireClient {
	public constructor(options: ClientOptions) {
		super(options);

		container.prisma = new PrismaClient({
			errorFormat: 'pretty'
		});
	}

	public override async login(token?: string): Promise<string> {
		container.logger.info('Connecting to database...');
		await container.prisma.$connect();

		this.logger.info('Logging in to discord...');
		return super.login(token);
	}

	public override async destroy() {
		try {
			await container.prisma.$disconnect();
		} catch {}

		return super.destroy();
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
	}
}
