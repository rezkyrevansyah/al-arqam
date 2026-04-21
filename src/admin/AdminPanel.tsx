import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HeroPage from './pages/HeroPage';
import CountdownPage from './pages/CountdownPage';
import AgendaPage from './pages/AgendaPage';
import ArticlePage from './pages/ArticlePage';
import ArticleEditorPage from './pages/ArticleEditorPage';
import GalleryPage from './pages/GalleryPage';
import DonationPage from './pages/DonationPage';
import TransparencyPage from './pages/TransparencyPage';
import BoardPage from './pages/BoardPage';
import FooterPage from './pages/FooterPage';
import { supabase } from '../lib/supabase';

function ProtectedRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) navigate('/login', { replace: true });
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate, location.pathname]);

  if (isLoggedIn === null) {
    return (
      <div className="h-full flex items-center justify-center bg-emerald-950">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Routes>
        {/* Full-page article editor (no sidebar) */}
        <Route path="/artikel/baru" element={<ArticleEditorPage />} />
        <Route path="/artikel/edit/:id" element={<ArticleEditorPage />} />

        {/* All other admin pages with sidebar layout */}
        <Route path="/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/hero" element={<HeroPage />} />
              <Route path="/countdown" element={<CountdownPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/artikel" element={<ArticlePage />} />
              <Route path="/galeri" element={<GalleryPage />} />
              <Route path="/donasi" element={<DonationPage />} />
              <Route path="/transparansi" element={<TransparencyPage />} />
              <Route path="/pengurus" element={<BoardPage />} />
              <Route path="/footer" element={<FooterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </>
  );
}

export default function AdminPanel() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}
