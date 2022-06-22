import { randomFillSync } from 'node:crypto';

/**
 * Returns a cryptographically secure random number between 0 and 1.
 * @deprecated Use `Math.random()` instead. This function is only here for legacy purposes. We decided to not make the bot cryptographically secure as it puts ona cost on performance, and really it's unneeded.
 */
export function randomUnitInterval(): number {
	const intArr = new Uint32Array(2);
	randomFillSync(intArr);
	const mantissa = intArr[0] * Math.pow(2, 20) + (intArr[1] >>> 12);
	return mantissa * Math.pow(2, -52);
}

/**
 * Generate a random number between `min` and `max`.
 * @param min The minimum amount.
 * @param max The maximum amount.
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
