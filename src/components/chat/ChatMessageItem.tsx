"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { AlArqamUIMessage } from "@/types/chat";
import { AyatCard } from "./AyatCard";
import { DoaCard } from "./DoaCard";
import { TafsirAccordion } from "./TafsirAccordion";
import { MosqueInfoCard } from "./MosqueInfoCard";
import { QurbanInfoCard } from "./QurbanInfoCard";
import { EventResultsCard } from "./EventResultsCard";
import { ChatMarkdown } from "./ChatMarkdown";

interface ChatMessageItemProps {
  message: AlArqamUIMessage;
}

interface ToolPartLike<TOutput> {
  state: string;
  output?: TOutput;
  errorText?: string;
}

function renderToolState<TOutput>(
  part: ToolPartLike<TOutput>,
  loadingLabel: string,
  onOutput: (output: TOutput) => ReactNode
): ReactNode {
  if (part.state === "output-error") {
    return (
      <p className="px-1 text-[11px] italic text-red-600">Gagal mengambil data: {part.errorText}</p>
    );
  }
  if (part.state === "output-available" && part.output !== undefined) {
    return onOutput(part.output);
  }
  return (
    <div className="flex items-center gap-2 px-1 text-[11px] text-[hsl(var(--muted-foreground))]">
      <Sparkles className="h-3 w-3 animate-pulse" />
      <span>{loadingLabel}</span>
    </div>
  );
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";

  const textContent = message.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[hsl(var(--primary))] px-4 py-2.5 text-xs sm:text-sm text-white shadow-xs">
          <p className="whitespace-pre-wrap leading-relaxed">{textContent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-emerald-900 text-white shadow-xs">
        <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
      </div>

      <div className="max-w-[90%] flex-1 space-y-2">
        {textContent && (
          <div className="rounded-2xl rounded-tl-xs border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3.5 leading-relaxed text-[hsl(var(--foreground))] shadow-xs">
            <ChatMarkdown content={textContent} />
          </div>
        )}

        {message.parts.map((part, index) => {
          switch (part.type) {
            case "tool-searchQuran":
              return (
                <div key={index}>
                  {renderToolState(part, "Mencari ayat & doa...", (output) => (
                    <div className="space-y-2">
                      {output.results.map((item, i) => {
                        if (item.tipe === "ayat") {
                          return <AyatCard key={`ayat-${i}`} ayat={item.data} skor={item.skor} />;
                        }
                        if (item.tipe === "doa") {
                          return <DoaCard key={`doa-${i}`} doa={item.data} skor={item.skor} />;
                        }
                        if (item.tipe === "tafsir") {
                          return <TafsirAccordion key={`tafsir-${i}`} tafsir={item.data} skor={item.skor} />;
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              );

            case "tool-getPrayerTimes":
              return (
                <div key={index}>
                  {renderToolState(part, "Mengambil jadwal sholat...", (output) =>
                    "error" in output ? null : (
                      <MosqueInfoCard info={{ type: "prayer", prayer: output }} />
                    )
                  )}
                </div>
              );

            case "tool-getAgendaInfo":
              return (
                <div key={index}>
                  {renderToolState(part, "Mengambil agenda...", (output) => (
                    <MosqueInfoCard info={{ type: "agenda", agenda: output.agenda }} />
                  ))}
                </div>
              );

            case "tool-getDonationInfo":
              return (
                <div key={index}>
                  {renderToolState(part, "Mengambil info donasi...", (output) => (
                    <MosqueInfoCard info={{ type: "donation", donation: output }} />
                  ))}
                </div>
              );

            case "tool-getLocationInfo":
              return (
                <div key={index}>
                  {renderToolState(part, "Mengambil lokasi masjid...", (output) => (
                    <MosqueInfoCard info={{ type: "location", location: output }} />
                  ))}
                </div>
              );

            case "tool-getQurbanInfo":
              return (
                <div key={index}>
                  {renderToolState(part, "Mengambil info qurban...", (output) => (
                    <QurbanInfoCard config={output} />
                  ))}
                </div>
              );

            case "tool-getEventResults":
              return (
                <div key={index}>
                  {renderToolState(part, "Mengambil hasil lomba...", (output) => (
                    <EventResultsCard programs={output.programs} />
                  ))}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
