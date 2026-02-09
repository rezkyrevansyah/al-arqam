import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { AGENDA_DATA, type AgendaItem } from '../data/constants';

const CATEGORY_STYLES: Record<AgendaItem['category'], string> = {
  kajian: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sholat: 'bg-blue-50 text-blue-700 border-blue-200',
  kegiatan: 'bg-amber-50 text-amber-700 border-amber-200',
  rapat: 'bg-violet-50 text-violet-700 border-violet-200',
};

export function Agenda() {
  // Filter upcoming agendas (today or future)
  const upcomingAgendas = AGENDA_DATA.filter(item => {
    const itemDate = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return itemDate >= today;
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort ascending (closest date first)
  .slice(0, 6); // Take only 6

  return (
    <section id="agenda" className="relative py-24 md:py-32">
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
            Jadwal Kegiatan
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
            Agenda Masjid
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Daftar kegiatan dan program yang akan datang di Masjid Jami' Al-Arqom
          </p>
        </motion.div>

        {/* Agenda Grid */}
        {upcomingAgendas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAgendas.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-2xl p-6 hover:border-[hsl(var(--primary))]/20 hover:shadow-lg hover:shadow-[hsl(var(--primary))]/5 transition-all duration-500 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center bg-[hsl(var(--primary))]/5 rounded-xl px-3 py-2 min-w-[3.5rem]">
                      <span className="font-display text-2xl font-bold text-[hsl(var(--primary))] leading-none">
                        {new Date(item.date).getDate()}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--primary))]/60 mt-0.5">
                        {new Date(item.date).toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))] text-base group-hover:text-[hsl(var(--primary))] transition-colors duration-300 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_STYLES[item.category]}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 leading-relaxed line-clamp-2 flex-1">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))] mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {item.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{item.location}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--gold))] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
              Belum Ada Agenda
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              Belum ada agenda kegiatan yang terjadwal dalam waktu dekat.
            </p>
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors font-medium shadow-lg shadow-[hsl(var(--primary))]/20 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/30"
          >
            Lihat Semua Agenda
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
