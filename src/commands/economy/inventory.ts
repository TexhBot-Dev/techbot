import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchItemMetaData } from '../../lib/helpers/database';

@ApplyOptions<CommandOptions>({
	name: 'inventory',
	description: "Shows a user's item inventory.",
	aliases: ['inv', 'bag', 'stuff'],
	detailedDescription: 'inventory [user]'
})
export default class InventoryCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const userToCheck = interaction.options.getUser('user') || interaction.user;

		const inventories = await this.container.prisma.inventory.findMany({
			where: {
				userID: userToCheck.id
			}
		});
		const inventoryEmbed = new MessageEmbed();

		if (inventories.length === 0) {
			inventoryEmbed.setDescription('You have no items in your inventory!');
			return interaction.reply({ embeds: [inventoryEmbed] });
		}

		let itemNumber = 1;
		for (const inventory of inventories) {
			const itemData = await fetchItemMetaData(inventory.itemID);

			inventoryEmbed.addField(
				`${itemNumber}: ${itemData.name.toProperCase()}`,
				`Price: ${itemData.price.toLocaleString()}\nRarity: ${itemData.rarity}\nAmount: ${inventory.count.toLocaleString()}`
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
