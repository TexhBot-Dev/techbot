import { PrismaClient } from '@prisma/client';
import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export class PepeClient extends SapphireClient {
	public constructor(options: ClientOptions) {
		super(options);

		container.prisma = new PrismaClient({
			errorFormat: 'pretty'
		});
		container.client = this;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
	}
}
