import { db, sql } from '../client.js';

export async function getData(stockSymbol, fromDate, toDate) {
  return db.query(sql`
    SELECT at_date, open_price, close_price, high_price, low_price, trade_volume
    FROM Data
    WHERE stock_symbol=${stockSymbol}
      AND at_date>=${fromDate}
      AND at_date<=${toDate}
    ORDER BY at_date;
  `);
}
