-- ============================================================
-- SEED: Santunan Anak Yatim dan Dhuafa 1447 H
-- Masjid Al-Arqam — Ramadhan 1447 H / 2026 M
-- Total: 80 donatur, 277 paket, Rp 55.400.000
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Buat program jika belum ada (idempotent)
INSERT INTO transparency_programs (
  slug, title, badge, category, period_label, year,
  description, progress_label,
  collected_amount, target_amount,
  program_type, is_published, sort_order
)
VALUES (
  'santunan-yatim-dhuafa-1447h',
  'Santunan Anak Yatim & Dhuafa',
  'Ramadhan 1447 H',
  'Sosial',
  'Ramadhan 1447 H / Maret 2026',
  2026,
  'Santunan anak yatim dan dhuafa Masjid Al-Arqam. Nilai per paket Rp 200.000.',
  'Dana Terkumpul',
  55400000,
  0,
  'santunan_yatim',
  true,
  2
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert semua 80 entri donatur
WITH prog AS (
  SELECT id FROM transparency_programs
  WHERE slug = 'santunan-yatim-dhuafa-1447h'
  LIMIT 1
)
INSERT INTO santunan_yatim_entries
  (program_id, nama_donatur, rt, jumlah_paket, harga_paket, catatan)
SELECT
  prog.id,
  v.nama_donatur,
  v.rt,
  v.jumlah_paket,
  200000,
  v.catatan
FROM prog
CROSS JOIN (VALUES
  -- No | Nama Donatur                                          | RT   | Paket | Catatan
  ( 1, 'Indra Gusmana',                                        '08',  3, ''),
  ( 2, 'Hariyanto',                                            '04', 10, ''),
  ( 3, 'Achmad Setiawan',                                      '03',  3, ''),
  ( 4, 'Hadi Irwanto',                                         '04', 10, ''),
  ( 5, 'Nabila Ratrie Ekaningrum',                             '06',  2, ''),
  ( 6, 'Hari Yunianto',                                        '06',  5, ''),
  ( 7, 'Hamba Allah (Ibu dari Rt 02)',                         '02',  1, 'Anonim'),
  ( 8, 'S. Widodo',                                            '04', 10, ''),
  ( 9, 'Anton Heri Purnomo',                                   '08',  5, ''),
  (10, 'Wahyu PW',                                             '08',  2, ''),
  (11, 'Heri Suharso',                                         '04',  2, ''),
  (12, 'Daffa Arya Ardhitya',                                  '04',  3, ''),
  (13, 'Hamba Allah (Ibu dari Rt 02)',                         '02',  1, 'Anonim'),
  (14, 'Bima Bramantio',                                       '04',  1, ''),
  (15, 'Titania Darmawan',                                     '04',  1, ''),
  (16, 'Hamba Allah (Bpk dari Rt 03)',                         '03',  2, 'Anonim'),
  (17, 'Suharto',                                              '03',  3, ''),
  (18, 'Ika Iriandi',                                          '05',  2, ''),
  (19, 'Eny Rachmawati',                                       '05', 10, ''),
  (20, 'H. Purnomo',                                           '02',  3, ''),
  (21, 'Atas nama Alm. Khoiruddin Harahap',                   '04',  5, 'In memoriam'),
  (22, 'Suwito',                                               '05',  3, ''),
  (23, 'Nunik Purwati',                                        '06',  3, ''),
  (24, 'Triyono',                                              '03',  3, ''),
  (25, 'Ahmad Safi''i',                                        '06', 10, ''),
  (26, 'Sudarmawan Heru',                                      '04',  2, ''),
  (27, 'Grup Syantik',                                         '04',  2, ''),
  (28, 'H. Samsudin',                                          '02',  3, ''),
  (29, 'Helly Purnanto',                                       '02',  3, ''),
  (30, 'Tidar M Bagaskara',                                    '08',  3, ''),
  (31, 'Muhamad Malik',                                        '04',  1, ''),
  (32, 'Hamba Allah (Ibu dari Rt 02)',                         '02',  1, 'Anonim'),
  (33, 'Yanto Gumay',                                         '03',  2, ''),
  (34, 'Tommy Herdiyanto',                                     '03',  4, ''),
  (35, 'Ibu Eros',                                             '06',  1, ''),
  (36, 'Almarhum Helmi Rahman',                                '04',  1, 'In memoriam'),
  (37, 'Aisyha Nabilla Febriyanti',                            '04',  1, ''),
  (38, 'Ikhsan Hartanto',                                      '06',  3, ''),
  (39, 'Arya Raufal Hamdala',                                  '06',  1, ''),
  (40, 'Keluarga Bahtiar',                                     '05',  4, ''),
  (41, 'H. Andi Makawaru',                                     '05', 15, ''),
  (42, 'Almarhum Heriyanto Tjen',                              '04',  5, 'In memoriam'),
  (43, 'Dwi Istono Hariyanto',                                 '06',  2, ''),
  (44, 'Cicih',                                                '04',  2, ''),
  (45, 'Prihandono Hamidjojo',                                 '02',  3, ''),
  (46, 'M. Rafi Alamsyah Saputra',                             '02',  1, ''),
  (47, 'R. Suhendra',                                          '07',  3, ''),
  (48, 'Budi Triyanto',                                        '06',  5, ''),
  (49, 'Onggo (F13 no.7)',                                     '02',  5, ''),
  (50, 'Anas Hibatullah',                                      '04',  5, ''),
  (51, 'H. Asep Heri',                                         '05',  5, ''),
  (52, 'Sutejo',                                               '08',  5, ''),
  (53, 'Dartim Asmal',                                         '04',  5, ''),
  (54, 'Harsono',                                              '06',  4, ''),
  (55, 'Hamba Allah',                                          '03',  2, 'Anonim'),
  (56, 'Alhafidz Arasyid',                                     '02',  1, ''),
  (57, 'Dwi Tungga Jati (Rt.03/28)',                           '03',  3, ''),
  (58, 'Adi',                                                  '02',  2, ''),
  (59, 'Nurhidayat',                                           '00',  5, ''),
  (60, 'Hamba Allah (F10/15)',                                  '01',  4, 'Anonim'),
  (61, 'Dony Firmansyah',                                      '03',  1, ''),
  (62, 'Achmad Pratama Wildanu & Keluarga (F16/34)',           '03',  5, ''),
  (63, 'Yudi Prasetyo (Blok G3/4)',                            '-',   3, 'Blok G3/4'),
  (64, 'Faozan',                                               '04',  5, ''),
  (65, 'Hamba Allah',                                          '06',  3, 'Anonim'),
  (66, 'Suyono',                                               '04',  5, ''),
  (67, 'Gigih',                                                '05',  3, ''),
  (68, 'Rudi Saiya',                                           '05',  1, ''),
  (69, 'Gang Cinta',                                           '06',  1, ''),
  (70, 'Sugianto',                                             '06',  2, ''),
  (71, 'Azhar P.N',                                            '01',  4, ''),
  (72, 'Mikhayla',                                             '06',  4, ''),
  (73, 'Iqbal',                                                '03',  1, ''),
  (74, 'Taqlim Adzikro',                                       '01',  5, ''),
  (75, 'Hikmat Nurul Fikri',                                   '04',  2, ''),
  (76, 'Heri Santoso',                                         '06',  2, ''),
  (77, 'Hamba Allah',                                          '02',  2, 'Anonim'),
  (78, 'Hamba Allah (F13)',                                     '02',  5, 'Anonim'),
  (79, 'Djatmiko',                                             '04',  2, ''),
  (80, 'Jayanto',                                              '06',  3, '')
) AS v(no, nama_donatur, rt, jumlah_paket, catatan);

-- 3. Verifikasi total
SELECT
  COUNT(*)                          AS total_donatur,
  SUM(jumlah_paket)                 AS total_paket,
  SUM(jumlah_paket * harga_paket)   AS total_nominal
FROM santunan_yatim_entries
WHERE program_id = (
  SELECT id FROM transparency_programs
  WHERE slug = 'santunan-yatim-dhuafa-1447h'
);
-- Expected: 80 donatur | 277 paket | 55.400.000
