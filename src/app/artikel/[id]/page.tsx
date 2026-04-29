import type { Metadata } from 'next';

import ArticleDetailPageClient from './ArticleDetailPageClient';
import { getArticlesData } from '@/services/site-data.server';

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getArticlesData();

  return articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const articles = await getArticlesData();
  const article = articles.find((item) => item.id === id);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ArticleDetailPageClient id={id} />;
}
