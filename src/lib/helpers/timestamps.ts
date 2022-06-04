/**
 * Converts milliseconds to a unix timestamp represented in seconds. Milliseconds must be relative to 1970 epoch.
 * @param ms The milliseconds to convert.
 */
export function toTimestamp(ms: number) {
	return Math.floor(ms / 1000);
}
