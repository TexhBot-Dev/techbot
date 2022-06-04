import { UserError } from '../../lib/handlers/UserError.js';
import { generateErrorEmbed } from '#lib/helpers';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Permissions } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'kick',
	description: 'Kick a user.',
	detailedDescription: '/kick <target> [reason]',
	runIn: ['GUILD_TEXT']
})
export class KickCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		if (!interaction.memberPermissions!.has(Permissions.FLAGS.KICK_MEMBERS))
			return new UserError(interaction)
				.sendResponse({ embeds: [generateErrorEmbed('You need the kick members permission to use that.', 'Missing Permissions')] })
				.setType('MISSING_PERMISSIONS');

		const guild = interaction.guild!;

		const userToKick = await guild.members.fetch(interaction.options.getUser('target', true));
		if (!userToKick)
			return new UserError(interaction)
				.sendResponse({ embeds: [generateErrorEmbed('User is not present in this guild.', 'Invalid Member')] })
				.setType('INVALID_MEMBER');

		const reason = interaction.options.getString('reason', false) ?? undefined;

		guild.members
			.kick(userToKick, reason)
			.then(() => {
				interaction.reply({
					content: `Successfully kicked **${userToKick.user.tag}**.`
				});
			})
			.catch((err) => {
				new UserError(interaction)
					.sendResponse({ embeds: [generateErrorEmbed('Operation Failed', 'Failed to kick user.')], ephemeral: true })
					.setType('OPERATION_FAIL')
					.sendInternalReport({
						command: this.options,
						guild,
						rawError: err,
						user: interaction.user
					});
			});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((builder) => builder.setName('target').setRequired(true).setDescription('The user to kick.'))
				.addStringOption((builder) => builder.setName('reason').setDescription('The reason for kicking this user.').setRequired(false))
		);
	}
}
