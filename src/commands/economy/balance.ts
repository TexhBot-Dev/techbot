import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { fetchUser } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'balance',
	aliases: ['bal', 'money', 'balance', 'cash'],
	description: "Returns a user's current balance.",
	detailedDescription: 'balance [user]'
})
export default class BalanceCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const balanceEmbed = new MessageEmbed();
		const user = interaction.options.getUser('user', false) ?? interaction.user;
		const dBUserData = await fetchUser(user);

		balanceEmbed
			.setTitle(`${user.username}, this is your balance!`)
			.addField('Wallet:', dBUserData.wallet.toLocaleString())
			.addField('Bank:', dBUserData.bank.toLocaleString())
			.addField('Total:', (dBUserData.wallet + dBUserData.bank).toLocaleString())
			.setColor('#4EAFF6');
		return interaction.reply({ embeds: [balanceEmbed] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((options) => options.setName('user').setDescription('The user to check the balance of.')),
			{ idHints: ['944645544230420521'] }
		);
	}
}
