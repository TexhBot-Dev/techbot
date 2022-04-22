import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

export class PremiumPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return interaction.inGuild() ? this.ok() : this.error({ message: 'You need to be in a guild to use this command.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		guildOnly: never;
	}
}
