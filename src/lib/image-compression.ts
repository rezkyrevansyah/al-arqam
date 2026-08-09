import imageCompression from 'browser-image-compression';
import type { ImageFolder } from './supabase';

const COMPRESSIBLE_FOLDERS: ImageFolder[] = ['gallery', 'articles', 'board'];

/**
 * Compresses a photo client-side before upload. QRIS/donation images are
 * passed through untouched — resizing a QR code risks breaking scannability,
 * and those files are already small.
 */
export async function compressImageFile(file: File, folder: ImageFolder): Promise<File> {
  if (!COMPRESSIBLE_FOLDERS.includes(folder)) return file;

  const compressedBlob = await imageCompression(file, {
    maxWidthOrHeight: 1920,
    maxSizeMB: 0.8,
    initialQuality: 0.82,
    useWebWorker: true
  });

  return new File([compressedBlob], file.name, {
    type: compressedBlob.type || file.type,
    lastModified: Date.now()
  });
}
