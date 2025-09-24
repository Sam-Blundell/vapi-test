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
  - dob_year (integer)
  - dob_month (integer)
  - dob_day (integer)
  - national_id (text UNIQUE)

## API Endpoints
- POST /api/people  → create person
- GET /api/people/:id  → fetch by id
- GET /api/people?nationalId=...  → fetch by national_id

## Validation & Errors
- Zod-validated payloads; reject unknown fields; DOB split as numbers (year 1900..2100, month 1..12, day valid for month/year)
- 400: invalid input; 404: not found; 409: duplicate national_id
- JSON error shape: { code, message }

## Storage & Env
- SQLite file path via `DB_FILE` env (default `./data.db`)
- Drizzle schema + migrations (follow-up)

## Logging & Tests
- Log method, path, status, timing (existing middleware)
- Tests: create/fetch flows, invalid payloads, duplicate handling

## Status
- Implemented: SQLite schema, Zod validation, repo, Hono routes (POST/GET), tests passing, docs organized.

## Next Steps (tomorrow)
1) Centralize error handling and codes
2) Add API key auth + CORS for Vapi
3) Document curl examples and auth in docs
4) Optional: PUT /api/people/:id for corrections
5) Add /healthz with DB check
6) Draft minimal OpenAPI for /api/people
7) Plan DTMF flow for nationalId
