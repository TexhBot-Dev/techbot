import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { fetchUser } from '../../lib/helpers';

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
	detailedDescription: 'invent'
})
export class InventCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		// Chose random thing from inventions array
		const invention = inventions[Math.floor(Math.random() * inventions.length)];
		// Choose random amount of money less than 500
		const money = Math.floor(Math.random() * 500);
		fetchUser(interaction.user).then(async (user) => {
			if (user === null) return;
			await this.container.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					wallet: user.wallet + money
				}
			});
		});

		return interaction.reply(`You invented ${invention} and earned ${money}$`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName(this.name).setDescription(this.description), {idHints:['944645717702623332']}
		);
	}
}
