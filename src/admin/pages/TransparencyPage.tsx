import { useEffect, useState } from 'react';
import { ExternalLink, Eye, EyeOff, Link2, Loader2, Plus, Save, Trash2, Users, Wallet } from 'lucide-react';

import type {
  TransparencyDonor,
  TransparencyMetric,
  TransparencyMetricType,
  TransparencyProgram,
} from '../../data/types';
import { useAdmin } from '../store/admin-store';
import { CurrencyInput } from '../components/CurrencyInput';
import { InfaqTarawihSection } from '../components/InfaqTarawihSection';
import { SantunanYatimSection } from '../components/SantunanYatimSection';
import { ZisSection } from '../components/ZisSection';
import type { ProgramType } from '../../data/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createEmptyProgram(seed?: Partial<TransparencyProgram>): Omit<TransparencyProgram, 'id' | 'metrics' | 'donors'> {
  const year = new Date().getFullYear();
  return {
    slug: seed?.slug ?? `dashboard-${year}`,
    title: seed?.title ?? 'Transparansi Ramadhan',
    badge: seed?.badge ?? 'Dashboard Transparansi',
    category: seed?.category ?? 'Ramadhan',
    periodLabel: seed?.periodLabel ?? `Ramadhan ${year}`,
    year: seed?.year ?? year,
    description: seed?.description ?? 'Publikasi data pengumpulan dan distribusi dana program masjid.',
    progressLabel: seed?.progressLabel ?? 'Dana Terkumpul',
    collectedAmount: seed?.collectedAmount ?? 0,
    targetAmount: seed?.targetAmount ?? 0,
    relatedLinkLabel: seed?.relatedLinkLabel ?? '',
    relatedLinkUrl: seed?.relatedLinkUrl ?? '',
    isPublished: seed?.isPublished ?? false,
    sortOrder: seed?.sortOrder ?? 0,
    programType: seed?.programType ?? 'generic',
  };
}

function createEmptyMetric(programId: string): Omit<TransparencyMetric, 'id'> {
  return {
    programId,
    label: 'Total Muzaki',
    value: 0,
    valueType: 'number',
    suffix: 'orang',
    note: '',
    sortOrder: 0,
  };
}

function createEmptyDonor(programId: string): Omit<TransparencyDonor, 'id'> {
  return {
    programId,
    donorName: '',
    amount: 0,
    donatedAt: '',
    note: '',
    isAnonymous: false,
    sortOrder: 0,
  };
}

function ProgramListItem({
  program,
  active,
  onClick,
}: {
  program: TransparencyProgram;
  active: boolean;
  onClick: () => void;
}) {
  const progress = program.targetAmount > 0
    ? Math.min(Math.round((program.collectedAmount / program.targetAmount) * 100), 100)
    : 0;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{program.title}</p>
          <p className="mt-1 text-xs text-gray-500">{program.periodLabel}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          program.isPublished
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {program.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {program.isPublished ? 'Publik' : 'Draft'}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{progress}%</span>
        <span>{program.donors.length} donatur</span>
      </div>
    </button>
  );
}

function MetricRow({
  metric,
  disabled,
  onSave,
  onDelete,
}: {
  metric: TransparencyMetric;
  disabled: boolean;
  onSave: (patch: Partial<Omit<TransparencyMetric, 'id' | 'programId'>>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    label: metric.label,
    value: metric.value,
    valueType: metric.valueType,
    suffix: metric.suffix,
    note: metric.note,
    sortOrder: metric.sortOrder,
  });

  useEffect(() => {
    setForm({
      label: metric.label,
      value: metric.value,
      valueType: metric.valueType,
      suffix: metric.suffix,
      note: metric.note,
      sortOrder: metric.sortOrder,
    });
  }, [metric]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Label</label>
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Nilai</label>
          <CurrencyInput
            value={form.value}
            onChange={(val) => setForm(prev => ({ ...prev, value: val }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Tipe</label>
          <select
            value={form.valueType}
            onChange={(e) => setForm({ ...form, valueType: e.target.value as TransparencyMetricType })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          >
            <option value="number">Angka</option>
            <option value="currency">Rupiah</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Suffix</label>
          <input
            value={form.suffix}
            onChange={(e) => setForm({ ...form, suffix: e.target.value })}
            placeholder="orang / paket"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Urutan</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Catatan</label>
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Preview: {form.valueType === 'currency' ? formatCurrency(form.value) : form.value.toLocaleString('id-ID')} {form.suffix}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete()}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function DonorRow({
  donor,
  disabled,
  onSave,
  onDelete,
}: {
  donor: TransparencyDonor;
  disabled: boolean;
  onSave: (patch: Partial<Omit<TransparencyDonor, 'id' | 'programId'>>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    donorName: donor.donorName,
    amount: donor.amount,
    donatedAt: donor.donatedAt,
    note: donor.note,
    isAnonymous: donor.isAnonymous,
    sortOrder: donor.sortOrder,
  });

  useEffect(() => {
    setForm({
      donorName: donor.donorName,
      amount: donor.amount,
      donatedAt: donor.donatedAt,
      note: donor.note,
      isAnonymous: donor.isAnonymous,
      sortOrder: donor.sortOrder,
    });
  }, [donor]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Donatur</label>
          <input
            value={form.donorName}
            onChange={(e) => setForm({ ...form, donorName: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Nominal</label>
          <CurrencyInput
            value={form.amount}
            onChange={(val) => setForm(prev => ({ ...prev, amount: val }))}
            prefix="Rp"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Tanggal</label>
          <input
            type="date"
            value={form.donatedAt}
            onChange={(e) => setForm({ ...form, donatedAt: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Urutan</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Catatan</label>
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Contoh: Transfer Bank / Donasi keluarga"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>
        <label className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={form.isAnonymous}
            onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
          />
          Tampilkan anonim
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Preview nominal: {form.amount > 0 ? formatCurrency(form.amount) : '-'}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete()}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransparencyPage() {
  const {
    transparencyPrograms,
    addTransparencyProgram,
    updateTransparencyProgram,
    deleteTransparencyProgram,
    addTransparencyMetric,
    updateTransparencyMetric,
    deleteTransparencyMetric,
    addTransparencyDonor,
    updateTransparencyDonor,
    deleteTransparencyDonor,
    loadProgramEntries,
    isSaving,
  } = useAdmin();

  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [programForm, setProgramForm] = useState<Omit<TransparencyProgram, 'id' | 'metrics' | 'donors'>>(createEmptyProgram());
  const [metricForm, setMetricForm] = useState<Omit<TransparencyMetric, 'id'>>(createEmptyMetric(''));
  const [donorForm, setDonorForm] = useState<Omit<TransparencyDonor, 'id'>>(createEmptyDonor(''));

  const selectedProgram = transparencyPrograms.find((program) => program.id === selectedProgramId) ?? null;

  useEffect(() => {
    if (!selectedProgramId && transparencyPrograms.length > 0) {
      setSelectedProgramId(transparencyPrograms[0].id);
    }
  }, [selectedProgramId, transparencyPrograms]);

  useEffect(() => {
    if (!selectedProgram) return;

    setProgramForm({
      slug: selectedProgram.slug,
      title: selectedProgram.title,
      badge: selectedProgram.badge,
      category: selectedProgram.category,
      periodLabel: selectedProgram.periodLabel,
      year: selectedProgram.year,
      description: selectedProgram.description,
      progressLabel: selectedProgram.progressLabel,
      collectedAmount: selectedProgram.collectedAmount,
      targetAmount: selectedProgram.targetAmount,
      relatedLinkLabel: selectedProgram.relatedLinkLabel,
      relatedLinkUrl: selectedProgram.relatedLinkUrl,
      isPublished: selectedProgram.isPublished,
      sortOrder: selectedProgram.sortOrder,
      programType: selectedProgram.programType,
    });
    if (selectedProgram.programType !== 'generic') {
      loadProgramEntries(selectedProgram.id, selectedProgram.programType);
    }
    setMetricForm(createEmptyMetric(selectedProgram.id));
    setDonorForm(createEmptyDonor(selectedProgram.id));
  }, [selectedProgram]);

  const handleCreateProgram = async () => {
    const baseTitle = `Dashboard ${new Date().getFullYear()}`;
    const nextProgram = createEmptyProgram({
      title: baseTitle,
      slug: `${slugify(baseTitle)}-${Date.now()}`,
      year: new Date().getFullYear(),
      periodLabel: `Program ${new Date().getFullYear()}`,
    });
    const id = await addTransparencyProgram(nextProgram);
    if (id) {
      setSelectedProgramId(id);
    }
  };

  const handleSaveProgram = async () => {
    if (!selectedProgram) return;
    await updateTransparencyProgram(selectedProgram.id, programForm);
  };

  const handleDeleteProgram = async () => {
    if (!selectedProgram) return;
    const confirmed = window.confirm(`Hapus program "${selectedProgram.title}" beserta seluruh metrik dan donaturnya?`);
    if (!confirmed) return;
    await deleteTransparencyProgram(selectedProgram.id);
    setSelectedProgramId('');
  };

  const progress = programForm.targetAmount > 0
    ? Math.min(Math.round((programForm.collectedAmount / programForm.targetAmount) * 100), 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dashboard Transparansi
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola program ZIS, infaq, sedekah, ringkasan angka, donor, dan link spreadsheet pendukung.
          </p>
        </div>
        <button
          onClick={handleCreateProgram}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Tambah Program
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Daftar Program</p>
            <div className="mt-4 space-y-3">
              {transparencyPrograms.length > 0 ? (
                transparencyPrograms.map((program) => (
                  <ProgramListItem
                    key={program.id}
                    program={program}
                    active={program.id === selectedProgramId}
                    onClick={() => setSelectedProgramId(program.id)}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                  Belum ada program transparansi.
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {selectedProgram ? (
            <>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Program Terpilih</p>
                      <h2 className="mt-2 text-xl font-semibold text-gray-900">{selectedProgram.title}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleDeleteProgram}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus Program
                      </button>
                      <button
                        onClick={handleSaveProgram}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Simpan Program
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Judul Program</label>
                      <input
                        value={programForm.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setProgramForm((prev) => ({
                            ...prev,
                            title,
                            slug: prev.slug ? prev.slug : slugify(title),
                          }));
                        }}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
                      <input
                        value={programForm.slug}
                        onChange={(e) => setProgramForm({ ...programForm, slug: slugify(e.target.value) })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Badge</label>
                      <input
                        value={programForm.badge}
                        onChange={(e) => setProgramForm({ ...programForm, badge: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Kategori</label>
                      <input
                        value={programForm.category}
                        onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                        placeholder="Ramadhan / Idul Adha / ZIS"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Tipe Program</label>
                      <select
                        value={programForm.programType}
                        onChange={(e) => setProgramForm(prev => ({ ...prev, programType: e.target.value as ProgramType }))}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      >
                        <option value="generic">Generic (Metrik + Donatur)</option>
                        <option value="infaq_tarawih">Infaq Rutin Tarawih</option>
                        <option value="santunan_yatim">Santunan Anak Yatim</option>
                        <option value="zis">ZIS (Zakat, Infaq, Sedekah)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Label Periode</label>
                      <input
                        value={programForm.periodLabel}
                        onChange={(e) => setProgramForm({ ...programForm, periodLabel: e.target.value })}
                        placeholder="Ramadhan 1447 H / 2026"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Tahun</label>
                      <input
                        type="number"
                        value={programForm.year}
                        onChange={(e) => setProgramForm({ ...programForm, year: Number(e.target.value) })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                      value={programForm.description}
                      onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Label Progress</label>
                      <input
                        value={programForm.progressLabel}
                        onChange={(e) => setProgramForm({ ...programForm, progressLabel: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Dana Terkumpul</label>
                      <CurrencyInput
                        value={programForm.collectedAmount}
                        onChange={(val) => setProgramForm(prev => ({ ...prev, collectedAmount: val }))}
                        prefix="Rp"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Target Dana</label>
                      <CurrencyInput
                        value={programForm.targetAmount}
                        onChange={(val) => setProgramForm(prev => ({ ...prev, targetAmount: val }))}
                        prefix="Rp"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Urutan</label>
                      <input
                        type="number"
                        value={programForm.sortOrder}
                        onChange={(e) => setProgramForm({ ...programForm, sortOrder: Number(e.target.value) })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr]">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Label Link Terkait</label>
                      <input
                        value={programForm.relatedLinkLabel}
                        onChange={(e) => setProgramForm({ ...programForm, relatedLinkLabel: e.target.value })}
                        placeholder="Buka spreadsheet tim zakat"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">URL Link Terkait</label>
                      <input
                        value={programForm.relatedLinkUrl}
                        onChange={(e) => setProgramForm({ ...programForm, relatedLinkUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={programForm.isPublished}
                      onChange={(e) => setProgramForm({ ...programForm, isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                    />
                    Tampilkan di website publik
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-6 text-white">
                    <p className="text-sm font-medium text-emerald-200">Preview Progress</p>
                    <p className="mt-3 font-display text-4xl font-bold">{progress}%</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full bg-amber-300" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-4 text-sm text-emerald-100">
                      {formatCurrency(programForm.collectedAmount)} dari {programForm.targetAmount > 0 ? formatCurrency(programForm.targetAmount) : 'target belum diisi'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Donatur Tercatat</p>
                        <p className="text-xs text-gray-500">{selectedProgram.donors.length} entri publik</p>
                      </div>
                    </div>
                  </div>

                  {programForm.relatedLinkUrl && (
                    <a
                      href={programForm.relatedLinkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-200 hover:text-emerald-700"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        {programForm.relatedLinkLabel || 'Buka link terkait'}
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Ringkasan Angka</p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">Metric Cards Program</h3>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                    {selectedProgram.metrics.length} metrik
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                  <div className="xl:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Label</label>
                    <input
                      value={metricForm.label}
                      onChange={(e) => setMetricForm({ ...metricForm, label: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nilai</label>
                    <CurrencyInput
                      value={metricForm.value}
                      onChange={(val) => setMetricForm(prev => ({ ...prev, value: val }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Tipe</label>
                    <select
                      value={metricForm.valueType}
                      onChange={(e) => setMetricForm({ ...metricForm, valueType: e.target.value as TransparencyMetricType })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="number">Angka</option>
                      <option value="currency">Rupiah</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Suffix</label>
                    <input
                      value={metricForm.suffix}
                      onChange={(e) => setMetricForm({ ...metricForm, suffix: e.target.value })}
                      placeholder="orang / paket"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Urutan</label>
                    <input
                      type="number"
                      value={metricForm.sortOrder}
                      onChange={(e) => setMetricForm({ ...metricForm, sortOrder: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Catatan</label>
                    <input
                      value={metricForm.note}
                      onChange={(e) => setMetricForm({ ...metricForm, note: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <button
                    onClick={() => addTransparencyMetric(metricForm)}
                    disabled={isSaving}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Metrik
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedProgram.metrics.length > 0 ? (
                    selectedProgram.metrics.map((metric) => (
                      <MetricRow
                        key={metric.id}
                        metric={metric}
                        disabled={isSaving}
                        onSave={(patch) => updateTransparencyMetric(metric.id, patch)}
                        onDelete={() => deleteTransparencyMetric(metric.id)}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                      Belum ada metrik untuk program ini.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Daftar Donatur</p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">Transparansi Donatur Publik</h3>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                    {selectedProgram.donors.length} donatur
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nama Donatur</label>
                    <input
                      value={donorForm.donorName}
                      onChange={(e) => setDonorForm({ ...donorForm, donorName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nominal</label>
                    <CurrencyInput
                      value={donorForm.amount}
                      onChange={(val) => setDonorForm(prev => ({ ...prev, amount: val }))}
                      prefix="Rp"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal</label>
                    <input
                      type="date"
                      value={donorForm.donatedAt}
                      onChange={(e) => setDonorForm({ ...donorForm, donatedAt: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Urutan</label>
                    <input
                      type="number"
                      value={donorForm.sortOrder}
                      onChange={(e) => setDonorForm({ ...donorForm, sortOrder: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_auto]">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Catatan</label>
                    <input
                      value={donorForm.note}
                      onChange={(e) => setDonorForm({ ...donorForm, note: e.target.value })}
                      placeholder="Contoh: Transfer keluarga / list manual"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <label className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={donorForm.isAnonymous}
                      onChange={(e) => setDonorForm({ ...donorForm, isAnonymous: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/30"
                    />
                    Anonim
                  </label>
                  <button
                    onClick={() => addTransparencyDonor(donorForm)}
                    disabled={isSaving}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Donatur
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedProgram.donors.length > 0 ? (
                    selectedProgram.donors.map((donor) => (
                      <DonorRow
                        key={donor.id}
                        donor={donor}
                        disabled={isSaving}
                        onSave={(patch) => updateTransparencyDonor(donor.id, patch)}
                        onDelete={() => deleteTransparencyDonor(donor.id)}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                      Belum ada donatur untuk program ini.
                    </div>
                  )}
                </div>
              </div>

              {programForm.programType === 'infaq_tarawih' && (
                <InfaqTarawihSection programId={selectedProgram.id} />
              )}
              {programForm.programType === 'santunan_yatim' && (
                <SantunanYatimSection programId={selectedProgram.id} />
              )}
              {programForm.programType === 'zis' && (
                <ZisSection programId={selectedProgram.id} />
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Wallet className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">Belum ada program transparansi</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
                Tambahkan program pertama untuk mulai menampilkan dashboard pengumpulan ZIS, infaq sedekah Ramadhan, atau dashboard transparansi lainnya di website.
              </p>
              <button
                onClick={handleCreateProgram}
                disabled={isSaving}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Tambah Program Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
