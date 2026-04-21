import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { InfaqTarawihEntry } from '../../data/types';
import { useAdmin } from '../store/admin-store';
import { CurrencyInput } from './CurrencyInput';

interface Props {
  programId: string;
}

const emptyEntry = (programId: string): Omit<InfaqTarawihEntry, 'id'> => ({
  programId,
  malamKe: 1,
  tanggal: new Date().toISOString().slice(0, 10),
  jumlah: 0,
  catatan: '',
});

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export function InfaqTarawihSection({ programId }: Props) {
  const { infaqEntries, loadProgramEntries, addInfaqEntry, updateInfaqEntry, deleteInfaqEntry, isSaving } = useAdmin();
  const [form, setForm] = useState(emptyEntry(programId));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InfaqTarawihEntry | null>(null);

  useEffect(() => {
    loadProgramEntries(programId, 'infaq_tarawih');
    setForm(emptyEntry(programId));
  }, [programId, loadProgramEntries]);

  const totalInfaq = infaqEntries.reduce((sum, e) => sum + e.jumlah, 0);

  async function handleAdd() {
    if (!form.jumlah) return;
    await addInfaqEntry(form);
    setForm(prev => ({ ...prev, malamKe: prev.malamKe + 1, jumlah: 0, catatan: '' }));
  }

  async function handleSaveEdit() {
    if (!editForm) return;
    await updateInfaqEntry(editForm);
    setEditingId(null);
    setEditForm(null);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Infaq Rutin Tarawih</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">Rekap Per Malam</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-emerald-700">{formatIDR(totalInfaq)}</p>
        </div>
      </div>

      {/* Add form */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 mb-6">
        <p className="mb-3 text-xs font-semibold text-emerald-700 uppercase tracking-wide">Tambah Data Malam</p>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Malam Ke-</label>
            <input
              type="number"
              value={form.malamKe}
              min={1}
              onChange={e => setForm(prev => ({ ...prev, malamKe: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal</label>
            <input
              type="date"
              value={form.tanggal}
              onChange={e => setForm(prev => ({ ...prev, tanggal: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Jumlah Infaq</label>
            <CurrencyInput
              value={form.jumlah}
              onChange={val => setForm(prev => ({ ...prev, jumlah: val }))}
              prefix="Rp"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Catatan</label>
            <input
              value={form.catatan}
              onChange={e => setForm(prev => ({ ...prev, catatan: e.target.value }))}
              placeholder="Opsional"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={isSaving || !form.jumlah}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Tambah
        </button>
      </div>

      {/* Entries table */}
      {infaqEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="pb-3 pr-4">Malam</th>
                <th className="pb-3 pr-4">Tanggal</th>
                <th className="pb-3 pr-4">Jumlah</th>
                <th className="pb-3 pr-4">Catatan</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {infaqEntries.map(entry => (
                <tr key={entry.id}>
                  {editingId === entry.id && editForm ? (
                    <>
                      <td className="py-2 pr-4">
                        <input type="number" value={editForm.malamKe} min={1}
                          onChange={e => setEditForm(prev => prev ? { ...prev, malamKe: Number(e.target.value) } : prev)}
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-sm" />
                      </td>
                      <td className="py-2 pr-4">
                        <input type="date" value={editForm.tanggal}
                          onChange={e => setEditForm(prev => prev ? { ...prev, tanggal: e.target.value } : prev)}
                          className="rounded border border-gray-200 px-2 py-1 text-sm" />
                      </td>
                      <td className="py-2 pr-4">
                        <CurrencyInput value={editForm.jumlah}
                          onChange={val => setEditForm(prev => prev ? { ...prev, jumlah: val } : prev)}
                          prefix="Rp" className="w-40" />
                      </td>
                      <td className="py-2 pr-4">
                        <input value={editForm.catatan}
                          onChange={e => setEditForm(prev => prev ? { ...prev, catatan: e.target.value } : prev)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm" />
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={handleSaveEdit} disabled={isSaving} className="mr-2 rounded bg-emerald-600 px-2 py-1 text-xs text-white">
                          <Save className="h-3 w-3" />
                        </button>
                        <button onClick={() => { setEditingId(null); setEditForm(null); }} className="rounded border px-2 py-1 text-xs text-gray-500">Batal</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-4 font-medium">Malam ke-{entry.malamKe}</td>
                      <td className="py-3 pr-4 text-gray-600">{entry.tanggal}</td>
                      <td className="py-3 pr-4 font-semibold text-emerald-700">{formatIDR(entry.jumlah)}</td>
                      <td className="py-3 pr-4 text-gray-500">{entry.catatan || '-'}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => { setEditingId(entry.id); setEditForm(entry); }}
                          className="mr-2 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
                        <button onClick={() => { if (confirm('Hapus data ini?')) deleteInfaqEntry(entry.id); }}
                          disabled={isSaving} className="rounded border border-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
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
                <td colSpan={2} className="pt-3 text-gray-500">Total ({infaqEntries.length} malam)</td>
                <td className="pt-3 text-emerald-700">{formatIDR(totalInfaq)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
          Belum ada data infaq. Tambahkan data malam pertama di atas.
        </div>
      )}
    </div>
  );
}
