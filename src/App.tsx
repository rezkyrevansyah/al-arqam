import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { Agenda } from './components/Agenda';
import { Articles } from './components/Articles';
import { Gallery } from './components/Gallery';
import { Pengurus } from './components/Pengurus';
import { Donation } from './components/Donation';
import { Footer } from './components/Footer';
import { useScrollToHash } from './hooks/useScrollToHash';
import { AdminProvider } from './admin/store/admin-store';

// Lazy load pages
const AgendaPage = lazy(() => import('./pages/AgendaPage').then(module => ({ default: module.AgendaPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(module => ({ default: module.GalleryPage })));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage').then(module => ({ default: module.ArticlesPage })));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage').then(module => ({ default: module.ArticleDetailPage })));

// Lazy load admin panel
const AdminPanel = lazy(() => import('./admin/AdminPanel'));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
      <div className="w-12 h-12 border-4 border-[hsl(var(--muted))] border-t-[hsl(var(--primary))] rounded-full animate-spin"></div>
    </div>
  );
}

function HomePage() {
  useScrollToHash();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main>
        <Hero />
        <Countdown />
        <Agenda />
        <Articles />
        <Gallery />
        <Pengurus />
        <Donation />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/artikel" element={<ArticlesPage />} />
            <Route path="/artikel/:id" element={<ArticleDetailPage />} />
            <Route path="/admin/*" element={<AdminPanel />} />
          </Routes>
        </Suspense>
      </Router>
    </AdminProvider>
  );
}

export default App;
