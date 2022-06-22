import { randomUnitInterval } from '#lib/helpers';

export {};
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
String.prototype.toSnakeCase = function () {
	return this.trim().toLowerCase().replace(/\s+/g, '_');
};

String.prototype.toTitleCase = function () {
	return String(
		this.replaceAll('_', ' ')
			.toLowerCase()
			.replace(/\b(\w)/g, (s) => s.toUpperCase())
	);
};

String.prototype.toConstantCase = function () {
	return this.replace(/\s/g, '_').toLocaleUpperCase();
};

String.prototype.truncate = function (max: number, addEllipsis: boolean = true) {
	return (this.length > max ? this.substring(0, max) + (addEllipsis ? '...' : '') : this) as string;
};

Array.prototype.randomElement = function <T>(): T {
	return this[Math.floor(Math.random() * this.length)];
};

declare global {
	interface String {
		toTitleCase(): string;
		toSnakeCase(): string;
		toConstantCase(): string;
		truncate(max: number, addEllipsis?: boolean): string;
	}
	interface Array<T> {
		randomElement(): T;
	}
}
