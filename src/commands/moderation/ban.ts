import { UserError } from '../../lib/handlers/UserError.js';
import { generateErrorEmbed } from '#lib/helpers';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, Permissions } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'ban',
	description: 'Ban a user.',
	detailedDescription: 'ban',
	runIn: ['GUILD_TEXT']
})
export class BanCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		if (!interaction.memberPermissions!.has(Permissions.FLAGS.BAN_MEMBERS))
			new UserError(interaction)
				.setResponse({ embeds: [generateErrorEmbed('You need the ban members permission to use that.', 'Missing Permissions')] })
				.setType('MISSING_PERMISSIONS')
				.sendResponse();

		const guild = interaction.guild!;

		const userToBan = interaction.options.getUser('target', true);
		const reason = interaction.options.getString('reason', false) ?? undefined;
		const days = interaction.options.getInteger('days_to_delete', false) ?? 0;

		guild.members
			.ban(userToBan, {
				days,
				reason
			})
			.catch((err) => {
				new UserError(interaction)
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
			})
			.then(() => {
				interaction.reply({
					content: `Successfully banned **${userToBan.tag}**` + (days > 0 ? `and deleted ${days} days of their messages.` : '.')
				});
			});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((builder) => builder.setName('target').setRequired(true).setDescription('The user to ban.'))
				.addStringOption((builder) => builder.setName('reason').setDescription('The reason for banning this user.').setRequired(false))
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
