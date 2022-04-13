import { ColorResolvable, MessageEmbed, MessageEmbedOptions } from 'discord.js';

/**
 * Generates an error embed
 * @param error The error that is being thrown
 * @param errorType The type of error that is being thrown
 * @param ExtraEmbedOptions Extra options for the embed
 * @returns MessageEmbed
 * @example
 * ```ts
 * const embed = embedHelpers.errorEmbed(new Error('This is an error'), 'Error');
 * return interaction.reply({ embeds: [embed] });
 * ```
 */
export const generateErrorEmbed = (error: string, errorType: string = '', ExtraEmbedOptions?: MessageEmbedOptions): MessageEmbed => {
	const errType = errorType !== '' ? `: ${errorType}` : '';

	return generateEmbed(`Error${errType}`, error, '#ED4245', ExtraEmbedOptions);
};

/**
 * Generates an embed
 * @param title The title of the embed
 * @param description The description for the embed
 * @param color The color of the embed
 * @param ExtraEmbedOptions? any extra options you want to add to the embed
 * @returns MessageEmbed
 * @example
 * ```ts
 * const embed = embedHelpers.errorEmbed(new Error('This is an error'), 'Error');
 * return interaction.reply({ embeds: [embed] });
 * ```
 */
export const generateEmbed = (
	title: string,
	description: string,
	color: ColorResolvable = 'BLUE',
	ExtraEmbedOptions?: MessageEmbedOptions
): MessageEmbed => {
	return new MessageEmbed(ExtraEmbedOptions).setColor(color).setTitle(title).setDescription(description).setTimestamp();
};
