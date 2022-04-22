import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../lib/helpers/database';

@ApplyOptions<CommandOptions>({
	name: 'job',
	description: 'Manage your job.',
	aliases: ['jobs'],
	detailedDescription: 'job [option] ...'
})
export default class JobCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const toDo = interaction.options.getString('option', true);
		const value = interaction.options.getString('value');
		const user = await fetchUser(interaction.user);
		const jobs = await this.container.prisma.job.findMany();

		switch (toDo.toLocaleLowerCase()) {
			case 'list':
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
					.setFooter({ text: `To get a job run jobs select <job name>!` })
					.setColor(0x00ff00);

				await interaction.reply({ embeds: [listEmbed] });
				break;
			case 'select':
				if (value === null) {
					return interaction.reply({ content: 'Please specify a job!', ephemeral: true });
				}

				const job = jobs.find((a) => a.name.toLocaleLowerCase() === value.toLocaleLowerCase());

				if (job === undefined) {
					return interaction.reply({ content: 'Please specify a valid job!', ephemeral: true });
				}

				await this.container.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						currentJob: job.name
					}
				});

				await interaction.reply(`You're now working as **${job.name.toProperCase()}**.`);
				break;
			case 'current':
				const jobEmbed = new MessageEmbed()
					.setTitle('Current Job')
					.setDescription(
						user.currentJob !== 'JOBLESS'
							? `Your current job is **${user.currentJob.toProperCase()}**.`
							: 'You are currently **Unemployed**.'
					)
					.setColor('BLUE');

				await interaction.reply({ embeds: [jobEmbed] });
				break;

			case 'xp':
				const xpEmbed = new MessageEmbed().setTitle('Current XP').setDescription(`${user.jobEXP.toLocaleString()} XP`).setColor('BLUE');

				await interaction.reply({ embeds: [xpEmbed] });
				break;

			case 'help':
				const helpReply = new MessageEmbed()
					.setTitle('Jobs')
					.setDescription(
						`**/job list** - Returns a list of all available jobs.\n**/job select <value>** - Selects a job.\n**/job current** - Returns your current job.\n**/job xp** - Returns your current XP.`
					)
					.setColor('BLUE');

				return interaction.reply({ embeds: [helpReply] });
		}
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('option')
							.setDescription('The option you want to do.')
							.setChoices([
								['list', 'List'],
								['select', 'Select'],
								['current', 'Current'],
								['xp', 'XP'],
								['help', 'Help']
							])
							.setRequired(true)
					)
					.addStringOption((option) =>
						option.setName('value').setDescription('A value to pass in to the command. Only use if needed.').setRequired(false)
					),
			{ idHints: ['944645718889619456'] }
		);
	}
}
