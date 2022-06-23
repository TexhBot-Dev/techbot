import { MessageLinkRegex } from '@sapphire/discord-utilities';
import type { Guild, Message } from 'discord.js';

export const parseMessageURL = async (url: string, guild: Guild) => {
	const groups = url.match(MessageLinkRegex)?.groups;
	if (!groups) return null;

	const channel = await guild.channels.fetch(groups.channelId);
	if (!channel || !channel.isText()) return null;

	const message = await channel.messages.fetch(groups.messageId);

	return message;
};

export const getMessageContent = (message: Message) => {
	return message.content || message.embeds[0]?.description;
};
