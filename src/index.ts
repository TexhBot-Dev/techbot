import './lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
	defaultPrefix: 'dr!',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	loadDefaultErrorListeners: true,
	logger: {
		level: LogLevel.Info
	},
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_INTEGRATIONS'
	]
});

(async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
})()