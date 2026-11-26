import 'dotenv/config';
import { access } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import pg from 'pg';
import { from as copyFrom } from 'pg-copy-streams';

const connectionString = process.env.DATABASE_URL;
const csvPath = resolve(process.argv[2] ?? 'SP500History.csv');

if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

await access(csvPath);

const client = new pg.Client({ connectionString });
await client.connect();

try {
  await client.query('BEGIN');

  await client.query(`
    CREATE TEMP TABLE sp500_stage (
      "Timestamp" DATE NOT NULL,
      "Open" DOUBLE PRECISION,
      "High" DOUBLE PRECISION,
      "Low" DOUBLE PRECISION,
      "Close" DOUBLE PRECISION NOT NULL,
      "Volume" BIGINT NOT NULL,
      "Code" VARCHAR(16) NOT NULL
    ) ON COMMIT DROP
  `);

  const copyStream = client.query(
    copyFrom(`
      COPY sp500_stage (
        "Timestamp",
        "Open",
        "High",
        "Low",
        "Close",
        "Volume",
        "Code"
      )
      FROM STDIN WITH (FORMAT csv, HEADER true)
    `),
  );

  await pipeline(createReadStream(csvPath), copyStream);

  await client.query(`
    INSERT INTO Stocks (symbol)
    SELECT DISTINCT "Code"
    FROM sp500_stage
    ON CONFLICT (symbol) DO NOTHING
  `);

  const { rows: [overlap] } = await client.query(`
    SELECT EXISTS (
      SELECT 1
      FROM sp500_stage AS staged
      INNER JOIN NewData AS added
        ON added.stock_symbol = staged."Code"
       AND added.at_date = staged."Timestamp"
    ) AS has_overlap
  `);

  if (overlap.has_overlap) {
    throw new Error('Historical data overlaps with NewData.');
  }

  const result = await client.query(`
    INSERT INTO HistData (
      stock_symbol,
      at_date,
      open_price,
      close_price,
      high_price,
      low_price,
      trade_volume
    )
    SELECT
      "Code",
      "Timestamp",
      "Open",
      "Close",
      "High",
      "Low",
      "Volume"
    FROM sp500_stage
    ON CONFLICT (stock_symbol, at_date) DO NOTHING
  `);

  if (result.rowCount > 0) {
    await client.query('DELETE FROM StockStats');
    await client.query('DELETE FROM StockPairStats');
  }

  await client.query('COMMIT');
  console.log(`Historical data loaded from ${csvPath}.`);
  console.log(`Inserted ${result.rowCount} rows.`);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}
