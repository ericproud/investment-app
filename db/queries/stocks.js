import connect, { sql } from "@databases/pg";

const db = connect();

export async function getStocks() {
  return await db.query(sql`
    SELECT *
    FROM Stocks
    ;`);
}
