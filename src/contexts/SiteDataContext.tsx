"use client";

import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
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
  const rawData: AllSiteData = useMemo(() => ({
    ...EMPTY_SITE_DATA,
    ...initialData,
    hero: { ...EMPTY_SITE_DATA.hero, ...initialData?.hero },
    countdown: { ...EMPTY_SITE_DATA.countdown, ...initialData?.countdown },
    donation: { ...EMPTY_SITE_DATA.donation, ...initialData?.donation },
    footer: { ...EMPTY_SITE_DATA.footer, ...initialData?.footer },
  }), [initialData]);

  // `initialData` gets a brand-new object reference on every `router.refresh()`
  // even when the underlying (server-cached) content is byte-identical. Keep
  // the same `data`/`value` reference across renders when the serialized
  // content hasn't actually changed, so consumers of useSiteData() can bail
  // out of re-rendering via React's Object.is check on context value.
  const stableDataRef = useRef(rawData);
  const stableSerializedRef = useRef<string>(JSON.stringify(rawData));
  const serialized = JSON.stringify(rawData);
  if (serialized !== stableSerializedRef.current) {
    stableSerializedRef.current = serialized;
    stableDataRef.current = rawData;
  }

  const value = useMemo(
    () => ({ data: stableDataRef.current, loading: false, error: null, refresh: () => {} }),
    [stableDataRef.current]
  );

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
