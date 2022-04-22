import './lib/setup';

import { PepeClient } from './lib/pepeClient';
import { Intents } from 'discord.js';
import { ApplicationCommandRegistries, LogLevel, RegisterBehavior } from '@sapphire/framework';

const client = new PepeClient({
	intents: [Intents.FLAGS.GUILDS],
	loadDefaultErrorListeners: true,
	logger: {
		level: LogLevel.Info
	}
});
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

void (async () => {
	try {
		await client.login();
	} catch (err) {
		console.error(err);
	}
})();

process.on('SIGINT', () => {
	client.destroy();
	process.exit(1);
});
