"use client";

import { motion } from 'framer-motion';

const RUNDOWN = [
  { waktu: '07.30 – 08.00', kegiatan: 'Kumpul Peserta', keterangan: 'Registrasi dan persiapan' },
  { waktu: '08.00 – 09.30', kegiatan: 'Pembukaan Acara', keterangan: 'Sambutan dan doa bersama' },
  { waktu: '09.30 – Selesai', kegiatan: 'Mulai Semua Lomba', keterangan: 'Semua lomba berjalan bersamaan' },
  { waktu: 'Ba\'da Isya', kegiatan: 'Pawai Obor', keterangan: 'Mengelilingi RW 024 + pengumuman pemenang' },
];

const ALUR_LOKASI = [
  {
    lokasi: 'TPA Al-Arqam',
    warna: 'bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/30',
    labelWarna: 'text-[hsl(var(--gold))]',
    dotWarna: 'bg-[hsl(var(--gold))]',
    lomba: [
      { nama: 'Mewarnai Huruf Hijaiyah', usia: 'Usia 4–5 Tahun', mulai: 'Pukul 09.30' },
      { nama: 'Menghapal Huruf Hijaiyah', usia: 'Usia 6–7 Tahun', mulai: 'Pukul 09.30' },
    ],
    keterangan: 'Kedua lomba dimulai bersamaan',
  },
  {
    lokasi: 'Masjid Al-Arqam',
    warna: 'bg-[hsl(var(--primary))]/5 border-[hsl(var(--primary))]/20',
    labelWarna: 'text-[hsl(var(--primary))]',
    dotWarna: 'bg-[hsl(var(--primary))]',
    lomba: [
      { nama: 'Menghafal Surat Pendek', usia: 'Usia 8–9 Tahun', mulai: 'Mulai pukul 09.30' },
      { nama: 'Tilawatil Qur\'an', usia: 'Usia 10–12 Tahun', mulai: 'Setelah surat pendek selesai' },
      { nama: 'Lomba Adzan', usia: 'Usia 10 Tahun ke Atas', mulai: 'Setelah tilawatil selesai' },
    ],
    keterangan: 'Lomba dilaksanakan berurutan',
  },
];

export function TahunBaruJadwal() {
  return (
    <section className="relative py-16 md:py-20 bg-[hsl(var(--secondary))]/40">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Rundown Acara
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mt-4">
            Jadwal Kegiatan
          </h2>
          <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Sabtu, 20 Juni 2026 — TPA & Masjid Al-Arqam RW 024
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Timeline rundown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))] mb-6">
              Timeline Hari H
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[hsl(var(--gold))] via-[hsl(var(--primary))]/40 to-transparent" />

              <div className="space-y-6">
                {RUNDOWN.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className="flex gap-4 pl-6 relative"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[hsl(var(--gold))] border-2 border-white shadow-sm flex-shrink-0" />

                    <div className="flex-1">
                      <span className="text-xs font-bold text-[hsl(var(--gold))] uppercase tracking-wide">
                        {item.waktu}
                      </span>
                      <p className="font-semibold text-[hsl(var(--foreground))] text-sm mt-0.5">
                        {item.kegiatan}
                      </p>
                      {item.keterangan && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                          {item.keterangan}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Alur per lokasi */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))] mb-6">
              Alur Perlombaan per Lokasi
            </h3>
            <div className="space-y-5">
              {ALUR_LOKASI.map((loc, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-5 ${loc.warna}`}
                >
                  <h4 className={`font-display text-base font-bold mb-3 ${loc.labelWarna}`}>
                    {loc.lokasi}
                  </h4>
                  <div className="space-y-3 mb-3">
                    {loc.lomba.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${loc.dotWarna} flex-shrink-0 mt-1.5`} />
                        <div>
                          <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{item.nama}</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.usia} · {item.mulai}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] italic border-t border-current/10 pt-3">
                    {loc.keterangan}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
