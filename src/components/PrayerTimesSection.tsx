"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, MoonStar, Sparkles } from 'lucide-react';

import type { PrayerTimesData } from '@/services/prayer-times.server';

interface PrayerSlot {
  key: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  label: string;
  time: string;
}

function getMinutesFromTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function useJakartaClock() {
  const [currentMinutes, setCurrentMinutes] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(new Date());
      const hours = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
      const minutes = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
      setCurrentMinutes(hours * 60 + minutes);
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return currentMinutes;
}

export function PrayerTimesSection({ prayerTimes }: { prayerTimes: PrayerTimesData | null }) {
  const currentMinutes = useJakartaClock();

  if (!prayerTimes) {
    return (
      <section className="relative pb-16 md:pb-20 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))]/70 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/8 border border-[hsl(var(--primary))]/15 rounded-full mb-5">
              <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-sm font-medium text-[hsl(var(--primary))]">
                Jadwal Sholat Hari Ini
              </span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--foreground))]">
              Jadwal sedang dimuat
            </h3>

            <p className="mt-3 text-sm md:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
              Koneksi ke API MyQuran belum tersedia saat ini. Section ini tetap aman ditampilkan, dan jadwal akan kembali otomatis saat API merespons normal.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const prayerSlots: PrayerSlot[] = [
    { key: 'subuh', label: 'Subuh', time: prayerTimes.schedules.subuh },
    { key: 'dzuhur', label: 'Dzuhur', time: prayerTimes.schedules.dzuhur },
    { key: 'ashar', label: 'Ashar', time: prayerTimes.schedules.ashar },
    { key: 'maghrib', label: 'Maghrib', time: prayerTimes.schedules.maghrib },
    { key: 'isya', label: 'Isya', time: prayerTimes.schedules.isya },
  ];

  const nextPrayerIndex = prayerSlots.findIndex((slot) => getMinutesFromTime(slot.time) > currentMinutes);
  const currentPrayerIndex =
    nextPrayerIndex === -1
      ? prayerSlots.length - 1
      : Math.max(0, nextPrayerIndex - 1);
  const upcomingPrayer = nextPrayerIndex === -1 ? prayerSlots[0] : prayerSlots[nextPrayerIndex];
  const currentPrayer = prayerSlots[currentPrayerIndex];

  return (
    <section className="relative pb-16 md:pb-20 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative bg-[hsl(var(--card))] border border-[hsl(var(--border))]/70 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--gold))/0.12,transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--primary))/0.1,transparent_45%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))]/8 border border-[hsl(var(--primary))]/15 rounded-full mb-5">
              <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-sm font-medium text-[hsl(var(--primary))]">
                Jadwal Sholat Hari Ini
              </span>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <h3 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] leading-tight">
                  {prayerTimes.locationLabel}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {prayerTimes.areaLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MoonStar className="w-4 h-4" />
                    {prayerTimes.hijriDate}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-4 shadow-lg shadow-[hsl(var(--primary))]/15 w-full sm:w-auto sm:min-w-[220px]">
                <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--gold-light))]">
                  Waktu Berikutnya
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold">{upcomingPrayer.label}</p>
                    <p className="text-sm text-[hsl(var(--primary-foreground))]/75">
                      Patokan wilayah {prayerTimes.sourceLocation}
                    </p>
                  </div>
                  <p className="font-display text-4xl font-bold text-[hsl(var(--gold-light))]">
                    {upcomingPrayer.time}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {prayerSlots.map((slot) => {
                const isCurrent = slot.key === currentPrayer.key;
                const isUpcoming = slot.key === upcomingPrayer.key;

                return (
                  <div
                    key={slot.key}
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      isUpcoming
                        ? 'border-[hsl(var(--gold))]/50 bg-[hsl(var(--gold))]/10 shadow-lg shadow-[hsl(var(--gold))]/10'
                        : isCurrent
                          ? 'border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/6'
                          : 'border-[hsl(var(--border))]/70 bg-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                        {slot.label}
                      </span>
                      {isUpcoming && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--gold))]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--gold))]">
                          <Sparkles className="w-3 h-3" />
                          Next
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-display text-3xl font-bold text-[hsl(var(--foreground))]">
                      {slot.time}
                    </p>
                    <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                      {isCurrent ? 'Sedang berjalan' : isUpcoming ? 'Segera tiba' : 'Hari ini'}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
              <span>Imsak {prayerTimes.schedules.imsak}</span>
              <span>Terbit {prayerTimes.schedules.terbit}</span>
              <span>Dhuha {prayerTimes.schedules.dhuha}</span>
            </div>

            <div className="mt-4 rounded-2xl border border-[hsl(var(--border))]/70 bg-white/70 px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">
              {prayerTimes.gregorianDate} • Sumber API MyQuran ({prayerTimes.sourceLocation}, {prayerTimes.sourceRegion})
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
