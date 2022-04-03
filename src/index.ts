import './lib/setup';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { PrismaClient } from '@prisma/client';

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient;
	}
}

const client = new SapphireClient({
	defaultPrefix: 'dr!',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	loadDefaultErrorListeners: true,
	logger: {
		level: LogLevel.Info
	},
	shards: 'auto',
	intents: ['GUILDS', 'GUILD_INTEGRATIONS']
});

(async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');

		container.prisma = new PrismaClient();
	} catch (error) {
		client.logger.fatal(error);
		await client.destroy();
		await container.prisma.$disconnect();
		process.exit(1);
	}
})();
