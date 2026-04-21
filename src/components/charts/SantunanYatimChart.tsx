'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { SantunanYatimEntry } from '@/data/types';

interface Props {
  entries: SantunanYatimEntry[];
}

const RT_LIST = ['RT 001', 'RT 002', 'RT 003', 'RT 004', 'RT 005', 'RT 006', 'RT 007', 'RT 008'];
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export function SantunanYatimChart({ entries }: Props) {
  if (!entries.length) return null;

  const totalPaket = entries.reduce((s, e) => s + e.jumlahPaket, 0);
  const totalNominal = entries.reduce((s, e) => s + e.jumlahPaket * e.hargaPaket, 0);

  const byRt = RT_LIST.map((rt, i) => {
    const rtEntries = entries.filter(e => e.rt === rt);
    const paket = rtEntries.reduce((s, e) => s + e.jumlahPaket, 0);
    return { rt, paket, donatur: rtEntries.length, color: COLORS[i % COLORS.length] };
  }).filter(g => g.paket > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Donatur', value: `${entries.length} orang`, color: 'text-indigo-700' },
          { label: 'Total Paket', value: `${totalPaket} paket`, color: 'text-amber-700' },
          { label: 'Total Nominal', value: formatIDR(totalNominal), color: 'text-emerald-700' },
          { label: 'RT Berpartisipasi', value: `${byRt.length} RT`, color: 'text-blue-700' },
        ].map(stat => (
          <div key={stat.label} className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-4 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            <p className={`mt-2 font-display text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold">Jumlah Paket per RT</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="rt" tickFormatter={v => v.replace('RT ', 'RT')} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={32} />
              <Tooltip formatter={(v) => [`${v} paket`, 'Paket']} />
              <Bar dataKey="paket" radius={[6, 6, 0, 0]}>
                {byRt.map((g) => <Cell key={g.rt} fill={g.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold">Proporsi Paket per RT</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byRt} dataKey="paket" nameKey="rt" cx="50%" cy="50%" outerRadius={90}
                label={({ name, value }: { name?: string; value?: number }) => name && value != null ? `${name.replace('RT ', 'RT')}: ${value}` : ''} labelLine={false}>
                {byRt.map((g) => <Cell key={g.rt} fill={g.color} />)}
              </Pie>
              <Legend formatter={v => v} />
              <Tooltip formatter={(v) => [`${v} paket`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donor list */}
      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold">Daftar Donatur Santunan</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))]/50 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium">{entry.namaDonatur}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{entry.rt}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                {entry.jumlahPaket} pkt
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
