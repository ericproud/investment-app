import connect, { sql } from "@databases/pg";

const db = connect();

export async function getStockStats(stock_symbol_1, stock_symbol_2, from_date, to_date) {
  if (stock_symbol_1 > stock_symbol_2) {
    low_stock_symbol = stock_symbol_2;
    high_stock_symbol = stock_symbol_1;
  } else {
    low_stock_symbol = stock_symbol_1;
    high_stock_symbol = stock_symbol_2;
  }

  return await db.query(sql`
    SELECT covariance, correlation
    FROM StockPairStats
    WHERE low_stock_symbol=${stock_symbol_1} AND high_stock_symbol=${stock_symbol_2} AND from_date=${from_date} AND to_date=${to_date}
    ;`);
}
