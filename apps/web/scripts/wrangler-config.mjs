import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const command = process.argv[2];
const configPath = resolve('apps/web/wrangler.jsonc');
const templatePath = resolve('apps/web/wrangler.example.jsonc');
const placeholder = 'REPLACE_WITH_YOUR_D1_DATABASE_ID';

if (command === 'init') {
	if (existsSync(configPath)) {
		console.error('apps/web/wrangler.jsonc already exists; it was not overwritten.');
		process.exit(1);
	}

	copyFileSync(templatePath, configPath);
	console.log(
		'Created apps/web/wrangler.jsonc. Replace REPLACE_WITH_YOUR_D1_DATABASE_ID with the ID returned by pnpm cf:d1:create.'
	);
	process.exit(0);
}

if (command === 'check') {
	if (!existsSync(configPath)) {
		console.error(
			'Cloudflare configuration is missing. Run pnpm cf:config:init, then replace its D1 database ID.'
		);
		process.exit(1);
	}

	if (readFileSync(configPath, 'utf8').includes(placeholder)) {
		console.error(
			'Cloudflare configuration still has the D1 ID placeholder. Run pnpm cf:d1:create and put its returned database ID in apps/web/wrangler.jsonc.'
		);
		process.exit(1);
	}

	process.exit(0);
}

console.error('Usage: node apps/web/scripts/wrangler-config.mjs <init|check>');
process.exit(1);
