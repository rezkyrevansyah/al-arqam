# Product Requirements Document (PRD)

## Website Masjid Jami' Al Arqam Bekasi Utara

---

| Field             | Value                                            |
| ----------------- | ------------------------------------------------ |
| **Project Name**  | Website & CMS Masjid Jami' Al Arqam Bekasi Utara |
| **Version**       | 2.1                                              |
| **Status**        | Draft                                            |
| **Last Updated**  | 20 April 2026                                    |
| **Document Type** | Product Requirements Document                    |

**Changelog v2.1:**

- Nama masjid diupdate jadi "Masjid Jami' Al Arqam"
- Scope disederhanakan menjadi single language (Bahasa Indonesia)
- Scope disederhanakan menjadi single theme
- Color palette diupdate berdasarkan logo resmi masjid
- Ditambahkan brand identity guidelines

---

## 1. Executive Summary

### 1.1 Latar Belakang

Masjid Jami' Al Arqam Bekasi Utara membutuhkan platform digital yang menjadi pusat informasi dan aktivitas jamaah. Saat ini informasi masjid tersebar di berbagai kanal seperti WhatsApp group dan pengumuman fisik, sehingga jamaah kesulitan mengakses informasi secara terpusat.

Selain itu, untuk meningkatkan kepercayaan jamaah terhadap pengelolaan donasi, dibutuhkan sistem transparansi yang dapat diakses publik. Website harus cepat, mudah dipahami, mudah dikelola pengurus, dan nyaman diakses dari perangkat mobile.

### 1.2 Tujuan Project

1. Menyediakan pusat informasi terpadu untuk seluruh jamaah Masjid Jami' Al Arqam.
2. Meningkatkan transparansi pengelolaan infaq, sedekah, dan ZIS melalui dashboard publik.
3. Memudahkan penyebaran berita dan informasi melalui link yang shareable di media sosial.
4. Memberikan kemudahan berdonasi melalui berbagai metode seperti transfer bank dan QRIS.
5. Mendokumentasikan kegiatan masjid melalui galeri dan artikel.
6. Wajib responsive di mobile, tablet, dan desktop.

### 1.3 Target Pengguna

| Persona               | Deskripsi                                   | Kebutuhan Utama                                       |
| --------------------- | ------------------------------------------- | ----------------------------------------------------- |
| **Jamaah Aktif**      | Jamaah rutin yang mengikuti kegiatan masjid | Jadwal sholat, agenda kegiatan, artikel kajian        |
| **Donatur**           | Individu yang ingin berinfaq/sedekah        | Informasi program, nomor rekening, QRIS, transparansi |
| **Calon Jamaah Baru** | Warga sekitar yang belum aktif              | Profil masjid, kegiatan, pengurus                     |
| **Pengurus DKM**      | Admin pengelola konten                      | CMS untuk update informasi dan data donasi            |
| **Bendahara**         | Pengelola keuangan masjid                   | Input dan verifikasi data donasi                      |

### 1.4 Success Metrics

- Website dapat diakses 24/7 dengan uptime minimum 99%.
- Waktu loading halaman utama sangat cepat.
- Link artikel dan informasi menampilkan preview yang benar saat dishare di WhatsApp/Facebook.
- Data donasi di dashboard transparansi selalu up-to-date, maksimal selisih 1 hari.
- Minimal 80% pengurus DKM dapat menggunakan CMS setelah training singkat.

---

## 2. Ruang Lingkup Project

### 2.1 In Scope

#### Fase 1 - MVP

- Homepage dengan hero section, countdown hari besar, jadwal sholat, dan informasi terbaru
- Halaman informasi list dan detail dengan Open Graph meta
- Halaman artikel list dan detail dengan Open Graph meta
- CMS dasar untuk informasi dan artikel
- Setup autentikasi admin
- Responsive design untuk mobile, tablet, dan desktop

#### Fase 2 - Dashboard Transparansi

- Halaman dashboard transparansi publik
- Halaman detail per program donasi
- CMS untuk input donasi, pengeluaran, dan program
- List donatur dengan opsi anonim

#### Fase 3 - Fitur Lengkap

- Halaman agenda masjid
- Halaman galeri kegiatan dengan album
- Halaman pengurus DKM
- Halaman infaq dan sedekah dengan QRIS
- Jadwal sholat terintegrasi dengan API MyQuran

#### Fase 4 - Polish & Launch

- SEO optimization
- Analytics integration
- User acceptance testing
- Dokumentasi teknis dan training admin
- Deployment ke production domain

### 2.2 Out of Scope

- Mobile app native iOS/Android
- Sistem live streaming kajian
- Sistem booking aula/ruangan
- Pendaftaran pengajian online dengan sistem kuota
- E-commerce produk masjid
- Sistem notifikasi push
- Integrasi payment gateway otomatis
- Forum diskusi jamaah

### 2.3 Strategi Bahasa dan Konten

Website menggunakan **Bahasa Indonesia** sebagai bahasa utama untuk seluruh UI, konten tetap, artikel, informasi, agenda, dan program donasi.

Catatan:

- Jika di masa depan diperlukan Bahasa Inggris, implementasinya diperlakukan sebagai fase pengembangan baru.
- Untuk versi ini tidak ada locale routing, language switcher, atau kebutuhan translation fallback.

### 2.4 Strategi Visual

Website menggunakan **satu tema visual utama** yang konsisten dengan identitas brand masjid.

Penerapan:

- Fokus pada keterbacaan dan kontras yang baik.
- Semua komponen mengikuti satu palet warna utama yang konsisten.
- Tidak ada toggle light/dark mode.
- Tidak ada penyimpanan preference tema user.

### 2.5 Future Considerations

- Integrasi payment gateway untuk donasi otomatis tercatat
- Newsletter email untuk jamaah
- Pendaftaran event online
- Integrasi dengan Google Calendar untuk agenda
- Push notification via Progressive Web App (PWA)

---

## 3. Rancangan Teknologi

### 3.1 Tech Stack Overview

| Layer                  | Teknologi                   | Alasan                                                            |
| ---------------------- | --------------------------- | ----------------------------------------------------------------- |
| **Frontend Framework** | Next.js latest (App Router) | SSR/ISR untuk SEO, Image Optimization, Metadata API untuk OG tags |
| **Language**           | TypeScript                  | Type safety, maintainable jangka panjang                          |
| **Styling**            | Tailwind CSS                | Rapid development, konsisten, bundle kecil                        |
| **UI Components**      | shadcn/ui                   | Accessible, customizable, tidak vendor-locked                     |
| **Backend/Database**   | Supabase (PostgreSQL)       | Managed database, realtime, built-in auth                         |
| **Storage**            | Supabase Storage            | CDN built-in dan terintegrasi                                     |
| **Authentication**     | Supabase Auth               | Email/password dan session management                             |
| **Hosting Frontend**   | Vercel                      | Deployment otomatis dari Git, CDN global                          |
| **Domain**             | Rumahweb (existing)         | Existing domain, tinggal point DNS ke Vercel                      |
| **Rich Text Editor**   | TipTap atau Novel           | WYSIWYG editor untuk konten artikel                               |
| **Form Validation**    | Zod + React Hook Form       | Type-safe validation                                              |
| **Analytics**          | Vercel Analytics            | Privacy-friendly dan mudah diintegrasikan                         |
| **Jadwal Sholat API**  | MyQuran API                 | Gratis dan akurat untuk kota Indonesia                            |

### 3.2 Arsitektur Sistem

```text
User Browser
  -> Vercel / Next.js App (Public + /admin)
  -> Supabase (Database, Storage, Auth)
```

Karakteristik utama:

- Halaman publik memakai SSR/ISR untuk performa dan SEO
- Admin berada dalam satu repo/project yang sama
- Media seperti gambar, QRIS, dan aset konten disimpan di Supabase Storage

### 3.3 Estimasi Biaya Bulanan

| Service           | Tier            | Biaya |
| ----------------- | --------------- | ----- |
| Vercel Hosting    | Hobby (Free)    | Rp 0  |
| Supabase Database | Free Tier       | Rp 0  |
| Supabase Storage  | Free Tier (1GB) | Rp 0  |

---

## 4. Brand Identity & Design System

### 4.1 Logo Masjid

Logo resmi masjid menjadi acuan utama untuk tone visual website.

### 4.2 Color Palette

| Nama              | Hex       | Penggunaan Utama                         |
| ----------------- | --------- | ---------------------------------------- |
| **Deep Emerald**  | `#0F5B4F` | Primary brand, CTA, heading penting      |
| **Emerald**       | `#1F7A67` | Hover state, supporting accent           |
| **Gold**          | `#D6A84F` | Highlight, ornament, emphasis            |
| **Warm Orange**   | `#E8782E` | Progress donasi, accent sekunder         |
| **Crimson**       | `#B8312F` | Countdown, urgency, informasi menonjol   |
| **Cream**         | `#F7F3EB` | Background lembut                        |
| **Charcoal**      | `#1A1A1A` | Text utama                               |

### 4.3 Typography

- Display / heading: serif elegan
- Body text: sans-serif modern yang mudah dibaca
- Arabic text: font khusus Arabic untuk ayat/hadits

### 4.4 Design Principles

1. Bersih dan mudah dipahami.
2. Hangat dan mencerminkan suasana masjid.
3. Mobile-first.
4. Konten lebih utama daripada ornamen.
5. Visual harus terasa konsisten dari homepage sampai admin.
6. Seluruh komponen mengikuti satu bahasa visual yang seragam.

### 4.5 Component Design Rules

- Radius konsisten
- Border tipis dan halus
- Shadow lembut
- CTA jelas dan kontras
- State hover/active/disabled konsisten

---

## 5. Struktur Halaman & Fitur Detail

### 5.1 Site Map

```text
Public Site
├── / (Homepage)
├── /informasi
│   └── /informasi/[slug]
├── /artikel
│   ├── /artikel/kategori/[slug]
│   └── /artikel/[slug]
├── /agenda
│   └── /agenda/[slug]
├── /galeri
│   └── /galeri/[album-slug]
├── /transparansi
│   └── /transparansi/[program-slug]
├── /pengurus
├── /donasi
├── /profil
└── /kontak

Admin CMS
├── /admin/login
├── /admin/dashboard
├── /admin/informasi
├── /admin/artikel
├── /admin/agenda
├── /admin/galeri
├── /admin/transparansi
├── /admin/pengurus
├── /admin/pengaturan
└── /admin/users
```

### 5.2 Komponen Navbar

- Navbar berisi logo masjid, menu navigasi utama, dan CTA utama
- Tidak ada language switcher
- Tidak ada theme toggle
- Pada mobile, navigasi masuk ke hamburger menu

### 5.3 Update pada Homepage

Homepage memiliki elemen:

1. **Navigation Bar**
   - Logo masjid
   - Menu navigation
   - CTA button "Donasi"

2. **Hero Section**
   - Tagline utama dalam Bahasa Indonesia
   - Subtitle singkat dan jelas
   - Background/ornamen mengikuti brand visual utama

3. **Section informasi utama**
   - Countdown hari besar
   - Jadwal sholat hari ini
   - Ringkasan agenda
   - Ringkasan artikel

### 5.4 CMS Update untuk Konten Satu Bahasa

CMS cukup mendukung input konten dalam satu bahasa, yaitu Bahasa Indonesia.

Pattern editor:

- Judul
- Excerpt / ringkasan
- Konten / rich text
- Meta title
- Meta description

Tidak diperlukan:

- Tab bahasa
- Translation fallback
- Struktur field khusus locale

---

## 6. Role & Permission

(Sama dengan PRD v1 - tidak berubah)

| Role            | Artikel | Informasi | Agenda | Galeri | Donasi | Pengurus | Settings | Users |
| --------------- | ------- | --------- | ------ | ------ | ------ | -------- | -------- | ----- |
| Super Admin     | Full    | Full      | Full   | Full   | Full   | Full     | Full     | Full  |
| Admin Konten    | Full    | Full      | Full   | Full   | View   | View     | View     | No    |
| Bendahara       | View    | View      | View   | View   | Full   | View     | View     | No    |

---

## 7. Database Schema

### 7.1 Pendekatan Data Konten

Semua field konten disimpan dalam bentuk field teks biasa tanpa struktur translasi tambahan.

**Example untuk tabel `artikel`:**

```sql
CREATE TABLE artikel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  excerpt TEXT,
  konten TEXT NOT NULL,
  cover_image TEXT,
  og_image TEXT,
  kategori_id UUID REFERENCES kategori_artikel ON DELETE SET NULL,
  author_id UUID REFERENCES profiles ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 Tabel Konten Utama

| Tabel            | Catatan                                  |
| ---------------- | ---------------------------------------- |
| `artikel`        | Konten artikel dan kajian                |
| `informasi`      | Pengumuman dan informasi masjid          |
| `agenda`         | Kegiatan dan jadwal acara                |
| `galeri_album`   | Pengelompokan dokumentasi kegiatan       |
| `galeri_foto`    | Foto dalam album                         |
| `program_donasi` | Program donasi dan transparansi          |
| `pengurus`       | Data pengurus DKM                        |
| `pengaturan`     | Profil masjid, kontak, konfigurasi fixed |

### 7.3 Tabel Pendukung

- `profiles` untuk data user admin
- `rekening_bank` untuk rekening dan metode donasi
- `donatur` untuk daftar donatur
- `pengeluaran` untuk laporan pengeluaran/transparansi

---

## 8. File Structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── artikel/
│   │   ├── informasi/
│   │   ├── agenda/
│   │   ├── galeri/
│   │   └── ...
│   └── (admin)/
│       └── admin/
├── components/
├── services/
├── lib/
└── data/
```

---

## 9. Non-Functional Requirements

### 9.1 Performance

- First Contentful Paint (FCP) < 1.5 detik
- Largest Contentful Paint (LCP) < 2.5 detik
- Time to Interactive (TTI) < 3.5 detik
- Homepage harus terasa sangat cepat saat first load

### 9.2 SEO

- Semua halaman publik server-side rendered atau ISR
- Canonical URL yang konsisten untuk setiap halaman utama
- Sitemap utama untuk seluruh halaman publik
- Open Graph tags lengkap di setiap halaman
- Schema.org markup untuk artikel
- Robots.txt proper

### 9.3 Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader friendly
- `lang="id"` diterapkan secara konsisten
- Prefers-reduced-motion diperhatikan untuk animations

### 9.4 Security & Other

(Sama dengan PRD v1)

---

## 10. Timeline & Milestones

### Fase 1 - MVP Foundation (3 Minggu)

**Minggu 1: Setup & Foundation**

- [ ] Setup project Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Setup Supabase project (database, storage, auth)
- [ ] Implementasi database schema konten
- [ ] Setup RLS policies
- [ ] Setup deployment ke Vercel

**Minggu 2: Homepage + Informasi**

- [ ] Layout utama + navigation + footer
- [ ] Homepage (hero, countdown, jadwal sholat, info terbaru)
- [ ] Apply brand colors (emerald, crimson, orange, gold)
- [ ] Halaman list informasi
- [ ] Halaman detail informasi dengan OG meta
- [ ] Integrasi API MyQuran untuk jadwal sholat
- [ ] Test di desktop, tablet, dan mobile

**Minggu 3: Artikel + CMS Basic**

- [ ] Halaman list artikel
- [ ] Halaman detail artikel dengan OG meta
- [ ] Admin login + auth flow
- [ ] CMS untuk informasi (CRUD)
- [ ] CMS untuk artikel (CRUD + rich text editor)

**Deliverable Fase 1:** Website public + CMS dasar berfungsi dengan homepage, informasi, dan artikel yang bisa dishare.

### Fase 2 - Dashboard Transparansi (2 Minggu)

**Minggu 4-5:** Implementasi dashboard transparansi publik dan modul admin transparansi.

### Fase 3 - Fitur Lengkap (2 Minggu)

**Minggu 6-7:** Agenda, galeri album, pengurus, dan donasi.

### Fase 4 - Polish & Launch (1 Minggu)

**Minggu 8:** Audit SEO, responsive polish, UAT, dan launch preparation.

**Total Durasi:** 8 Minggu (~2 Bulan)

---

## 11. Konten yang Perlu Disiapkan

- [x] Logo masjid (sudah ada - SVG/PNG high-res)
- [ ] Foto masjid (eksterior, interior, min 10 foto)
- [ ] Data pengurus DKM (nama, jabatan, foto, bidang)
- [ ] Profil masjid
- [ ] Visi dan misi
- [ ] 3-5 artikel awal
- [ ] 5-10 informasi/pengumuman awal
- [ ] Foto dokumentasi kegiatan (min 3 album)
- [ ] Nomor rekening resmi masjid
- [ ] File QRIS masjid (PNG)
- [ ] Data program donasi
- [ ] Ayat/hadits untuk halaman donasi (Arab + terjemahan Indonesia)

---

## 12. Risks & Mitigation

| Risk                             | Impact | Likelihood | Mitigation                            |
| -------------------------------- | ------ | ---------- | ------------------------------------- |
| Supabase free tier terlewati     | Medium | Low        | Monitor usage bulanan                 |
| Admin tidak terbiasa CMS         | High   | Medium     | Training khusus + user manual         |
| Foto/data tidak siap saat launch | Medium | High       | Siapkan dummy content                 |
| Scope fitur melebar              | High   | Medium     | Kunci prioritas sesuai fase PRD       |
| API eksternal jadwal sholat down | Medium | Medium     | Siapkan fallback UI dan retry caching |

---

## 13. Appendix

### 13.1 Referensi Library

- Next.js: https://nextjs.org/
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/
- TipTap: https://tiptap.dev/

### 13.2 Istilah Baru

- **ISR**: Incremental Static Regeneration
- **Schema.org**: struktur metadata untuk membantu mesin pencari memahami konten
- **FOUC**: Flash of Unstyled Content

---

**Change Log:**

| Version | Date          | Changes                                               |
| ------- | ------------- | ----------------------------------------------------- |
| 1.0     | 20 April 2026 | Initial PRD draft                                     |
| 2.0     | 20 April 2026 | Added brand colors from logo dan brand identity       |
| 2.1     | 20 April 2026 | Removed multi-language dan dark mode scope            |
