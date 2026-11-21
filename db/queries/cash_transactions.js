import connect, { sql } from "@databases/pg";

const db = connect();

// AUTH
export async function getCashTransactionsInPortfolio(portfolio_id) {
  return await db.query(sql`
    SELECT cash_transacion_type, amount, created_at
    FROM CashTransactions
    WHERE portfolio_id=${portfolio_id}
    ;`);
}
