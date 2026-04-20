import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Countdown } from '@/components/Countdown';
import { Agenda } from '@/components/Agenda';
import { Articles } from '@/components/Articles';
import { Gallery } from '@/components/Gallery';
import { Pengurus } from '@/components/Pengurus';
import { Donation } from '@/components/Donation';
import { Footer } from '@/components/Footer';
import { HomeClient } from '@/components/HomeClient';
import { Providers } from './providers';
import { getHomeSiteData } from '@/services/site-data.server';

export const revalidate = 60;

export default async function Home() {
  const initialData = await getHomeSiteData();

  return (
    <Providers initialData={initialData}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <HomeClient />
        <Navbar />
        <main>
          <Hero />
          <Countdown />
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
