"use client";

import { useState } from "react";
import { BookOpen, Check, Copy, Share2 } from "lucide-react";
import type { AyatData } from "@/types/chat";

interface AyatCardProps {
  ayat: AyatData;
  skor?: number;
}

export function AyatCard({ ayat, skor }: AyatCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `QS. ${ayat.nama_surat} [${ayat.id_surat}]: ${ayat.nomor_ayat}\n\n${ayat.teks_arab}\n\n"${ayat.terjemahan_id}"`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
    }
  };

  const handleShare = async () => {
    const shareText = `QS. ${ayat.nama_surat}: ${ayat.nomor_ayat}\n\n${ayat.teks_arab}\n\n"${ayat.terjemahan_id}"\n\n(Tanya Al-Arqam AI)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${ayat.nama_surat}: ${ayat.nomor_ayat}`,
          text: shareText,
        });
      } catch {
        // Share cancelled or not supported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-emerald-900/15 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-sm transition-all hover:shadow-md">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-emerald-900/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-900">
              QS. {ayat.nama_surat} [{ayat.id_surat}]: {ayat.nomor_ayat}
            </span>
            {skor !== undefined && (
              <span className="ml-2 rounded-full bg-emerald-100/80 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
                Kecocokan {Math.round(skor * 100)}%
              </span>
            )}
          </div>
        </div>
        <span className="font-arabic text-base font-bold text-emerald-800">
          {ayat.nama_surat_arab}
        </span>
      </div>

      {/* Teks Arab Kaligrafi */}
      <div className="my-4 text-right">
        <p
          dir="rtl"
          className="font-arabic text-xl sm:text-2xl leading-loose font-medium text-stone-900 selection:bg-emerald-200"
          style={{ wordSpacing: "4px" }}
        >
          {ayat.teks_arab}
        </p>
      </div>

      {/* Teks Latin Fonetik */}
      {ayat.teks_latin && (
        <p className="mb-2 text-xs italic text-stone-600 leading-relaxed">
          {ayat.teks_latin}
        </p>
      )}

      {/* Terjemahan Resmi Kemenag */}
      <div className="rounded-xl bg-white/70 p-3 text-xs leading-relaxed text-stone-700 border border-stone-200/60">
        <span className="font-semibold text-emerald-900">Artinya: </span>
        &ldquo;{ayat.terjemahan_id}&rdquo;
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-emerald-100/70 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          title="Salin Ayat"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-600">Disalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Salin</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-emerald-100/70 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          title="Bagikan Ayat"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Bagikan</span>
        </button>
      </div>
    </div>
  );
}
