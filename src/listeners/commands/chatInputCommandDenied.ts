import type { ChatInputCommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import { generateErrorEmbed } from '../../lib/utils';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	private static humanizeTime(duration: number): string {
		const portions: string[] = [];

		const msInHour = 1000 * 60 * 60;
		const hours = Math.trunc(duration / msInHour);
		if (hours > 0) {
			portions.push(hours + 'h');
			duration = duration - hours * msInHour;
		}

		const msInMinute = 1000 * 60;
		const minutes = Math.trunc(duration / msInMinute);
		if (minutes > 0) {
			portions.push(minutes + 'm');
			duration = duration - minutes * msInMinute;
		}

		const seconds = Math.trunc(duration / 1000);
		if (seconds > 0) {
			portions.push(seconds + 's');
		}

		return portions.join(' ');
	}

	public async run({
						 context,
						 message: content,
						 identifier
					 }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		if (identifier === 'preconditionCooldown') {
			const { remaining } = context as { remaining: number };
			const humanizedRemaining = UserEvent.humanizeTime(remaining);

			const cooldownEmbed = generateErrorEmbed(
				`You can only use this command every ${humanizedRemaining}`,
				identifier
			);

			return interaction.reply({ embeds: [cooldownEmbed] });
		}

		return interaction.reply({ content, allowedMentions: { users: [interaction.user.id], roles: [] } });
	}
}
