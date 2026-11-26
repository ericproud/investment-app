import { readFile } from 'node:fs/promises';
import { db, sql } from '../db/client.js';

const schemaUrl = new URL('../db/schema/schema.sql', import.meta.url);

try {
  const schema = await readFile(schemaUrl, 'utf8');
  await db.query(sql.__dangerous__rawValue(schema));
  console.log('Database initialized.');
} finally {
  await db.dispose();
}
