"use client";

import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { QURBAN_CONTACTS, toWhatsAppLink } from '@/data/qurban';

const WA_MESSAGE = "Assalamualaikum, saya ingin mendaftar Qurban di Masjid Al-Arqam Bekasi Utara";

export function QurbanCTA() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[hsl(var(--primary))] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 islamic-pattern opacity-10" />

          <div className="relative z-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--primary-foreground))] mb-3">
              Daftarkan Qurban Anda Sekarang
            </h2>
            <p className="text-[hsl(var(--primary-foreground))]/70 mb-8 max-w-md mx-auto">
              Segera hubungi panitia untuk mendaftarkan hewan qurban Anda sebelum kuota habis
            </p>

            <a
              href={toWhatsAppLink(QURBAN_CONTACTS[0].phone, WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-600 text-white rounded-2xl font-semibold text-sm hover:bg-green-700 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/20 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi via WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
