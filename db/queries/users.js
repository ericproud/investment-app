import { db, sql } from '../client.js';

export async function getUserDisplayName(userId) {
  const rows = await db.query(sql`
    SELECT display_name
    FROM Users
    WHERE id=${userId};
  `);

  return rows[0]?.display_name ?? null;
}
