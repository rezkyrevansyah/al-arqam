import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../store/admin-store';
import AdminSidebar from './AdminSidebar';
import { CheckCircle2, XCircle, Bell, Loader2 } from 'lucide-react';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  hero: 'Hero Section',
  countdown: 'Countdown',
  agenda: 'Agenda',
  artikel: 'Artikel',
  galeri: 'Galeri',
  donasi: 'Donasi',
  pengurus: 'Pengurus DKM',
  footer: 'Footer',
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { currentPage, toast, isLoading, isInitialized, isSaving } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F4]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className="transition-all duration-300" style={{ marginLeft: collapsed ? 72 : 260 }}>
        <header className="sticky top-0 z-30 bg-[#F6F6F4]/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between px-8 h-[72px]">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Admin Panel</p>
              <h2 className="text-sm font-semibold text-gray-700">{pageTitles[currentPage]}</h2>
            </div>
            <div className="flex items-center gap-3">
              {isSaving && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </div>
              )}
              <button className="p-2.5 hover:bg-white rounded-xl transition-colors relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">Admin</p>
                  <p className="text-[10px] text-gray-400">DKM Al-Arqom</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium toast-enter ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
