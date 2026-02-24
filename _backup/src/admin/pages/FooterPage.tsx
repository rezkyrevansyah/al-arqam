import { useState } from 'react';
import { useAdmin } from '../store/admin-store';
import { Save, MapPin, Phone, Mail, Plus, Trash2, Globe, Loader2 } from 'lucide-react';
import type { SocialPlatform } from '../../data/types';

export default function FooterPage() {
  const { footer, setFooter, isSaving } = useAdmin();
  const [form, setForm] = useState({ ...footer });

  const handleSave = async () => { await setFooter(form); };

  const addSocial = () => {
    setForm({ ...form, socials: [...form.socials, { platform: 'instagram' as SocialPlatform, url: '' }] });
  };
  const removeSocial = (i: number) => {
    setForm({ ...form, socials: form.socials.filter((_, idx) => idx !== i) });
  };
  const updateSocial = (i: number, field: 'platform' | 'url', value: string) => {
    const updated = [...form.socials];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, socials: updated });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Footer</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi kontak, lokasi, dan sosial media</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Informasi Kontak</h3>
              <p className="text-xs text-gray-500">Kontak yang ditampilkan di footer</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Alamat</span>
            </label>
            <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />Link Google Maps</span>
            </label>
            <input type="text" value={form.mapsUrl} onChange={e => setForm({ ...form, mapsUrl: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />Telepon</span>
              </label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email</span>
              </label>
              <input type="text" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>
        </div>

        {/* Social media */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Sosial Media</h3>
                <p className="text-xs text-gray-500">Link media sosial masjid</p>
              </div>
            </div>
            <button onClick={addSocial}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>

          <div className="space-y-3">
            {form.socials.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <select value={s.platform} onChange={e => updateSocial(i, 'platform', e.target.value)}
                  className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="">Pilih...</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
                <input type="text" value={s.url} onChange={e => updateSocial(i, 'url', e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="https://..." />
                <button onClick={() => removeSocial(i)} className="p-2 hover:bg-red-50 rounded-lg flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
            {form.socials.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada sosial media.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
