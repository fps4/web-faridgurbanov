# Repository Guidelines

## Project Structure & Module Organization
- Next.js routes and layouts live in `src/app`; locale variants sit in `src/app/[lang]`.
- Shared building blocks live in `src/components`, with feature sections in `src/sections` and wrappers in `src/layouts`.
- Data helpers and API clients reside in `src/actions`, `src/lib`, and `src/utils`; theming lives in `src/theme`.
- Editable copy is grouped under `content/<locale>`; static assets stay in `public/`; automation scripts belong to `scripts/`.

## Build, Test, and Development Commands
- `yarn dev`: run the Turbopack dev server on port 3033.
- `yarn build` / `yarn start`: create the production bundle and serve it for smoke checks.
- `yarn lint`, `yarn lint:fix`: audit or auto-fix ESLint issues across `src/`.
- `yarn fm:check`, `yarn fm:fix`, `yarn fix:all`: apply Prettier formatting; run before reviews.
- `yarn clean`: clear `.next`, `out`, and cached artifacts when diagnosing odd behavior.

## Coding Style & Naming Conventions
- Prettier (see `prettier.config.mjs`) enforces 2-space indent, single quotes, and trailing commas; never hand-format.
- ESLint (`eslint.config.mjs`) requires sorted imports, React hook compliance, and no unused code.
- Use PascalCase for components, camelCase for hooks/utilities, and lowercase-kebab for files and directories unless exporting a component shell.

## Testing Guidelines
- No automated suite ships yet; when you add tests, place `*.test.tsx` alongside the component or under `src/__tests__`.
- Favor React Testing Library with Vitest or Jest, mirroring our React 19 stack and mocking HTTP via MSW.
- Before opening a PR, smoke-test `yarn dev` across locales, verify Auth0 login, theme toggles, and any data-table flows you touched.

## Commit & Pull Request Guidelines
- Recent history uses short, lower-case imperatives (example: `adding project columns to the home page`); stay consistent and keep subjects under ~60 characters.
- Bundle related updates per commit, include a body when touching config or build scripts, and mention follow-up tasks if anything ships incomplete.
- PRs should link to issues/specs, call out environment/config changes (Auth0, S3, sitemap), and include before/after visuals for UI work plus manual test notes.

## Content & Localization Notes
- Update locale files in `content/<locale>` together with any keys in `src/locales`; rerun `yarn build` so `checksums.json` stays accurate.
- Validate copy alignment in both LTR and RTL modes via the in-app Settings drawer before merging.
