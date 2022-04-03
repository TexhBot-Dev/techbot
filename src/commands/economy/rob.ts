import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser, generateErrorEmbed } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'rob',
	description: 'Lets you rob another user\'s bank account.',
	detailedDescription: 'rob <user>'
})
export default class RobCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const userToRob = interaction.options.getUser('user')!;
		if (!interaction.inGuild())
			return interaction.reply({
				embeds: [generateErrorEmbed('Please use this command in a server.', 'Guild Only Command')],
				ephemeral: true
			});

		if (interaction.user.id === userToRob.id) {
			return interaction.reply({
				embeds: [generateErrorEmbed('You can\'t rob yourself.', 'Invalid User')],
				ephemeral: true
			});
		}

		if (userToRob.bot) {
			return interaction.reply({
				embeds: [generateErrorEmbed('You can\'t rob bots!', 'Invalid User')],
				ephemeral: true
			});
		}

		const robbedUser = await fetchUser(userToRob);
		const robber = await fetchUser(interaction.user);

		if (robbedUser.passiveMode) {
			return interaction.reply({
				embeds: [
					generateErrorEmbed(
						`<@${userToRob.id}> is in passive mode. Leave them alone!`,
						'User is in Passive Mode'
					)
				],
				ephemeral: true
			});
		}

		if (robber.passiveMode) {
			return interaction.reply({
				embeds: [generateErrorEmbed('You can\'t rob while in passive mode!', 'Passive Mode Enabled')],
				ephemeral: true
			});
		}

		const winAmount = Math.floor(robbedUser.wallet * (Math.random() / 0.75));
		const lossAmount = Math.floor(robber.wallet * (Math.random() / 0.75));

		if (Math.random() > 0.6) {
			await this.container.prisma.user.update({
				where: {
					id: robber.id
				},
				data: {
					wallet: robber.wallet - lossAmount
				}
			});

			await this.container.prisma.user.update({
				where: {
					id: robbedUser.id
				},
				data: {
					wallet: robber.wallet + lossAmount
				}
			});

			const failedResponse = new MessageEmbed()
				.setDescription(`You failed to rob <@${userToRob.id}>, and lost **$${lossAmount}**!`)
				.setTitle('Rob Failed')
				.setColor('RED')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robber.wallet + lossAmount
					).toLocaleString()}\n- After: ${robber.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${userToRob.tag}'s Balance`,
					`\`\`\`diff\n- Before:  ${(
						robbedUser.wallet - lossAmount
					).toLocaleString()}\n+ After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);

			return interaction.reply({ embeds: [failedResponse] });
		} else {
			await this.container.prisma.user.update({
				where: {
					id: robber.id
				},
				data: {
					wallet: robber.wallet + lossAmount
				}
			});

			await this.container.prisma.user.update({
				where: {
					id: robbedUser.id
				},
				data: {
					wallet: robber.wallet - lossAmount
				}
			});

			const successResponse = new MessageEmbed()
				.setDescription(`You successfully robbed <@${userToRob.id}>, and gained **$${winAmount}**!`)
				.setTitle('Rob Successful')
				.setColor('GREEN')
				.addField(
					`Your Balance`,
					`\`\`\`diff\n- Before:  ${(
						robber.wallet - winAmount
					).toLocaleString()}\n+ After: ${robber.wallet.toLocaleString()}\`\`\``,
					true
				)
				.addField(
					`${userToRob.tag}'s Balance`,
					`\`\`\`diff\n+ Before:  ${(
						robbedUser.wallet + winAmount
					).toLocaleString()}\n- After: ${robbedUser.wallet.toLocaleString()}\`\`\``,
					true
				);

			return interaction.reply({ embeds: [successResponse] });
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option.setName('user').setRequired(true).setDescription('The user to rob.')
				), {idHints:['944645803815866488']}
		);
	}
}
