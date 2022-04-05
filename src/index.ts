import './lib/setup';
import { LogLevel } from '@sapphire/framework';
import { PepeClient } from './lib/pepeClient';

const client = new PepeClient({
	caseInsensitiveCommands: true,
	loadDefaultErrorListeners: true,
	logger: {
		level: LogLevel.Info
	},
	shards: 'auto',
	intents: ['GUILDS']
});

(async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		await client.destroy();
	}
})();

process.on('SIGINT', async () => {
	await client.destroy();
	process.exit(1);
});
