'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  intervalMs?: number;
}

// Polls for fresh data by calling router.refresh() periodically.
// This triggers Next.js to re-fetch server components with up-to-date data.
export function RealtimeRefresher({ intervalMs = 30000 }: Props) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
