import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../store/admin-store';
import { Plus, Pencil, Trash2, Newspaper, Clock, User } from 'lucide-react';
import { formatGoogleDriveUrl } from '../../lib/utils';

export default function ArticlePage() {
  const { articleList, deleteArticle, isSaving } = useAdmin();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">{articleList.length} artikel terpublikasi</p>
        </div>
        <button onClick={() => navigate('/admin/artikel/baru')}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Tulis Artikel
        </button>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4"><Trash2 className="w-5 h-5 text-red-500" /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Artikel?</h3>
            <p className="text-sm text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={async () => { await deleteArticle(confirmDelete); setConfirmDelete(null); }} disabled={isSaving}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Article list - card style */}
      {articleList.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl text-center py-16">
          <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Belum ada artikel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articleList.map(a => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:shadow-md transition-all">
              {a.image && <img src={formatGoogleDriveUrl(a.image)} alt="" className="h-40 w-full object-cover" />}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600">{a.category}</span>
                    <h3 className="text-sm font-semibold text-gray-800 mt-0.5 line-clamp-2">{a.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => navigate(`/admin/artikel/edit/${a.id}`)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                    <button onClick={() => setConfirmDelete(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{a.excerpt}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
