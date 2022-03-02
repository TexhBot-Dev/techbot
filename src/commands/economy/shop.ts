import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Item } from '../../lib/entities/economy/item';
import { generateErrorEmbed } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'shop',
	description: 'Gives you a list of the buyable items and their prices.',
	detailedDescription: 'shop'
})
export default class ShopCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const specificItem = interaction.options.getString('item') || '';
		if (specificItem.length > 0) {
			const item = await Item.findOne({ where: { name: specificItem.toProperCase() } });
			if (item !== undefined) {
				const embed = new MessageEmbed()
					.setTitle(item.name.toProperCase())
					.setDescription(`> ${item.description}\nPrice: $${item.price.toLocaleString()}`)
					.setColor('BLUE');
				return interaction.reply({ embeds: [embed] });
			} else {
				return interaction.reply({
					embeds: [
						generateErrorEmbed(
							`Could not find item with name '${specificItem}'.`,
							'Invalid Item Name'
						)
					],
					ephemeral: true
				});
			}
		}
		const items = await Item.createQueryBuilder('item').orderBy('item.price', 'ASC').getMany();

		const embed = new MessageEmbed()
			.setTitle('Items For Sale')
			.setDescription(
				items
					.map(
						(item) =>
							`${item.emoji} **${item.name.toProperCase()}** - $${item.price.toLocaleString()}`
					)
					.join('\n')
			)
			.setColor(0x00ff00);

		return interaction.reply({ embeds: [embed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('item').setDescription('The item to get information on.')
				), {idHints:['944645805766238229']}
		);
	}
}
