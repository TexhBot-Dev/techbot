import crypto from 'crypto';

/**
 * Returns a cryptographically secure random number between 0 and 1.
 */
export function randomUnitInterval(): number {
	const intArr = new Uint32Array(2);
	crypto.randomFillSync(intArr);
	const mantissa = intArr[0] * Math.pow(2, 20) + (intArr[1] >>> 12);
	return mantissa * Math.pow(2, -52);
}
