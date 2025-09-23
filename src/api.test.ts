import { describe, it, expect } from 'bun:test';

// Ensure DB is in-memory for this test file before loading app
process.env.DB_FILE = ':memory:';
const { default: app } = await import('./server.ts');

type Person = {
  id: number;
  firstName: string;
  middleNames: string[];
  lastName: string;
  dobYear: number;
  dobMonth: number;
  dobDay: number;
  nationalId: string;
};

const create = async (body: unknown) => {
  const res = await app.request('/api/people', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res;
};

describe('api /people', () => {
  it('creates and fetches by id and nationalId', async () => {
    const nat = `ID-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const res = await create({
      firstName: 'Ada',
      middleNames: ['Lovelace'],
      lastName: 'Byron',
      dobYear: 1990,
      dobMonth: 12,
      dobDay: 10,
      nationalId: nat,
    });
    expect(res.status).toBe(201);
    const created = (await res.json()) as Person;
    expect(created.firstName).toBe('Ada');
    expect(created.dobYear).toBe(1990);
    expect(created.id).toBeGreaterThan(0);

    const byId = await app.request(`/api/people/${created.id}`);
    expect(byId.status).toBe(200);
    const p1 = (await byId.json()) as Person;
    expect(p1.nationalId).toBe(nat);

    const byNat = await app.request(`/api/people?nationalId=${encodeURIComponent(nat)}`);
    expect(byNat.status).toBe(200);
    const p2 = (await byNat.json()) as Person;
    expect(p2.id).toBe(created.id);
  });

  it('rejects invalid DOB (Feb 30)', async () => {
    const res = await create({
      firstName: 'Test',
      middleNames: [],
      lastName: 'User',
      dobYear: 2020,
      dobMonth: 2,
      dobDay: 30,
      nationalId: 'X1',
    });
    expect(res.status).toBe(400);
  });

  it('rejects duplicate nationalId', async () => {
    const body = {
      firstName: 'A',
      middleNames: [],
      lastName: 'B',
      dobYear: 2000,
      dobMonth: 1,
      dobDay: 1,
      nationalId: 'DUP-1',
    };
    const r1 = await create(body);
    // If test order conflicts created earlier, ensure created or 409
    expect([201, 409]).toContain(r1.status);
    const r2 = await create(body);
    expect(r2.status).toBe(409);
  });
});
