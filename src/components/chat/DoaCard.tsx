"use client";

import { useState } from "react";
import { Check, Copy, HeartHandshake, Share2 } from "lucide-react";
import type { DoaData } from "@/types/chat";

interface DoaCardProps {
  doa: DoaData;
  skor?: number;
}

export function DoaCard({ doa, skor }: DoaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${doa.judul}\n\n${doa.teks_arab}\n\n${doa.teks_latin ? `${doa.teks_latin}\n\n` : ""}Artinya: "${doa.terjemahan}"\n${doa.catatan ? `Sumber: ${doa.catatan}` : ""}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const shareText = `${doa.judul}\n\n${doa.teks_arab}\n\n"${doa.terjemahan}"\n\n(Tanya Al-Arqam AI)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: doa.judul,
          text: shareText,
        });
      } catch {
        // Fallback to copy
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-amber-900/15 bg-gradient-to-b from-amber-50/50 via-white to-white p-4 shadow-sm transition-all hover:shadow-md">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--accent))]/15 text-amber-800">
            <HeartHandshake className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-950">
              {doa.judul}
            </span>
            {doa.grup && (
              <span className="ml-2 rounded-full bg-amber-100/70 px-1.5 py-0.5 text-[10px] text-amber-800">
                {doa.grup}
              </span>
            )}
          </div>
        </div>
        {skor !== undefined && (
          <span className="text-[10px] text-stone-500 font-medium">
            Relevansi {Math.round(skor * 100)}%
          </span>
        )}
      </div>

      {/* Teks Arab Doa */}
      <div className="my-3.5 text-right">
        <p
          dir="rtl"
          className="font-arabic text-xl sm:text-2xl leading-loose font-medium text-stone-900 selection:bg-amber-200"
          style={{ wordSpacing: "4px" }}
        >
          {doa.teks_arab}
        </p>
      </div>

      {/* Teks Latin */}
      {doa.teks_latin && (
        <p className="mb-2 text-xs italic text-stone-600 leading-relaxed">
          {doa.teks_latin}
        </p>
      )}

      {/* Terjemahan Doa */}
      <div className="rounded-xl bg-white/80 p-3 text-xs leading-relaxed text-stone-700 border border-stone-200/60">
        <span className="font-semibold text-amber-900">Artinya: </span>
        &ldquo;{doa.terjemahan}&rdquo;
      </div>

      {/* Catatan Perawi / Hadits Sumber */}
      {(doa.catatan || doa.sumber) && (
        <div className="mt-2 text-[11px] text-stone-500 italic">
          📜 {doa.catatan || doa.sumber}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3 flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-amber-100/70 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          title="Salin Doa"
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
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-amber-100/70 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          title="Bagikan Doa"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Bagikan</span>
        </button>
      </div>
    </div>
  );
}
