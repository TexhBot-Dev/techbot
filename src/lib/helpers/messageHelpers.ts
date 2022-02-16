import { send } from "@sapphire/plugin-editable-commands";
import { Message, MessageEmbed } from "discord.js";
import { pickRandom } from "./arrayHelpers";
import { RandomLoadingMessage } from '../constants';

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export const sendLoadingMessage = (message: Message): Promise<typeof message> => {
    return send(message, { embeds: [new MessageEmbed().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
};
