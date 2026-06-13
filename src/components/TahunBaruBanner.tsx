"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export function TahunBaruBanner() {
  return (
    <section className="relative py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <Link
            href="/tahun-baru-islam"
            className="group block bg-[hsl(var(--primary))] rounded-3xl p-8 md:p-10 relative overflow-hidden hover:shadow-2xl hover:shadow-[hsl(var(--primary))]/20 transition-all duration-500"
          >
            <div className="absolute inset-0 islamic-pattern opacity-10" />

            {/* Decorative gold accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--gold))]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--gold-light))]/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-7 h-7 text-[hsl(var(--gold-light))]" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold-light))]">
                    Peringatan Tahun Baru Islam 1448H
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-[hsl(var(--primary-foreground))] mt-1">
                    Gema Muharram — Sabtu, 20 Juni 2026
                  </h3>
                  <p className="text-sm text-[hsl(var(--primary-foreground))]/70 mt-2 max-w-lg">
                    Lomba anak-anak muslim, pawai obor, dan berbagai kegiatan seru untuk seluruh warga RW 024.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--gold))] text-white rounded-2xl font-semibold text-sm group-hover:bg-[hsl(var(--gold))]/90 transition-all duration-300 group-hover:shadow-lg self-start md:self-center flex-shrink-0">
                Lihat Info Acara
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
