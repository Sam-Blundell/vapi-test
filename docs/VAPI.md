# Vapi + Our Agent

## What is Vapi (overview)
- Voice AI platform for real-time phone/web conversations.
- Assistants = prompt + tools + structured outputs; Squads = multi-assistant orchestration.
- Integrates STT/LLM/TTS providers; supports tools (HTTP), DTMF, webhooks, and CLI.
- Docs: https://docs.vapi.ai/quickstart/introduction

## Our Agent (plan)
- Purpose: capture identity info (first/middle/last names, DOB Y/M/D, nationalId) and store/retrieve it.
- Flow: try GET by `nationalId`; on 404, POST to create; read back summary.
- Inputs: nationalId verbally now; later via DTMF for privacy.
- Auth: `API_KEY` (optional) via `x-api-key` or `Authorization: Bearer`; CORS allowlist via `CORS_ORIGINS`.

## API (for tools)
- Base URL: `http://localhost:${PORT || 3000}`; DB via `DB_FILE` (default `./data.db`).
- Endpoints:
  - POST `/api/people` → 201 | 400 | 409
  - GET `/api/people?nationalId=...` → 200 | 404 | 400
  - GET `/api/people/:id` → 200 | 404 | 400
- Payload fields: `firstName`, `middleNames[]`, `lastName`, `dobYear`, `dobMonth`, `dobDay`, `nationalId`.
- Errors: `{ code, message }` with codes: VALIDATION_ERROR, INVALID_ID, MISSING_QUERY, NOT_FOUND, DUPLICATE.

## Tool Schemas (suggested)
- get_person_by_national_id: { nationalId: string }
- create_person: { firstName: string; middleNames: string[]; lastName: string; dobYear: number; dobMonth: number; dobDay: number; nationalId: string }

## Testing Notes
- Outside US: use Web calls, or connect a local DID via Phone Number Hooks/SIP; or use a US VoIP/eSIM to dial the US number.
- Ngrok: browser calls should set header `ngrok-skip-browser-warning: true` and include your ngrok URL in `CORS_ORIGINS`.
- Local dev: set `DB_FILE=':memory:'` for ephemeral runs/tests; otherwise `./data.db`.

## Examples
- Create:
  curl -sS -X POST localhost:3000/api/people -H 'content-type: application/json' -d '{"firstName":"Ada","middleNames":["Lovelace"],"lastName":"Byron","dobYear":1990,"dobMonth":12,"dobDay":10,"nationalId":"ID-123"}'
- Read:
  curl -sS 'localhost:3000/api/people?nationalId=ID-123'
