-- ============================================================
-- Al-Arqam Supabase Schema
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Enum Types ────────────────────────────────────────────────

CREATE TYPE agenda_category AS ENUM ('kajian', 'sholat', 'kegiatan', 'rapat');
CREATE TYPE social_platform AS ENUM ('instagram', 'youtube', 'facebook', 'tiktok');

-- ── Multi-Row Tables ──────────────────────────────────────────

-- 1. Agenda / Kegiatan
CREATE TABLE agenda (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  date        date NOT NULL,
  time        text NOT NULL DEFAULT '',
  location    text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category    agenda_category NOT NULL DEFAULT 'kegiatan',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Artikel
CREATE TABLE articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  excerpt     text NOT NULL DEFAULT '',
  content     text NOT NULL DEFAULT '',
  author      text NOT NULL DEFAULT 'Admin DKM',
  date        date NOT NULL DEFAULT CURRENT_DATE,
  image       text NOT NULL DEFAULT '',
  category    text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. Galeri
CREATE TABLE gallery (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image       text NOT NULL,
  title       text NOT NULL DEFAULT '',
  date        date NOT NULL DEFAULT CURRENT_DATE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4. Pengurus DKM
CREATE TABLE board_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  title       text NOT NULL DEFAULT '',
  image       text NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 5. Activity Log
CREATE TABLE activity_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp   timestamptz NOT NULL DEFAULT now(),
  action      text NOT NULL,
  entity      text NOT NULL,
  entity_id   text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  "user"      text NOT NULL DEFAULT 'admin'
);

-- ── Singleton Config Tables ───────────────────────────────────
-- Pattern: lock boolean PRIMARY KEY DEFAULT true + CHECK (lock = true)
-- Memastikan hanya 1 baris per tabel

-- 6. Hero Section
CREATE TABLE hero_config (
  lock        boolean PRIMARY KEY DEFAULT true,
  title       text NOT NULL DEFAULT '',
  subtitle    text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  CONSTRAINT hero_config_single_row CHECK (lock = true)
);
INSERT INTO hero_config (title, subtitle, description)
VALUES ('Masjid Al-Arqam', '', '')
ON CONFLICT (lock) DO NOTHING;

-- 7. Countdown Event
CREATE TABLE countdown_config (
  lock        boolean PRIMARY KEY DEFAULT true,
  name        text NOT NULL DEFAULT '',
  date        timestamptz NOT NULL DEFAULT now(),
  description text NOT NULL DEFAULT '',
  active      boolean NOT NULL DEFAULT false,
  CONSTRAINT countdown_config_single_row CHECK (lock = true)
);
INSERT INTO countdown_config (name, date, description, active)
VALUES ('', now(), '', false)
ON CONFLICT (lock) DO NOTHING;

-- 8. Konfigurasi Donasi
CREATE TABLE donation_config (
  lock                boolean PRIMARY KEY DEFAULT true,
  bank_account_number text NOT NULL DEFAULT '',
  bank_account_name   text NOT NULL DEFAULT '',
  bank_name           text NOT NULL DEFAULT '',
  donation_collected  bigint NOT NULL DEFAULT 0,
  donation_target     bigint NOT NULL DEFAULT 0,
  qris_image_url      text NOT NULL DEFAULT '',
  CONSTRAINT donation_config_single_row CHECK (lock = true)
);
INSERT INTO donation_config DEFAULT VALUES
ON CONFLICT (lock) DO NOTHING;

-- 9. Footer / Info Kontak
CREATE TABLE footer_config (
  lock      boolean PRIMARY KEY DEFAULT true,
  address   text NOT NULL DEFAULT '',
  phone     text NOT NULL DEFAULT '',
  email     text NOT NULL DEFAULT '',
  maps_url  text NOT NULL DEFAULT '',
  CONSTRAINT footer_config_single_row CHECK (lock = true)
);
INSERT INTO footer_config DEFAULT VALUES
ON CONFLICT (lock) DO NOTHING;

-- 10. Link Media Sosial (multi-row, relasi ke footer)
CREATE TABLE social_links (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform  social_platform NOT NULL,
  url       text NOT NULL DEFAULT ''
);

-- ── Row Level Security (RLS) ──────────────────────────────────
-- anon role  : SELECT only (public bisa baca)
-- authenticated role : ALL (admin bisa CRUD)

ALTER TABLE agenda          ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery         ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_config     ENABLE ROW LEVEL SECURITY;
ALTER TABLE countdown_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_config   ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links    ENABLE ROW LEVEL SECURITY;

-- agenda
CREATE POLICY "anon_select_agenda"      ON agenda FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_agenda"         ON agenda FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- articles
CREATE POLICY "anon_select_articles"    ON articles FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_articles"       ON articles FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- gallery
CREATE POLICY "anon_select_gallery"     ON gallery FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_gallery"        ON gallery FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- board_members
CREATE POLICY "anon_select_board"       ON board_members FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_board"          ON board_members FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- activity_log (hanya admin yang bisa lihat)
CREATE POLICY "auth_select_activity"    ON activity_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_activity"    ON activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- hero_config
CREATE POLICY "anon_select_hero"        ON hero_config FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_hero"           ON hero_config FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- countdown_config
CREATE POLICY "anon_select_countdown"   ON countdown_config FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_countdown"      ON countdown_config FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- donation_config
CREATE POLICY "anon_select_donation"    ON donation_config FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_donation"       ON donation_config FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- footer_config
CREATE POLICY "anon_select_footer"      ON footer_config FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_footer"         ON footer_config FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- social_links
CREATE POLICY "anon_select_socials"     ON social_links FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all_socials"        ON social_links FOR ALL   TO authenticated USING (true) WITH CHECK (true);
