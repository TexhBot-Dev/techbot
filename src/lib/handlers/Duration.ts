import { Milliseconds } from '../../types/enums/Milliseconds.js';

export class Duration {
	public milliseconds: number;
	public seconds: number;
	public minutes: number;
	public hours: number;
	public days: number;
	public weeks: number;
	private stringified: string;

	public constructor(duration: string) {
		const dur = duration.includes('off')
			? '0'
			: duration
					.toLowerCase()
					.replace(/seconds?|secs?|minutes?|mins?|hours?|days?|weeks?/, (match) => match[0])
					.replace(/\s+/g, '');

		const hasUnit = isNaN(dur as any);
		const durationUnit = (hasUnit ? dur[dur.length - 1] : 's') as Unit;
		const durationNumber = parseInt(hasUnit ? dur.slice(0, -1) : dur, 10);

		this.milliseconds = this.unitToMilliseconds(durationUnit) * durationNumber;

		const ms = this.milliseconds;
		this.seconds = durationUnit === 's' ? durationNumber : ms / Milliseconds.Second;
		this.minutes = durationUnit === 'm' ? durationNumber : ms / Milliseconds.Minute;
		this.hours = durationUnit === 'h' ? durationNumber : ms / Milliseconds.Hour;
		this.days = durationUnit === 'd' ? durationNumber : ms / Milliseconds.Day;
		this.weeks = durationUnit === 'w' ? durationNumber : ms / Milliseconds.Week;
		this.stringified = durationNumber.toString() + durationUnit;
	}

	public toString() {
		return this.stringified;
	}

	private unitToMilliseconds(unit: Unit) {
		switch (unit) {
			case 'w':
				return Milliseconds.Week;
			case 'd':
				return Milliseconds.Day;
			case 'h':
				return Milliseconds.Hour;
			case 'm':
				return Milliseconds.Minute;
			case 's':
				return Milliseconds.Second;
			default:
				return 0;
		}
	}
}

type Unit = 'w' | 'd' | 'h' | 'm' | 's';
