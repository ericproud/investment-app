import 'dotenv/config';
import pg from 'pg';
import {
  assertHistorySummary,
  getHistorySummary,
  printHistorySummary,
} from './history-verification.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

const client = new pg.Client({ connectionString });
await client.connect();

try {
  const summary = await getHistorySummary(client);
  assertHistorySummary(summary);
  printHistorySummary(summary);
  console.log('Historical data verified.');
} finally {
  await client.end();
}
