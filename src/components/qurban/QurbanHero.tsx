"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { QURBAN_YEAR } from '@/data/qurban';

export function QurbanHero() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
              Qurban Idul Adha {QURBAN_YEAR}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--foreground))] mt-4">
              Qurban Berkah
            </h1>
            <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto text-base md:text-lg">
              Panitia Qurban Masjid Al-Arqam Bekasi Utara {QURBAN_YEAR} Menerima & Menyalurkan Hewan Qurban
            </p>
          </motion.div>

          {/* Pamflet Image */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <button
              onClick={() => setIsFullscreen(true)}
              className="group relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-[hsl(var(--border))]/60 hover:shadow-3xl transition-all duration-500 max-w-2xl w-full"
            >
              <Image
                src="/pamflet-idul-adha.png"
                alt="Pamflet Qurban Berkah Masjid Al-Arqam"
                width={800}
                height={1100}
                className="w-full h-auto object-contain"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                  <Maximize2 className="w-4 h-4 text-[hsl(var(--foreground))]" />
                  <span className="text-sm font-medium text-[hsl(var(--foreground))]">Perbesar</span>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-w-3xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <Image
                src="/pamflet-idul-adha.png"
                alt="Pamflet Qurban Berkah Masjid Al-Arqam"
                width={800}
                height={1100}
                className="w-full h-auto object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
