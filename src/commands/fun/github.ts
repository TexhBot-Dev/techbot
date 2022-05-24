import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

@ApplyOptions<CommandOptions>({
	name: 'github',
	description: 'Get information about a GitHub user or organization.',
	detailedDescription: 'github <username>'
})
export default class GitHubCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getString('username');
		const ghUser = await fetch<GitHubUser>(`https://api.popcat.xyz/github/${user}`, FetchResultTypes.JSON).catch(() => null);
		if (!ghUser) return interaction.reply({ content: `No such GitHub user found with name '${user}'.`, ephemeral: true });
		const updatedLast = Math.trunc(new Date(ghUser.updated_at).getTime() / 1000);
		const creationDate = Math.trunc(new Date(ghUser.created_at).getTime() / 1000);

		const response = new MessageEmbed()
			.setTitle(ghUser.name)
			.setURL(ghUser.url)
			.setThumbnail(ghUser.avatar)
			.setDescription(ghUser.bio)
			.setColor('BLUE')
			.addField('Relationships', `${ghUser.followers} Followers\nFollowing ${ghUser.following} People`)
			.addField('Creation Date', `<t:${creationDate}:f> (<t:${creationDate}:R>)`)
			.addField('Updated Last', `<t:${updatedLast}:f> (<t:${updatedLast}:R>)`)
			.addField('Public Projects', `${ghUser.public_repos} Public Repositories\n${ghUser.public_gists} Public Gists`)
			.addField(
				'Social',
				`${ghUser.blog ? `Blog: ${ghUser.blog}` : ''}\n${ghUser.twitter ? `Twitter: ${ghUser.twitter}` : ''}\n${
					ghUser.email ? `Email: ${ghUser.email}` : ''
				}`.replace(/\n+/g, '\n')
			);
		return interaction.reply({ embeds: [response] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('username').setDescription('The GitHub user to fetch info about.').setRequired(true)),
			{ idHints: ['977784911006138408'] }
		);
	}
}

interface GitHubUser {
	url: string;
	avatar: string;
	account_type: 'User' | 'Organization';
	name: string;
	company: string;
	blog: string;
	location: string;
	email: string;
	bio: string;
	twitter: string;
	public_repos: string;
	public_gists: string;
	followers: string;
	following: string;
	created_at: string;
	updated_at: string;
}
