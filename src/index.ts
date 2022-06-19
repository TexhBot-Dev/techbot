import '#lib/setup';
import { TechBotClient } from '#lib/structures/techBotClient';

import { Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';

export const client = new TechBotClient({
	intents: [Intents.FLAGS.GUILDS],
	loadDefaultErrorListeners: true,
	logger: {
		level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug
	},
	api: {
		auth: {
			id: process.env.CLIENT_ID ?? '',
			secret: process.env.CLIENT_SECRET ?? '',
			cookie: 'TECHBOT_AUTH',
			redirect: process.env.REDIRECT_URI ?? 'https://greysilly7.xyz/v1/oauth/callback',
			scopes: ['identity']
		},
		prefix: 'v1/',
		origin: '*',
		listenOptions: {
			port: 4000
		}
	}
});

client.login(process.env.DISCORD_TOKEN);

process.on('SIGINT', async () => {
	await client.destroy();
	return process.exit(1);
});
