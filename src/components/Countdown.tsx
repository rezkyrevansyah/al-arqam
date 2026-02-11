import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = new Date(targetDate).getTime() - Date.now();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/10 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/[0.02] to-transparent" />
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] relative z-10"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const { data } = useSiteData();

  const countdownDate = data?.countdown?.date || '2026-02-26T00:00:00';
  const countdownName = data?.countdown?.name || "Isra Mi'raj Nabi Muhammad SAW";
  const countdownDescription = data?.countdown?.description || 'Memperingati perjalanan agung Rasulullah SAW dari Masjidil Haram ke Masjidil Aqsa dan naik ke Sidratul Muntaha';
  const countdownActive = data?.countdown?.active !== false; // Default to true

  const timeLeft = useCountdown(countdownDate);

  if (!countdownActive) return null;

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(var(--primary))]/[0.02] to-[hsl(var(--background))]" />
      
      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-[hsl(var(--gold))]" />
            <span className="text-sm font-medium text-[hsl(var(--gold))]">
              Hari Besar Mendatang
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-3">
            {countdownName}
          </h2>

          <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            {countdownDescription}
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-6">
            <CountdownUnit value={timeLeft.days} label="Hari" />
            <div className="flex flex-col gap-2 text-[hsl(var(--primary))]/30 font-display text-lg sm:text-xl md:text-2xl mt-[-1.5rem]">
              <span>:</span>
            </div>
            <CountdownUnit value={timeLeft.hours} label="Jam" />
            <div className="flex flex-col gap-2 text-[hsl(var(--primary))]/30 font-display text-lg sm:text-xl md:text-2xl mt-[-1.5rem]">
              <span>:</span>
            </div>
            <CountdownUnit value={timeLeft.minutes} label="Menit" />
            <div className="flex flex-col gap-2 text-[hsl(var(--primary))]/30 font-display text-lg sm:text-xl md:text-2xl mt-[-1.5rem]">
              <span>:</span>
            </div>
            <CountdownUnit value={timeLeft.seconds} label="Detik" />
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(countdownDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
