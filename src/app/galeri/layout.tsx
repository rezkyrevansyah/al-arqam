import type { Metadata } from 'next';
import { Providers } from '../providers';
import { getGalleryData } from '@/services/site-data.server';

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description:
    "Dokumentasi foto kegiatan ibadah dan dakwah di Masjid Jami' Al-Arqam Bekasi Utara.",
};

export const revalidate = 60;

export default async function GaleriLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gallery = await getGalleryData();

  return <Providers initialData={{ gallery }}>{children}</Providers>;
}
