import 'dotenv/config';
import createConnectionPool, { sql } from '@databases/pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env and configure PostgreSQL before using the database layer.',
  );
}

export const db = createConnectionPool({
  connectionString,
  bigIntMode: 'number',
});
export { sql };
