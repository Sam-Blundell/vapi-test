import { Hono } from 'hono';
import { personInputSchema, personOutputSchema } from './schemas.ts';
import { getPersonById, getPersonByNationalId, insertPerson } from './repo.ts';

const api = new Hono();

api.post('/people', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = personInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ code: 'VALIDATION_ERROR', message: parsed.error.message }, 400);
  }
  const input = parsed.data;

  const existing = getPersonByNationalId(input.nationalId);
  if (existing) {
    return c.json({ code: 'DUPLICATE', message: 'nationalId already exists' }, 409);
  }

  const id = insertPerson({
    first_name: input.firstName,
    middle_names: JSON.stringify(input.middleNames),
    last_name: input.lastName,
    dob_year: input.dobYear,
    dob_month: input.dobMonth,
    dob_day: input.dobDay,
    national_id: input.nationalId,
  });

  const created = getPersonById(id)!;
  const out = personOutputSchema.parse({
    id: created.id,
    firstName: created.first_name,
    middleNames: JSON.parse(created.middle_names),
    lastName: created.last_name,
    dobYear: created.dob_year,
    dobMonth: created.dob_month,
    dobDay: created.dob_day,
    nationalId: created.national_id,
  });
  return c.json(out, 201);
});

api.get('/people/:id', (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id <= 0) {
    return c.json({ code: 'INVALID_ID', message: 'id must be positive integer' }, 400);
  }
  const row = getPersonById(id);
  if (!row) return c.json({ code: 'NOT_FOUND', message: 'person not found' }, 404);
  return c.json({
    id: row.id,
    firstName: row.first_name,
    middleNames: JSON.parse(row.middle_names),
    lastName: row.last_name,
    dobYear: row.dob_year,
    dobMonth: row.dob_month,
    dobDay: row.dob_day,
    nationalId: row.national_id,
  });
});

api.get('/people', (c) => {
  const nationalId = c.req.query('nationalId');
  if (!nationalId) {
    return c.json({ code: 'MISSING_QUERY', message: 'nationalId is required' }, 400);
  }
  const row = getPersonByNationalId(nationalId);
  if (!row) return c.json({ code: 'NOT_FOUND', message: 'person not found' }, 404);
  return c.json({
    id: row.id,
    firstName: row.first_name,
    middleNames: JSON.parse(row.middle_names),
    lastName: row.last_name,
    dobYear: row.dob_year,
    dobMonth: row.dob_month,
    dobDay: row.dob_day,
    nationalId: row.national_id,
  });
});

export default api;
