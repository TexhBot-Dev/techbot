import type { CommandOptions } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { CommandInteraction, Guild, GuildMember, Interaction, InteractionReplyOptions, MessageEmbed, User, WebhookClient } from 'discord.js';
import { generateEmbed, noop } from '#lib/helpers';
import { randomUUID } from 'node:crypto';

/**
 * User error builder.
 */
export class UserError {
	private responseEmbed!: MessageEmbed;
	private type!: string;
	private context: CommandInteraction | Interaction;
	private readonly id = randomUUID();

	/**
	 * Construct this user error.
	 * @param interaction The interaction to reply to.
	 */
	public constructor(interaction: CommandInteraction | Interaction) {
		this.context = interaction;
	}

	/**
	 * Sets the response which will be sent to the user.
	 * @note The response will be ephemeral by default.
	 */
	public sendResponse(response: InteractionReplyOptions): UserError {
		if (!this.context || !this.context.isRepliable()) return this;

		const embed = response.embeds![0];
		if (!embed || !response) return this;
		this.responseEmbed = embed as MessageEmbed;

		if (embed) {
			embed.footer = {
				text: `ID: ${this.id} | Type: ${this.type ?? 'UNKNOWN'}`
			};
		}

		response.embeds ??= undefined;
		response.components ??= [];
		response.ephemeral ??= true;

		void this.context.reply(response);

		return this;
	}

	public setType(type: string): UserError {
		this.type = type;
		return this;
	}

	public sendInternalReport(report: InternalReport): UserError {
		const webhook = new WebhookClient({
			id: process.env.ERROR_HANDLER_WEBHOOK_ID!,
			token: process.env.ERROR_HANDLER_WEBHOOK_TOKEN!,
			url: process.env.ERROR_HANDLER_WEBHOOK_URL!
		});

		webhook
			.send({
				embeds: [
					generateEmbed(
						report.title || this.responseEmbed.title || 'Error',
						`${report.rawError ? codeBlock('', `\n\n${String(report.rawError).truncate(1000)}`) : ''}\n\nThis error was thrown by ${
							report.command?.name || 'an unknown command'
						}.${report.user ? `\nThe user who ran the failed command was ${report.user.id}.` : ''}${
							report.guild ? `\nThis error occurred in the guild ${report.guild.id} (${report.guild.name}).` : ''
						}\n\`${report.message ?? this.responseEmbed.description ?? 'No message provided.'}\``,
						'RED'
					).setFooter({ text: `ID: ${this.id} | Type: ${this.type ?? 'UNKNOWN'}` })
				]
			})
			.catch(() => noop);

		return this;
	}
}

interface InternalReport {
	message?: string;
	title?: string;
	command?: CommandOptions;
	user?: User | GuildMember;
	guild?: Guild;
	rawError?: any;
}
