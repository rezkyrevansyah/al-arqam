import { pgEnum, pgTable, boolean, uuid, text, timestamp, date, integer, bigint, numeric, index, foreignKey, primaryKey, unique, check, pgPolicy } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const agendaCategory = pgEnum("agenda_category", ["kajian", "sholat", "kegiatan", "rapat"])
export const socialPlatform = pgEnum("social_platform", ["instagram", "youtube", "facebook", "tiktok"])


export const activityLog = pgTable.withRLS("activity_log", {
	id: uuid().defaultRandom().primaryKey(),
	timestamp: timestamp({ withTimezone: true }).default(sql`now()`).notNull(),
	action: text().notNull(),
	entity: text().notNull(),
	entityId: text("entity_id").default("").notNull(),
	description: text().default("").notNull(),
	user: text().default("admin").notNull(),
}, (table) => [

	pgPolicy("auth_insert_activity", { for: "insert", to: ["authenticated"], withCheck: sql`true` }),

	pgPolicy("auth_select_activity", { for: "select", to: ["authenticated"], using: sql`true` }),
]);

export const agenda = pgTable.withRLS("agenda", {
	id: uuid().defaultRandom().primaryKey(),
	title: text().notNull(),
	date: date().notNull(),
	endDate: date("end_date"),
	time: text().default("").notNull(),
	location: text().default("").notNull(),
	description: text().default("").notNull(),
	category: agendaCategory().default("kegiatan").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [

	pgPolicy("anon_select_agenda", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_agenda", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
]);

export const articles = pgTable.withRLS("articles", {
	id: uuid().defaultRandom().primaryKey(),
	title: text().notNull(),
	excerpt: text().default("").notNull(),
	content: text().default("").notNull(),
	author: text().default("Admin DKM").notNull(),
	date: date().default(sql`CURRENT_DATE`).notNull(),
	image: text().default("").notNull(),
	category: text().default("").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [

	pgPolicy("anon_select_articles", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_articles", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
]);

export const boardMembers = pgTable.withRLS("board_members", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	title: text().default("").notNull(),
	image: text().default("").notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [

	pgPolicy("anon_select_board", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_board", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
]);

export const categories = pgTable.withRLS("categories", {
	id: uuid().defaultRandom().primaryKey(),
	entityType: text("entity_type").notNull(),
	name: text().notNull(),
	color: text().default("#6366f1"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	unique("categories_entity_type_name_key").on(table.entityType, table.name),
	pgPolicy("Auth manage categories", { using: sql`(auth.role() = 'authenticated'::text)` }),

	pgPolicy("Public read categories", { for: "select", using: sql`true` }),
check("categories_entity_type_check", sql`(entity_type = ANY (ARRAY['agenda'::text, 'article'::text, 'transparency'::text]))`),]);

export const countdownConfig = pgTable.withRLS("countdown_config", {
	lock: boolean().default(true).primaryKey(),
	name: text().default("").notNull(),
	date: timestamp({ withTimezone: true }).default(sql`now()`).notNull(),
	description: text().default("").notNull(),
	active: boolean().default(false).notNull(),
}, (table) => [

	pgPolicy("anon_select_countdown", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_countdown", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
check("countdown_config_single_row", sql`(lock = true)`),]);

export const donationConfig = pgTable.withRLS("donation_config", {
	lock: boolean().default(true).primaryKey(),
	bankAccountNumber: text("bank_account_number").default("").notNull(),
	bankAccountName: text("bank_account_name").default("").notNull(),
	bankName: text("bank_name").default("").notNull(),
	donationCollected: bigint("donation_collected", { mode: 'number' }).default(0).notNull(),
	donationTarget: bigint("donation_target", { mode: 'number' }).default(0).notNull(),
	qrisImageUrl: text("qris_image_url").default("").notNull(),
}, (table) => [

	pgPolicy("anon_select_donation", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_donation", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
check("donation_config_single_row", sql`(lock = true)`),]);

export const footerConfig = pgTable.withRLS("footer_config", {
	lock: boolean().default(true).primaryKey(),
	address: text().default("").notNull(),
	phone: text().default("").notNull(),
	email: text().default("").notNull(),
	mapsUrl: text("maps_url").default("").notNull(),
}, (table) => [

	pgPolicy("anon_select_footer", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_footer", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
check("footer_config_single_row", sql`(lock = true)`),]);

export const gallery = pgTable.withRLS("gallery", {
	id: uuid().defaultRandom().primaryKey(),
	image: text().notNull(),
	title: text().default("").notNull(),
	date: date().default(sql`CURRENT_DATE`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [

	pgPolicy("anon_select_gallery", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_gallery", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
]);

export const heroConfig = pgTable.withRLS("hero_config", {
	lock: boolean().default(true).primaryKey(),
	title: text().default("").notNull(),
	subtitle: text().default("").notNull(),
	description: text().default("").notNull(),
}, (table) => [

	pgPolicy("anon_select_hero", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_hero", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
check("hero_config_single_row", sql`(lock = true)`),]);

export const infaqTarawihEntries = pgTable.withRLS("infaq_tarawih_entries", {
	id: uuid().defaultRandom().primaryKey(),
	programId: uuid("program_id").notNull().references(() => transparencyPrograms.id, { onDelete: "cascade" } ),
	malamKe: integer("malam_ke").notNull(),
	tanggal: date().notNull(),
	jumlah: bigint({ mode: 'number' }).default(0).notNull(),
	catatan: text().default(""),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	pengeluaran: bigint({ mode: 'number' }).default(0).notNull(),
}, (table) => [
	index("idx_infaq_tarawih_malam").using("btree", table.malamKe.asc().nullsLast()),
	index("idx_infaq_tarawih_program").using("btree", table.programId.asc().nullsLast()),
	unique("uq_infaq_program_malam").on(table.programId, table.malamKe),
	pgPolicy("Auth manage infaq", { using: sql`(auth.role() = 'authenticated'::text)` }),

	pgPolicy("Public read infaq", { for: "select", using: sql`true` }),
]);

export const santunanYatimEntries = pgTable.withRLS("santunan_yatim_entries", {
	id: uuid().defaultRandom().primaryKey(),
	programId: uuid("program_id").notNull().references(() => transparencyPrograms.id, { onDelete: "cascade" } ),
	namaDonatur: text("nama_donatur").notNull(),
	rt: text().notNull(),
	jumlahPaket: integer("jumlah_paket").default(1).notNull(),
	hargaPaket: bigint("harga_paket", { mode: 'number' }).default(200000).notNull(),
	catatan: text().default(""),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_santunan_program").using("btree", table.programId.asc().nullsLast()),
	index("idx_santunan_rt").using("btree", table.rt.asc().nullsLast()),

	pgPolicy("Auth manage santunan", { using: sql`(auth.role() = 'authenticated'::text)` }),

	pgPolicy("Public read santunan", { for: "select", using: sql`true` }),
]);

export const socialLinks = pgTable.withRLS("social_links", {
	id: uuid().defaultRandom().primaryKey(),
	platform: socialPlatform().notNull(),
	url: text().default("").notNull(),
}, (table) => [

	pgPolicy("anon_select_socials", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("auth_all_socials", { to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),
]);

export const transparencyDonors = pgTable.withRLS("transparency_donors", {
	id: uuid().defaultRandom().primaryKey(),
	programId: uuid("program_id").notNull().references(() => transparencyPrograms.id, { onDelete: "cascade" } ),
	donorName: text("donor_name").notNull(),
	amount: bigint({ mode: 'number' }).default(0).notNull(),
	donatedAt: date("donated_at"),
	note: text().default("").notNull(),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("transparency_donors_program_sort_idx").using("btree", table.programId.asc().nullsLast(), table.sortOrder.asc().nullsLast(), table.donatedAt.desc().nullsFirst(), table.createdAt.desc().nullsFirst()),

	pgPolicy("transparency_donors_authenticated_delete", { for: "delete", to: ["authenticated"], using: sql`true` }),

	pgPolicy("transparency_donors_authenticated_insert", { for: "insert", to: ["authenticated"], withCheck: sql`true` }),

	pgPolicy("transparency_donors_authenticated_read_all", { for: "select", to: ["authenticated"], using: sql`true` }),

	pgPolicy("transparency_donors_authenticated_update", { for: "update", to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),

	pgPolicy("transparency_donors_public_read_published_programs", { for: "select", to: ["anon"], using: sql`(EXISTS ( SELECT 1
   FROM transparency_programs program
  WHERE ((program.id = transparency_donors.program_id) AND (program.is_published = true))))` }),
]);

export const transparencyMetrics = pgTable.withRLS("transparency_metrics", {
	id: uuid().defaultRandom().primaryKey(),
	programId: uuid("program_id").notNull().references(() => transparencyPrograms.id, { onDelete: "cascade" } ),
	label: text().notNull(),
	value: bigint({ mode: 'number' }).default(0).notNull(),
	valueType: text("value_type").default("number").notNull(),
	suffix: text().default("").notNull(),
	note: text().default("").notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("transparency_metrics_program_sort_idx").using("btree", table.programId.asc().nullsLast(), table.sortOrder.asc().nullsLast(), table.createdAt.asc().nullsLast()),

	pgPolicy("transparency_metrics_authenticated_delete", { for: "delete", to: ["authenticated"], using: sql`true` }),

	pgPolicy("transparency_metrics_authenticated_insert", { for: "insert", to: ["authenticated"], withCheck: sql`true` }),

	pgPolicy("transparency_metrics_authenticated_read_all", { for: "select", to: ["authenticated"], using: sql`true` }),

	pgPolicy("transparency_metrics_authenticated_update", { for: "update", to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),

	pgPolicy("transparency_metrics_public_read_published_programs", { for: "select", to: ["anon"], using: sql`(EXISTS ( SELECT 1
   FROM transparency_programs program
  WHERE ((program.id = transparency_metrics.program_id) AND (program.is_published = true))))` }),
check("transparency_metrics_value_type_check", sql`(value_type = ANY (ARRAY['currency'::text, 'number'::text]))`),]);

export const transparencyPrograms = pgTable.withRLS("transparency_programs", {
	id: uuid().defaultRandom().primaryKey(),
	slug: text().notNull(),
	title: text().notNull(),
	badge: text().default("Dashboard Transparansi").notNull(),
	category: text().default("").notNull(),
	periodLabel: text("period_label").default("").notNull(),
	year: integer().default(sql`EXTRACT(year FROM now())`).notNull(),
	description: text().default("").notNull(),
	progressLabel: text("progress_label").default("Dana Terkumpul").notNull(),
	collectedAmount: bigint("collected_amount", { mode: 'number' }).default(0).notNull(),
	targetAmount: bigint("target_amount", { mode: 'number' }).default(0).notNull(),
	relatedLinkLabel: text("related_link_label").default("").notNull(),
	relatedLinkUrl: text("related_link_url").default("").notNull(),
	isPublished: boolean("is_published").default(false).notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	programType: text("program_type").default("generic").notNull(),
	showDonors: boolean("show_donors").default(true).notNull(),
	showMuzakkiList: boolean("show_muzakki_list").default(true).notNull(),
}, (table) => [
	index("transparency_programs_published_idx").using("btree", table.isPublished.asc().nullsLast()),
	index("transparency_programs_year_sort_idx").using("btree", table.year.desc().nullsFirst(), table.sortOrder.asc().nullsLast(), table.createdAt.desc().nullsFirst()),
	unique("transparency_programs_slug_key").on(table.slug),
	pgPolicy("transparency_programs_authenticated_delete", { for: "delete", to: ["authenticated"], using: sql`true` }),

	pgPolicy("transparency_programs_authenticated_insert", { for: "insert", to: ["authenticated"], withCheck: sql`true` }),

	pgPolicy("transparency_programs_authenticated_read_all", { for: "select", to: ["authenticated"], using: sql`true` }),

	pgPolicy("transparency_programs_authenticated_update", { for: "update", to: ["authenticated"], using: sql`true`, withCheck: sql`true` }),

	pgPolicy("transparency_programs_public_read_published", { for: "select", to: ["anon"], using: sql`(is_published = true)` }),
check("transparency_programs_program_type_check", sql`(program_type = ANY (ARRAY['generic'::text, 'infaq_tarawih'::text, 'santunan_yatim'::text, 'zis'::text]))`),]);

export const zisEntries = pgTable.withRLS("zis_entries", {
	id: uuid().defaultRandom().primaryKey(),
	programId: uuid("program_id").notNull().references(() => transparencyPrograms.id, { onDelete: "cascade" } ),
	tanggal: date(),
	namaPetugas: text("nama_petugas").default(""),
	nomorResi: text("nomor_resi").default(""),
	namaMuzakki: text("nama_muzakki").notNull(),
	alamat: text().default(""),
	rt: text().default(""),
	zakatFitrahJiwa: integer("zakat_fitrah_jiwa").default(0),
	zakatFitrahUang: bigint("zakat_fitrah_uang", { mode: 'number' }).default(0),
	zakatFitrahBerasLiter: numeric("zakat_fitrah_beras_liter", { mode: 'number', precision: 10, scale: 2 }).default(0),
	zakatFitrahBerasKg: numeric("zakat_fitrah_beras_kg", { mode: 'number', precision: 10, scale: 2 }).default(0),
	zakatMal: bigint("zakat_mal", { mode: 'number' }).default(0),
	infaqSedekah: bigint("infaq_sedekah", { mode: 'number' }).default(0),
	fidyahJiwa: integer("fidyah_jiwa").default(0),
	fidyahRp: bigint("fidyah_rp", { mode: 'number' }).default(0),
	lainLain: bigint("lain_lain", { mode: 'number' }).default(0),
	catatan: text().default(""),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_zis_program").using("btree", table.programId.asc().nullsLast()),
	index("idx_zis_rt").using("btree", table.rt.asc().nullsLast()),
	index("idx_zis_tanggal").using("btree", table.tanggal.asc().nullsLast()),

	pgPolicy("Auth manage zis", { using: sql`(auth.role() = 'authenticated'::text)` }),

	pgPolicy("Public read zis", { for: "select", using: sql`true` }),
]);
