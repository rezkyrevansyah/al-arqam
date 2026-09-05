"use client";

import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Gates mounting a heavy below-the-fold widget until it's actually scrolled
 * near (`hasBeenInView`, latches true forever once triggered), and separately
 * tracks live visibility (`isInView`, toggles both ways) so the widget can
 * pause/resume expensive work (WebGL render loops, autoplay timers) while
 * scrolled off-screen without unmounting it.
 */
export function useLazyInView(margin: `${number}px` = '200px') {
  const ref = useRef<HTMLDivElement>(null);
  const hasBeenInView = useInView(ref, { once: true, margin });
  const isInView = useInView(ref, { margin: '0px' });
  return { ref, hasBeenInView, isInView };
}
