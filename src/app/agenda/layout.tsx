import { Providers } from '../providers';
import { getAgendaData } from '@/services/site-data.server';

export const revalidate = 60;

export default async function AgendaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const agenda = await getAgendaData();

  return <Providers initialData={{ agenda }}>{children}</Providers>;
}
