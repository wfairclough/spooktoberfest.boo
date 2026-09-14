# Spooktoberfest 2026 web app

The SvelteKit app is configured for Cloudflare Pages. Submitted nomination records are stored in a Cloudflare D1 (SQLite) database; the browser cookie only remembers that a guest has already nominated.

## Local development

```sh
nvm use
pnpm install
pnpm dev
```

Without a D1 binding, local development still permits a nomination flow but does not persist the record. Use Wrangler after configuring D1 to test the full production path.

## One-time Cloudflare setup

1. Copy `wrangler.example.jsonc` to `wrangler.jsonc` and replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with the ID returned by:

   ```sh
   pnpm exec wrangler d1 create spooktoberfest-2026
   ```

2. Apply the checked-in schema migration:

   ```sh
   pnpm exec wrangler d1 migrations apply spooktoberfest-2026 --remote
   ```

3. Create a Cloudflare Pages project from this GitHub repository. Set its root directory to `apps/web`, production branch to `main`, and build command to `pnpm build`. The adapter produces `.svelte-kit/cloudflare` as the output directory.

4. In the Pages project’s **Settings → Bindings**, add the D1 database binding named `NOMINATIONS_DB` for both preview and production. Redeploy after adding the binding.

Cloudflare Pages will then build and deploy every push to `main`. The nominations table contains the visitor’s name, two movie choices, and submission timestamp.
