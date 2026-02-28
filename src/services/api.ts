import { supabase } from '../lib/supabase';
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

// ── Row Mappers ───────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAgenda(row: any): AgendaItem {
  return {
    id:          row.id,
    title:       row.title,
    date:        row.date,
    time:        row.time,
    location:    row.location,
    description: row.description,
    category:    row.category,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArticle(row: any): Article {
  return {
    id:       row.id,
    title:    row.title,
    excerpt:  row.excerpt,
    content:  row.content,
    author:   row.author,
    date:     row.date,
    image:    row.image,
    category: row.category,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toGalleryItem(row: any): GalleryItem {
  return { id: row.id, image: row.image, title: row.title, date: row.date };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBoardMember(row: any): ManagementMember {
  return { id: row.id, name: row.name, title: row.title, image: row.image };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toHero(row: any): HeroData {
  return { title: row.title, subtitle: row.subtitle, description: row.description };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCountdown(row: any): CountdownEvent {
  return {
    name:        row.name,
    date:        row.date,
    description: row.description ?? '',
    active:      row.active ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDonation(row: any): DonationConfig {
  return {
    bankAccountNumber: row.bank_account_number,
    bankAccountName:   row.bank_account_name,
    bankName:          row.bank_name,
    donationCollected: Number(row.donation_collected),
    donationTarget:    Number(row.donation_target),
    qrisImageUrl:      row.qris_image_url,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFooter(row: any, socials: { platform: string; url: string }[]): FooterData {
  return {
    address: row.address,
    phone:   row.phone,
    email:   row.email,
    mapsUrl: row.maps_url,
    socials: socials as FooterData['socials'],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toActivityLog(row: any): ActivityLogItem {
  return {
    id:          row.id,
    timestamp:   row.timestamp,
    action:      row.action,
    entity:      row.entity,
    entityId:    row.entity_id,
    description: row.description,
    user:        row.user,
  };
}

function throwOnError(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    throw new Error((error as { message: string }).message);
  }
}

async function logActivity(action: string, entity: string, entityId: string, description: string) {
  await supabase.from('activity_log').insert({
    action,
    entity,
    entity_id: entityId,
    description,
    user: 'admin',
  });
}

// ── Auth ──────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, message: error.message };
  return { success: true, token: data.session?.access_token };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ── Public Read ───────────────────────────────────────────────

export async function fetchAllData(): Promise<AllSiteData> {
  const [hero, countdown, agenda, articles, gallery, board, donation, footer, socials] =
    await Promise.all([
      supabase.from('hero_config').select('*').single(),
      supabase.from('countdown_config').select('*').single(),
      supabase.from('agenda').select('*').order('date', { ascending: true }),
      supabase.from('articles').select('*').order('date', { ascending: false }),
      supabase.from('gallery').select('*').order('date', { ascending: false }),
      supabase.from('board_members').select('*').order('sort_order', { ascending: true }),
      supabase.from('donation_config').select('*').single(),
      supabase.from('footer_config').select('*').single(),
      supabase.from('social_links').select('*'),
    ]);

  [hero, countdown, agenda, articles, gallery, board, donation, footer, socials].forEach(r =>
    throwOnError(r.error)
  );

  return {
    hero:      toHero(hero.data),
    countdown: toCountdown(countdown.data),
    agenda:    (agenda.data ?? []).map(toAgenda),
    articles:  (articles.data ?? []).map(toArticle),
    gallery:   (gallery.data ?? []).map(toGalleryItem),
    board:     (board.data ?? []).map(toBoardMember),
    donation:  toDonation(donation.data),
    footer:    toFooter(footer.data, socials.data ?? []),
  };
}

export async function fetchHero(): Promise<HeroData> {
  const { data, error } = await supabase.from('hero_config').select('*').single();
  throwOnError(error);
  return toHero(data);
}

export async function fetchCountdown(): Promise<CountdownEvent> {
  const { data, error } = await supabase.from('countdown_config').select('*').single();
  throwOnError(error);
  return toCountdown(data);
}

export async function fetchAgenda(): Promise<AgendaItem[]> {
  const { data, error } = await supabase.from('agenda').select('*').order('date', { ascending: true });
  throwOnError(error);
  return (data ?? []).map(toAgenda);
}

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase.from('articles').select('*').order('date', { ascending: false });
  throwOnError(error);
  return (data ?? []).map(toArticle);
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
  throwOnError(error);
  return data ? toArticle(data) : null;
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase.from('gallery').select('*').order('date', { ascending: false });
  throwOnError(error);
  return (data ?? []).map(toGalleryItem);
}

export async function fetchBoard(): Promise<ManagementMember[]> {
  const { data, error } = await supabase
    .from('board_members')
    .select('*')
    .order('sort_order', { ascending: true });
  throwOnError(error);
  return (data ?? []).map(toBoardMember);
}

export async function fetchDonation(): Promise<DonationConfig> {
  const { data, error } = await supabase.from('donation_config').select('*').single();
  throwOnError(error);
  return toDonation(data);
}

export async function fetchFooter(): Promise<FooterData> {
  const [footerRes, socialsRes] = await Promise.all([
    supabase.from('footer_config').select('*').single(),
    supabase.from('social_links').select('*'),
  ]);
  throwOnError(footerRes.error);
  return toFooter(footerRes.data, socialsRes.data ?? []);
}

export async function fetchDashboard(): Promise<DashboardData> {
  const [agendaRes, articlesRes, galleryRes, boardRes, countdownRes, donationRes, logRes] =
    await Promise.all([
      supabase.from('agenda').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('board_members').select('*', { count: 'exact', head: true }),
      supabase.from('countdown_config').select('*').single(),
      supabase.from('donation_config').select('*').single(),
      supabase.from('activity_log').select('*').order('timestamp', { ascending: false }).limit(10),
    ]);

  return {
    agendaCount:    agendaRes.count ?? 0,
    articleCount:   articlesRes.count ?? 0,
    galleryCount:   galleryRes.count ?? 0,
    boardCount:     boardRes.count ?? 0,
    countdown:      toCountdown(countdownRes.data),
    donation:       toDonation(donationRes.data),
    recentActivity: (logRes.data ?? []).map(toActivityLog),
  };
}

export async function fetchActivityLog(limit = 10): Promise<ActivityLogItem[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);
  throwOnError(error);
  return (data ?? []).map(toActivityLog);
}

// ── Admin Mutations - Hero ────────────────────────────────────

export async function saveHero(data: HeroData): Promise<void> {
  const { error } = await supabase.from('hero_config').upsert(
    { lock: true, title: data.title, subtitle: data.subtitle, description: data.description },
    { onConflict: 'lock' }
  );
  throwOnError(error);
  await logActivity('update', 'hero_config', 'singleton', `Hero diperbarui: "${data.title}"`);
}

// ── Admin Mutations - Countdown ───────────────────────────────

export async function saveCountdown(data: CountdownEvent): Promise<void> {
  const { error } = await supabase.from('countdown_config').upsert(
    { lock: true, name: data.name, date: data.date, description: data.description ?? '', active: data.active ?? false },
    { onConflict: 'lock' }
  );
  throwOnError(error);
  await logActivity('update', 'countdown_config', 'singleton', `Countdown diperbarui: "${data.name}"`);
}

// ── Admin Mutations - Agenda ──────────────────────────────────

export async function addAgenda(item: Omit<AgendaItem, 'id'>): Promise<{ success: boolean; id: string }> {
  const { data, error } = await supabase.from('agenda').insert(item).select('id').single();
  throwOnError(error);
  await logActivity('create', 'agenda', data!.id, `Agenda ditambahkan: "${item.title}"`);
  return { success: true, id: data!.id };
}

export async function updateAgenda(item: AgendaItem): Promise<void> {
  const { id, ...rest } = item;
  const { error } = await supabase.from('agenda').update(rest).eq('id', id);
  throwOnError(error);
  await logActivity('update', 'agenda', id, `Agenda diperbarui: "${item.title}"`);
}

export async function deleteAgenda(id: string): Promise<void> {
  const { error } = await supabase.from('agenda').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'agenda', id, 'Agenda dihapus');
}

// ── Admin Mutations - Articles ────────────────────────────────

export async function addArticle(item: Omit<Article, 'id'>): Promise<{ success: boolean; id: string; imageUrl: string }> {
  const { data, error } = await supabase.from('articles').insert(item).select('id').single();
  throwOnError(error);
  await logActivity('create', 'articles', data!.id, `Artikel ditambahkan: "${item.title}"`);
  return { success: true, id: data!.id, imageUrl: item.image };
}

export async function updateArticle(item: Article): Promise<{ success: boolean; imageUrl: string }> {
  const { id, ...rest } = item;
  const { error } = await supabase.from('articles').update(rest).eq('id', id);
  throwOnError(error);
  await logActivity('update', 'articles', id, `Artikel diperbarui: "${item.title}"`);
  return { success: true, imageUrl: item.image };
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'articles', id, 'Artikel dihapus');
}

// ── Admin Mutations - Gallery ─────────────────────────────────

export async function addGalleryItem(item: { image: string; title: string; date: string }): Promise<{ success: boolean; id: string; imageUrl: string }> {
  const { data, error } = await supabase.from('gallery').insert(item).select('id').single();
  throwOnError(error);
  await logActivity('create', 'gallery', data!.id, `Foto ditambahkan: "${item.title}"`);
  return { success: true, id: data!.id, imageUrl: item.image };
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'gallery', id, 'Foto dihapus');
}

// ── Admin Mutations - Board Members ───────────────────────────

export async function addBoardMember(item: { name: string; title: string; image: string; order?: number }): Promise<{ success: boolean; id: string; imageUrl: string }> {
  const { data, error } = await supabase
    .from('board_members')
    .insert({ name: item.name, title: item.title, image: item.image, sort_order: item.order ?? 0 })
    .select('id')
    .single();
  throwOnError(error);
  await logActivity('create', 'board_members', data!.id, `Pengurus ditambahkan: "${item.name}"`);
  return { success: true, id: data!.id, imageUrl: item.image };
}

export async function updateBoardMember(item: { id: string; name: string; title: string; image: string; order?: number }): Promise<{ success: boolean; imageUrl: string }> {
  const { error } = await supabase
    .from('board_members')
    .update({ name: item.name, title: item.title, image: item.image, sort_order: item.order ?? 0 })
    .eq('id', item.id);
  throwOnError(error);
  await logActivity('update', 'board_members', item.id, `Pengurus diperbarui: "${item.name}"`);
  return { success: true, imageUrl: item.image };
}

export async function deleteBoardMember(id: string): Promise<void> {
  const { error } = await supabase.from('board_members').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'board_members', id, 'Pengurus dihapus');
}

// ── Admin Mutations - Donation ────────────────────────────────

export async function saveDonation(data: DonationConfig): Promise<{ success: boolean; qrisImageUrl?: string }> {
  const { error } = await supabase.from('donation_config').upsert(
    {
      lock: true,
      bank_account_number: data.bankAccountNumber,
      bank_account_name:   data.bankAccountName,
      bank_name:           data.bankName,
      donation_collected:  data.donationCollected,
      donation_target:     data.donationTarget,
      qris_image_url:      data.qrisImageUrl,
    },
    { onConflict: 'lock' }
  );
  throwOnError(error);
  await logActivity('update', 'donation_config', 'singleton', 'Donasi diperbarui');
  return { success: true, qrisImageUrl: data.qrisImageUrl };
}

// ── Admin Mutations - Footer ──────────────────────────────────

export async function saveFooter(data: FooterData): Promise<void> {
  const { error: footerError } = await supabase.from('footer_config').upsert(
    { lock: true, address: data.address, phone: data.phone, email: data.email, maps_url: data.mapsUrl },
    { onConflict: 'lock' }
  );
  throwOnError(footerError);

  // Hapus semua social links lama lalu insert yang baru
  const { error: delError } = await supabase
    .from('social_links')
    .delete()
    .gte('id', '00000000-0000-0000-0000-000000000000');
  throwOnError(delError);

  if (data.socials.length > 0) {
    const { error: insertError } = await supabase
      .from('social_links')
      .insert(data.socials.map(s => ({ platform: s.platform, url: s.url })));
    throwOnError(insertError);
  }

  await logActivity('update', 'footer_config', 'singleton', 'Footer diperbarui');
}
