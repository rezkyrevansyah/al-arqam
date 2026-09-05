import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  HeartHandshake, 
  CalendarDays, 
  Calendar,
  ArrowRight, 
  Home, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users,
  Compass
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Providers } from '@/app/providers';
import { getFooterData, getAgendaData } from '@/services/site-data.server';
import { getAgendaStatus, formatAgendaDateRange } from '@/utils/agenda';

export const metadata: Metadata = {
  title: 'Pusat Kegiatan Masjid',
  description:
    'Pusat kegiatan, program unggulan, kajian rutin, dan peringatan hari besar Islam di Masjid Jami\' Al-Arqam Bekasi Utara.',
};

export const revalidate = 60;

const FEATURED_ACTIVITIES = [
  {
    title: 'Gema Muharram 1448H',
    badge: '1448H',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description:
      'Perayaan Tahun Baru Islam 1448H dengan berbagai perlombaan santri & anak-anak: Adzan, Hafalan Surat Pendek, Mewarnai, dan Tilawatil Qur\'an.',
    icon: Sparkles,
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    href: '/tahun-baru-islam',
    actionText: 'Lihat Hasil & Pengumuman',
    highlights: ['Lomba Islami Santri', 'Pengumuman Juara', 'Tausiyah Akbar'],
  },
  {
    title: 'Qurban Idul Adha 1447H',
    badge: '1447H',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description:
      'Pendaftaran dan pelaksanaan ibadah Qurban Masjid Al-Arqam. Tersedia paket patungan sapi, kambing, dan domba dengan pengelolaan amanah & transparan.',
    icon: HeartHandshake,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    href: '/qurban',
    actionText: 'Info Paket & Pendaftaran',
    highlights: ['Paket Patungan Sapi 1/7', 'Kambing & Domba', 'Distribusi Tepat Sasaran'],
  },
  {
    title: 'Agenda & Kajian Rutin',
    badge: 'Rutin',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description:
      'Jadwal lengkap kajian ilmu mingguan, sholat berjamaah, kuliah subuh, dan kegiatan majelis taklim jamaah Masjid Al-Arqam.',
    icon: CalendarDays,
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    href: '/agenda',
    actionText: 'Lihat Kalender Agenda',
    highlights: ['Kajian Fiqih & Tafsir', 'Kuliah Subuh Ahad', 'Kajian Muslimah'],
  },
];

export default async function KegiatanPage() {
  const [footer, agenda] = await Promise.all([
    getFooterData(),
    getAgendaData(),
  ]);

  const upcomingAgenda = (agenda || []).slice(0, 3);

  return (
    <Providers initialData={{ footer, agenda }}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navbar />

        <main className="pb-24 pt-28 sm:pt-32">
          {/* Header & Breadcrumb */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-6">
              <Link
                href="/"
                className="hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </Link>
              <span>/</span>
              <span className="text-[hsl(var(--foreground))] font-medium">Kegiatan</span>
            </nav>

            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 mb-16 shadow-2xl shadow-emerald-950/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.15),transparent_50%)] pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Pusat Informasi & Aktivitas Masjid</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                  Kegiatan & Program Masjid Al-Arqam
                </h1>
                <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Menghidupkan syiar Islam melalui ragam agenda ibadah, peringatan hari besar, pembinaan umat, serta program sosial kemasyarakatan yang transparan dan inklusif.
                </p>
              </div>
            </div>

            {/* Section: Program Unggulan */}
            <div className="mb-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">
                    Program & Kegiatan Unggulan
                  </h2>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm sm:text-base mt-1">
                    Pilih kegiatan untuk melihat informasi detail, pendaftaran, dan laporan pelaksanaan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {FEATURED_ACTIVITIES.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.title}
                      className="group bg-white rounded-3xl border border-[hsl(var(--border))] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                    >
                      <div className="p-6 sm:p-8">
                        {/* Top Icon & Badge */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                          <div
                            className={`w-12 h-12 rounded-2xl ${activity.iconBg} text-white flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${activity.badgeColor}`}
                          >
                            {activity.badge}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-display text-xl font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors mb-3">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
                          {activity.description}
                        </p>

                        {/* Highlights list */}
                        <div className="space-y-2 pt-4 border-t border-[hsl(var(--border))]/60">
                          {activity.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="flex items-center gap-2 text-xs text-[hsl(var(--foreground))]"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Action */}
                      <div className="p-6 sm:p-8 pt-0 mt-auto">
                        <Link
                          href={activity.href}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[hsl(var(--muted))] group-hover:bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] group-hover:text-white text-sm font-semibold transition-all duration-200"
                        >
                          <span>{activity.actionText}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: Agenda Mendatang Ringkas */}
            {upcomingAgenda.length > 0 && (
              <div className="bg-[hsl(var(--muted))]/40 rounded-3xl border border-[hsl(var(--border))] p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))]">
                      Agenda Terdekat
                    </h3>
                    <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">
                      Jadwal pengajian dan aktivitas jamaah dalam waktu dekat.
                    </p>
                  </div>
                  <Link
                    href="/agenda"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
                  >
                    <span>Lihat Semua Jadwal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingAgenda.map((item) => {
                    const statusInfo = getAgendaStatus(item.date, item.endDate);
                    const formattedDate = formatAgendaDateRange(item.date, item.endDate);

                    return (
                      <div
                        key={item.id}
                        className="bg-white p-5 rounded-2xl border border-[hsl(var(--border))] shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.badgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                              {statusInfo.label}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 capitalize">
                              {item.category}
                            </span>
                          </div>

                          <h4 className="font-semibold text-sm text-[hsl(var(--foreground))] line-clamp-1 mb-2">
                            {item.title}
                          </h4>
                          <div className="space-y-1.5 text-xs text-[hsl(var(--muted-foreground))] mb-4">
                            <div className="flex items-center gap-2 font-medium text-[hsl(var(--foreground))]">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{formattedDate}</span>
                            </div>
                            {item.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{item.time}</span>
                              </div>
                            )}
                            {item.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="line-clamp-1">{item.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Link
                          href="/agenda"
                          className="text-xs font-semibold text-[hsl(var(--primary))] hover:underline flex items-center gap-1 mt-auto pt-2 border-t border-[hsl(var(--border))]/50"
                        >
                          Detail Jadwal <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </Providers>
  );
}
