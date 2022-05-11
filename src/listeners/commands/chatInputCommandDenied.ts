import type { ChatInputCommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import { generateErrorEmbed } from '../../lib/helpers/embed.js';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public async run({ context, message: content, identifier }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		if (identifier === 'preconditionCooldown') {
			const { remaining } = context as { remaining: number };
			const humanizedRemaining = (style: string) => `<t:${Math.floor((Date.now() + remaining) / 1000)}:${style}>`;

			const cooldownEmbed = generateErrorEmbed(`You can use this command ${humanizedRemaining('R')} (${humanizedRemaining('f')}).`, 'Cooldown');

			return void interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
		}

		if (identifier === 'guildOnly') {
			return void interaction.reply({
				embeds: [generateErrorEmbed('Please use this command in a server.', 'Guild Only Command')],
				ephemeral: true
			});
		}

		return interaction.reply({ content, allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true });
	}
}
