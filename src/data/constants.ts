export interface KegiatanSubItem {
  label: string;
  description: string;
  href: string;
  iconName: 'Sparkles' | 'HeartHandshake' | 'CalendarDays' | 'LayoutGrid';
  badge?: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
  sectionId?: string;
  isDropdown?: boolean;
  children?: KegiatanSubItem[];
}

export const KEGIATAN_ITEMS: KegiatanSubItem[] = [
  {
    label: "Gema Muharram 1448H",
    description: "Hasil lomba, dokumentasi & pawai obor",
    href: "/tahun-baru-islam",
    iconName: "Sparkles",
    badge: "1448H",
  },
  {
    label: "Qurban Idul Adha 1447H",
    description: "Informasi paket qurban sapi & kambing",
    href: "/qurban",
    iconName: "HeartHandshake",
    badge: "1447H",
  },
  {
    label: "Agenda & Kajian Rutin",
    description: "Jadwal kegiatan, kajian & sholat",
    href: "/agenda",
    iconName: "CalendarDays",
  },
  {
    label: "Pusat Kegiatan Masjid",
    description: "Daftar seluruh program & acara masjid",
    href: "/kegiatan",
    iconName: "LayoutGrid",
  },
];

// Navigation links
export const NAV_LINKS: NavLinkItem[] = [
  {
    label: "Kegiatan",
    href: "/kegiatan",
    isDropdown: true,
    children: KEGIATAN_ITEMS,
  },
  { label: "Artikel", href: "/#artikel", sectionId: "artikel" },
  { label: "Galeri", href: "/galeri" },
  { label: "Tentang", href: "/#tentang", sectionId: "tentang" },
  { label: "Dashboard", href: "/dashboard" },
];
