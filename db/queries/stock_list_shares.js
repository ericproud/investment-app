import { db, sql } from '../client.js';

export async function getStockListSharesForStockList(stockListId) {
  return db.query(sql`
    SELECT recipient_user_id, shared_at
    FROM StockListShares
    WHERE stock_list_id=${stockListId}
    ORDER BY shared_at, recipient_user_id;
  `);
}
