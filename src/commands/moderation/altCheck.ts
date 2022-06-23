import { toTimestamp } from '#lib/helpers';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import { check } from '#lib/handlers/AltChecker';

const stringifiedTrustFactors = ['Very Distrusted', 'Distrusted', 'Trusted', 'Very Trusted'];
const colors: ColorResolvable[] = ['DARK_RED', 'RED', 'GREEN', 'DARK_GREEN'];

@ApplyOptions<CommandOptions>({
	name: 'altcheck',
	description: 'Check whether or not a user is predicted to be an suspicious account..',
	detailedDescription: '/altcheck <target>',
	runIn: ['GUILD_TEXT']
})
export class UserCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		const target = interaction.options.getUser('target') ?? interaction.user;

		await interaction.reply(`Analyzing **${target.tag}**...`);

		const trustFactor = await check(target, interaction.guild!);

		const creationTimestamp = toTimestamp(target.createdTimestamp);
		const avatar = target.avatarURL({ dynamic: true, format: 'png', size: 2048 }) ?? target.defaultAvatarURL;

		const embed = new MessageEmbed()
			.setColor(colors[trustFactor])
			.setThumbnail(avatar)
			.setAuthor({ name: target.tag, iconURL: avatar, url: avatar })
			.setTitle('AltDentifier Check')
			.setDescription(
				`${target.toString()} is **${
					stringifiedTrustFactors[trustFactor]
				}**.\n\nTrust Factor: ${trustFactor}\nCreation Date: <t:${creationTimestamp}:f> (<t:${creationTimestamp}:R>)`
			);

		interaction.editReply({ embeds: [embed], content: null });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((builder) => builder.setName('target').setRequired(false).setDescription('The user to altcheck.')),
			{ idHints: ['979897771261820958'] }
		);
	}
}

/**
 * 3 being very trusted and 0 being very distrusted.
 * -1 is if the user can't be considered, such as a bot.
 */
export type TrustFactor = 0 | 1 | 2 | 3;
