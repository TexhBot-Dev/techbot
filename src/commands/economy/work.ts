import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser, generateErrorEmbed } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'work',
	description: 'Makes you slave away your final days on earth :)',
	detailedDescription: 'work'
})
export default class WorkCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const workEmbed = new MessageEmbed();
		const job = user.currentJob;

		if (job === 'jobless') {
			return interaction.reply({
				embeds: [generateErrorEmbed("You don't have a job! Do `job select janitor` to get started!", 'No Job')]
			});
		}

		const jobs: Record<string, number> = {
			jobless: 0,
			janitor: 250,
			chief: 500,
			fire_fighter: 750,
			pepe_king: 1000
		} as const;

		let moneyEarned = jobs[job.toLowerCase()];
		await this.container.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				wallet: user.wallet + moneyEarned
			}
		});

		workEmbed
			.setTitle(`You worked as a ${job.toProperCase()}`)
			.setDescription(`While working you earned **$${moneyEarned.toLocaleString()}**.`)
			.setColor('BLUE');

		return interaction.reply({ embeds: [workEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645893120983082']
		});
	}
}
