import '#lib/setup';
import { TechBotClient } from '#lib/structures/techBotClient';

import { Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';

export const client = new TechBotClient({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
	loadDefaultErrorListeners: true,
	logger: {
		level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug
	}
});

client.login(process.env.DISCORD_TOKEN).catch((err) => console.error);

process.on('SIGINT', async () => {
	await client.destroy();
	return process.exit(1);
});
