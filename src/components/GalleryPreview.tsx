"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatImageUrl } from '../lib/utils';

export function GalleryPreview() {
  const { data } = useSiteData();
  const gallery = data.gallery?.slice(0, 8) ?? [];
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    if (gallery.length <= 1 || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [gallery.length, isPaused, next]);

  if (gallery.length === 0) return null;

  const activeItem = gallery[current];

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

        {/* Slideshow container */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          {/* Main photo box */}
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-[hsl(var(--primary))]/10 aspect-[16/9] md:aspect-[21/9] cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={formatImageUrl(activeItem.image)}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`caption-${current}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-white font-semibold text-sm md:text-base truncate">{activeItem.title}</p>
                  {activeItem.date && (
                    <p className="text-white/60 text-xs mt-0.5">
                      {new Date(activeItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail strip — left edge */}
            <div className="absolute top-1/2 -translate-y-1/2 left-3 hidden md:flex flex-col gap-2">
              {gallery.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setCurrent(i)}
                  className={`block w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    i === current
                      ? 'border-[hsl(var(--gold))] scale-110 shadow-lg shadow-[hsl(var(--gold))]/30'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={formatImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Dot indicators — mobile */}
          <div className="flex items-center justify-center gap-2 mt-5 md:hidden">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-5 h-2 bg-[hsl(var(--gold))]'
                    : 'w-2 h-2 bg-[hsl(var(--muted-foreground))]/30'
                }`}
              />
            ))}
          </div>

          {/* Progress bar */}
          {!isPaused && (
            <div className="mt-4 h-[2px] w-full rounded-full bg-[hsl(var(--muted-foreground))]/10 overflow-hidden">
              <motion.div
                key={`progress-${current}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--gold))]"
              />
            </div>
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
