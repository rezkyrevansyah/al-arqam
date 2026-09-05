"use client";

import { Sparkles, Trash2, X } from "lucide-react";

interface ChatHeaderProps {
  titleId: string;
  onClose: () => void;
  onClear: () => void;
}

export function ChatHeader({ titleId, onClose, onClear }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-emerald-950/10 bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-950 px-4 py-3 text-white rounded-t-2xl shadow-xs">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs border border-white/20">
          <Sparkles className="h-5 w-5 text-[hsl(var(--accent))]" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 id={titleId} className="text-sm font-bold tracking-tight">
              Tanya Al-Arqam AI
            </h3>
            <span className="rounded-full bg-emerald-800/80 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-200 border border-emerald-700/50">
              Online
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/90 font-light">
            Pencarian Al-Qur&apos;an & Informasi Masjid
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg p-1.5 text-emerald-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          title="Hapus Riwayat Chat"
          aria-label="Hapus riwayat percakapan"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-emerald-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          title="Tutup Chat"
          aria-label="Tutup jendela chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
