import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../store/admin-store';
import {
  CalendarDays, Newspaper, Image, Users, Heart, TrendingUp,
  ArrowUpRight, Timer, Clock,
} from 'lucide-react';
import type { AdminPage } from '../store/admin-store';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: typeof CalendarDays;
  color: string;
  bgColor: string;
  page: AdminPage;
}

function StatCard({ label, value, icon: Icon, color, bgColor, page }: StatCardProps) {
  const { setCurrentPage } = useAdmin();
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
      <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value}
      </p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </button>
  );
}

function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const actionColor: Record<string, string> = {
  create: 'bg-emerald-50 text-emerald-500',
  update: 'bg-blue-50 text-blue-500',
  delete: 'bg-red-50 text-red-500',
};

function RecentActivity() {
  const { activityLog } = useAdmin();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">Aktivitas Terbaru</h3>
        <span className="text-xs text-gray-400 uppercase tracking-wider">Terkini</span>
      </div>
      <div className="space-y-4">
        {activityLog.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Belum ada aktivitas.</p>
        ) : (
          activityLog.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${actionColor[item.action] || 'bg-gray-50 text-gray-500'}`}>
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{item.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function QuickActions() {
  const { setCurrentPage } = useAdmin();
  const navigate = useNavigate();

  const actions = [
    { label: 'Tambah Agenda', page: 'agenda' as AdminPage, path: '/admin/agenda', icon: CalendarDays, color: 'text-blue-600 bg-blue-50' },
    { label: 'Tulis Artikel', page: 'artikel' as AdminPage, path: '/admin/artikel', icon: Newspaper, color: 'text-amber-600 bg-amber-50' },
    { label: 'Upload Foto', page: 'galeri' as AdminPage, path: '/admin/galeri', icon: Image, color: 'text-purple-600 bg-purple-50' },
    { label: 'Update Donasi', page: 'donasi' as AdminPage, path: '/admin/donasi', icon: Heart, color: 'text-rose-600 bg-rose-50' },
  ];

  const handleClick = (page: AdminPage, path: string) => {
    setCurrentPage(page);
    navigate(path);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">Aksi Cepat</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act) => (
          <button
            key={act.page}
            onClick={() => handleClick(act.page, act.path)}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-center"
          >
            <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center`}>
              <act.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-600">{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { agendaList, articleList, galleryList, boardList, countdown, donation, loadDashboard, loadActivityLog } = useAdmin();

  useEffect(() => {
    loadDashboard();
    loadActivityLog();
  }, [loadDashboard, loadActivityLog]);

  const pct = donation.donationTarget > 0 ? Math.round((donation.donationCollected / donation.donationTarget) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang di panel admin Masjid Jami' Al-Arqom</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Agenda" value={agendaList.length} icon={CalendarDays} color="text-blue-600" bgColor="bg-blue-50" page="agenda" />
        <StatCard label="Total Artikel" value={articleList.length} icon={Newspaper} color="text-amber-600" bgColor="bg-amber-50" page="artikel" />
        <StatCard label="Foto Galeri" value={galleryList.length} icon={Image} color="text-purple-600" bgColor="bg-purple-50" page="galeri" />
        <StatCard label="Pengurus DKM" value={boardList.length} icon={Users} color="text-emerald-600" bgColor="bg-emerald-50" page="pengurus" />
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Countdown status */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 120 120"><path d="M60 0L120 60L60 120L0 60Z" fill="white"/></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-5 h-5 text-emerald-200" />
              <span className="text-sm font-medium text-emerald-200">Countdown</span>
              <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${
                countdown.active ? 'bg-green-400/20 text-green-200' : 'bg-red-400/20 text-red-200'
              }`}>
                {countdown.active ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <h3 className="text-lg font-bold">{countdown.name}</h3>
            <p className="text-sm text-emerald-200 mt-1">
              {new Date(countdown.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Donation progress */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 120 120"><path d="M60 0L120 60L60 120L0 60Z" fill="white"/></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-amber-200" />
              <span className="text-sm font-medium text-amber-200">Progress Donasi</span>
              <span className="ml-auto text-sm font-bold">{pct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">
                Rp {(donation.donationCollected / 1e6).toFixed(1)}jt
              </span>
              <span className="text-amber-200">
                dari Rp {(donation.donationTarget / 1e6).toFixed(0)}jt
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}
