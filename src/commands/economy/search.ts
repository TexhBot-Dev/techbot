import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { addToWallet } from '../../lib/helpers/economy';

const items = [
	'Rusty Sword',
	'Rusty Axe',
	'Rusty Pickaxe',
	'Rusty Hammer',
	'Rusty Hoe',
	'Rusty Shovel',
	'Carrot',
	'Great Depression Potato',
	'Spen',
	'Haider',
	'Morty',
	'Portal Gun',
	'Portal Gun (Charged)'
];

@ApplyOptions<CommandOptions>({
	name: 'search',
	description: 'Searches for items on the ground.'
})
export class SearchCommand extends Command {
	public async chatInputRun(interaction: CommandInteraction) {
		await interaction.reply('Searching...');

		if (Math.random() > 0.5) return interaction.editReply('You found nothing.');

		// Get random item from items
		const item = items[Math.floor(Math.random() * items.length)];
		// generate random amount of money no greater than 100
		const money = Math.floor(Math.random() * 100) + 1;

		await addToWallet(interaction.user, money);
		return interaction.editReply(`You found ${item} and ${money} coins!`);
	}

	public registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['966753016898261074']
		});
	}
}
