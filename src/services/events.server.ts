import "server-only";

import { unstable_cache } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import type { EventCategory, EventProgram, EventWinner, QurbanConfig } from "@/data/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toEventWinner(row: any): EventWinner {
  return {
    id: row.id,
    categoryId: row.category_id,
    rankLabel: row.rank_label,
    name: row.name,
    badge: row.badge ?? "",
    isHonorableMention: row.is_honorable_mention ?? false,
    sortOrder: row.sort_order ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toEventCategory(row: any, winners: EventWinner[]): EventCategory {
  return {
    id: row.id,
    programId: row.program_id,
    emoji: row.emoji ?? "",
    name: row.name,
    photoUrl: row.photo_url ?? "",
    photoAlt: row.photo_alt ?? "",
    sortOrder: row.sort_order ?? 0,
    winners,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toEventProgram(row: any, categories: EventCategory[]): EventProgram {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type ?? "lomba",
    yearLabel: row.year_label ?? "",
    description: row.description ?? "",
    documentationUrl: row.documentation_url ?? "",
    isPublished: row.is_published ?? true,
    isFeatured: row.is_featured ?? false,
    sortOrder: row.sort_order ?? 0,
    categories,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toQurbanConfig(row: any): QurbanConfig {
  return {
    yearLabel: row.year_label ?? "",
    bankName: row.bank_name ?? "",
    bankAccountNumber: row.bank_account_number ?? "",
    bankAccountName: row.bank_account_name ?? "",
    pricingTiers: row.pricing_tiers ?? [],
    contacts: row.contacts ?? [],
  };
}

function throwOnError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    throw new Error((error as { message: string }).message);
  }
}

async function fetchPublishedEventProgramsUncached(): Promise<EventProgram[]> {
  const supabase = createClient();

  const [programsRes, categoriesRes, winnersRes] = await Promise.all([
    supabase
      .from("event_programs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    supabase.from("event_categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("event_winners").select("*").order("sort_order", { ascending: true }),
  ]);

  [programsRes, categoriesRes, winnersRes].forEach((result) => throwOnError(result.error));

  const winners = (winnersRes.data ?? []).map(toEventWinner);
  const categories = (categoriesRes.data ?? []).map((row) =>
    toEventCategory(row, winners.filter((w) => w.categoryId === row.id))
  );

  return (programsRes.data ?? []).map((program) =>
    toEventProgram(program, categories.filter((c) => c.programId === program.id))
  );
}

async function fetchQurbanConfigUncached(): Promise<QurbanConfig> {
  const supabase = createClient();
  const { data, error } = await supabase.from("qurban_config").select("*").single();
  throwOnError(error);
  return toQurbanConfig(data);
}

export const getEventPrograms = unstable_cache(
  fetchPublishedEventProgramsUncached,
  ["event-programs-site-data"],
  { revalidate: 300 }
);

export const getQurbanConfig = unstable_cache(fetchQurbanConfigUncached, ["qurban-config-site-data"], {
  revalidate: 300,
});

export async function getEventProgramBySlug(slug: string): Promise<EventProgram | null> {
  const programs = await getEventPrograms();
  return programs.find((p) => p.slug === slug) ?? null;
}
