/**
 * Type definitions for all content data
 * Used by both Landing Page and Admin Page
 *
 * When integrating with admin:
 * 1. Keep these types as source of truth
 * 2. API responses should match these interfaces
 * 3. Form validations should validate against these types
 */

// ============================================
// AGENDA / KEGIATAN
// ============================================
export type AgendaCategory = "kajian" | "sholat" | "kegiatan" | "rapat";

export interface AgendaItem {
  id: string;
  title: string;
  date: string; // ISO date: YYYY-MM-DD
  time: string; // e.g., "18:30 WIB"
  location: string;
  description: string;
  category: AgendaCategory;
}

// ============================================
// ARTIKEL
// ============================================
export interface Article {
  id: string;
  title: string;
  excerpt: string; // Short summary for cards
  content: string; // Full article content (HTML/Markdown)
  author: string;
  date: string; // ISO date: YYYY-MM-DD
  image: string; // Cover image URL
  category: string; // Free-form category
}

// ============================================
// GALERI
// ============================================
export interface GalleryItem {
  id: string;
  image: string; // Image URL
  title: string; // Caption
  date: string; // ISO date: YYYY-MM-DD
}

// ============================================
// PENGURUS DKM
// ============================================
export interface ManagementMember {
  id: string;
  name: string;
  title: string; // Position/role
  image: string; // Profile photo URL
}

// ============================================
// SOSIAL MEDIA
// ============================================
export type SocialPlatform = "instagram" | "youtube" | "facebook" | "tiktok";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

// ============================================
// KONTAK
// ============================================
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  mapsUrl: string;
}

// ============================================
// DONASI
// ============================================
export interface DonationConfig {
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
  donationCollected: number;
  donationTarget: number;
  qrisImageUrl: string;
  qrisDriveFileId?: string;
}

// ============================================
// EVENT COUNTDOWN
// ============================================
export interface CountdownEvent {
  name: string;
  date: string; // ISO datetime
  description?: string;
  active?: boolean; // For admin panel - toggle countdown visibility
}

// ============================================
// HERO
// ============================================
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
}

// ============================================
// FOOTER
// ============================================
export interface FooterData {
  address: string;
  phone: string;
  email: string;
  mapsUrl: string;
  socials: SocialLink[];
}

// ============================================
// ACTIVITY LOG
// ============================================
export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  entityId: string;
  description: string;
  user: string;
}

// ============================================
// DASHBOARD
// ============================================
export interface DashboardData {
  agendaCount: number;
  articleCount: number;
  galleryCount: number;
  boardCount: number;
  countdown: CountdownEvent;
  donation: DonationConfig;
  recentActivity: ActivityLogItem[];
}

// ============================================
// ALL SITE DATA (for landing page)
// ============================================
export interface AllSiteData {
  hero: HeroData;
  countdown: CountdownEvent;
  agenda: AgendaItem[];
  articles: Article[];
  gallery: GalleryItem[];
  board: ManagementMember[];
  donation: DonationConfig;
  footer: FooterData;
}

// ============================================
// LOGIN
// ============================================
export interface LoginResult {
  success: boolean;
  token?: string;
  message?: string;
}

// ============================================
// SITE CONFIG (for future use)
// ============================================
export interface SiteConfig {
  siteName: string;
  tagline: string;
  logoPath: string;
  primaryColor: string;
  accentColor: string;
}
