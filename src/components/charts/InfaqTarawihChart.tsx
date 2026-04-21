'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { InfaqTarawihEntry } from '@/data/types';

interface Props {
  entries: InfaqTarawihEntry[];
}

function formatIDR(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload as InfaqTarawihEntry;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-900">Malam ke-{entry.malamKe}</p>
      <p className="text-gray-500 text-xs">{entry.tanggal}</p>
      <p className="mt-1 font-bold text-emerald-700">
        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(entry.jumlah)}
      </p>
      {entry.catatan && <p className="mt-1 text-xs text-gray-400">{entry.catatan}</p>}
    </div>
  );
}

export function InfaqTarawihChart({ entries }: Props) {
  if (!entries.length) return null;

  const total = entries.reduce((s, e) => s + e.jumlah, 0);
  const avg = total / entries.length;
  const max = Math.max(...entries.map(e => e.jumlah));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Infaq', value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(total), color: 'text-emerald-700' },
          { label: 'Rata-rata/Malam', value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(avg), color: 'text-blue-700' },
          { label: 'Tertinggi', value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(max), color: 'text-amber-700' },
        ].map(stat => (
          <div key={stat.label} className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-4 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            <p className={`mt-2 font-display text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-[hsl(var(--foreground))]">Infaq Per Malam Tarawih</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={entries} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="malamKe" tickFormatter={v => `M${v}`} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatIDR} tick={{ fontSize: 11 }} width={52} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
              {entries.map((entry) => (
                <Cell key={entry.id} fill={entry.jumlah >= avg ? '#059669' : '#6ee7b7'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-2 text-center text-xs text-[hsl(var(--muted-foreground))]">Warna hijau tua = di atas rata-rata</p>
      </div>
    </div>
  );
}
