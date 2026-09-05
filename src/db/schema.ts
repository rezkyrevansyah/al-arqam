// Sumber schema asli ada di drizzle/schema.ts & drizzle/relations.ts —
// dihasilkan oleh `npm run db:pull` (introspeksi dari Supabase) dan menjadi
// source of truth untuk `db:generate` / `db:push` selanjutnya. File ini
// hanya re-export supaya kode app bisa `import { agenda } from '@/db/schema'`.
export * from '../../drizzle/schema';
export * from '../../drizzle/relations';
