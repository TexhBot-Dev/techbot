import { Precondition } from '@sapphire/framework';
import { fetchUser } from '../lib/helpers';
import type { CommandInteraction } from 'discord.js';

export class PremiumPrecondition extends Precondition {
	public async chatInputRun(interaction: CommandInteraction) {
		return (await fetchUser(interaction.user)).premium
			? this.ok()
			: this.error({ message: 'You need to be a premium user to use this command.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		isPremium: never;
	}
}
