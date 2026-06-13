import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  // Revalidate all pages that display agenda or gallery data
  revalidatePath('/');
  revalidatePath('/agenda');
  revalidatePath('/galeri');
  revalidatePath('/dashboard');

  // Revalidate the unstable_cache tags used in site-data.server.ts
  revalidateTag('home-site-data');
  revalidateTag('agenda-site-data');
  revalidateTag('gallery-site-data');
  revalidateTag('articles-site-data');
  revalidateTag('footer-site-data');

  return NextResponse.json({ revalidated: true });
}
