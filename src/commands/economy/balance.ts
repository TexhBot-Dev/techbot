import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import {fetchUser} from "../../lib/utils";

@ApplyOptions<CommandOptions>({
	name: 'balance',
	aliases: ['bal', 'money', 'balance', 'cash'],
	description: "Returns a user's current balance.",
	detailedDescription: 'balance [user]'
})
export default class BalanceCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const balanceEmbed = new MessageEmbed();
		const user = interaction.options.getUser('user', false) ?? interaction.user;
		const balance = await fetchUser(user);
		balanceEmbed
			.setTitle(`${user.username}, this is your balance!`)
			.addField('Wallet:', balance.wallet.toLocaleString())
			.addField('Bank:', balance.bank.toLocaleString())
			.addField('Total:', (balance.wallet + balance.bank).toLocaleString())
			.setColor('#4EAFF6');
		return interaction.reply({ embeds: [balanceEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((options) =>
					options.setName('user').setDescription('The user to check the balance of.')
				)
		);
	}
}
