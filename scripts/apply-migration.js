import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const sqlPath = process.argv[2] || 'supabase/migrations/20260726000000_create_devotional_settings.sql';
const resolved = path.resolve(sqlPath);

if (!fs.existsSync(resolved)) {
  console.error('Migration file not found:', resolved);
  process.exit(1);
}

const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_CONN;
const isPlaceholderDbUrl =
  typeof conn === 'string' &&
  /postgres:\/\/user:pass@host:5432\/postgres|postgres:\/\/postgres:password@db\.host:5432\/postgres/.test(conn);

if (!conn) {
  console.error('Missing Postgres connection string. Set SUPABASE_DB_URL or DATABASE_URL in your environment (or add it to .env).');
  console.error('Example: SUPABASE_DB_URL=postgres://postgres:password@db.host:5432/postgres');
  process.exit(1);
}

if (isPlaceholderDbUrl) {
  console.error('Detected a placeholder Postgres connection string in the environment. Replace it with your real Supabase/Postgres database URL before running migrations.');
  console.error('Workspace example: SUPABASE_DB_URL=postgres://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres');
  process.exit(1);
}

const sql = fs.readFileSync(resolved, 'utf8');

async function run() {
  const client = new Client({ connectionString: conn });
  await client.connect();
  try {
    console.log('Applying migration:', resolved);
    await client.query(sql);
    console.log('✅ Migration applied successfully');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
}

run();
