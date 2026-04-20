"use client";

import { createContext, useContext, type ReactNode } from 'react';
import type { AllSiteData } from '../data/types';

interface SiteDataContextValue {
  data: AllSiteData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const EMPTY_SITE_DATA: AllSiteData = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
  },
  countdown: {
    name: '',
    date: '',
    description: '',
    active: false,
  },
  agenda: [],
  articles: [],
  gallery: [],
  board: [],
  donation: {
    bankAccountNumber: '',
    bankAccountName: '',
    bankName: '',
    donationCollected: 0,
    donationTarget: 0,
    qrisImageUrl: '',
  },
  footer: {
    address: '',
    phone: '',
    email: '',
    mapsUrl: '',
    socials: [],
  },
};

const SiteDataContext = createContext<SiteDataContextValue>({
  data: EMPTY_SITE_DATA,
  loading: false,
  error: null,
  refresh: () => {},
});

export function SiteDataProvider({ children, initialData }: { children: ReactNode; initialData?: Partial<AllSiteData> }) {
  const data: AllSiteData = {
    ...EMPTY_SITE_DATA,
    ...initialData,
    hero: { ...EMPTY_SITE_DATA.hero, ...initialData?.hero },
    countdown: { ...EMPTY_SITE_DATA.countdown, ...initialData?.countdown },
    donation: { ...EMPTY_SITE_DATA.donation, ...initialData?.donation },
    footer: { ...EMPTY_SITE_DATA.footer, ...initialData?.footer },
  };

  return (
    <SiteDataContext.Provider value={{ data, loading: false, error: null, refresh: () => {} }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
