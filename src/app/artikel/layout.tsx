import type { Metadata } from 'next';
import { Providers } from '../providers';
import { getArticlesData } from '@/services/site-data.server';

export const metadata: Metadata = {
  title: "Artikel Islami",
  description:
    "Kumpulan artikel islami, kajian, dan khutbah dari Masjid Jami' Al-Arqam Bekasi Utara.",
};

export const revalidate = 60;

export default async function ArtikelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const articles = await getArticlesData();

  return <Providers initialData={{ articles }}>{children}</Providers>;
}
