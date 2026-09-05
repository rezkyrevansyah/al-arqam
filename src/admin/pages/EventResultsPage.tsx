import { useState } from 'react';
import { useAdmin } from '../store/admin-store';
import { Plus, Trash2, ChevronDown, ChevronRight, Trophy, Loader2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import type { EventProgram, EventWinner } from '../../data/types';

function EmptyProgramForm(): Omit<EventProgram, 'id' | 'categories'> {
  return {
    slug: '',
    title: '',
    type: 'lomba',
    yearLabel: '',
    description: '',
    documentationUrl: '',
    isPublished: true,
    isFeatured: false,
    sortOrder: 0,
  };
}

function WinnerRow({
  winner,
  onUpdate,
  onDelete,
}: {
  winner: EventWinner;
  onUpdate: (patch: Partial<EventWinner>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <input value={winner.rankLabel} onChange={(e) => onUpdate({ rankLabel: e.target.value })}
        placeholder="Juara 1" className="col-span-3 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs" />
      <input value={winner.name} onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="Nama pemenang" className="col-span-5 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs" />
      <input value={winner.badge} onChange={(e) => onUpdate({ badge: e.target.value })}
        placeholder="🥇" className="col-span-2 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-center" />
      <button onClick={onDelete} className="col-span-2 flex items-center justify-center text-red-500 hover:text-red-700">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function EventResultsPage() {
  const {
    eventPrograms, addEventProgram, updateEventProgram, deleteEventProgram,
    addEventCategory, updateEventCategory, deleteEventCategory,
    addEventWinner, updateEventWinner, deleteEventWinner,
    isSaving,
  } = useAdmin();

  const [newProgram, setNewProgram] = useState(EmptyProgramForm());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCreateProgram = async () => {
    if (!newProgram.title.trim() || !newProgram.slug.trim()) return;
    await addEventProgram(newProgram);
    setNewProgram(EmptyProgramForm());
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Hasil Lomba & Event</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola program lomba/event beserta kategori dan pemenangnya</p>
      </div>

      {/* New program form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Tambah Program Baru</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Judul</label>
            <input value={newProgram.title} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
              placeholder="Gema Muharram 1448H" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input value={newProgram.slug} onChange={(e) => setNewProgram({ ...newProgram, slug: e.target.value })}
              placeholder="gema-muharram-1448h" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Label Tahun</label>
            <input value={newProgram.yearLabel} onChange={(e) => setNewProgram({ ...newProgram, yearLabel: e.target.value })}
              placeholder="1448H" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Link Dokumentasi</label>
            <input value={newProgram.documentationUrl} onChange={(e) => setNewProgram({ ...newProgram, documentationUrl: e.target.value })}
              placeholder="https://drive.google.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
              rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" checked={newProgram.isPublished} onChange={(e) => setNewProgram({ ...newProgram, isPublished: e.target.checked })} />
            Publikasikan
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" checked={newProgram.isFeatured} onChange={(e) => setNewProgram({ ...newProgram, isFeatured: e.target.checked })} />
            Unggulkan
          </label>
          <button onClick={handleCreateProgram} disabled={isSaving}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Buat Program
          </button>
        </div>
      </div>

      {/* Program list */}
      <div className="space-y-4">
        {eventPrograms.map((program) => {
          const isExpanded = expandedId === program.id;
          return (
            <div key={program.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : program.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{program.title}</p>
                    <p className="text-xs text-gray-500">/{program.slug} &middot; {program.categories.length} kategori</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {program.isPublished ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Draft</span>
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input value={program.title} onChange={(e) => updateEventProgram(program.id, { title: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Judul" />
                    <input value={program.slug} onChange={(e) => updateEventProgram(program.id, { slug: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Slug" />
                    <input value={program.documentationUrl} onChange={(e) => updateEventProgram(program.id, { documentationUrl: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm col-span-2" placeholder="Link dokumentasi" />
                    <textarea value={program.description} onChange={(e) => updateEventProgram(program.id, { description: e.target.value })}
                      rows={2} className="px-3 py-2 border border-gray-200 rounded-lg text-sm col-span-2" placeholder="Deskripsi" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input type="checkbox" checked={program.isPublished} onChange={(e) => updateEventProgram(program.id, { isPublished: e.target.checked })} />
                      Publikasikan
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input type="checkbox" checked={program.isFeatured} onChange={(e) => updateEventProgram(program.id, { isFeatured: e.target.checked })} />
                      Unggulkan
                    </label>
                    <button onClick={() => deleteEventProgram(program.id)}
                      className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700">
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Program
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">Kategori Lomba</h4>
                      <button
                        onClick={() => addEventCategory({ programId: program.id, emoji: '🏆', name: 'Kategori Baru', photoUrl: '', photoAlt: '', sortOrder: program.categories.length })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Kategori
                      </button>
                    </div>

                    {program.categories.map((category) => (
                      <div key={category.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-12 gap-2 items-start">
                          <input value={category.emoji} onChange={(e) => updateEventCategory(category.id, { emoji: e.target.value })}
                            className="col-span-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center" />
                          <input value={category.name} onChange={(e) => updateEventCategory(category.id, { name: e.target.value })}
                            placeholder="Nama kategori" className="col-span-6 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm" />
                          <input value={category.photoAlt} onChange={(e) => updateEventCategory(category.id, { photoAlt: e.target.value })}
                            placeholder="Alt text foto" className="col-span-4 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm" />
                          <button onClick={() => deleteEventCategory(category.id)} className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <ImageUpload
                          value={category.photoUrl}
                          onChange={(url) => updateEventCategory(category.id, { photoUrl: url })}
                          label="Foto Pemenang Kategori"
                          previewHeight="h-32"
                          folder="events"
                        />

                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-600">Pemenang</p>
                            <button
                              onClick={() => addEventWinner({ categoryId: category.id, rankLabel: '', name: '', badge: '', isHonorableMention: false, sortOrder: category.winners.length })}
                              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              + Tambah Pemenang
                            </button>
                          </div>
                          {category.winners.map((winner) => (
                            <WinnerRow
                              key={winner.id}
                              winner={winner}
                              onUpdate={(patch) => updateEventWinner(winner.id, patch)}
                              onDelete={() => deleteEventWinner(winner.id)}
                            />
                          ))}
                          {category.winners.length === 0 && (
                            <p className="text-xs text-gray-400 py-1">Belum ada pemenang di kategori ini.</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {program.categories.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-3">Belum ada kategori lomba.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {eventPrograms.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">Belum ada program event. Buat yang pertama di atas.</p>
        )}
      </div>
    </div>
  );
}
