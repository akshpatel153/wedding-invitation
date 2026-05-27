'use client';

import { useEffect } from 'react';

/**
 * Mounts once, observes every .fade-up / .fade-left / .fade-right / .scale-in
 * element and adds .visible when it enters the viewport.
 * Also handles elements already in view on page load.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const selectors = '.fade-up, .fade-left, .fade-right, .scale-in';

    const observe = () => {
      const elements = document.querySelectorAll<HTMLElement>(selectors);

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              io.unobserve(entry.target); // fire once per element
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el) => {
        // If element is already visible in viewport (e.g. top of page), reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        } else {
          io.observe(el);
        }
      });

      return io;
    };

    // Run immediately
    let io = observe();

    // Also re-run after a short delay to catch dynamically rendered content
    const t = setTimeout(() => {
      io.disconnect();
      io = observe();
    }, 300);

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return null;
}
