import { randomUnitInterval } from '#lib/helpers';

export {};
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
String.prototype.toSnakeCase = function () {
	return this.trim().toLowerCase().replace(/\s+/g, '_');
};

String.prototype.toProperCase = function () {
	return String(
		this.replaceAll('_', ' ')
			.toLowerCase()
			.replace(/\b(\w)/g, (s) => s.toUpperCase())
	);
};

String.prototype.toConstantCase = function () {
	return this.replace(/\s/g, '_').toLocaleUpperCase();
};

Array.prototype.randomElement = function <T>(): T {
	return this[Math.floor(randomUnitInterval() * this.length)];
};

declare global {
	interface String {
		toProperCase(): string;
		toSnakeCase(): string;
		toConstantCase(): string;
	}
	interface Array<T> {
		randomElement(): T;
	}
}
