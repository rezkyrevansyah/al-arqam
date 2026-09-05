"use client";

import { useState } from "react";
import { Check, Copy, HeartHandshake, MessageCircle } from "lucide-react";
import type { QurbanConfig } from "@/data/types";
import { formatRupiah, toWhatsAppLink } from "@/data/qurban";

interface QurbanInfoCardProps {
  config: QurbanConfig;
}

export function QurbanInfoCard({ config }: QurbanInfoCardProps) {
  const [copied, setCopied] = useState(false);
  const primaryContact = config.contacts[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(config.bankAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silently
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-emerald-900/15 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-emerald-900/10 pb-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
          <HeartHandshake className="h-4 w-4" />
        </div>
        <span className="text-xs font-semibold text-emerald-900">
          Qurban {config.yearLabel}
        </span>
      </div>

      {config.pricingTiers.length > 0 && (
        <div className="my-3 space-y-1.5">
          {config.pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${
                tier.highlight
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "border border-stone-200/70 bg-white/80 text-stone-700"
              }`}
            >
              <span className="font-medium">{tier.label}</span>
              <span className="font-bold">{formatRupiah(tier.price)}</span>
            </div>
          ))}
        </div>
      )}

      {config.bankAccountNumber && (
        <div className="rounded-xl border border-stone-200/60 bg-white/80 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500">
              {config.bankName} &middot; a.n. {config.bankAccountName}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 font-medium text-emerald-800 transition hover:bg-emerald-100/70"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
          <p className="mt-1 font-mono text-sm font-bold text-stone-900">
            {config.bankAccountNumber}
          </p>
        </div>
      )}

      {primaryContact && (
        <a
          href={toWhatsAppLink(
            primaryContact.phone,
            "Assalamualaikum, saya ingin mendaftar Qurban di Masjid Al-Arqam Bekasi Utara"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-green-700 transition hover:bg-green-100/70"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Hubungi {primaryContact.name} via WhatsApp</span>
        </a>
      )}
    </div>
  );
}
