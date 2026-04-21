-- Tambah kolom show_donors ke transparency_programs
-- Default true agar program existing tetap tampil donatur
ALTER TABLE transparency_programs
  ADD COLUMN IF NOT EXISTS show_donors boolean NOT NULL DEFAULT true;

-- Set false untuk infaq_tarawih dan santunan_yatim yang sudah ada
-- (karena keduanya sudah punya donor list sendiri di chart)
UPDATE transparency_programs SET show_donors = false
  WHERE program_type IN ('infaq_tarawih', 'santunan_yatim');

-- Verifikasi
SELECT slug, program_type, show_donors FROM transparency_programs ORDER BY sort_order;
