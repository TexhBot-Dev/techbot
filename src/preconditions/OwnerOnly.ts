import { Precondition } from '@sapphire/framework';
import { envParseArray } from '../lib/env-parser';
import type { CommandInteraction } from "discord.js";

const OWNERS = envParseArray('OWNERS');

export class UserPrecondition extends Precondition {
	public async chatInputRun(interation: CommandInteraction) {
		return OWNERS.includes(interation.user.id) ? this.ok() : this.error({ message: 'This command can only be used by the owner.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}
