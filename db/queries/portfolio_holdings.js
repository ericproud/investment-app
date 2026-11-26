import { db, sql } from '../client.js';

export async function getPortfolioHoldings(portfolio_id) {
  return db.query(sql`
    SELECT stock_symbol, num_shares
    FROM PortfolioHoldings
    WHERE portfolio_id=${portfolio_id};
  `);
}
