import "server-only";

import { tool } from "ai";
import { z } from "zod";

import { getTodayPrayerTimes } from "@/services/prayer-times.server";
import {
  getHomeSiteData,
  getArticlesData,
  getGalleryData,
  getFooterData,
} from "@/services/site-data.server";
import { getTransparencyPageData } from "@/services/transparency-data.server";
import { getEventPrograms, getQurbanConfig } from "@/services/events.server";
import { searchQuranVector } from "@/services/quran-vector.server";
import { getAgendaStatus } from "@/utils/agenda";

export const chatTools = {
  searchQuran: tool({
    description:
      "Cari ayat Al-Qur'an, tafsir, doa/dzikir, atau info surat secara semantik (bukan hanya kata kunci persis). Gunakan ini untuk pertanyaan seputar ayat, tafsir, doa, atau topik keislaman umum.",
    inputSchema: z.object({
      query: z.string().describe("Pertanyaan atau topik yang ingin dicari, dalam bahasa natural"),
    }),
    execute: async ({ query }: { query: string }) => {
      const results = await searchQuranVector(query);
      return { results };
    },
  }),

  getPrayerTimes: tool({
    description: "Ambil jadwal sholat hari ini untuk Masjid Jami' Al-Arqam (Bekasi Utara).",
    inputSchema: z.object({}),
    execute: async () => {
      const data = await getTodayPrayerTimes();
      if (!data) return { error: "Jadwal sholat sedang tidak tersedia saat ini." };
      return {
        subuh: data.schedules.subuh,
        dzuhur: data.schedules.dzuhur,
        ashar: data.schedules.ashar,
        maghrib: data.schedules.maghrib,
        isya: data.schedules.isya,
        gregorianDate: data.gregorianDate,
        hijriDate: data.hijriDate,
        location: data.locationLabel,
      };
    },
  }),

  getAgendaInfo: tool({
    description: "Ambil daftar agenda dan kajian masjid (yang akan datang dan sedang berlangsung).",
    inputSchema: z.object({}),
    execute: async () => {
      const siteData = await getHomeSiteData();
      const agenda = (siteData.agenda ?? []).map((a) => {
        const statusInfo = getAgendaStatus(a.date, a.endDate);
        return {
          title: a.title,
          date: a.date,
          endDate: a.endDate,
          time: a.time,
          location: a.location,
          status: statusInfo.status,
          category: a.category,
        };
      });
      return { agenda };
    },
  }),

  getDonationInfo: tool({
    description: "Ambil info rekening donasi/infaq resmi masjid.",
    inputSchema: z.object({}),
    execute: async () => {
      const siteData = await getHomeSiteData();
      return {
        bankName: siteData.donation.bankName,
        bankAccountNumber: siteData.donation.bankAccountNumber,
        bankAccountName: siteData.donation.bankAccountName,
      };
    },
  }),

  getLocationInfo: tool({
    description: "Ambil alamat dan lokasi peta Masjid Jami' Al-Arqam.",
    inputSchema: z.object({}),
    execute: async () => {
      const footer = await getFooterData();
      return {
        name: "Masjid Jami' Al-Arqam Bekasi Utara",
        address: footer.address,
        mapsUrl: footer.mapsUrl,
      };
    },
  }),

  getQurbanInfo: tool({
    description: "Ambil info paket harga qurban, rekening pembayaran, dan kontak panitia qurban.",
    inputSchema: z.object({}),
    execute: async () => {
      const qurban = await getQurbanConfig();
      return qurban;
    },
  }),

  getEventResults: tool({
    description:
      "Ambil hasil/pemenang lomba dan event masjid yang sudah dipublikasikan (misal Gema Muharram).",
    inputSchema: z.object({}),
    execute: async () => {
      const programs = await getEventPrograms();
      return {
        programs: programs.map((p) => ({
          title: p.title,
          yearLabel: p.yearLabel,
          description: p.description,
          categories: p.categories.map((c) => ({
            name: c.name,
            winners: c.winners.map((w) => ({ rankLabel: w.rankLabel, name: w.name })),
          })),
        })),
      };
    },
  }),

  getArticlesInfo: tool({
    description: "Ambil daftar artikel/berita terbaru dari website masjid.",
    inputSchema: z.object({}),
    execute: async () => {
      const articles = await getArticlesData();
      return {
        articles: articles.slice(0, 10).map((a) => ({
          title: a.title,
          excerpt: a.excerpt,
          date: a.date,
          category: a.category,
        })),
      };
    },
  }),

  getGalleryInfo: tool({
    description: "Ambil daftar foto/dokumentasi kegiatan terbaru di galeri website masjid.",
    inputSchema: z.object({}),
    execute: async () => {
      const gallery = await getGalleryData();
      return { items: gallery.slice(0, 10).map((g) => ({ title: g.title, date: g.date })) };
    },
  }),

  getTransparencyInfo: tool({
    description:
      "Ambil ringkasan dashboard transparansi keuangan masjid (donasi, ZIS, infaq tarawih, santunan yatim).",
    inputSchema: z.object({}),
    execute: async () => {
      const { programs } = await getTransparencyPageData();
      return {
        programs: programs
          .filter((p) => p.isPublished)
          .map((p) => ({
            title: p.title,
            category: p.category,
            periodLabel: p.periodLabel,
            year: p.year,
            progressLabel: p.progressLabel,
            collectedAmount: p.collectedAmount,
            targetAmount: p.targetAmount,
            description: p.description,
            metrics: p.metrics.map((m) => ({ label: m.label, value: m.value, suffix: m.suffix })),
          })),
      };
    },
  }),
};
