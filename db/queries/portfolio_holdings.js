import connect, { sql } from "@databases/pg";

const db = connect();

export async function getPortfolioHoldings(portfolio_id) {
  return await db.query(sql`
    SELECT stock_symbol, num_shares
    FROM PortfolioHoldings
    WHERE portfolio_id=${portfolio_id}
    ;`);
}
