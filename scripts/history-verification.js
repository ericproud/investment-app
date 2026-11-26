export const expectedHistory = {
  rowCount: 619040,
  symbolCount: 505,
  minDate: '2013-02-08',
  maxDate: '2018-02-07',
};

export async function getHistorySummary(client) {
  const { rows: [summary] } = await client.query(`
    SELECT
      COUNT(*)::int AS row_count,
      COUNT(DISTINCT stock_symbol)::int AS symbol_count,
      MIN(at_date)::text AS min_date,
      MAX(at_date)::text AS max_date
    FROM HistData
  `);

  const { rows: [duplicates] } = await client.query(`
    SELECT COUNT(*)::int AS duplicate_keys
    FROM (
      SELECT stock_symbol, at_date
      FROM HistData
      GROUP BY stock_symbol, at_date
      HAVING COUNT(*) > 1
    ) AS duplicate_rows
  `);

  return { ...summary, duplicate_keys: duplicates.duplicate_keys };
}

export function assertHistorySummary(summary) {
  const errors = [];

  if (summary.row_count !== expectedHistory.rowCount) {
    errors.push(`rows ${summary.row_count}/${expectedHistory.rowCount}`);
  }
  if (summary.symbol_count !== expectedHistory.symbolCount) {
    errors.push(`symbols ${summary.symbol_count}/${expectedHistory.symbolCount}`);
  }
  if (summary.min_date !== expectedHistory.minDate) {
    errors.push(`min date ${summary.min_date}/${expectedHistory.minDate}`);
  }
  if (summary.max_date !== expectedHistory.maxDate) {
    errors.push(`max date ${summary.max_date}/${expectedHistory.maxDate}`);
  }
  if (summary.duplicate_keys !== 0) {
    errors.push(`duplicate keys ${summary.duplicate_keys}`);
  }

  if (errors.length > 0) {
    throw new Error(`Historical data verification failed: ${errors.join(', ')}`);
  }
}

export function printHistorySummary(summary) {
  console.log(`Rows: ${summary.row_count}`);
  console.log(`Symbols: ${summary.symbol_count}`);
  console.log(`Date range: ${summary.min_date} to ${summary.max_date}`);
  console.log(`Duplicate keys: ${summary.duplicate_keys}`);
}
