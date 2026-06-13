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
  TransparencyDonor,
  TransparencyMetric,
  TransparencyProgram,
  Category,
  CategoryEntityType,
  InfaqTarawihEntry,
  SantunanYatimEntry,
  ZisEntry,
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
function toTransparencyMetric(row: any): TransparencyMetric {
  return {
    id: row.id,
    programId: row.program_id,
    label: row.label,
    value: Number(row.value ?? 0),
    valueType: row.value_type,
    suffix: row.suffix ?? '',
    note: row.note ?? '',
    sortOrder: row.sort_order ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTransparencyDonor(row: any): TransparencyDonor {
  return {
    id: row.id,
    programId: row.program_id,
    donorName: row.donor_name,
    amount: Number(row.amount ?? 0),
    donatedAt: row.donated_at ?? '',
    note: row.note ?? '',
    isAnonymous: row.is_anonymous ?? false,
    sortOrder: row.sort_order ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTransparencyProgram(
  row: any,
  metrics: TransparencyMetric[],
  donors: TransparencyDonor[],
): TransparencyProgram {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    badge: row.badge ?? '',
    category: row.category ?? '',
    periodLabel: row.period_label ?? '',
    year: Number(row.year ?? new Date().getFullYear()),
    description: row.description ?? '',
    progressLabel: row.progress_label ?? 'Dana Terkumpul',
    collectedAmount: Number(row.collected_amount ?? 0),
    targetAmount: Number(row.target_amount ?? 0),
    relatedLinkLabel: row.related_link_label ?? '',
    relatedLinkUrl: row.related_link_url ?? '',
    isPublished: row.is_published ?? false,
    showDonors: row.show_donors ?? true,
    showMuzakkiList: row.show_muzakki_list ?? true,
    sortOrder: row.sort_order ?? 0,
    programType: row.program_type ?? 'generic',
    metrics,
    donors,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCategory(row: any): Category {
  return {
    id: row.id,
    entityType: row.entity_type,
    name: row.name,
    color: row.color ?? '#6366f1',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toInfaqTarawihEntry(row: any): InfaqTarawihEntry {
  return {
    id: row.id,
    programId: row.program_id,
    malamKe: Number(row.malam_ke ?? 0),
    tanggal: row.tanggal ?? '',
    jumlah: Number(row.jumlah ?? 0),
    pengeluaran: Number(row.pengeluaran ?? 0),
    catatan: row.catatan ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSantunanYatimEntry(row: any): SantunanYatimEntry {
  return {
    id: row.id,
    programId: row.program_id,
    namaDonatur: row.nama_donatur ?? '',
    rt: row.rt ?? '',
    jumlahPaket: Number(row.jumlah_paket ?? 1),
    hargaPaket: Number(row.harga_paket ?? 200000),
    catatan: row.catatan ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toZisEntry(row: any): ZisEntry {
  return {
    id: row.id,
    programId: row.program_id,
    tanggal: row.tanggal ?? '',
    namaPetugas: row.nama_petugas ?? '',
    nomorResi: row.nomor_resi ?? '',
    namaMuzakki: row.nama_muzakki ?? '',
    alamat: row.alamat ?? '',
    rt: row.rt ?? '',
    zakatFitrahJiwa: Number(row.zakat_fitrah_jiwa ?? 0),
    zakatFitrahUang: Number(row.zakat_fitrah_uang ?? 0),
    zakatFitrahBerasLiter: Number(row.zakat_fitrah_beras_liter ?? 0),
    zakatFitrahBerasKg: Number(row.zakat_fitrah_beras_kg ?? 0),
    zakatMal: Number(row.zakat_mal ?? 0),
    infaqSedekah: Number(row.infaq_sedekah ?? 0),
    fidyahJiwa: Number(row.fidyah_jiwa ?? 0),
    fidyahRp: Number(row.fidyah_rp ?? 0),
    lainLain: Number(row.lain_lain ?? 0),
    catatan: row.catatan ?? '',
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

const SUPPORTED_SOCIAL_PLATFORMS = new Set(['instagram', 'youtube', 'facebook', 'tiktok']);

function sanitizeSocialLinks(socials: FooterData['socials']): FooterData['socials'] {
  return socials
    .map((social) => ({
      platform: social.platform,
      url: social.url.trim(),
    }))
    .filter((social) => SUPPORTED_SOCIAL_PLATFORMS.has(social.platform) && social.url.length > 0);
}

function isSchemaMissingError(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const code = 'code' in error ? (error as { code?: string }).code : undefined;
  const message = 'message' in error ? (error as { message?: string }).message ?? '' : '';
  return (
    code === '42P01' ||
    code === '42703' ||
    /does not exist/i.test(message) ||
    /could not find the table/i.test(message)
  );
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

export async function fetchTransparencyPrograms(): Promise<TransparencyProgram[]> {
  const [programsRes, metricsRes, donorsRes] = await Promise.all([
    supabase
      .from('transparency_programs')
      .select('*')
      .order('year', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase
      .from('transparency_metrics')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('transparency_donors')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('donated_at', { ascending: false })
      .order('created_at', { ascending: false }),
  ]);

  if ([programsRes, metricsRes, donorsRes].some((result) => isSchemaMissingError(result.error))) {
    return [];
  }

  [programsRes, metricsRes, donorsRes].forEach((result) => throwOnError(result.error));

  const metrics = (metricsRes.data ?? []).map(toTransparencyMetric);
  const donors = (donorsRes.data ?? []).map(toTransparencyDonor);

  return (programsRes.data ?? []).map((program) =>
    toTransparencyProgram(
      program,
      metrics.filter((metric) => metric.programId === program.id),
      donors.filter((donor) => donor.programId === program.id),
    )
  );
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
  const payload = { ...item, category: item.category.toLowerCase() };
  const { data, error } = await supabase.from('agenda').insert(payload).select('id').single();
  throwOnError(error);
  await logActivity('create', 'agenda', data!.id, `Agenda ditambahkan: "${item.title}"`);
  return { success: true, id: data!.id };
}

export async function updateAgenda(item: AgendaItem): Promise<void> {
  const { id, ...rest } = item;
  const payload = { ...rest, category: rest.category.toLowerCase() };
  const { error } = await supabase.from('agenda').update(payload).eq('id', id);
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

export async function updateGalleryItem(item: GalleryItem): Promise<void> {
  const { id, ...rest } = item;
  const { error } = await supabase.from('gallery').update(rest).eq('id', id);
  throwOnError(error);
  await logActivity('update', 'gallery', id, `Foto diperbarui: "${item.title}"`);
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
  const socials = sanitizeSocialLinks(data.socials);
  const { error: footerError } = await supabase.from('footer_config').upsert(
    {
      lock: true,
      address: data.address.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      maps_url: data.mapsUrl.trim(),
    },
    { onConflict: 'lock' }
  );
  throwOnError(footerError);

  // Hapus semua social links lama lalu insert yang baru
  const { error: delError } = await supabase
    .from('social_links')
    .delete()
    .not('id', 'is', null);
  throwOnError(delError);

  if (socials.length > 0) {
    const { error: insertError } = await supabase
      .from('social_links')
      .insert(socials.map((social) => ({ platform: social.platform, url: social.url })));
    throwOnError(insertError);
  }

  await logActivity('update', 'footer_config', 'singleton', 'Footer diperbarui');
}

// —— Admin Mutations - Transparency Dashboard ————————————————————————————————

export async function addTransparencyProgram(
  item: Omit<TransparencyProgram, 'id' | 'metrics' | 'donors'>
): Promise<{ success: boolean; id: string }> {
  const { data, error } = await supabase
    .from('transparency_programs')
    .insert({
      slug: item.slug,
      title: item.title,
      badge: item.badge,
      category: item.category,
      period_label: item.periodLabel,
      year: item.year,
      description: item.description,
      progress_label: item.progressLabel,
      collected_amount: item.collectedAmount,
      target_amount: item.targetAmount,
      related_link_label: item.relatedLinkLabel,
      related_link_url: item.relatedLinkUrl,
      is_published: item.isPublished,
      show_donors: item.showDonors,
      show_muzakki_list: item.showMuzakkiList,
      sort_order: item.sortOrder,
      program_type: item.programType ?? 'generic',
    })
    .select('id')
    .single();

  throwOnError(error);
  await logActivity('create', 'transparency_programs', data!.id, `Program transparansi ditambahkan: "${item.title}"`);
  return { success: true, id: data!.id };
}

export async function updateTransparencyProgram(
  item: Omit<TransparencyProgram, 'metrics' | 'donors'>
): Promise<void> {
  const { error } = await supabase
    .from('transparency_programs')
    .update({
      slug: item.slug,
      title: item.title,
      badge: item.badge,
      category: item.category,
      period_label: item.periodLabel,
      year: item.year,
      description: item.description,
      progress_label: item.progressLabel,
      collected_amount: item.collectedAmount,
      target_amount: item.targetAmount,
      related_link_label: item.relatedLinkLabel,
      related_link_url: item.relatedLinkUrl,
      is_published: item.isPublished,
      show_donors: item.showDonors,
      show_muzakki_list: item.showMuzakkiList,
      sort_order: item.sortOrder,
      program_type: item.programType ?? 'generic',
    })
    .eq('id', item.id);

  throwOnError(error);
  await logActivity('update', 'transparency_programs', item.id, `Program transparansi diperbarui: "${item.title}"`);
}

export async function deleteTransparencyProgram(id: string): Promise<void> {
  const { error } = await supabase.from('transparency_programs').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'transparency_programs', id, 'Program transparansi dihapus');
}

export async function addTransparencyMetric(
  item: Omit<TransparencyMetric, 'id'>
): Promise<{ success: boolean; id: string }> {
  const { data, error } = await supabase
    .from('transparency_metrics')
    .insert({
      program_id: item.programId,
      label: item.label,
      value: item.value,
      value_type: item.valueType,
      suffix: item.suffix,
      note: item.note,
      sort_order: item.sortOrder,
    })
    .select('id')
    .single();

  throwOnError(error);
  await logActivity('create', 'transparency_metrics', data!.id, `Metrik transparansi ditambahkan: "${item.label}"`);
  return { success: true, id: data!.id };
}

export async function updateTransparencyMetric(item: TransparencyMetric): Promise<void> {
  const { error } = await supabase
    .from('transparency_metrics')
    .update({
      label: item.label,
      value: item.value,
      value_type: item.valueType,
      suffix: item.suffix,
      note: item.note,
      sort_order: item.sortOrder,
    })
    .eq('id', item.id);

  throwOnError(error);
  await logActivity('update', 'transparency_metrics', item.id, `Metrik transparansi diperbarui: "${item.label}"`);
}

export async function deleteTransparencyMetric(id: string): Promise<void> {
  const { error } = await supabase.from('transparency_metrics').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'transparency_metrics', id, 'Metrik transparansi dihapus');
}

export async function addTransparencyDonor(
  item: Omit<TransparencyDonor, 'id'>
): Promise<{ success: boolean; id: string }> {
  const { data, error } = await supabase
    .from('transparency_donors')
    .insert({
      program_id: item.programId,
      donor_name: item.donorName,
      amount: item.amount,
      donated_at: item.donatedAt || null,
      note: item.note,
      is_anonymous: item.isAnonymous,
      sort_order: item.sortOrder,
    })
    .select('id')
    .single();

  throwOnError(error);
  await logActivity('create', 'transparency_donors', data!.id, `Donatur transparansi ditambahkan: "${item.donorName}"`);
  return { success: true, id: data!.id };
}

export async function updateTransparencyDonor(item: TransparencyDonor): Promise<void> {
  const { error } = await supabase
    .from('transparency_donors')
    .update({
      donor_name: item.donorName,
      amount: item.amount,
      donated_at: item.donatedAt || null,
      note: item.note,
      is_anonymous: item.isAnonymous,
      sort_order: item.sortOrder,
    })
    .eq('id', item.id);

  throwOnError(error);
  await logActivity('update', 'transparency_donors', item.id, `Donatur transparansi diperbarui: "${item.donorName}"`);
}

export async function deleteTransparencyDonor(id: string): Promise<void> {
  const { error } = await supabase.from('transparency_donors').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'transparency_donors', id, 'Donatur transparansi dihapus');
}

// ── Admin - Categories ────────────────────────────────────────

export async function fetchCategories(entityType: CategoryEntityType): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('entity_type', entityType)
    .order('name', { ascending: true });
  if (isSchemaMissingError(error)) return [];
  throwOnError(error);
  return (data ?? []).map(toCategory);
}

export async function addCategory(item: Omit<Category, 'id'>): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ entity_type: item.entityType, name: item.name, color: item.color })
    .select('id')
    .single();
  throwOnError(error);
  return { id: data!.id };
}

export async function updateCategory(item: Category): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .update({ name: item.name, color: item.color })
    .eq('id', item.id);
  throwOnError(error);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  throwOnError(error);
}

// ── Admin - Infaq Tarawih Entries ─────────────────────────────

export async function fetchInfaqTarawihEntries(programId: string): Promise<InfaqTarawihEntry[]> {
  const { data, error } = await supabase
    .from('infaq_tarawih_entries')
    .select('*')
    .eq('program_id', programId)
    .order('malam_ke', { ascending: true });
  if (isSchemaMissingError(error)) return [];
  throwOnError(error);
  return (data ?? []).map(toInfaqTarawihEntry);
}

export async function addInfaqTarawihEntry(item: Omit<InfaqTarawihEntry, 'id'>): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('infaq_tarawih_entries')
    .insert({
      program_id: item.programId,
      malam_ke: item.malamKe,
      tanggal: item.tanggal,
      jumlah: item.jumlah,
      pengeluaran: item.pengeluaran,
      catatan: item.catatan,
    })
    .select('id')
    .single();
  throwOnError(error);
  await logActivity('create', 'infaq_tarawih_entries', data!.id, `Infaq malam ke-${item.malamKe} ditambahkan`);
  return { id: data!.id };
}

export async function updateInfaqTarawihEntry(item: InfaqTarawihEntry): Promise<void> {
  const { error } = await supabase
    .from('infaq_tarawih_entries')
    .update({ malam_ke: item.malamKe, tanggal: item.tanggal, jumlah: item.jumlah, pengeluaran: item.pengeluaran, catatan: item.catatan })
    .eq('id', item.id);
  throwOnError(error);
}

export async function deleteInfaqTarawihEntry(id: string): Promise<void> {
  const { error } = await supabase.from('infaq_tarawih_entries').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'infaq_tarawih_entries', id, 'Entry infaq dihapus');
}

// ── Admin - Santunan Yatim Entries ────────────────────────────

export async function fetchSantunanYatimEntries(programId: string): Promise<SantunanYatimEntry[]> {
  const { data, error } = await supabase
    .from('santunan_yatim_entries')
    .select('*')
    .eq('program_id', programId)
    .order('created_at', { ascending: true });
  if (isSchemaMissingError(error)) return [];
  throwOnError(error);
  return (data ?? []).map(toSantunanYatimEntry);
}

export async function addSantunanYatimEntry(item: Omit<SantunanYatimEntry, 'id'>): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('santunan_yatim_entries')
    .insert({
      program_id: item.programId,
      nama_donatur: item.namaDonatur,
      rt: item.rt,
      jumlah_paket: item.jumlahPaket,
      harga_paket: item.hargaPaket,
      catatan: item.catatan,
    })
    .select('id')
    .single();
  throwOnError(error);
  await logActivity('create', 'santunan_yatim_entries', data!.id, `Donatur santunan ${item.namaDonatur} ditambahkan`);
  return { id: data!.id };
}

export async function updateSantunanYatimEntry(item: SantunanYatimEntry): Promise<void> {
  const { error } = await supabase
    .from('santunan_yatim_entries')
    .update({ nama_donatur: item.namaDonatur, rt: item.rt, jumlah_paket: item.jumlahPaket, harga_paket: item.hargaPaket, catatan: item.catatan })
    .eq('id', item.id);
  throwOnError(error);
}

export async function deleteSantunanYatimEntry(id: string): Promise<void> {
  const { error } = await supabase.from('santunan_yatim_entries').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'santunan_yatim_entries', id, 'Entry santunan dihapus');
}

// ── Admin - ZIS Entries ───────────────────────────────────────

export async function fetchZisEntries(programId: string): Promise<ZisEntry[]> {
  const { data, error } = await supabase
    .from('zis_entries')
    .select('*')
    .eq('program_id', programId)
    .order('tanggal', { ascending: true })
    .order('created_at', { ascending: true });
  if (isSchemaMissingError(error)) return [];
  throwOnError(error);
  return (data ?? []).map(toZisEntry);
}

export async function addZisEntry(item: Omit<ZisEntry, 'id'>): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('zis_entries')
    .insert({
      program_id: item.programId,
      tanggal: item.tanggal || null,
      nama_petugas: item.namaPetugas,
      nomor_resi: item.nomorResi,
      nama_muzakki: item.namaMuzakki,
      alamat: item.alamat,
      rt: item.rt,
      zakat_fitrah_jiwa: item.zakatFitrahJiwa,
      zakat_fitrah_uang: item.zakatFitrahUang,
      zakat_fitrah_beras_liter: item.zakatFitrahBerasLiter,
      zakat_fitrah_beras_kg: item.zakatFitrahBerasKg,
      zakat_mal: item.zakatMal,
      infaq_sedekah: item.infaqSedekah,
      fidyah_jiwa: item.fidyahJiwa,
      fidyah_rp: item.fidyahRp,
      lain_lain: item.lainLain,
      catatan: item.catatan,
    })
    .select('id')
    .single();
  throwOnError(error);
  await logActivity('create', 'zis_entries', data!.id, `ZIS ${item.namaMuzakki} ditambahkan`);
  return { id: data!.id };
}

export async function updateZisEntry(item: ZisEntry): Promise<void> {
  const { error } = await supabase
    .from('zis_entries')
    .update({
      tanggal: item.tanggal || null,
      nama_petugas: item.namaPetugas,
      nomor_resi: item.nomorResi,
      nama_muzakki: item.namaMuzakki,
      alamat: item.alamat,
      rt: item.rt,
      zakat_fitrah_jiwa: item.zakatFitrahJiwa,
      zakat_fitrah_uang: item.zakatFitrahUang,
      zakat_fitrah_beras_liter: item.zakatFitrahBerasLiter,
      zakat_fitrah_beras_kg: item.zakatFitrahBerasKg,
      zakat_mal: item.zakatMal,
      infaq_sedekah: item.infaqSedekah,
      fidyah_jiwa: item.fidyahJiwa,
      fidyah_rp: item.fidyahRp,
      lain_lain: item.lainLain,
      catatan: item.catatan,
    })
    .eq('id', item.id);
  throwOnError(error);
}

export async function deleteZisEntry(id: string): Promise<void> {
  const { error } = await supabase.from('zis_entries').delete().eq('id', id);
  throwOnError(error);
  await logActivity('delete', 'zis_entries', id, 'Entry ZIS dihapus');
}
