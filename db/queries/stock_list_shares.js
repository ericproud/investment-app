import connect, { sql } from "@databases/pg";

const db = connect();

export async function getStockListSharesForStockList(stock_list_id) {
  return await db.query(sql`
    SELECT recipient_user_id, shared_at
    FROM StockListShares
    WHERE stock_list_id=${stock_list_id}
    ;`);
}
