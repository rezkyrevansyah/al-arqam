import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';
import type { Category, CategoryEntityType } from '../../data/types';
import { useAdmin } from '../store/admin-store';

const PRESET_COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
];

interface Props {
  entityType: CategoryEntityType;
  categories: Category[];
}

export function CategoryManager({ entityType, categories }: Props) {
  const { addCategory, updateCategory, deleteCategory, isSaving } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  async function handleAdd() {
    if (!newName.trim()) return;
    await addCategory({ entityType, name: newName.trim(), color: newColor });
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
    setIsAdding(false);
  }

  async function handleUpdate(cat: Category) {
    if (!editName.trim()) return;
    await updateCategory({ ...cat, name: editName.trim(), color: editColor });
    setEditingId(null);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Tag className="h-4 w-4" />
          Kelola Kategori
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
          >
            <Plus className="h-3 w-3" />
            Tambah
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-indigo-200 bg-white p-2">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setIsAdding(false); }}
            placeholder="Nama kategori..."
            className="flex-1 rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-indigo-400"
          />
          <div className="flex gap-1">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={`h-5 w-5 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button onClick={handleAdd} disabled={isSaving} className="rounded p-1 text-green-600 hover:bg-green-50">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={() => setIsAdding(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.length === 0 && (
          <p className="text-xs text-gray-400">Belum ada kategori. Tambahkan di atas.</p>
        )}
        {categories.map(cat => (
          <div key={cat.id}>
            {editingId === cat.id ? (
              <div className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2 py-1">
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat); if (e.key === 'Escape') setEditingId(null); }}
                  className="w-24 rounded border border-gray-200 px-1 text-xs outline-none focus:border-indigo-400"
                />
                <div className="flex gap-0.5">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setEditColor(c)}
                      className={`h-4 w-4 rounded-full ${editColor === c ? 'ring-1 ring-offset-1 ring-gray-400 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <button onClick={() => handleUpdate(cat)} className="text-green-600 hover:text-green-700">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white" style={{ backgroundColor: cat.color }}>
                <span>{cat.name}</span>
                <button onClick={() => startEdit(cat)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => { if (confirm(`Hapus kategori "${cat.name}"?`)) deleteCategory(cat.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
