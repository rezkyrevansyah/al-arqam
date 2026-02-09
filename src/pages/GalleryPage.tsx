import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, Home, Calendar, Filter } from 'lucide-react';
import { GALLERY_DATA } from '../data/constants';

export function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Get unique years for filter, sorted descending (newest first)
  const years = [...new Set(GALLERY_DATA.map(item => new Date(item.date).getFullYear().toString()))].sort((a, b) => parseInt(b) - parseInt(a));
  const allYears = ['all', ...years];
  
  // Default to the latest year
  const [filter, setFilter] = useState<string>(years[0] || 'all');

  const closeLightbox = () => setLightboxIndex(null);
  
  const navigateLightbox = (direction: 1 | -1) => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + direction + GALLERY_DATA.length) % GALLERY_DATA.length);
    }
  };

  
  const filteredData = filter === 'all' 
    ? GALLERY_DATA 
    : GALLERY_DATA.filter(item => new Date(item.date).getFullYear().toString() === filter);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[hsl(var(--background))]/80 backdrop-blur-xl border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <Link 
              to="/#galeri" 
              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Dokumentasi Lengkap
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--foreground))] mt-4">
            Galeri Kegiatan
          </h1>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Kumpulan momen-momen berharga dari berbagai kegiatan di Masjid Jami' Al-Arqom. 
            Setiap foto menyimpan cerita indah perjalanan ibadah kita bersama.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <Calendar className="w-4 h-4" />
              <span>{filteredData.length} foto dokumentasi</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[hsl(var(--border))]" />
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-3 py-1.5 text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 cursor-pointer"
              >
                {allYears.map(year => (
                  <option key={year} value={year}>
                    {year === 'all' ? 'Semua Tahun' : year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-[hsl(var(--muted))]"
              onClick={() => setLightboxIndex(GALLERY_DATA.findIndex(g => g.id === item.id))}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-white/60 text-[10px] sm:text-xs mt-0.5">
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[hsl(var(--muted-foreground))]">
              Tidak ada foto untuk tahun {filter}
            </p>
          </div>
        )}

        {/* Back to Top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            to="/#galeri"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2026 Masjid Jami' Al-Arqom. Semua hak dilindungi.
          </p>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[85vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_DATA[lightboxIndex].image}
                alt={GALLERY_DATA[lightboxIndex].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <h3 className="text-white font-semibold">
                  {GALLERY_DATA[lightboxIndex].title}
                </h3>
                <p className="text-white/50 text-sm mt-1">
                  {lightboxIndex + 1} / {GALLERY_DATA.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
