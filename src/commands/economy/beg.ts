import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../lib/helpers';

const people = [
	'Alistair Douglas',
	'Franco Wilkerson',
	'Imaan Foreman',
	'Shazia Santana',
	'Zena Hodson',
	'Floyd Martins',
	'Solomon Webb',
	'Jamel Klein',
	'Raife Fields',
	'Ahsan Mora',
	'Arnie Stewart',
	'Aminah Mcclure',
	'Miranda Giles',
	'Elin Abbott',
	'Caitlin Michael',
	'Alice Espinosa',
	'Waqar Howe',
	'Tristan Leblanc',
	'Cadence Kane',
	'Reanne Lewis',
	'Oisin Hoover',
	'Roisin Bean',
	'Jak Ventura',
	'Bryony Power',
	'Saba Hartley'
];

const failedBegResponses = [
	'Your pathetic poor person.',
	'Go beg someone else!',
	'Back in the old days, we had to work for our money.'
];

@ApplyOptions<CommandOptions>({
	name: 'beg',
	description: 'Begs people for cash.',
	detailedDescription: 'beg'
})
export default class BegCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const failedBegEmbed = new MessageEmbed()
			.setAuthor({ name: people[Math.floor(people.length * Math.random())] })
			.setDescription(failedBegResponses[Math.floor(failedBegResponses.length * Math.random())])
			.setColor('RED');

		if (Math.random() > 0.5) return interaction.reply({ embeds: [failedBegEmbed] });

		const BegEmbed = new MessageEmbed();

		const moneyEarned = Math.round(
			// people.length is the minimum amount and 600 is the maximum amount
			Math.random() * (600 - people.length) + (people.length - 1)
		);

		fetchUser(interaction.user).then(async (user) => {
			if (user === null) return;
			await this.container.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					wallet: user.wallet + moneyEarned
				}
			});
		});

		BegEmbed.setTitle(`You begged ${people[Math.floor(Math.random() * people.length)]} for money`)
			.setDescription(`💰While begging you earned $${moneyEarned.toLocaleString()}💰`)
			.setColor('BLUE');

		return interaction.reply({ embeds: [BegEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description), {idHints:['944645544725336094']}
		);
	}
}
