import { db, sql } from '../client.js';

export async function getMyStockLists(user_id) {
  return db.query(sql`
    SELECT id, label, is_public
    FROM StockLists
    WHERE user_id=${user_id};
  `);
}

export async function getPublicStockLists() {
  return db.query(sql`
    SELECT id, user_id, label, is_public
    FROM StockLists
    WHERE is_public IS TRUE;
  `);
}

export async function getSharedWithMeStockLists(user_id) {
  return db.query(sql`
    SELECT StockLists.id, StockLists.user_id, StockLists.label, StockLists.is_public
    FROM StockLists
    JOIN StockListShares ON StockLists.id=StockListShares.stock_list_id
    WHERE StockListShares.recipient_user_id=${user_id};
  `);
}

export async function getViewableByMeStockLists(user_id) {
  return db.query(sql`
    SELECT id, user_id, label, is_public
    FROM StockLists
    WHERE is_public IS TRUE

    UNION

    SELECT StockLists.id, StockLists.user_id, StockLists.label, StockLists.is_public
    FROM StockLists
    JOIN StockListShares ON StockLists.id=StockListShares.stock_list_id
    WHERE StockListShares.recipient_user_id=${user_id};
  `);
}
