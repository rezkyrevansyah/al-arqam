"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatImageUrl } from '../lib/utils';
import AccordionGallery from './AccordionGallery';

export function GalleryPreview() {
  const { data } = useSiteData();
  const gallery = data.gallery?.slice(0, 8) ?? [];

  if (gallery.length === 0) return null;

  const items = gallery.map(item => ({
    image: formatImageUrl(item.image),
    label: item.title,
    alt: item.title
  }));

  return (
    <section className="py-20 bg-[hsl(var(--background))] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 mb-4">
            <Images className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
            <span className="text-xs font-semibold text-[hsl(var(--gold))] uppercase tracking-widest">Galeri Kegiatan</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-3">
            Cek Galeri Terbaru Kami
          </h2>
          <div className="mx-auto h-[2px] w-20 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
          <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
            Momen-momen bermakna dari kegiatan masjid kami — dari kajian, sholat berjamaah, hingga kegiatan sosial.
          </p>
        </motion.div>

        {/* Accordion gallery */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <AccordionGallery
            items={items}
            defaultIndex={Math.floor(items.length / 2)}
            accentColor="hsl(38, 70%, 55%)"
            overlayColor="hsl(160, 30%, 8%)"
            textColor="#ffffff"
            height={440}
            gap={10}
            radius={20}
            expandRatio={0.5}
            trigger="hover"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <Link
            href="/galeri"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-2xl font-semibold text-sm hover:bg-[hsl(var(--primary))]/90 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/20 active:scale-95"
          >
            Lihat Semua Foto
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
