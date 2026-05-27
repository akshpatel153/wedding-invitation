'use client';
import ParallaxBg from './ParallaxBg';

interface FooterProps {
  monogram: string;
  dateShort: string;
}

export default function Footer({ monogram, dateShort }: FooterProps) {
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  const links = [
    { label: 'Our Story', href: '#story' },
    { label: 'Details',   href: '#details' },
    { label: 'Gallery',   href: '#gallery' },
    { label: 'Registry',  href: '#rsvp' },
    { label: 'RSVP',      href: '#rsvp' },
  ];

  return (
    <footer style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #140D0D 0%, #1C1010 60%, #110909 100%)',
      padding: 'clamp(60px, 10vw, 100px) 24px 40px',
      textAlign: 'center',
    }}>

      <ParallaxBg src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&fit=crop" opacity={0.07} speed={0.25} />

      {/* Bokeh */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%',  width: 500, height: 500, borderRadius: '50%', background: 'var(--color-blush)', filter: 'blur(150px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%',  width: 400, height: 400, borderRadius: '50%', background: 'var(--color-gold)',  filter: 'blur(130px)', opacity: 0.05 }} />
      </div>

      {/* Top gold rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 30%, rgba(201,169,110,0.95) 50%, rgba(201,169,110,0.8) 70%, transparent)' }} />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Large monogram */}
        <div className="font-display" style={{
          fontSize: 'clamp(60px, 10vw, 96px)',
          color: 'rgba(201,169,110,0.85)',
          lineHeight: 1,
          marginBottom: 20,
          textShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
          {monogram}
        </div>

        {/* Date */}
        <p style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
          fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', marginBottom: 36,
        }}>
          {dateShort}
        </p>

        {/* Nav links */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px 32px', marginBottom: 40 }}>
          {links.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              style={{
                fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
                fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', background: 'none',
                border: 'none', cursor: 'pointer', padding: '4px 0',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,169,110,0.8)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Gold divider with petal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 80, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.4))' }} />
          <svg viewBox="0 0 20 30" width={10} height={15} style={{ opacity: 0.5 }}>
            <ellipse cx="10" cy="15" rx="8" ry="14" fill="var(--color-gold)" />
          </svg>
          <div style={{ width: 80, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.4))' }} />
        </div>

        {/* Quote */}
        <p style={{
          fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
          fontWeight: 300, fontSize: 'clamp(17px, 2.5vw, 22px)',
          color: 'rgba(255,255,255,0.4)', marginBottom: 40, lineHeight: 1.6,
        }}>
          &ldquo;And so the adventure begins&hellip;&rdquo;
        </p>

        {/* Bottom gold rule */}
        <div style={{ width: '100%', height: 1, background: 'rgba(201,169,110,0.12)', marginBottom: 28 }} />

        {/* Credit */}
        <p style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
          fontSize: 10, letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.18)',
        }}>
          Crafted with ♥ by BLOOM — Bespoke Wedding Websites
        </p>
      </div>
    </footer>
  );
}
