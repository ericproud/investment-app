import { db, sql } from '../client.js';

export async function getData(stock_symbol, from_date, to_date) {
  return db.query(sql`
    SELECT at_date, open_price, close_price, high_price, low_price, trade_volume
    FROM Data
    WHERE stock_symbol=${stock_symbol}
      AND at_date>=${from_date}
      AND at_date<=${to_date};
  `);
}
