import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

@ApplyOptions<CommandOptions>({
	name: 'image',
	description: 'Image generation and manipulation.',
	detailedDescription: 'image <subcommand> [...options]'
})
export default class ImageCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case 'random': {
				const imageMeta: ImageMeta = {
					width: interaction.options.getInteger('width') || 500,
					height: interaction.options.getInteger('height') || 500,
					grayscale: interaction.options.getBoolean('grayscale') ?? false
				};
				const image = await fetch(
					`https://picsum.photos/${imageMeta.width}/${imageMeta.height}/` + imageMeta.grayscale ? '?grayscale' : '',
					{
						headers: {
							'User-Agent': 'PepeBoy/1.0; Greysilly#8813',
							'X-Identity': 'PepeBoy/1.0; Greysilly#8813'
						}
					},
					FetchResultTypes.Buffer
				);
				console.log(image);

				const response = new MessageEmbed().setTitle("Here's your image").setImage(image.toString()).setColor('BLUE');
				interaction.reply({ embeds: [response] });
			}
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
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

interface ImageMeta {
	width: number;
	height: number;
	grayscale: boolean;
}
