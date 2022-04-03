import { PrismaClient } from '@prisma/client';
import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export class PepeClient extends SapphireClient {
	public constructor(options: ClientOptions) {
		super(options);

		container.prisma = new PrismaClient({
			errorFormat: 'pretty',
			log: ['query']
		});
		container.client = this;
	}

	public async destroy() {
		await super.destroy();
		await container.prisma.$disconnect().then(() => {
			this.logger.info('Disconnected from Prisma');
		});

		this.logger.info('Goodbye from PepeClient');
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
	}
}
