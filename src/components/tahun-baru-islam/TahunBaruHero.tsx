"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import Image from 'next/image';

const ORGANIZERS = [
  { src: '/logo.png', alt: 'DKM Al-Arqam', label: 'DKM Al-Arqam' },
  { src: '/risma.png', alt: 'RISMA Al-Arqam', label: 'RISMA Al-Arqam' },
  { src: '/mt transparant.png', alt: 'Majelis Talim Al-Arqam', label: 'Majelis Ta\'lim Al-Arqam' },
];

export function TahunBaruHero() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      <div className="absolute inset-0 hero-gradient" />

      {/* Decorative rotating element */}
      <motion.div
        className="absolute top-16 right-[10%] w-48 h-48 opacity-[0.04]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" fill="none">
          <polygon points="100,10 190,100 100,190 10,100" stroke="hsl(160, 45%, 22%)" strokeWidth="1" />
          <polygon points="100,30 170,100 100,170 30,100" stroke="hsl(38, 70%, 55%)" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" stroke="hsl(38, 70%, 55%)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Organizer logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          {ORGANIZERS.map((org) => (
            <div key={org.label} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/90 shadow-md flex items-center justify-center overflow-hidden p-1.5">
                <Image
                  src={org.src}
                  alt={org.alt}
                  width={56}
                  height={56}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] text-center leading-tight max-w-[64px]">
                {org.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Peringatan Tahun Baru Islam 1448H
          </span>
        </motion.div>

        {/* Alhamdulillah badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 text-sm font-semibold text-[hsl(var(--primary))]">
            ✨ Alhamdulillah, acara telah terlaksana dengan lancar!
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[hsl(var(--foreground))] mt-5 leading-tight"
        >
          Gema{' '}
          <span className="text-[hsl(var(--primary))]">Muharram</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mx-auto mt-6 mb-5 h-[2px] w-32 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="font-display text-lg md:text-xl italic text-[hsl(var(--emerald-light))] font-medium"
        >
          Satukan Langkah, Ekspresikan Bakat, Pererat Ukhuwah
        </motion.p>

        {/* Pesan penutup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-10 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border border-[hsl(var(--border))]/60 rounded-2xl px-6 py-5 shadow-sm text-left"
        >
          <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
            Rangkaian kegiatan <span className="font-semibold text-[hsl(var(--foreground))]">GEMA MUHARRAM 1448H</span> telah selesai dilaksanakan dengan lancar. Lomba-lomba dan Pawai Obor telah berlangsung penuh semangat. Kami mengucapkan terima kasih kepada seluruh peserta, orang tua, panitia, pengurus DKM, para donatur, serta seluruh pihak yang telah mendukung kegiatan ini. 🤲
          </p>
        </motion.div>

        {/* Poster */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => setIsFullscreen(true)}
            className="group relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-[hsl(var(--border))]/60 hover:shadow-3xl transition-all duration-500 max-w-sm w-full"
          >
            <Image
              src="/pamflet new.png"
              alt="Poster Gema Muharram - Peringatan Tahun Baru Islam 1448H"
              width={600}
              height={848}
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
              className="relative max-w-lg w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <Image
                src="/pamflet new.png"
                alt="Poster Gema Muharram - Peringatan Tahun Baru Islam 1448H"
                width={600}
                height={848}
                className="w-full h-auto object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
