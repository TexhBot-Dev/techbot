import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { generateEmbed } from '#lib/helpers';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'Get help with the bot or a certain command.',
	detailedDescription: '/help [command]'
})
export default class HelpCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const specifiedCommand = interaction.options.getString('specific_command', false);
		const commands = this.container.stores.get('commands');

		if (specifiedCommand !== null) {
			const command = commands.find((c) => c.name === specifiedCommand.toLowerCase() || c.name.startsWith(specifiedCommand.toLowerCase()));
			if (command === undefined) return interaction.reply('That command does not exist!');

			return interaction.reply({ embeds: [generateEmbed(command.name.toTitleCase(), command.description)] });
		}

		const { categories } = commands;
		const paginatedMessage = new PaginatedMessage({
			template: new MessageEmbed().setTitle('Help').setColor('BLUE')
		});

		for (const category of categories) {
			const fields: { name: string; value: any }[] = [];

			// Filter commands into categories and take into account sub categories
			const filteredCommands = commands.filter(
				(c) => String(c.fullCategory) === category || String(c.fullCategory[c.fullCategory.length]) === category[category.length]
			);
			for (const [_, command] of filteredCommands) {
				fields.push({
					name: command.name,
					value: command.description
				});
			}

			paginatedMessage.addPageEmbed((embed) => {
				return embed.setTitle(category.toTitleCase()).setDescription(fields.map((f) => `${f.name.toTitleCase()}: ${f.value}`).join('\n'));
			});
		}

		return paginatedMessage.run(interaction, interaction.user);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option.setName('specific_command').setDescription('The command to get help for.').setAutocomplete(true)
					),
			{ idHints: ['977784995722715136'] }
		);
	}
}
