import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { fetchUser } from '../lib/helpers';

export class PremiumPrecondition extends Precondition {
	public async chatInputRun(interaction: CommandInteraction) {
		const userData = await fetchUser(interaction.user);
		return userData.premium ? this.ok() : this.error({ message: 'You need to be a premium user to use this command.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		isPremium: never;
	}
}
