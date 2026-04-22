'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ZisEntry } from '@/data/types';

import { FullscreenChart } from './FullscreenChart';

interface Props {
  entries: ZisEntry[];
  showMuzakkiList?: boolean;
}

interface SummaryCard {
  label: string;
  value: string;
  sub: string;
  className: string;
  labelClassName?: string;
  valueClassName?: string;
  subClassName?: string;
}

const ITEMS_PER_PAGE = 10;

function rtLabel(rt: string) {
  const match = rt.match(/^(\d+) \/ \d+$/);
  return match ? `RT ${match[1]}` : 'Lainnya';
}

function isLainnya(rt: string) {
  return !rt.match(/^(\d+) \/ \d+$/);
}

function formatIDR(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatIDRShort(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(value);
}

function berasDisplay(liter: number, kg: number) {
  const parts: string[] = [];
  if (liter > 0) parts.push(`${liter}L`);
  if (kg > 0) parts.push(`${kg}kg`);
  return parts.length ? parts.join(' + ') : '-';
}

export function ZisChart({ entries, showMuzakkiList = true }: Props) {
  const [search, setSearch] = useState('');
  const [filterRt, setFilterRt] = useState('');
  const [page, setPage] = useState(1);

  const totalMuzakki = entries.length;
  const totalZakatFitrahJiwa = entries.reduce((sum, entry) => sum + (entry.zakatFitrahJiwa ?? 0), 0);
  const totalZakatFitrahUang = entries.reduce((sum, entry) => sum + (entry.zakatFitrahUang ?? 0), 0);
  const totalZakatFitrahBerasLiter = entries.reduce((sum, entry) => sum + (entry.zakatFitrahBerasLiter ?? 0), 0);
  const totalZakatFitrahBerasKg = entries.reduce((sum, entry) => sum + (entry.zakatFitrahBerasKg ?? 0), 0);
  const totalZakatMal = entries.reduce((sum, entry) => sum + (entry.zakatMal ?? 0), 0);
  const totalInfaqSedekah = entries.reduce((sum, entry) => sum + (entry.infaqSedekah ?? 0), 0);
  const totalFidyahJiwa = entries.reduce((sum, entry) => sum + (entry.fidyahJiwa ?? 0), 0);
  const totalFidyahRp = entries.reduce((sum, entry) => sum + (entry.fidyahRp ?? 0), 0);
  const rtList = useMemo(() => {
    const unique = new Set<string>();

    for (const entry of entries) {
      if (!isLainnya(entry.rt)) unique.add(entry.rt);
    }

    return [...unique].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [entries]);

  const byRt = useMemo(() => {
    const groups = rtList.map((rt) => {
      const rtEntries = entries.filter((entry) => entry.rt === rt);

      return {
        label: rtLabel(rt),
        muzakki: rtEntries.length,
        zakatFitrahUang: rtEntries.reduce((sum, entry) => sum + (entry.zakatFitrahUang ?? 0), 0),
        zakatMal: rtEntries.reduce((sum, entry) => sum + (entry.zakatMal ?? 0), 0),
        infaqSedekah: rtEntries.reduce((sum, entry) => sum + (entry.infaqSedekah ?? 0), 0),
        fidyahRp: rtEntries.reduce((sum, entry) => sum + (entry.fidyahRp ?? 0), 0),
        berasKg: rtEntries.reduce((sum, entry) => sum + (entry.zakatFitrahBerasKg ?? 0), 0),
      };
    });

    const lainnyaEntries = entries.filter((entry) => isLainnya(entry.rt));
    if (lainnyaEntries.length > 0) {
      groups.push({
        label: 'Lainnya',
        muzakki: lainnyaEntries.length,
        zakatFitrahUang: lainnyaEntries.reduce((sum, entry) => sum + (entry.zakatFitrahUang ?? 0), 0),
        zakatMal: lainnyaEntries.reduce((sum, entry) => sum + (entry.zakatMal ?? 0), 0),
        infaqSedekah: lainnyaEntries.reduce((sum, entry) => sum + (entry.infaqSedekah ?? 0), 0),
        fidyahRp: lainnyaEntries.reduce((sum, entry) => sum + (entry.fidyahRp ?? 0), 0),
        berasKg: lainnyaEntries.reduce((sum, entry) => sum + (entry.zakatFitrahBerasKg ?? 0), 0),
      });
    }

    return groups;
  }, [entries, rtList]);

  const rtOptions = useMemo(
    () => [
      { value: '', label: 'Semua RT' },
      ...rtList.map((rt) => ({ value: rt, label: rtLabel(rt) })),
      ...(entries.some((entry) => isLainnya(entry.rt)) ? [{ value: '_lainnya', label: 'Lainnya' }] : []),
    ],
    [entries, rtList]
  );

  const filtered = useMemo(() => {
    let result = entries;

    if (search) {
      const query = search.toLowerCase();
      result = result.filter((entry) => entry.namaMuzakki.toLowerCase().includes(query));
    }

    if (filterRt === '_lainnya') {
      result = result.filter((entry) => isLainnya(entry.rt));
    } else if (filterRt) {
      result = result.filter((entry) => entry.rt === filterRt);
    }

    return result;
  }, [entries, search, filterRt]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const summaryCards: SummaryCard[] = [
    {
      label: 'Muzakki',
      value: `${totalMuzakki} orang`,
      sub: 'Muzakki tercatat',
      className: 'min-h-[132px]',
    },
    {
      label: 'Zakat Fitrah (Jiwa)',
      value: `${totalZakatFitrahJiwa} jiwa`,
      sub: 'Total zakat per jiwa yang terkumpul',
      className: 'min-h-[132px]',
    },
    {
      label: 'Zakat Fitrah (Uang)',
      value: formatIDR(totalZakatFitrahUang),
      sub: 'Penerimaan zakat fitrah tunai',
      className: 'min-h-[132px] sm:col-span-2 lg:col-span-2',
    },
    {
      label: 'Zakat Fitrah (Beras)',
      value: `${totalZakatFitrahBerasKg.toFixed(1)} kg`,
      sub: `~ ${totalZakatFitrahBerasLiter.toFixed(1)} liter`,
      className: 'min-h-[132px]',
    },
    {
      label: 'Zakat Maal',
      value: formatIDR(totalZakatMal),
      sub: 'Penerimaan zakat maal',
      className: 'min-h-[132px]',
    },
    {
      label: 'Infaq / Shodaqoh',
      value: formatIDR(totalInfaqSedekah),
      sub: 'Infaq dan shodaqoh terkumpul',
      className: 'min-h-[132px]',
    },
    {
      label: 'Fidyah',
      value: `${totalFidyahJiwa} jiwa - ${formatIDR(totalFidyahRp)}`,
      sub: 'Fidyah tercatat dalam program ini',
      className: 'min-h-[132px] sm:col-span-2',
      valueClassName: 'text-[hsl(var(--foreground))] text-[1.35rem] sm:text-[1.75rem]',
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = (value: string) => {
    setFilterRt(value);
    setPage(1);
  };

  if (!entries.length) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`flex flex-col justify-between rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-4 shadow-sm ${card.className}`}
          >
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${card.labelClassName ?? 'text-[hsl(var(--muted-foreground))]'}`}>
                {card.label}
              </p>
              <p className={`mt-3 font-display text-[1.6rem] font-bold leading-tight sm:text-[1.95rem] ${card.valueClassName ?? 'text-[hsl(var(--foreground))]'}`}>
                {card.value}
              </p>
            </div>
            <p className={`mt-3 text-xs leading-relaxed ${card.subClassName ?? 'text-[hsl(var(--muted-foreground))]'}`}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <FullscreenChart title="Jumlah Muzakki per RT">
        {(fullscreen) => (
          <div className="h-full rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold">Jumlah Muzakki per RT</p>
            <ResponsiveContainer width="100%" height={fullscreen ? '85%' : 220}>
              <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={32} />
                <Tooltip formatter={(value) => [`${value} orang`, 'Muzakki']} />
                <Bar dataKey="muzakki" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </FullscreenChart>

      <FullscreenChart title="Perolehan ZIS per RT (Uang)">
        {(fullscreen) => (
          <div className="h-full rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold">Perolehan ZIS per RT (Uang)</p>
            <ResponsiveContainer width="100%" height={fullscreen ? '85%' : 260}>
              <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatIDRShort} tick={{ fontSize: 11 }} width={56} />
                <Tooltip formatter={(value) => [formatIDR(Number(value))]} />
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

      <FullscreenChart title="Perolehan Beras per RT (kg)">
        {(fullscreen) => (
          <div className="h-full rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold">Perolehan Beras per RT (kg)</p>
            <ResponsiveContainer width="100%" height={fullscreen ? '85%' : 220}>
              <BarChart data={byRt} margin={{ top: 4, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={40} unit=" kg" />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} kg`, 'Beras']} />
                <Bar dataKey="berasKg" name="Beras (kg)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </FullscreenChart>

      {showMuzakkiList && (
        <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/70 bg-white/75 p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold">Daftar Muzakki ({filtered.length} dari {totalMuzakki})</p>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Cari nama muzakki..."
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
            />
            <select
              value={filterRt}
              onChange={(event) => handleFilter(event.target.value)}
              className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
            >
              {rtOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
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
                {paginated.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-[hsl(var(--border))]/30 last:border-0">
                    <td className="py-2 pr-3 text-[hsl(var(--muted-foreground))]">
                      {(page - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="py-2 pr-3 font-medium">{entry.namaMuzakki}</td>
                    <td className="py-2 pr-3 text-[hsl(var(--muted-foreground))]">{rtLabel(entry.rt)}</td>
                    <td className="py-2 pr-3 text-right">
                      {(entry.zakatFitrahJiwa ?? 0) > 0 ? `${entry.zakatFitrahJiwa} jiwa` : '-'}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {(entry.zakatFitrahUang ?? 0) > 0 ? formatIDR(entry.zakatFitrahUang) : '-'}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {berasDisplay(entry.zakatFitrahBerasLiter ?? 0, entry.zakatFitrahBerasKg ?? 0)}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {(entry.zakatMal ?? 0) > 0 ? formatIDR(entry.zakatMal) : '-'}
                    </td>
                    <td className="py-2 text-right">
                      {(entry.infaqSedekah ?? 0) > 0 ? formatIDR(entry.infaqSedekah) : '-'}
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
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
