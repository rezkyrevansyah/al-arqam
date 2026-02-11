import { useState } from 'react';
import { useAdmin } from '../store/admin-store';
import { Plus, Trash2, X, Save, Image, Calendar } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { formatGoogleDriveUrl } from '../../lib/utils';

export default function GalleryPage() {
  const { galleryList, addGalleryItem, deleteGalleryItem, isSaving } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', image: '', date: new Date().toISOString().slice(0, 10) });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.title || !form.image) return;
    // Sanitize URL before saving to ensure it's a direct link or clean formatted link
    const sanitizedImage = formatGoogleDriveUrl(form.image);
    await addGalleryItem({ ...form, image: sanitizedImage });
    setForm({ title: '', image: '', date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Galeri</h1>
          <p className="text-sm text-gray-500 mt-1">{galleryList.length} foto dalam galeri</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Upload Foto
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Tambah Foto</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Foto</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Nama kegiatan..." />
              </div>
              <ImageUpload
                value={formatGoogleDriveUrl(form.image)}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Foto Galeri"
                previewHeight="h-56"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4"><Trash2 className="w-5 h-5 text-red-500" /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Foto?</h3>
            <p className="text-sm text-gray-500 mb-6">Foto akan dihapus dari galeri.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={async () => { await deleteGalleryItem(confirmDelete); setConfirmDelete(null); }} disabled={isSaving}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery grid */}
      {galleryList.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl text-center py-16">
          <Image className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Belum ada foto dalam galeri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryList.map(g => (
            <div key={g.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <img src={formatGoogleDriveUrl(g.image)} alt={g.title} className="h-44 w-full object-cover" />
              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-800 truncate">{g.title}</h3>
                <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(g.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <button onClick={() => setConfirmDelete(g.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all">
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
