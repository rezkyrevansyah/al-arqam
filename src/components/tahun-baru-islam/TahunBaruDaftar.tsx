"use client";

import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CONTACTS = [
  { nama: 'Mas Dafi', phone: '6210811555' },
  { nama: 'Mas Nabil', phone: '6295323777557' },
  { nama: 'Bu Venty', phone: '6217993383' },
];

const WA_MESSAGE = 'Assalamualaikum, saya ingin mendaftarkan anak untuk lomba Gema Muharram (Peringatan Tahun Baru Islam 1448H) di Masjid Al-Arqam RW 024';

function toWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function TahunBaruDaftar() {
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
          <div className="absolute top-0 left-0 w-48 h-48 bg-[hsl(var(--gold))]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[hsl(var(--gold))]/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />

          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🎉</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--primary-foreground))] mb-3">
              Ayo Daftarkan Diri!
            </h2>
            <p className="text-[hsl(var(--primary-foreground))]/70 mb-2 max-w-md mx-auto">
              Jangan lewatkan kesempatan tampil bersama teman-teman dan raih hadiahnya!
            </p>
            <p className="text-[hsl(var(--primary-foreground))]/60 text-sm mb-8 max-w-md mx-auto">
              Hubungi salah satu panitia berikut untuk informasi lebih lanjut atau pendaftaran.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {CONTACTS.map((contact) => (
                <a
                  key={contact.nama}
                  href={toWhatsAppLink(contact.phone, WA_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold text-sm hover:bg-green-700 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/20 active:scale-95 w-full sm:w-auto justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  {contact.nama}
                </a>
              ))}
            </div>
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
