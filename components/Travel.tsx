'use client';
import ParallaxBg from './ParallaxBg';

interface Hotel {
  name: string;
  distance: string;
  url: string;
}

interface TravelProps {
  directionsNote: string;
  address: string;
  mapsUrl: string;
  hotels: Hotel[];
  roomBlock: string;
}

function CarIcon() {
  return (
    <svg viewBox="0 0 36 36" width={36} height={36} fill="none">
      <path d="M4 22 L8 12 L28 12 L32 22 L32 28 L4 28 Z" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <circle cx="10" cy="28" r="3" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" fill="none"/>
      <circle cx="26" cy="28" r="3" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" fill="none"/>
      <path d="M4 22 L32 22" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5"/>
    </svg>
  );
}

function BedIcon() {
  return (
    <svg viewBox="0 0 36 36" width={36} height={36} fill="none">
      <path d="M2 28 L2 18 L34 18 L34 28" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 28 L34 28" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 18 L2 12" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="8" y="10" width="10" height="8" rx="2" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" fill="none"/>
      <rect x="22" y="10" width="10" height="8" rx="2" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export default function Travel({ directionsNote, address, mapsUrl, hotels, roomBlock }: TravelProps) {
  return (
    <section id="travel" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #1A1010 0%, #221313 50%, #1A1010 100%)',
      padding: 'clamp(80px, 12vw, 130px) 24px',
    }}>

      <ParallaxBg src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1920&q=80&fit=crop" opacity={0.1} />

      {/* Bokeh */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'var(--color-gold)',  filter: 'blur(160px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', bottom: '-5%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'var(--color-blush)', filter: 'blur(140px)', opacity: 0.06 }} />
      </div>

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 90px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.8)', margin: 0 }}>
              Getting Here
            </p>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(56px, 9vw, 100px)',
            color: '#fff', lineHeight: 0.95,
            textShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 24,
          }}>
            Travel &amp; Stay
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
            <svg viewBox="0 0 20 30" width={12} height={18} style={{ opacity: 0.6 }}>
              <ellipse cx="10" cy="15" rx="8" ry="14" fill="var(--color-gold)" />
            </svg>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
          </div>
        </div>

        {/* Two cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24, maxWidth: 900, margin: '0 auto 48px',
        }}>

          {/* Directions */}
          <div className="fade-up" style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,169,110,0.18)',
            borderRadius: 4, padding: 'clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ marginBottom: 20 }}><CarIcon /></div>
            <h3 style={{
              fontFamily: 'var(--font-cormorant), serif', fontWeight: 400,
              fontSize: 'clamp(20px, 2.5vw, 24px)', color: '#fff', marginBottom: 12,
            }}>
              Getting to the Venue
            </h3>
            <div style={{ width: 40, height: 1, background: 'rgba(201,169,110,0.3)', marginBottom: 20 }} />
            <p style={{
              fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
              fontSize: 14, color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.85, marginBottom: 20,
            }}>
              {directionsNote}
            </p>
            <p style={{
              fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
              fontSize: 13, color: 'rgba(201,169,110,0.6)',
              marginBottom: 28, letterSpacing: '0.04em',
            }}>
              {address}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500,
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                border: '1px solid rgba(201,169,110,0.25)', borderRadius: 999,
                padding: '11px 28px', display: 'inline-block',
                transition: 'all 250ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(201,169,110,1)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'; }}
            >
              Open in Google Maps →
            </a>
          </div>

          {/* Hotels */}
          <div className="fade-up" style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,169,110,0.18)',
            borderRadius: 4, padding: 'clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            transitionDelay: '150ms',
          }}>
            <div style={{ marginBottom: 20 }}><BedIcon /></div>
            <h3 style={{
              fontFamily: 'var(--font-cormorant), serif', fontWeight: 400,
              fontSize: 'clamp(20px, 2.5vw, 24px)', color: '#fff', marginBottom: 12,
            }}>
              Recommended Hotels
            </h3>
            <div style={{ width: 40, height: 1, background: 'rgba(201,169,110,0.3)', marginBottom: 24 }} />

            <ul style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {hotels.map((hotel, i) => (
                <li key={i}>
                  <a
                    href={hotel.url}
                    style={{
                      fontFamily: 'var(--font-cormorant), serif', fontWeight: 400,
                      fontSize: 19, color: 'rgba(255,255,255,0.85)',
                      borderBottom: '1px solid rgba(201,169,110,0.15)',
                      display: 'block', paddingBottom: 6, marginBottom: 4,
                      textDecoration: 'none',
                      transition: 'color 200ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,169,110,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                  >
                    {hotel.name}
                  </a>
                  <span style={{
                    fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
                    fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em',
                  }}>
                    {hotel.distance}
                  </span>
                </li>
              ))}
            </ul>

            {/* Room block note */}
            <div style={{
              background: 'rgba(201,169,110,0.07)',
              border: '1px solid rgba(201,169,110,0.2)',
              borderRadius: 4, padding: '16px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
                fontWeight: 300, fontSize: 15,
                color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
              }}>
                {roomBlock}
              </p>
            </div>
          </div>
        </div>

        {/* Map embed placeholder */}
        <div className="fade-up" style={{
          maxWidth: 900, margin: '0 auto',
          height: 260,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(201,169,110,0.12)',
          borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.04) 0%, transparent 70%)',
          }} />
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <svg viewBox="0 0 24 24" width={28} height={28} fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke="rgba(201,169,110,0.5)" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="9" r="2.5" stroke="rgba(201,169,110,0.5)" strokeWidth="1.5" fill="none"/>
            </svg>
            <p style={{
              fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
              fontSize: 11, color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Interactive Map — Replace with Google Maps embed
            </p>
          </div>
        </div>

      </div>

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />
    </section>
  );
}
