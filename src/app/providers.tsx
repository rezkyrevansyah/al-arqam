"use client";

import { SiteDataProvider } from '@/contexts/SiteDataContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteDataProvider>
      {children}
    </SiteDataProvider>
  );
}
