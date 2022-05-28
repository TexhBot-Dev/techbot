import type { TrustFactor } from '#root/commands/moderation/alts/altCheck';
import { Milliseconds } from '#root/types/enums/Milliseconds';
import type { Guild, User } from 'discord.js';

export async function check(target: User, guild: Guild): Promise<TrustFactor> {
	//If the user has flags which signify they are legit, make them very trusted.
	const targetFlags = target.flags!;
	if (
		targetFlags.has('DISCORD_CERTIFIED_MODERATOR') ||
		targetFlags.has('EARLY_SUPPORTER') ||
		targetFlags.has('DISCORD_EMPLOYEE') ||
		targetFlags.has('PARTNERED_SERVER_OWNER') ||
		targetFlags.has('BUGHUNTER_LEVEL_1') ||
		targetFlags.has('BUGHUNTER_LEVEL_2') ||
		targetFlags.has('EARLY_VERIFIED_BOT_DEVELOPER')
	)
		return 3;

	const sinceCreationTimestamp = Date.now() - target.createdTimestamp;
	console.log(sinceCreationTimestamp);

	const members = (await guild.members.fetch()).toJSON();
	let usernameMatches: UsernameMatchType[] = [];

	if (target.username.length > 3) {
		for (let i = 0, len = members.length; i < len; i++) {
			if (members[i].user.id === target.id) continue;
			const username = members[i].user.username.toLowerCase();
			const targetUsername = target.username.toLowerCase();

			if (username === targetUsername) {
				usernameMatches.push('EXACT');
			} else if (
				username.startsWith(targetUsername) &&
				username.endsWith(targetUsername) &&
				getCommonChars(username, targetUsername).length > Math.ceil(targetUsername.length / 1.4)
			) {
				usernameMatches.push('VERY_CLOSE');
			} else if (getCommonChars(username, targetUsername).length > Math.ceil(targetUsername.length / 2) && username.length > 3) {
				usernameMatches.push('CLOSE');
			}
		}
	}

	let trustFactor: TrustFactor;
	if (sinceCreationTimestamp < Milliseconds.Day * 2 || target.username.toLowerCase().includes('alt')) {
		trustFactor = 0;
	} else if (sinceCreationTimestamp < Milliseconds.Fortnight) {
		trustFactor = usernameMatches.some((el) => el === 'EXACT' || el === 'VERY_CLOSE') ? 0 : 1;
	} else if (sinceCreationTimestamp < Milliseconds.Month * 6) {
		trustFactor = usernameMatches.some((el) => el === 'EXACT' || el === 'VERY_CLOSE') ? 1 : 2;
	} else {
		trustFactor = usernameMatches.some((el) => el === 'VERY_CLOSE' || el === 'EXACT') ? 2 : 3;
	}

	return trustFactor;
}

/**
 * Returns an array of characters which both strings share at the same index.
 * ```
 * getCommonChars('huff', 'puff') //['f', 'f']
 * getCommonChars('rough', 'cough') //['o', 'u', 'g', 'h']
 * ```
 * @param str1 The string to compare to str2.
 * @param str2 The string to compare to str1.
 * @returns string[]
 */
function getCommonChars(str1: string, str2: string): string[] {
	return str1.split('').filter((char: string, i: number) => char === str2[i]);
}

type UsernameMatchType = 'EXACT' | 'VERY_CLOSE' | 'CLOSE' | 'NONE';
