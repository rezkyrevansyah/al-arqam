# Admin Integration Guide - Masjid Al-Arqom

Dokumentasi untuk AI/developer yang akan membuat admin page.

## Data yang Bisa Dikelola dari Admin

Semua data ada di `src/data/constants.ts` dengan TypeScript interfaces.

---

### 1. Agenda/Kegiatan

**File**: `src/data/constants.ts` → `AGENDA_DATA`
**Interface**: `AgendaItem`

| Field       | Type   | Deskripsi                                     |
| ----------- | ------ | --------------------------------------------- |
| id          | string | ID unik                                       |
| title       | string | Judul kegiatan                                |
| date        | string | Tanggal (YYYY-MM-DD)                          |
| time        | string | Waktu (contoh: "18:30 WIB")                   |
| location    | string | Lokasi kegiatan                               |
| description | string | Deskripsi kegiatan                            |
| category    | enum   | "kajian" \| "sholat" \| "kegiatan" \| "rapat" |

**Digunakan di**: `Agenda.tsx`

---

### 2. Artikel

**File**: `src/data/constants.ts` → `ARTICLES_DATA`
**Interface**: `Article`

| Field    | Type   | Deskripsi                   |
| -------- | ------ | --------------------------- |
| id       | string | ID unik                     |
| title    | string | Judul artikel               |
| excerpt  | string | Ringkasan artikel           |
| content  | string | Isi lengkap artikel         |
| author   | string | Nama penulis                |
| date     | string | Tanggal terbit (YYYY-MM-DD) |
| image    | string | URL gambar cover            |
| category | string | Kategori (bebas)            |

**Digunakan di**: `Articles.tsx`

---

### 3. Galeri Foto

**File**: `src/data/constants.ts` → `GALLERY_DATA`
**Interface**: `GalleryItem`

| Field | Type   | Deskripsi                 |
| ----- | ------ | ------------------------- |
| id    | string | ID unik                   |
| image | string | URL gambar                |
| title | string | Judul/caption foto        |
| date  | string | Tanggal foto (YYYY-MM-DD) |

**Digunakan di**: `Gallery.tsx`

---

### 4. Pengurus DKM

**File**: `src/data/constants.ts` → `MANAGEMENT_DATA`
**Interface**: `ManagementMember`

| Field | Type   | Deskripsi       |
| ----- | ------ | --------------- |
| id    | string | ID unik         |
| name  | string | Nama lengkap    |
| title | string | Jabatan         |
| image | string | URL foto profil |

**Digunakan di**: `Pengurus.tsx`

---

### 5. Donasi

**File**: `src/data/constants.ts`

| Konstanta           | Type   | Deskripsi                 |
| ------------------- | ------ | ------------------------- |
| BANK_ACCOUNT_NUMBER | string | Nomor rekening bank       |
| BANK_ACCOUNT_NAME   | string | Nama pemilik rekening     |
| DONATION_COLLECTED  | number | Dana yang sudah terkumpul |
| DONATION_TARGET     | number | Target donasi             |
| QRIS_IMAGE_PATH     | string | Path file QRIS            |

**Digunakan di**: `Donation.tsx`

---

### 6. Event Countdown

**File**: `src/data/constants.ts` → `ISRA_MIRAJ_DATE`

| Field           | Type   | Deskripsi                   |
| --------------- | ------ | --------------------------- |
| ISRA_MIRAJ_DATE | string | Tanggal target (ISO format) |

**Digunakan di**: `Countdown.tsx`

---

### 7. Kontak & Sosial Media

**File**: `src/data/constants.ts`

**CONTACT_INFO**:
| Field | Deskripsi |
|-------|-----------|
| address | Alamat lengkap |
| phone | Nomor telepon |
| email | Email |
| mapsUrl | Link Google Maps |

**SOCIAL_LINKS** (array):
| Field | Type | Deskripsi |
|-------|------|-----------|
| platform | enum | "instagram" \| "youtube" \| "facebook" \| "tiktok" |
| url | string | Link profil |

**Digunakan di**: `Footer.tsx`

---

## Static Assets (public/)

| File            | Deskripsi   | Digunakan di   |
| --------------- | ----------- | -------------- |
| logo.png        | Logo masjid | Navbar, Footer |
| qris-masjid.svg | Gambar QRIS | Donation       |

---

## Rekomendasi Arsitektur Admin

### Opsi 1: API + Database (Recommended)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Admin Page  │────▶│ REST API    │────▶│ Database    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │Landing Page │
                    └─────────────┘
```

### Opsi 2: JSON Files (Simple)

- Admin mengubah file JSON
- Landing page baca dari JSON files
- Cocok untuk website statis

### Opsi 3: Firebase/Supabase (Serverless)

- Realtime update
- Built-in authentication
- Mudah setup

---

## Langkah Integrasi

1. **Setup Backend**: Buat API endpoint untuk setiap data type
2. **Ganti Constants**: Ubah import dari `constants.ts` ke API fetch
3. **Create Admin UI**: Dashboard dengan form untuk edit data
4. **Upload Handler**: Untuk gambar galeri, artikel, QRIS
5. **Authentication**: Protect admin routes

---

## File Structure Saat Ini

```
src/
├── components/
│   ├── Agenda.tsx      ← uses AGENDA_DATA
│   ├── Articles.tsx    ← uses ARTICLES_DATA
│   ├── Countdown.tsx   ← uses ISRA_MIRAJ_DATE
│   ├── Donation.tsx    ← uses DONATION_*, QRIS_*, BANK_*
│   ├── Footer.tsx      ← uses CONTACT_INFO, SOCIAL_LINKS
│   ├── Gallery.tsx     ← uses GALLERY_DATA
│   ├── Hero.tsx
│   ├── Navbar.tsx      ← uses NAV_LINKS
│   └── Pengurus.tsx    ← uses MANAGEMENT_DATA
├── data/
│   └── constants.ts    ← ALL EDITABLE DATA HERE
└── ...
```
