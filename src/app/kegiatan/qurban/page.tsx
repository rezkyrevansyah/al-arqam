import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/app/providers";
import { getFooterData } from "@/services/site-data.server";
import { getQurbanConfig } from "@/services/events.server";
import { QurbanHero } from "@/components/qurban/QurbanHero";
import { QurbanPricing } from "@/components/qurban/QurbanPricing";
import { QurbanContact } from "@/components/qurban/QurbanContact";
import { QurbanCTA } from "@/components/qurban/QurbanCTA";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qurban Idul Adha 1447H",
  description:
    "Informasi pendaftaran Qurban Idul Adha 1447H di Masjid Jami' Al-Arqam Bekasi Utara. Paket patungan sapi, kambing, dan domba.",
};

export const revalidate = 300;

export default async function KegiatanQurbanPage() {
  const [footer, qurban] = await Promise.all([getFooterData(), getQurbanConfig()]);

  return (
    <Providers initialData={{ footer }}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />
        <main className="pb-20 pt-20">
          <QurbanHero yearLabel={qurban.yearLabel} />
          <QurbanPricing pricingTiers={qurban.pricingTiers} />
          <QurbanContact
            contacts={qurban.contacts}
            bankName={qurban.bankName}
            bankAccountNumber={qurban.bankAccountNumber}
            bankAccountName={qurban.bankAccountName}
          />
          <QurbanCTA contacts={qurban.contacts} />
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
