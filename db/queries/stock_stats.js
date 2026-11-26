import { db, sql } from '../client.js';

export async function getStockStats(stockSymbol, fromDate, toDate) {
  const rows = await db.query(sql`
    SELECT coefficient_of_variance, beta, computed_at
    FROM StockStats
    WHERE stock_symbol=${stockSymbol}
      AND from_date=${fromDate}
      AND to_date=${toDate};
  `);

  return rows[0] ?? null;
}
