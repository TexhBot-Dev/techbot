import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchUser, replacer } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	name: 'clapify',
	aliases: ['clapfy'],
	description: 'Clapify your text.',
	detailedDescription: 'clapify <text>'
})
export default class clapifyCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const text = interaction.options.getString('text') as string;
		const user = await fetchUser(interaction.user);
		const emoji = replacer(
			user.preferredEmojiColor,
			{
				default: '👏',
				pale: '👏🏻',
				cream_white: '👏🏼',
				brown: '👏🏽',
				dark_brown: '👏🏾',
				black: '👏🏿'
			},
			'g'
		);

		return interaction.reply(text.replace(/\s+/g, ` ${emoji} `));
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('text').setDescription('The text to clapify.').setRequired(true)
				)
		);
	}
}
