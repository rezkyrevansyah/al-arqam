import { useEffect } from 'react';
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
import BoardPage from './pages/BoardPage';
import FooterPage from './pages/FooterPage';

function ProtectedRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true' && !!localStorage.getItem('admin_token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoggedIn, navigate, location.pathname]);

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
              <Route path="/pengurus" element={<BoardPage />} />
              <Route path="/footer" element={<FooterPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
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
