import connect, { sql } from "@databases/pg";

const db = connect();

/*
CREATE TABLE IF NOT EXISTS CashTransactions (
  id INT GENERATED ALWAYS AS IDENTITY,
  portfolio_id INT NOT NULL,
  cash_transaction_type VARCHAR(16) NOT NULL CHECK (cash_transaction_type IN ('withdrawal', 'deposit', 'transfer_in', 'transfer_out')),
  amount REAL NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY(portfolio_id) REFERENCES Portfolios(id)
);
*/

export async function getCashTransactionsInPortfolio(user_id, portfolio_id) {
  return await db.tx(async (tx) => {
    const owned = await tx.query(sql`
      SELECT id FROM Portfolios
      WHERE id = ${portfolio_id} AND user_id = ${user_id};
    `);

    if (owned.length !== 1) {
      throw new Error("Invalid portfolio");
    }
    return await tx.query(sql`
      SELECT cash_transaction_type, amount, created_at
      FROM CashTransactions
      WHERE portfolio_id=${portfolio_id};
    `);
  });
}

export async function makeCashTransactionInPortfolio(user_id, portfolio_id, cash_transaction_type, amount) {
  if (cash_transaction_type !== "withdrawal" && cash_transaction_type !== "deposit") {
    throw new Error("Invalid transaction type");
  }
  if (amount <= 0) {
    throw new Error("Invalid amount");
  }

  let balance_delta = amount;
  if (cash_transaction_type === "withdrawal") {
    balance_delta = balance_delta * -1;
  }

  await db.tx(async (tx) => {
    const owned = await tx.query(sql`
      SELECT id FROM Portfolios
      WHERE id = ${portfolio_id} AND user_id = ${user_id};
    `);

    if (owned.length !== 1) {
      throw new Error("Invalid portfolio");
    }

    await tx.query(sql`
      INSERT INTO CashTransactions (portfolio_id, cash_transaction_type, amount)
      VALUES (${portfolio_id}, ${cash_transaction_type}, ${amount});
    `);

    await tx.query(sql`      
      UPDATE Portfolios
      SET cash_balance = cash_balance + ${balance_delta}
      WHERE id = ${portfolio_id} AND user_id = ${user_id};
    `);
  });
}

export async function makeCashTransactionBetweenPortfolios(user_id, incoming_portfolio_id, outgoing_portfolio_id, amount) {
  if (amount <= 0) {
    throw new Error("Invalid amount");
  }
  if (incoming_portfolio_id == outgoing_portfolio_id) {
    throw new Error("Invalid portfolios");
  }

  await db.tx(async (tx) => {
    const owned = await tx.query(sql`
      SELECT id
      FROM Portfolios
      WHERE id IN (${incoming_portfolio_id}, ${outgoing_portfolio_id})
        AND user_id = ${user_id};
    `);

    if (owned.length !== 2) {
      throw new Error("Invalid portfolios");
    }

    await tx.query(sql`      
      INSERT INTO CashTransactions (portfolio_id, cash_transaction_type, amount)
      VALUES (${incoming_portfolio_id}, 'transfer_in', ${amount});
    `);

    await tx.query(sql`      
      INSERT INTO CashTransactions (portfolio_id, cash_transaction_type, amount)
      VALUES (${outgoing_portfolio_id}, 'transfer_out', ${amount});
    `);

    await tx.query(sql`      
      UPDATE Portfolios
      SET cash_balance = cash_balance + ${amount}
        WHERE id = ${incoming_portfolio_id};
    `);

    await tx.query(sql`      
      UPDATE Portfolios
      SET cash_balance = cash_balance - ${amount}
        WHERE id = ${outgoing_portfolio_id};
    `);
  });
}
