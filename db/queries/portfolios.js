import { db, sql } from '../client.js';

export async function getMyPortfolios(user_id) {
  return db.query(sql`
    SELECT id, label
    FROM Portfolios
    WHERE user_id=${user_id};
  `);
}

export async function getPortfolioCashBalance(portfolio_id) {
  return db.query(sql`
    SELECT cash_balance
    FROM Portfolios
    WHERE id=${portfolio_id};
  `);
}
