// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { srcDir } from './constants';
// Setup TypeORM

// Read env var
config({ path: join(srcDir, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

declare global {
	interface String {
		toProperCase(): string;

		owoify(): string;
	}
}

String.prototype.toProperCase = function (): string {
	return this.replace(/\w\S*/g, (txt: string): string => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
};

String.prototype.owoify = function (): string {
	return this.replace(/r/g, 'w')
		.replace(/R/g, 'W')
		.replace(/l/g, 'w')
		.replace(/L/g, 'W')
		.replace(/n/g, 'ny')
		.replace(/N/g, 'Ny')
		.replace(/\?/g, '？')
		.replace(/!/g, '！')
		.replace(/\s/g, '  ');
};
