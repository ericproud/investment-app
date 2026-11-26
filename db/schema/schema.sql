CREATE TABLE IF NOT EXISTS Users (
  id INT GENERATED ALWAYS AS IDENTITY,
  display_name VARCHAR(64),
  email VARCHAR(64),
  password_hash VARCHAR(256),
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Stocks (
  symbol VARCHAR(16),
  PRIMARY KEY(symbol)
);

CREATE TABLE IF NOT EXISTS Portfolios (
  id INT GENERATED ALWAYS AS IDENTITY,
  user_id INT,
  label VARCHAR(64),
  cash_balance REAL,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS PortfolioHoldings (
  portfolio_id INT,
  stock_symbol VARCHAR(16),
  num_shares REAL,
  PRIMARY KEY (portfolio_id, stock_symbol),
  FOREIGN KEY(portfolio_id) REFERENCES Portfolios(id),
  FOREIGN KEY(stock_symbol) REFERENCES Stocks(symbol)
);

CREATE TABLE IF NOT EXISTS CashTransactions (
  id INT GENERATED ALWAYS AS IDENTITY,
  portfolio_id INT,
  cash_transaction_type VARCHAR(16),
  amount REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY(portfolio_id) REFERENCES Portfolios(id)
);

CREATE TABLE IF NOT EXISTS StockTransactions (
  id INT GENERATED ALWAYS AS IDENTITY,
  portfolio_id INT,
  stock_symbol VARCHAR(16),
  stock_transaction_type VARCHAR(16),
  num_shares REAL,
  share_price REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY(portfolio_id) REFERENCES Portfolios(id),
  FOREIGN KEY(stock_symbol) REFERENCES Stocks(symbol)
);

CREATE TABLE IF NOT EXISTS HistData (
  stock_symbol VARCHAR(16),
  at_date DATE,
  open_price REAL,
  close_price REAL,
  high_price REAL,
  low_price REAL,
  trade_volume REAL,
  PRIMARY KEY(stock_symbol, at_date),
  FOREIGN KEY(stock_symbol) REFERENCES Stocks(symbol)
);

CREATE TABLE IF NOT EXISTS NewData (
  stock_symbol VARCHAR(16),
  at_date DATE,
  open_price REAL,
  close_price REAL,
  high_price REAL,
  low_price REAL,
  trade_volume REAL,
  PRIMARY KEY(stock_symbol, at_date),
  FOREIGN KEY(stock_symbol) REFERENCES Stocks(symbol)
);

CREATE VIEW IF NOT EXISTS Data AS
  SELECT stock_symbol, at_date, open_price, close_price, high_price, low_price, trade_volume
  FROM HistData

  UNION 

  SELECT stock_symbol, at_date, open_price, close_price, high_price, low_price, trade_volume
  FROM NewData;

CREATE TABLE IF NOT EXISTS StockStats (
  stock_symbol VARCHAR(16),
  from_date DATE,
  to_date DATE,
  coefficient_of_variance REAL,
  beta REAL,
  PRIMARY KEY(stock_symbol, from_date, to_date),
  FOREIGN KEY(stock_symbol) REFERENCES Stocks(symbol),
  CHECK(from_date < to_date)
);

CREATE TABLE IF NOT EXISTS StockPairStats (
  low_stock_symbol VARCHAR(16),
  high_stock_symbol VARCHAR(16),
  from_date DATE,
  to_date DATE,
  covariance REAL,
  correlation REAL,
  PRIMARY KEY(low_stock_symbol, high_stock_symbol, from_date, to_date),
  FOREIGN KEY(low_stock_symbol) REFERENCES Stocks(symbol),
  FOREIGN KEY(high_stock_symbol) REFERENCES Stocks(symbol),
  CHECK(low_stock_symbol < high_stock_symbol),
  CHECK(from_date < to_date)
);

CREATE TABLE IF NOT EXISTS FriendStates (
  low_user_id INT,
  high_user_id INT,
  friend_state VARCHAR(16),
  outgoing_user_id INT,
  incoming_user_id INT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(low_user_id, high_user_id),
  FOREIGN KEY(low_user_id) REFERENCES Users(id),
  FOREIGN KEY(high_user_id) REFERENCES Users(id),
  CHECK(low_user_id < high_user_id)
);

CREATE TABLE IF NOT EXISTS StockLists (
  id INT GENERATED ALWAYS AS IDENTITY,
  user_id INT,
  label VARCHAR(64),
  is_public BOOLEAN,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS StockListHoldings (
  stock_list_id INT,
  stock_symbol VARCHAR(16),
  num_shares REAL,
  PRIMARY KEY(stock_list_id, stock_symbol),
  FOREIGN KEY(stock_list_id) REFERENCES StockLists(id),
  FOREIGN KEY(stock_symbol) REFERENCES Stocks(symbol)
);

CREATE TABLE IF NOT EXISTS StockListShares (
  stock_list_id INT,
  recipient_user_id INT,
  shared_at TIMESTAMP,
  PRIMARY KEY(stock_list_id, recipient_user_id),
  FOREIGN KEY(stock_list_id) REFERENCES StockLists(id),
  FOREIGN KEY(recipient_user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS StockListReviews (
  stock_list_id INT,
  reviewer_user_id INT,
  review_body VARCHAR(4000),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(stock_list_id, reviewer_user_id),
  FOREIGN KEY(stock_list_id) REFERENCES StockLists(id),
  FOREIGN KEY(reviewer_user_id) REFERENCES Users(id)
);
