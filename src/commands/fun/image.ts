import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	name: 'image',
	description: 'Image generation and manipulation.',
	detailedDescription: 'image <subcommand> [...options]'
})
export default class ImageCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case 'random': {
				const imageMeta = {
					width: interaction.options.getInteger('width') ?? 512,
					height: interaction.options.getInteger('height') ?? 1024,
					grayscale: interaction.options.getBoolean('grayscale') ?? false
				};

				const response = new MessageEmbed()
					.setTitle("Here's your image")
					.setImage(`https://picsum.photos/${imageMeta.width}/${imageMeta.height}/${imageMeta.grayscale ? '?grayscale' : ''}`)
					.setColor('BLUE');
				interaction.reply({ embeds: [response] });
			}
		}
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('random')
							.setDescription('Fetch a random image.')
							.addIntegerOption((option) => option.setName('width').setDescription('The width of the random image.').setRequired(false))
							.addIntegerOption((option) =>
								option.setName('height').setDescription('The height of the random image.').setRequired(false)
							)
							.addBooleanOption((option) =>
								option
									.setName('grayscale')
									.setDescription('Whether the random image should be grayscale. Default is false.')
									.setRequired(false)
							)
					),
			{ idHints: ['967049211956830290'] }
		);
	}
}
