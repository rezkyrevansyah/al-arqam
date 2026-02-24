"use client";

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Countdown } from '@/components/Countdown';
import { Agenda } from '@/components/Agenda';
import { Articles } from '@/components/Articles';
import { Gallery } from '@/components/Gallery';
import { Pengurus } from '@/components/Pengurus';
import { Donation } from '@/components/Donation';
import { Footer } from '@/components/Footer';
import { useScrollToHash } from '@/hooks/useScrollToHash';

export default function Home() {
  useScrollToHash();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
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
  );
}
