import { useState } from 'react';
import { useAdmin, type BoardMember } from '../store/admin-store';
import { Plus, Pencil, Trash2, X, Save, Users } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const empty = { name: '', title: '', image: '' };

export default function BoardPage() {
  const { boardList, addBoardMember, updateBoardMember, deleteBoardMember } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [delId, setDelId] = useState<string | null>(null);

  const openNew = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (m: BoardMember) => {
    setForm({ name: m.name, title: m.title, image: m.image });
    setEditId(m.id); setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditId(null); };
  const save = () => {
    if (!form.name || !form.title) return;
    editId ? updateBoardMember(editId, form) : addBoardMember(form);
    close();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pengurus DKM
          </h1>
          <p className="text-sm text-gray-500 mt-1">{boardList.length} pengurus terdaftar</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Tambah Pengurus
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editId ? 'Edit Pengurus' : 'Tambah Pengurus'}</h2>
              <button onClick={close} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Foto Pengurus"
                previewHeight="h-48"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Nama pengurus..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Contoh: Ketua DKM" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={close} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
                <Save className="w-4 h-4" /> {editId ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDelId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Pengurus?</h3>
            <p className="text-sm text-gray-500 mb-6">Data akan dihapus dari daftar kepengurusan.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDelId(null)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={() => { deleteBoardMember(delId); setDelId(null); }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {boardList.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl text-center py-16">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Belum ada pengurus terdaftar.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
          {boardList.map((m, i) => (
            <div key={m.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors group">
              <span className="text-xs text-gray-300 w-6 text-center font-mono">{i + 1}</span>
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {m.image ? (
                  <img src={m.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{m.name}</h3>
                <p className="text-xs text-amber-600">{m.title}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(m)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => setDelId(m.id)} className="p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
