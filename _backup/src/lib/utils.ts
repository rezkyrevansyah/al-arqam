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
  // Supports:
  // - https://drive.google.com/file/d/{ID}/view
  // - https://drive.google.com/open?id={ID}
  // - https://drive.google.com/uc?id={ID}
  // - https://lh3.googleusercontent.com/d/{ID}
  const idPattern = /([-a-zA-Z0-9_]{25,})/;
  const match = url.match(idPattern);
  
  // Check if it's a Drive share link (drive.google.com)
  if (match && url.includes('drive.google.com')) {
    const id = match[1];
    // Return direct image URL via googleusercontent (more reliable than thumbnail for embedding)
    return `https://lh3.googleusercontent.com/d/${id}`;
  }
  
  return url;
}
