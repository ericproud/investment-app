import connect, { sql } from "@databases/pg";

const db = connect();

// EVERY FUNCTION NEEDS AUTH

export async function getStockListReviewsForStockList(stock_list_id) {
  return await db.query(sql`
    SELECT reviewer_user_id, review_body, updated_at
    FROM StockListRevies
    WHERE stock_list_id=${stock_list_id}
    ;`);
}
