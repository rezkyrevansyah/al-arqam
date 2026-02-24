"use client";

import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AdminPanel from '@/admin/AdminPanel';
import { AdminProvider } from '@/admin/store/admin-store';

export default function AdminSPA() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BrowserRouter basename="/admin">
      <AdminProvider>
        <AdminPanel />
      </AdminProvider>
    </BrowserRouter>
  );
}
