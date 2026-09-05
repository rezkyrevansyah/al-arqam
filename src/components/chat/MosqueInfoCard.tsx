"use client";

import { useState } from "react";
import { Calendar, Check, Clock, Copy, ExternalLink, MapPin, QrCode, Wallet } from "lucide-react";
import type { MosqueInfoPayload } from "@/types/chat";
import { formatAgendaDateRange } from "@/utils/agenda";

interface MosqueInfoCardProps {
  info: MosqueInfoPayload;
}

export function MosqueInfoCard({ info }: MosqueInfoCardProps) {
  const [copiedBank, setCopiedBank] = useState(false);

  // 1. Prayer Times Card
  if (info.type === "prayer" && info.prayer) {
    const { subuh, dzuhur, ashar, maghrib, isya, gregorianDate, hijriDate, location } = info.prayer;
    const times = [
      { name: "Subuh", time: subuh },
      { name: "Dzuhur", time: dzuhur },
      { name: "Ashar", time: ashar },
      { name: "Maghrib", time: maghrib },
      { name: "Isya", time: isya },
    ];

    return (
      <div className="my-3 overflow-hidden rounded-2xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50/70 to-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
            <span className="text-xs font-bold text-emerald-950">
              Jadwal Sholat Hari Ini
            </span>
          </div>
          <span className="text-[10px] text-stone-500">{location}</span>
        </div>

        <div className="mt-2 text-[11px] text-stone-600">
          📅 {gregorianDate} {hijriDate ? `• ${hijriDate}` : ""}
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1.5 text-center">
          {times.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-emerald-900/10 bg-white/90 p-2 shadow-xs"
            >
              <div className="text-[10px] font-medium text-stone-500">
                {t.name}
              </div>
              <div className="text-xs font-bold text-emerald-950">
                {t.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Agenda & Kajian Card
  if (info.type === "agenda" && info.agenda) {
    return (
      <div className="my-3 overflow-hidden rounded-2xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50/60 to-white p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-emerald-900/10 pb-2 mb-3">
          <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
          <span className="text-xs font-bold text-emerald-950">
            Agenda Kegiatan Terdekat
          </span>
        </div>

        <div className="space-y-2.5">
          {info.agenda.map((ag, idx) => {
            const isOngoing = ag.status === "sedang_berlangsung";
            const dateStr = formatAgendaDateRange(ag.date, ag.endDate);

            return (
              <div
                key={ag.id || idx}
                className="rounded-xl border border-stone-200/80 bg-white/90 p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-stone-900">
                    {ag.title}
                  </h4>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold border ${
                      isOngoing
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {isOngoing ? "Sedang Berlangsung" : "Akan Datang"}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-stone-400" />
                    <span>{dateStr}</span>
                  </div>
                  {ag.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-stone-400" />
                      <span>{ag.time}</span>
                    </div>
                  )}
                  {ag.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-stone-400" />
                      <span>{ag.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Donation Card
  if (info.type === "donation" && info.donation) {
    const { bankName, bankAccountNumber, bankAccountName } = info.donation;

    const handleCopyRekening = async () => {
      try {
        await navigator.clipboard.writeText(bankAccountNumber);
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
      } catch {
        // Fallback
      }
    };

    return (
      <div className="my-3 overflow-hidden rounded-2xl border border-amber-900/15 bg-gradient-to-br from-amber-50/70 via-white to-white p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-amber-900/10 pb-2 mb-3">
          <Wallet className="h-4 w-4 text-amber-700" />
          <span className="text-xs font-bold text-amber-950">
            Rekening Infaq & Donasi Masjid
          </span>
        </div>

        <div className="rounded-xl border border-amber-800/20 bg-gradient-to-r from-emerald-900 to-emerald-950 p-3.5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-200">{bankName}</span>
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">
              Official Account
            </span>
          </div>

          <div className="my-2.5 flex items-center justify-between">
            <span className="font-mono text-base font-extrabold tracking-wider text-white">
              {bankAccountNumber}
            </span>
            <button
              type="button"
              onClick={handleCopyRekening}
              className="inline-flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-xs transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              title="Salin Nomor Rekening"
              aria-label="Salin nomor rekening"
            >
              {copiedBank ? (
                <>
                  <Check className="h-3 w-3 text-emerald-300" />
                  <span className="text-emerald-300 text-[10px]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="text-[10px]">Salin</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-emerald-100">
            Atas Nama: <span className="font-semibold text-white">{bankAccountName}</span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-stone-600">
          <QrCode className="h-3.5 w-3.5 text-amber-700" />
          <span>Tersedia juga scan QRIS di bagian bawah landing page website.</span>
        </div>
      </div>
    );
  }

  // 4. Location Card
  if (info.type === "location" && info.location) {
    return (
      <div className="my-3 overflow-hidden rounded-2xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50/60 to-white p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-emerald-900/10 pb-2 mb-2">
          <MapPin className="h-4 w-4 text-[hsl(var(--primary))]" />
          <span className="text-xs font-bold text-emerald-950">
            Lokasi Masjid Jami&apos; Al-Arqam
          </span>
        </div>

        <p className="text-xs leading-relaxed text-stone-700">
          {info.location.address}
        </p>

        <div className="mt-3 flex justify-end">
          <a
            href={info.location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[hsl(var(--primary))]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/50"
          >
            <span>Buka di Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return null;
}
