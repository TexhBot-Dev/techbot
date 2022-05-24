import { client } from '#root/index';
import type { CommandOptions } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import type { AnyChannel, CommandInteraction, Guild, GuildMember, Interaction, InteractionReplyOptions, TextChannel, User } from 'discord.js';
import { generateEmbed } from '../helpers';

/**
 * User error builder.
 */
export class UserError {
	response!: InteractionReplyOptions;
	type!: ErrorType;
	context!: CommandInteraction | Interaction;
	internalReport!: InternalReport;
	id = crypto.randomUUID();

	public setResponse(response: InteractionReplyOptions): UserError {
		this.response = response;
		return this;
	}

	public setType(type: ErrorType): UserError {
		this.type = type;
		return this;
	}

	public send(): UserError {
		if (!this.context || !this.context.isRepliable() || !this.response) return this;
		if (this.response.embeds) {
			this.response.embeds[0].footer!.text = this.id;
		}

		this.response.embeds ??= undefined;
		this.response.components ??= [];
		this.response.ephemeral ??= true;

		this.context.reply(this.response);
		return this;
	}

	public setInternal(report: InternalReport): UserError {
		this.internalReport = report;
		return this;
	}

	public log(err: any): UserError {
		if (!err) return this;
		console.error(`Error thrown by ${this.id}:`);
		console.log(err);
		return this;
	}

	public sendInternal(): UserError {
		client.channels
			.fetch('977947568204030042')
			.then((ch: AnyChannel | null) => {
				const channel = ch as TextChannel;
				const report = this.internalReport;
				channel.send({
					embeds: [
						generateEmbed(
							report.title || (this.response.embeds ? this.response.embeds[0].description : '') || this.response.content || 'Error',
							`\`${report.message ?? this.response.content ?? 'No message provided.'}\`\n\nThis error was thrown by ${
								report.command?.name || 'an unknown command'
							}.` +
								(report.user ? `\nThe user who ran the failed command was ${report.user.id}` : '') +
								(report.guild ? `\nThis error occurred in the guild ${report.guild.id} (${report.guild.name})` : '') +
								(report.rawError ? codeBlock('', '\n\n' + String(report.rawError).truncate(1000)) : ''),
							'RED'
						).setFooter({ text: `ID: ${this.id} | Type: ${this.type ?? 'unknown'}` })
					]
				});
			})
			.catch(() => {});
		return this;
	}
}

type ErrorType = string | 'BOT_MISSING_PERMISSIONS' | 'OPERATION_FAIL';

interface InternalReport {
	message?: string;
	title?: string;
	command?: CommandOptions;
	user?: User | GuildMember;
	guild?: Guild;
	rawError?: any;
}
