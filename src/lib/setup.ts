process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { rootDir } from './constants';

// Read env var
config({ path: join(rootDir, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

declare global {
	interface String {
		toProperCase(): string;
		toSnakeCase(): string;
	}
}
String.prototype.toProperCase = function (): string {
	return this.replace(/\w\S*/g, (txt: string): string => txt.charAt(0).toLocaleUpperCase() + txt.substring(1).toLocaleLowerCase());
};

String.prototype.toSnakeCase = function (): string {
	return this.toLowerCase().replaceAll(' ', '_');
};
