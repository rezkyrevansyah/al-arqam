import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { SantunanYatimEntry } from '../../data/types';
import { useAdmin } from '../store/admin-store';
import { CurrencyInput } from './CurrencyInput';

interface Props {
  programId: string;
}

const RT_LIST = ['RT 001', 'RT 002', 'RT 003', 'RT 004', 'RT 005', 'RT 006', 'RT 007', 'RT 008'];

const emptyEntry = (programId: string): Omit<SantunanYatimEntry, 'id'> => ({
  programId,
  namaDonatur: '',
  rt: 'RT 001',
  jumlahPaket: 1,
  hargaPaket: 200000,
  catatan: '',
});

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export function SantunanYatimSection({ programId }: Props) {
  const { santunanEntries, loadProgramEntries, addSantunanEntry, updateSantunanEntry, deleteSantunanEntry, isSaving } = useAdmin();
  const [form, setForm] = useState(emptyEntry(programId));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SantunanYatimEntry | null>(null);

  useEffect(() => {
    loadProgramEntries(programId, 'santunan_yatim');
    setForm(emptyEntry(programId));
  }, [programId, loadProgramEntries]);

  const totalPaket = santunanEntries.reduce((s, e) => s + e.jumlahPaket, 0);
  const totalNominal = santunanEntries.reduce((s, e) => s + e.jumlahPaket * e.hargaPaket, 0);

  // Group by RT for summary
  const byRt = RT_LIST.map(rt => ({
    rt,
    entries: santunanEntries.filter(e => e.rt === rt),
    paket: santunanEntries.filter(e => e.rt === rt).reduce((s, e) => s + e.jumlahPaket, 0),
  })).filter(g => g.entries.length > 0);

  async function handleAdd() {
    if (!form.namaDonatur.trim()) return;
    await addSantunanEntry(form);
    setForm(prev => ({ ...prev, namaDonatur: '', jumlahPaket: 1, catatan: '' }));
  }

  async function handleSaveEdit() {
    if (!editForm) return;
    await updateSantunanEntry(editForm);
    setEditingId(null);
    setEditForm(null);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Santunan Anak Yatim</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">Data Donatur Santunan</h3>
          <p className="mt-1 text-xs text-gray-500">1 paket = {formatIDR(200000)} · RW 024</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-xs text-gray-500">Total Paket</p>
            <p className="text-lg font-bold text-amber-600">{totalPaket} paket</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Nominal</p>
            <p className="text-lg font-bold text-emerald-700">{formatIDR(totalNominal)}</p>
          </div>
        </div>
      </div>

      {/* Add form */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 mb-6">
        <p className="mb-3 text-xs font-semibold text-amber-700 uppercase tracking-wide">Tambah Donatur</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Nama Donatur</label>
            <input
              value={form.namaDonatur}
              onChange={e => setForm(prev => ({ ...prev, namaDonatur: e.target.value }))}
              placeholder="Nama lengkap donatur"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">RT</label>
            <select
              value={form.rt}
              onChange={e => setForm(prev => ({ ...prev, rt: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            >
              {RT_LIST.map(rt => <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Jumlah Paket</label>
            <input
              type="number"
              value={form.jumlahPaket}
              min={1}
              onChange={e => setForm(prev => ({ ...prev, jumlahPaket: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Harga/Paket</label>
            <CurrencyInput
              value={form.hargaPaket}
              onChange={val => setForm(prev => ({ ...prev, hargaPaket: val }))}
              prefix="Rp"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Catatan</label>
            <input
              value={form.catatan}
              onChange={e => setForm(prev => ({ ...prev, catatan: e.target.value }))}
              placeholder="Opsional"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={isSaving || !form.namaDonatur.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </button>
          {form.jumlahPaket > 0 && (
            <span className="text-sm text-gray-600">= {formatIDR(form.jumlahPaket * form.hargaPaket)}</span>
          )}
        </div>
      </div>

      {/* RT Summary */}
      {byRt.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {byRt.map(g => (
            <div key={g.rt} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
              <p className="text-xs font-semibold text-gray-500">{g.rt}</p>
              <p className="mt-1 text-xl font-bold text-gray-800">{g.paket}</p>
              <p className="text-xs text-gray-400">paket · {g.entries.length} donatur</p>
            </div>
          ))}
        </div>
      )}

      {/* Entries table */}
      {santunanEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="pb-3 pr-4">Nama Donatur</th>
                <th className="pb-3 pr-4">RT</th>
                <th className="pb-3 pr-4">Paket</th>
                <th className="pb-3 pr-4">Nominal</th>
                <th className="pb-3 pr-4">Catatan</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {santunanEntries.map(entry => (
                <tr key={entry.id}>
                  {editingId === entry.id && editForm ? (
                    <>
                      <td className="py-2 pr-4">
                        <input value={editForm.namaDonatur}
                          onChange={e => setEditForm(prev => prev ? { ...prev, namaDonatur: e.target.value } : prev)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm" />
                      </td>
                      <td className="py-2 pr-4">
                        <select value={editForm.rt}
                          onChange={e => setEditForm(prev => prev ? { ...prev, rt: e.target.value } : prev)}
                          className="rounded border border-gray-200 px-2 py-1 text-sm">
                          {RT_LIST.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                        </select>
                      </td>
                      <td className="py-2 pr-4">
                        <input type="number" min={1} value={editForm.jumlahPaket}
                          onChange={e => setEditForm(prev => prev ? { ...prev, jumlahPaket: Number(e.target.value) } : prev)}
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-sm" />
                      </td>
                      <td className="py-2 pr-4">
                        <CurrencyInput value={editForm.hargaPaket}
                          onChange={val => setEditForm(prev => prev ? { ...prev, hargaPaket: val } : prev)}
                          prefix="Rp" className="w-36" />
                      </td>
                      <td className="py-2 pr-4">
                        <input value={editForm.catatan}
                          onChange={e => setEditForm(prev => prev ? { ...prev, catatan: e.target.value } : prev)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm" />
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={handleSaveEdit} disabled={isSaving} className="mr-2 rounded bg-emerald-600 p-1 text-white">
                          <Save className="h-3 w-3" />
                        </button>
                        <button onClick={() => { setEditingId(null); setEditForm(null); }} className="rounded border px-2 py-1 text-xs text-gray-500">Batal</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-4 font-medium">{entry.namaDonatur}</td>
                      <td className="py-3 pr-4"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{entry.rt}</span></td>
                      <td className="py-3 pr-4">{entry.jumlahPaket} paket</td>
                      <td className="py-3 pr-4 font-semibold text-emerald-700">{formatIDR(entry.jumlahPaket * entry.hargaPaket)}</td>
                      <td className="py-3 pr-4 text-gray-500">{entry.catatan || '-'}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => { setEditingId(entry.id); setEditForm(entry); }}
                          className="mr-2 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
                        <button onClick={() => { if (confirm('Hapus data ini?')) deleteSantunanEntry(entry.id); }}
                          disabled={isSaving} className="rounded border border-red-100 p-1 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 font-semibold">
                <td colSpan={2} className="pt-3 text-gray-500">Total ({santunanEntries.length} donatur)</td>
                <td className="pt-3">{totalPaket} paket</td>
                <td className="pt-3 text-emerald-700">{formatIDR(totalNominal)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
          Belum ada data donatur santunan. Tambahkan di atas.
        </div>
      )}
    </div>
  );
}
