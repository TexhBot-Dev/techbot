import './lib/setup';

import { PepeClient } from './lib/pepeClient';
import { Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';

const client = new PepeClient({
	intents: [Intents.FLAGS.GUILDS],
	loadDefaultErrorListeners: true,
	logger: {
		level: LogLevel.Info
	}
});

(async () => {
	try {
		await client.login();
	} catch (err) {
		console.error(err);
	}
})();

process.on('SIGINT', async () => {
	await client.destroy();
	process.exit(1);
});
