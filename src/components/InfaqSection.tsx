"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Heart, Maximize2, Download, X, QrCode } from 'lucide-react';

const ACCOUNT_NUMBER = '4580008877';
const QRIS_IMAGE = '/qris_masjid.jpeg';

export function InfaqSection() {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = QRIS_IMAGE;
    a.download = 'QRIS-Masjid-Al-Arqam.jpeg';
    a.click();
  };

  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(var(--muted))]/30 to-[hsl(var(--background))]">
        {/* Decorative background */}
        <div className="absolute inset-0 islamic-pattern opacity-[0.025] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/40 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--gold))]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/25 rounded-full px-4 py-1.5 mb-5">
              <Heart className="w-3.5 h-3.5 text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--gold))]">
                Infaq &amp; Sedekah
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-4">
              Mari Memakmurkan Masjid
            </h2>
            <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/60 to-transparent mb-4" />
            <p className="text-[hsl(var(--muted-foreground))] max-w-sm mx-auto text-sm leading-relaxed">
              Salurkan infaq &amp; sedekah Anda melalui transfer bank atau scan QRIS. Semua amal tercatat dan insya Allah berkah.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="flex flex-col lg:flex-row gap-5 items-start max-w-3xl mx-auto">

            {/* ── Bank Transfer Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 w-full bg-white rounded-3xl shadow-xl shadow-black/6 border border-[hsl(var(--border))]/60 overflow-hidden"
            >
              {/* Gold top strip */}
              <div className="h-1 bg-gradient-to-r from-[hsl(var(--gold))] via-[hsl(var(--gold-light))] to-[hsl(var(--gold))]" />

              <div className="p-7 flex flex-col gap-6">
                {/* Top row: label + logo */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] mb-1">
                      Transfer Bank
                    </p>
                    <p className="font-display text-lg font-bold text-[hsl(var(--foreground))] leading-tight">
                      Bank Muamalat Indonesia
                    </p>
                  </div>
                  <Image
                    src="/bank_muamalat_logo.png"
                    alt="Bank Muamalat Indonesia"
                    width={400}
                    height={113}
                    className="h-8 w-auto object-contain flex-shrink-0 ml-4"
                  />
                </div>

                <div className="h-px bg-[hsl(var(--border))]/50" />

                {/* Account number */}
                <div className="bg-[hsl(var(--muted))]/50 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[hsl(var(--muted-foreground))] mb-1.5">
                      Nomor Rekening
                    </p>
                    <span className="font-display text-[1.7rem] font-bold tracking-[0.05em] text-[hsl(var(--foreground))]">
                      {ACCOUNT_NUMBER}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 ${
                      copied
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>

                {/* Account name */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[hsl(var(--gold))]/12 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--gold))]" />
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Atas nama{' '}
                    <span className="font-bold text-[hsl(var(--foreground))]">MASJID AL ARQAM</span>
                  </p>
                </div>

                {/* Dalil / ayat */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))]/8 via-[hsl(var(--primary))]/5 to-[hsl(var(--gold))]/8 border border-[hsl(var(--primary))]/10 p-4">
                  {/* Ornamental quote mark */}
                  <div className="absolute -top-2 -left-1 font-display text-[5rem] leading-none text-[hsl(var(--gold))]/15 select-none pointer-events-none">
                    &ldquo;
                  </div>
                  {/* Arabic */}
                  <p className="text-right font-display text-base leading-loose text-[hsl(var(--primary))] mb-2 pr-1" dir="rtl">
                    مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ
                  </p>
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-[hsl(var(--gold))]/30 via-[hsl(var(--gold))]/60 to-[hsl(var(--gold))]/30 mb-3" />
                  {/* Translation */}
                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed italic">
                    "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai..."
                  </p>
                  <p className="text-[10px] font-semibold text-[hsl(var(--gold))] mt-2 tracking-wide">
                    QS. Al-Baqarah: 261
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── QRIS Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-56 w-full bg-white rounded-3xl shadow-xl shadow-black/6 border border-[hsl(var(--border))]/60 overflow-hidden"
            >
              {/* Primary top strip */}
              <div className="h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--emerald-light))]" />

              <div className="p-5 flex flex-col gap-4">
                {/* Label */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] mb-0.5">
                    Scan &amp; Bayar
                  </p>
                  <p className="font-display text-lg font-bold text-[hsl(var(--foreground))]">
                    QRIS
                  </p>
                </div>

                {/* QRIS image — clickable, full portrait, no crop */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="group relative w-full rounded-2xl overflow-hidden border border-[hsl(var(--border))]/50 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Image
                    src={QRIS_IMAGE}
                    alt="QRIS Masjid Al Arqam"
                    width={785}
                    height={1280}
                    sizes="(max-width: 1024px) 100vw, 224px"
                    className="w-full h-auto object-contain block"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5 text-[hsl(var(--foreground))]" />
                      <span className="text-xs font-semibold text-[hsl(var(--foreground))]">Perbesar</span>
                    </div>
                  </div>
                </button>

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/60 transition-colors text-sm font-medium text-[hsl(var(--foreground))]"
                >
                  <Download className="w-4 h-4" />
                  Download QRIS
                </button>

                <p className="text-center text-[11px] text-[hsl(var(--muted-foreground))] leading-snug">
                  Semua e-wallet &amp; m-banking
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hadith */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12 text-xs text-[hsl(var(--muted-foreground))] italic"
          >
            &ldquo;Sedekah tidak akan mengurangi harta.&rdquo;
            <span className="not-italic font-medium"> — HR. Muslim</span>
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))]/50 to-transparent" />
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-h-[92vh]
                         flex flex-col
                         sm:flex-row sm:max-w-lg sm:max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[hsl(var(--foreground))]" />
              </button>

              {/* ── Mobile: image + download stacked, scrollable ── */}
              {/* ── Desktop: image panel left ── */}
              <div className="flex-1 sm:flex-none sm:w-56 overflow-y-auto bg-[hsl(var(--muted))]/20 flex flex-col items-center p-4 gap-4">
                <Image
                  src={QRIS_IMAGE}
                  alt="QRIS Masjid Al Arqam"
                  width={785}
                  height={1280}
                  sizes="(max-width: 640px) 100vw, 224px"
                  className="w-full h-auto object-contain rounded-xl"
                />
                {/* Download button visible on mobile inside scroll area */}
                <button
                  onClick={handleDownload}
                  className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity shadow-lg flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download QRIS
                </button>
              </div>

              {/* ── Desktop: right info panel ── */}
              <div className="hidden sm:flex flex-col justify-between gap-5 p-6 flex-1">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4">
                    <QrCode className="w-5 h-5 text-[hsl(var(--gold))]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[hsl(var(--foreground))] mb-1">
                    QRIS Masjid Al Arqam
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Scan menggunakan aplikasi dompet digital atau m-banking manapun untuk berinfaq &amp; sedekah.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download QRIS
                  </button>
                  <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
                    Simpan gambar untuk digunakan kapan saja
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
