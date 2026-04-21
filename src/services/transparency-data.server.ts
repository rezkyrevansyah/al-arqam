import "server-only";

import { unstable_cache } from "next/cache";

import type {
  TransparencyDonor,
  TransparencyMetric,
  TransparencyPageData,
  TransparencyProgram,
} from "@/data/types";
import type {
  InfaqTarawihEntry,
  SantunanYatimEntry,
  ZisEntry,
  ProgramType,
} from "@/data/types";
import { createClient } from "@/utils/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTransparencyMetric(row: any): TransparencyMetric {
  return {
    id: row.id,
    programId: row.program_id,
    label: row.label,
    value: Number(row.value ?? 0),
    valueType: row.value_type,
    suffix: row.suffix ?? "",
    note: row.note ?? "",
    sortOrder: row.sort_order ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTransparencyDonor(row: any): TransparencyDonor {
  return {
    id: row.id,
    programId: row.program_id,
    donorName: row.donor_name,
    amount: Number(row.amount ?? 0),
    donatedAt: row.donated_at ?? "",
    note: row.note ?? "",
    isAnonymous: row.is_anonymous ?? false,
    sortOrder: row.sort_order ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTransparencyProgram(
  row: any,
  metrics: TransparencyMetric[],
  donors: TransparencyDonor[],
): TransparencyProgram {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    badge: row.badge ?? "",
    category: row.category ?? "",
    periodLabel: row.period_label ?? "",
    year: Number(row.year ?? new Date().getFullYear()),
    description: row.description ?? "",
    progressLabel: row.progress_label ?? "Dana Terkumpul",
    collectedAmount: Number(row.collected_amount ?? 0),
    targetAmount: Number(row.target_amount ?? 0),
    relatedLinkLabel: row.related_link_label ?? "",
    relatedLinkUrl: row.related_link_url ?? "",
    isPublished: row.is_published ?? false,
    showDonors: row.show_donors ?? true,
    showMuzakkiList: row.show_muzakki_list ?? true,
    sortOrder: row.sort_order ?? 0,
    programType: (row.program_type ?? 'generic') as ProgramType,
    metrics,
    donors,
    infaqEntries: [],
    santunanEntries: [],
    zisEntries: [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toInfaqTarawihEntry(row: any): InfaqTarawihEntry {
  return {
    id: row.id,
    programId: row.program_id,
    malamKe: Number(row.malam_ke ?? 0),
    tanggal: row.tanggal ?? '',
    jumlah: Number(row.jumlah ?? 0),
    pengeluaran: Number(row.pengeluaran ?? 0),
    catatan: row.catatan ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSantunanYatimEntry(row: any): SantunanYatimEntry {
  return {
    id: row.id,
    programId: row.program_id,
    namaDonatur: row.nama_donatur ?? '',
    rt: row.rt ?? '',
    jumlahPaket: Number(row.jumlah_paket ?? 1),
    hargaPaket: Number(row.harga_paket ?? 200000),
    catatan: row.catatan ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toZisEntry(row: any): ZisEntry {
  return {
    id: row.id,
    programId: row.program_id,
    tanggal: row.tanggal ?? '',
    namaPetugas: row.nama_petugas ?? '',
    nomorResi: row.nomor_resi ?? '',
    namaMuzakki: row.nama_muzakki ?? '',
    alamat: row.alamat ?? '',
    rt: row.rt ?? '',
    zakatFitrahJiwa: Number(row.zakat_fitrah_jiwa ?? 0),
    zakatFitrahUang: Number(row.zakat_fitrah_uang ?? 0),
    zakatFitrahBerasLiter: Number(row.zakat_fitrah_beras_liter ?? 0),
    zakatFitrahBerasKg: Number(row.zakat_fitrah_beras_kg ?? 0),
    zakatMal: Number(row.zakat_mal ?? 0),
    infaqSedekah: Number(row.infaq_sedekah ?? 0),
    fidyahJiwa: Number(row.fidyah_jiwa ?? 0),
    fidyahRp: Number(row.fidyah_rp ?? 0),
    lainLain: Number(row.lain_lain ?? 0),
    catatan: row.catatan ?? '',
  };
}

function throwOnError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    throw new Error((error as { message: string }).message);
  }
}

function isSchemaMissingError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? (error as { code?: string }).code : undefined;
  const message = "message" in error ? (error as { message?: string }).message ?? "" : "";
  return (
    code === "42P01" ||
    code === "42703" ||
    /does not exist/i.test(message) ||
    /could not find the table/i.test(message)
  );
}

async function fetchTransparencyPageDataUncached(): Promise<TransparencyPageData> {
  const supabase = createClient();

  const [programsRes, metricsRes, donorsRes] = await Promise.all([
    supabase
      .from("transparency_programs")
      .select("*")
      .eq("is_published", true)
      .order("year", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("transparency_metrics")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("transparency_donors")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("donated_at", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if ([programsRes, metricsRes, donorsRes].some((result) => isSchemaMissingError(result.error))) {
    return { programs: [] };
  }

  [programsRes, metricsRes, donorsRes].forEach((result) => throwOnError(result.error));

  const metrics = (metricsRes.data ?? []).map(toTransparencyMetric);
  const donors = (donorsRes.data ?? []).map(toTransparencyDonor);

  const programs = (programsRes.data ?? []).map((program) =>
    toTransparencyProgram(
      program,
      metrics.filter((metric) => metric.programId === program.id),
      donors.filter((donor) => donor.programId === program.id),
    )
  );

  // Fetch typed entries for non-generic programs
  const typedPrograms = programs.filter(p => p.programType !== 'generic');

  if (typedPrograms.length > 0) {
    const infaqIds = typedPrograms.filter(p => p.programType === 'infaq_tarawih').map(p => p.id);
    const santunanIds = typedPrograms.filter(p => p.programType === 'santunan_yatim').map(p => p.id);
    const zisIds = typedPrograms.filter(p => p.programType === 'zis').map(p => p.id);

    const [infaqRes, santunanRes, zisRes] = await Promise.all([
      infaqIds.length > 0
        ? supabase.from('infaq_tarawih_entries').select('*').in('program_id', infaqIds).order('malam_ke', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      santunanIds.length > 0
        ? supabase.from('santunan_yatim_entries').select('*').in('program_id', santunanIds).order('created_at', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      zisIds.length > 0
        ? supabase.from('zis_entries').select('*').in('program_id', zisIds).order('tanggal', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ]);

    const infaqEntries = ((infaqRes.data ?? []) as any[]).map(toInfaqTarawihEntry);
    const santunanEntries = ((santunanRes.data ?? []) as any[]).map(toSantunanYatimEntry);
    const zisEntries = ((zisRes.data ?? []) as any[]).map(toZisEntry);

    return {
      programs: programs.map(p => ({
        ...p,
        infaqEntries: infaqEntries.filter(e => e.programId === p.id),
        santunanEntries: santunanEntries.filter(e => e.programId === p.id),
        zisEntries: zisEntries.filter(e => e.programId === p.id),
      })),
    };
  }

  return { programs };
}

export const getTransparencyPageData = unstable_cache(
  fetchTransparencyPageDataUncached,
  ["transparency-page-data"],
  { revalidate: 300 }
);
