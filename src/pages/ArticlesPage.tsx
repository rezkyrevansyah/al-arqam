import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Clock, User, ArrowUpRight, ChevronUp, Filter, BookOpen } from 'lucide-react';
import { ARTICLES_DATA } from '../data/constants';

export function ArticlesPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filter, setFilter] = useState<string>('Pengumuman');

  // Get unique categories
  const categories = ['all', ...new Set(ARTICLES_DATA.map(article => article.category))];

  // Filter articles by category
  const filteredArticles = filter === 'all'
    ? ARTICLES_DATA
    : ARTICLES_DATA.filter(article => article.category === filter);

  // Scroll to top when page loads
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

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[hsl(var(--background))]/80 backdrop-blur-xl border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <Link 
              to="/#artikel" 
              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Kembali ke Beranda</span>
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
            Kabar & Informasi
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
            Semua Artikel
          </h1>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Kumpulan berita, kajian, dan informasi terkini seputar kegiatan Masjid Jami' Al-Arqom.
          </p>

          {/* Filter & Count */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <BookOpen className="w-4 h-4" />
              <span>{filteredArticles.length} artikel</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[hsl(var(--border))]" />
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-3 py-1.5 text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={`/artikel/${article.id}`}
                  className="group flex flex-col h-full bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-2xl overflow-hidden hover:border-[hsl(var(--primary))]/20 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/5 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative h-48 flex-shrink-0 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[hsl(var(--gold))] text-white text-xs font-semibold rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h2 className="font-display text-lg font-bold text-[hsl(var(--foreground))] line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors duration-300 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(article.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[80px]">{article.author}</span>
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/5 flex items-center justify-center group-hover:bg-[hsl(var(--primary))] transition-colors duration-300">
                        <ArrowUpRight className="w-4 h-4 text-[hsl(var(--primary))] group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
              Tidak Ada Artikel
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              Belum ada artikel untuk kategori ini.
            </p>
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            to="/#artikel"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2026 Masjid Jami' Al-Arqom. Semua Hak Dilindungi.
          </p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[hsl(var(--primary))] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[hsl(var(--primary))]/90 transition-colors z-50"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
