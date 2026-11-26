import { db, sql } from '../client.js';

export async function getMyStockLists(userId) {
  return db.query(sql`
    SELECT id, user_id, label, is_public
    FROM StockLists
    WHERE user_id=${userId}
    ORDER BY id;
  `);
}

export async function getPublicStockLists() {
  return db.query(sql`
    SELECT id, user_id, label, is_public
    FROM StockLists
    WHERE is_public IS TRUE
    ORDER BY id;
  `);
}

export async function getSharedWithMeStockLists(userId) {
  return db.query(sql`
    SELECT StockLists.id, StockLists.user_id, StockLists.label, StockLists.is_public
    FROM StockLists
    JOIN StockListShares ON StockLists.id=StockListShares.stock_list_id
    WHERE StockListShares.recipient_user_id=${userId}
    ORDER BY StockLists.id;
  `);
}

export async function getViewableByMeStockLists(userId) {
  return db.query(sql`
    SELECT id, user_id, label, is_public
    FROM StockLists
    WHERE is_public IS TRUE OR user_id=${userId}

    UNION

    SELECT StockLists.id, StockLists.user_id, StockLists.label, StockLists.is_public
    FROM StockLists
    JOIN StockListShares ON StockLists.id=StockListShares.stock_list_id
    WHERE StockListShares.recipient_user_id=${userId}

    ORDER BY id;
  `);
}
