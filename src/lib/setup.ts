/* eslint-disable func-names */
/* eslint-disable no-extend-native */
process.env.NODE_ENV ??= 'development';

import { container } from '@sapphire/framework';
import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'node:path';
import { inspect } from 'node:util';
import { rootDir } from './constants';
import { randomInt, randomUnitInterval } from './helpers';

// Read env var
config({ path: join(rootDir, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

setInterval(async () => {
	(await container.prisma.pet.findMany()).forEach(async (pet) => {
		if (pet.hunger < 0) {
			await container.prisma.pet.delete({
				where: {
					userID_petType: {
						petType: pet.petType,
						userID: pet.userID
					}
				}
			});

			if (container.client.isReady()) {
				void (await container.client.users.fetch(pet.userID)).send({
					content: `Your pet ${pet.name} has died of hunger because **you** neglected to feed it.`
				});
			}
		}
		// check if pet.lastFed has been over a day
		if (pet.lastFed.getTime() + 86400000 < Date.now()) {
			const hunger = pet.hunger - randomInt(1, 3);
			// If it has, subtract from pet.hunger
			await container.prisma.pet.update({
				where: {
					userID_petType: {
						petType: pet.petType,
						userID: pet.userID
					}
				},
				data: {
					hunger
				}
			});

			void (await container.client.users.fetch(pet.userID)).send({
				content: `Your pet ${pet.name} has lost ${hunger} points because you forgot to feed it!.`
			});
		}
	});
}, 86_400_000);

// Enable colorette
colorette.createColors({ useColor: true });

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
