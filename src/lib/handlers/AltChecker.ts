import type { TrustFactor } from '#root/commands/moderation/altCheck';
import { Milliseconds } from '#root/types/enums/Milliseconds';
import type { Guild, User } from 'discord.js';
import { getCommonChars } from '#lib/helpers';

/**
 * Returns the trust factor of a user.
 * @param target The user to check.
 * @param guild The guild to check this user in.
 */
export async function check(target: User, guild: Guild): Promise<TrustFactor> {
	// If the user has flags which signify they are legit, make them very trusted.
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

	const members = (await guild.members.fetch()).toJSON();
	const usernameMatches: UsernameMatchType[] = [];

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

type UsernameMatchType = 'EXACT' | 'VERY_CLOSE' | 'CLOSE' | 'NONE';
