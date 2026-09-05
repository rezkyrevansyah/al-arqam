import { useState } from 'react';
import { useAdmin } from '../store/admin-store';
import { Save, Landmark, Loader2, Tag, Phone, Plus, Trash2 } from 'lucide-react';
import { CurrencyInput } from '../components/CurrencyInput';
import type { QurbanPricingTier, QurbanContactEntry } from '../../data/types';

function newTierId() {
  return `tier-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function QurbanPage() {
  const { qurbanConfig, setQurbanConfig, isSaving } = useAdmin();
  const [form, setForm] = useState({ ...qurbanConfig });

  const handleSave = async () => {
    await setQurbanConfig(form);
  };

  const updateTier = (index: number, patch: Partial<QurbanPricingTier>) => {
    setForm((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));
  };

  const addTier = () => {
    setForm((prev) => ({
      ...prev,
      pricingTiers: [
        ...prev.pricingTiers,
        { id: newTierId(), label: '', price: 0, note: '', highlight: false },
      ],
    }));
  };

  const removeTier = (index: number) => {
    setForm((prev) => ({ ...prev, pricingTiers: prev.pricingTiers.filter((_, i) => i !== index) }));
  };

  const updateContact = (index: number, patch: Partial<QurbanContactEntry>) => {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
  };

  const addContact = () => {
    setForm((prev) => ({ ...prev, contacts: [...prev.contacts, { name: '', phone: '' }] }));
  };

  const removeContact = (index: number) => {
    setForm((prev) => ({ ...prev, contacts: prev.contacts.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Qurban</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola harga paket, rekening, dan kontak panitia qurban</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label Tahun</label>
          <input type="text" value={form.yearLabel} onChange={(e) => setForm({ ...form, yearLabel: e.target.value })}
            className="w-full max-w-xs px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="1447H / 2026M" />
        </div>

        <div className="flex items-center gap-3 pt-4 pb-4 border-t border-b border-gray-100">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Landmark className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Rekening Qurban</h3>
            <p className="text-xs text-gray-500">Rekening untuk pembayaran qurban</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
            <input type="text" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
            <input type="text" value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
            <input type="text" value={form.bankAccountName} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 pb-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Paket & Harga</h3>
              <p className="text-xs text-gray-500">Daftar paket qurban yang ditawarkan</p>
            </div>
          </div>
          <button onClick={addTier} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
            <Plus className="w-3.5 h-3.5" /> Tambah Paket
          </button>
        </div>
        <div className="space-y-3">
          {form.pricingTiers.map((tier, index) => (
            <div key={tier.id} className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 rounded-xl">
              <input type="text" value={tier.label} onChange={(e) => updateTier(index, { label: e.target.value })}
                placeholder="Label paket" className="col-span-4 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <div className="col-span-3">
                <CurrencyInput value={tier.price} onChange={(val) => updateTier(index, { price: val })} prefix="Rp" />
              </div>
              <input type="text" value={tier.note ?? ''} onChange={(e) => updateTier(index, { note: e.target.value })}
                placeholder="Catatan (opsional)" className="col-span-4 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={() => removeTier(index)} className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
              <label className="col-span-12 flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" checked={tier.highlight} onChange={(e) => updateTier(index, { highlight: e.target.checked })} />
                Tandai sebagai paket unggulan (disorot di halaman publik)
              </label>
            </div>
          ))}
          {form.pricingTiers.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada paket. Klik &quot;Tambah Paket&quot; untuk menambahkan.</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 pb-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Kontak Panitia</h3>
              <p className="text-xs text-gray-500">Nomor WhatsApp panitia yang bisa dihubungi</p>
            </div>
          </div>
          <button onClick={addContact} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
            <Plus className="w-3.5 h-3.5" /> Tambah Kontak
          </button>
        </div>
        <div className="space-y-3">
          {form.contacts.map((contact, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-xl">
              <input type="text" value={contact.name} onChange={(e) => updateContact(index, { name: e.target.value })}
                placeholder="Nama" className="col-span-5 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="text" value={contact.phone} onChange={(e) => updateContact(index, { phone: e.target.value })}
                placeholder="08xxxxxxxxxx" className="col-span-6 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={() => removeContact(index)} className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {form.contacts.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada kontak. Klik &quot;Tambah Kontak&quot; untuk menambahkan.</p>
          )}
        </div>
      </div>
    </div>
  );
}
