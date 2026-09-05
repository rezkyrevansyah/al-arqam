"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Moon, 
  Users, 
  MessageSquare, 
  Home, 
  ChevronDown, 
  CheckCircle2, 
  Radio,
  ChevronUp,
  CalendarDays
} from 'lucide-react';
import { useSiteData } from '@/contexts/SiteDataContext';
import type { AgendaCategory } from '@/data/types';
import { getAgendaStatus, formatAgendaDateRange } from '@/utils/agenda';

const CATEGORY_OPTIONS = [
  { key: 'all', label: 'Semua Kategori', icon: Calendar },
  { key: 'kajian', label: 'Kajian', icon: BookOpen },
  { key: 'sholat', label: 'Sholat', icon: Moon },
  { key: 'kegiatan', label: 'Kegiatan', icon: Users },
  { key: 'rapat', label: 'Rapat', icon: MessageSquare },
] as const;

const MONTH_OPTIONS = [
  { value: 'all', label: 'Semua Bulan' },
  { value: '0', label: 'Januari' },
  { value: '1', label: 'Februari' },
  { value: '2', label: 'Maret' },
  { value: '3', label: 'April' },
  { value: '4', label: 'Mei' },
  { value: '5', label: 'Juni' },
  { value: '6', label: 'Juli' },
  { value: '7', label: 'Agustus' },
  { value: '8', label: 'September' },
  { value: '9', label: 'Oktober' },
  { value: '10', label: 'November' },
  { value: '11', label: 'Desember' },
];

const CATEGORY_STYLES: Record<AgendaCategory, string> = {
  kajian: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sholat: 'bg-blue-50 text-blue-700 border-blue-200',
  kegiatan: 'bg-amber-50 text-amber-700 border-amber-200',
  rapat: 'bg-violet-50 text-violet-700 border-violet-200',
};

export default function AgendaPage() {
  const { data, loading } = useSiteData();
  const agendaData = data?.agenda || [];

  // Find the latest agenda date for default filter
  const getDefaultFilter = () => {
    if (agendaData.length === 0) return { month: 'all', year: 'all' };

    const latestAgenda = [...agendaData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    const date = new Date(latestAgenda.date);
    return {
      month: date.getMonth().toString(),
      year: date.getFullYear().toString()
    };
  };

  const defaultFilter = getDefaultFilter();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [activeMonth, setActiveMonth] = useState<string>(defaultFilter.month);
  const [activeYear, setActiveYear] = useState<string>(defaultFilter.year);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Update default filter when data loads
  useEffect(() => {
    if (agendaData.length > 0) {
      const filter = getDefaultFilter();
      setActiveMonth(filter.month);
      setActiveYear(filter.year);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agendaData.length]);

  // Get unique years from data
  const years = ['all', ...new Set(agendaData.map(item => new Date(item.date).getFullYear().toString()))].sort((a, b) => b.localeCompare(a));

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredAgenda = agendaData.filter(item => {
    const itemDate = new Date(item.date);
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesMonth = activeMonth === 'all' || itemDate.getMonth().toString() === activeMonth;
    const matchesYear = activeYear === 'all' || itemDate.getFullYear().toString() === activeYear;
    
    const { status } = getAgendaStatus(item.date, item.endDate);
    const matchesStatus = activeStatus === 'all' || status === activeStatus;

    return matchesCategory && matchesMonth && matchesYear && matchesStatus;
  }).sort((a, b) => {
    // Sort ongoing first, then by date ascending/descending
    const statusA = getAgendaStatus(a.date, a.endDate).status;
    const statusB = getAgendaStatus(b.date, b.endDate).status;
    if (statusA === 'sedang_berlangsung' && statusB !== 'sedang_berlangsung') return -1;
    if (statusB === 'sedang_berlangsung' && statusA !== 'sedang_berlangsung') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (loading && agendaData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="w-12 h-12 border-4 border-[hsl(var(--muted))] border-t-[hsl(var(--primary))] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[hsl(var(--background))]/80 backdrop-blur-xl border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </Link>

            <Link
              href="/kegiatan"
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 transition-colors"
            >
              <span>Pusat Kegiatan Masjid</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Jadwal & Agenda
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
            Kalender Agenda Masjid
          </h1>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Informasi lengkap jadwal kegiatan, kajian, dan acara ibadah di Masjid Jami' Al-Arqam dengan deteksi status otomatis.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-2xl p-6 mb-12 shadow-sm space-y-4"
        >
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[hsl(var(--border))]/50 scrollbar-none">
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mr-2 flex-shrink-0">
              Status:
            </span>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'sedang_berlangsung', label: '🟢 Sedang Berlangsung' },
              { id: 'akan_datang', label: '🔵 Akan Datang' },
              { id: 'selesai', label: '⚪ Selesai' },
            ].map((tab) => {
              const isActive = activeStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[hsl(var(--primary))] text-white shadow-xs'
                      : 'bg-[hsl(var(--muted))]/50 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
              {CATEGORY_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = activeCategory === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => setActiveCategory(option.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[hsl(var(--primary))] text-white shadow-md shadow-[hsl(var(--primary))]/20'
                        : 'bg-[hsl(var(--muted))]/50 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{option.label}</span>
                    <span className="sm:hidden">{option.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-px h-8 bg-[hsl(var(--border))] hidden md:block" />

            {/* Date Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              <div className="relative">
                <select
                  value={activeMonth}
                  onChange={(e) => setActiveMonth(e.target.value)}
                  className="appearance-none bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))] rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 cursor-pointer min-w-[140px]"
                >
                  {MONTH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))] pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={activeYear}
                  onChange={(e) => setActiveYear(e.target.value)}
                  className="appearance-none bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))] rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 cursor-pointer min-w-[100px]"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year === 'all' ? 'Semua Tahun' : year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))] pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agenda Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAgenda.length > 0 ? (
              filteredAgenda.map((item) => {
                const statusInfo = getAgendaStatus(item.date, item.endDate);
                const formattedDateRange = formatAgendaDateRange(item.date, item.endDate);
                const isOngoing = statusInfo.status === 'sedang_berlangsung';
                const isPast = statusInfo.status === 'selesai';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`group relative border rounded-2xl p-6 transition-all duration-300 flex flex-col h-full ${
                      isOngoing
                        ? 'bg-white border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                        : isPast
                        ? 'bg-[hsl(var(--muted))]/25 border-[hsl(var(--border))]/50 grayscale-[0.4] hover:grayscale-0'
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
                          CATEGORY_STYLES[item.category as AgendaCategory] || 'bg-gray-50 text-gray-700 border-gray-200'
                        } ${isPast ? 'opacity-60' : ''}`}
                      >
                        {item.category.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      {/* Date Block */}
                      <div
                        className={`flex flex-col items-center rounded-xl px-3 py-2 min-w-[3.5rem] shrink-0 text-center ${
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
                        <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 opacity-80">
                          {new Date(item.date).toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-lg leading-snug line-clamp-2 ${
                            isPast
                              ? 'text-[hsl(var(--muted-foreground))]'
                              : 'text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))]'
                          } transition-colors`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                          <span>{formattedDateRange}</span>
                        </p>
                      </div>
                    </div>

                    {item.description && (
                      <p
                        className={`text-sm mb-6 line-clamp-2 flex-1 ${
                          isPast ? 'text-[hsl(var(--muted-foreground))]/70' : 'text-[hsl(var(--muted-foreground))]'
                        }`}
                      >
                        {item.description}
                      </p>
                    )}

                    <div
                      className={`flex items-center gap-5 text-xs mt-auto pt-4 border-t border-[hsl(var(--border))]/50 ${
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
                          <span className="truncate max-w-[140px]">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))]/60">
                <Calendar className="w-12 h-12 text-[hsl(var(--muted-foreground))]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Tidak Ada Agenda</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Tidak ditemukan jadwal kegiatan untuk kriteria filter yang dipilih.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-[hsl(var(--primary))] text-white shadow-lg shadow-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--primary))]/90 transition-all z-30"
            aria-label="Kembali ke atas"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
