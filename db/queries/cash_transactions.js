import { db, sql } from '../client.js';

export async function getCashTransactionsInPortfolio(portfolioId) {
  return db.query(sql`
    SELECT id, cash_transaction_type, amount, created_at
    FROM CashTransactions
    WHERE portfolio_id=${portfolioId}
    ORDER BY created_at, id;
  `);
}
