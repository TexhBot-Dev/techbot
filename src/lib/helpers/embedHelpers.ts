import { ColorResolvable, MessageEmbed } from "discord.js";

/**
 * Generates an error embed
 * @param error
 * @param errorType
 */
export const generateErrorEmbed = (error: string, errorType: string = ''): MessageEmbed => {
    const errType = errorType !== '' ? `: ${errorType}` : '';

    return new MessageEmbed()
        .setColor('#ED4245')
        .setTitle(`Error${errType}`)
        .setDescription(error);
};

/**
 * Generates an embed
 * @param description
 * @param title
 * @param color
 */
export const generateEmbed = (
    description: string,
    title: string,
    color: ColorResolvable = 'BLUE'
): MessageEmbed => {
    return new MessageEmbed().setColor(color).setTitle(title).setDescription(description);
};
