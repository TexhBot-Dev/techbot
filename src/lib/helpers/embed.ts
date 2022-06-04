import { ColorResolvable, MessageEmbed } from 'discord.js';

/**
 * Generates an error embed
 * @param error The error that is being thrown
 * @param errorType The type of error that is being thrown
 * @returns MessageEmbed
 * @example
 * ```ts
 * const embed = generateErrorEmbed(new Error('This is an error'), 'Error');
 * return interaction.reply({ embeds: [embed] });
 * ```
 */
export const generateErrorEmbed = (errorDescription: string, errorType: string): MessageEmbed => {
	return generateEmbed(errorType ? `Error: ${errorType}` : 'Error', errorDescription, '#ED4245');
};

/**
 * Generates an embed
 * @param title The title of the embed
 * @param description The description for the embed
 * @param color The color of the embed
 * @returns MessageEmbed
 * @example
 * ```ts
 * const embed = generateEmbed('Title', 'Description', 'BLURPLE');
 * return interaction.reply({ embeds: [embed] });
 * ```
 */
export const generateEmbed = (title: string, description: string, color: ColorResolvable = 'BLUE'): MessageEmbed => {
	return new MessageEmbed().setColor(color).setTitle(title).setDescription(description).setTimestamp();
};
