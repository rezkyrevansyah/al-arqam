import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { GalleryPreview } from '@/components/GalleryPreview';
import { Gallery } from '@/components/Gallery';
import { HomeClient } from '@/components/HomeClient';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import { Providers } from './providers';
import { getHomeSiteData } from '@/services/site-data.server';
import { getTodayPrayerTimes } from '@/services/prayer-times.server';

// Below-the-fold sections — split into their own chunks so the initial
// bundle for `/` doesn't have to parse/execute all of them up front. Kept as
// server-rendered (default `ssr: true`; `ssr: false` isn't allowed for
// `next/dynamic` inside a Server Component) so content/SEO is unaffected.
const InfaqSection = dynamic(() => import('@/components/InfaqSection').then(m => m.InfaqSection));
const Countdown = dynamic(() => import('@/components/Countdown').then(m => m.Countdown));
const PrayerTimesSection = dynamic(() => import('@/components/PrayerTimesSection').then(m => m.PrayerTimesSection));
const Agenda = dynamic(() => import('@/components/Agenda').then(m => m.Agenda));
const Articles = dynamic(() => import('@/components/Articles').then(m => m.Articles));
const Pengurus = dynamic(() => import('@/components/Pengurus').then(m => m.Pengurus));
const Donation = dynamic(() => import('@/components/Donation').then(m => m.Donation));
const Footer = dynamic(() => import('@/components/Footer').then(m => m.Footer));

export const metadata: Metadata = {
  title: "Masjid Jami' Al-Arqam Bekasi Utara - Pusat Ibadah & Dakwah",
  description:
    "Website Resmi Masjid Jami' Al-Arqam Bekasi Utara. Jadwal sholat, agenda kegiatan islami, artikel dakwah, galeri, dan donasi masjid. Bersama memakmurkan masjid.",
  alternates: { canonical: "https://www.alarqambekasiutara.com" },
};

export const revalidate = 60;

export default async function Home() {
  const [initialData, prayerTimes] = await Promise.all([
    getHomeSiteData(),
    getTodayPrayerTimes(),
  ]);

  return (
    <Providers initialData={initialData}>
      <RealtimeRefresher />
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <HomeClient />
        <Navbar />
        <main>
          <Hero />
          <GalleryPreview />
          <InfaqSection />
          <Countdown />
          <PrayerTimesSection prayerTimes={prayerTimes} />
          <Agenda />
          <Articles />
          <Gallery />
          <Pengurus />
          <Donation />
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
