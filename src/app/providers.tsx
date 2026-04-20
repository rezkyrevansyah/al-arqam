"use client";

import { SiteDataProvider } from '@/contexts/SiteDataContext';
import type { AllSiteData } from '@/data/types';

export function Providers({ children, initialData }: { children: React.ReactNode; initialData?: Partial<AllSiteData> }) {
  return (
    <SiteDataProvider initialData={initialData}>
      {children}
    </SiteDataProvider>
  );
}
