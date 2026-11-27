import { db, sql } from '../db/client.js';

try {
  const rows = await db.query(sql`SELECT 1 AS ok;`);

  if (rows.length !== 1 || rows[0].ok !== 1) {
    throw new Error('Unexpected response from PostgreSQL smoke query.');
  }

  console.log('PostgreSQL connection successful.');
} finally {
  await db.dispose();
}
