import { db, sql } from '../client.js';

export async function getUserDisplayName(user_id) {
  return db.query(sql`
    SELECT display_name
    FROM Users
    WHERE id=${user_id};
  `);
}
