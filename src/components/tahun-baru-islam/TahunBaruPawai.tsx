"use client";

import { motion } from 'framer-motion';
import { Flame, MapPin, Users } from 'lucide-react';

const KETENTUAN_PAWAI = [
  'Peserta akan ditandai dengan stiker atau pita sebelum berangkat',
  'Start dari Lapangan RW 024 ba\'da Isya',
  'Rute mengelilingi kawasan RW 024',
  'Finish kembali di Lapangan RW 024',
  'Dilanjut pembagian snack, pengumuman pemenang lomba, dan penutupan',
];

export function TahunBaruPawai() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Malam Hari
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mt-4">
            Pawai Obor
          </h2>
          <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Rayakan Tahun Baru Islam bersama keluarga dengan pawai obor mengelilingi RW 024!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="bg-[hsl(var(--primary))] rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 islamic-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--gold))]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--gold-light))]/20 flex items-center justify-center mb-5">
                <Flame className="w-7 h-7 text-[hsl(var(--gold-light))]" />
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--gold-light))] mb-1">
                    Waktu Mulai
                  </p>
                  <p className="text-xl font-bold text-white">Ba'da Isya</p>
                  <p className="text-sm text-white/60">Sabtu, 20 Juni 2026</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--gold-light))] mb-1">
                    Titik Kumpul
                  </p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-white/70 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-white/90">Lapangan RW 024</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--gold-light))] mb-1">
                    Peserta
                  </p>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-white/70 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-white/90">Anak-anak dan seluruh keluarga</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ketentuan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl border border-[hsl(var(--border))]/60 shadow-sm p-8"
          >
            <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))] mb-5">
              Informasi Pawai
            </h3>
            <ul className="space-y-4">
              {KETENTUAN_PAWAI.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold))] block" />
                  </div>
                  <p className="text-sm text-[hsl(var(--foreground))]/80 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 bg-[hsl(var(--gold))]/10 rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold text-[hsl(var(--gold))] uppercase tracking-wide mb-1">
                Setelah Pawai
              </p>
              <p className="text-sm text-[hsl(var(--foreground))]/80">
                Pembagian snack + pengumuman pemenang lomba + penutupan acara
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
