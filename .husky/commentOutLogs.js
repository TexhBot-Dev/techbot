import { promises } from 'fs';
import { join, resolve } from 'path';
import { pluralize } from "#lib/helpers";

console.info("Removing console.logs...");

async function* walk(dir) {
	for await (const d of await promises.opendir(dir)) {
		const entry = join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

let replacedCount = 0;
for await (const p of walk(resolve('./src/commands'))) {
	const contents = await promises.readFile(p, { encoding: 'utf8' });
	promises.writeFile(p, contents.replace(/(console\.[a-zA-Z]+\([^\)]+\);?)/g, (match) => {
		replacedCount++
		return "// " + match;
	}));
}


console.info(replacedCount !== 0 ? `Commented out ${replacedCount} ${pluralize('console.log', replacedCount)}. Consider removing them completely.` : `Awesome! There were no console.logs found.`)