import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { ZisEntry } from '../../data/types';
import { useAdmin } from '../store/admin-store';
import { CurrencyInput } from './CurrencyInput';

interface Props {
  programId: string;
}

const RT_LIST = ['RT 001', 'RT 002', 'RT 003', 'RT 004', 'RT 005', 'RT 006', 'RT 007', 'RT 008'];

const emptyEntry = (programId: string): Omit<ZisEntry, 'id'> => ({
  programId,
  tanggal: new Date().toISOString().slice(0, 10),
  namaPetugas: '',
  nomorResi: '',
  namaMuzakki: '',
  alamat: '',
  rt: 'RT 001',
  zakatFitrahJiwa: 0,
  zakatFitrahUang: 0,
  zakatFitrahBerasLiter: 0,
  zakatFitrahBerasKg: 0,
  zakatMal: 0,
  infaqSedekah: 0,
  fidyahJiwa: 0,
  fidyahRp: 0,
  lainLain: 0,
  catatan: '',
});

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function InputField({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
    </div>
  );
}

export function ZisSection({ programId }: Props) {
  const { zisEntries, loadProgramEntries, addZisEntry, updateZisEntry, deleteZisEntry, isSaving } = useAdmin();
  const [form, setForm] = useState(emptyEntry(programId));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ZisEntry | null>(null);

  useEffect(() => {
    loadProgramEntries(programId, 'zis');
    setForm(emptyEntry(programId));
  }, [programId, loadProgramEntries]);

  const totalMuzakki = zisEntries.length;
  const totalZakatFitrahUang = zisEntries.reduce((s, e) => s + e.zakatFitrahUang, 0);
  const totalZakatFitrahBerasKg = zisEntries.reduce((s, e) => s + e.zakatFitrahBerasKg, 0);
  const totalZakatMal = zisEntries.reduce((s, e) => s + e.zakatMal, 0);
  const totalInfaqSedekah = zisEntries.reduce((s, e) => s + e.infaqSedekah, 0);
  const totalFidyahRp = zisEntries.reduce((s, e) => s + e.fidyahRp, 0);

  async function handleAdd() {
    if (!form.namaMuzakki.trim()) return;
    await addZisEntry(form);
    setForm(prev => ({ ...emptyEntry(programId), tanggal: prev.tanggal, namaPetugas: prev.namaPetugas, rt: prev.rt }));
  }

  async function handleSaveEdit() {
    if (!editForm) return;
    await updateZisEntry(editForm);
    setEditingId(null);
    setEditForm(null);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">ZIS — Zakat, Infaq, Sedekah</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">Data Muzakki</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right text-sm">
          <div>
            <p className="text-xs text-gray-500">Muzakki</p>
            <p className="font-bold text-gray-800">{totalMuzakki} orang</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Zakat Fitrah (Uang)</p>
            <p className="font-bold text-emerald-700">{formatIDR(totalZakatFitrahUang)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Beras</p>
            <p className="font-bold text-amber-600">{totalZakatFitrahBerasKg.toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-center">
          <p className="text-xs text-indigo-600 font-medium">Zakat Maal</p>
          <p className="mt-1 font-bold text-indigo-800">{formatIDR(totalZakatMal)}</p>
        </div>
        <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-center">
          <p className="text-xs text-green-600 font-medium">Infaq/Sedekah</p>
          <p className="mt-1 font-bold text-green-800">{formatIDR(totalInfaqSedekah)}</p>
        </div>
        <div className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-center">
          <p className="text-xs text-orange-600 font-medium">Fidyah</p>
          <p className="mt-1 font-bold text-orange-800">{formatIDR(totalFidyahRp)}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-600 font-medium">Beras (Liter)</p>
          <p className="mt-1 font-bold text-gray-800">{zisEntries.reduce((s, e) => s + e.zakatFitrahBerasLiter, 0).toFixed(1)} L</p>
        </div>
      </div>

      {/* Add form */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <p className="mb-4 text-xs font-semibold text-indigo-700 uppercase tracking-wide">Tambah Data Muzakki</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InputField label="Tanggal" value={form.tanggal} type="date" onChange={v => setForm(p => ({ ...p, tanggal: v }))} />
          <InputField label="Nama Petugas ZIS" value={form.namaPetugas} onChange={v => setForm(p => ({ ...p, namaPetugas: v }))} placeholder="Nama amil" />
          <InputField label="Nomor Resi" value={form.nomorResi} onChange={v => setForm(p => ({ ...p, nomorResi: v }))} placeholder="No resi" />
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">RT</label>
            <select value={form.rt} onChange={e => setForm(p => ({ ...p, rt: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none">
              {RT_LIST.map(rt => <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>
          <div className="lg:col-span-2">
            <InputField label="Nama Muzakki" value={form.namaMuzakki} onChange={v => setForm(p => ({ ...p, namaMuzakki: v }))} placeholder="Nama lengkap muzakki" />
          </div>
          <div className="lg:col-span-2">
            <InputField label="Alamat" value={form.alamat} onChange={v => setForm(p => ({ ...p, alamat: v }))} placeholder="Alamat lengkap" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Zakat Fitrah (Jiwa)</label>
            <input type="number" min={0} value={form.zakatFitrahJiwa}
              onChange={e => setForm(p => ({ ...p, zakatFitrahJiwa: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Zakat Fitrah Uang</label>
            <CurrencyInput value={form.zakatFitrahUang} onChange={v => setForm(p => ({ ...p, zakatFitrahUang: v }))} prefix="Rp" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Beras (Liter)</label>
            <input type="number" min={0} step={0.1} value={form.zakatFitrahBerasLiter}
              onChange={e => setForm(p => ({ ...p, zakatFitrahBerasLiter: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Beras (Kg)</label>
            <input type="number" min={0} step={0.1} value={form.zakatFitrahBerasKg}
              onChange={e => setForm(p => ({ ...p, zakatFitrahBerasKg: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Zakat Maal</label>
            <CurrencyInput value={form.zakatMal} onChange={v => setForm(p => ({ ...p, zakatMal: v }))} prefix="Rp" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Infaq/Sedekah</label>
            <CurrencyInput value={form.infaqSedekah} onChange={v => setForm(p => ({ ...p, infaqSedekah: v }))} prefix="Rp" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Fidyah (Jiwa)</label>
            <input type="number" min={0} value={form.fidyahJiwa}
              onChange={e => setForm(p => ({ ...p, fidyahJiwa: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Fidyah (Rp)</label>
            <CurrencyInput value={form.fidyahRp} onChange={v => setForm(p => ({ ...p, fidyahRp: v }))} prefix="Rp" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Lain-lain</label>
            <CurrencyInput value={form.lainLain} onChange={v => setForm(p => ({ ...p, lainLain: v }))} prefix="Rp" />
          </div>
          <div className="lg:col-span-3">
            <InputField label="Catatan" value={form.catatan} onChange={v => setForm(p => ({ ...p, catatan: v }))} placeholder="Opsional" />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={isSaving || !form.namaMuzakki.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Tambah Muzakki
        </button>
      </div>

      {/* Entries table */}
      {zisEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="pb-3 pr-3">Muzakki</th>
                <th className="pb-3 pr-3">RT</th>
                <th className="pb-3 pr-3">ZF Jiwa</th>
                <th className="pb-3 pr-3">ZF Uang</th>
                <th className="pb-3 pr-3">Beras (kg)</th>
                <th className="pb-3 pr-3">Zakat Maal</th>
                <th className="pb-3 pr-3">Infaq</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {zisEntries.map(entry => (
                <tr key={entry.id}>
                  <td className="py-3 pr-3 font-medium">{entry.namaMuzakki}<br/><span className="text-xs text-gray-400">{entry.tanggal}</span></td>
                  <td className="py-3 pr-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{entry.rt}</span></td>
                  <td className="py-3 pr-3">{entry.zakatFitrahJiwa}</td>
                  <td className="py-3 pr-3">{entry.zakatFitrahUang > 0 ? formatIDR(entry.zakatFitrahUang) : '-'}</td>
                  <td className="py-3 pr-3">{entry.zakatFitrahBerasKg > 0 ? `${entry.zakatFitrahBerasKg} kg` : '-'}</td>
                  <td className="py-3 pr-3">{entry.zakatMal > 0 ? formatIDR(entry.zakatMal) : '-'}</td>
                  <td className="py-3 pr-3">{entry.infaqSedekah > 0 ? formatIDR(entry.infaqSedekah) : '-'}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => { setEditingId(entry.id); setEditForm(entry); }}
                      className="mr-2 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
                    <button onClick={() => { if (confirm('Hapus data muzakki ini?')) deleteZisEntry(entry.id); }}
                      disabled={isSaving} className="rounded border border-red-100 p-1 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
          Belum ada data muzakki. Tambahkan di atas.
        </div>
      )}
    </div>
  );
}
