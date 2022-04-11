import './lib/setup';

import { PepeClient } from './lib/pepeClient';
import { Intents } from 'discord.js';

const client = new PepeClient({
	intents: [Intents.FLAGS.GUILDS],
	loadDefaultErrorListeners: true
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
