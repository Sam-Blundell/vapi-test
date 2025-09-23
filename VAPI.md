# VAPI Integration Guide

Purpose: Help agents (and humans) use our API with Vapi assistants.

## Base Config
- Base URL: `http://localhost:${PORT || 3000}`
- Env: `DB_FILE` (default `./data.db`)
- Planned: `API_KEY` header + CORS allowlist for Vapi origin

## Person Model (API shape)
- Fields: `id`, `firstName`, `middleNames[]`, `lastName`, `dobYear`, `dobMonth`, `dobDay`, `nationalId`
- DOB rules: `dobYear 1900..2100`, `dobMonth 1..12`, `dobDay` valid for month/year

## Endpoints
- POST `/api/people`
  - Body: `{ firstName, middleNames[], lastName, dobYear, dobMonth, dobDay, nationalId }`
  - 201 with person; 400 validation; 409 duplicate `nationalId`
- GET `/api/people?nationalId=...`
  - 200 with person; 404 not found; 400 missing query
- GET `/api/people/:id`
  - 200 with person; 400 invalid id; 404 not found

## Tool Definitions (for Vapi Assistant)
- get_person_by_national_id
```json
{
  "name": "get_person_by_national_id",
  "description": "Fetch a person by nationalId",
  "parameters": {
    "type": "object",
    "properties": { "nationalId": { "type": "string" } },
    "required": ["nationalId"]
  }
}
```
- create_person
```json
{
  "name": "create_person",
  "description": "Create a person record",
  "parameters": {
    "type": "object",
    "properties": {
      "firstName": { "type": "string" },
      "middleNames": { "type": "array", "items": { "type": "string" } },
      "lastName": { "type": "string" },
      "dobYear": { "type": "integer", "minimum": 1900, "maximum": 2100 },
      "dobMonth": { "type": "integer", "minimum": 1, "maximum": 12 },
      "dobDay": { "type": "integer", "minimum": 1, "maximum": 31 },
      "nationalId": { "type": "string" }
    },
    "required": ["firstName","lastName","dobYear","dobMonth","dobDay","nationalId"]
  }
}
```

## Suggested Agent Flow
- Step 1: Ask for names (first, optional middle list, last), DOB (Y/M/D), and nationalId. Read back to confirm.
- Step 2: Call `get_person_by_national_id`; if 404, call `create_person`; if 409 on create, fetch existing and continue.
- Step 3: Summarize stored person back to the caller.
- Future: Collect `nationalId` via DTMF.

## Error Shape
- JSON: `{ code, message }`
- Codes: `VALIDATION_ERROR`(400), `INVALID_ID`(400), `MISSING_QUERY`(400), `NOT_FOUND`(404), `DUPLICATE`(409)

## Examples
- Create:
```bash
curl -sS -X POST localhost:3000/api/people \
  -H 'content-type: application/json' \
  -d '{"firstName":"Ada","middleNames":["Lovelace"],"lastName":"Byron","dobYear":1990,"dobMonth":12,"dobDay":10,"nationalId":"ID-123"}'
```
- Read:
```bash
curl -sS 'localhost:3000/api/people?nationalId=ID-123'
```
