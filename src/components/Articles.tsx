import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowUpRight, BookOpen } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatGoogleDriveUrl } from '../lib/utils';

export function Articles() {
  const { data } = useSiteData();
  const articlesData = data?.articles || [];

  const featuredArticle = articlesData[0];
  const otherArticles = articlesData.slice(1, 4); // Only show 3 more articles (total 4)

  return (
    <section id="artikel" className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-[hsl(var(--muted))]/30 to-transparent">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Kabar & Informasi
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
            Artikel Terbaru
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Berita, kajian, dan informasi terkini seputar kegiatan Masjid Al-Arqom
          </p>
        </motion.div>

        {/* Content */}
        {articlesData.length > 0 && featuredArticle ? (
          <>
            {/* Articles Grid - Equal height columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Featured Article - Stretches to match right column */}
              <Link to={`/artikel/${featuredArticle.id}`}>
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-3xl overflow-hidden hover:border-[hsl(var(--primary))]/20 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/5 transition-all duration-500 cursor-pointer flex flex-col h-full"
            >
            {/* Image fills remaining space */}
            <div className="relative flex-1 min-h-[200px] overflow-hidden">
              <img
                src={formatGoogleDriveUrl(featuredArticle.image)}
                alt={featuredArticle.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[hsl(var(--gold))] text-white text-xs font-semibold rounded-full">
                  {featuredArticle.category}
                </span>
              </div>
              {/* Title overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                  {featuredArticle.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed line-clamp-2 max-w-md">
                  {featuredArticle.excerpt}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 md:p-6 bg-[hsl(var(--card))]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {featuredArticle.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(featuredArticle.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/5 flex items-center justify-center group-hover:bg-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary-foreground))] transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            </motion.article>
          </Link>

          {/* Other Articles - Equal height cards */}
          <div className="flex flex-col gap-4 h-full">
            {otherArticles.map((article, index) => (
              <Link key={article.id} to={`/artikel/${article.id}`}>
                <motion.article
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex gap-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-2xl p-4 hover:border-[hsl(var(--primary))]/20 hover:shadow-lg hover:shadow-[hsl(var(--primary))]/5 transition-all duration-500 cursor-pointer flex-1 h-full"
              >
                {/* Square image */}
                <div className="relative w-24 sm:w-28 aspect-square flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={formatGoogleDriveUrl(article.image)}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] text-[10px] font-semibold rounded uppercase tracking-wide">
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm mt-1.5 line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors duration-300 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-xs mt-1 line-clamp-1 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[hsl(var(--muted-foreground))] mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{article.author}</span>
                    </span>
                  </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Articles Button - Show when more than 4 articles */}
        {articlesData.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link
              to="/artikel"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors font-medium shadow-lg shadow-[hsl(var(--primary))]/20 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/30"
            >
              <ArrowUpRight className="w-4 h-4" />
              Lihat Semua Artikel
            </Link>
          </motion.div>
        )}
          </>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
              Belum Ada Artikel
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-md mx-auto">
              Saat ini belum ada artikel yang tersedia. Silakan kunjungi lagi nanti.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
