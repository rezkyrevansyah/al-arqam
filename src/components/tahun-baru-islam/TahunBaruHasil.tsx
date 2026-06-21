"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw, X } from 'lucide-react';
import Image from 'next/image';

const DOKUMENTASI_URL = 'https://drive.google.com/drive/folders/1M09Dx97TFqut_13GC7gWSU3s0J7aIGke?usp=sharing';

type Pemenang = { rank: string; nama: string; badge: string };

type Kategori = {
  id: string;
  emoji: string;
  nama: string;
  foto: string;
  fotoAlt: string;
  pemenang: Pemenang[];
  harapan: Pemenang[];
};

const KATEGORI: Kategori[] = [
  {
    id: 'mewarnai',
    emoji: '🎨',
    nama: 'Lomba Mewarnai',
    foto: '/juara_mewarnai.JPG',
    fotoAlt: 'Foto pemenang Lomba Mewarnai Gema Muharram 1448H',
    pemenang: [
      { rank: 'Juara 1', nama: 'Della', badge: '🥇' },
      { rank: 'Juara 2', nama: 'Dilla', badge: '🥈' },
      { rank: 'Juara 3', nama: 'Ceisya Zia Amalisa', badge: '🥉' },
    ],
    harapan: [
      { rank: 'Harapan 1', nama: 'Aretha Zayba Almira', badge: '🌟' },
      { rank: 'Harapan 2', nama: 'Anfilda Arunika T', badge: '🌟' },
    ],
  },
  {
    id: 'suratpendek',
    emoji: '📖',
    nama: 'Hafalan Surat Pendek',
    foto: '/juara_suratpendek.JPG',
    fotoAlt: 'Foto pemenang Lomba Hafalan Surat Pendek Gema Muharram 1448H',
    pemenang: [
      { rank: 'Juara 1', nama: 'M. Fakhri Al Khalifi', badge: '🥇' },
      { rank: 'Juara 2', nama: 'M. Khaizuran A.', badge: '🥈' },
      { rank: 'Juara 3', nama: 'Syafiq Aziziya Miftahulaq', badge: '🥉' },
    ],
    harapan: [
      { rank: 'Harapan 1', nama: 'Adzkiya Zhafirah R', badge: '🌟' },
      { rank: 'Harapan 2', nama: 'Muazzam Khairi R. L', badge: '🌟' },
    ],
  },
  {
    id: 'hurufhijaiyah',
    emoji: '🔤',
    nama: 'Hafalan Huruf Hijaiyah',
    foto: '/juara_hurufhijaiyah.JPG',
    fotoAlt: 'Foto pemenang Lomba Hafalan Huruf Hijaiyah Gema Muharram 1448H',
    pemenang: [
      { rank: 'Juara 1', nama: 'Oceana Malika Azzahra', badge: '🥇' },
      { rank: 'Juara 2', nama: 'Alima Hafizha Ahmad', badge: '🥈' },
      { rank: 'Juara 3', nama: 'Mikhayla Noura Medina', badge: '🥉' },
    ],
    harapan: [
      { rank: 'Harapan 1', nama: 'Azhar Baihaqi Agustian', badge: '🌟' },
      { rank: 'Harapan 2', nama: 'Sinar', badge: '🌟' },
    ],
  },
  {
    id: 'adzan',
    emoji: '📢',
    nama: 'Lomba Adzan',
    foto: '/juara_adzan.JPG',
    fotoAlt: 'Foto pemenang Lomba Adzan Gema Muharram 1448H',
    pemenang: [
      { rank: 'Juara 1', nama: 'M. Fakhri Al Khalifi', badge: '🥇' },
      { rank: 'Juara 2', nama: 'M. Bahrul Ilmi', badge: '🥈' },
      { rank: 'Juara 3', nama: 'M. Khaizuran A.', badge: '🥉' },
    ],
    harapan: [
      { rank: 'Harapan 1', nama: 'Ihlan', badge: '🌟' },
      { rank: 'Harapan 2', nama: 'Reynand Sarwopradipta', badge: '🌟' },
    ],
  },
  {
    id: 'tilawatil',
    emoji: '📚',
    nama: 'Tilawatil Qur\'an',
    foto: '/juara_tilawatil.JPG',
    fotoAlt: 'Foto pemenang Lomba Tilawatil Qur\'an Gema Muharram 1448H',
    pemenang: [
      { rank: 'Juara 1', nama: 'Hania Syakira I.', badge: '🥇' },
      { rank: 'Juara 2', nama: 'Rania Mikayla Putri', badge: '🥈' },
      { rank: 'Juara 3', nama: 'M. Bahrul Ilmi', badge: '🥉' },
    ],
    harapan: [
      { rank: 'Harapan 1', nama: 'Fakhri Ziya Ulhaq', badge: '🌟' },
      { rank: 'Harapan 2', nama: 'M. Khaizuran A.', badge: '🌟' },
    ],
  },
];

function KategoriCard({ kategori, index }: { kategori: Kategori; index: number }) {
  const [fotoOpen, setFotoOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white rounded-3xl shadow-sm border border-[hsl(var(--border))]/60 overflow-hidden"
      >
        {/* Foto */}
        <button
          onClick={() => setFotoOpen(true)}
          className="group relative w-full block overflow-hidden"
        >
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={kategori.foto}
              alt={kategori.fotoAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                Perbesar Foto
              </span>
            </div>
          </div>
        </button>

        {/* Konten */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{kategori.emoji}</span>
            <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))]">
              {kategori.nama}
            </h3>
          </div>

          <div className="space-y-2 mb-4">
            {kategori.pemenang.map((p) => (
              <div
                key={p.rank}
                className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[hsl(var(--background))] border border-[hsl(var(--border))]/40"
              >
                <span className="text-xl flex-shrink-0">{p.badge}</span>
                <div>
                  <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide leading-none mb-0.5">
                    {p.rank}
                  </p>
                  <p className="text-sm font-bold text-[hsl(var(--foreground))]">{p.nama}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[hsl(var(--border))]/40 pt-4 space-y-2">
            {kategori.harapan.map((h) => (
              <div key={h.rank} className="flex items-center gap-3 py-1.5 px-3 rounded-xl">
                <span className="text-lg flex-shrink-0">{h.badge}</span>
                <div>
                  <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide leading-none mb-0.5">
                    {h.rank}
                  </p>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{h.nama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen foto modal */}
      <AnimatePresence>
        {fotoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setFotoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setFotoOpen(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="relative w-full rounded-2xl overflow-hidden">
                <Image
                  src={kategori.foto}
                  alt={kategori.fotoAlt}
                  width={1200}
                  height={900}
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
              <p className="text-center text-white/70 text-sm mt-3 font-medium">{kategori.nama}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function TahunBaruHasil() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Alhamdulillah
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mt-3 mb-4">
            🏆 Hasil Lomba Gema Muharram 1448H
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto leading-relaxed">
            Selamat kepada seluruh pemenang! Terima kasih atas semangat dan partisipasi semua peserta, orang tua, serta panitia yang telah menyukseskan acara ini.
          </p>
        </motion.div>

        {/* Tombol Dokumentasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-5"
        >
          <a
            href={DOKUMENTASI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-[hsl(var(--gold))] hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg shadow-[hsl(var(--gold))]/30 hover:shadow-xl hover:shadow-[hsl(var(--gold))]/40"
          >
            <span className="text-xl">📸</span>
            <span className="font-bold text-base text-[hsl(var(--foreground))]">
              Lihat Semua Dokumentasi
            </span>
            <ExternalLink className="w-5 h-5 text-[hsl(var(--foreground))] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>
        </motion.div>

        {/* Notes diperbarui */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-start gap-3 bg-[hsl(var(--primary))]/8 border border-[hsl(var(--primary))]/20 rounded-2xl px-5 py-4 mb-12 max-w-xl mx-auto"
        >
          <RefreshCw className="w-4 h-4 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
            <span className="font-semibold text-[hsl(var(--foreground))]">Masih diperbarui.</span>{' '}
            Foto dan dokumentasi akan terus ditambahkan secara berkala. Silakan cek kembali folder dokumentasi pada waktu mendatang.
          </p>
        </motion.div>

        {/* Grid kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {KATEGORI.map((kategori, index) => (
            <KategoriCard key={kategori.id} kategori={kategori} index={index} />
          ))}
        </div>

        {/* Penutup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 text-center bg-[hsl(var(--primary))] rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 islamic-pattern opacity-10" />
          <div className="relative z-10">
            <p className="text-2xl mb-4">🤲</p>
            <p className="font-display text-lg md:text-xl font-semibold text-[hsl(var(--primary-foreground))] mb-3 leading-relaxed">
              Semoga Allah SWT menerima amal ibadah kita dan mempertemukan kita kembali pada kegiatan-kegiatan kebaikan berikutnya.
            </p>
            <p className="text-[hsl(var(--primary-foreground))]/70 font-medium">Aamiin Yaa Rabbal &apos;Alamiin.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
