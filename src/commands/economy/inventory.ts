import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import {User} from "../../lib/entities/economy/user";
import type {Item} from "../../lib/entities/economy/item";

@ApplyOptions<CommandOptions>({
	name: 'inventory',
	description: "Shows a user's item inventory.",
	aliases: ['inv', 'bag', 'stuff'],
	detailedDescription: 'inventory [user]'
})
export default class InventoryCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const userToCheck = interaction.options.getUser('user') || interaction.user;

		const items: ItemDataWithAmount[] = await User.getRepository().manager.query(`
			SELECT item.*, inventory.amount FROM item
			JOIN inventory ON inventory.itemID = item.id
			WHERE inventory.userId = ${userToCheck.id}
			`);
		const inventoryEmbed = new MessageEmbed();

		if (items.length === 0) {
			inventoryEmbed.setDescription('You have no items in your inventory!');
			return interaction.reply({ embeds: [inventoryEmbed] });
		}

		let itemNumber = 1;
		for (const item of items) {
			inventoryEmbed.addField(
				`${itemNumber}: ${item.name}`,
				`Price: ${item.price.toLocaleString()}\nRarity: ${
					item.rarity
				}\nAmount: ${item.amount.toLocaleString()}`
			);
			itemNumber++;
		}

		return interaction.reply({ embeds: [inventoryEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setDescription('The user to check the inventory of.')
				)
		);
	}
}

interface ItemDataWithAmount extends Item {
	amount: number;
}
