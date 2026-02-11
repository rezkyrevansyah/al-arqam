import { useState } from 'react';
import { useAdmin } from '../store/admin-store';
import { Save, Eye } from 'lucide-react';

export default function HeroPage() {
  const { hero, setHero } = useAdmin();
  const [form, setForm] = useState({ ...hero });

  const handleSave = () => {
    setHero(form);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hero Section
          </h1>
          <p className="text-sm text-gray-500 mt-1">Kelola tampilan utama landing page</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Simpan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Masjid</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Nama masjid..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Tagline masjid..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              placeholder="Deskripsi singkat masjid..."
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Preview</span>
          </div>
          <div className="relative rounded-xl p-8 text-center space-y-3 overflow-hidden" style={{ backgroundColor: 'hsl(40 20% 97%)' }}>
            {/* Background patterns - same as landing page */}
            <div className="absolute inset-0 islamic-pattern" />
            <div className="absolute inset-0 hero-gradient" />
            {/* Content */}
            <div className="relative z-10 space-y-3">
              <p className="text-xs" style={{ fontFamily: "'Amiri', serif", color: 'hsl(160 10% 45% / 0.7)' }}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'hsl(160 30% 8%)' }}>
                {form.title || 'Judul Masjid'}
              </h2>
              <div className="w-12 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, hsl(38 70% 55% / 0.6), transparent)' }} />
              <p className="text-xs italic" style={{ fontFamily: "'Playfair Display', serif", color: 'hsl(160 35% 35%)' }}>
                {form.subtitle || 'Tagline'}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'hsl(160 10% 45%)' }}>
                {form.description || 'Deskripsi akan ditampilkan di sini...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
