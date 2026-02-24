import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin, type AdminPage } from '../store/admin-store';
import {
  LayoutDashboard, Type, Timer, CalendarDays, Newspaper,
  Image, Heart, Users, Globe, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';

const menuItems: { key: AdminPage; label: string; icon: typeof LayoutDashboard; group?: string; path: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Utama', path: '/admin' },
  { key: 'hero', label: 'Hero Section', icon: Type, group: 'Konten', path: '/admin/hero' },
  { key: 'countdown', label: 'Countdown', icon: Timer, group: 'Konten', path: '/admin/countdown' },
  { key: 'agenda', label: 'Agenda', icon: CalendarDays, group: 'Konten', path: '/admin/agenda' },
  { key: 'artikel', label: 'Artikel', icon: Newspaper, group: 'Konten', path: '/admin/artikel' },
  { key: 'galeri', label: 'Galeri', icon: Image, group: 'Konten', path: '/admin/galeri' },
  { key: 'donasi', label: 'Donasi', icon: Heart, group: 'Konten', path: '/admin/donasi' },
  { key: 'pengurus', label: 'Pengurus DKM', icon: Users, group: 'Organisasi', path: '/admin/pengurus' },
  { key: 'footer', label: 'Footer', icon: Globe, group: 'Pengaturan', path: '/admin/footer' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const { currentPage, setCurrentPage } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync currentPage with current route
  useEffect(() => {
    const path = location.pathname;
    const menuItem = menuItems.find(item => item.path === path);
    if (menuItem && currentPage !== menuItem.key) {
      setCurrentPage(menuItem.key);
    } else if (path === '/admin' && currentPage !== 'dashboard') {
      setCurrentPage('dashboard');
    }
  }, [location.pathname, currentPage, setCurrentPage]);

  const groups = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    const g = item.group || '';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const handleNavigation = (item: typeof menuItems[0]) => {
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    navigate('/admin/login');
  };

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[#0C1B1A] text-white transition-all duration-300 ${
      collapsed ? 'w-[72px]' : 'w-[260px]'
    }`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-white/[0.06] flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="/logo.png" alt="Al-Arqom Logo" className="w-7 h-7 object-contain" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate" style={{ fontFamily: "'Playfair Display', serif" }}>Al-Arqom</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            {!collapsed && group && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">{group}</p>
            )}
            <div className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                      active ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/60'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3 space-y-1 flex-shrink-0">
        <button onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors">
          {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Tutup Sidebar</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
