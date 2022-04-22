import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import type { ItemNames } from '@prisma/client';
import { fetchItemMetaData, fetchUserInventory } from '../../lib/helpers/database';
import { generateErrorEmbed } from '../../lib/helpers/embed';
import { incrementItemCount, subtractFromWallet } from '../../lib/helpers/economy';

@ApplyOptions<CommandOptions>({
	name: 'sell',
	description: 'Sell an item.',
	detailedDescription: 'sell <item> <amount>'
})
export class SellCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const item = (interaction.options.getString('item') as string).replaceAll(' ', '_');
		const itemData = await fetchItemMetaData(item.toLocaleUpperCase() as ItemNames);
		if (!itemData.sellable) return interaction.reply('Item is not sellable!');

		const amount = Number(interaction.options.getString('amount'));

		await fetchUserInventory(interaction.user, itemData.name).then(async (inv) => {
			if (inv.count < amount) {
				return interaction.reply({
					embeds: [generateErrorEmbed('You do not have that much of that item!', 'Invalid amount')]
				});
			}

			await incrementItemCount(interaction.user, itemData.name, amount);
			await subtractFromWallet(interaction.user, Math.trunc(itemData.price / 2));

			return interaction.reply(`Sold **${amount}** of **${item}** for **$${Math.trunc(itemData.price / 2).toLocaleString()}**.`);
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('item').setRequired(true).setDescription('The item to sell.').setAutocomplete(true))
					.addStringOption((option) => option.setName('amount').setRequired(true).setDescription('The amount to sell.')),
			{ idHints: ['944645804331794542'] }
		);
	}
}
