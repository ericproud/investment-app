import { db, sql } from '../client.js';

export async function getStockListReviewsForStockList(stock_list_id) {
  return db.query(sql`
    SELECT reviewer_user_id, review_body, updated_at
    FROM StockListReviews
    WHERE stock_list_id=${stock_list_id};
  `);
}
