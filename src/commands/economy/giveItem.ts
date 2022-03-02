import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed, User, WebhookClient } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchInventory, fetchItemByName, generateErrorEmbed } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'giveItem',
	aliases: ['give-item', 'shareItem', 'share-item'],
	description: 'Allows you to give items to another user.',
	detailedDescription: 'give-item <user> <item> <amount>'
})
export default class GiveItemCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const userToGiveTo = interaction.options.getUser('user') as User;
		const itemToGive = interaction.options.getString('item') as string;
		const amount = Number(interaction.options.getString('amount')) as number;

		if (userToGiveTo.id === interaction.user.id)
			return interaction.reply({ embeds: [generateErrorEmbed('You cannot give money to yourself!')] });

		if (userToGiveTo.bot)
			return interaction.reply({ embeds: [generateErrorEmbed('Invalid User Specified!')] });
		if (itemToGive === null)
			return interaction.reply({ embeds: [generateErrorEmbed('Invalid Item Specified!')] });
		if (amount < 0)
			return interaction.reply({
				embeds: [generateErrorEmbed('Please specify a valid amount of money to withdraw')]
			}); // return message.reply('Please specify a valid amount of money to withdraw');
		// Senders Inventory
		fetchInventory(interaction.user, await fetchItemByName(itemToGive)).then((inventory) => {
			if (inventory === undefined) return interaction.reply('You do not have that item');
			if (inventory.amount < amount)
				return interaction.reply({
					embeds: [generateErrorEmbed('You do not have that much of that item!')]
				});
			inventory.amount -= amount;
			inventory.save();
			return null;
		});
		// Receivers Inventory
		fetchInventory(userToGiveTo, await fetchItemByName(itemToGive)).then((inventory) => {
			inventory.amount += amount;
			inventory.save();
		});

		// Send Message to Webhook
		// https://canary.discord.com/api/webhooks/927773203349246003/bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi
		const webhook = new WebhookClient({
			id: '927773203349246003',
			token: 'bwD-bJI-Esiylh8oXU2uY-JNNic5ngyRCMxzX2q4C5MEs-hJI7Vf-3pexABtJu3HuWbi'
		});
		const embed = new MessageEmbed()
			.setTitle('User gave item!')
			.setDescription(
				`${interaction.user.tag} has given ${amount.toLocaleString()} ${itemToGive} to ${
					userToGiveTo.tag
				}.`
			)
			.setColor('#00ff00')
			.setTimestamp();
		await webhook.send({ embeds: [embed] });

		return interaction.reply(`You gave ${amount} ${itemToGive} to ${userToGiveTo.username}`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setDescription('The user to give the item to.').setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setDescription('The amount of money to transfer.')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option.setName('item').setDescription('The item to transfer.').setRequired(true)
				), {idHints:['944645631857799198']}
		);
	}
}
