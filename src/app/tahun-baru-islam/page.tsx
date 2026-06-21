import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/app/providers";
import { getFooterData } from "@/services/site-data.server";
import { TahunBaruHero } from "@/components/tahun-baru-islam/TahunBaruHero";
import { TahunBaruHasil } from "@/components/tahun-baru-islam/TahunBaruHasil";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengumuman Pemenang - Gema Muharram 1448H",
  description:
    "Hasil dan pengumuman pemenang lomba Gema Muharram 1448H: Mewarnai, Hafalan Surat Pendek, Hafalan Huruf Hijaiyah, Adzan, dan Tilawatil Qur'an di Masjid Al-Arqam RW 024.",
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
          <TahunBaruHasil />
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
