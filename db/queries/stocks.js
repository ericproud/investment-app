import { db, sql } from '../client.js';

export async function getStocks() {
  return db.query(sql`
    SELECT symbol
    FROM Stocks
    ORDER BY symbol;
  `);
}
