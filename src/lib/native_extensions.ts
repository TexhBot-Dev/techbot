import { randomUnitInterval } from './helpers/index.js';

export {};
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
String.prototype.toSnakeCase = function () {
	return (
		this.split(' ')
			.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
			.join(' ') ?? this
	);
};

String.prototype.remove = function (str) {
	if (!Array.isArray(str)) return this.replaceAll(str, '') || '';
	for (let i = 0; str.length !== i; i++) {
		str = this.replaceAll(str[i], '');
	}
	return String(str) || '';
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

Array.prototype.randomElement = function (): any {
	return this[Math.floor(randomUnitInterval() * this.length)];
};

declare global {
	interface String {
		toProperCase(): string;
		toSnakeCase(): string;
		toConstantCase(): string;
		remove(strsToRemove: string[] | string): string;
	}
	interface Array<T> {
		randomElement(): any;
	}
}
