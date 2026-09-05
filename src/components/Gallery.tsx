"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatImageUrl } from '../lib/utils';
import MorphSlider from './MorphSlider';

export function Gallery() {
  const { data } = useSiteData();

  if (!data) return null;

  const galleryData = data?.gallery || [];
  const landingGallery = galleryData.slice(0, 8);

  const sliderItems = landingGallery.map((item) => ({
    image: formatImageUrl(item.image),
    caption: item.title,
  }));

  if (sliderItems.length === 0) return null;

  return (
    <section id="galeri" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Dokumentasi
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
            Galeri Kegiatan
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Momen-momen berharga dari berbagai kegiatan di Masjid Jami' Al-Arqom
          </p>
        </motion.div>

        {/* Gallery Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[420px] sm:h-[500px] md:h-[560px]"
        >
          <MorphSlider
            items={sliderItems}
            transition="melt"
            intensity={0.55}
            aberration={0.35}
            drift={0.4}
            radius={20}
            overlayColor="#0e1b16"
            autoplay
            loop
          />
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full font-medium hover:opacity-90 transition-all hover:gap-3 group"
          >
            Lihat Semua Galeri
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
