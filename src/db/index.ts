import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { relations } from '../../drizzle/relations';

// Disable prefetch/prepare — required for Supabase's "Transaction" pool mode.
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle({ client, relations });
