import { Database } from 'bun:sqlite';

const DB_FILE = process.env.DB_FILE ?? './data.db';

const db = new Database(DB_FILE, { create: true });

// initialize schema
// note: store middle_names as JSON string, enforce unique national_id
// simple range checks at app layer; DB enforces non-null + uniqueness
const createTable = `
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  middle_names TEXT NOT NULL DEFAULT '[]',
  last_name TEXT NOT NULL,
  dob_year INTEGER NOT NULL,
  dob_month INTEGER NOT NULL,
  dob_day INTEGER NOT NULL,
  national_id TEXT NOT NULL UNIQUE
);`;

const createIndex = `CREATE INDEX IF NOT EXISTS idx_people_national_id ON people(national_id);`;

db.query(createTable).run();
db.query(createIndex).run();

export default db;
export { db };
