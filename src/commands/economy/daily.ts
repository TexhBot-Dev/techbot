import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { fetchUser } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	name: 'daily',
	description: 'Get those yummy pepe coins, I know you want them.',
	cooldownDelay: 86_400_000,
	detailedDescription: 'daily'
})
export default class DailyCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const embed = new MessageEmbed();
		const moneyEarned = Math.round(Math.random() * (3000 - 750) + 750);

		fetchUser(interaction.user).then((user) => {
			user.wallet += moneyEarned;
			user.save();
		});

		embed
			.setTitle('Daily Coins :D')
			.setDescription(`Ayyy! You earned **$${moneyEarned.toLocaleString()}**, see ya tommorow.`)
			.setColor('BLUE');

		return interaction.reply({ embeds: [embed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description), {idHints:['944645546642128987']}
		);
	}
}
