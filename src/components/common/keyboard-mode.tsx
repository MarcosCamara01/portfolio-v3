'use client';

import { useEffect } from 'react';

// Marks <html data-keyboard> from a Tab press until the next pointer input, so CSS can
// drop transitions while the keyboard moves focus (globals.css). It is set on keydown,
// before focus moves; a `:has(:focus-visible)` check is briefly false mid-move.
export function KeyboardMode() {
  useEffect(() => {
    const root = document.documentElement;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') root.dataset.keyboard = '';
    };
    const onPointer = () => {
      if ('keyboard' in root.dataset) delete root.dataset.keyboard;
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('pointermove', onPointer, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('pointermove', onPointer, true);
    };
  }, []);

  return null;
}
