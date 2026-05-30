'use client';
import ParallaxBg from './ParallaxBg';

interface RegistryItem {
  store: string;
  description: string;
  url: string;
  icon: string;
}

interface RegistryProps {
  items: RegistryItem[];
}

/* Icon SVGs for each registry type */
function RegistryIcon({ type }: { type: string }) {
  const c = 'rgba(201,169,110,0.85)';
  if (type === 'kitchen') return (
    <svg viewBox="0 0 40 40" width={36} height={36} fill="none">
      <path d="M8 10 Q8 6 12 6 Q12 14 8 14 Z" stroke={c} strokeWidth="1.3" fill="none"/>
      <path d="M8 14 L8 34" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M20 6 L20 18 Q28 18 28 12 Q28 6 20 6 Z" stroke={c} strokeWidth="1.3" fill="none"/>
      <path d="M20 18 L20 34" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  if (type === 'travel') return (
    <svg viewBox="0 0 40 40" width={36} height={36} fill="none">
      <circle cx="20" cy="20" r="14" stroke={c} strokeWidth="1.3" fill="none"/>
      <ellipse cx="20" cy="20" rx="6" ry="14" stroke={c} strokeWidth="1.3" fill="none"/>
      <path d="M6 20 L34 20" stroke={c} strokeWidth="1.3"/>
      <path d="M8 13 Q20 17 32 13" stroke={c} strokeWidth="1.3" fill="none"/>
      <path d="M8 27 Q20 23 32 27" stroke={c} strokeWidth="1.3" fill="none"/>
    </svg>
  );
  // default: home
  return (
    <svg viewBox="0 0 40 40" width={36} height={36} fill="none">
      <path d="M6 20 L20 8 L34 20" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 17 L10 34 L30 34 L30 17" stroke={c} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
      <rect x="16" y="24" width="8" height="10" rx="1" stroke={c} strokeWidth="1.3" fill="none"/>
    </svg>
  );
}

export default function Registry({ items }: RegistryProps) {
  return (
    <section id="registry" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #1F1515 0%, #261616 50%, #1F1515 100%)',
      padding: 'clamp(80px, 12vw, 130px) 24px',
    }}>

      <ParallaxBg src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80&fit=crop" opacity={0.09} />

      {/* Bokeh */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-5%', left: '-5%',   width: 500, height: 500, borderRadius: '50%', background: 'var(--color-blush)', filter: 'blur(150px)', opacity: 0.07 }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'var(--color-gold)',  filter: 'blur(150px)', opacity: 0.06 }} />
      </div>

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(50px, 7vw, 80px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.8)', margin: 0 }}>
              Wish List
            </p>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
          </div>

          <h2 className="font-display" style={{
            fontSize: 'clamp(56px, 9vw, 100px)',
            color: '#fff', lineHeight: 0.95,
            textShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 24,
          }}>
            Registry
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
            <svg viewBox="0 0 20 30" width={12} height={18} style={{ opacity: 0.6 }}>
              <ellipse cx="10" cy="15" rx="8" ry="14" fill="var(--color-gold)" />
            </svg>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
          </div>

          <p style={{
            fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
            fontWeight: 300, fontSize: 'clamp(17px, 2.5vw, 22px)',
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.8,
            maxWidth: 520, margin: '0 auto',
          }}>
            Your presence is the greatest gift of all.<br />
            For those who wish to give, we are registered at the following:
          </p>
        </div>

        {/* Registry cards */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="registry-card"
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(24px, 3vw, 32px) clamp(24px, 4vw, 40px)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,169,110,0.18)',
                borderRadius: 4,
                textDecoration: 'none',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
                transition: 'all 260ms ease',
                transitionDelay: `${i * 80}ms`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.55)';
                e.currentTarget.style.background = 'rgba(201,169,110,0.07)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.18)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.2)';
              }}
            >
              {/* Left: icon + text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 4, flexShrink: 0,
                  background: 'rgba(201,169,110,0.08)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <RegistryIcon type={item.icon} />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-cormorant), serif', fontWeight: 400,
                    fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#fff',
                    marginBottom: 4, lineHeight: 1.2,
                  }}>
                    {item.store}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
                    fontSize: 13, color: 'rgba(255,255,255,0.38)',
                    letterSpacing: '0.04em',
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right: arrow */}
              <div className="registry-arrow" style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                border: '1px solid rgba(201,169,110,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(201,169,110,0.6)', fontSize: 18,
                transition: 'all 260ms ease',
              }}>
                →
              </div>
            </a>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', marginTop: 48,
          fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
          fontWeight: 300, fontSize: 15,
          color: 'rgba(255,255,255,0.22)', lineHeight: 1.8,
        }}>
          Gifts may be sent to the couple&apos;s home address.<br />
          Please contact us if you need assistance.
        </p>

      </div>

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <style>{`
        .registry-card:hover .registry-arrow {
          border-color: rgba(201,169,110,0.7) !important;
          color: rgba(201,169,110,0.95) !important;
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
