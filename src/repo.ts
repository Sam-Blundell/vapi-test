import db from './db.ts';

export type PersonRow = {
  id: number;
  first_name: string;
  middle_names: string; // JSON array
  last_name: string;
  dob_year: number;
  dob_month: number;
  dob_day: number;
  national_id: string;
};

export type NewPersonRow = Omit<PersonRow, 'id'>;

export function insertPerson(p: NewPersonRow): number {
  const stmt = db.query(
    `INSERT INTO people (first_name, middle_names, last_name, dob_year, dob_month, dob_day, national_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const res = stmt.run(
    p.first_name,
    p.middle_names,
    p.last_name,
    p.dob_year,
    p.dob_month,
    p.dob_day,
    p.national_id
  ) as unknown as { lastInsertRowid: number };
  return Number(res.lastInsertRowid);
}

export function getPersonById(id: number): PersonRow | null {
  const stmt = db.query(
    `SELECT * FROM people WHERE id = ? LIMIT 1`
  );
  const row = stmt.get(id) as unknown as PersonRow | undefined;
  return row ?? null;
}

export function getPersonByNationalId(nationalId: string): PersonRow | null {
  const stmt = db.query(
    `SELECT * FROM people WHERE national_id = ? LIMIT 1`
  );
  const row = stmt.get(nationalId) as unknown as PersonRow | undefined;
  return row ?? null;
}
