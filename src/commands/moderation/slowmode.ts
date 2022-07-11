import { UserError } from '../../lib/handlers/UserError.js';
import { generateErrorEmbed } from '#lib/helpers';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction, GuildTextBasedChannel } from 'discord.js';
import { Duration } from '#lib/handlers/Duration';

@ApplyOptions<CommandOptions>({
	name: 'slowmode',
	description: 'Apply slowmode to a channel.',
	detailedDescription: '/slowmode <duration> [channel]',
	runIn: ['GUILD_TEXT']
})
export class BanCommand extends Command {
	public override chatInputRun(interaction: CommandInteraction) {
		const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as GuildTextBasedChannel;

		if (!channel.permissionsFor(interaction.user)?.has('MANAGE_CHANNELS'))
			return new UserError(interaction)
				.setType('MISSING_PERMISSIONS')
				.sendResponse({ embeds: [generateErrorEmbed('You need the manage channels permission to use that.', 'Missing Permissions')] });

		const duration = new Duration(interaction.options.getString('duration', true).toLowerCase());

		if (duration.hours > 6 || duration.seconds < 0)
			return new UserError(interaction).setType('INVALID_SLOWMODE_DURATION').sendResponse({
				embeds: [
					generateErrorEmbed(
						'Invalid slowmode duration provided. Duration must be less than 6 hours and more than 0 seconds.',
						'Invalid Duration'
					)
				]
			});

		return channel
			.edit({ rateLimitPerUser: Math.round(duration.seconds) })
			.then(() => {
				return interaction.reply({
					content: `Set ${channel.name}'s slowmode to **${duration.toString()}**.`
				});
			})
			.catch((err) => {
				new UserError(interaction)
					.setType('OPERATION_FAIL')
					.sendResponse({ embeds: [generateErrorEmbed('Failed to set slowmode.', 'Operation Failed')], ephemeral: true })
					.sendInternalReport({
						command: this.options,
						guild: interaction.guild!,
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
				.addStringOption((builder) =>
					builder.setName('duration').setDescription('The slowmode rate. Type a duration or "off" to turn slowmode off.').setRequired(true)
				)
				.addChannelOption((builder) =>
					builder
						.setName('channel')
						.setDescription('The channel to apply slowmode to. If omitted the current channel is used.')
						.setRequired(false)
				)
		);
	}
}
