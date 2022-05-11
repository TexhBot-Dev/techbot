import './lib/setup.js';

import { PepeClient } from './lib/structures/pepeClient.js';
import { Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';

const client = new PepeClient({
	intents: [Intents.FLAGS.GUILDS],
	loadDefaultErrorListeners: true,
	logger: {
		level: LogLevel.Info
	}
});

try {
	await client.login();
} catch (err) {
	console.error(err);
}

process.on('SIGINT', async () => {
	await client.destroy();
	return process.exit(1);
});
