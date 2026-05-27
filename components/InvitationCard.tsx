'use client';
import React from 'react';
import ParallaxBg from './ParallaxBg';

interface InvitationCardProps {
  name1: string;
  name2: string;
  dayOfWeek: string;
  dateShort: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  dressCode: string;
  weddingDate: string;
}

/* PNG corner ornament — original is bottom-left */
function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms: Record<string, string> = {
    bl: 'none',                    // original
    br: 'scaleX(-1)',              // mirror horizontally
    tl: 'scaleY(-1)',              // mirror vertically
    tr: 'scale(-1, -1)',           // mirror both = 180°
  };
  const anchors: Record<string, React.CSSProperties> = {
    tl: { top: 0,    left: 0  },
    tr: { top: 0,    right: 0 },
    bl: { bottom: 0, left: 0  },
    br: { bottom: 0, right: 0 },
  };
  return (
    <img
      src="/corner.png"
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...anchors[position],
        width: 110,
        height: 110,
        transform: transforms[position],
        opacity: 0.75,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}

export default function InvitationCard({
  name1, name2, dayOfWeek, dateShort, time,
  venue, address, city, dressCode, weddingDate
}: InvitationCardProps) {

  const addToCalendar = () => {
    const date = new Date(weddingDate);
    const start = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(date.getTime() + 4 * 60 * 60 * 1000)
      .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${name1} & ${name2} Wedding`)}&dates=${start}/${end}&location=${encodeURIComponent(`${venue}, ${city}`)}`;
    window.open(url, '_blank');
  };

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(160deg, #1A1010 0%, #2D1A1A 40%, #1F1515 100%)',
      padding: 'clamp(80px, 12vw, 140px) 24px',
    }}>

      <ParallaxBg src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1920&q=80&fit=crop" opacity={0.15} />

      {/* Soft bokeh blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%',  width: 500, height: 500, borderRadius: '50%', background: 'var(--color-blush)',     filter: 'blur(120px)', opacity: 0.07 }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'var(--color-gold)',      filter: 'blur(140px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', top: '30%', right: '15%',   width: 300, height: 300, borderRadius: '50%', background: 'var(--color-blush-dark)', filter: 'blur(90px)',  opacity: 0.05 }} />
      </div>

      {/* Gold horizontal rule at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(to right, transparent 0%, rgba(201,169,110,0.6) 30%, rgba(201,169,110,0.9) 50%, rgba(201,169,110,0.6) 70%, transparent 100%)',
        zIndex: 1,
      }} />

      {/* The invitation card */}
      <div
        className="fade-up"
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 620,
          margin: '0 auto',
          background: 'rgba(20, 10, 10, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(201,169,110,0.4)',
          borderRadius: 4,
          padding: 'clamp(48px, 7vw, 80px) clamp(32px, 6vw, 72px)',
          textAlign: 'center',
          boxShadow: '0 32px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="br" />
        <CornerOrnament position="bl" />

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 400,
          fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'rgba(201,169,110,0.8)', marginBottom: 28,
        }}>
          You Are Invited To Celebrate The Marriage Of
        </p>

        {/* Names */}
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(56px, 10vw, 84px)',
            color: '#FFFFFF',
            lineHeight: 1.0,
            marginBottom: 10,
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {name1} &amp; {name2}
        </h2>

        {/* Gold divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.7))' }} />
          <svg viewBox="0 0 24 24" width={14} height={14} fill="rgba(201,169,110,0.85)">
            <path d="M12 2C8 6 2 8 2 12c0 4 4 6 10 10C18 18 22 16 22 12c0-4-6-6-10-10z" />
          </svg>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.7))' }} />
        </div>

        {/* Day of week */}
        <p style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500,
          fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)', marginBottom: 10,
        }}>
          {dayOfWeek}
        </p>

        {/* Date */}
        <p style={{
          fontFamily: 'var(--font-cormorant), serif', fontWeight: 300,
          fontSize: 'clamp(22px, 4vw, 32px)',
          color: 'rgba(255,255,255,0.92)', marginBottom: 10,
          letterSpacing: '0.02em',
        }}>
          {dateShort}
        </p>

        {/* Time */}
        <p style={{
          fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
          fontWeight: 300, fontSize: 17,
          color: 'rgba(255,255,255,0.55)',
        }}>
          At {time} in the Evening
        </p>

        {/* Divider with flower */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '32px 0' }}>
          <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'rgba(201,169,110,0.2)' }} />
          <span style={{ color: 'rgba(201,169,110,0.7)', fontSize: 14 }}>✿</span>
          <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'rgba(201,169,110,0.2)' }} />
        </div>

        {/* Venue name */}
        <p style={{
          fontFamily: 'var(--font-cormorant), serif', fontWeight: 400,
          fontSize: 'clamp(18px, 3vw, 24px)',
          color: 'rgba(255,255,255,0.88)', marginBottom: 10,
          letterSpacing: '0.01em',
        }}>
          {venue}
        </p>

        {/* Address */}
        <p style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
          fontSize: 13, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.4)', marginBottom: 6,
        }}>
          {address}
        </p>
        <p style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
          fontSize: 13, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {city}
        </p>

        {/* Dress code */}
        <p style={{
          fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
          fontWeight: 300, fontSize: 15,
          color: 'rgba(201,169,110,0.65)',
          marginTop: 20,
          letterSpacing: '0.05em',
        }}>
          {dressCode}
        </p>
      </div>

      {/* Add to calendar — sits below the card */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: 36 }}>
        <button
          onClick={addToCalendar}
          style={{
            fontFamily: 'var(--font-jost), sans-serif',
            fontWeight: 500, fontSize: 10,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            padding: '14px 36px',
            background: 'transparent',
            color: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: 999,
            cursor: 'pointer',
            transition: 'all 260ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(201,169,110,1)';
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.8)';
            e.currentTarget.style.background = 'rgba(201,169,110,0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ✦ &nbsp; Add to Calendar
        </button>
      </div>

      {/* Gold rule at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(to right, transparent 0%, rgba(201,169,110,0.6) 30%, rgba(201,169,110,0.9) 50%, rgba(201,169,110,0.6) 70%, transparent 100%)',
        zIndex: 1,
      }} />
    </section>
  );
}
