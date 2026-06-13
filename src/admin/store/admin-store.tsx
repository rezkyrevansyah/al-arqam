import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  AgendaItem,
  Article,
  GalleryItem,
  ManagementMember,
  DonationConfig,
  CountdownEvent,
  HeroData,
  FooterData,
  DashboardData,
  ActivityLogItem,
  TransparencyDonor,
  TransparencyMetric,
  TransparencyProgram,
  Category,
  CategoryEntityType,
  InfaqTarawihEntry,
  SantunanYatimEntry,
  ZisEntry,
} from '../../data/types';
import * as api from '../../services/api';
import { invalidateCache } from '../../services/cache';

async function revalidateSiteData() {
  try {
    await fetch('/api/revalidate', { method: 'POST' });
  } catch {
    // Non-critical: revalidation failure doesn't block the save
  }
}

// Type alias for compatibility
export type BoardMember = ManagementMember;
export type Agenda = AgendaItem;

export type AdminPage =
  | 'dashboard'
  | 'hero'
  | 'countdown'
  | 'agenda'
  | 'artikel'
  | 'galeri'
  | 'donasi'
  | 'transparansi'
  | 'pengurus'
  | 'footer';

interface AdminState {
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;

  isLoading: boolean;
  isInitialized: boolean;
  isSaving: boolean;

  hero: HeroData;
  setHero: (data: HeroData) => Promise<void>;

  countdown: CountdownEvent;
  setCountdown: (data: CountdownEvent) => Promise<void>;

  agendaList: AgendaItem[];
  addAgenda: (item: Omit<AgendaItem, 'id'>) => Promise<void>;
  updateAgenda: (id: string, item: Partial<AgendaItem>) => Promise<void>;
  deleteAgenda: (id: string) => Promise<void>;

  articleList: Article[];
  addArticle: (item: Omit<Article, 'id'>) => Promise<void>;
  updateArticle: (id: string, item: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  galleryList: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  donation: DonationConfig;
  setDonation: (data: DonationConfig) => Promise<void>;

  transparencyPrograms: TransparencyProgram[];
  addTransparencyProgram: (item: Omit<TransparencyProgram, 'id' | 'metrics' | 'donors'>) => Promise<string | null>;
  updateTransparencyProgram: (id: string, item: Partial<Omit<TransparencyProgram, 'id' | 'metrics' | 'donors'>>) => Promise<void>;
  deleteTransparencyProgram: (id: string) => Promise<void>;
  addTransparencyMetric: (item: Omit<TransparencyMetric, 'id'>) => Promise<void>;
  updateTransparencyMetric: (id: string, item: Partial<Omit<TransparencyMetric, 'id' | 'programId'>>) => Promise<void>;
  deleteTransparencyMetric: (id: string) => Promise<void>;
  addTransparencyDonor: (item: Omit<TransparencyDonor, 'id'>) => Promise<void>;
  updateTransparencyDonor: (id: string, item: Partial<Omit<TransparencyDonor, 'id' | 'programId'>>) => Promise<void>;
  deleteTransparencyDonor: (id: string) => Promise<void>;

  // Categories
  agendaCategories: Category[];
  articleCategories: Category[];
  loadCategories: (entityType: CategoryEntityType) => Promise<void>;
  addCategory: (item: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (item: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Typed program entries (loaded on-demand per program)
  infaqEntries: InfaqTarawihEntry[];
  santunanEntries: SantunanYatimEntry[];
  zisEntries: ZisEntry[];
  loadProgramEntries: (programId: string, programType: string) => Promise<void>;
  addInfaqEntry: (item: Omit<InfaqTarawihEntry, 'id'>) => Promise<void>;
  updateInfaqEntry: (item: InfaqTarawihEntry) => Promise<void>;
  deleteInfaqEntry: (id: string) => Promise<void>;
  addSantunanEntry: (item: Omit<SantunanYatimEntry, 'id'>) => Promise<void>;
  updateSantunanEntry: (item: SantunanYatimEntry) => Promise<void>;
  deleteSantunanEntry: (id: string) => Promise<void>;
  addZisEntry: (item: Omit<ZisEntry, 'id'>) => Promise<void>;
  updateZisEntry: (item: ZisEntry) => Promise<void>;
  deleteZisEntry: (id: string) => Promise<void>;

  boardList: BoardMember[];
  addBoardMember: (item: Omit<BoardMember, 'id'>) => Promise<void>;
  updateBoardMember: (id: string, item: Partial<BoardMember>) => Promise<void>;
  deleteBoardMember: (id: string) => Promise<void>;

  footer: FooterData;
  setFooter: (data: FooterData) => Promise<void>;

  dashboardData: DashboardData | null;
  loadDashboard: () => Promise<void>;
  activityLog: ActivityLogItem[];
  loadActivityLog: () => Promise<void>;

  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AdminContext = createContext<AdminState | null>(null);

const defaultHero: HeroData = { title: '', subtitle: '', description: '' };
const defaultCountdown: CountdownEvent = { name: '', date: '', description: '', active: false };
const defaultDonation: DonationConfig = {
  bankAccountNumber: '', bankAccountName: '', bankName: '',
  donationCollected: 0, donationTarget: 0, qrisImageUrl: '',
};
const defaultFooter: FooterData = {
  address: '', phone: '', email: '', mapsUrl: '', socials: [],
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [hero, setHeroState] = useState<HeroData>(defaultHero);
  const [countdown, setCountdownState] = useState<CountdownEvent>(defaultCountdown);
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [donation, setDonationState] = useState<DonationConfig>(defaultDonation);
  const [transparencyPrograms, setTransparencyPrograms] = useState<TransparencyProgram[]>([]);
  const [boardList, setBoardList] = useState<BoardMember[]>([]);
  const [footer, setFooterState] = useState<FooterData>(defaultFooter);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [agendaCategories, setAgendaCategories] = useState<Category[]>([]);
  const [articleCategories, setArticleCategories] = useState<Category[]>([]);
  const [infaqEntries, setInfaqEntries] = useState<InfaqTarawihEntry[]>([]);
  const [santunanEntries, setSantunanEntries] = useState<SantunanYatimEntry[]>([]);
  const [zisEntries, setZisEntries] = useState<ZisEntry[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Initialize from API
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [h, c, ag, ar, gl, bd, dn, tp, ft] = await Promise.all([
          api.fetchHero(), api.fetchCountdown(), api.fetchAgenda(), api.fetchArticles(),
          api.fetchGallery(), api.fetchBoard(), api.fetchDonation(), api.fetchTransparencyPrograms(), api.fetchFooter(),
        ]);
        setHeroState(h);
        setCountdownState(c);
        setAgendaList(ag);
        setArticleList(ar);
        setGalleryList(gl);
        setBoardList(bd);
        setDonationState(dn);
        setTransparencyPrograms(tp);
        setFooterState(ft);
        // Load categories in parallel
        await Promise.all([
          api.fetchCategories('agenda').then(setAgendaCategories),
          api.fetchCategories('article').then(setArticleCategories),
        ]);
        setIsInitialized(true);
      } catch (err) {
        showToast('Gagal memuat data: ' + (err as Error).message, 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const setHero = useCallback(async (data: HeroData) => {
    try {
      setIsSaving(true);
      await api.saveHero(data);
      setHeroState(data);
      invalidateCache();
      await revalidateSiteData();
      showToast('Hero section berhasil diperbarui');
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const setCountdown = useCallback(async (data: CountdownEvent) => {
    try {
      setIsSaving(true);
      await api.saveCountdown(data);
      setCountdownState(data);
      invalidateCache();
      await revalidateSiteData();
      showToast('Countdown berhasil diperbarui');
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addAgenda = useCallback(async (item: Omit<AgendaItem, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addAgenda(item);
      setAgendaList(prev => [{ ...item, id: result.id } as AgendaItem, ...prev]);
      invalidateCache();
      await revalidateSiteData();
      showToast('Agenda berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan agenda: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateAgenda = useCallback(async (id: string, item: Partial<AgendaItem>) => {
    try {
      setIsSaving(true);
      const existing = agendaList.find(a => a.id === id);
      if (!existing) return;
      const updated = { ...existing, ...item };
      await api.updateAgenda(updated);
      setAgendaList(prev => prev.map(a => a.id === id ? updated : a));
      invalidateCache();
      await revalidateSiteData();
      showToast('Agenda berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui agenda: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast, agendaList]);

  const deleteAgenda = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteAgenda(id);
      setAgendaList(prev => prev.filter(a => a.id !== id));
      invalidateCache();
      await revalidateSiteData();
      showToast('Agenda berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus agenda: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addArticle = useCallback(async (item: Omit<Article, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addArticle(item);
      setArticleList(prev => [{ ...item, id: result.id, image: result.imageUrl || item.image } as Article, ...prev]);
      invalidateCache();
      await revalidateSiteData();
      showToast('Artikel berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan artikel: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateArticle = useCallback(async (id: string, item: Partial<Article>) => {
    try {
      setIsSaving(true);
      const existing = articleList.find(a => a.id === id);
      if (!existing) return;
      const updated = { ...existing, ...item };
      const result = await api.updateArticle(updated);
      if (result.imageUrl) updated.image = result.imageUrl;
      setArticleList(prev => prev.map(a => a.id === id ? updated : a));
      invalidateCache();
      await revalidateSiteData();
      showToast('Artikel berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui artikel: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast, articleList]);

  const deleteArticle = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteArticle(id);
      setArticleList(prev => prev.filter(a => a.id !== id));
      invalidateCache();
      await revalidateSiteData();
      showToast('Artikel berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus artikel: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addGalleryItem = useCallback(async (item: Omit<GalleryItem, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addGalleryItem(item);
      setGalleryList(prev => [{ ...item, id: result.id, image: result.imageUrl || item.image } as GalleryItem, ...prev]);
      invalidateCache();
      await revalidateSiteData();
      showToast('Foto berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan foto: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateGalleryItem = useCallback(async (id: string, item: Partial<GalleryItem>) => {
    try {
      setIsSaving(true);
      const existing = galleryList.find(g => g.id === id);
      if (!existing) {
        showToast('Foto tidak ditemukan', 'error');
        return;
      }
      const updated = { ...existing, ...item };
      await api.updateGalleryItem(updated);
      setGalleryList(prev => prev.map(g => g.id === id ? updated : g));
      invalidateCache();
      await revalidateSiteData();
      showToast('Foto berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui foto: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast, galleryList]);

  const deleteGalleryItem = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteGalleryItem(id);
      setGalleryList(prev => prev.filter(g => g.id !== id));
      invalidateCache();
      await revalidateSiteData();
      showToast('Foto berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus foto: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const setDonation = useCallback(async (data: DonationConfig) => {
    try {
      setIsSaving(true);
      const result = await api.saveDonation(data);
      if (result.qrisImageUrl) data.qrisImageUrl = result.qrisImageUrl;
      setDonationState(data);
      invalidateCache();
      await revalidateSiteData();
      showToast('Donasi berhasil diperbarui');
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addTransparencyProgram = useCallback(async (item: Omit<TransparencyProgram, 'id' | 'metrics' | 'donors'>) => {
    try {
      setIsSaving(true);
      const result = await api.addTransparencyProgram(item);
      const createdProgram: TransparencyProgram = {
        ...item,
        id: result.id,
        metrics: [],
        donors: [],
      };
      setTransparencyPrograms(prev =>
        [...prev, createdProgram].sort((a, b) => (b.year - a.year) || (a.sortOrder - b.sortOrder))
      );
      await revalidateSiteData();
      showToast('Program transparansi berhasil ditambahkan');
      return result.id;
    } catch (err) {
      showToast('Gagal menambahkan program transparansi: ' + (err as Error).message, 'error');
      return null;
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateTransparencyProgram = useCallback(async (
    id: string,
    item: Partial<Omit<TransparencyProgram, 'id' | 'metrics' | 'donors'>>
  ) => {
    try {
      setIsSaving(true);
      const existing = transparencyPrograms.find(program => program.id === id);
      if (!existing) return;
      const updated: TransparencyProgram = { ...existing, ...item };
      await api.updateTransparencyProgram({
        id: updated.id,
        slug: updated.slug,
        title: updated.title,
        badge: updated.badge,
        category: updated.category,
        periodLabel: updated.periodLabel,
        year: updated.year,
        description: updated.description,
        progressLabel: updated.progressLabel,
        collectedAmount: updated.collectedAmount,
        targetAmount: updated.targetAmount,
        relatedLinkLabel: updated.relatedLinkLabel,
        relatedLinkUrl: updated.relatedLinkUrl,
        isPublished: updated.isPublished,
        showDonors: updated.showDonors,
        showMuzakkiList: updated.showMuzakkiList,
        sortOrder: updated.sortOrder,
        programType: updated.programType,
      });
      setTransparencyPrograms(prev =>
        prev
          .map(program => (program.id === id ? updated : program))
          .sort((a, b) => (b.year - a.year) || (a.sortOrder - b.sortOrder))
      );
      await revalidateSiteData();
      showToast('Program transparansi berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui program transparansi: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast, transparencyPrograms]);

  const deleteTransparencyProgram = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteTransparencyProgram(id);
      setTransparencyPrograms(prev => prev.filter(program => program.id !== id));
      await revalidateSiteData();
      showToast('Program transparansi berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus program transparansi: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addTransparencyMetric = useCallback(async (item: Omit<TransparencyMetric, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addTransparencyMetric(item);
      const createdMetric: TransparencyMetric = { ...item, id: result.id };
      setTransparencyPrograms(prev =>
        prev.map(program =>
          program.id === item.programId
            ? {
                ...program,
                metrics: [...program.metrics, createdMetric].sort((a, b) => a.sortOrder - b.sortOrder),
              }
            : program
        )
      );
      await revalidateSiteData();
      showToast('Metrik transparansi berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan metrik transparansi: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateTransparencyMetric = useCallback(async (
    id: string,
    item: Partial<Omit<TransparencyMetric, 'id' | 'programId'>>
  ) => {
    try {
      setIsSaving(true);
      const existing = transparencyPrograms
        .flatMap(program => program.metrics)
        .find(metric => metric.id === id);
      if (!existing) return;
      const updated: TransparencyMetric = { ...existing, ...item };
      await api.updateTransparencyMetric(updated);
      setTransparencyPrograms(prev =>
        prev.map(program => ({
          ...program,
          metrics: program.metrics
            .map(metric => (metric.id === id ? updated : metric))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }))
      );
      await revalidateSiteData();
      showToast('Metrik transparansi berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui metrik transparansi: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast, transparencyPrograms]);

  const deleteTransparencyMetric = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteTransparencyMetric(id);
      setTransparencyPrograms(prev =>
        prev.map(program => ({
          ...program,
          metrics: program.metrics.filter(metric => metric.id !== id),
        }))
      );
      await revalidateSiteData();
      showToast('Metrik transparansi berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus metrik transparansi: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addTransparencyDonor = useCallback(async (item: Omit<TransparencyDonor, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addTransparencyDonor(item);
      const createdDonor: TransparencyDonor = { ...item, id: result.id };
      setTransparencyPrograms(prev =>
        prev.map(program =>
          program.id === item.programId
            ? {
                ...program,
                donors: [...program.donors, createdDonor].sort((a, b) => a.sortOrder - b.sortOrder),
              }
            : program
        )
      );
      await revalidateSiteData();
      showToast('Donatur berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan donatur: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateTransparencyDonor = useCallback(async (
    id: string,
    item: Partial<Omit<TransparencyDonor, 'id' | 'programId'>>
  ) => {
    try {
      setIsSaving(true);
      const existing = transparencyPrograms
        .flatMap(program => program.donors)
        .find(donor => donor.id === id);
      if (!existing) return;
      const updated: TransparencyDonor = { ...existing, ...item };
      await api.updateTransparencyDonor(updated);
      setTransparencyPrograms(prev =>
        prev.map(program => ({
          ...program,
          donors: program.donors
            .map(donor => (donor.id === id ? updated : donor))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }))
      );
      await revalidateSiteData();
      showToast('Donatur berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui donatur: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast, transparencyPrograms]);

  const deleteTransparencyDonor = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteTransparencyDonor(id);
      setTransparencyPrograms(prev =>
        prev.map(program => ({
          ...program,
          donors: program.donors.filter(donor => donor.id !== id),
        }))
      );
      await revalidateSiteData();
      showToast('Donatur berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus donatur: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addBoardMember = useCallback(async (item: Omit<BoardMember, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addBoardMember(item);
      setBoardList(prev => [...prev, { ...item, id: result.id, image: result.imageUrl || item.image } as BoardMember]);
      invalidateCache();
      await revalidateSiteData();
      showToast('Pengurus berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan pengurus: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateBoardMember = useCallback(async (id: string, item: Partial<BoardMember>) => {
    try {
      setIsSaving(true);
      const existing = boardList.find(b => b.id === id);
      if (!existing) return;
      const updated = { ...existing, ...item };
      const result = await api.updateBoardMember(updated);
      if (result.imageUrl) updated.image = result.imageUrl;
      setBoardList(prev => prev.map(b => b.id === id ? updated : b));
      invalidateCache();
      await revalidateSiteData();
      showToast('Pengurus berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui pengurus: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast, boardList]);

  const deleteBoardMember = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteBoardMember(id);
      setBoardList(prev => prev.filter(b => b.id !== id));
      invalidateCache();
      await revalidateSiteData();
      showToast('Pengurus berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus pengurus: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const setFooter = useCallback(async (data: FooterData) => {
    try {
      setIsSaving(true);
      await api.saveFooter(data);
      setFooterState(data);
      invalidateCache();
      await revalidateSiteData();
      showToast('Footer berhasil diperbarui');
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const loadDashboard = useCallback(async () => {
    try {
      const data = await api.fetchDashboard();
      setDashboardData(data);
    } catch (err) {
      showToast('Gagal memuat dashboard: ' + (err as Error).message, 'error');
    }
  }, [showToast]);

  const loadActivityLog = useCallback(async () => {
    try {
      const logs = await api.fetchActivityLog(10);
      setActivityLog(logs);
    } catch {
      // silently fail
    }
  }, []);

  const loadCategories = useCallback(async (entityType: CategoryEntityType) => {
    try {
      const cats = await api.fetchCategories(entityType);
      if (entityType === 'agenda') setAgendaCategories(cats);
      if (entityType === 'article') setArticleCategories(cats);
    } catch (err) {
      showToast('Gagal memuat kategori: ' + (err as Error).message, 'error');
    }
  }, [showToast]);

  const addCategory = useCallback(async (item: Omit<Category, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addCategory(item);
      const created: Category = { ...item, id: result.id };
      if (item.entityType === 'agenda') setAgendaCategories(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      if (item.entityType === 'article') setArticleCategories(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      await revalidateSiteData();
      showToast('Kategori berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan kategori: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateCategory = useCallback(async (item: Category) => {
    try {
      setIsSaving(true);
      await api.updateCategory(item);
      const update = (prev: Category[]) => prev.map(c => c.id === item.id ? item : c);
      if (item.entityType === 'agenda') setAgendaCategories(update);
      if (item.entityType === 'article') setArticleCategories(update);
      await revalidateSiteData();
      showToast('Kategori berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memperbarui kategori: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteCategory(id);
      setAgendaCategories(prev => prev.filter(c => c.id !== id));
      setArticleCategories(prev => prev.filter(c => c.id !== id));
      await revalidateSiteData();
      showToast('Kategori berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus kategori: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const loadProgramEntries = useCallback(async (programId: string, programType: string) => {
    try {
      if (programType === 'infaq_tarawih') {
        const entries = await api.fetchInfaqTarawihEntries(programId);
        setInfaqEntries(entries);
      } else if (programType === 'santunan_yatim') {
        const entries = await api.fetchSantunanYatimEntries(programId);
        setSantunanEntries(entries);
      } else if (programType === 'zis') {
        const entries = await api.fetchZisEntries(programId);
        setZisEntries(entries);
      }
    } catch (err) {
      showToast('Gagal memuat data: ' + (err as Error).message, 'error');
    }
  }, [showToast]);

  const addInfaqEntry = useCallback(async (item: Omit<InfaqTarawihEntry, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addInfaqTarawihEntry(item);
      setInfaqEntries(prev => [...prev, { ...item, id: result.id }].sort((a, b) => a.malamKe - b.malamKe));
      await revalidateSiteData();
      showToast('Data infaq berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateInfaqEntry = useCallback(async (item: InfaqTarawihEntry) => {
    try {
      setIsSaving(true);
      await api.updateInfaqTarawihEntry(item);
      setInfaqEntries(prev => prev.map(e => e.id === item.id ? item : e).sort((a, b) => a.malamKe - b.malamKe));
      await revalidateSiteData();
      showToast('Data infaq diperbarui');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const deleteInfaqEntry = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteInfaqTarawihEntry(id);
      setInfaqEntries(prev => prev.filter(e => e.id !== id));
      await revalidateSiteData();
      showToast('Data infaq dihapus');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addSantunanEntry = useCallback(async (item: Omit<SantunanYatimEntry, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addSantunanYatimEntry(item);
      setSantunanEntries(prev => [...prev, { ...item, id: result.id }]);
      await revalidateSiteData();
      showToast('Donatur santunan berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateSantunanEntry = useCallback(async (item: SantunanYatimEntry) => {
    try {
      setIsSaving(true);
      await api.updateSantunanYatimEntry(item);
      setSantunanEntries(prev => prev.map(e => e.id === item.id ? item : e));
      await revalidateSiteData();
      showToast('Data santunan diperbarui');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const deleteSantunanEntry = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteSantunanYatimEntry(id);
      setSantunanEntries(prev => prev.filter(e => e.id !== id));
      await revalidateSiteData();
      showToast('Data santunan dihapus');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addZisEntry = useCallback(async (item: Omit<ZisEntry, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addZisEntry(item);
      setZisEntries(prev => [...prev, { ...item, id: result.id }]);
      await revalidateSiteData();
      showToast('Data ZIS berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const updateZisEntry = useCallback(async (item: ZisEntry) => {
    try {
      setIsSaving(true);
      await api.updateZisEntry(item);
      setZisEntries(prev => prev.map(e => e.id === item.id ? item : e));
      await revalidateSiteData();
      showToast('Data ZIS diperbarui');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const deleteZisEntry = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteZisEntry(id);
      setZisEntries(prev => prev.filter(e => e.id !== id));
      await revalidateSiteData();
      showToast('Data ZIS dihapus');
    } catch (err) {
      showToast('Gagal: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  return (
    <AdminContext.Provider value={{
      currentPage, setCurrentPage,
      isLoading, isInitialized, isSaving,
      hero, setHero,
      countdown, setCountdown,
      agendaList, addAgenda, updateAgenda, deleteAgenda,
      articleList, addArticle, updateArticle, deleteArticle,
      galleryList, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      donation, setDonation,
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
      boardList, addBoardMember, updateBoardMember, deleteBoardMember,
      footer, setFooter,
      dashboardData, loadDashboard,
      activityLog, loadActivityLog,
      agendaCategories, articleCategories,
      loadCategories, addCategory, updateCategory, deleteCategory,
      infaqEntries, santunanEntries, zisEntries,
      loadProgramEntries,
      addInfaqEntry, updateInfaqEntry, deleteInfaqEntry,
      addSantunanEntry, updateSantunanEntry, deleteSantunanEntry,
      addZisEntry, updateZisEntry, deleteZisEntry,
      toast, showToast,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be within AdminProvider');
  return ctx;
}
