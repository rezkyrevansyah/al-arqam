-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  user text NOT NULL DEFAULT 'admin'::text,
  CONSTRAINT activity_log_pkey PRIMARY KEY (id)
);
CREATE TABLE public.agenda (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  time text NOT NULL DEFAULT ''::text,
  location text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  category USER-DEFINED NOT NULL DEFAULT 'kegiatan'::agenda_category,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT agenda_pkey PRIMARY KEY (id)
);
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT ''::text,
  content text NOT NULL DEFAULT ''::text,
  author text NOT NULL DEFAULT 'Admin DKM'::text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  image text NOT NULL DEFAULT ''::text,
  category text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.board_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL DEFAULT ''::text,
  image text NOT NULL DEFAULT ''::text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT board_members_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type = ANY (ARRAY['agenda'::text, 'article'::text, 'transparency'::text])),
  name text NOT NULL,
  color text DEFAULT '#6366f1'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.countdown_config (
  lock boolean NOT NULL DEFAULT true CHECK (lock = true),
  name text NOT NULL DEFAULT ''::text,
  date timestamp with time zone NOT NULL DEFAULT now(),
  description text NOT NULL DEFAULT ''::text,
  active boolean NOT NULL DEFAULT false,
  CONSTRAINT countdown_config_pkey PRIMARY KEY (lock)
);
CREATE TABLE public.donation_config (
  lock boolean NOT NULL DEFAULT true CHECK (lock = true),
  bank_account_number text NOT NULL DEFAULT ''::text,
  bank_account_name text NOT NULL DEFAULT ''::text,
  bank_name text NOT NULL DEFAULT ''::text,
  donation_collected bigint NOT NULL DEFAULT 0,
  donation_target bigint NOT NULL DEFAULT 0,
  qris_image_url text NOT NULL DEFAULT ''::text,
  CONSTRAINT donation_config_pkey PRIMARY KEY (lock)
);
CREATE TABLE public.footer_config (
  lock boolean NOT NULL DEFAULT true CHECK (lock = true),
  address text NOT NULL DEFAULT ''::text,
  phone text NOT NULL DEFAULT ''::text,
  email text NOT NULL DEFAULT ''::text,
  maps_url text NOT NULL DEFAULT ''::text,
  CONSTRAINT footer_config_pkey PRIMARY KEY (lock)
);
CREATE TABLE public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image text NOT NULL,
  title text NOT NULL DEFAULT ''::text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
);
CREATE TABLE public.hero_config (
  lock boolean NOT NULL DEFAULT true CHECK (lock = true),
  title text NOT NULL DEFAULT ''::text,
  subtitle text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  CONSTRAINT hero_config_pkey PRIMARY KEY (lock)
);
CREATE TABLE public.infaq_tarawih_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  malam_ke integer NOT NULL,
  tanggal date NOT NULL,
  jumlah bigint NOT NULL DEFAULT 0,
  catatan text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  pengeluaran bigint NOT NULL DEFAULT 0,
  CONSTRAINT infaq_tarawih_entries_pkey PRIMARY KEY (id),
  CONSTRAINT infaq_tarawih_entries_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.transparency_programs(id)
);
CREATE TABLE public.santunan_yatim_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  nama_donatur text NOT NULL,
  rt text NOT NULL,
  jumlah_paket integer NOT NULL DEFAULT 1,
  harga_paket bigint NOT NULL DEFAULT 200000,
  catatan text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT santunan_yatim_entries_pkey PRIMARY KEY (id),
  CONSTRAINT santunan_yatim_entries_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.transparency_programs(id)
);
CREATE TABLE public.social_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  platform USER-DEFINED NOT NULL,
  url text NOT NULL DEFAULT ''::text,
  CONSTRAINT social_links_pkey PRIMARY KEY (id)
);
CREATE TABLE public.transparency_donors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  donor_name text NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  donated_at date,
  note text NOT NULL DEFAULT ''::text,
  is_anonymous boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transparency_donors_pkey PRIMARY KEY (id),
  CONSTRAINT transparency_donors_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.transparency_programs(id)
);
CREATE TABLE public.transparency_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  label text NOT NULL,
  value bigint NOT NULL DEFAULT 0,
  value_type text NOT NULL DEFAULT 'number'::text CHECK (value_type = ANY (ARRAY['currency'::text, 'number'::text])),
  suffix text NOT NULL DEFAULT ''::text,
  note text NOT NULL DEFAULT ''::text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transparency_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT transparency_metrics_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.transparency_programs(id)
);
CREATE TABLE public.transparency_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  badge text NOT NULL DEFAULT 'Dashboard Transparansi'::text,
  category text NOT NULL DEFAULT ''::text,
  period_label text NOT NULL DEFAULT ''::text,
  year integer NOT NULL DEFAULT (EXTRACT(year FROM now()))::integer,
  description text NOT NULL DEFAULT ''::text,
  progress_label text NOT NULL DEFAULT 'Dana Terkumpul'::text,
  collected_amount bigint NOT NULL DEFAULT 0,
  target_amount bigint NOT NULL DEFAULT 0,
  related_link_label text NOT NULL DEFAULT ''::text,
  related_link_url text NOT NULL DEFAULT ''::text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  program_type text NOT NULL DEFAULT 'generic'::text CHECK (program_type = ANY (ARRAY['generic'::text, 'infaq_tarawih'::text, 'santunan_yatim'::text, 'zis'::text])),
  CONSTRAINT transparency_programs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.zis_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  tanggal date,
  nama_petugas text DEFAULT ''::text,
  nomor_resi text DEFAULT ''::text,
  nama_muzakki text NOT NULL,
  alamat text DEFAULT ''::text,
  rt text DEFAULT ''::text,
  zakat_fitrah_jiwa integer DEFAULT 0,
  zakat_fitrah_uang bigint DEFAULT 0,
  zakat_fitrah_beras_liter numeric DEFAULT 0,
  zakat_fitrah_beras_kg numeric DEFAULT 0,
  zakat_mal bigint DEFAULT 0,
  infaq_sedekah bigint DEFAULT 0,
  fidyah_jiwa integer DEFAULT 0,
  fidyah_rp bigint DEFAULT 0,
  lain_lain bigint DEFAULT 0,
  catatan text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT zis_entries_pkey PRIMARY KEY (id),
  CONSTRAINT zis_entries_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.transparency_programs(id)
);