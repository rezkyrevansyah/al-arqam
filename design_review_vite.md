# design_review.md — Premium UI + Smooth Motion Checklist

## 0) Definition of Done (DoD)

- [ ] “Terasa perusahaan”: konsisten (warna, spacing, radius, typography), tidak terlihat template.
- [ ] Motion halus: tidak mengganggu, tidak patah, tidak bikin pusing.

## 1) Visual System (konsistensi = premium)

- [ ] Ada design tokens jelas: warna (primary/accent/neutral), radius, shadow, border, typography scale.
- [ ] Hirarki teks tegas: heading, subheading, body, caption—tidak semua “mirip”.
- [ ] Spacing konsisten (section padding, gap antar card, container width seragam).

## 2) Layout & Content (mudah dibaca, enak dipindai)

- [ ] Setiap section punya “anchor”: judul kuat + deskripsi singkat + CTA/aksi jelas (kalau perlu).
- [ ] Card layout rapi: alignment, tinggi gambar, line-clamp, dan state hover konsisten.
- [ ] Galeri: grid editorial (variasi ukuran) + lightbox nyaman (close jelas, gesture/keyboard jika bisa).

## 3) Motion System (very smooth, bukan rame)

- [ ] Semua animasi masuk kategori “subtle”: reveal (opacity + y), hover micro (scale kecil), dan transisi layout.
- [ ] Durasi/easing konsisten (punya 1–2 preset). Animasi tidak random per komponen.
- [ ] Hindari animasi yang memicu layout thrash (height/left/top untuk elemen dinamis). Utamakan transform/opacity. :contentReference[oaicite:5]{index=5}
- [ ] Hormati `prefers-reduced-motion` (user yang sensitif motion harus tetap nyaman). :contentReference[oaicite:6]{index=6}

## 4) Accessibility (kelas perusahaan itu ramah akses)

- [ ] Kontras teks aman (terutama gold/emerald di background terang).
- [ ] Focus state jelas untuk keyboard (nav, tombol, modal, form admin).
- [ ] Gambar punya alt yang bermakna (galeri bisa alt/caption).

## 5) Perceived Performance (rasa cepat)

- [ ] Above-the-fold cepat muncul (hero tidak ketahan asset berat).
- [ ] Skeleton/placeholder untuk list (agenda/artikel/galeri) agar tidak “kosong tiba-tiba”.
- [ ] Interaksi utama responsif: klik nav scroll, open modal, copy rekening—instan terasa.

## Jelaskan hasilnya dalam bentuk tabel
