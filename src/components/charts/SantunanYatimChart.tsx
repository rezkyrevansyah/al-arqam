'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import type { SantunanYatimEntry } from '@/data/types';
import { FullscreenChart } from './FullscreenChart';

interface Props {
  entries: SantunanYatimEntry[];
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];
const PAGE_SIZE = 10;

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function rtLabel(rt: string) {
  if (!rt || rt === '-' || rt === '00') return 'Lainnya';
  return `RT ${rt}`;
}

export function SantunanYatimChart({ entries }: Props) {
  const [search, setSearch] = useState('');
  const [filterRt, setFilterRt] = useState('all');
  const [page, setPage] = useState(1);

  if (!entries.length) return null;

  const totalPaket = entries.reduce((s, e) => s + e.jumlahPaket, 0);
  const totalNominal = entries.reduce((s, e) => s + e.jumlahPaket * e.hargaPaket, 0);

  function isLainnya(rt: string) {
    return !rt || rt === '-' || rt === '00';
  }

  // Unique real RT keys (excludes Lainnya variants), sorted numerically
  const rtList = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    entries.forEach(e => {
      if (!isLainnya(e.rt) && !seen.has(e.rt)) { seen.add(e.rt); list.push(e.rt); }
    });
    return list.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [entries]);

  // Chart groups: real RTs + single merged Lainnya at the end
  const byRt = useMemo(() => {
    const realGroups = rtList.map((rt, i) => {
      const rtEntries = entries.filter(e => e.rt === rt);
      const paket = rtEntries.reduce((s, e) => s + e.jumlahPaket, 0);
      return { rt, label: rtLabel(rt), paket, donatur: rtEntries.length, color: COLORS[i % COLORS.length] };
    });
    const lainnyaEntries = entries.filter(e => isLainnya(e.rt));
    const lainnyaPaket = lainnyaEntries.reduce((s, e) => s + e.jumlahPaket, 0);
    if (lainnyaPaket > 0) {
      realGroups.push({ rt: '_lainnya', label: 'Lainnya', paket: lainnyaPaket, donatur: lainnyaEntries.length, color: '#94a3b8' });
    }
    return realGroups;
  }, [entries, rtList]);

  // Donor list with search + filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter(e => {
      const matchName = e.namaDonatur.toLowerCase().includes(q);
      const matchRt = filterRt === 'all' || (filterRt === '_lainnya' ? isLainnya(e.rt) : e.rt === filterRt);
      return matchName && matchRt;
    });
  }, [entries, search, filterRt]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageEntries = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(q: string) { setSearch(q); setPage(1); }
  function handleFilterRt(rt: string) { setFilterRt(rt); setPage(1); }

  function formatPaketLabel(value?: number, percent?: number) {
    if (value == null || percent == null || percent < 0.08) return '';
    return `${value}`;
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Donatur', value: `${entries.length} orang`, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Total Paket', value: `${totalPaket} paket`, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Total Nominal', value: formatIDR(totalNominal), color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'RT Berpartisipasi', value: `${rtList.length} RT`, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-[1.5rem] border ${stat.border} ${stat.bg} p-4 text-center shadow-sm`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            <p className={`mt-2 font-display text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FullscreenChart title="Jumlah Paket per RT">
          {(fs) => (
            <div className={`rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm ${fs ? 'h-full flex flex-col' : ''}`}>
              {!fs && <p className="mb-4 text-sm font-semibold">Jumlah Paket per RT</p>}
              <ResponsiveContainer width="100%" height={fs ? '100%' : 240}>
                <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} width={32} />
                  <Tooltip formatter={(v) => [`${v} paket`, 'Paket']} labelFormatter={l => l} />
                  <Bar dataKey="paket" radius={[6, 6, 0, 0]}>
                    {byRt.map((g) => <Cell key={g.rt} fill={g.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </FullscreenChart>

        <FullscreenChart title="Proporsi Paket per RT">
          {(fs) => (
            <div className={`rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm ${fs ? 'h-full flex flex-col' : ''}`}>
              {!fs && <p className="mb-1 text-sm font-semibold">Proporsi Paket per RT</p>}
              {!fs && <p className="mb-4 text-xs text-[hsl(var(--muted-foreground))]">Setiap irisan menunjukkan jumlah paket per RT.</p>}

              <div className={fs ? 'flex flex-1 flex-col' : 'space-y-4'}>
                <div className={`relative ${fs ? 'min-h-[420px] flex-1' : 'h-[260px]'}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={byRt}
                        dataKey="paket"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={fs ? 82 : 56}
                        outerRadius={fs ? 138 : 92}
                        paddingAngle={3}
                        stroke="rgba(255,255,255,0.92)"
                        strokeWidth={3}
                        label={({ value, percent }: { value?: number; percent?: number }) => formatPaketLabel(value, percent)}
                        labelLine={false}
                      >
                        {byRt.map((group) => (
                          <Cell key={group.rt} fill={group.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} paket`, 'Jumlah paket']} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/90 px-5 py-4 text-center shadow-sm ring-1 ring-black/5 backdrop-blur">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                        Total Paket
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-[hsl(var(--foreground))]">
                        {totalPaket}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {byRt.map((group) => (
                    <div
                      key={group.rt}
                      className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))]/60 bg-white/80 px-3 py-2 text-xs shadow-sm"
                    >
                      <span
                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="truncate font-medium text-[hsl(var(--foreground))]">{group.label}</span>
                      <span className="ml-auto tabular-nums text-[hsl(var(--muted-foreground))]">{group.paket}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </FullscreenChart>
      </div>

      {/* Donor list with search + filter + pagination */}
      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold">Daftar Donatur Santunan</p>

        {/* Search & Filter */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Cari nama donatur..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
          />
          <select
            value={filterRt}
            onChange={e => handleFilterRt(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 sm:w-40"
          >
            <option value="all">Semua RT</option>
            {rtList.map(rt => (
              <option key={rt} value={rt}>{rtLabel(rt)}</option>
            ))}
            <option value="_lainnya">Lainnya</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="pb-2 pr-4">No</th>
                <th className="pb-2 pr-4">Nama Donatur</th>
                <th className="pb-2 pr-4">RT</th>
                <th className="pb-2 pr-4 text-right">Paket</th>
                <th className="pb-2 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageEntries.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-gray-50/50">
                  <td className="py-2.5 pr-4 text-gray-400">{(safePage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="py-2.5 pr-4 font-medium text-gray-800">{entry.namaDonatur}</td>
                  <td className="py-2.5 pr-4 text-gray-500">{rtLabel(entry.rt)}</td>
                  <td className="py-2.5 pr-4 text-right">
                    <span className="inline-flex min-w-[3.75rem] items-center justify-center whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold leading-none text-amber-700">
                      <span className="tabular-nums">{entry.jumlahPaket}</span>
                      <span className="ml-1">pkt</span>
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-medium text-emerald-700">
                    {formatIDR(entry.jumlahPaket * entry.hargaPaket)}
                  </td>
                </tr>
              ))}
              {pageEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
                    Tidak ada donatur ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            {filtered.length > 0
              ? `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} dari ${filtered.length} donatur`
              : '0 donatur'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="px-3 text-xs">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
