import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { randomUnitInterval, randomInt, fetchUser, addToWallet, subtractFromWallet, generateErrorEmbed } from '../../lib/helpers';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<CommandOptions>({
	name: 'rob',
	description: 'Steal from other users',
	detailedDescription: 'rob <user>',
	preconditions: ['guildOnly'],
	cooldownDelay: 60_000 * 150 // 2.5 hours
})
export default class RobCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const userToRob = interaction.options.getUser('user', true);

		if (interaction.user.id === userToRob.id) {
			return interaction.reply({
				embeds: [generateErrorEmbed("You can't rob yourself.", 'Invalid User')],
				ephemeral: true
			});
		}

		if (userToRob.bot) {
			return interaction.reply({
				embeds: [generateErrorEmbed("You can't rob bots!", 'Invalid User')],
				ephemeral: true
			});
		}

		const robbedUser = await fetchUser(userToRob);
		const robber = await fetchUser(interaction.user);

		if (robbedUser.passiveMode) {
			return interaction.reply({
				embeds: [generateErrorEmbed(`${userToRob.toString()} is in passive mode. Leave them alone!`, 'User is in Passive Mode')],
				ephemeral: true
			});
		}

		if (robber.passiveMode) {
			return interaction.reply({
				embeds: [generateErrorEmbed("You can't rob while in passive mode!", 'Passive Mode Enabled')],
				ephemeral: true
			});
		}
		const winAmount = Math.floor(randomInt(robbedUser.wallet) * randomUnitInterval());

		// const winAmount = Math.floor(robbedUser.wallet * (Math.random() / 0.75));
		const lossAmount = Math.floor(randomInt(robber.wallet) * randomUnitInterval());

		if (randomUnitInterval() > 0.6) {
			await subtractFromWallet(interaction.user, lossAmount);
			await addToWallet(userToRob, lossAmount);

			const failedResponse = new MessageEmbed()
				.setDescription(`You failed to rob ${userToRob.toString()}, and lost **$${lossAmount}**!`)
				.setTitle('Rob Failed')
				.setColor('RED')
				.addField(
					`Your Balance`,
					codeBlock('diff', `- Before:  ${(robber.wallet + lossAmount).toLocaleString()}\n- After: ${robber.wallet.toLocaleString()}`),
					true
				)
				.addField(
					`${userToRob.tag}'s Balance`,
					codeBlock(
						'diff',
						`- Before:  ${(robbedUser.wallet - lossAmount).toLocaleString()}\n+ After: ${robbedUser.wallet.toLocaleString()}`
					),
					true
				);

			return void interaction.reply({ embeds: [failedResponse] });
		}
		void subtractFromWallet(userToRob, lossAmount);
		void addToWallet(interaction.user, lossAmount);

		const successResponse = new MessageEmbed()
			.setDescription(`You successfully robbed <@${userToRob.id}>, and gained **$${winAmount}**!`)
			.setTitle('Rob Successful')
			.setColor('GREEN')
			.addField(
				`Your Balance`,
				codeBlock('diff', `- Before:  ${(robber.wallet - winAmount).toLocaleString()}\n+ After: ${robber.wallet.toLocaleString()}`),
				true
			)
			.addField(
				`${userToRob.tag}'s Balance`,
				codeBlock('diff', `+ Before:  ${(robbedUser.wallet + winAmount).toLocaleString()}\n- After: ${robbedUser.wallet.toLocaleString()}`),
				true
			);

		return void interaction.reply({ embeds: [successResponse] });
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) => option.setName('user').setRequired(true).setDescription('The user to rob.')),
			{ idHints: ['944645803815866488'] }
		);
	}
}
