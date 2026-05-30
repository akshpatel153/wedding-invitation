'use client';

import { useEffect, useRef } from 'react';

interface HeroProps {
  name1: string;
  name2: string;
  dateDisplay: string;
  venueName: string;
  venueCity: string;
  heroImage: string;
}

// Floating petal shapes
const PETALS = [
  { left: '6%',  delay: -4,  duration: 14, size: 44, rotate: 20,  opacity: 0.7  },
  { left: '16%', delay: -11, duration: 18, size: 32, rotate: -35, opacity: 0.55 },
  { left: '28%', delay: -2,  duration: 12, size: 52, rotate: 10,  opacity: 0.65 },
  { left: '42%', delay: -8,  duration: 16, size: 36, rotate: 50,  opacity: 0.5  },
  { left: '58%', delay: -14, duration: 20, size: 48, rotate: -20, opacity: 0.6  },
  { left: '70%', delay: -5,  duration: 13, size: 30, rotate: 70,  opacity: 0.55 },
  { left: '82%', delay: -9,  duration: 17, size: 42, rotate: -45, opacity: 0.5  },
  { left: '92%', delay: -3,  duration: 15, size: 34, rotate: 30,  opacity: 0.45 },
];

export default function Hero({ name1, name2, dateDisplay, venueName, venueCity, heroImage }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const el = sectionRef.current?.querySelector('.hero-bg') as HTMLElement | null;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.35}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Page-load body class — add immediately, no timeout needed
  useEffect(() => {
    document.body.classList.add('loaded');
    // Clean up so revisiting starts fresh
    return () => document.body.classList.remove('loaded');
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Background Image (with parallax) ── */}
      <div
        className="hero-bg"
        style={{
          position: 'absolute',
          inset: '-10% 0',          /* extra height for parallax travel */
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
          zIndex: 0,
        }}
      />

      {/* ── Overlay layers ── */}
      {/* Top vignette - keeps navbar readable */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(20,10,10,0.55) 0%, rgba(20,10,10,0.1) 30%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      {/* Bottom gradient - text readability */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to top, rgba(20,10,10,0.75) 0%, rgba(20,10,10,0.35) 35%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* Center tint - very subtle warmth */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, rgba(44,30,30,0.1) 0%, rgba(44,30,30,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {PETALS.map((p, i) => (
        // Outer div: float animation (translateY via CSS keyframes)
        // Inner img: static rotation — kept separate so they don't conflict
        <div
          key={i}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/flower-petal.png"
            alt=""
            aria-hidden="true"
            style={{
              width: '100%', height: 'auto',
              transform: `rotate(${p.rotate}deg)`,
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
              userSelect: 'none',
              display: 'block',
            }}
          />
        </div>
      ))}

      {/* ── Main Text Content ── */}
      <div style={{
        position: 'relative', zIndex: 4,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: 820,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        /* Sit slightly below center for cinematic feel */
        marginTop: '6vh',
      }}>

        {/* Eyebrow label */}
        <div className="hero-date" style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
        }}>
          <span style={{ display: 'block', width: 48, height: 1, background: 'rgba(255,255,255,0.5)' }} />
          <span style={{
            fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500,
            fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
          }}>
            Together Forever
          </span>
          <span style={{ display: 'block', width: 48, height: 1, background: 'rgba(255,255,255,0.5)' }} />
        </div>

        {/* Couple names — the star of the show */}
        <h1
          className="font-display hero-names"
          style={{
            fontSize: 'clamp(72px, 13vw, 148px)',
            color: '#FFFFFF',
            lineHeight: 0.9,
            marginBottom: 28,
            textShadow: '0 4px 32px rgba(20,10,10,0.6), 0 2px 8px rgba(20,10,10,0.4)',
            letterSpacing: '-0.01em',
          }}
        >
          {name1} &amp; {name2}
        </h1>

        {/* Ornamental divider */}
        <div className="hero-date" style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22,
        }}>
          <svg viewBox="0 0 60 4" width={60} height={4}>
            <line x1="0" y1="2" x2="60" y2="2" stroke="rgba(201,169,110,0.8)" strokeWidth="0.5" />
          </svg>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none">
            <path d="M12 2C8 6 2 8 2 12c0 4 4 6 10 10C18 18 22 16 22 12c0-4-6-6-10-10z"
              fill="rgba(201,169,110,0.85)" />
          </svg>
          <svg viewBox="0 0 60 4" width={60} height={4}>
            <line x1="0" y1="2" x2="60" y2="2" stroke="rgba(201,169,110,0.8)" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Date */}
        <p
          className="hero-date"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.02em',
            marginBottom: 12,
            textShadow: '0 2px 12px rgba(20,10,10,0.5)',
          }}
        >
          {dateDisplay}
        </p>

        {/* Venue */}
        <p
          className="hero-venue"
          style={{
            fontFamily: 'var(--font-jost), sans-serif',
            fontWeight: 300, fontSize: 13,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: 44,
            textShadow: '0 2px 8px rgba(20,10,10,0.5)',
          }}
        >
          {venueName} &mdash; {venueCity}
        </p>

        {/* CTAs */}
        <div className="hero-cta" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => scrollTo('#rsvp')}
            style={{
              fontFamily: 'var(--font-jost), sans-serif',
              fontWeight: 500, fontSize: 11,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '15px 40px',
              background: 'rgba(255,255,255,0.92)',
              color: 'var(--color-text-primary)',
              border: 'none', borderRadius: 999,
              cursor: 'pointer',
              transition: 'all 280ms ease',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 24px rgba(20,10,10,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(20,10,10,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.92)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(20,10,10,0.3)';
            }}
          >
            RSVP Now
          </button>

          <button
            onClick={() => scrollTo('#story')}
            style={{
              fontFamily: 'var(--font-jost), sans-serif',
              fontWeight: 400, fontSize: 11,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '14px 36px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,255,255,0.45)',
              borderRadius: 999,
              cursor: 'pointer',
              transition: 'all 280ms ease',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="hero-cta"
        style={{
          position: 'absolute', bottom: 36, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
          fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
        }}>
          Scroll
        </span>
        {/* Mouse icon */}
        <svg viewBox="0 0 22 36" width={16} height={26} fill="none" style={{ opacity: 0.5 }}>
          <rect x="1" y="1" width="20" height="34" rx="10" stroke="white" strokeWidth="1.5" />
          <rect x="9" y="6" width="4" height="8" rx="2" fill="white" style={{ animation: 'bounceIndicator 1.8s ease-in-out infinite' }} />
        </svg>
      </div>

      {/* ── Bottom decorative text: year ── */}
      <div style={{
        position: 'absolute', bottom: 36, right: 36,
        zIndex: 4,
        fontFamily: 'var(--font-cormorant), serif',
        fontStyle: 'italic', fontWeight: 300,
        fontSize: 13, color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.1em',
      }}>
        2026
      </div>
    </section>
  );
}
