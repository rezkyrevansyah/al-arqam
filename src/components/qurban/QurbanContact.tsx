"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Copy, Check, Phone } from 'lucide-react';
import Image from 'next/image';
import { toWhatsAppLink } from '@/data/qurban';
import type { QurbanContactEntry } from '@/data/types';

const WA_MESSAGE = "Assalamualaikum, saya ingin mendaftar Qurban di Masjid Al-Arqam Bekasi Utara";

interface QurbanContactProps {
  contacts: QurbanContactEntry[];
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export function QurbanContact({ contacts, bankName, bankAccountNumber, bankAccountName }: QurbanContactProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bankAccountNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback silently
    }
  };

  return (
    <section className="relative py-20 md:py-28">
      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
            Konfirmasi & Pembayaran
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mt-4">
            Hubungi Panitia Qurban
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Silakan hubungi panitia melalui WhatsApp untuk pendaftaran dan konfirmasi qurban
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-3 space-y-4">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.phone}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-[hsl(var(--primary))]/20 hover:shadow-lg transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary))]/5 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(var(--foreground))] text-sm">
                      {contact.name}
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {contact.phone}
                    </p>
                  </div>
                </div>

                <a
                  href={toWhatsAppLink(contact.phone, WA_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-600/20 active:scale-95 flex-shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Bank Transfer Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white border border-[hsl(var(--border))]/60 rounded-3xl p-6 md:p-7 shadow-xl shadow-black/5 relative overflow-hidden h-fit"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]">
              <svg viewBox="0 0 120 120">
                <path d="M60 0L120 60L60 120L0 60Z" fill="hsl(38,70%,55%)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image
                    src="/bank-mandiri-logo.png"
                    alt="Bank Mandiri"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Transfer Bank
                  </p>
                  <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))]">
                    {bankName}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                    a.n. {bankAccountName}
                  </p>
                </div>
              </div>

              <div className="bg-[hsl(var(--muted))]/50 rounded-2xl p-4 mb-4">
                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">
                  Nomor Rekening
                </p>
                <p className="font-display text-xl font-bold text-[hsl(var(--foreground))] tracking-wider">
                  {bankAccountNumber}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isCopied
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Tersalin!' : 'Salin Nomor Rekening'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
