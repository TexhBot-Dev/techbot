import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { generateErrorEmbed, getMessageContent, parseMessageURL } from '#lib/helpers';
import { UserError } from '#root/lib/handlers/UserError';

@ApplyOptions<CommandOptions>({
	name: 'quote',
	description: 'Quotes a message from a message URL.',
	detailedDescription: '/quote <message_id>'
})
export class QuoteCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const messageURL = interaction.options.getString('message_url', true);

		const message = await parseMessageURL(messageURL, interaction.guild!);
		if (!message)
			return new UserError(interaction)
				.setType('INVALID_MESSAGE_URL')
				.sendResponse({ embeds: [generateErrorEmbed('Invalid message URL provided for parameter `message_url`.', 'Invalid Message URL')] });

		const content = getMessageContent(message);
		if (!content)
			return new UserError(interaction).setType('NO_MESSAGE_CONTENT').sendResponse({
				embeds: [generateErrorEmbed('The message provided exists, but contains no content or description.', 'No Message Content')]
			});

		const description = `${content}\n\n*[Source :arrow_up:](${messageURL})*`;

		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() ?? undefined })
					.setDescription(description)
					.setColor(message.author.accentColor ?? message.embeds[0]?.hexColor ?? 'BLUE')
					.setTimestamp(message.createdTimestamp)
			]
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((builder) => builder.setName('message_url').setDescription('The message URL to quote.').setRequired(true))
		),
			{ idHints: ['989623660690169908'] };
	}
}
