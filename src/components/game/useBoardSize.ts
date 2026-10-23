"use client";

import { RefObject, useLayoutEffect, useState } from 'react';

export const CARD_RATIO = 0.8; // width / height

interface BoardSize {
  cols: number;
  rows: number;
  cardW: number;
  gap: number;
}

/**
 * Works out the largest card size that lets the whole board fit the space
 * left on screen, so nothing ever needs scrolling during play. On a landscape
 * screen a non-square grid is turned on its side.
 */
export function useBoardSize(ref: RefObject<HTMLElement | null>, cols: number, rows: number): BoardSize {
  const [size, setSize] = useState<BoardSize>({ cols, rows, cardW: 0, gap: 8 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const cs = getComputedStyle(el);
      const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const height = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (!width || !height) return;
      const landscape = width > height * 1.1;
      const c = landscape ? Math.max(cols, rows) : Math.min(cols, rows);
      const r = landscape ? Math.min(cols, rows) : Math.max(cols, rows);
      const gap = Math.max(6, Math.min(14, Math.floor(Math.min(width, height) / 50)));
      const byWidth = (width - gap * (c - 1)) / c;
      const byHeight = ((height - gap * (r - 1)) / r) * CARD_RATIO;
      const cardW = Math.floor(Math.min(byWidth, byHeight, 180));
      setSize({ cols: c, rows: r, cardW, gap });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, cols, rows]);

  return size;
}
