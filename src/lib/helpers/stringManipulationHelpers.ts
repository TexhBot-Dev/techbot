import type { SapphireClient } from '@sapphire/framework';

/**
 * Cleans text of naughty stuff
 * @param text
 * @param client
 */
export const clean = (text: string, client: SapphireClient): string => {
	return text
		.replace(/@everyone|@here|<@&?(\d{17,19})>/gim, '<mention>')
		.replace(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gim, '<link>')
		.replaceAll(client.token as string, '');
};

/**
 * Replaces stuff in text
 * @param string
 * @param object
 * @param regexFlag
 */
export const replacer = (string: string, object: object, regexFlag: string = ''): string => {
	for (const [key, value] of Object.entries(object)) {
		let reg = new RegExp(key, regexFlag);
		string = string.replace(reg, value);
	}
	return string;
};

export const pluralize = (text: string, num: number, suffix: string = 's'): string => {
	return text + (num !== 1 ? suffix : '');
};
