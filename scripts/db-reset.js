import { readFile } from 'node:fs/promises';
import { db, sql } from '../db/client.js';

const resetUrl = new URL('../db/schema/reset.sql', import.meta.url);
const schemaUrl = new URL('../db/schema/schema.sql', import.meta.url);

try {
  const [resetSql, schemaSql] = await Promise.all([
    readFile(resetUrl, 'utf8'),
    readFile(schemaUrl, 'utf8'),
  ]);

  await db.tx(async (tx) => {
    await tx.query(sql.__dangerous__rawValue(resetSql));
    await tx.query(sql.__dangerous__rawValue(schemaSql));
  });

  console.log('Database reset complete.');
} finally {
  await db.dispose();
}
