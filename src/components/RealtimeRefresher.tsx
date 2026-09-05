'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  intervalMs?: number;
}

// Polls for fresh data by calling router.refresh() periodically.
// This triggers Next.js to re-fetch server components with up-to-date data.
// Skipped while the tab is hidden — no point refetching in the background —
// with a catch-up refresh when the tab becomes visible again.
export function RealtimeRefresher({ intervalMs = 60000 }: Props) {
  const router = useRouter();

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') router.refresh();
    };

    const id = setInterval(refreshIfVisible, intervalMs);
    document.addEventListener('visibilitychange', refreshIfVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [router, intervalMs]);

  return null;
}
