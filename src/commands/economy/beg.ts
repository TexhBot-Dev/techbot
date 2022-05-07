import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { randomUnitInterval, addToWallet } from '../../lib/helpers';

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

const failedBegResponses = ["You're pathetic poor person.", 'Go beg someone else!', 'Back in the old days, we had to work for our money.'];

@ApplyOptions<CommandOptions>({
	name: 'beg',
	description: 'Beg people for cash.',
	detailedDescription: 'beg'
})
export default class BegCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const begEmbed = new MessageEmbed().setAuthor({ name: people.randomElement() });

		if (randomUnitInterval() > 0.5) {
			begEmbed.setDescription(failedBegResponses.randomElement()).setColor('RED');
			void interaction.reply({ embeds: [begEmbed] });
			return;
		}

		const moneyEarned = Math.round(
			// people.length is the minimum amount and 600 is the maximum amount
			randomUnitInterval() * (600 - people.length) + (people.length - 1)
		);

		await addToWallet(interaction.user, moneyEarned);

		begEmbed.setDescription(`While begging you earned **$${moneyEarned.toLocaleString()}**!`).setColor('BLUE');

		return interaction.reply({ embeds: [begEmbed] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['944645544725336094']
		});
	}
}
