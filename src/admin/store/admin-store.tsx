import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  AgendaItem,
  Article,
  GalleryItem,
  ManagementMember,
  DonationConfig,
  ContactInfo,
  SocialLink,
  CountdownEvent,
} from '../../data/types';
import {
  AGENDA_DATA,
  ARTICLES_DATA,
  GALLERY_DATA,
  MANAGEMENT_DATA,
  SOCIAL_LINKS,
  CONTACT_INFO,
  ISRA_MIRAJ_DATE,
  BANK_ACCOUNT_NUMBER,
  BANK_ACCOUNT_NAME,
  DONATION_COLLECTED,
  DONATION_TARGET,
  QRIS_IMAGE_PATH,
  QRIS_DOWNLOAD_FILENAME,
} from '../../data/constants';

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

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
}

interface FooterData {
  address: string;
  mapsLink: string;
  phone: string;
  email: string;
  socials: { platform: string; url: string }[];
}

interface AdminState {
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;

  hero: HeroData;
  setHero: (data: HeroData) => void;

  countdown: CountdownEvent;
  setCountdown: (data: CountdownEvent) => void;

  agendaList: AgendaItem[];
  addAgenda: (item: Omit<AgendaItem, 'id'>) => void;
  updateAgenda: (id: string, item: Partial<AgendaItem>) => void;
  deleteAgenda: (id: string) => void;

  articleList: Article[];
  addArticle: (item: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, item: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  galleryList: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  donation: DonationConfig;
  setDonation: (data: DonationConfig) => void;

  boardList: BoardMember[];
  addBoardMember: (item: Omit<BoardMember, 'id'>) => void;
  updateBoardMember: (id: string, item: Partial<BoardMember>) => void;
  deleteBoardMember: (id: string) => void;

  footer: FooterData;
  setFooter: (data: FooterData) => void;

  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AdminContext = createContext<AdminState | null>(null);

let idCounter = 1000;
const genId = () => String(++idCounter);

// Data adapters
const createFooterData = (contact: ContactInfo, socials: SocialLink[]): FooterData => ({
  address: contact.address,
  mapsLink: contact.mapsUrl,
  phone: contact.phone,
  email: contact.email,
  socials: socials.map(s => ({ platform: s.platform, url: s.url })),
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

  // Hero section (hardcoded for now - could be made editable in future)
  const [hero, setHeroState] = useState<HeroData>({
    title: "Masjid Jami' Al-Arqom",
    subtitle: "Memakmurkan Masjid, Membangun Umat",
    description: "Pusat kegiatan ibadah dan dakwah di Bekasi Utara. Bersama kita tingkatkan kualitas iman dan ketaqwaan.",
  });

  // Countdown
  const [countdown, setCountdownState] = useState<CountdownEvent>({
    name: "Isra Mi'raj Nabi Muhammad SAW",
    date: ISRA_MIRAJ_DATE,
    description: "Memperingati perjalanan agung Rasulullah SAW dari Masjidil Haram ke Masjidil Aqsa dan naik ke Sidratul Muntaha",
  });

  // Agenda
  const [agendaList, setAgendaList] = useState<AgendaItem[]>(AGENDA_DATA);

  // Articles
  const [articleList, setArticleList] = useState<Article[]>(ARTICLES_DATA);

  // Gallery
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(GALLERY_DATA);

  // Donation (dengan adapter)
  const [donation, setDonationState] = useState<DonationConfig>({
    bankAccountNumber: BANK_ACCOUNT_NUMBER,
    bankAccountName: BANK_ACCOUNT_NAME,
    bankName: "Bank Syariah Indonesia (BSI)",
    donationCollected: DONATION_COLLECTED,
    donationTarget: DONATION_TARGET,
    qrisImagePath: QRIS_IMAGE_PATH,
    qrisDownloadFilename: QRIS_DOWNLOAD_FILENAME,
  });

  // Board members
  const [boardList, setBoardList] = useState<BoardMember[]>(MANAGEMENT_DATA);

  // Footer (dengan adapter)
  const [footer, setFooterState] = useState<FooterData>(
    createFooterData(CONTACT_INFO, SOCIAL_LINKS)
  );

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const setHero = useCallback((data: HeroData) => {
    setHeroState(data);
    showToast('Hero section berhasil diperbarui');
  }, [showToast]);

  const setCountdown = useCallback((data: CountdownEvent) => {
    setCountdownState(data);
    showToast('Countdown berhasil diperbarui');
  }, [showToast]);

  const addAgenda = useCallback((item: Omit<AgendaItem, 'id'>) => {
    setAgendaList(prev => [{ ...item, id: genId() } as AgendaItem, ...prev]);
    showToast('Agenda berhasil ditambahkan');
  }, [showToast]);

  const updateAgenda = useCallback((id: string, item: Partial<AgendaItem>) => {
    setAgendaList(prev => prev.map(a => a.id === id ? { ...a, ...item } : a));
    showToast('Agenda berhasil diperbarui');
  }, [showToast]);

  const deleteAgenda = useCallback((id: string) => {
    setAgendaList(prev => prev.filter(a => a.id !== id));
    showToast('Agenda berhasil dihapus');
  }, [showToast]);

  const addArticle = useCallback((item: Omit<Article, 'id'>) => {
    setArticleList(prev => [{ ...item, id: genId() } as Article, ...prev]);
    showToast('Artikel berhasil ditambahkan');
  }, [showToast]);

  const updateArticle = useCallback((id: string, item: Partial<Article>) => {
    setArticleList(prev => prev.map(a => a.id === id ? { ...a, ...item } : a));
    showToast('Artikel berhasil diperbarui');
  }, [showToast]);

  const deleteArticle = useCallback((id: string) => {
    setArticleList(prev => prev.filter(a => a.id !== id));
    showToast('Artikel berhasil dihapus');
  }, [showToast]);

  const addGalleryItem = useCallback((item: Omit<GalleryItem, 'id'>) => {
    setGalleryList(prev => [{ ...item, id: genId() } as GalleryItem, ...prev]);
    showToast('Foto berhasil ditambahkan');
  }, [showToast]);

  const deleteGalleryItem = useCallback((id: string) => {
    setGalleryList(prev => prev.filter(g => g.id !== id));
    showToast('Foto berhasil dihapus');
  }, [showToast]);

  const setDonation = useCallback((data: DonationConfig) => {
    setDonationState(data);
    showToast('Donasi berhasil diperbarui');
  }, [showToast]);

  const addBoardMember = useCallback((item: Omit<BoardMember, 'id'>) => {
    setBoardList(prev => [...prev, { ...item, id: genId() } as BoardMember]);
    showToast('Pengurus berhasil ditambahkan');
  }, [showToast]);

  const updateBoardMember = useCallback((id: string, item: Partial<BoardMember>) => {
    setBoardList(prev => prev.map(b => b.id === id ? { ...b, ...item } : b));
    showToast('Pengurus berhasil diperbarui');
  }, [showToast]);

  const deleteBoardMember = useCallback((id: string) => {
    setBoardList(prev => prev.filter(b => b.id !== id));
    showToast('Pengurus berhasil dihapus');
  }, [showToast]);

  const setFooter = useCallback((data: FooterData) => {
    setFooterState(data);
    showToast('Footer berhasil diperbarui');
  }, [showToast]);

  return (
    <AdminContext.Provider value={{
      currentPage,
      setCurrentPage,
      hero,
      setHero,
      countdown,
      setCountdown,
      agendaList,
      addAgenda,
      updateAgenda,
      deleteAgenda,
      articleList,
      addArticle,
      updateArticle,
      deleteArticle,
      galleryList,
      addGalleryItem,
      deleteGalleryItem,
      donation,
      setDonation,
      boardList,
      addBoardMember,
      updateBoardMember,
      deleteBoardMember,
      footer,
      setFooter,
      toast,
      showToast,
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
