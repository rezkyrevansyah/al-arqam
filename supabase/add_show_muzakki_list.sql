ALTER TABLE public.transparency_programs
ADD COLUMN IF NOT EXISTS show_muzakki_list boolean NOT NULL DEFAULT true;
