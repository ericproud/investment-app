import connect, { sql } from "@databases/pg";
import { getFriendState } from "./friend_states";

const db = connect();

/*
CREATE TABLE IF NOT EXISTS StockListShares (
  stock_list_id INTEGER NOT NULL REFERENCES StockLists(id) ON DELETE CASCADE,
  recipient_user_id INTEGER NOT NULL REFERENCES Users(id),
  shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (stock_list_id, recipient_user_id)
);
*/

export async function getStockListShares(user_id, stock_list_id) {
  return await db.tx(async (tx) => {
    const owned = await tx.query(sql`
    SELECT id
    FROM StockLists
    WHERE 
      id = ${stock_list_id} AND 
      user_id = ${user_id};
  `);

    if (owned.length !== 1) {
      throw new Error("Invalid stock list");
    }

    return await tx.query(sql`
    SELECT recipient_user_id, shared_at
    FROM StockListShares
    WHERE stock_list_id=${stock_list_id};
    `);
  });
}

export async function shareStockList(user_id, recipient_user_id, stock_list_id) {
  if (user_id === recipient_user_id) {
    throw new Error("Invalid recipient");
  }

  const friendState = await getFriendState(user_id, recipient_user_id);

  if (friendState.length !== 1 || friendState[0].friend_state !== "accepted") {
    throw new Error("Invalid recipient");
  }

  await db.tx(async (tx) => {
    const owned = await tx.query(sql`
      SELECT id
      FROM StockLists
      WHERE 
        id = ${stock_list_id} AND 
        user_id = ${user_id};
      `);

    if (owned.length !== 1) {
      throw new Error("Invalid stock list");
    }

    await tx.query(sql`
      INSERT INTO StockListShares (stock_list_id, recipient_user_id)
      VALUES (${stock_list_id}, ${recipient_user_id});
      `);
  });
}

export async function unshareStockList(user_id, recipient_user_id, stock_list_id) {
  if (user_id === recipient_user_id) {
    throw new Error("Invalid recipient");
  }

  await db.tx(async (tx) => {
    const owned = await tx.query(sql`
      SELECT id
      FROM StockLists
      WHERE 
        id = ${stock_list_id} AND 
        user_id = ${user_id};
      `);

    if (owned.length !== 1) {
      throw new Error("Invalid stock list");
    }

    await tx.query(sql`
      DELETE FROM StockListShares
      WHERE 
        stock_list_id = ${stock_list_id} AND
        recipient_user_id = ${recipient_user_id};
      `);
  });
}
