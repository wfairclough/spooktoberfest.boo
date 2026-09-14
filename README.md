# Spooktoberfest 2026

The fresh 2026 home for nominating spooky and horror films.

## Requirements

- Node 26 (managed with nvm)
- pnpm 12

## Development

```sh
nvm use
pnpm install
pnpm dev
```

## Cloudflare deployment

The app deploys to Cloudflare Pages and stores submitted nominations in Cloudflare D1.
See [`apps/web/README.md`](apps/web/README.md) for the one-time D1 setup and deployment steps.
