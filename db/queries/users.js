import connect, { sql } from "@databases/pg";

const db = connect();

export async function getUserDisplayName(user_id) {
  return await db.query(sql`
    SELECT display_name
    FROM Users
    WHERE user_id=${user_id}
    ;`);
}
