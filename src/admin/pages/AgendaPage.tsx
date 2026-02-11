import { useState } from 'react';
import { useAdmin, type Agenda } from '../store/admin-store';
import { Plus, Pencil, Trash2, X, Save, CalendarDays, Clock, MapPin } from 'lucide-react';

const emptyForm = { title: '', date: '', time: '', location: '', description: '', category: 'kajian' as Agenda['category'] };

export default function AgendaPage() {
  const { agendaList, addAgenda, updateAgenda, deleteAgenda, isSaving } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (a: Agenda) => { setForm({ title: a.title, date: a.date, time: a.time, location: a.location, description: a.description, category: a.category }); setEditingId(a.id); setShowForm(true); };
  const close = () => { setShowForm(false); setEditingId(null); };

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    if (editingId) { await updateAgenda(editingId, form); }
    else { await addAgenda(form); }
    close();
  };

  const catLabel: Record<string, string> = { kajian: 'Kajian', sholat: 'Sholat', kegiatan: 'Kegiatan', rapat: 'Rapat' };
  const catColor: Record<string, string> = { kajian: 'bg-emerald-50 text-emerald-700', sholat: 'bg-blue-50 text-blue-700', kegiatan: 'bg-amber-50 text-amber-700', rapat: 'bg-violet-50 text-violet-700' };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Agenda</h1>
          <p className="text-sm text-gray-500 mt-1">{agendaList.length} agenda terdaftar</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Tambah Agenda
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Agenda' : 'Tambah Agenda'}</h2>
              <button onClick={close} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Judul agenda..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                  <input type="text" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="18:30 WIB" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Lokasi kegiatan..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <div className="flex gap-2">
                  {(['kajian','sholat','kegiatan','rapat'] as const).map(cat => (
                    <button key={cat} onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        form.category === cat ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{catLabel[cat]}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" placeholder="Deskripsi kegiatan..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={close} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" /> {editingId ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Agenda?</h3>
            <p className="text-sm text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={async () => { await deleteAgenda(confirmDelete); setConfirmDelete(null); }} disabled={isSaving}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Agenda list */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {agendaList.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Belum ada agenda. Klik tombol di atas untuk menambahkan.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {agendaList.map(a => (
              <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors group">
                <div className="flex flex-col items-center bg-gray-50 rounded-xl px-3 py-2 min-w-[3.5rem] flex-shrink-0">
                  <span className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {new Date(a.date).getDate()}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">
                    {new Date(a.date).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{a.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${catColor[a.category]}`}>
                      {catLabel[a.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(a)} className="p-2 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => setConfirmDelete(a.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
