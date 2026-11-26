import { db, sql } from '../client.js';

export async function getStockPairStats(stockSymbol1, stockSymbol2, fromDate, toDate) {
  const lowStockSymbol = stockSymbol1 <= stockSymbol2 ? stockSymbol1 : stockSymbol2;
  const highStockSymbol = stockSymbol1 <= stockSymbol2 ? stockSymbol2 : stockSymbol1;
  const rows = await db.query(sql`
    SELECT covariance, correlation, computed_at
    FROM StockPairStats
    WHERE low_stock_symbol=${lowStockSymbol}
      AND high_stock_symbol=${highStockSymbol}
      AND from_date=${fromDate}
      AND to_date=${toDate};
  `);

  return rows[0] ?? null;
}
