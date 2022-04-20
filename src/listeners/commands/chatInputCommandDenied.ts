import type { ChatInputCommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import { generateErrorEmbed } from '../../lib/helpers/embed';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public async run({ context, message: content, identifier }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		if (identifier === 'preconditionCooldown') {
			const { remaining } = context as { remaining: number };
			const humanizedRemaining = `<t:${Math.floor((Date.now() + remaining) / 1000)}:R>`;

			const cooldownEmbed = generateErrorEmbed(`You can only use this command every ${humanizedRemaining}`, identifier);

			return interaction.reply({ embeds: [cooldownEmbed] });
		}

		return interaction.reply({ content, allowedMentions: { users: [interaction.user.id], roles: [] } });
	}
}
