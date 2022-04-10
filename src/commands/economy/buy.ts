import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventories, fetchItemByName, fetchUser, generateErrorEmbed } from '../../lib/helpers';
import type { ItemType } from '@prisma/client';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: 'Gives you the ability to buy items from the store.',
	detailedDescription: 'buy <item>'
})
export default class BuyCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const itemToBuy = interaction.options.getString('item') as string;

		const item = await fetchItemByName(itemToBuy.replaceAll(' ', '_') as ItemType['name']);
		const user = await fetchUser(interaction.user);

		if (item === null) {
			return interaction.reply({
				embeds: [generateErrorEmbed(`Invalid item \'${itemToBuy}\' specified!`, 'Invalid Item Name')]
			});
		}

		if (user.wallet < item.price) {
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to purchase \`${item.name.toProperCase()}\`.\nThe item's price of \`${item.price.toLocaleString()}\` is greater than your wallet balance of \`${user.wallet.toLocaleString()}\`.\nUsage: \`/${
							this.detailedDescription
						}\``
					)
				],
				ephemeral: true
			});
		}

		await this.container.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				wallet: user.wallet - item.price
			}
		});

		fetchInventories(interaction.user).then(async (inventories) => {
			const inventory = inventories.find((inv) => inv.itemID === item.name);
			await this.container.prisma.item.update({
				where: {
					id: inventory!.id
				},
				data: {
					count: (inventory!.count += 1)
				}
			});
		});

		return interaction.reply(`You bought **${item.name}** for **$${item.price.toLocaleString()}**`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('item').setDescription('The item you want to buy.').setRequired(true)),
			{ idHints: ['944645546122051614'] }
		);
	}
}
