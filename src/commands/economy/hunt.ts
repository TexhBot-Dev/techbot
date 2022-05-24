import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { randomUnitInterval, randomInt, addToWallet } from '#lib/helpers';

import type { CommandInteraction } from 'discord.js';

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
	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		await interaction.reply('Searching for an Animal...');

		if (randomUnitInterval() > 0.5) return interaction.editReply("You didn't find any animals.");

		const animal = animals.randomElement();
		const money = randomInt(50, 300);

		await addToWallet(interaction.user, money);
		return interaction.editReply(`You killed a(n) ${animal} and earned $${money.toLocaleString()} coins!`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['977784647104737280']
		});
	}
}
