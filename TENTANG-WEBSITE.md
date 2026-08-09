# Tentang Website Masjid Jami' Al-Arqam

Website resmi Masjid Jami' Al-Arqam (Bekasi Utara) — profil masjid, informasi jadwal sholat, kegiatan, artikel keislaman, galeri dokumentasi, transparansi donasi, hingga panel admin (CMS) untuk mengelola semua konten tanpa perlu sentuh kode.

## 1. Isi & Fitur Website

### Landing page (`/`)
- **Hero** — identitas & tagline masjid.
- **Galeri Terbaru (Accordion Gallery)** — preview foto kegiatan gaya accordion interaktif (hover untuk expand).
- **Infaq Section** — info rekening bank & QRIS untuk donasi cepat, dengan copy-to-clipboard dan unduh QRIS.
- **Countdown** — hitung mundur menuju momen/acara penting.
- **Jadwal Sholat** — waktu Subuh, Dzuhur, Ashar, Maghrib, Isya (+ Imsak, Terbit, Dhuha) real-time, diambil otomatis dari API MyQuran untuk wilayah Bekasi, dengan indikator waktu sholat berikutnya yang update tiap 30 detik.
- **Agenda Kegiatan** — daftar kegiatan mendatang (kajian, sholat, kegiatan sosial, rapat) dengan kategori berwarna.
- **Artikel** — konten keislaman/berita masjid, artikel unggulan + daftar artikel lain.
- **Galeri Kegiatan** (grid + lightbox) — dokumentasi foto lengkap dengan lightbox navigasi keyboard.
- **Pengurus** — profil pengurus/DKM dalam marquee berjalan.
- **Donasi** — progress bar target vs terkumpul, info rekening & QRIS yang terhubung ke data admin (bukan hardcode).
- **Footer** — kontak, alamat, media sosial.

### Halaman lain
- `/galeri` — galeri foto lengkap dengan filter tahun & lightbox.
- `/artikel` & `/artikel/[id]` — daftar dan detail artikel, termasuk artikel terkait.
- `/agenda` — daftar lengkap agenda kegiatan.
- `/dashboard` — **dashboard transparansi keuangan** publik: total program, dana terkumpul, progress per-program, daftar donatur, serta grafik (Recharts) untuk program ZIS, Infaq Tarawih, dan Santunan Yatim.
- `/qurban` — microsite kampanye Qurban (paket patungan sapi/kambing/domba, kontak, CTA).
- `/tahun-baru-islam` — microsite hasil lomba Gema Muharram (mewarnai, hafalan, adzan, tilawah).

### Panel Admin (`/admin`)
CMS internal (login via Supabase Auth) untuk mengelola seluruh konten di atas tanpa coding:
- Hero, Countdown, Footer
- Galeri, Artikel (dengan rich text editor Tiptap)
- Pengurus/Board
- Agenda + kategori kustom
- Donasi (rekening, QRIS, target donasi)
- Transparansi (program, metrik, daftar donatur, publish toggle)
- Upload gambar dengan **kompresi otomatis** sebelum disimpan ke storage.

## 2. Keunggulan

- **Cepat & ringan** — gambar dikompres otomatis saat upload dan dioptimasi otomatis saat ditampilkan (resize sesuai layar + format modern WebP), lightbox dan galeri tetap tajam tanpa membebani loading.
- **Konten selalu update tanpa deploy ulang** — semua teks/foto/agenda dikelola lewat panel admin, langsung tayang di publik lewat sistem revalidate otomatis (ISR + on-demand revalidation + auto-refresh berkala).
- **Transparan** — dashboard donasi publik menampilkan progress dana secara terbuka lengkap dengan grafik, membangun kepercayaan jamaah.
- **Jadwal sholat akurat & otomatis** — terintegrasi API eksternal, tidak perlu update manual tiap hari.
- **SEO-ready** — metadata lengkap (OpenGraph, Twitter Card), structured data JSON-LD (schema `Mosque`), sitemap & robots.txt otomatis.
- **Desain modern & interaktif** — animasi halus (Framer Motion, GSAP), galeri accordion, marquee pengurus, responsive di semua ukuran layar.
- **Aman** — autentikasi admin via Supabase Auth, halaman admin di-*disallow* dari mesin pencari.
- **Skalabel untuk campaign musiman** — microsite terpisah untuk momen seperti Qurban atau Tahun Baru Islam tanpa mengganggu halaman utama.

## 3. Teknologi yang Dipakai

| Kategori | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Bahasa | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Animasi | Framer Motion, GSAP |
| Backend / Database | [Supabase](https://supabase.com) (Postgres, Auth, Storage) |
| Rich Text Editor | Tiptap (untuk editor artikel di admin) |
| Grafik/Chart | Recharts (dashboard transparansi) |
| Ikon | Lucide React |
| Kompresi Gambar | browser-image-compression (kompres foto sisi klien sebelum upload) |
| Optimasi Gambar | next/image (Next.js Image Optimization) |
| Routing Admin (SPA) | React Router DOM (di dalam panel `/admin`) |
| Hosting/Deploy | Vercel |
| Jadwal Sholat | API MyQuran (data eksternal, real-time) |

## 4. Arsitektur Singkat

- **Rendering**: Server Components + ISR (`revalidate` per halaman) untuk performa, dikombinasikan dengan endpoint `POST /api/revalidate` untuk revalidasi on-demand saat admin mengubah data, plus polling ringan (`RealtimeRefresher`) agar halaman publik auto-refresh.
- **Data**: Semua konten (galeri, artikel, agenda, donasi, transparansi, pengurus) disimpan di Supabase Postgres, gambar di Supabase Storage.
- **Autentikasi admin**: Supabase Auth (email/password), digate di level komponen (`ProtectedRoutes`) untuk seluruh rute `/admin/*`.
