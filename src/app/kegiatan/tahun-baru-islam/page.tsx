import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/app/providers";
import { getFooterData } from "@/services/site-data.server";
import { getEventProgramBySlug } from "@/services/events.server";
import { TahunBaruHero } from "@/components/tahun-baru-islam/TahunBaruHero";
import { TahunBaruHasil } from "@/components/tahun-baru-islam/TahunBaruHasil";

import type { Metadata } from "next";

const GEMA_MUHARRAM_SLUG = "gema-muharram-1448h";

export const metadata: Metadata = {
  title: "Pengumuman Pemenang - Gema Muharram 1448H",
  description:
    "Hasil dan pengumuman pemenang lomba Gema Muharram 1448H: Mewarnai, Hafalan Surat Pendek, Hafalan Huruf Hijaiyah, Adzan, dan Tilawatil Qur'an di Masjid Al-Arqam RW 024.",
};

export const revalidate = 300;

export default async function KegiatanTahunBaruIslamPage() {
  const [footer, program] = await Promise.all([
    getFooterData(),
    getEventProgramBySlug(GEMA_MUHARRAM_SLUG),
  ]);

  return (
    <Providers initialData={{ footer }}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />
        <main className="pb-20 pt-20">
          <TahunBaruHero />
          {program && (
            <TahunBaruHasil
              title={program.title}
              description={program.description}
              documentationUrl={program.documentationUrl}
              categories={program.categories}
            />
          )}
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
