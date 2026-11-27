import connect, { sql } from "@databases/pg";
import { getViewableStockLists } from "./stock_lists";

const db = connect();

/*
CREATE TABLE IF NOT EXISTS StockListReviews (
  stock_list_id INTEGER NOT NULL REFERENCES StockLists(id) ON DELETE CASCADE,
  reviewer_user_id INTEGER NOT NULL REFERENCES Users(id),
  review_body VARCHAR(4000) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (stock_list_id, reviewer_user_id)
);
*/

export async function getStockListReviews(user_id, stock_list_id) {
  return await db.tx(async (tx) => {
    const viewableStockLists = await getViewableStockLists(user_id);

    if (!viewableStockLists.some((list) => Number(list.id) === Number(stock_list_id))) {
      throw new Error("Invalid stock list");
    }

    return await tx.query(sql`
      SELECT reviewer_user_id, review_body, updated_at
      FROM StockListReviews
      WHERE stock_list_id=${stock_list_id}
      ;`);
  });
}

export async function createStockListReview(user_id, stock_list_id, review_body) {
  if (review_body.length === 0) {
    throw new Error("Review body can't be empty");
  }
  return await db.tx(async (tx) => {
    const viewableStockLists = await getViewableStockLists(user_id);

    if (!viewableStockLists.some((list) => Number(list.id) === Number(stock_list_id))) {
      throw new Error("Invalid stock list");
    }

    return await tx.query(sql`
      INSERT INTO StockListReviews (stock_list_id, reviewer_user_id, review_body)
      VALUES (${stock_list_id}, ${user_id}, ${review_body})
      ON CONFLICT (stock_list_id, reviewer_user_id)
      DO UPDATE SET 
        review_body = ${review_body},
        updated_at = CURRENT_TIMESTAMP;
      `);
  });
}

export async function deleteStockListReview(user_id, stock_list_id) {
  return await db.tx(async (tx) => {
    const viewableStockLists = await getViewableStockLists(user_id);

    if (!viewableStockLists.some((list) => Number(list.id) === Number(stock_list_id))) {
      throw new Error("Invalid stock list");
    }

    return await tx.query(sql`
      DELETE FROM StockListReviews
      WHERE 
        stock_list_id = ${stock_list_id} AND
        reviewer_user_id = ${user_id};
      `);
  });
}
