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
} from '../../data/types';
import * as api from '../../services/api';
import { invalidateCache } from '../../services/cache';

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
  deleteGalleryItem: (id: string) => Promise<void>;

  donation: DonationConfig;
  setDonation: (data: DonationConfig) => Promise<void>;

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
  const [boardList, setBoardList] = useState<BoardMember[]>([]);
  const [footer, setFooterState] = useState<FooterData>(defaultFooter);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);

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
        const [h, c, ag, ar, gl, bd, dn, ft] = await Promise.all([
          api.fetchHero(), api.fetchCountdown(), api.fetchAgenda(), api.fetchArticles(),
          api.fetchGallery(), api.fetchBoard(), api.fetchDonation(), api.fetchFooter(),
        ]);
        setHeroState(h);
        setCountdownState(c);
        setAgendaList(ag);
        setArticleList(ar);
        setGalleryList(gl);
        setBoardList(bd);
        setDonationState(dn);
        setFooterState(ft);
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
      showToast('Foto berhasil ditambahkan');
    } catch (err) {
      showToast('Gagal menambahkan foto: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const deleteGalleryItem = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await api.deleteGalleryItem(id);
      setGalleryList(prev => prev.filter(g => g.id !== id));
      invalidateCache();
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
      showToast('Donasi berhasil diperbarui');
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err as Error).message, 'error');
    } finally { setIsSaving(false); }
  }, [showToast]);

  const addBoardMember = useCallback(async (item: Omit<BoardMember, 'id'>) => {
    try {
      setIsSaving(true);
      const result = await api.addBoardMember(item);
      setBoardList(prev => [...prev, { ...item, id: result.id, image: result.imageUrl || item.image } as BoardMember]);
      invalidateCache();
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

  return (
    <AdminContext.Provider value={{
      currentPage, setCurrentPage,
      isLoading, isInitialized, isSaving,
      hero, setHero,
      countdown, setCountdown,
      agendaList, addAgenda, updateAgenda, deleteAgenda,
      articleList, addArticle, updateArticle, deleteArticle,
      galleryList, addGalleryItem, deleteGalleryItem,
      donation, setDonation,
      boardList, addBoardMember, updateBoardMember, deleteBoardMember,
      footer, setFooter,
      dashboardData, loadDashboard,
      activityLog, loadActivityLog,
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
