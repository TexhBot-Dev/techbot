import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

export class PremiumPrecondition extends Precondition {
	public async chatInputRun(interaction: CommandInteraction) {
		const userData = await this.container.prisma.user.findFirst({
			where: {
				id: interaction.user.id
			}
		});
		if (userData === null) return this.error({ message: 'Unable to fetch user, defaulting to not premium.' })
		return userData.premium
			? this.ok()
			: this.error({ message: 'You need to be a premium user to use this command.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		isPremium: never;
	}
}
