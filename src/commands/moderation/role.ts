import type { ApplicationCommandRegistry } from '@sapphire/framework';
import { CommandInteraction, CommandInteractionOption, Guild, GuildMemberRoleManager } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { SubcommandMappingArray, Subcommand } from '@sapphire/plugin-subcommands';
import { UserError } from '#root/lib/handlers/UserError.js';
import { generateErrorEmbed } from '#root/lib/helpers/embed.js';

@ApplyOptions<Subcommand.Options>({
	name: 'role',
	description: 'The base command for managing roles.',
	detailedDescription: '/role <subcommand> [...args]',
	preconditions: ['GuildOnly'],
	cooldownDelay: 3000
})
export default class RoleCommand extends Subcommand {
	protected readonly subcommandMappings: SubcommandMappingArray = [
		{
			name: 'add',
			chatInputRun: (interaction) => this.toggleRole(interaction, RoleToggleType.Add)
		},
		{
			name: 'remove',
			chatInputRun: (interaction) => this.toggleRole(interaction, RoleToggleType.Remove)
		},
		{
			name: 'removeall',
			chatInputRun: (interaction) => this.removeAll(interaction)
		}
	];

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('add')
							.setDescription('adds a specified role to a user')
							.addUserOption((option) => option.setName('user').setDescription('The user to add to the role').setRequired(true))
							.addRoleOption((option) => option.setName('role').setDescription('The role to add to the user').setRequired(true))
					)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('remove')
							.setDescription('removes a specified role to a user')
							.addUserOption((option) => option.setName('user').setDescription('The user to remove from the role').setRequired(true))
							.addRoleOption((option) => option.setName('role').setDescription('The role to remove from the user').setRequired(true))
					)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('removeall')
							.setDescription('removes all roles from a user')
							.addUserOption((option) => option.setName('user').setDescription('The user to remove all roles from').setRequired(true))
					),
			{ idHints: ['989971053650526268'] }
		);
	}

	/**
	 * Normalizes interaction member roles to be in the form of GuildMemberRoleManager, rather than in some cases strings.
	 */
	private async normalizeRoles(guild: Guild, user: NonNullable<CommandInteractionOption['member']>): Promise<GuildMemberRoleManager> {
		if (user.roles instanceof GuildMemberRoleManager) return user.roles;

		const member = await guild.members.fetch(user.toString());
		return member.roles;
	}

	/**
	 * Make sure bot and the command author have the `MANAGE_ROLES` permission.
	 */
	private async ensureManageRolePermissions(interaction: CommandInteraction) {
		const guild = interaction.guild!;
		const botHasPermissions = guild.me!.permissions.has('MANAGE_ROLES');
		const userHasPermissions = interaction.memberPermissions!.has('MANAGE_ROLES');

		if (!botHasPermissions)
			return new UserError(interaction)
				.setType('MISSING_PERMISSIONS')
				.sendResponse({ embeds: [generateErrorEmbed(`I am missing the \`MANAGE_ROLES\` permission.`, 'Bot Missing Permissions')] });

		if (!userHasPermissions)
			return new UserError(interaction)
				.setType('MISSING_PERMISSIONS')
				.sendResponse({ embeds: [generateErrorEmbed(`You are missing the \`MANAGE_ROLES\` permission.`, 'Missing Permissions')] });

		return true;
	}

	/**
	 * Ensure the bot and the user have the prerequisites to add/remove a role.
	 * @param interaction The command interaction
	 * @param role The role being added/removed
	 * @returns A UserError or true
	 */
	private async checkIfCommandIsAllowed(interaction: CommandInteraction, role: NonNullable<CommandInteractionOption['role']>) {
		const member = interaction.member!;
		const memberRoles = await this.normalizeRoles(interaction.guild!, member);

		const me = interaction.guild!.me!;

		const userHasApplicableRolePositioning = memberRoles.highest.position > role.position;
		const botHasApplicableRolePositioning = me.roles.highest.position > role.position;

		if (!userHasApplicableRolePositioning)
			return new UserError(interaction).setType('INSUFFICIENT_ROLE_POSITION').sendResponse({
				embeds: [
					generateErrorEmbed(
						`Your highest role (${memberRoles.highest}) is too low to add ${role.toString()}.`,
						'Insufficient Role Position'
					)
				]
			});

		if (!botHasApplicableRolePositioning)
			return new UserError(interaction).setType('INSUFFICIENT_ROLE_POSITION').sendResponse({
				embeds: [generateErrorEmbed(`My highest role is too low to add ${role.toString()}.`, 'Insufficient Role Position')]
			});

		return await this.ensureManageRolePermissions(interaction);
	}

	private async toggleRole(interaction: CommandInteraction, type: RoleToggleType) {
		const user = interaction.options.getMember('user', true);
		const userRoles = await this.normalizeRoles(interaction.guild!, user);
		const role = interaction.options.getRole('role', true);
		const toggleType = type === RoleToggleType.Add ? 'add' : 'remove';

		if ((await this.checkIfCommandIsAllowed(interaction, role)) !== true) return;

		try {
			await userRoles[toggleType](role.id);
		} catch (rawError) {
			return new UserError(interaction)
				.setType('ACTION_FAILED')
				.sendResponse({
					embeds: [generateErrorEmbed(`Failed to remove ${role.toString()} from ${user.toString()}.`, 'Action Failed')],
					allowedMentions: undefined
				})
				.sendInternalReport({ rawError, command: this.options });
		}

		return interaction.reply({
			content: `${toggleType === 'add' ? 'Added' : 'Removed'} ${role.toString()} ${toggleType === 'add' ? 'to' : 'from'} ${user.toString()}.`,
			allowedMentions: {}
		});
	}

	private async removeAll(interaction: CommandInteraction) {
		return interaction.reply('To do!');
	}
}

enum RoleToggleType {
	Add,
	Remove
}
