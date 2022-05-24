import { UserError } from '#root/lib/handlers/UserError';
import { generateErrorEmbed } from '#lib/helpers';
import { ApplyOptions } from '@sapphire/decorators';
import { SnowflakeRegex, UserOrMemberMentionRegex } from '@sapphire/discord-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, Guild, GuildMember, User } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'stats',
	description: 'Shows some interesting stats about the bot.',
	detailedDescription: 'stats'
})
export class BanCommand extends Command {
	private guild!: Guild;

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		const guild = interaction.guild;
		if (!guild) return;
		this.guild = guild;

		const requestedUser = interaction.options.getString('user', true);
		const reason = interaction.options.getString('reason', false) ?? undefined;
		const days = interaction.options.getInteger('days_to_delete', false) ?? 0;
		if (requestedUser.includes(',')) {
			interaction.reply('Banning users...');
			const requestedUsers = [...new Set(requestedUser.split(/\s*,\s*/g).map((el) => this.parseUser(el)))];
			let invalidUsers: string[] = [];
			let failedOperations: [user: ResolvedUser, error: any][] = [];

			for (let i = 0; i < requestedUsers.length; i++) {
				const user = (await requestedUsers[i]) as User;
				if (!user) {
					invalidUsers.push(user);
					continue;
				}

				guild.members
					.ban(user, {
						days,
						reason
					})
					.catch(async (err) => {
						failedOperations.push([await requestedUsers[i], err]);
					});
			}

			const failed = [...invalidUsers, ...failedOperations.map((el: [ResolvedUser, any]) => el[0])];

			if (failed.length === requestedUsers.length) {
				return void new UserError()
					.setResponse({
						embeds: [generateErrorEmbed('Failed To Ban Users', 'The users provided were either invalid or unbannable by the bot.')]
					})
					.sendResponse();
			}
			interaction.editReply({
				content:
					`Banned ${(requestedUsers.length - invalidUsers.length).toLocaleString()} users.` + invalidUsers.length
						? ` Failed to ban users: ${failed.join(', ')}`
						: ''
			});

			if (failedOperations.length > 0) {
				for (let i = 0, len = failedOperations.length; i < len; i++) {
					const op = failedOperations[i];
					new UserError()
						.setInternal({
							command: this.options,
							guild,
							message: `Failed to ban user '${op[0]}'.`,
							rawError: op[1]
						})
						.sendInternal();
				}
			}

			return;
		}

		const user = await this.parseUser(requestedUser);

		guild.members
			.ban(user, {
				days,
				reason
			})
			.catch((err) => {
				new UserError()
					.setResponse({ embeds: [generateErrorEmbed('Operation Failed', 'Failed to ban user.')], ephemeral: true })
					.setType('OPERATION_FAIL')
					.sendResponse()
					.setInternal({
						command: this.options,
						guild,
						rawError: err,
						user: interaction.user
					})
					.sendInternal();
			});
	}

	private async parseUser(el: string): Promise<ResolvedUser> {
		if (SnowflakeRegex.test(el)) {
			return await this.container.client.users.fetch(el);
		}

		if (UserOrMemberMentionRegex.test(el)) {
			return await this.container.client.users.fetch(el.replace(/<@!|>$/g, ''));
		}

		const isTag = /[0-9]{4}$/.test(el) && el.includes('#');
		if (isTag) {
			const members = await this.guild.members.fetch();
			return members.find((e) => e.user.tag === el) ?? el;
		}

		return el;
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((builder) =>
					builder
						.setName('user')
						.setRequired(true)
						.setDescription("The user(s) to ban. If you'd like to ban multiple users, separate them using commas.")
				)
				.addIntegerOption((builder) =>
					builder
						.setName('days_to_delete')
						.setMinValue(0)
						.setMaxValue(7)
						.setDescription('The days worth of messages to delete.')
						.addChoices(
							{ name: '1 Day', value: 1 },
							{ name: '2 Days', value: 2 },
							{ name: '3 Days', value: 3 },
							{ name: '4 Days', value: 4 },
							{ name: '5 Days', value: 5 },
							{ name: '6 Days', value: 6 },
							{ name: '7 Days', value: 7 }
						)
				)
		);
	}
}

type ResolvedUser = string | GuildMember | User;
