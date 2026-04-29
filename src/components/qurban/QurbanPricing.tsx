"use client";

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { QURBAN_PRICING, formatRupiah } from '@/data/qurban';

export function QurbanPricing() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--gold))]/[0.03] to-transparent" />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Informasi Biaya
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mt-4">
            Paket & Biaya Qurban
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QURBAN_PRICING.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-7 md:p-8 overflow-hidden transition-all duration-500 ${
                item.highlight
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-xl shadow-[hsl(var(--primary))]/15'
                  : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 hover:border-[hsl(var(--primary))]/20 hover:shadow-lg'
              }`}
            >
              {item.highlight && (
                <div className="absolute inset-0 islamic-pattern opacity-10" />
              )}

              <div className="relative z-10">
                <h3 className={`font-display text-lg font-bold mb-4 ${
                  item.highlight ? 'text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--foreground))]'
                }`}>
                  {item.label}
                </h3>

                <p className={`font-display text-3xl md:text-4xl font-bold mb-3 ${
                  item.highlight ? 'text-[hsl(var(--gold-light))]' : 'text-[hsl(var(--primary))]'
                }`}>
                  {formatRupiah(item.price)}
                </p>

                {item.note && (
                  <p className={`text-sm leading-relaxed ${
                    item.highlight ? 'text-[hsl(var(--primary-foreground))]/70' : 'text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {item.note}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health certification badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-3 text-[hsl(var(--primary))]"
        >
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold">
            Hewan qurban sudah lolos sertifikasi kesehatan
          </p>
        </motion.div>
      </div>
    </section>
  );
}
