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

1. From the repository root, create the D1 database:

   ```sh
   pnpm cf:d1:create
   ```

   Initialize the local configuration, then replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with the returned ID:

   ```sh
   pnpm cf:config:init
   ```

2. Apply the checked-in schema migration:

   ```sh
   pnpm cf:d1:migrate:remote
   ```

3. Create a Cloudflare Pages project from this GitHub repository. Set its root directory to `apps/web`, production branch to `main`, and build command to `pnpm build`. The adapter produces `.svelte-kit/cloudflare` as the output directory.

4. In the Pages project’s **Settings → Bindings**, add the D1 database binding named `NOMINATIONS_DB` for both preview and production. Redeploy after adding the binding.

Cloudflare Pages will then build and deploy every push to `main`. The nominations table contains the visitor’s name, two movie choices, and submission timestamp.

## Workspace scripts

Run these from the repository root:

| Script                      | Purpose                                                                        |
| --------------------------- | ------------------------------------------------------------------------------ |
| `pnpm cf:d1:create`         | Creates the remote `spooktoberfest-2026` D1 database.                          |
| `pnpm cf:config:init`       | Creates the ignored local Wrangler config without overwriting an existing one. |
| `pnpm cf:config:check`      | Verifies that the local Wrangler config has a real D1 ID.                      |
| `pnpm cf:d1:migrate:local`  | Applies migrations to Wrangler’s local D1 database.                            |
| `pnpm cf:d1:migrate:remote` | Applies migrations to the remote D1 database.                                  |
| `pnpm cf:dev`               | Builds the Pages Worker and starts the local Cloudflare Pages/D1 emulator.     |
| `pnpm cf:deploy`            | Builds and deploys production to `spooktoberfest-2026.pages.dev`.              |
| `pnpm cf:deploy:preview`    | Builds and deploys a preview to `preview.spooktoberfest-2026.pages.dev`.       |
