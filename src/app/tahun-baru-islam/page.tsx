import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/app/providers";
import { getFooterData } from "@/services/site-data.server";
import { TahunBaruHero } from "@/components/tahun-baru-islam/TahunBaruHero";
import { TahunBaruLomba } from "@/components/tahun-baru-islam/TahunBaruLomba";
import { TahunBaruJadwal } from "@/components/tahun-baru-islam/TahunBaruJadwal";
import { TahunBaruPawai } from "@/components/tahun-baru-islam/TahunBaruPawai";
import { TahunBaruDaftar } from "@/components/tahun-baru-islam/TahunBaruDaftar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gema Muharram - Peringatan Tahun Baru Islam 1448H",
  description:
    "Lomba Anak-Anak Muslim RW 024 dan Pawai Obor dalam rangka Peringatan Tahun Baru Islam 1448H. Sabtu, 20 Juni 2026 di TPA & Masjid Al-Arqam RW 024.",
};

export const revalidate = 300;

export default async function TahunBaruIslamPage() {
  const footer = await getFooterData();

  return (
    <Providers initialData={{ footer }}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />
        <main className="pb-20 pt-20">
          <TahunBaruHero />
          <TahunBaruLomba />
          <TahunBaruJadwal />
          <TahunBaruPawai />
          <TahunBaruDaftar />
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
