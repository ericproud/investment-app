import { db, sql } from '../client.js';

export async function getStockStats(stock_symbol_1, stock_symbol_2, from_date, to_date) {
  const low_stock_symbol = stock_symbol_1 <= stock_symbol_2 ? stock_symbol_1 : stock_symbol_2;
  const high_stock_symbol = stock_symbol_1 <= stock_symbol_2 ? stock_symbol_2 : stock_symbol_1;

  return db.query(sql`
    SELECT covariance, correlation
    FROM StockPairStats
    WHERE low_stock_symbol=${low_stock_symbol}
      AND high_stock_symbol=${high_stock_symbol}
      AND from_date=${from_date}
      AND to_date=${to_date};
  `);
}
