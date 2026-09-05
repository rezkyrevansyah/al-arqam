import { createClient as createBrowserClient } from '@/utils/supabase/client';

// Browser client untuk admin auth dan upload.
export const supabase = createBrowserClient();

const BUCKET = 'images-storage';

/**
 * Mengembalikan full public URL dari storage path atau URL eksternal.
 * Contoh path: "gallery/abc.jpg" → "https://...supabase.co/storage/v1/object/public/images-storage/gallery/abc.jpg"
 */
export function getStorageUrl(path: string | undefined | null): string {
  if (!path) return '';
  // Sudah full URL (Supabase, Google Drive, atau eksternal)
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  // Relative path di Supabase Storage
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export type ImageFolder = 'gallery' | 'articles' | 'board' | 'donation' | 'events';

/**
 * Upload file ke Supabase Storage.
 * Mengembalikan storage path (bukan full URL).
 * Gunakan getStorageUrl(path) untuk mendapatkan URL yang bisa ditampilkan.
 */
export async function uploadImage(file: File, folder: ImageFolder): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(name, file, { upsert: false, cacheControl: '3600' });

  if (error) throw new Error(`Upload gagal: ${error.message}`);
  return name;
}
