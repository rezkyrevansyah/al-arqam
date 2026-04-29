import type { Metadata } from 'next';
import { Providers } from '../providers';
import { getAgendaData } from '@/services/site-data.server';

export const metadata: Metadata = {
  title: "Agenda Kegiatan",
  description:
    "Jadwal dan agenda kegiatan Masjid Jami' Al-Arqam Bekasi Utara. Kajian, pengajian, dan kegiatan islami rutin.",
};

export const revalidate = 60;

export default async function AgendaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const agenda = await getAgendaData();

  return <Providers initialData={{ agenda }}>{children}</Providers>;
}
