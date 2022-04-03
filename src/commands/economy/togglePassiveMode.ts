import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser } from '../../lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'passiveModeToggle',
	description: 'Lets you disable/enable the ability to be robbed',
	detailedDescription: 'passivemodetoggle <bool>'
})
export default class TogglePassiveModeCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const newValue = interaction.options.getBoolean('new_mode');

		if (newValue === null) return interaction.reply('You need to specify a boolean!');

		fetchUser(interaction.user).then(async (user) => {
			if (user === null) return;

			await this.container.prisma.user.update({
				where: user,
				data: {
					passiveMode: newValue
				}
			});
		});

		return interaction.reply(`Your passive mode has been set to **${newValue}**!`);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) =>
					option
						.setName('new_mode')
						.setDescription('The new value of passive mode')
						.setRequired(true)
				), {idHints:['944645891107737730']}
		);
	}
}
