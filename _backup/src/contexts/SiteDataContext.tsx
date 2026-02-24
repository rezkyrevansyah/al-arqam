import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AllSiteData } from '../data/types';
import { fetchAllData } from '../services/api';
import { getCached, setCache } from '../services/cache';

interface SiteDataContextValue {
  data: AllSiteData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SiteDataContext = createContext<SiteDataContextValue>({
  data: null,
  loading: true,
  error: null,
  refresh: () => {},
});

const CACHE_KEY = 'siteData';

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AllSiteData | null>(() => getCached<AllSiteData>(CACHE_KEY));
  const [loading, setLoading] = useState(!getCached<AllSiteData>(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchAllData();
      setData(result);
      setCache(CACHE_KEY, result);
    } catch (err) {
      setError((err as Error).message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = getCached<AllSiteData>(CACHE_KEY);
    if (cached) {
      setData(cached);
      setLoading(false);
      // Refresh in background
      loadData();
    } else {
      loadData();
    }
  }, [loadData]);

  return (
    <SiteDataContext.Provider value={{ data, loading, error, refresh: loadData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
