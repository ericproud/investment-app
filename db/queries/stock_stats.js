import connect, { sql } from "@databases/pg";

const db = connect();

export async function getStockStats(stock_symbol, from_date, to_date) {
  return await db.query(sql`
    SELECT coefficient_of_variance, beta
    FROM StockStats
    WHERE stock_symbol=${stock_symbol} AND from_date=${from_date} AND to_date=${to_date}
    ;`);
}
