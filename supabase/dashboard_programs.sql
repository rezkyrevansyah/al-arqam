-- =============================================================
-- Migration: Dashboard Program Types
-- Jalankan SQL ini di Supabase SQL Editor
-- =============================================================

-- 1. Tambah kolom type ke transparency_programs
ALTER TABLE transparency_programs
  ADD COLUMN IF NOT EXISTS program_type TEXT NOT NULL DEFAULT 'generic'
  CHECK (program_type IN ('generic', 'infaq_tarawih', 'santunan_yatim', 'zis'));

-- 2. Tabel kategori yang bisa di-CRUD dari CMS
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('agenda', 'article', 'transparency')),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (entity_type, name)
);

-- Seed data kategori default
INSERT INTO categories (entity_type, name, color) VALUES
  ('agenda', 'Kajian', '#6366f1'),
  ('agenda', 'Sholat', '#22c55e'),
  ('agenda', 'Kegiatan', '#f59e0b'),
  ('agenda', 'Rapat', '#ef4444'),
  ('article', 'Umum', '#6366f1'),
  ('article', 'Pengumuman', '#f59e0b'),
  ('article', 'Kajian', '#22c55e')
ON CONFLICT (entity_type, name) DO NOTHING;

-- 3. Infaq Rutin Tarawih: satu baris per malam
CREATE TABLE IF NOT EXISTS infaq_tarawih_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES transparency_programs(id) ON DELETE CASCADE,
  malam_ke INTEGER NOT NULL,
  tanggal DATE NOT NULL,
  jumlah BIGINT NOT NULL DEFAULT 0,
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_infaq_tarawih_program ON infaq_tarawih_entries (program_id);
CREATE INDEX IF NOT EXISTS idx_infaq_tarawih_malam ON infaq_tarawih_entries (malam_ke);

-- 4. Santunan Anak Yatim: satu baris per donatur
CREATE TABLE IF NOT EXISTS santunan_yatim_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES transparency_programs(id) ON DELETE CASCADE,
  nama_donatur TEXT NOT NULL,
  rt TEXT NOT NULL,
  jumlah_paket INTEGER NOT NULL DEFAULT 1,
  harga_paket BIGINT NOT NULL DEFAULT 200000,
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_santunan_program ON santunan_yatim_entries (program_id);
CREATE INDEX IF NOT EXISTS idx_santunan_rt ON santunan_yatim_entries (rt);

-- 5. ZIS entries: satu baris per muzakki (mirrors spreadsheet)
CREATE TABLE IF NOT EXISTS zis_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES transparency_programs(id) ON DELETE CASCADE,
  tanggal DATE,
  nama_petugas TEXT DEFAULT '',
  nomor_resi TEXT DEFAULT '',
  nama_muzakki TEXT NOT NULL,
  alamat TEXT DEFAULT '',
  rt TEXT DEFAULT '',
  zakat_fitrah_jiwa INTEGER DEFAULT 0,
  zakat_fitrah_uang BIGINT DEFAULT 0,
  zakat_fitrah_beras_liter NUMERIC(10,2) DEFAULT 0,
  zakat_fitrah_beras_kg NUMERIC(10,2) DEFAULT 0,
  zakat_mal BIGINT DEFAULT 0,
  infaq_sedekah BIGINT DEFAULT 0,
  fidyah_jiwa INTEGER DEFAULT 0,
  fidyah_rp BIGINT DEFAULT 0,
  lain_lain BIGINT DEFAULT 0,
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_zis_program ON zis_entries (program_id);
CREATE INDEX IF NOT EXISTS idx_zis_rt ON zis_entries (rt);
CREATE INDEX IF NOT EXISTS idx_zis_tanggal ON zis_entries (tanggal);

-- 6. RLS Policies

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Auth manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE infaq_tarawih_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read infaq" ON infaq_tarawih_entries FOR SELECT USING (true);
CREATE POLICY "Auth manage infaq" ON infaq_tarawih_entries FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE santunan_yatim_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read santunan" ON santunan_yatim_entries FOR SELECT USING (true);
CREATE POLICY "Auth manage santunan" ON santunan_yatim_entries FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE zis_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read zis" ON zis_entries FOR SELECT USING (true);
CREATE POLICY "Auth manage zis" ON zis_entries FOR ALL USING (auth.role() = 'authenticated');
