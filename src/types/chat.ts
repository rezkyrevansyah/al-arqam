import type { UIMessage, UIDataTypes, InferUITools } from "ai";
import type { chatTools } from "@/services/chat-tools.server";

export interface AyatData {
  id_surat: number;
  nama_surat: string;
  nama_surat_arab: string;
  nomor_ayat: number;
  teks_arab: string;
  teks_latin: string;
  terjemahan_id: string;
  terjemahan_en?: string;
}

export interface DoaData {
  id_doa: number;
  judul: string;
  grup: string;
  teks_arab: string;
  teks_latin: string;
  terjemahan: string;
  sumber?: string;
  catatan?: string;
}

export interface TafsirData {
  id_surat: number;
  nama_surat: string;
  nama_surat_arab: string;
  nomor_ayat: number;
  isi: string;
}

export interface SuratData {
  id_surat: number;
  nama: string;
  nama_arab: string;
  arti: string;
  jumlah_ayat: number;
  tempat_turun: string;
  deskripsi: string;
}

export type VectorResultItem =
  | { tipe: "ayat"; skor: number; relevansi: string; data: AyatData }
  | { tipe: "doa"; skor: number; relevansi: string; data: DoaData }
  | { tipe: "tafsir"; skor: number; relevansi: string; data: TafsirData }
  | { tipe: "surat"; skor: number; relevansi: string; data: SuratData };

export interface MosquePrayerData {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  gregorianDate: string;
  hijriDate: string;
  location: string;
}

export interface MosqueAgendaData {
  id?: string;
  title: string;
  date: string;
  endDate?: string | null;
  time: string;
  location: string;
  status: "akan_datang" | "sedang_berlangsung" | "selesai";
  category: string;
}

export interface MosqueDonationData {
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  qrisImageUrl?: string;
}

export interface MosqueLocationData {
  name: string;
  address: string;
  mapsUrl: string;
}

export interface MosqueInfoPayload {
  type: "prayer" | "agenda" | "donation" | "location";
  prayer?: MosquePrayerData;
  agenda?: MosqueAgendaData[];
  donation?: MosqueDonationData;
  location?: MosqueLocationData;
}

export interface ChatEventWinnerSummary {
  rankLabel: string;
  name: string;
}

export interface ChatEventCategorySummary {
  name: string;
  winners: ChatEventWinnerSummary[];
}

export interface ChatEventProgramSummary {
  title: string;
  yearLabel: string;
  description: string;
  categories: ChatEventCategorySummary[];
}

type AlArqamTools = InferUITools<typeof chatTools>;

/** The chat UI message type, strongly typed against this app's tool set. */
export type AlArqamUIMessage = UIMessage<unknown, UIDataTypes, AlArqamTools>;
