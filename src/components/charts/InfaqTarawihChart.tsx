'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, LineChart, Line,
} from 'recharts';
import type { InfaqTarawihEntry } from '@/data/types';
import { FullscreenChart } from './FullscreenChart';

interface Props {
  entries: InfaqTarawihEntry[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

function shortFmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload as InfaqTarawihEntry & { saldo: number };
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-sm min-w-[180px]">
      <p className="font-semibold text-gray-900">Malam ke-{entry.malamKe}</p>
      <p className="text-gray-400 text-xs mb-2">{entry.tanggal}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-emerald-600 text-xs font-medium">Infaq Masuk</span>
          <span className="font-bold text-emerald-700">{fmt(entry.jumlah)}</span>
        </div>
        {entry.pengeluaran > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-red-500 text-xs font-medium">Pengeluaran</span>
            <span className="font-bold text-red-600">{fmt(entry.pengeluaran)}</span>
          </div>
        )}
        <div className="flex justify-between gap-4 border-t border-gray-100 pt-1">
          <span className="text-blue-600 text-xs font-medium">Saldo Malam Ini</span>
          <span className="font-bold text-blue-700">{fmt(entry.saldo)}</span>
        </div>
      </div>
      {entry.catatan && <p className="mt-2 text-xs text-gray-400 border-t border-gray-100 pt-1">{entry.catatan}</p>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SaldoTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-900">Malam ke-{d.malamKe}</p>
      <p className="text-xs text-gray-400 mb-1">{d.tanggal}</p>
      <p className="font-bold text-blue-700">{fmt(d.kumulatif)}</p>
    </div>
  );
}

export function InfaqTarawihChart({ entries }: Props) {
  if (!entries.length) return null;

  const totalInfaq = entries.reduce((s, e) => s + e.jumlah, 0);
  const totalPengeluaran = entries.reduce((s, e) => s + e.pengeluaran, 0);
  const saldoBersih = totalInfaq - totalPengeluaran;
  const avg = totalInfaq / entries.length;

  let kumulatif = 0;
  const data = entries.map(e => {
    kumulatif += e.jumlah - e.pengeluaran;
    return { ...e, saldo: e.jumlah - e.pengeluaran, kumulatif };
  });

  return (
    <div className="space-y-6">
      {/* Summary cards — 1 kolom di mobile, 3 kolom di sm+ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Total Infaq Masuk', value: fmt(totalInfaq), color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Total Pengeluaran', value: fmt(totalPengeluaran), color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100' },
          { label: 'Saldo Bersih', value: fmt(saldoBersih), color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-[1.5rem] border ${stat.border} ${stat.bg} p-4 text-center shadow-sm`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            <p className={`mt-2 font-display text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart 1: Grouped bar */}
      <FullscreenChart title="Infaq Masuk vs Pengeluaran Per Malam">
        {(fs) => (
          <div className={`rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm ${fs ? 'h-full flex flex-col' : ''}`}>
            {!fs && <p className="mb-4 text-sm font-semibold text-[hsl(var(--foreground))]">Infaq Masuk vs Pengeluaran Per Malam</p>}
            <ResponsiveContainer width="100%" height={fs ? '100%' : 300}>
              <BarChart data={data} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="malamKe" tickFormatter={v => `M${v}`} tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={shortFmt} tick={{ fontSize: 11 }} width={52} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={name => name === 'jumlah' ? 'Infaq Masuk' : 'Pengeluaran'} />
                <Bar dataKey="jumlah" name="jumlah" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" name="pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {!fs && (
              <p className="mt-2 text-center text-xs text-[hsl(var(--muted-foreground))]">
                Rata-rata infaq/malam: {fmt(avg)}
              </p>
            )}
          </div>
        )}
      </FullscreenChart>

      {/* Chart 2: Cumulative saldo line */}
      <FullscreenChart title="Akumulasi Saldo (Infaq − Pengeluaran)">
        {(fs) => (
          <div className={`rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm ${fs ? 'h-full flex flex-col' : ''}`}>
            {!fs && <p className="mb-4 text-sm font-semibold text-[hsl(var(--foreground))]">Akumulasi Saldo (Infaq − Pengeluaran)</p>}
            <ResponsiveContainer width="100%" height={fs ? '100%' : 220}>
              <LineChart data={data} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="malamKe" tickFormatter={v => `M${v}`} tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={shortFmt} tick={{ fontSize: 11 }} width={52} />
                <Tooltip content={<SaldoTooltip />} />
                <Line
                  type="monotone"
                  dataKey="kumulatif"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </FullscreenChart>
    </div>
  );
}
