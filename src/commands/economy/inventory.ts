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
	public override async chatInputRun(interaction: CommandInteraction) {
		const userToCheck = interaction.options.getUser('user', false) ?? interaction.user;
		const inventoryEmbed = new MessageEmbed();

		(
			await this.container.prisma.inventory.findMany({
				where: {
					userID: userToCheck.id
				}
			})
		).map((inv, position) => {
			return fetchItemMetaData(inv.itemID).then((item) => {
				inventoryEmbed.addField(
					`${position + 1}: ${item.name.toProperCase()}`,
					`Price: ${item.price.toLocaleString()}\nRarity: ${item.rarity}\nAmount: ${inv.count.toLocaleString()}`
				);
			});
		});

		if (inventoryEmbed.fields.length === 0) {
			inventoryEmbed.setDescription('You have no items!');
			return interaction.reply({ embeds: [inventoryEmbed] });
		}

		return interaction.reply({ embeds: [inventoryEmbed] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
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
