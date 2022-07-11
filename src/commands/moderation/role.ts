import type { ApplicationCommandRegistry } from '@sapphire/framework';
import type { CommandInteraction, CommandInteractionOption, GuildMember, GuildMemberRoleManager } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { SubcommandMappingArray, Subcommand } from '@sapphire/plugin-subcommands';

@ApplyOptions<Subcommand.Options>({
	name: 'role',
	description: 'lets you manage roles.',
	detailedDescription: '/job <subcommand>'
})
export default class RoleCommand extends Subcommand {
	protected readonly subcommandMappings: SubcommandMappingArray = [
		{
			name: 'add',
			chatInputRun: (interaction) => this.add(interaction)
		},
		{
			name: 'remove',
			chatInputRun: (interaction) => this.remove(interaction)
		},
		{
			name: 'removeall',
			chatInputRun: (interaction) => this.removeall(interaction)
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

	private checkIfCommandIsAllowed(interaction: CommandInteraction, role: CommandInteractionOption['role']) {
		const userAbleToGiveRole = (interaction.member?.roles as GuildMemberRoleManager).highest.position > (role?.position ?? 0);
		const botAbleToGiveRole =
			(interaction.guild?.me?.roles as GuildMemberRoleManager).highest?.position > (role?.position ?? 0) &&
			interaction.guild?.me?.permissions.has('MANAGE_ROLES');

		// // console.log(userAbleToGiveRole, botAbleToGiveRole, userAbleToGiveRole && botAbleToGiveRole);

		return !userAbleToGiveRole && !botAbleToGiveRole;
	}

	private async add(interaction: CommandInteraction) {
		const user = interaction.options.getMember('user');
		const role = interaction.options.getRole('role');

		if (this.checkIfCommandIsAllowed(interaction, role)) {
			return interaction.reply('You (or the bot) do not have permission to give this role to this user.');
		}

		try {
			await (user?.roles as GuildMemberRoleManager).add(role?.id ?? '');
		} catch {
			return interaction.reply('Failed to give the role to the user.');
		}

		return interaction.reply(`Gave the role ${role?.name ?? ''} to ${(user as GuildMember).displayName ?? ''}`);
	}

	private async remove(interaction: CommandInteraction) {
		const user = interaction.options.getMember('user');
		const role = interaction.options.getRole('role');

		if (this.checkIfCommandIsAllowed(interaction, role)) {
			return interaction.reply('You (or the bot) do not have permission to remove this role to this user.');
		}

		try {
			if (role?.id !== undefined) {
				await (user?.roles as GuildMemberRoleManager).remove(role?.id);
			}
		} catch {
			return interaction.reply('Failed to remove the role from the user.');
		}

		return interaction.reply(`Removed ${role?.name ?? ''} from ${(user as GuildMember).displayName ?? ''}`);
	}

	private async removeall(interaction: CommandInteraction) {
		const user = interaction.options.getMember('user');

		const userAbleToRemoveRole =
			(interaction.member?.roles as GuildMemberRoleManager).highest.position > ((user?.roles as GuildMemberRoleManager).highest.position ?? 0);
		const botAbleToRemoveRole =
			(interaction.guild?.me?.roles as GuildMemberRoleManager).highest?.position >
				((user?.roles as GuildMemberRoleManager).highest.position ?? 0) && interaction.guild?.me?.permissions.has('MANAGE_ROLES');

		if (!userAbleToRemoveRole || !botAbleToRemoveRole) {
			return interaction.reply('You (or the bot) do not have permission to remove this role to this user.');
		}

		try {
			for (const [_, role] of (user?.roles as GuildMemberRoleManager).cache) {
				await (user?.roles as GuildMemberRoleManager).remove(role.id);
			}
		} catch {
			return interaction.reply('Failed to remove all roles from the user.');
		}

		return interaction.reply(`Removed all roles from ${(user as GuildMember).displayName ?? ''}`);
	}
}
