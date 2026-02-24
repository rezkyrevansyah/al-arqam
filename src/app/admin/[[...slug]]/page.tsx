import AdminSPA from '@/components/AdminSPA';

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function AdminPage() {
  return <AdminSPA />;
}
