'use client';

import { useRef, useEffect } from 'react';

interface ParallaxBgProps {
  src: string;
  opacity?: number;
  speed?: number; // 0–1, default 0.4 — how much it moves relative to scroll
}

export default function ParallaxBg({ src, opacity = 0.12, speed = 0.4 }: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: +1 when section is just below viewport, -1 when just above
      const progress = rect.top / (viewH + rect.height);
      const maxMove = 100; // stay within the 150px pad
      const offset = Math.max(-maxMove, Math.min(maxMove, progress * viewH * speed * 0.6));
      el.style.transform = `translateY(${offset}px)`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [speed]);

  const pad = 150;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: -pad, bottom: -pad, left: 0, right: 0,
        zIndex: 0,
        backgroundImage: `url('${src}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        opacity,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    />
  );
}
