import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/app/providers";
import { getFooterData } from "@/services/site-data.server";
import { QurbanHero } from "@/components/qurban/QurbanHero";
import { QurbanPricing } from "@/components/qurban/QurbanPricing";
import { QurbanContact } from "@/components/qurban/QurbanContact";
import { QurbanCTA } from "@/components/qurban/QurbanCTA";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qurban Idul Adha 1447H - Masjid Jami' Al-Arqom",
  description:
    "Informasi pendaftaran Qurban Idul Adha 1447H di Masjid Jami' Al-Arqom Bekasi Utara. Paket patungan sapi, kambing, dan domba.",
};

export const revalidate = 300;

export default async function QurbanPage() {
  const footer = await getFooterData();

  return (
    <Providers initialData={{ footer }}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />
        <main className="pb-20 pt-20">
          <QurbanHero />
          <QurbanPricing />
          <QurbanContact />
          <QurbanCTA />
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
