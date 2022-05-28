import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'user',
	description: 'Get information about a user.',
	detailedDescription: '/user <user>',
	runIn: ['GUILD_TEXT']
})
export class UserCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		const guild = interaction.guild!;

		const user = await (interaction.options.getUser('user') ?? interaction.user).fetch();
		const member = await guild.members.fetch(user).catch(() => undefined);

		const avatar = user.avatarURL({ dynamic: true, size: 4096, format: 'png' }) ?? undefined;
		const banner = user.bannerURL({ dynamic: true, size: 4096, format: 'png' });
		const creationTimestamp = Math.floor(user.createdTimestamp / 1000);

		const response = new MessageEmbed()
			.setAuthor({ name: user.tag, iconURL: avatar, url: avatar })
			.setDescription(user.toString())
			.addField('User ID', user.id)
			.addField('Joined Discord', `<t:${creationTimestamp}:f> (<t:${creationTimestamp}:R>)`)
			.setColor(user.hexAccentColor ?? 'BLUE');

		if (banner) response.setImage(banner);
		if (avatar) response.setThumbnail(avatar);

		if (!member)
			return interaction.reply({
				embeds: [response]
			});

		const joinedTimestamp = Math.floor((member.joinedTimestamp ?? 0) / 1000);
		response.addField('Joined Server', `<t:${joinedTimestamp}:f> (<t:${joinedTimestamp}:R>)`);

		const boostingSince = Math.floor((member.premiumSinceTimestamp ?? 0) / 1000);
		if (boostingSince) {
			response.addField('Boosting Since', `<t:${boostingSince}:f> (<t:${boostingSince}:R>)`);
		}

		const highestRole = member.roles.highest;
		response.addField('Highest Role', `${highestRole.toString()} (${highestRole.id})`);

		interaction.reply({
			embeds: [response]
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((builder) => builder.setName('user').setRequired(false).setDescription('The user to get information about.')),
			{ idHints: ['979534542908051466'] }
		);
	}
}
