# code_review.md — Vite Web App (High Quality Checklist)

## 0) Definition of Done (DoD)

- [ ] Lighthouse (Mobile) bagus: Performance/Accessibility/Best Practices/SEO tidak ada red flags besar (cek terutama LCP/INP/CLS).
- [ ] Tidak ada console error/warn penting saat build & runtime.
- [ ] Semua halaman utama terasa responsif (scroll/klik) dan animasi tidak patah-patah.

## 1) Architecture & Maintainability (DRY/SOLID)

- [ ] Komponen punya tanggung jawab jelas (SRP). Kalau satu komponen mulai “gemuk”, pecah jadi sub-komponen / hooks.
- [ ] Logic reusable dipindah ke `hooks/` atau `lib/` (hindari duplikasi fetch, format tanggal, currency, dsb).
- [ ] Data model & props typed (TypeScript). Tidak ada `any` kecuali terpaksa dan diberi alasan.
- [ ] “Public UI” dan “Admin UI” terpisah rapi (route/layout/components), tidak campur styling & state.

## 2) Performance (yang paling terasa di user)

- [ ] Code splitting: route-level lazy/dynamic import untuk halaman berat (admin/editor/galeri). (Kurangi initial JS.) :contentReference[oaicite:0]{index=0}
- [ ] Hindari import besar: pastikan tree-shaking jalan (import per fungsi, bukan “import \*”).
- [ ] Asset: gambar pakai format modern (WebP/AVIF) + lazy-loading untuk below-the-fold; ukuran gambar sesuai container (no oversized). :contentReference[oaicite:1]{index=1}
- [ ] Animasi hanya pakai `transform/opacity` untuk yang sering bergerak (lebih aman untuk performa). :contentReference[oaicite:2]{index=2}
- [ ] Tailwind production: pastikan konfigurasi content benar + CSS di-minify + kompres (Brotli/Gzip) saat deploy. :contentReference[oaicite:3]{index=3}

## 3) State, Data Fetching, Error Handling

- [ ] Fetch data punya pola konsisten: loading state, empty state, error state (tidak silent fail).
- [ ] Tidak ada re-render berlebihan: memoization seperlunya (bukan “memo everywhere”). Optimasi hanya jika ada bukti (profiling).
- [ ] Form admin: validasi input + feedback jelas (toast) + disable button saat submit.

## 4) Security & Safety (minimal tapi penting)

- [ ] Tidak ada secret di client bundle (cek env prefix Vite: hanya expose yang memang public).
- [ ] Semua input admin disanitasi/validasi sebelum disimpan dan sebelum dirender (hindari XSS, terutama artikel).
- [ ] Upload: batasi tipe file + ukuran + handle error upload.

## 5) Build & DX

- [ ] `npm run build` bersih. Tidak ada “some chunks are larger…” tanpa alasan; jika ada, dokumentasikan dan split. :contentReference[oaicite:4]{index=4}
- [ ] ESLint/Typecheck/formatting konsisten (aturan sederhana tapi tegas).

## 6) Small Files (< 200 LOC) — Quick Review (tetap wajib)

- [ ] Komponen punya 1 tanggung jawab (SRP). Jika mulai campur UI + logic, pindahkan logic ke hook/util.
- [ ] Tidak ada side-effect liar: `useEffect` dependency benar + cleanup untuk listener/interval/timer.
- [ ] Render tidak boros: hindari bikin object/array/function berat di dalam render tanpa alasan.
- [ ] Animasi aman: gunakan `transform/opacity` untuk motion; hindari animasi `top/left/height` pada elemen yang sering berubah.
- [ ] Aksesibilitas basic: button/link semantik, fokus terlihat, `aria-*` untuk modal/menu bila ada.
- [ ] Type aman: hindari `any`; props/default value jelas.
- [ ] Jika ada async/fetch: ada loading + error state minimal (tidak silent fail).

## Jelaskan hasilnya dalam bentuk tabel
