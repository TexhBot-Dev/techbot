import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import type { ItemNames } from '@prisma/client';
import { generateErrorEmbed, fetchItemMetaData, fetchUser, incrementItemCount, subtractFromWallet } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: 'Gives you the ability to buy items from the store.',
	detailedDescription: 'buy <item>'
})
export default class BuyCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const itemToBuy = interaction.options.getString('item', true);

		const item = await fetchItemMetaData(itemToBuy.toConstantCase() as ItemNames);
		const user = await fetchUser(interaction.user);

		if (!item) {
			return interaction.reply({
				embeds: [generateErrorEmbed(`Invalid item '${itemToBuy}' specified!`, 'Invalid Item Name')]
			});
		}

		if (user.wallet < item.price) {
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`You don't have enough money to purchase \`${item.name.toProperCase()}\`.\nThe item's price of \`${item.price.toLocaleString()}\` is greater than your wallet balance of \`${user.wallet.toLocaleString()}\`.\nUsage: \`/${
							this.detailedDescription as string
						}\``,
						'Insufficient Amount'
					)
				],
				ephemeral: true
			});
		}

		await subtractFromWallet(interaction.user, item.price);
		await incrementItemCount(interaction.user, item.name);
		return interaction.reply(`You bought **${item.name.toProperCase()}** for **$${item.price.toLocaleString()}**`);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option.setName('item').setDescription('The item you want to buy.').setRequired(true).setAutocomplete(true)
					),
			{ idHints: ['944645546122051614'] }
		);
	}
}
