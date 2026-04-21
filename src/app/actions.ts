'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateSiteData() {
  revalidatePath('/');
  revalidatePath('/dashboard');
}
