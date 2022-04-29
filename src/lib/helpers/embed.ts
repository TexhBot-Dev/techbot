import { ColorResolvable, MessageEmbed } from 'discord.js';

/**
 * Generates an error embed
 * @param error The error that is being thrown
 * @param errorType The type of error that is being thrown
 * @returns MessageEmbed
 * @example
 * ```ts
 * const embed = embedHelpers.errorEmbed(new Error('This is an error'), 'Error');
 * return interaction.reply({ embeds: [embed] });
 * ```
 */
export const generateErrorEmbed = (error: string, errorType: string): MessageEmbed => {
	const errType = errorType === '' ? '' : `: ${errorType}`;

	return generateEmbed(`Error${errType}`, error, '#ED4245');
};

/**
 * Generates an embed
 * @param title The title of the embed
 * @param description The description for the embed
 * @param color The color of the embed
 * @returns MessageEmbed
 * @example
 * ```ts
 * const embed = embedHelpers.errorEmbed(new Error('This is an error'), 'Error');
 * return interaction.reply({ embeds: [embed] });
 * ```
 */
export const generateEmbed = (title: string, description: string, color: ColorResolvable = 'BLUE'): MessageEmbed => {
	return new MessageEmbed().setColor(color).setTitle(title).setDescription(description).setTimestamp();
};
