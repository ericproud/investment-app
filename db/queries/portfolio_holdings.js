import { db, sql } from '../client.js';

export async function getPortfolioHoldings(portfolioId) {
  return db.query(sql`
    SELECT stock_symbol, num_shares
    FROM PortfolioHoldings
    WHERE portfolio_id=${portfolioId}
    ORDER BY stock_symbol;
  `);
}
