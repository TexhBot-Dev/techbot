import { ColorResolvable, MessageEmbed } from 'discord.js';

/**
 * Generates an error embed
 * @param error
 * @param errorType
 */
export const generateErrorEmbed = (error: string, errorType: string = ''): MessageEmbed => {
	const errType = errorType !== '' ? `: ${errorType}` : '';

	return generateEmbed(error, `Error${errType}`, '#ED4245');
};

/**
 * Generates an embed
 * @param description The description for the embed
 * @param title The title of the embed
 * @param color The color of the embed
 */
export const generateEmbed = (description: string, title: string, color: ColorResolvable = 'BLUE'): MessageEmbed => {
	return new MessageEmbed().setColor(color).setTitle(title).setDescription(description).setTimestamp();
};
