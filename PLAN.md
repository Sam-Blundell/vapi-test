# Plan: VAPI Voice Agent POC

## Purpose
- POC for a VAPI agent to capture person identity: first/middle/last names, date of birth, and national ID (SSN substitute), with CRUD access via Hono.

## Tech Decisions (from decision log)
- Runtime: Bun; Language: TypeScript; Framework: Hono
- Database: SQLite; ORM: Drizzle (planned)
- Validation: Zod; Testing: Bun test

## Data Model
- Table: people
  - id (integer PK)
  - first_name (text)
  - middle_names (text JSON array)
  - last_name (text)
  - dob (text, ISO-8601 date)
  - national_id (text UNIQUE)

## API Endpoints
- POST /api/people  → create person
- GET /api/people/:id  → fetch by id
- GET /api/people?nationalId=...  → fetch by national_id

## Validation & Errors
- Zod-validated payloads; reject unknown fields
- 400: invalid input; 404: not found; 409: duplicate national_id
- JSON error shape: { code, message }

## Storage & Env
- SQLite file path via `DB_FILE` env (default `./data.db`)
- Drizzle schema + migrations (follow-up)

## Logging & Tests
- Log method, path, status, timing (existing middleware)
- Tests: create/fetch flows, invalid payloads, duplicate handling

## Next Steps
1) Wire SQLite + Drizzle schema; 2) DAL; 3) Hono routes; 4) Tests; 5) Document endpoints; 6) Plan VAPI DTMF for sensitive inputs