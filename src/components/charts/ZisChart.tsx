'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ZisEntry } from '@/data/types';

interface Props {
  entries: ZisEntry[];
}

const RT_LIST = ['RT 001', 'RT 002', 'RT 003', 'RT 004', 'RT 005', 'RT 006', 'RT 007', 'RT 008'];

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatIDRShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

export function ZisChart({ entries }: Props) {
  if (!entries.length) return null;

  const totalMuzakki = entries.length;
  const totalZakatFitrahUang = entries.reduce((s, e) => s + e.zakatFitrahUang, 0);
  const totalZakatFitrahBerasKg = entries.reduce((s, e) => s + e.zakatFitrahBerasKg, 0);
  const totalZakatFitrahBerasLiter = entries.reduce((s, e) => s + e.zakatFitrahBerasLiter, 0);
  const totalZakatMal = entries.reduce((s, e) => s + e.zakatMal, 0);
  const totalInfaqSedekah = entries.reduce((s, e) => s + e.infaqSedekah, 0);
  const totalFidyahRp = entries.reduce((s, e) => s + e.fidyahRp, 0);
  const totalFidyahJiwa = entries.reduce((s, e) => s + e.fidyahJiwa, 0);
  const totalZakatFitrahJiwa = entries.reduce((s, e) => s + e.zakatFitrahJiwa, 0);

  const byRt = RT_LIST.map(rt => {
    const rtEntries = entries.filter(e => e.rt === rt);
    return {
      rt: rt.replace('RT ', 'RT'),
      muzakki: rtEntries.length,
      zakatFitrahUang: rtEntries.reduce((s, e) => s + e.zakatFitrahUang, 0),
      zakatMal: rtEntries.reduce((s, e) => s + e.zakatMal, 0),
      infaqSedekah: rtEntries.reduce((s, e) => s + e.infaqSedekah, 0),
      fidyahRp: rtEntries.reduce((s, e) => s + e.fidyahRp, 0),
      berasKg: rtEntries.reduce((s, e) => s + e.zakatFitrahBerasKg, 0),
    };
  }).filter(g => g.muzakki > 0);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Muzakki', value: `${totalMuzakki} orang`, sub: `${totalZakatFitrahJiwa} jiwa zakat fitrah` },
          { label: 'Zakat Fitrah (Uang)', value: formatIDR(totalZakatFitrahUang), sub: '' },
          { label: 'Zakat Fitrah (Beras)', value: `${totalZakatFitrahBerasKg.toFixed(1)} kg`, sub: `≈ ${totalZakatFitrahBerasLiter.toFixed(1)} liter` },
          { label: 'Zakat Maal', value: formatIDR(totalZakatMal), sub: '' },
        ].map(stat => (
          <div key={stat.label} className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            <p className="mt-2 font-display text-xl font-bold text-[hsl(var(--foreground))]">{stat.value}</p>
            {stat.sub && <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: 'Infaq/Sedekah', value: formatIDR(totalInfaqSedekah) },
          { label: 'Fidyah', value: `${totalFidyahJiwa} jiwa · ${formatIDR(totalFidyahRp)}` },
          { label: 'Total Penerimaan', value: formatIDR(totalZakatFitrahUang + totalZakatMal + totalInfaqSedekah + totalFidyahRp) },
        ].map(stat => (
          <div key={stat.label} className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            <p className="mt-2 font-display text-xl font-bold text-[hsl(var(--primary))]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Muzakki per RT */}
      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold">Jumlah Muzakki per RT</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="rt" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={32} />
            <Tooltip formatter={(v) => [`${v} orang`, 'Muzakki']} />
            <Bar dataKey="muzakki" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Perolehan per RT */}
      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold">Perolehan ZIS per RT (Uang)</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="rt" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatIDRShort} tick={{ fontSize: 11 }} width={56} />
            <Tooltip formatter={(v) => [formatIDR(Number(v))]} />
            <Legend />
            <Bar dataKey="zakatFitrahUang" name="Zakat Fitrah" fill="#22c55e" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="zakatMal" name="Zakat Maal" fill="#6366f1" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="infaqSedekah" name="Infaq/Sedekah" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="fidyahRp" name="Fidyah" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Beras per RT */}
      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold">Perolehan Beras per RT (kg)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="rt" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} unit=" kg" />
            <Tooltip formatter={(v) => [`${Number(v).toFixed(1)} kg`, 'Beras']} />
            <Bar dataKey="berasKg" name="Beras (kg)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
