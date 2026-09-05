import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  // Revalidate all pages that display agenda or gallery data
  revalidatePath('/');
  revalidatePath('/agenda');
  revalidatePath('/galeri');
  revalidatePath('/dashboard');
  revalidatePath('/qurban');
  revalidatePath('/kegiatan/qurban');
  revalidatePath('/tahun-baru-islam');
  revalidatePath('/kegiatan/tahun-baru-islam');

  // Revalidate the unstable_cache tags used in site-data.server.ts
  revalidateTag('home-site-data', 'max');
  revalidateTag('agenda-site-data', 'max');
  revalidateTag('gallery-site-data', 'max');
  revalidateTag('articles-site-data', 'max');
  revalidateTag('footer-site-data', 'max');

  // Revalidate the unstable_cache tags used in events.server.ts
  revalidateTag('event-programs-site-data', 'max');
  revalidateTag('qurban-config-site-data', 'max');

  return NextResponse.json({ revalidated: true });
}
