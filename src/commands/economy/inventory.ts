import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'inventory',
	description: "Shows a user's item inventory.",
	aliases: ['inv', 'bag', 'stuff'],
	detailedDescription: 'inventory [user]'
})
export default class InventoryCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const userToCheck = interaction.options.getUser('user') || interaction.user;

		const userToCheckData = await this.container.prisma.user.findFirst({
			where: {
				id: userToCheck.id
			},
			include: {
				inventory: true
			}
		});
		if (userToCheckData === null) return;
		const inventoryEmbed = new MessageEmbed();

		if (userToCheckData.inventory.length === 0) {
			inventoryEmbed.setDescription('You have no items in your inventory!');
			return interaction.reply({ embeds: [inventoryEmbed] });
		}

		let itemNumber = 1;
		for (const inventory of userToCheckData.inventory) {
			const itemData = await this.container.prisma.item.findFirst({
				where: {
					id: inventory.itemID
				}
			});
			if (itemData === null) return;

			inventoryEmbed.addField(
				`${itemNumber}: ${itemData.name}`,
				`Price: ${itemData.price.toLocaleString()}\nRarity: ${itemData.rarity}\nAmount: ${inventory.amount.toLocaleString()}`
			);
			itemNumber++;
		}

		return interaction.reply({ embeds: [inventoryEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) => option.setName('user').setDescription('The user to check the inventory of.')),
			{ idHints: ['944645718331752558'] }
		);
	}
}
