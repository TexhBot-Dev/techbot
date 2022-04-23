import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'job',
	description: "Engage in Pepe Boy's job system.",
	detailedDescription: 'job <subcomand> [...value]'
})
export default class JobCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		const referencedUser = interaction.options.getUser('user') ?? interaction.user;
		const user = await fetchUser(referencedUser);
		const jobs = await this.container.prisma.job.findMany();

		switch (subcommand) {
			case 'list':
				{
					let i = 0;
					const fields: { name: string; value: any }[] = [];
					for (const job of jobs) {
						fields.push({
							name: `${i}: ${job.name.toProperCase()}`,
							value: `Description: ${job.description} **MIN EXP:** ${job.minimumXP}`
						});
						i++;
					}

					const listEmbed = new MessageEmbed()
						.setTitle('Available Jobs')
						.setDescription(fields.map((f) => `**${f.name}:** ${f.value}`).join('\n'))
						.setFooter({ text: `To get a job run /job select!` })
						.setColor(0x00ff00);

					void interaction.reply({ embeds: [listEmbed] });
				}
				break;
			case 'select':
				{
					const newJob = interaction.options.getString('job_name');

					if (newJob === null) {
						return void interaction.reply({ content: 'Please specify a job!', ephemeral: true });
					}

					const job = jobs.find((a) => a.name.toLocaleLowerCase() === newJob.toLocaleLowerCase());

					if (job === undefined) {
						return void interaction.reply({ content: 'Please specify a valid job!', ephemeral: true });
					}

					void this.container.prisma.user.update({
						where: {
							id: user.id
						},
						data: {
							currentJob: job.name
						}
					});

					void interaction.reply(`You're now working as **${job.name.toProperCase()}**.`);
				}

				break;
			case 'current':
				{
					const jobEmbed = new MessageEmbed()
						.setTitle('Current Job')
						.setDescription(
							user.currentJob === 'JOBLESS'
								? `${referencedUser.tag} is currently **Unemployed**.`
								: `${referencedUser.tag}'s current job is **${user.currentJob.toProperCase()}**.`
						)
						.setColor('BLUE');

					void interaction.reply({ embeds: [jobEmbed] });
				}

				break;

			case 'xp':
				{
					const xpEmbed = new MessageEmbed()
						.setTitle(`XP for ${referencedUser.tag}`)
						.setDescription(`${user.jobEXP.toLocaleString()} XP`)
						.setColor('BLUE');
					void interaction.reply({ embeds: [xpEmbed] });
				}
				break;

			case 'help':
				{
					const helpReply = new MessageEmbed()
						.setTitle('Jobs')
						.setDescription(
							`**/job list** - Returns a list of all available jobs.\n**/job select <value>** - Selects a job.\n**/job current** - Returns your current job.\n**/job xp** - Returns your current XP.`
						)
						.setColor('BLUE');

					void interaction.reply({ embeds: [helpReply] });
				}
				break;
		}
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
					.addSubcommand((subcommand) => subcommand.setName('info').setDescription("Get information about Pepe Boy's job system."))
					.addSubcommand((subcommand) =>
						subcommand
							.setName('xp')
							.setDescription("Fetches a user's current job experience.")
							.addUserOption((option) => option.setName('user').setDescription('The user to get the experience of.').setRequired(false))
					),
			{ idHints: ['944645718889619456'] }
		);
	}
}
