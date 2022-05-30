import { promises } from 'fs';
import { join, resolve } from 'path';

async function* walk(dir) {
	for await (const d of await promises.opendir(dir)) {
		const entry = join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

for await (const p of walk(resolve('./src/commands'))) {
	const contents = await promises.readFile(p, { encoding: 'utf8' });
	promises.writeFile(p, contents.replace(/console\.[a-zA-Z]+\([^\)]+\);?/g, ''));
}
