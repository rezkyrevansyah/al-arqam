"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatImageUrl } from '../lib/utils';
import { useLazyInView } from '../hooks/useLazyInView';

const AccordionGallery = dynamic(() => import('./AccordionGallery'), {
  ssr: false,
  loading: () => <div className="h-[440px] w-full rounded-[20px] bg-[hsl(var(--muted))] animate-pulse" />,
});

export function GalleryPreview() {
  const { data } = useSiteData();
  const { ref, hasBeenInView } = useLazyInView();
  const gallery = data.gallery?.slice(0, 8) ?? [];

  // Keyed on content, not array reference — an unrelated parent re-render
  // (e.g. periodic data refresh) shouldn't hand AccordionGallery a "new"
  // items array with the same underlying photos.
  const galleryKey = gallery.map(item => `${item.id}:${item.image}:${item.title}`).join('|');
  const items = useMemo(
    () => gallery.map(item => ({
      image: formatImageUrl(item.image),
      label: item.title,
      alt: item.title
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [galleryKey]
  );

  if (gallery.length === 0) return null;

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
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {hasBeenInView && (
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
          )}
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
