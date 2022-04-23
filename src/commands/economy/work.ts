import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { addToWallet, fetchUser, generateErrorEmbed } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'work',
	description: 'Makes you slave away your final days on earth :)',
	detailedDescription: 'work'
})
export default class WorkCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const user = await fetchUser(interaction.user);
		const workEmbed = new MessageEmbed();
		const job = user.currentJob;

		if (job === 'JOBLESS') {
			return void interaction.reply({
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

		const moneyEarned = jobs[job.toLocaleLowerCase()];
		await addToWallet(interaction.user, moneyEarned);

		workEmbed
			.setTitle(`You worked as a ${job.toProperCase()}`)
			.setDescription(`While working you earned **$${moneyEarned.toLocaleString()}**.`)
			.setColor('BLUE');

		return void interaction.reply({ embeds: [workEmbed] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645893120983082']
		});
	}
}
