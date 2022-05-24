import '#lib/setup';
import { TechBotClient } from '#lib/structures/techBotClient';

import { Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';

export const client = new TechBotClient({
	intents: [Intents.FLAGS.GUILDS],
	loadDefaultErrorListeners: true,
	logger: {
		level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug
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
