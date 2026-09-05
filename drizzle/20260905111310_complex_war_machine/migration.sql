-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "agenda_category" AS ENUM('kajian', 'sholat', 'kegiatan', 'rapat');--> statement-breakpoint
CREATE TYPE "social_platform" AS ENUM('instagram', 'youtube', 'facebook', 'tiktok');--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"user" text DEFAULT 'admin' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "agenda" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"date" date NOT NULL,
	"time" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" "agenda_category" DEFAULT 'kegiatan'::"agenda_category" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agenda" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"author" text DEFAULT 'Admin DKM' NOT NULL,
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "board_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "board_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"entity_type" text NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#6366f1',
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_entity_type_name_key" UNIQUE("entity_type","name"),
	CONSTRAINT "categories_entity_type_check" CHECK ((entity_type = ANY (ARRAY['agenda'::text, 'article'::text, 'transparency'::text])))
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "countdown_config" (
	"lock" boolean PRIMARY KEY DEFAULT true,
	"name" text DEFAULT '' NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	CONSTRAINT "countdown_config_single_row" CHECK ((lock = true))
);
--> statement-breakpoint
ALTER TABLE "countdown_config" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "donation_config" (
	"lock" boolean PRIMARY KEY DEFAULT true,
	"bank_account_number" text DEFAULT '' NOT NULL,
	"bank_account_name" text DEFAULT '' NOT NULL,
	"bank_name" text DEFAULT '' NOT NULL,
	"donation_collected" bigint DEFAULT 0 NOT NULL,
	"donation_target" bigint DEFAULT 0 NOT NULL,
	"qris_image_url" text DEFAULT '' NOT NULL,
	CONSTRAINT "donation_config_single_row" CHECK ((lock = true))
);
--> statement-breakpoint
ALTER TABLE "donation_config" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "footer_config" (
	"lock" boolean PRIMARY KEY DEFAULT true,
	"address" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"maps_url" text DEFAULT '' NOT NULL,
	CONSTRAINT "footer_config_single_row" CHECK ((lock = true))
);
--> statement-breakpoint
ALTER TABLE "footer_config" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"image" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "hero_config" (
	"lock" boolean PRIMARY KEY DEFAULT true,
	"title" text DEFAULT '' NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "hero_config_single_row" CHECK ((lock = true))
);
--> statement-breakpoint
ALTER TABLE "hero_config" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "infaq_tarawih_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"program_id" uuid NOT NULL,
	"malam_ke" integer NOT NULL,
	"tanggal" date NOT NULL,
	"jumlah" bigint DEFAULT 0 NOT NULL,
	"catatan" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"pengeluaran" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "uq_infaq_program_malam" UNIQUE("program_id","malam_ke")
);
--> statement-breakpoint
ALTER TABLE "infaq_tarawih_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "santunan_yatim_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"program_id" uuid NOT NULL,
	"nama_donatur" text NOT NULL,
	"rt" text NOT NULL,
	"jumlah_paket" integer DEFAULT 1 NOT NULL,
	"harga_paket" bigint DEFAULT 200000 NOT NULL,
	"catatan" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "santunan_yatim_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"platform" "social_platform" NOT NULL,
	"url" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "social_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transparency_donors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"program_id" uuid NOT NULL,
	"donor_name" text NOT NULL,
	"amount" bigint DEFAULT 0 NOT NULL,
	"donated_at" date,
	"note" text DEFAULT '' NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transparency_donors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transparency_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"program_id" uuid NOT NULL,
	"label" text NOT NULL,
	"value" bigint DEFAULT 0 NOT NULL,
	"value_type" text DEFAULT 'number' NOT NULL,
	"suffix" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transparency_metrics_value_type_check" CHECK ((value_type = ANY (ARRAY['currency'::text, 'number'::text])))
);
--> statement-breakpoint
ALTER TABLE "transparency_metrics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transparency_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL CONSTRAINT "transparency_programs_slug_key" UNIQUE,
	"title" text NOT NULL,
	"badge" text DEFAULT 'Dashboard Transparansi' NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"period_label" text DEFAULT '' NOT NULL,
	"year" integer DEFAULT (EXTRACT(year FROM now())) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"progress_label" text DEFAULT 'Dana Terkumpul' NOT NULL,
	"collected_amount" bigint DEFAULT 0 NOT NULL,
	"target_amount" bigint DEFAULT 0 NOT NULL,
	"related_link_label" text DEFAULT '' NOT NULL,
	"related_link_url" text DEFAULT '' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"program_type" text DEFAULT 'generic' NOT NULL,
	"show_donors" boolean DEFAULT true NOT NULL,
	"show_muzakki_list" boolean DEFAULT true NOT NULL,
	CONSTRAINT "transparency_programs_program_type_check" CHECK ((program_type = ANY (ARRAY['generic'::text, 'infaq_tarawih'::text, 'santunan_yatim'::text, 'zis'::text])))
);
--> statement-breakpoint
ALTER TABLE "transparency_programs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "zis_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"program_id" uuid NOT NULL,
	"tanggal" date,
	"nama_petugas" text DEFAULT '',
	"nomor_resi" text DEFAULT '',
	"nama_muzakki" text NOT NULL,
	"alamat" text DEFAULT '',
	"rt" text DEFAULT '',
	"zakat_fitrah_jiwa" integer DEFAULT 0,
	"zakat_fitrah_uang" bigint DEFAULT 0,
	"zakat_fitrah_beras_liter" numeric(10,2) DEFAULT '0',
	"zakat_fitrah_beras_kg" numeric(10,2) DEFAULT '0',
	"zakat_mal" bigint DEFAULT 0,
	"infaq_sedekah" bigint DEFAULT 0,
	"fidyah_jiwa" integer DEFAULT 0,
	"fidyah_rp" bigint DEFAULT 0,
	"lain_lain" bigint DEFAULT 0,
	"catatan" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "zis_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "idx_infaq_tarawih_malam" ON "infaq_tarawih_entries" ("malam_ke");--> statement-breakpoint
CREATE INDEX "idx_infaq_tarawih_program" ON "infaq_tarawih_entries" ("program_id");--> statement-breakpoint
CREATE INDEX "idx_santunan_program" ON "santunan_yatim_entries" ("program_id");--> statement-breakpoint
CREATE INDEX "idx_santunan_rt" ON "santunan_yatim_entries" ("rt");--> statement-breakpoint
CREATE INDEX "idx_zis_program" ON "zis_entries" ("program_id");--> statement-breakpoint
CREATE INDEX "idx_zis_rt" ON "zis_entries" ("rt");--> statement-breakpoint
CREATE INDEX "idx_zis_tanggal" ON "zis_entries" ("tanggal");--> statement-breakpoint
CREATE INDEX "transparency_donors_program_sort_idx" ON "transparency_donors" ("program_id","sort_order","donated_at" DESC,"created_at" DESC);--> statement-breakpoint
CREATE INDEX "transparency_metrics_program_sort_idx" ON "transparency_metrics" ("program_id","sort_order","created_at");--> statement-breakpoint
CREATE INDEX "transparency_programs_published_idx" ON "transparency_programs" ("is_published");--> statement-breakpoint
CREATE INDEX "transparency_programs_year_sort_idx" ON "transparency_programs" ("year" DESC,"sort_order","created_at" DESC);--> statement-breakpoint
ALTER TABLE "transparency_metrics" ADD CONSTRAINT "transparency_metrics_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "transparency_programs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transparency_donors" ADD CONSTRAINT "transparency_donors_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "transparency_programs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "infaq_tarawih_entries" ADD CONSTRAINT "infaq_tarawih_entries_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "transparency_programs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "santunan_yatim_entries" ADD CONSTRAINT "santunan_yatim_entries_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "transparency_programs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "zis_entries" ADD CONSTRAINT "zis_entries_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "transparency_programs"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE POLICY "auth_insert_activity" ON "activity_log" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "auth_select_activity" ON "activity_log" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "anon_select_agenda" ON "agenda" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_agenda" ON "agenda" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "anon_select_articles" ON "articles" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_articles" ON "articles" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "anon_select_board" ON "board_members" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_board" ON "board_members" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Auth manage categories" ON "categories" AS PERMISSIVE FOR ALL TO public USING ((auth.role() = 'authenticated'::text));--> statement-breakpoint
CREATE POLICY "Public read categories" ON "categories" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "anon_select_countdown" ON "countdown_config" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_countdown" ON "countdown_config" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "anon_select_donation" ON "donation_config" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_donation" ON "donation_config" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "anon_select_footer" ON "footer_config" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_footer" ON "footer_config" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "anon_select_gallery" ON "gallery" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_gallery" ON "gallery" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "anon_select_hero" ON "hero_config" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_hero" ON "hero_config" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Auth manage infaq" ON "infaq_tarawih_entries" AS PERMISSIVE FOR ALL TO public USING ((auth.role() = 'authenticated'::text));--> statement-breakpoint
CREATE POLICY "Public read infaq" ON "infaq_tarawih_entries" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Auth manage santunan" ON "santunan_yatim_entries" AS PERMISSIVE FOR ALL TO public USING ((auth.role() = 'authenticated'::text));--> statement-breakpoint
CREATE POLICY "Public read santunan" ON "santunan_yatim_entries" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "anon_select_socials" ON "social_links" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "auth_all_socials" ON "social_links" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "transparency_donors_authenticated_delete" ON "transparency_donors" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "transparency_donors_authenticated_insert" ON "transparency_donors" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "transparency_donors_authenticated_read_all" ON "transparency_donors" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "transparency_donors_authenticated_update" ON "transparency_donors" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "transparency_donors_public_read_published_programs" ON "transparency_donors" AS PERMISSIVE FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM transparency_programs program
  WHERE ((program.id = transparency_donors.program_id) AND (program.is_published = true)))));--> statement-breakpoint
CREATE POLICY "transparency_metrics_authenticated_delete" ON "transparency_metrics" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "transparency_metrics_authenticated_insert" ON "transparency_metrics" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "transparency_metrics_authenticated_read_all" ON "transparency_metrics" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "transparency_metrics_authenticated_update" ON "transparency_metrics" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "transparency_metrics_public_read_published_programs" ON "transparency_metrics" AS PERMISSIVE FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM transparency_programs program
  WHERE ((program.id = transparency_metrics.program_id) AND (program.is_published = true)))));--> statement-breakpoint
CREATE POLICY "transparency_programs_authenticated_delete" ON "transparency_programs" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "transparency_programs_authenticated_insert" ON "transparency_programs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "transparency_programs_authenticated_read_all" ON "transparency_programs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "transparency_programs_authenticated_update" ON "transparency_programs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "transparency_programs_public_read_published" ON "transparency_programs" AS PERMISSIVE FOR SELECT TO "anon" USING ((is_published = true));--> statement-breakpoint
CREATE POLICY "Auth manage zis" ON "zis_entries" AS PERMISSIVE FOR ALL TO public USING ((auth.role() = 'authenticated'::text));--> statement-breakpoint
CREATE POLICY "Public read zis" ON "zis_entries" AS PERMISSIVE FOR SELECT TO public USING (true);
*/