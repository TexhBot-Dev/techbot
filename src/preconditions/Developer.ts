import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

export class DeveloperPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const OWNERS = process.env.OWNERS?.split(',') ?? [];
		return OWNERS.includes(interaction.user.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Developer: never;
	}
}
