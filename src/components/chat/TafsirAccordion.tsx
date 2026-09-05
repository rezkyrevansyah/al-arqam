"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import type { TafsirData } from "@/types/chat";

interface TafsirAccordionProps {
  tafsir: TafsirData;
  skor?: number;
}

export function TafsirAccordion({ tafsir }: TafsirAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-stone-200/80 bg-stone-50/80 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-emerald-900 transition-colors hover:bg-stone-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-emerald-700" />
          <span>
            Tafsir QS. {tafsir.nama_surat} ayat {tafsir.nomor_ayat} (Kemenag RI)
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-stone-200/60 bg-white/90 p-3.5 text-xs leading-relaxed text-stone-700">
          <p className="whitespace-pre-line">{tafsir.isi}</p>
        </div>
      )}
    </div>
  );
}
