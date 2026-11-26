import { db, sql } from '../client.js';

export async function getMyPortfolios(userId) {
  return db.query(sql`
    SELECT id, label
    FROM Portfolios
    WHERE user_id=${userId}
    ORDER BY id;
  `);
}

export async function getPortfolioCashBalance(portfolioId) {
  const rows = await db.query(sql`
    SELECT cash_balance
    FROM Portfolios
    WHERE id=${portfolioId};
  `);

  return rows[0]?.cash_balance ?? null;
}
