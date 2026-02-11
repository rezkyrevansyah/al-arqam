import { useState } from 'react';
import { useAdmin } from '../store/admin-store';
import { Save, Timer, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

export default function CountdownPage() {
  const { countdown, setCountdown, isSaving } = useAdmin();
  const [form, setForm] = useState({ ...countdown });

  const handleSave = async () => { await setCountdown(form); };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Countdown Hari Besar
          </h1>
          <p className="text-sm text-gray-500 mt-1">Atur countdown event hari besar Islam</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">Tampilkan Countdown</p>
                <p className="text-xs text-gray-500">Countdown akan muncul di bawah hero section</p>
              </div>
            </div>
            <button
              onClick={() => setForm({ ...form, active: !form.active })}
              className="transition-colors"
            >
              {form.active ? (
                <ToggleRight className="w-10 h-10 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-gray-300" />
              )}
            </button>
          </div>

          <div className={`space-y-5 transition-opacity ${form.active ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Event</label>
              <input type="text" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Contoh: Isra Mi'raj Nabi Muhammad SAW" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Event</label>
              <textarea value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                placeholder="Deskripsi singkat event..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal & Waktu Event</label>
              <input type="datetime-local" value={form.date.slice(0, 16)}
                onChange={e => setForm({ ...form, date: e.target.value + ':00' })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Status card */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-white ${form.active ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gray-300'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Timer className="w-5 h-5" />
              <span className="text-sm font-medium opacity-80">Status</span>
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {form.active ? 'Aktif' : 'Nonaktif'}
            </p>
            <p className="text-sm opacity-70 mt-1">
              {form.active ? 'Countdown ditampilkan di landing page' : 'Countdown tidak ditampilkan'}
            </p>
          </div>

          {form.active && form.name && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Event</p>
              <p className="text-sm font-semibold text-gray-800">{form.name}</p>
              <p className="text-xs text-gray-500 mt-2">
                {form.date ? new Date(form.date).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                }) : '-'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
