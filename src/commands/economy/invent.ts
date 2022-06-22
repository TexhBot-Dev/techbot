import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

import { randomInt, addToWallet } from '#lib/helpers';

// List of inventions
const inventions = [
	'glue',
	'tape',
	'spray can,',
	'air bags',
	'rubber bands',
	'atom bomb',
	'nuclear bomb',
	'airplane',
	'barometer',
	'battery',
	'bicycle',
	'car',
	'computer',
	'electricity',
	'engine',
	'fire extinguisher',
	'gas',
	'gasoline'
];

@ApplyOptions<CommandOptions>({
	name: 'invent',
	description: 'Lets you invent stuff and earn money',
	detailedDescription: '/invent',
	cooldownDelay: 60_000 * 10 // 10 min
})
export class InventCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const invention = inventions.randomElement();
		const money = randomInt(50, 701);

		await addToWallet(interaction.user, money);
		return interaction.reply(`You invented ${invention} and earned $${money.toLocaleString()}`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['977784389993922580']
		});
	}
}
