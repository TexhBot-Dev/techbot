import type { ApplicationCommandRegistry } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser, generateEmbed } from '#lib/helpers';
import { ChatInputSubcommandMappings, SubcommandMappingsArray, SubCommandPluginCommand } from '@sapphire/plugin-subcommands';

@ApplyOptions<SubCommandPluginCommand.Options>({
	name: 'job',
	description: 'Engage in the job system.',
	detailedDescription: '/job <subcommand>'
})
export default class JobCommand extends SubCommandPluginCommand {
	protected readonly subcommandMappings: SubcommandMappingsArray = [
		new ChatInputSubcommandMappings([
			{
				name: 'list',
				to: (interaction) => this.list(interaction)
			},
			{
				name: 'select',
				to: (interaction) => this.select(interaction)
			},
			{
				name: 'current',
				to: (interaction) => this.current(interaction)
			},
			{
				name: 'xp',
				to: (interaction) => this.xp(interaction)
			},
			{
				name: 'info',
				to: (interaction) => this.help(interaction)
			}
		])
	];

	/**
	 * Select a new job.
	 */
	private async select(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const jobs = await this.container.prisma.job.findMany();

		const newJob = interaction.options.getString('job_name');

		if (newJob === null) {
			return interaction.reply({ content: 'Please specify a job!', ephemeral: true });
		}

		const job = jobs.find((a) => a.name.toLocaleLowerCase() === newJob.toLocaleLowerCase());

		if (job === undefined) {
			return interaction.reply({ content: 'Please specify a valid job!', ephemeral: true });
		}

		this.container.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				currentJob: job.name
			}
		});

		interaction.reply(`You're now working as **${job.name.toTitleCase()}**.`);
	}

	/**
	 * Lists all available jobs.
	 */
	private async list(interaction: CommandInteraction) {
		const jobs = await this.container.prisma.job.findMany();

		let i = 0;
		const fields: { name: string; value: any }[] = [];
		for (const job of jobs) {
			fields.push({
				name: `${i}: ${job.name.toTitleCase()}`,
				value: `Description: ${job.description} **MIN EXP:** ${job.minimumXP}`
			});
			i++;
		}

		const listEmbed = new MessageEmbed()
			.setTitle('Available Jobs')
			.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
			.setFooter({ text: `To get a job run /job select!` })
			.setColor(0x00ff00);

		interaction.reply({ embeds: [listEmbed] });
	}

	/**
	 * Returns the user's current job.
	 */
	private async current(interaction: CommandInteraction) {
		const referencedUser = interaction.options.getUser('user') ?? interaction.user;
		const dbUser = await fetchUser(referencedUser);
		const jobEmbed = new MessageEmbed()
			.setTitle('Current Job')
			.setDescription(
				dbUser.currentJob === 'JOBLESS'
					? `${referencedUser.tag} is currently **Unemployed**.`
					: `${referencedUser.tag}'s current job is **${dbUser.currentJob.toTitleCase()}**.`
			)
			.setColor('BLUE');

		interaction.reply({ embeds: [jobEmbed] });
	}

	/**
	 * Returns the user's job experience.
	 */
	private async xp(interaction: CommandInteraction) {
		const referencedUser = interaction.options.getUser('user') ?? interaction.user;
		const dbUser = await fetchUser(referencedUser);
		const xpEmbed = new MessageEmbed()
			.setTitle(`XP for ${referencedUser.tag}`)
			.setDescription(`${dbUser.jobEXP.toLocaleString()} XP`)
			.setColor('BLUE');
		interaction.reply({ embeds: [xpEmbed] });
	}

	/**
	 * Help regarding the job system.
	 */
	private help(interaction: CommandInteraction) {
		interaction.reply({
			embeds: [
				generateEmbed(
					'Jobs',
					`**/job list** - Returns a list of all available jobs.\n**/job select <value>** - Selects a job.\n**/job current** - Returns your current job.\n**/job xp** - Returns your current XP.`,
					'BLUE'
				)
			],
			ephemeral: true
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) => subcommand.setName('list').setDescription('List all available jobs to choose from.'))
					.addSubcommand((subcommand) =>
						subcommand
							.setName('select')
							.setDescription('Select a job to work.')
							.addStringOption((option) =>
								option.setName('job_name').setDescription("Your new job's name.").setRequired(true).setAutocomplete(true)
							)
					)
					.addSubcommand((subcommand) => subcommand.setName('current').setDescription('Returns information about your current job.'))
					.addSubcommand((subcommand) => subcommand.setName('info').setDescription('Get information about the job system.'))
					.addSubcommand((subcommand) =>
						subcommand
							.setName('xp')
							.setDescription("Fetches a user's current job experience.")
							.addUserOption((option) => option.setName('user').setDescription('The user to get the experience of.').setRequired(false))
					),
			{ idHints: ['977784650942537738'] }
		);
	}
}
