import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchItemMetaData } from '#lib/helpers';

import type { ItemNames } from '@prisma/client';

@ApplyOptions<CommandOptions>({
	name: 'shop',
	description: 'Gives you a list of the buyable items and their prices.',
	detailedDescription: 'shop'
})
export default class ShopCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const specificItem = interaction.options.getString('item') ?? '';
		if (specificItem.length > 0) {
			const item = await fetchItemMetaData(specificItem.toLocaleUpperCase() as ItemNames);
			const embed = new MessageEmbed()
				.setTitle(item.name.toProperCase())
				.setDescription(`> ${item.description}\nPrice: $${item.price.toLocaleString()}`)
				.setColor('BLUE');
			return interaction.reply({ embeds: [embed] });
		}

		const items = (await this.container.prisma.itemMetaData.findMany()).sort((a, b) => a.rarity.localeCompare(b.rarity));

		const embed = new MessageEmbed()
			.setTitle('Items For Sale')
			.setDescription(items.map((item) => `${item.emoji} **${item.name.toProperCase()}** - $${item.price.toLocaleString()}`).join('\n'))
			.setColor(0x00ff00);

		return interaction.reply({ embeds: [embed] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('item').setDescription('The item to get information on.').setAutocomplete(true)),
			{ idHints: ['977784561901650012'] }
		);
	}
}
