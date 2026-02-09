import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, ChevronUp, Share2 } from 'lucide-react';
import { ARTICLES_DATA } from '../data/constants';

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Find article by id
  const article = ARTICLES_DATA.find(a => a.id === id);
  
  // Get related articles (same category, excluding current)
  const relatedArticles = article 
    ? ARTICLES_DATA.filter(a => a.category === article.category && a.id !== article.id).slice(0, 2)
    : [];

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Show back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle 404
  if (!article) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">Artikel yang Anda cari tidak tersedia.</p>
          <Link 
            to="/#artikel" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Generate full content (since ARTICLES_DATA has empty content, we'll create sample content)
  const fullContent = article.content || `
    <p>${article.excerpt}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <h2>Penjelasan Lebih Lanjut</h2>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    <h2>Kesimpulan</h2>
    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
  `;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[hsl(var(--background))]/80 backdrop-blur-xl border-b border-[hsl(var(--border))]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/#artikel" 
              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Kembali</span>
            </Link>
            <button 
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Bagikan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[40vh] md:h-[50vh] overflow-hidden"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-black/30 to-transparent" />
      </motion.div>

      {/* Article Content */}
      <main className="relative -mt-24 md:-mt-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[hsl(var(--card))] rounded-3xl shadow-xl border border-[hsl(var(--border))]/60 overflow-hidden"
          >
            {/* Article Header */}
            <div className="p-6 md:p-10 pb-0 md:pb-0">
              <span className="inline-block px-3 py-1 bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] text-xs font-semibold rounded-full uppercase tracking-wide mb-4">
                {article.category}
              </span>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-[hsl(var(--foreground))] leading-tight mb-6">
                {article.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-[hsl(var(--muted-foreground))] pb-6 border-b border-[hsl(var(--border))]">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  5 menit baca
                </span>
              </div>
            </div>

            {/* Article Body */}
            <div 
              className="p-6 md:p-10 prose prose-lg max-w-none
                prose-headings:font-display prose-headings:text-[hsl(var(--foreground))]
                prose-p:text-[hsl(var(--muted-foreground))] prose-p:leading-relaxed
                prose-a:text-[hsl(var(--primary))] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[hsl(var(--foreground))]
                prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-8 prose-h2:mb-4
              "
              dangerouslySetInnerHTML={{ __html: fullContent }}
            />
          </motion.article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 mb-16"
            >
              <h2 className="font-display text-xl md:text-2xl font-bold text-[hsl(var(--foreground))] mb-6">
                Artikel Terkait
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    to={`/artikel/${relatedArticle.id}`}
                    className="group flex gap-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-2xl p-4 hover:border-[hsl(var(--primary))]/20 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--gold))]">
                        {relatedArticle.category}
                      </span>
                      <h3 className="font-semibold text-sm text-[hsl(var(--foreground))] line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors mt-1">
                        {relatedArticle.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Back to Articles */}
          <div className="text-center mt-12 pb-16">
            <Link
              to="/#artikel"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Lihat Semua Artikel
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="max-w-4xl mx-auto px-6 text-center">
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
