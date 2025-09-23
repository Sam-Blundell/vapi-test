# Agent Guidelines

## Build/Run/Lint/Test
- Install: `bun install`
- Dev server: `bun run dev` (runs `src/index.ts`)
- Run once: `bun run src/index.ts`
- Type check (lint): `bunx tsc -p tsconfig.json --noEmit`
- All tests: `bun test`
- Single file: `bun test src/path/to/file.test.ts`
- Single test name: `bun test -t "test name"`

## Code Style
- Runtime/Framework: Bun + TypeScript, Hono HTTP server.
- Imports: ESM; include `.ts` for local files (`import x from './server.ts`).
- Formatting: 2-space indent, semicolons, single quotes; keep lines < 100 cols.
- Types: `strict` TS; prefer explicit types, `unknown` over `any`, narrow with Zod where applicable.
- Naming: `camelCase` for vars/functions, `PascalCase` for types/classes, `UPPER_SNAKE_CASE` for env keys.
- Errors: Return JSON via `c.json(...)` with proper status; avoid throwing for expected 4xx; include message and code.
- Logging: Log method, path, status, and timing (existing middleware).
- Routes: `/health` returns `ok`; 404 uses `app.notFound` JSON payload.
- Env: Read via `process.env`; parse numbers (e.g., `PORT`) safely.
- Cursor/Copilot: No repo rules found; follow this guide.