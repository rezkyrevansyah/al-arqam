"use client";

import { Trophy } from "lucide-react";
import type { ChatEventProgramSummary } from "@/types/chat";

interface EventResultsCardProps {
  programs: ChatEventProgramSummary[];
}

export function EventResultsCard({ programs }: EventResultsCardProps) {
  if (programs.length === 0) {
    return (
      <p className="px-1 text-[11px] italic text-[hsl(var(--muted-foreground))]">
        Belum ada hasil lomba/event yang dipublikasikan.
      </p>
    );
  }

  return (
    <div className="my-3 space-y-3">
      {programs.map((program) => (
        <div
          key={program.title}
          className="overflow-hidden rounded-2xl border border-amber-900/15 bg-gradient-to-b from-amber-50/50 via-white to-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 border-b border-amber-900/10 pb-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--accent))]/15 text-amber-800">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-amber-950">
              {program.title} {program.yearLabel && `(${program.yearLabel})`}
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {program.categories.map((category) => (
              <div key={category.name}>
                <p className="mb-1 text-[11px] font-semibold text-stone-700">{category.name}</p>
                <div className="space-y-1">
                  {category.winners.map((winner, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-stone-200/60 bg-white/80 px-2.5 py-1.5 text-xs"
                    >
                      <span className="text-stone-500">{winner.rankLabel}</span>
                      <span className="font-semibold text-stone-900">{winner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
