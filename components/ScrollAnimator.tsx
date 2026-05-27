'use client';

import { useEffect, useRef } from 'react';

export default function ScrollAnimator() {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Trigger page load class
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);

    // Intersection observer for scroll animations
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // For timeline dots specifically
            if (entry.target.classList.contains('timeline-dot')) {
              observer.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    // Observe all animated elements
    const elements = document.querySelectorAll(
      '.fade-up, .fade-left, .fade-right, .scale-in, .timeline-dot'
    );
    elements.forEach((el) => observer.current?.observe(el));

    return () => {
      clearTimeout(timer);
      observer.current?.disconnect();
    };
  }, []);

  return null;
}
