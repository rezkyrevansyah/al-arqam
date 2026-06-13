"use client";

import { useEffect } from 'react';

export function useScrollToHash() {
  useEffect(() => {
    // Disable browser scroll restoration so the page always starts at top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Handle initial hash on mount
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure DOM is rendered
        const timeoutId = setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return () => clearTimeout(timeoutId);
      } else {
        window.scrollTo(0, 0);
      }
    };

    handleHashChange();

    // Optional: Listen for hash changes if needed (Next.js Link scroll handles this usually, but good for safety)
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
}
