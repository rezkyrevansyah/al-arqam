import { useState } from 'react';
import { useAdmin } from '../store/admin-store';
import { Save, Landmark, TrendingUp } from 'lucide-react';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function DonationPage() {
  const { donation, setDonation } = useAdmin();
  const [form, setForm] = useState({ ...donation });

  const pct = form.donationTarget > 0 ? Math.min(Math.round((form.donationCollected / form.donationTarget) * 100), 100) : 0;

  const handleSave = () => setDonation(form);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Donasi</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi donasi dan progress pengumpulan</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <Save className="w-4 h-4" /> Simpan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Landmark className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Informasi Rekening</h3>
              <p className="text-xs text-gray-500">Detail rekening untuk donasi</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
            <input type="text" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Bank Syariah Indonesia" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
              <input type="text" value={form.bankAccountNumber} onChange={e => setForm({ ...form, bankAccountNumber: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="xxx xxx xxx x" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
              <input type="text" value={form.bankAccountName} onChange={e => setForm({ ...form, bankAccountName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="DKM Masjid..." />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 pb-4 border-t border-b border-gray-100">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Progress Donasi</h3>
              <p className="text-xs text-gray-500">Update jumlah dana yang terkumpul</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dana Terkumpul (Rp)</label>
              <input type="number" value={form.donationCollected} onChange={e => setForm({ ...form, donationCollected: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target (Rp)</label>
              <input type="number" value={form.donationTarget} onChange={e => setForm({ ...form, donationTarget: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
        </div>

        {/* Preview sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 text-white">
            <p className="text-sm font-medium text-amber-200 mb-1">Progress</p>
            <p className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{pct}%</p>
            <div className="h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <span>{formatCurrency(form.donationCollected)}</span>
              <span className="text-amber-200">{formatCurrency(form.donationTarget)}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Preview Rekening</p>
            <p className="text-sm font-bold text-gray-800">{form.bankName || '-'}</p>
            <p className="text-lg font-bold text-gray-900 tracking-wider mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {form.bankAccountNumber || '-'}
            </p>
            <p className="text-xs text-gray-500 mt-1">a.n. {form.bankAccountName || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
