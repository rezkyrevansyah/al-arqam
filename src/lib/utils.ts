import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGoogleDriveUrl(url: string | undefined | null): string {
  if (!url) return '';

  // Handle placeholder text from sheet
  if (url === '(kosong dulu)' || url.toLowerCase().includes('kosong')) return '';

  // If it's a data URL (base64) or blob, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  // Regex to extract File ID from various Google Drive URL formats
  const idPattern = /([-a-zA-Z0-9_]{25,})/;
  const match = url.match(idPattern);

  if (match && url.includes('drive.google.com')) {
    const id = match[1];
    return `https://lh3.googleusercontent.com/d/${id}`;
  }

  return url;
}

/**
 * Universal image URL resolver.
 * Handles: Supabase storage paths, Google Drive URLs (legacy), and plain external URLs.
 */
export function formatImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  // Legacy Google Drive URL — convert to direct link
  if (url.includes('drive.google.com')) {
    return formatGoogleDriveUrl(url);
  }

  // Supabase storage path (relative, e.g. "gallery/abc.jpg")
  if (!url.startsWith('http')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    return `${supabaseUrl}/storage/v1/object/public/images-storage/${url}`;
  }

  return url;
}
