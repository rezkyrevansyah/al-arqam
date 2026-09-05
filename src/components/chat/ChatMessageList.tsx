"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Compass, BookOpen, Clock, Heart, Calendar, Wallet, RefreshCw } from "lucide-react";
import type { AlArqamUIMessage } from "@/types/chat";
import { ChatMessageItem } from "./ChatMessageItem";

interface ChatMessageListProps {
  messages: AlArqamUIMessage[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onSelectPrompt: (prompt: string) => void;
  onRetry: () => void;
}

const QUICK_STARTERS = [
  {
    icon: BookOpen,
    label: "Ayat tentang sabar & ikhlas",
    prompt: "Ayat tentang sabar menghadapi ujian hidup",
  },
  {
    icon: Heart,
    label: "Doa ketenangan jiwa",
    prompt: "Doa agar hati tenang dan tidak gelisah",
  },
  {
    icon: Clock,
    label: "Jadwal sholat hari ini",
    prompt: "Jadwal sholat hari ini di Bekasi Utara",
  },
  {
    icon: Calendar,
    label: "Agenda kegiatan terdekat",
    prompt: "Ada agenda kajian apa terdekat di masjid?",
  },
  {
    icon: Wallet,
    label: "Info rekening donasi",
    prompt: "Nomor rekening donasi dan infaq masjid",
  },
];

export function ChatMessageList({
  messages,
  isLoading,
  hasError,
  errorMessage,
  onSelectPrompt,
  onRetry,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const lastMessage = messages[messages.length - 1];
  const showThinkingBubble = isLoading && lastMessage?.role !== "assistant";

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className="flex-1 overflow-y-auto px-4 py-4 space-y-2 text-[hsl(var(--foreground))]"
    >
      {/* Welcome Screen jika percakapan belum banyak */}
      {messages.length === 0 && (
        <div className="my-auto py-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-emerald-950 text-white shadow-md shadow-emerald-900/10 mb-3">
            <Sparkles className="h-7 w-7 text-[hsl(var(--accent))]" />
          </div>

          <h3 className="font-display text-base sm:text-lg font-bold text-[hsl(var(--primary))]">
            Tanya Al-Arqam AI
          </h3>
          <p className="mx-auto mt-1 max-w-xs text-xs text-[hsl(var(--muted-foreground))]">
            Pencarian Al-Qur&apos;an semantik, doa harian, tafsir, dan pusat informasi Masjid Jami&apos; Al-Arqam.
          </p>

          {/* Quick Prompts Starters */}
          <div className="mt-6 text-left">
            <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--primary))]">
              <Compass className="h-3.5 w-3.5" />
              <span>Pilihan Pertanyaan Populer:</span>
            </div>

            <div className="space-y-1.5">
              {QUICK_STARTERS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectPrompt(item.prompt)}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 p-2.5 text-left text-xs font-medium text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))]/30 hover:bg-emerald-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/30"
                  >
                    <Icon className="h-4 w-4 text-[hsl(var(--primary))] shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Render all messages */}
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}

      {/* Thinking indicator (before any assistant content has streamed in) */}
      {showThinkingBubble && (
        <div className="flex gap-2.5 mb-3 items-center">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-white">
            <Sparkles className="h-4 w-4 animate-spin text-[hsl(var(--accent))]" />
          </div>
          <div className="rounded-2xl rounded-tl-xs border border-emerald-900/10 bg-emerald-50/60 px-4 py-2.5 text-xs text-[hsl(var(--primary))] flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Sedang mencari ayat &amp; informasi yang relevan...</span>
          </div>
        </div>
      )}

      {/* Error + retry */}
      {hasError && (
        <div className="flex justify-center py-2">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-center">
            <p className="text-xs text-red-700">
              {errorMessage || "Afwan, terjadi kendala saat menghubungi asisten AI."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Coba lagi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
