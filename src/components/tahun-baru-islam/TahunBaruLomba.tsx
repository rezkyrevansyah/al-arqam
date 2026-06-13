"use client";

import { motion } from 'framer-motion';
import { Trophy, MapPin } from 'lucide-react';

const LOMBA_LIST = [
  {
    nomor: 1,
    nama: 'Mewarnai Huruf Hijaiyah',
    usia: 'Usia 4 – 5 Tahun',
    tempat: 'TPA Al-Arqam',
    icon: '🎨',
    ketentuan: [
      'Gambar huruf hijaiyah disediakan panitia',
      'Peserta membawa alat tulis & pensil warna sendiri',
      'Dilaksanakan satu gelombang',
    ],
  },
  {
    nomor: 2,
    nama: 'Mengucapkan / Menghapal Huruf Hijaiyah',
    usia: 'Usia 6 – 7 Tahun',
    tempat: 'TPA Al-Arqam',
    icon: '🗣️',
    ketentuan: [
      'Mengucapkan seluruh huruf hijaiyah',
      'Dilaksanakan satu gelombang',
    ],
  },
  {
    nomor: 3,
    nama: 'Menghafal Surat-Surat Pendek',
    usia: 'Usia 8 – 9 Tahun',
    tempat: 'Masjid Al-Arqam',
    icon: '📖',
    ketentuan: [
      'Panitia menyiapkan gulungan berisi 10 nama surat pendek',
      'Peserta memilih gulungan secara acak',
      'Membaca surat sesuai gulungan yang dipilih',
      'Dilaksanakan satu gelombang',
    ],
  },
  {
    nomor: 4,
    nama: 'Tilawatil Qur\'an',
    usia: 'Usia 10 – 12 Tahun',
    tempat: 'Masjid Al-Arqam',
    icon: '📜',
    ketentuan: [
      'Membaca Surat An-Nisa ayat 36',
      'Dinilai dari tajwid, fasohah, dan suara',
      'Dilaksanakan satu gelombang',
    ],
  },
  {
    nomor: 5,
    nama: 'Lomba Adzan',
    usia: 'Usia 10 Tahun ke Atas',
    tempat: 'Masjid Al-Arqam',
    icon: '🕌',
    ketentuan: [
      'Suara merdu & lafaz adzan yang benar',
      'Dilaksanakan satu gelombang',
    ],
  },
];

export function TahunBaruLomba() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Lomba Anak-Anak Muslim RW 024
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mt-4">
            Kategori Perlombaan
          </h2>
          <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Ayo tunjukkan kemampuanmu! Setiap lomba memperebutkan <strong>5 hadiah</strong> — Juara 1, 2, 3, Harapan 1 & Harapan 2.
          </p>
        </motion.div>

        {/* Lomba cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LOMBA_LIST.map((lomba, index) => (
            <motion.div
              key={lomba.nomor}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-2xl border border-[hsl(var(--border))]/60 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Card header */}
              <div className="bg-[hsl(var(--primary))]/5 border-b border-[hsl(var(--border))]/40 px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {lomba.nomor}
                      </span>
                      <span className="text-xs font-semibold text-[hsl(var(--gold))] uppercase tracking-wide">
                        {lomba.usia}
                      </span>
                    </div>
                    <h3 className="font-display text-base md:text-lg font-bold text-[hsl(var(--foreground))] leading-tight">
                      {lomba.nama}
                    </h3>
                  </div>
                  <span className="text-2xl flex-shrink-0">{lomba.icon}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-3">
                  <MapPin className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{lomba.tempat}</span>
                </div>
              </div>

              {/* Ketentuan */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-3">
                  Ketentuan
                </p>
                <ul className="space-y-2">
                  {lomba.ketentuan.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--foreground))]/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold))] flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer badge */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-1.5 bg-[hsl(var(--gold))]/10 rounded-xl px-3 py-2">
                  <Trophy className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                  <span className="text-xs font-semibold text-[hsl(var(--gold))]">5 Hadiah Menarik</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
