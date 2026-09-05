import { useState } from 'react';
import { useAdmin, type Agenda } from '../store/admin-store';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Radio, 
  Calendar, 
  CheckCircle2,
  CalendarRange
} from 'lucide-react';
import { CategoryManager } from '../components/CategoryManager';
import { getAgendaStatus, formatAgendaDateRange } from '@/utils/agenda';
import type { AgendaStatus } from '@/data/types';

interface AgendaFormData {
  title: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

const emptyForm: AgendaFormData = {
  title: '',
  date: '',
  endDate: '',
  time: '',
  location: '',
  description: '',
  category: '',
};

export default function AgendaPage() {
  const { agendaList, addAgenda, updateAgenda, deleteAgenda, isSaving, agendaCategories } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AgendaFormData>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrorMessage(null);
    setShowForm(true);
  };

  const openEdit = (a: Agenda) => {
    setForm({
      title: a.title,
      date: a.date,
      endDate: a.endDate || '',
      time: a.time,
      location: a.location,
      description: a.description,
      category: a.category,
    });
    setEditingId(a.id);
    setErrorMessage(null);
    setShowForm(true);
  };

  const close = () => {
    setShowForm(false);
    setEditingId(null);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    setErrorMessage(null);
    if (!form.title.trim()) {
      setErrorMessage('Judul agenda wajib diisi.');
      return;
    }
    if (!form.date) {
      setErrorMessage('Tanggal mulai wajib diisi.');
      return;
    }

    if (form.endDate && form.endDate < form.date) {
      setErrorMessage('Tanggal selesai tidak boleh lebih awal dari tanggal mulai.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      date: form.date,
      endDate: form.endDate ? form.endDate : null,
      time: form.time.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      category: form.category.trim() || 'kegiatan',
    };

    if (editingId) {
      await updateAgenda(editingId, payload);
    } else {
      await addAgenda(payload);
    }
    close();
  };

  const getCatColor = (categoryName: string) => {
    const cat = agendaCategories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
    return cat?.color ?? '#10b981';
  };

  // Compute status counts
  const counts = {
    all: agendaList.length,
    sedang_berlangsung: agendaList.filter((a) => getAgendaStatus(a.date, a.endDate).status === 'sedang_berlangsung').length,
    akan_datang: agendaList.filter((a) => getAgendaStatus(a.date, a.endDate).status === 'akan_datang').length,
    selesai: agendaList.filter((a) => getAgendaStatus(a.date, a.endDate).status === 'selesai').length,
  };

  // Filtered list
  const filteredList = agendaList.filter((a) => {
    if (statusFilter === 'all') return true;
    const { status } = getAgendaStatus(a.date, a.endDate);
    return status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Agenda & Kegiatan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola jadwal kajian, peringatan hari besar, dan acara masjid dengan label status otomatis.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Agenda
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua Agenda', count: counts.all },
          { id: 'sedang_berlangsung', label: 'Sedang Berlangsung', count: counts.sedang_berlangsung, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { id: 'akan_datang', label: 'Akan Datang', count: counts.akan_datang, color: 'text-blue-700 bg-blue-50 border-blue-200' },
          { id: 'selesai', label: 'Selesai', count: counts.selesai, color: 'text-gray-600 bg-gray-100 border-gray-200' },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? 'Edit Agenda' : 'Tambah Agenda'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sistem akan otomatis menentukan label status (Akan Datang / Sedang Berlangsung / Selesai).
                </p>
              </div>
              <button onClick={close} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Agenda *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Contoh: Kajian Bulanan, Peringatan Maulid Nabi, dll."
                />
              </div>

              {/* Date & Date Range */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <CalendarRange className="w-4 h-4 text-emerald-600" />
                  <span>Jadwal Pelaksanaan Acara</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tanggal Selesai <span className="text-gray-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      min={form.date || undefined}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">
                  💡 Kosongkan <strong>Tanggal Selesai</strong> jika acara hanya 1 hari. Isi jika acara berlangsung berhari-hari (multi-day).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Contoh: 18:30 WIB s/d Selesai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {agendaCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Contoh: Ruang Utama Masjid Al-Arqam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  placeholder="Deskripsi kegiatan, narasumber/penceramah, dsb..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={close}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {editingId ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Agenda?</h3>
            <p className="text-sm text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await deleteAgenda(confirmDelete);
                  setConfirmDelete(null);
                }}
                disabled={isSaving}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category manager */}
      <CategoryManager entityType="agenda" categories={agendaCategories} />

      {/* Agenda list */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
        {filteredList.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {statusFilter === 'all'
                ? 'Belum ada agenda. Klik tombol di atas untuk menambahkan.'
                : 'Tidak ada agenda dengan filter status ini.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredList.map((a) => {
              const statusInfo = getAgendaStatus(a.date, a.endDate);
              const formattedDate = formatAgendaDateRange(a.date, a.endDate);

              return (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-gray-50/70 transition-colors group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 min-w-[3.75rem] shrink-0 text-center">
                      <span
                        className="text-lg font-bold text-gray-900 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {new Date(a.date).getDate()}
                      </span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-500">
                        {new Date(a.date).toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                    </div>

                    {/* Content & Badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-gray-900 truncate max-w-md">
                          {a.title}
                        </h3>

                        {/* Automatic Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                          {statusInfo.label}
                        </span>

                        {/* Category Badge */}
                        {a.category && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 text-white"
                            style={{ backgroundColor: getCatColor(a.category) }}
                          >
                            {a.category}
                          </span>
                        )}
                      </div>

                      {/* Date details and Location */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {formattedDate}
                        </span>
                        {a.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {a.time}
                          </span>
                        )}
                        {a.location && (
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {a.location}
                          </span>
                        )}
                      </div>

                      {a.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openEdit(a)}
                      title="Edit Agenda"
                      className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(a.id)}
                      title="Hapus Agenda"
                      className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
