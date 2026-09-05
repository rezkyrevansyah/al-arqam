-- Phase 2: migrate the hardcoded Qurban + Gema Muharram microsites into the CMS.
-- Additive only — no existing table is altered.

-- ── Events (generic: competitions, one-off programs with results) ──────────

CREATE TABLE public.event_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'lomba'::text,
  year_label text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  documentation_url text NOT NULL DEFAULT ''::text,
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT event_programs_pkey PRIMARY KEY (id)
);

CREATE TABLE public.event_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  emoji text NOT NULL DEFAULT ''::text,
  name text NOT NULL,
  photo_url text NOT NULL DEFAULT ''::text,
  photo_alt text NOT NULL DEFAULT ''::text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT event_categories_pkey PRIMARY KEY (id),
  CONSTRAINT event_categories_program_id_fkey FOREIGN KEY (program_id)
    REFERENCES public.event_programs(id) ON DELETE CASCADE
);

CREATE TABLE public.event_winners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL,
  rank_label text NOT NULL,
  name text NOT NULL,
  badge text NOT NULL DEFAULT ''::text,
  is_honorable_mention boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT event_winners_pkey PRIMARY KEY (id),
  CONSTRAINT event_winners_category_id_fkey FOREIGN KEY (category_id)
    REFERENCES public.event_categories(id) ON DELETE CASCADE
);

ALTER TABLE public.event_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published event programs" ON public.event_programs
  FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated can manage event programs" ON public.event_programs
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public can view categories of published programs" ON public.event_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_programs p
      WHERE p.id = event_categories.program_id AND p.is_published = true
    )
  );
CREATE POLICY "Authenticated can manage event categories" ON public.event_categories
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public can view winners of published programs" ON public.event_winners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_categories c
      JOIN public.event_programs p ON p.id = c.program_id
      WHERE c.id = event_winners.category_id AND p.is_published = true
    )
  );
CREATE POLICY "Authenticated can manage event winners" ON public.event_winners
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ── Qurban config (singleton row, same "lock" pattern as donation_config) ──

CREATE TABLE public.qurban_config (
  lock boolean NOT NULL DEFAULT true CHECK (lock = true),
  year_label text NOT NULL DEFAULT ''::text,
  bank_name text NOT NULL DEFAULT ''::text,
  bank_account_number text NOT NULL DEFAULT ''::text,
  bank_account_name text NOT NULL DEFAULT ''::text,
  pricing_tiers jsonb NOT NULL DEFAULT '[]'::jsonb,
  contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  CONSTRAINT qurban_config_pkey PRIMARY KEY (lock)
);

ALTER TABLE public.qurban_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view qurban config" ON public.qurban_config
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage qurban config" ON public.qurban_config
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
