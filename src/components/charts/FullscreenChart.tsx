'use client';

import { useState, useCallback } from 'react';
import { Maximize2, X, RotateCcw } from 'lucide-react';

interface Props {
  title: string;
  children: (fullscreen: boolean) => React.ReactNode;
}

export function FullscreenChart({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const [rotated, setRotated] = useState(false);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setRotated(false);
    try {
      // Try native orientation lock (works on Android Chrome + PWA)
      await (screen.orientation as any).lock('landscape');
    } catch {
      // Not supported (iOS Safari, desktop) — user can rotate manually
    }
  }, []);

  const handleClose = useCallback(async () => {
    setOpen(false);
    setRotated(false);
    try {
      (screen.orientation as any).unlock();
    } catch {}
  }, []);

  const toggleRotate = useCallback(() => {
    setRotated(prev => !prev);
  }, []);

  if (open) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-900 truncate pr-4">{title}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRotate}
              title={rotated ? 'Portrait' : 'Landscape'}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {rotated ? 'Portrait' : 'Landscape'}
            </button>
            <button
              onClick={handleClose}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 overflow-auto">
          {rotated ? (
            // Software landscape rotation for browsers that don't support orientation lock
            <div
              style={{
                width: '100vh',
                height: '100vw',
                transform: 'rotate(90deg)',
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: '100%',
              }}
            >
              {children(true)}
            </div>
          ) : (
            <div className="h-full w-full p-4">
              {children(true)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {children(false)}
      <button
        onClick={handleOpen}
        title="Fullscreen"
        className="absolute right-3 top-3 rounded-lg border border-gray-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm hover:bg-gray-50 active:bg-gray-100"
      >
        <Maximize2 className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}
