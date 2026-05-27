'use client';
import ParallaxBg from './ParallaxBg';

interface StoryMilestone {
  date: string;
  title: string;
  body: string;
  image: string | null;
}

interface OurStoryProps {
  milestones: StoryMilestone[];
}

export default function OurStory({ milestones }: OurStoryProps) {
  return (
    <section id="story" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #1A1010 0%, #261616 50%, #1A1010 100%)',
      padding: 'clamp(80px, 12vw, 130px) 24px',
    }}>

      <ParallaxBg src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=80&fit=crop" opacity={0.12} />

      {/* Background bokeh */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%',  left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'var(--color-blush)',  filter: 'blur(160px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-8%', width: 700, height: 700, borderRadius: '50%', background: 'var(--color-gold)',   filter: 'blur(180px)', opacity: 0.05 }} />
      </div>

      {/* Top gold rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
            <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.8)', margin: 0 }}>
              How It Began
            </p>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
          </div>

          <h2 className="font-display" style={{
            fontSize: 'clamp(56px, 9vw, 100px)',
            color: '#fff', lineHeight: 0.95,
            textShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 24,
          }}>
            Our Story
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
            <svg viewBox="0 0 20 30" width={12} height={18} style={{ opacity: 0.6 }}>
              <ellipse cx="10" cy="15" rx="8" ry="14" fill="var(--color-gold)" />
            </svg>
            <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="story-timeline" style={{ position: 'relative', maxWidth: 960, margin: '0 auto' }}>

          {/* Vertical line */}
          <div className="story-line" style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.3) 10%, rgba(201,169,110,0.3) 90%, transparent)',
            transform: 'translateX(-50%)',
          }} />

          {milestones.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className={`story-row ${isLeft ? 'story-row-left' : 'story-row-right'}`}
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  marginBottom: 'clamp(40px, 6vw, 80px)',
                  position: 'relative',
                }}
              >
                {/* Gold dot */}
                <div className="story-dot" style={{
                  position: 'absolute', left: '50%', top: 36,
                  transform: 'translateX(-50%)',
                  width: 12, height: 12, borderRadius: '50%',
                  background: 'var(--color-gold)',
                  boxShadow: '0 0 0 3px rgba(201,169,110,0.2), 0 0 16px rgba(201,169,110,0.4)',
                  zIndex: 2,
                }} />

                {/* Card */}
                <div
                  className={`story-card ${isLeft ? 'fade-left' : 'fade-right'}`}
                  style={{
                    maxWidth: 420,
                    width: 'calc(50% - 48px)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,169,110,0.15)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  }}
                >
                  {milestone.image && (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block',
                          filter: 'brightness(0.85)',
                          transition: 'transform 600ms ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(20,10,10,0.6) 0%, transparent 50%)',
                      }} />
                    </div>
                  )}

                  <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
                    <p style={{
                      fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500,
                      fontSize: 10, textTransform: 'uppercase',
                      letterSpacing: '0.25em', color: 'rgba(201,169,110,0.8)', marginBottom: 10,
                    }}>
                      {milestone.date}
                    </p>
                    <h3 style={{
                      fontFamily: 'var(--font-cormorant), serif', fontWeight: 400,
                      fontSize: 'clamp(20px, 3vw, 26px)', color: '#fff',
                      marginBottom: 12, lineHeight: 1.2,
                    }}>
                      {milestone.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
                      fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9,
                    }}>
                      {milestone.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gold rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <style>{`
        /* Mobile: left-anchored single column */
        @media (max-width: 640px) {
          /* Line sits at 16px from timeline left */
          .story-line {
            left: 16px !important;
            transform: none !important;
          }
          /* Each row gets left padding so card clears the line + dot */
          .story-row {
            justify-content: flex-start !important;
            padding-left: 44px !important;
          }
          /* Dot is 16px from row left = same as line */
          .story-dot {
            left: 16px !important;
            transform: translateX(-50%) !important;
            top: 24px !important;
          }
          /* Card fills remaining width */
          .story-card {
            width: 100% !important;
            max-width: 100% !important;
          }
        }

        /* Tablet: two columns, tighter gap */
        @media (min-width: 641px) and (max-width: 860px) {
          .story-card {
            width: calc(50% - 28px) !important;
          }
        }
      `}</style>
    </section>
  );
}
