// Target date for countdown (Isra Mi'raj)
export const ISRA_MIRAJ_DATE = "2026-02-26T00:00:00";

// Bank account for donations
export const BANK_ACCOUNT_NUMBER = "720 123 456 7";
export const BANK_ACCOUNT_NAME = "DKM Masjid Jami' Al-Arqom";

// QRIS configuration
export const QRIS_IMAGE_PATH = "/qris-masjid.svg";
export const QRIS_DOWNLOAD_FILENAME = "QRIS-Masjid-Al-Arqom.svg";

// Navigation links
export const NAV_LINKS = [
  { label: "Agenda", href: "#agenda" },
  { label: "Artikel", href: "#artikel" },
  { label: "Galeri", href: "#galeri" },
  { label: "Tentang", href: "#tentang" },
];

// Agenda/events data
export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: "kajian" | "sholat" | "kegiatan" | "rapat";
}

export const AGENDA_DATA: AgendaItem[] = [
  // Past agendas (January 2026)
  {
    id: "101",
    title: "Kajian Akhir Tahun",
    date: "2026-01-05",
    time: "19:00 WIB",
    location: "Masjid Al-Arqom Lantai 1",
    description: "Kajian spesial menyambut tahun baru Hijriyah bersama Ustadz Ahmad.",
    category: "kajian",
  },
  {
    id: "102",
    title: "Sholat Tahajud Berjamaah",
    date: "2026-01-10",
    time: "03:00 WIB",
    location: "Masjid Al-Arqom",
    description: "Sholat tahajud berjamaah dan doa bersama di sepertiga malam.",
    category: "sholat",
  },
  {
    id: "103",
    title: "Rapat Evaluasi Tahunan",
    date: "2026-01-15",
    time: "20:00 WIB",
    location: "Ruang Sekretariat",
    description: "Evaluasi program kerja DKM tahun 2025 dan perencanaan 2026.",
    category: "rapat",
  },
  {
    id: "104",
    title: "Bakti Sosial Komunitas",
    date: "2026-01-18",
    time: "08:00 WIB",
    location: "Balai Kelurahan",
    description: "Pembagian sembako kepada warga kurang mampu se-kelurahan.",
    category: "kegiatan",
  },
  {
    id: "105",
    title: "Kajian Kitab Kuning",
    date: "2026-01-22",
    time: "18:30 WIB",
    location: "Masjid Al-Arqom Lantai 2",
    description: "Kajian rutin kitab Riyadhus Shalihin bersama Ustadz Fauzi.",
    category: "kajian",
  },
  {
    id: "106",
    title: "Pelatihan Imam Muda",
    date: "2026-01-25",
    time: "09:00 WIB",
    location: "Masjid Al-Arqom",
    description: "Program pelatihan untuk calon imam dan muadzin masjid.",
    category: "kegiatan",
  },
  {
    id: "107",
    title: "Sholat Gerhana Bulan",
    date: "2026-01-28",
    time: "20:00 WIB",
    location: "Masjid Al-Arqom",
    description: "Sholat gerhana bulan berjamaah dan dzikir bersama.",
    category: "sholat",
  },
  {
    id: "108",
    title: "Rapat Persiapan Ramadhan",
    date: "2026-02-01",
    time: "20:00 WIB",
    location: "Ruang Sekretariat",
    description: "Persiapan awal program Ramadhan 1448H.",
    category: "rapat",
  },
  // Upcoming agendas (February-March 2026)
  {
    id: "1",
    title: "Kajian Rutin Ba'da Maghrib",
    date: "2026-02-10",
    time: "18:30 WIB",
    location: "Masjid Al-Arqom Lantai 1",
    description: "Kajian tafsir Al-Quran bersama Ustadz Ahmad Fauzi, Lc.",
    category: "kajian",
  },
  {
    id: "2",
    title: "Sholat Jumat Berjamaah",
    date: "2026-02-13",
    time: "11:30 WIB",
    location: "Masjid Al-Arqom",
    description: "Khutbah dan sholat Jumat. Khatib: Ustadz Dr. Muhammad Ridwan.",
    category: "sholat",
  },
  {
    id: "3",
    title: "Bersih-Bersih Masjid",
    date: "2026-02-15",
    time: "07:00 WIB",
    location: "Area Masjid Al-Arqom",
    description: "Kegiatan gotong royong membersihkan masjid dan lingkungan sekitar.",
    category: "kegiatan",
  },
  {
    id: "4",
    title: "Rapat Pengurus DKM",
    date: "2026-02-16",
    time: "20:00 WIB",
    location: "Ruang Sekretariat",
    description: "Pembahasan program kerja bulanan dan persiapan Isra Mi'raj.",
    category: "rapat",
  },
  {
    id: "5",
    title: "Tahsin Al-Quran",
    date: "2026-02-17",
    time: "08:00 WIB",
    location: "Masjid Al-Arqom Lantai 2",
    description: "Kelas perbaikan bacaan Al-Quran untuk dewasa.",
    category: "kajian",
  },
  {
    id: "6",
    title: "Santunan Anak Yatim",
    date: "2026-02-22",
    time: "09:00 WIB",
    location: "Aula Masjid Al-Arqom",
    description: "Program santunan dan pembinaan anak yatim se-kelurahan.",
    category: "kegiatan",
  },
  {
    id: "7",
    title: "Peringatan Isra Mi'raj",
    date: "2026-02-27",
    time: "19:00 WIB",
    location: "Masjid Al-Arqom",
    description: "Peringatan Isra Mi'raj Nabi Muhammad SAW dengan tabligh akbar.",
    category: "kegiatan",
  },
  {
    id: "8",
    title: "Kajian Fiqih Puasa",
    date: "2026-03-01",
    time: "18:30 WIB",
    location: "Masjid Al-Arqom Lantai 1",
    description: "Persiapan Ramadhan: Kajian fiqih puasa dan ibadah Ramadhan.",
    category: "kajian",
  },
  {
    id: "9",
    title: "Rapat Panitia Ramadhan",
    date: "2026-03-05",
    time: "20:00 WIB",
    location: "Ruang Sekretariat",
    description: "Finalisasi program dan jadwal kegiatan Ramadhan 1448H.",
    category: "rapat",
  },
  {
    id: "10",
    title: "Sholat Tarawih Perdana",
    date: "2026-03-10",
    time: "19:30 WIB",
    location: "Masjid Al-Arqom",
    description: "Sholat Tarawih malam pertama Ramadhan 1448H.",
    category: "sholat",
  },
];

// Articles data
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export const ARTICLES_DATA: Article[] = [
  {
    id: "1",
    title: "Keutamaan Memakmurkan Masjid dalam Islam",
    excerpt: "Allah SWT berfirman dalam QS. At-Taubah ayat 18 tentang siapa saja yang berhak memakmurkan masjid Allah...",
    content: "",
    author: "Admin DKM",
    date: "2026-02-05",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop",
    category: "Artikel Islami",
  },
  {
    id: "2",
    title: "Laporan Kegiatan Maulid Nabi 1447H",
    excerpt: "Alhamdulillah, peringatan Maulid Nabi Muhammad SAW 1447H di Masjid Al-Arqom berlangsung dengan khidmat...",
    content: "",
    author: "Panitia Maulid",
    date: "2026-02-01",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop",
    category: "Laporan",
  },
  {
    id: "3",
    title: "Tips Meningkatkan Kekhusyukan Sholat",
    excerpt: "Kekhusyukan adalah ruh dari sholat. Berikut beberapa tips yang bisa diterapkan untuk meningkatkan kekhusyukan...",
    content: "",
    author: "Ustadz Ahmad Fauzi",
    date: "2026-01-28",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=400&fit=crop",
    category: "Artikel Islami",
  },
  {
    id: "4",
    title: "Program Ramadhan 1448H Masjid Al-Arqom",
    excerpt: "Menyambut bulan suci Ramadhan, DKM Masjid Al-Arqom telah menyiapkan berbagai program ibadah dan sosial...",
    content: "",
    author: "Admin DKM",
    date: "2026-01-25",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&h=400&fit=crop",
    category: "Pengumuman",
  },
  {
    id: "5",
    title: "Panduan Lengkap Zakat Fitrah dan Mal",
    excerpt: "Zakat merupakan salah satu rukun Islam yang wajib ditunaikan. Berikut panduan lengkap menghitung zakat fitrah dan mal...",
    content: "",
    author: "Ustadz Dr. Ridwan",
    date: "2026-01-20",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop",
    category: "Artikel Islami",
  },
  {
    id: "6",
    title: "Laporan Keuangan DKM Januari 2026",
    excerpt: "Transparansi keuangan merupakan komitmen DKM Al-Arqom. Berikut laporan keuangan bulan Januari 2026...",
    content: "",
    author: "Bendahara DKM",
    date: "2026-01-15",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    category: "Laporan",
  },
  {
    id: "7",
    title: "Jadwal Kajian Rutin Februari 2026",
    excerpt: "Berikut jadwal kajian rutin yang akan diselenggarakan di Masjid Al-Arqom selama bulan Februari 2026...",
    content: "",
    author: "Admin DKM",
    date: "2026-01-12",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop",
    category: "Pengumuman",
  },
  {
    id: "8",
    title: "Hikmah Isra Mi'raj bagi Umat Muslim",
    excerpt: "Peristiwa Isra Mi'raj mengandung banyak hikmah dan pelajaran berharga bagi umat Muslim dalam menjalani kehidupan...",
    content: "",
    author: "Ustadz Ahmad Fauzi",
    date: "2026-01-10",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    category: "Artikel Islami",
  },
  {
    id: "9",
    title: "Renovasi Toilet Masjid Selesai",
    excerpt: "Alhamdulillah, renovasi toilet masjid yang telah berlangsung selama 2 minggu telah selesai. Terima kasih atas donasi jamaah...",
    content: "",
    author: "Panitia Renovasi",
    date: "2026-01-08",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    category: "Laporan",
  },
  {
    id: "10",
    title: "Pendaftaran Tahsin Al-Quran Dibuka",
    excerpt: "DKM Al-Arqom membuka pendaftaran kelas Tahsin Al-Quran untuk dewasa. Kelas akan dimulai awal Februari 2026...",
    content: "",
    author: "Admin DKM",
    date: "2026-01-05",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&h=400&fit=crop",
    category: "Pengumuman",
  },
];

// Gallery data
export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  date: string;
}

export const GALLERY_DATA: GalleryItem[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&h=600&fit=crop", title: "Sholat Jumat Berjamaah", date: "2026-02-07" },
  { id: "2", image: "https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=600&h=800&fit=crop", title: "Kajian Subuh", date: "2026-02-05" },
  { id: "3", image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=600&fit=crop", title: "Interior Masjid", date: "2026-01-30" },
  { id: "4", image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&h=800&fit=crop", title: "Buka Puasa Bersama", date: "2026-01-28" },
  { id: "5", image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop", title: "Peringatan Maulid Nabi", date: "2026-01-20" },
  { id: "6", image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=800&fit=crop", title: "Kegiatan TPA", date: "2026-01-15" },
  { id: "7", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop", title: "Masjid dari Luar", date: "2026-01-10" },
  { id: "8", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop", title: "Santunan Yatim", date: "2026-01-05" },
  { id: "9", image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop", title: "Gotong Royong Masjid", date: "2026-01-03" },
  { id: "10", image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&h=600&fit=crop", title: "Tahsin Al-Quran", date: "2025-12-28" },
  { id: "11", image: "https://images.unsplash.com/photo-1597435877666-4b62a45f5e56?w=800&h=600&fit=crop", title: "Pengajian Ibu-Ibu", date: "2025-12-20" },
  { id: "12", image: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=800&h=600&fit=crop", title: "Sholat Tarawih", date: "2025-12-15" },
];

// Management team data
export interface ManagementMember {
  id: string;
  name: string;
  title: string;
  image: string;
}

export const MANAGEMENT_DATA: ManagementMember[] = [
  { id: "1", name: "H. Abdul Rahman", title: "Ketua DKM", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
  { id: "2", name: "H. Muhammad Saleh", title: "Wakil Ketua", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
  { id: "3", name: "Ahmad Hidayat", title: "Sekretaris", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face" },
  { id: "4", name: "Ir. Bambang Susanto", title: "Bendahara", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face" },
  { id: "5", name: "Ustadz Fauzi, Lc.", title: "Ketua Bidang Dakwah", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face" },
  { id: "6", name: "Drs. Hasan Basri", title: "Ketua Bidang Pendidikan", image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=300&h=300&fit=crop&crop=face" },
  { id: "7", name: "Rizki Ramadhan", title: "Ketua Bidang Humas", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face" },
  { id: "8", name: "Andi Pratama", title: "Ketua Bidang Pemuda", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&crop=face" },
  { id: "9", name: "H. Supriyadi", title: "Ketua Bidang Sarana", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face" },
  { id: "10", name: "Wahyu Hidayat", title: "Ketua Bidang Sosial", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=300&fit=crop&crop=face" },
];

// Social media links
export interface SocialLink {
  platform: "instagram" | "youtube" | "facebook" | "tiktok";
  url: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "instagram", url: "https://instagram.com/masjidjamialaqom" },
  { platform: "youtube", url: "https://youtube.com/@masjidjamialaqom" },
  { platform: "facebook", url: "https://facebook.com/masjidjamialaqom" },
  { platform: "tiktok", url: "https://tiktok.com/@masjidjamialaqom" },
];

// Donation progress
export const DONATION_COLLECTED = 47500000;
export const DONATION_TARGET = 100000000;

// Contact info
export const CONTACT_INFO = {
  address: "Jl. Al-Arqom No. 1, Kaliabang Tengah, Bekasi Utara, Kota Bekasi 17125",
  phone: "+62 812-3456-7890",
  email: "dkm.alarqom@gmail.com",
  mapsUrl: "https://maps.google.com/?q=Masjid+Jami+Al+Arqom+Bekasi",
};
