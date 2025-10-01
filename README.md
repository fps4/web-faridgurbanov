## Frontend

Next.js application for the FPS Delivery Hub. This package contains the customer-facing UI, supporting docs/diagrams, and build tooling.

What’s here

- `src/` app code and UI components
- `public/` static assets
- `content/` website content in text (i18n)
- `scripts/` helper scripts (translation, etc)
- Config: `next.config.mjs`, `eslint.config.mjs`, `prettier.config.mjs`, `next-sitemap.config.js`
- `Dockerfile` for containerized builds

Requirements

- Node `>=22` (see `package.json:engines`)
- Yarn Classic (`yarn@1.x`) — repository includes `yarn.lock`

Quick start

```bash
yarn install
yarn dev   # http://localhost:3033 (Turbopack)

# Production build
yarn build
yarn start # serves on :3033

# Lint & format
yarn lint
yarn fm:check
```

Notes

- `postbuild` runs `next-sitemap` to generate sitemaps from `next-sitemap.config.js`.
- If environment variables are required, create a `.env.local` with the needed keys (check code and configs for references).
- For Docker, build with `docker build -t delivery-hub-frontend .` and run with `docker run -p 3033:3033 delivery-hub-frontend`.
