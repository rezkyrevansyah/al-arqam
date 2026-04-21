'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { ZisEntry } from '@/data/types';
import { FullscreenChart } from './FullscreenChart';

interface Props {
  entries: ZisEntry[];
}

const ITEMS_PER_PAGE = 10;

function rtLabel(rt: string) {
  const m = rt.match(/^(\d+) \/ \d+$/);
  return m ? `RT ${m[1]}` : 'Lainnya';
}

function isLainnya(rt: string) {
  return !rt.match(/^(\d+) \/ \d+$/);
}

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatIDRShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

function berasDisplay(liter: number, kg: number) {
  const parts: string[] = [];
  if (liter > 0) parts.push(`${liter}L`);
  if (kg > 0) parts.push(`${kg}kg`);
  return parts.length ? parts.join(' + ') : '—';
}

export function ZisChart({ entries }: Props) {
  const [search, setSearch] = useState('');
  const [filterRt, setFilterRt] = useState('');
  const [page, setPage] = useState(1);

  const totalMuzakki = entries.length;
  const totalZakatFitrahJiwa = entries.reduce((s, e) => s + (e.zakatFitrahJiwa ?? 0), 0);
  const totalZakatFitrahUang = entries.reduce((s, e) => s + (e.zakatFitrahUang ?? 0), 0);
  const totalZakatFitrahBerasLiter = entries.reduce((s, e) => s + (e.zakatFitrahBerasLiter ?? 0), 0);
  const totalZakatFitrahBerasKg = entries.reduce((s, e) => s + (e.zakatFitrahBerasKg ?? 0), 0);
  const totalZakatMal = entries.reduce((s, e) => s + (e.zakatMal ?? 0), 0);
  const totalInfaqSedekah = entries.reduce((s, e) => s + (e.infaqSedekah ?? 0), 0);
  const totalFidyahJiwa = entries.reduce((s, e) => s + (e.fidyahJiwa ?? 0), 0);
  const totalFidyahRp = entries.reduce((s, e) => s + (e.fidyahRp ?? 0), 0);

  const rtList = useMemo(() => {
    const rts = new Set<string>();
    for (const e of entries) {
      if (!isLainnya(e.rt)) rts.add(e.rt);
    }
    return [...rts].sort((a, b) => parseInt(a) - parseInt(b));
  }, [entries]);

  const byRt = useMemo(() => {
    const groups = rtList.map(rt => {
      const rte = entries.filter(e => e.rt === rt);
      return {
        rt: rtLabel(rt),
        muzakki: rte.length,
        zakatFitrahUang: rte.reduce((s, e) => s + (e.zakatFitrahUang ?? 0), 0),
        zakatMal: rte.reduce((s, e) => s + (e.zakatMal ?? 0), 0),
        infaqSedekah: rte.reduce((s, e) => s + (e.infaqSedekah ?? 0), 0),
        fidyahRp: rte.reduce((s, e) => s + (e.fidyahRp ?? 0), 0),
        berasKg: rte.reduce((s, e) => s + (e.zakatFitrahBerasKg ?? 0), 0),
      };
    });
    const lainnyaEntries = entries.filter(e => isLainnya(e.rt));
    if (lainnyaEntries.length > 0) {
      groups.push({
        rt: 'Lainnya',
        muzakki: lainnyaEntries.length,
        zakatFitrahUang: lainnyaEntries.reduce((s, e) => s + (e.zakatFitrahUang ?? 0), 0),
        zakatMal: lainnyaEntries.reduce((s, e) => s + (e.zakatMal ?? 0), 0),
        infaqSedekah: lainnyaEntries.reduce((s, e) => s + (e.infaqSedekah ?? 0), 0),
        fidyahRp: lainnyaEntries.reduce((s, e) => s + (e.fidyahRp ?? 0), 0),
        berasKg: lainnyaEntries.reduce((s, e) => s + (e.zakatFitrahBerasKg ?? 0), 0),
      });
    }
    return groups;
  }, [entries, rtList]);

  const rtOptions = useMemo(() => [
    { value: '', label: 'Semua RT' },
    ...rtList.map(rt => ({ value: rt, label: rtLabel(rt) })),
    ...(entries.some(e => isLainnya(e.rt)) ? [{ value: '_lainnya', label: 'Lainnya' }] : []),
  ], [entries, rtList]);

  const filtered = useMemo(() => {
    let result = entries;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.namaMuzakki.toLowerCase().includes(q));
    }
    if (filterRt === '_lainnya') {
      result = result.filter(e => isLainnya(e.rt));
    } else if (filterRt) {
      result = result.filter(e => e.rt === filterRt);
    }
    return result;
  }, [entries, search, filterRt]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleFilter = (val: string) => { setFilterRt(val); setPage(1); };

  if (!entries.length) return null;

  return (
    <div className="space-y-6">
      {/* Summary cards – row 1 */}
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

      {/* Summary cards – row 2 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: 'Infaq / Shodaqoh', value: formatIDR(totalInfaqSedekah) },
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
      <FullscreenChart title="Jumlah Muzakki per RT">
        {(fullscreen) => (
          <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm h-full">
            <p className="mb-4 text-sm font-semibold">Jumlah Muzakki per RT</p>
            <ResponsiveContainer width="100%" height={fullscreen ? '85%' : 220}>
              <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="rt" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={32} />
                <Tooltip formatter={(v) => [`${v} orang`, 'Muzakki']} />
                <Bar dataKey="muzakki" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </FullscreenChart>

      {/* Perolehan ZIS per RT */}
      <FullscreenChart title="Perolehan ZIS per RT (Uang)">
        {(fullscreen) => (
          <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm h-full">
            <p className="mb-4 text-sm font-semibold">Perolehan ZIS per RT (Uang)</p>
            <ResponsiveContainer width="100%" height={fullscreen ? '85%' : 260}>
              <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="rt" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatIDRShort} tick={{ fontSize: 11 }} width={56} />
                <Tooltip formatter={(v) => [formatIDR(Number(v))]} />
                <Legend />
                <Bar dataKey="zakatFitrahUang" name="Zakat Fitrah" fill="#22c55e" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="zakatMal" name="Zakat Maal" fill="#6366f1" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="infaqSedekah" name="Infaq/Sedekah" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="fidyahRp" name="Fidyah" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </FullscreenChart>

      {/* Beras per RT */}
      <FullscreenChart title="Perolehan Beras per RT (kg)">
        {(fullscreen) => (
          <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm h-full">
            <p className="mb-4 text-sm font-semibold">Perolehan Beras per RT (kg)</p>
            <ResponsiveContainer width="100%" height={fullscreen ? '85%' : 220}>
              <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="rt" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={40} unit=" kg" />
                <Tooltip formatter={(v) => [`${Number(v).toFixed(1)} kg`, 'Beras']} />
                <Bar dataKey="berasKg" name="Beras (kg)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </FullscreenChart>

      {/* Muzakki list */}
      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold">Daftar Muzakki ({filtered.length} dari {totalMuzakki})</p>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Cari nama muzakki..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
          />
          <select
            value={filterRt}
            onChange={e => handleFilter(e.target.value)}
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
          >
            {rtOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]/60 text-left text-[hsl(var(--muted-foreground))]">
                <th className="pb-2 pr-3 font-semibold">No</th>
                <th className="pb-2 pr-3 font-semibold">Nama Muzakki</th>
                <th className="pb-2 pr-3 font-semibold">RT</th>
                <th className="pb-2 pr-3 text-right font-semibold">ZF Jiwa</th>
                <th className="pb-2 pr-3 text-right font-semibold">ZF Uang</th>
                <th className="pb-2 pr-3 text-right font-semibold">Beras</th>
                <th className="pb-2 pr-3 text-right font-semibold">Zakat Maal</th>
                <th className="pb-2 text-right font-semibold">Infaq</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((e, i) => (
                <tr key={e.id} className="border-b border-[hsl(var(--border))]/30 last:border-0">
                  <td className="py-2 pr-3 text-[hsl(var(--muted-foreground))]">
                    {(page - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>
                  <td className="py-2 pr-3 font-medium">{e.namaMuzakki}</td>
                  <td className="py-2 pr-3 text-[hsl(var(--muted-foreground))]">{rtLabel(e.rt)}</td>
                  <td className="py-2 pr-3 text-right">
                    {(e.zakatFitrahJiwa ?? 0) > 0 ? `${e.zakatFitrahJiwa} jiwa` : '—'}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {(e.zakatFitrahUang ?? 0) > 0 ? formatIDR(e.zakatFitrahUang) : '—'}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {berasDisplay(e.zakatFitrahBerasLiter ?? 0, e.zakatFitrahBerasKg ?? 0)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {(e.zakatMal ?? 0) > 0 ? formatIDR(e.zakatMal) : '—'}
                  </td>
                  <td className="py-2 text-right">
                    {(e.infaqSedekah ?? 0) > 0 ? formatIDR(e.infaqSedekah) : '—'}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-[hsl(var(--muted-foreground))]">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Hal {page} dari {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100"
              >
                ‹ Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
