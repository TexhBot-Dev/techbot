import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { addToWallet } from '../../lib/helpers/economy';

const animals = [
	'pig',
	'cow',
	'chicken',
	'rabbit',
	'horse',
	'cat',
	'dog',
	'elephant',
	'giraffe',
	'lion',
	'zebra',
	'rhino',
	'bear',
	'panda',
	'koala',
	'penguin',
	'parrot',
	'polar bear',
	'polar bear cub'
];

@ApplyOptions<CommandOptions>({
	name: 'hunt',
	description: 'Lets you hunt and potentially earn money',
	detailedDescription: 'hunt'
})
export class HuntCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.reply('Searching for an Animal...');

		if (Math.random() > 0.5) return interaction.editReply("You didn't find any Animals.");

		// Get random item from items
		const animal = animals[Math.floor(Math.random() * animals.length)];
		// generate random amount of money no greater than 100
		const money = Math.floor(Math.random() * 100) + 1;

		await addToWallet(interaction.user, money);
		return interaction.editReply(`You culled a(n) ${animal} and earned ${money} coins!`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['966754372199542794']
		});
	}
}
