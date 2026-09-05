import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  out: './drizzle',
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    // Session pooler (5432), bukan transaction pooler (6543) — drizzle-kit
    // butuh prepared statements yang tidak didukung transaction mode.
    url: process.env.DIRECT_URL!,
  },
  verbose: true,
  strict: true,
});
