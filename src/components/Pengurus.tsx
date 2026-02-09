import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Users } from 'lucide-react';
import { MANAGEMENT_DATA } from '../data/constants';

export function Pengurus() {
  const [isPaused, setIsPaused] = useState(false);
  const duplicatedMembers = [...MANAGEMENT_DATA, ...MANAGEMENT_DATA];

  // Empty state check
  if (MANAGEMENT_DATA.length === 0) {
    return (
      <section id="tentang" className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-[hsl(var(--primary))]/[0.02] to-transparent overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
              Struktur Organisasi
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
              Pengurus DKM
            </h2>
            <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
              Susunan kepengurusan Dewan Kemakmuran Masjid Jami' Al-Arqom
            </p>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
              <Users className="w-10 h-10 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
              Belum Ada Data Pengurus
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-md mx-auto">
              Data pengurus DKM belum tersedia saat ini.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="tentang" className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-[hsl(var(--primary))]/[0.02] to-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Struktur Organisasi
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
            Pengurus DKM
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Susunan kepengurusan Dewan Kemakmuran Masjid Jami' Al-Arqom
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              isPaused
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/80'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Putar Otomatis' : 'Hentikan'}
          </button>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--muted))]/50 rounded-xl text-sm text-[hsl(var(--muted-foreground))]">
            <Users className="w-4 h-4" />
            <span>{MANAGEMENT_DATA.length} Pengurus</span>
          </div>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            className={`flex gap-6 animate-marquee ${isPaused ? 'marquee-paused' : ''}`}
            style={{ width: 'max-content' }}
          >
            {duplicatedMembers.map((member, index) => (
              <div key={`${member.id}-${index}`} className="flex-shrink-0 w-60 group">
                <div className="relative bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-2xl overflow-hidden hover:border-[hsl(var(--primary))]/20 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/5 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-16 h-16">
                      <div className="absolute top-3 right-3 w-8 h-8">
                        <svg viewBox="0 0 32 32" fill="none">
                          <path
                            d="M16 0L32 16L16 32L0 16Z"
                            fill="hsl(38, 70%, 55%)"
                            fillOpacity="0.15"
                          />
                          <path
                            d="M16 6L26 16L16 26L6 16Z"
                            stroke="hsl(38, 70%, 55%)"
                            strokeWidth="0.5"
                            fillOpacity="0"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))]">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[hsl(var(--gold))]">
                      {member.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
