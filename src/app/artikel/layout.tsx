import { Providers } from '../providers';
import { getArticlesData } from '@/services/site-data.server';

export const revalidate = 60;

export default async function ArtikelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const articles = await getArticlesData();

  return <Providers initialData={{ articles }}>{children}</Providers>;
}
