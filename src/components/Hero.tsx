import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 islamic-pattern" />
      <div className="absolute inset-0 hero-gradient" />

      {/* Decorative geometric elements */}
      <motion.div
        className="absolute top-20 right-[15%] w-64 h-64 opacity-[0.04]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" fill="none">
          <polygon points="100,10 190,100 100,190 10,100" stroke="hsl(160, 45%, 22%)" strokeWidth="1" />
          <polygon points="100,30 170,100 100,170 30,100" stroke="hsl(38, 70%, 55%)" strokeWidth="1" />
          <polygon points="100,50 150,100 100,150 50,100" stroke="hsl(160, 45%, 22%)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" stroke="hsl(38, 70%, 55%)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-[10%] w-48 h-48 opacity-[0.04]"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M100 0 L200 100 L100 200 L0 100Z" stroke="hsl(38, 70%, 55%)" strokeWidth="1" />
          <path d="M50 50 L150 50 L150 150 L50 150Z" stroke="hsl(160, 45%, 22%)" strokeWidth="1" />
          <circle cx="100" cy="100" r="50" stroke="hsl(38, 70%, 55%)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-arabic text-2xl md:text-3xl text-[hsl(var(--muted-foreground))]/70 mb-8"
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-[1.1]">
            {"Masjid Jami' Al-Arqom".split("'").map((part, index) => (
              <span key={index}>
                {index > 0 && <span className="text-[hsl(var(--gold))]">'</span>}
                {part}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mx-auto mt-8 mb-6 h-[2px] w-32 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="font-display text-xl md:text-2xl italic text-[hsl(var(--emerald-light))] font-medium"
        >
          Memakmurkan Masjid, Membangun Umat
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-6 text-base md:text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto leading-relaxed"
        >
          Pusat kegiatan ibadah dan dakwah di Bekasi Utara. Bersama kita tingkatkan kualitas iman dan ketaqwaan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollToSection('agenda')}
            className="px-8 py-3.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-2xl font-semibold text-sm hover:bg-[hsl(var(--primary))]/90 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/15 active:scale-95"
          >
            Lihat Agenda Kegiatan
          </button>
          <button
            onClick={() => scrollToSection('donasi')}
            className="px-8 py-3.5 border-2 border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-2xl font-semibold text-sm hover:bg-[hsl(var(--gold))]/10 transition-all duration-300 active:scale-95"
          >
            Salurkan Donasi
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-[hsl(var(--muted-foreground))]/50"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
