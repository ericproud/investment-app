import { db, sql } from '../client.js';

export async function getStockTransactionsInPortfolio(portfolio_id) {
  return db.query(sql`
    SELECT stock_symbol, stock_transaction_type, num_shares, share_price, created_at
    FROM StockTransactions
    WHERE portfolio_id=${portfolio_id};
  `);
}
