"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import type { AgendaCategory } from '../data/types';
import { getAgendaStatus, formatAgendaDateRange } from '@/utils/agenda';

const CATEGORY_STYLES: Record<AgendaCategory, string> = {
  kajian: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sholat: 'bg-blue-50 text-blue-700 border-blue-200',
  kegiatan: 'bg-amber-50 text-amber-700 border-amber-200',
  rapat: 'bg-violet-50 text-violet-700 border-violet-200',
};

export function Agenda() {
  const { data } = useSiteData();

  if (!data) return null;

  const agendaData = data.agenda || [];
  if (agendaData.length === 0) return null;

  // Sorting order:
  // 1. Sedang Berlangsung (ongoing events)
  // 2. Akan Datang (upcoming nearest date first)
  // 3. Selesai (recently completed first)
  const sortedAgendas = [...agendaData].sort((a, b) => {
    const statusOrder: Record<string, number> = {
      sedang_berlangsung: 1,
      akan_datang: 2,
      selesai: 3,
    };
    const statusA = getAgendaStatus(a.date, a.endDate).status;
    const statusB = getAgendaStatus(b.date, b.endDate).status;

    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    if (statusA === 'akan_datang') {
      // Ascending (closest date first)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    // Ongoing or completed: newest first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const displayAgendas = sortedAgendas.slice(0, 6);

  return (
    <section id="agenda" className="relative py-24 md:py-32">
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
            Jadwal Kegiatan
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
            Agenda Masjid
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Daftar kegiatan, kajian rutin, dan program syiar Islam di Masjid Jami' Al-Arqam dari yang sedang berlangsung, akan datang, hingga yang telah terlaksana.
          </p>
        </motion.div>

        {/* Agenda Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAgendas.map((item, index) => {
            const statusInfo = getAgendaStatus(item.date, item.endDate);
            const dateRangeText = formatAgendaDateRange(item.date, item.endDate);
            const isOngoing = statusInfo.status === 'sedang_berlangsung';
            const isPast = statusInfo.status === 'selesai';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative border rounded-2xl p-6 transition-all duration-500 flex flex-col ${
                  isOngoing
                    ? 'bg-white border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : isPast
                    ? 'bg-[hsl(var(--card))]/70 border-[hsl(var(--border))]/50 grayscale-[0.35] hover:grayscale-0 hover:shadow-md'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))]/60 hover:border-[hsl(var(--primary))]/20 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/5'
                }`}
              >
                {/* Top Status & Category Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                    {statusInfo.label}
                  </span>

                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                      CATEGORY_STYLES[item.category] || 'bg-gray-50 text-gray-700 border-gray-200'
                    } ${isPast ? 'opacity-60' : ''}`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 mb-4">
                  {/* Date Block */}
                  <div
                    className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[3.5rem] shrink-0 text-center ${
                      isOngoing
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isPast
                        ? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                        : 'bg-[hsl(var(--primary))]/5 text-[hsl(var(--primary))]'
                    }`}
                  >
                    <span className="font-display text-2xl font-bold leading-none">
                      {new Date(item.date).getDate()}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${
                        isOngoing ? 'text-emerald-100' : 'text-[hsl(var(--primary))]/70'
                      }`}
                    >
                      {new Date(item.date).toLocaleDateString('id-ID', { month: 'short' })}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-base leading-snug line-clamp-2 ${
                        isPast
                          ? 'text-[hsl(var(--muted-foreground))]'
                          : 'text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))]'
                      } transition-colors duration-300`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-1 font-medium">
                      <Calendar className="w-3 h-3 text-[hsl(var(--gold))]" />
                      <span>{dateRangeText}</span>
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p
                    className={`text-sm mb-4 leading-relaxed line-clamp-2 flex-1 ${
                      isPast ? 'text-[hsl(var(--muted-foreground))]/70' : 'text-[hsl(var(--muted-foreground))]'
                    }`}
                  >
                    {item.description}
                  </p>
                )}

                <div
                  className={`flex items-center gap-4 text-xs mt-auto pt-3 border-t border-[hsl(var(--border))]/50 ${
                    isPast ? 'text-[hsl(var(--muted-foreground))]/70' : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  {item.time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.time}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[130px]">{item.location}</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--gold))] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors font-medium shadow-lg shadow-[hsl(var(--primary))]/20 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/30"
          >
            Lihat Semua Agenda
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
