import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Landmark, Copy, Check, QrCode, Download, X, Maximize2 } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatGoogleDriveUrl } from '../lib/utils';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function DonationSkeleton() {
  return (
    <section id="donasi" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--gold))]/[0.03] to-transparent" />
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="skeleton h-4 w-32 mx-auto mb-4" />
          <div className="skeleton h-12 w-56 mx-auto mb-4" />
          <div className="skeleton h-4 w-80 max-w-full mx-auto" />
        </div>
        <div className="space-y-6">
          {/* Dalil card skeleton */}
          <div className="bg-[hsl(var(--primary))] rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="skeleton-light w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="skeleton-light h-6 w-full" />
                <div className="h-px bg-[hsl(var(--primary-foreground))]/20" />
                <div className="skeleton-light h-4 w-3/4" />
              </div>
            </div>
          </div>
          {/* Bank + QRIS skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white border border-[hsl(var(--border))]/60 rounded-3xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="skeleton w-14 h-14 rounded-2xl" />
                <div className="flex-1">
                  <div className="skeleton h-3 w-24 mb-2" />
                  <div className="skeleton h-6 w-48 mb-1" />
                  <div className="skeleton h-3 w-32" />
                </div>
              </div>
              <div className="bg-[hsl(var(--muted))]/50 rounded-2xl p-4 flex items-center justify-between mb-8">
                <div>
                  <div className="skeleton h-3 w-28 mb-2" />
                  <div className="skeleton h-8 w-48" />
                </div>
                <div className="skeleton h-10 w-24 rounded-xl" />
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <div className="skeleton h-4 w-28" />
                  <div className="skeleton h-4 w-12" />
                </div>
                <div className="skeleton h-3 w-full rounded-full" />
                <div className="flex justify-between mt-3">
                  <div className="skeleton h-5 w-32" />
                  <div className="skeleton h-4 w-36" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="skeleton w-12 h-12 rounded-2xl" />
                <div>
                  <div className="skeleton h-3 w-28 mb-1" />
                  <div className="skeleton h-5 w-16" />
                </div>
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="skeleton w-40 h-40 rounded-2xl" />
              </div>
              <div className="text-center">
                <div className="skeleton h-4 w-40 mx-auto mb-1" />
                <div className="skeleton h-3 w-52 mx-auto mb-4" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Donation() {
  const { data } = useSiteData();

  if (!data) return <DonationSkeleton />;

  const bankAccountNumber = data.donation?.bankAccountNumber || '';
  const bankAccountName = data.donation?.bankAccountName || '';
  const bankName = data.donation?.bankName || 'Bank Syariah Indonesia (BSI)';
  const donationCollected = data.donation?.donationCollected || 0;
  const donationTarget = data.donation?.donationTarget || 100000000;
  const rawQrisUrl = data.donation?.qrisImageUrl;
  const qrisImageUrl = formatGoogleDriveUrl(rawQrisUrl);

  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressPercent = donationTarget > 0 ? Math.min((donationCollected / donationTarget) * 100, 100) : 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bankAccountNumber.replace(/\s/g, ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback silently fails
    }
  };

  const handleDownloadQRIS = async () => {
    try {
      const response = await fetch(qrisImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = qrisImageUrl;
      link.download = 'QRIS-Masjid-Al-Arqom.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open image in new tab
      window.open(qrisImageUrl, '_blank');
    }
  };

  return (
    <>
      <section id="donasi" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--gold))]/[0.03] to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="section-ornament text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
              Infaq & Sedekah
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mt-4">
              Salurkan Donasi
            </h2>
            <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
              Mari bersama memakmurkan Masjid Jami' Al-Arqom melalui infaq dan sedekah
            </p>
          </motion.div>

          {/* Cards Layout */}
          <div className="space-y-6">
            {/* Row 1: Dalil Sedekah (Full Width) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[hsl(var(--primary))] rounded-3xl p-8 md:p-10 text-[hsl(var(--primary-foreground))] relative overflow-hidden"
            >
              <div className="absolute inset-0 islamic-pattern opacity-10" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--gold-light))]/20 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-[hsl(var(--gold-light))]" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <p className="font-arabic text-xl md:text-2xl leading-relaxed text-[hsl(var(--primary-foreground))]/90 text-center md:text-right" dir="rtl">
                    مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ فِى كُلِّ سُنۢبُلَةٍ مِّا۟ئَةُ حَبَّةٍ
                  </p>

                  <div className="h-px bg-[hsl(var(--primary-foreground))]/20" />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-sm leading-relaxed text-[hsl(var(--primary-foreground))]/80 max-w-2xl">
                      "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji."
                    </p>
                    <p className="text-xs font-semibold text-[hsl(var(--gold-light))] uppercase tracking-wider whitespace-nowrap">
                      QS. Al-Baqarah: 261
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 2: Bank Transfer + QRIS */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Main Donation Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`${qrisImageUrl ? 'lg:col-span-3' : 'lg:col-span-5 max-w-3xl mx-auto'} bg-white border border-[hsl(var(--border))]/60 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]">
                  <svg viewBox="0 0 120 120">
                    <path d="M60 0L120 60L60 120L0 60Z" fill="hsl(38,70%,55%)" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--primary))]/5 flex items-center justify-center flex-shrink-0">
                      <Landmark className="w-6 h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                        Transfer Bank
                      </p>
                      <h3 className="font-display text-xl font-bold text-[hsl(var(--foreground))]">
                        {bankName}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                        a.n. {bankAccountName}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[hsl(var(--muted))]/50 rounded-2xl p-4 flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">
                        Nomor Rekening
                      </p>
                      <p className="font-display text-2xl font-bold text-[hsl(var(--foreground))] tracking-wider">
                        {bankAccountNumber}
                      </p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isCopied
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90'
                      }`}
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {isCopied ? 'Tersalin!' : 'Salin'}
                    </button>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        Dana Terkumpul
                      </span>
                      <span className="text-sm font-semibold text-[hsl(var(--gold))]">
                        {progressPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progressPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--emerald-light))]"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-display font-bold text-[hsl(var(--primary))]">
                        {formatCurrency(donationCollected)}
                      </span>
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        dari {formatCurrency(donationTarget)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* QRIS Card (2 cols) - Only show if valid URL exists */}
              {qrisImageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60 rounded-3xl p-6 relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]">
                    <svg viewBox="0 0 120 120">
                      <path d="M60 0L120 60L60 120L0 60Z" fill="hsl(38,70%,55%)" />
                    </svg>
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center flex-shrink-0">
                          <QrCode className="w-5 h-5 text-[hsl(var(--gold))]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                            Pembayaran Digital
                          </p>
                          <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))]">
                            QRIS
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* QRIS Image - Clickable for fullscreen */}
                    <div className="flex-1 flex items-center justify-center mb-4">
                      <button
                        onClick={() => setIsFullscreen(true)}
                        className="group relative bg-white p-4 rounded-2xl shadow-lg border border-[hsl(var(--border))]/40 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        <img
                          src={qrisImageUrl}
                          alt="QRIS Masjid Al-Arqom"
                          className="w-40 h-40 object-contain rounded-lg"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                            <Maximize2 className="w-4 h-4 text-[hsl(var(--foreground))]" />
                            <span className="text-xs font-medium text-[hsl(var(--foreground))]">Perbesar</span>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                        Scan kode QRIS di atas
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">
                        Mendukung semua e-wallet & mobile banking
                      </p>
                      
                      <button
                        onClick={handleDownloadQRIS}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-sm font-medium text-[hsl(var(--foreground))]"
                      >
                        <Download className="w-4 h-4" />
                        Download QRIS
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && qrisImageUrl && (
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
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-[hsl(var(--foreground))]" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[hsl(var(--foreground))]">
                  QRIS Masjid Al-Arqom
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Scan untuk berdonasi
                </p>
              </div>

              {/* QRIS Image */}
              <div className="bg-[hsl(var(--muted))]/30 p-4 rounded-2xl mb-6">
                <img
                  src={qrisImageUrl}
                  alt="QRIS Masjid Al-Arqom"
                  className="w-full max-w-xs mx-auto object-contain rounded-xl"
                />
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownloadQRIS}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold))]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download QRIS
              </button>

              {/* Additional Info */}
              <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-4">
                Simpan gambar QRIS untuk donasi kapan saja
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
