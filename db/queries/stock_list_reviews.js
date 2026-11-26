import { db, sql } from '../client.js';

export async function getStockListReviewsForStockList(stockListId) {
  return db.query(sql`
    SELECT reviewer_user_id, review_body, updated_at
    FROM StockListReviews
    WHERE stock_list_id=${stockListId}
    ORDER BY updated_at, reviewer_user_id;
  `);
}
