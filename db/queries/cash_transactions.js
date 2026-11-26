import { db, sql } from '../client.js';

export async function getCashTransactionsInPortfolio(portfolio_id) {
  return db.query(sql`
    SELECT cash_transaction_type, amount, created_at
    FROM CashTransactions
    WHERE portfolio_id=${portfolio_id};
  `);
}
