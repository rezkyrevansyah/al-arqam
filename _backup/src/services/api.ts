import type {
  AllSiteData,
  HeroData,
  CountdownEvent,
  AgendaItem,
  Article,
  GalleryItem,
  ManagementMember,
  DonationConfig,
  FooterData,
  DashboardData,
  ActivityLogItem,
  LoginResult,
} from '../data/types';

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

// ============================================
// GENERIC FETCH HELPERS
// ============================================

async function apiGet<T>(action: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function apiPost<T>(action: string, body: Record<string, unknown>): Promise<T> {
  const token = localStorage.getItem('admin_token') || '';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s for uploads

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, token, ...body }),
      signal: controller.signal,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================
// LANDING PAGE - SINGLE CALL
// ============================================

export async function fetchAllData(): Promise<AllSiteData> {
  return apiGet<AllSiteData>('getAll');
}

// ============================================
// INDIVIDUAL GETTERS
// ============================================

export async function fetchHero(): Promise<HeroData> {
  return apiGet<HeroData>('getHero');
}

export async function fetchCountdown(): Promise<CountdownEvent> {
  return apiGet<CountdownEvent>('getCountdown');
}

export async function fetchAgenda(): Promise<AgendaItem[]> {
  return apiGet<AgendaItem[]>('getAgenda');
}

export async function fetchArticles(): Promise<Article[]> {
  return apiGet<Article[]>('getArticles');
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  return apiGet<Article | null>('getArticle', { id });
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  return apiGet<GalleryItem[]>('getGallery');
}

export async function fetchBoard(): Promise<ManagementMember[]> {
  return apiGet<ManagementMember[]>('getBoard');
}

export async function fetchDonation(): Promise<DonationConfig> {
  return apiGet<DonationConfig>('getDonation');
}

export async function fetchFooter(): Promise<FooterData> {
  return apiGet<FooterData>('getFooter');
}

export async function fetchDashboard(): Promise<DashboardData> {
  return apiGet<DashboardData>('getDashboard');
}

export async function fetchActivityLog(limit: number = 10): Promise<ActivityLogItem[]> {
  return apiGet<ActivityLogItem[]>('getActivityLog', { limit: String(limit) });
}

// ============================================
// AUTH
// ============================================

export async function login(username: string, password: string): Promise<LoginResult> {
  return apiGet<LoginResult>('login', { username, password });
}

// ============================================
// ADMIN MUTATIONS - HERO
// ============================================

export async function saveHero(data: HeroData): Promise<void> {
  await apiPost('saveHero', data as unknown as Record<string, unknown>);
}

// ============================================
// ADMIN MUTATIONS - COUNTDOWN
// ============================================

export async function saveCountdown(data: CountdownEvent): Promise<void> {
  await apiPost('saveCountdown', data as unknown as Record<string, unknown>);
}

// ============================================
// ADMIN MUTATIONS - AGENDA
// ============================================

export async function addAgenda(item: Omit<AgendaItem, 'id'>): Promise<{ success: boolean; id: string }> {
  return apiPost('addAgenda', item as unknown as Record<string, unknown>);
}

export async function updateAgenda(item: AgendaItem): Promise<void> {
  await apiPost('updateAgenda', item as unknown as Record<string, unknown>);
}

export async function deleteAgenda(id: string): Promise<void> {
  await apiPost('deleteAgenda', { id });
}

// ============================================
// ADMIN MUTATIONS - ARTICLES
// ============================================

export async function addArticle(item: Omit<Article, 'id'>): Promise<{ success: boolean; id: string; imageUrl: string }> {
  return apiPost('addArticle', item as unknown as Record<string, unknown>);
}

export async function updateArticle(item: Article): Promise<{ success: boolean; imageUrl: string }> {
  return apiPost('updateArticle', item as unknown as Record<string, unknown>);
}

export async function deleteArticle(id: string): Promise<void> {
  await apiPost('deleteArticle', { id });
}

// ============================================
// ADMIN MUTATIONS - GALLERY
// ============================================

export async function addGalleryItem(item: { image: string; title: string; date: string }): Promise<{ success: boolean; id: string; imageUrl: string }> {
  return apiPost('addGalleryItem', item);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await apiPost('deleteGalleryItem', { id });
}

// ============================================
// ADMIN MUTATIONS - BOARD MEMBERS
// ============================================

export async function addBoardMember(item: { name: string; title: string; image: string; order?: number }): Promise<{ success: boolean; id: string; imageUrl: string }> {
  return apiPost('addBoardMember', item);
}

export async function updateBoardMember(item: { id: string; name: string; title: string; image: string; order?: number }): Promise<{ success: boolean; imageUrl: string }> {
  return apiPost('updateBoardMember', item);
}

export async function deleteBoardMember(id: string): Promise<void> {
  await apiPost('deleteBoardMember', { id });
}

// ============================================
// ADMIN MUTATIONS - DONATION
// ============================================

export async function saveDonation(data: DonationConfig): Promise<{ success: boolean; qrisImageUrl?: string }> {
  return apiPost('saveDonation', data as unknown as Record<string, unknown>);
}

// ============================================
// ADMIN MUTATIONS - FOOTER
// ============================================

export async function saveFooter(data: FooterData): Promise<void> {
  await apiPost('saveFooter', data as unknown as Record<string, unknown>);
}
