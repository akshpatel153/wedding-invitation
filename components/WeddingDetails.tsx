'use client';
import ParallaxBg from './ParallaxBg';

interface ScheduleEvent {
  time: string;
  event: string;
  description: string;
}

interface WeddingDetailsProps {
  ceremony: {
    venue: string;
    address: string;
    city: string;
    time: string;
    mapsUrl: string;
  };
  reception: {
    venue: string;
    subvenue: string;
    city: string;
    time: string;
    details: string;
    mapsUrl: string;
  };
  schedule: ScheduleEvent[];
}

/* Chapel SVG icon */
function ChapelIcon() {
  return (
    <svg viewBox="0 0 48 48" width={38} height={38} fill="none">
      <path d="M24 4 L24 12" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 8 L28 8" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 44 L8 22 Q8 14 24 10 Q40 14 40 22 L40 44" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M18 44 L18 32 Q18 28 24 28 Q30 28 30 32 L30 44" stroke="rgba(201,169,110,0.8)" strokeWidth="1.2" fill="none"/>
      <path d="M8 44 L40 44" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* Clinking glasses icon */
function GlassesIcon() {
  return (
    <svg viewBox="0 0 48 48" width={38} height={38} fill="none">
      <path d="M16 32 Q12 20 8 20 Q4 20 4 28 Q4 36 16 36 Q24 36 24 28 Q24 20 16 20" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M32 32 Q36 20 40 20 Q44 20 44 28 Q44 36 32 36 Q24 36 24 28 Q24 20 32 20" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M16 20 L32 20" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 14 L24 20 L28 14" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function WeddingDetails({ ceremony, reception, schedule }: WeddingDetailsProps) {
  return (
    <section id="details" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #1F1515 0%, #2A1818 50%, #1F1515 100%)',
      padding: 'clamp(80px, 12vw, 130px) 24px',
    }}>

      <ParallaxBg src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80&fit=crop" opacity={0.1} />

      {/* Bokeh */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-5%',  right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'var(--color-gold)',  filter: 'blur(160px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'var(--color-blush)', filter: 'blur(140px)', opacity: 0.06 }} />
      </div>

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 90px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.8)', margin: 0 }}>
              Mark Your Calendar
            </p>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(56px, 9vw, 100px)',
            color: '#fff', lineHeight: 0.95,
            textShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 24,
          }}>
            Wedding Details
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
            <svg viewBox="0 0 20 30" width={12} height={18} style={{ opacity: 0.6 }}>
              <ellipse cx="10" cy="15" rx="8" ry="14" fill="var(--color-gold)" />
            </svg>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
          </div>
        </div>

        {/* ── Two venue cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24, maxWidth: 900, margin: '0 auto 80px',
        }}>
          {/* Ceremony */}
          <div className="fade-up" style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: 4, padding: 'clamp(36px, 5vw, 56px) clamp(28px, 4vw, 48px)',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ marginBottom: 20 }}><ChapelIcon /></div>
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', marginBottom: 20 }}>
              Ceremony
            </p>
            <div style={{ width: '100%', height: 1, background: 'rgba(201,169,110,0.15)', marginBottom: 24 }} />
            <p style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 400, fontSize: 'clamp(20px, 3vw, 26px)', color: '#fff', marginBottom: 14, lineHeight: 1.2 }}>
              {ceremony.venue}
            </p>
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 2, marginBottom: 14 }}>
              {ceremony.address}<br />{ceremony.city}
            </p>
            <p style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: 'rgba(201,169,110,0.75)', marginBottom: 28 }}>
              {ceremony.time}
            </p>
            <a href={ceremony.mapsUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
              border: '1px solid rgba(201,169,110,0.25)', borderRadius: 999,
              padding: '10px 28px', display: 'inline-block',
              transition: 'all 250ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(201,169,110,1)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'; }}
            >
              View on Map →
            </a>
          </div>

          {/* Reception */}
          <div className="fade-up" style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: 4, padding: 'clamp(36px, 5vw, 56px) clamp(28px, 4vw, 48px)',
            textAlign: 'center', transitionDelay: '150ms',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ marginBottom: 20 }}><GlassesIcon /></div>
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', marginBottom: 20 }}>
              Reception
            </p>
            <div style={{ width: '100%', height: 1, background: 'rgba(201,169,110,0.15)', marginBottom: 24 }} />
            <p style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 400, fontSize: 'clamp(20px, 3vw, 26px)', color: '#fff', marginBottom: 6, lineHeight: 1.2 }}>
              {reception.venue}
            </p>
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(201,169,110,0.55)', marginBottom: 14, letterSpacing: '0.05em' }}>
              {reception.subvenue}
            </p>
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 2, marginBottom: 8 }}>
              {reception.city}
            </p>
            <p style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: 'rgba(201,169,110,0.75)', marginBottom: 8 }}>
              {reception.time}
            </p>
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 28 }}>
              {reception.details}
            </p>
            <a href={reception.mapsUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
              border: '1px solid rgba(201,169,110,0.25)', borderRadius: 999,
              padding: '10px 28px', display: 'inline-block',
              transition: 'all 250ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(201,169,110,1)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'; }}
            >
              View on Map →
            </a>
          </div>
        </div>

        {/* ── Day Schedule ── */}
        <div className="fade-up" style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
            fontWeight: 300, fontSize: 'clamp(22px, 3vw, 30px)',
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center', marginBottom: 48,
          }}>
            Timeline of the Day
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {schedule.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
                <div style={{ textAlign: 'center', padding: '0 clamp(12px, 2vw, 24px)', minWidth: 110 }}>
                  {/* Dot on line */}
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <div style={{ width: '100%', height: 1, background: 'rgba(201,169,110,0.2)', position: 'absolute', top: '50%' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-gold)', margin: '0 auto', position: 'relative', zIndex: 1, boxShadow: '0 0 8px rgba(201,169,110,0.5)' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(201,169,110,0.8)', marginBottom: 6 }}>
                    {item.time}
                  </p>
                  <p style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 400, fontSize: 18, color: '#fff', marginBottom: 4 }}>
                    {item.event}
                  </p>
                  <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                    {item.description}
                  </p>
                </div>
                {i < schedule.length - 1 && (
                  <div style={{ fontSize: 14, color: 'rgba(201,169,110,0.35)', marginTop: 3, flexShrink: 0, paddingTop: 4 }}>
                    ❯
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />
    </section>
  );
}
