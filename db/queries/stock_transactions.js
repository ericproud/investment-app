import { db, sql } from '../client.js';

export async function getStockTransactionsInPortfolio(portfolioId) {
  return db.query(sql`
    SELECT id, stock_symbol, stock_transaction_type, num_shares, share_price, created_at
    FROM StockTransactions
    WHERE portfolio_id=${portfolioId}
    ORDER BY created_at, id;
  `);
}
