'use client';
import { useEffect, useState } from 'react';
import ParallaxBg from './ParallaxBg';


interface CountdownProps {
  targetDate: string;
  name1: string;
  name2: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate, name1, name2 }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setIsPast(true); return; }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const blocks = timeLeft
    ? [
        { value: timeLeft.days,    label: 'Days' },
        { value: timeLeft.hours,   label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' },
      ]
    : [];

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(160deg, #1A1010 0%, #2D1A1A 40%, #1F1515 100%)',
      padding: '22px 40px',
    }}>
      <ParallaxBg src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1920&q=80&fit=crop" opacity={0.08} />

      {/* Gold rules */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      {/* Single inline row */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 'clamp(12px, 2.5vw, 36px)', flexWrap: 'wrap',
      }}>

        {/* Label */}
        <p style={{
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 400,
          fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(201,169,110,0.8)', whiteSpace: 'nowrap', margin: 0,
        }}>
          {isPast ? 'Today is the Day 🌸' : 'The Big Day'}
        </p>

        {/* Dot separator */}
        <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(201,169,110,0.35)', flexShrink: 0 }} />

        {/* Number blocks */}
        {!isPast && timeLeft && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 20px)' }}>
            {blocks.map((block, i) => (
              <div key={block.label} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 20px)' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--font-cormorant), serif', fontWeight: 300,
                    fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#fff',
                    lineHeight: 1, letterSpacing: '-0.01em', display: 'block',
                  }}>
                    {String(block.value).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-jost), sans-serif', fontWeight: 400,
                    fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(201,169,110,0.55)', display: 'block', marginTop: 2,
                  }}>
                    {block.label}
                  </span>
                </div>
                {i < blocks.length - 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, marginBottom: 12 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(201,169,110,0.45)' }} />
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(201,169,110,0.45)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dot separator */}
        <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(201,169,110,0.35)', flexShrink: 0 }} />

        {/* Couple name */}
        <p className="font-display" style={{
          fontSize: 'clamp(18px, 2.5vw, 26px)', color: 'rgba(255,255,255,0.28)',
          lineHeight: 1, whiteSpace: 'nowrap', margin: 0,
        }}>
          {name1} &amp; {name2}
        </p>
      </div>
    </section>
  );
}
