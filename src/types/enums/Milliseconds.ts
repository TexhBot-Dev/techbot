/**
 * Enum for getting a normal time unit in milliseconds. Use this instead of magic numbers.
 * ```
 * Milliseconds.Second //1000
 * Milliseconds.Week * 3 //3 weeks in ms
 * Milliseconds.Fortnight //2 weeks in ms
 * Milliseconds.Minute * 30 //30 minutes in ms
 * ```
 */
export enum Milliseconds {
	Second = 1000,
	Minute = 60000,
	Hour = 3.6e6,
	Day = 8.64e7,
	Week = 6.048e8,
	Fortnight = 1.21e9,
	Month = 2.628e9
}
