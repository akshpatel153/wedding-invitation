'use client';
import { useState } from 'react';
import ParallaxBg from './ParallaxBg';

interface RSVPProps {
  name1: string;
  name2: string;
  rsvpDeadline: string;
  weddingSlug: string;
}

type AttendingStatus = 'accepts' | 'declines' | null;
type MealPref = 'Chicken' | 'Fish' | 'Vegetarian' | null;

/* Floating label input — dark theme */
function FloatingField({
  id, label, type = 'text', value, onChange, error, placeholder,
}: {
  id: string; label: string; type?: string;
  value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div style={{ position: 'relative', marginBottom: error ? 8 : 36 }}>
      <label htmlFor={id} style={{
        position: 'absolute', left: 0,
        top: active ? -18 : 14,
        fontSize: active ? 9 : 15,
        letterSpacing: active ? '0.25em' : '0.02em',
        textTransform: active ? 'uppercase' : 'none',
        fontFamily: active ? 'var(--font-jost), sans-serif' : 'var(--font-cormorant), serif',
        fontStyle: active ? 'normal' : 'italic',
        fontWeight: active ? 600 : 300,
        color: focused ? 'rgba(201,169,110,0.9)' : active ? 'rgba(201,169,110,0.6)' : 'rgba(255,255,255,0.35)',
        transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none', zIndex: 1,
      }}>
        {label}
      </label>
      <input
        id={id} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ''}
        style={{
          width: '100%', background: 'transparent',
          border: 'none', outline: 'none',
          borderBottom: `1.5px solid ${focused ? 'rgba(201,169,110,0.7)' : 'rgba(255,255,255,0.12)'}`,
          padding: '14px 0 10px',
          fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
          fontSize: 15, color: '#fff',
          transition: 'border-color 220ms ease',
        }}
      />
      {error && <p style={{ color: 'rgba(240,140,140,0.9)', fontSize: 11, marginTop: 6, fontFamily: 'var(--font-jost), sans-serif', letterSpacing: '0.05em' }}>{error}</p>}
    </div>
  );
}

export default function RSVPForm({ name1, name2, rsvpDeadline, weddingSlug }: RSVPProps) {
  const [fullName, setFullName]   = useState('');
  const [email, setEmail]         = useState('');
  const [guests, setGuests]       = useState(1);
  const [attending, setAttending] = useState<AttendingStatus>(null);
  const [meal, setMeal]           = useState<MealPref>(null);
  const [message, setMessage]     = useState('');
  const [msgFocused, setMsgFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [apiError, setApiError]     = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Please enter your name';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required';
    if (!attending) e.attending = 'Please make a selection';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({}); setApiError(''); setSubmitting(true);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wedding: weddingSlug, fullName, email, guests, attending, meal, message }),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
    } catch {
      setApiError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <section id="rsvp" style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #1A1010 0%, #2D1A1A 100%)',
        minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px',
      }}>
        <ParallaxBg src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&fit=crop" opacity={0.08} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', animation: 'rsvpFadeUp 600ms ease both' }}>
          <svg viewBox="0 0 80 80" width={80} height={80} style={{ margin: '0 auto 32px', display: 'block' }}>
            <circle cx="40" cy="40" r="36" stroke="rgba(201,169,110,0.8)" strokeWidth="1" fill="none" />
            <path d="M24 40 L34 52 L56 28" stroke="rgba(201,169,110,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <p className="font-display" style={{ fontSize: 72, color: 'rgba(201,169,110,0.9)', lineHeight: 1, marginBottom: 20 }}>
            Thank You
          </p>
          <p style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
            {fullName.split(' ')[0]}, we can&apos;t wait to celebrate with you.
          </p>
          <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
            {name1} &amp; {name2} · September 20, 2026
          </p>
        </div>
      </section>
    );
  }

  /* ── Main form ── */
  return (
    <section id="rsvp" style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #1A1010 0%, #2D1A1A 50%, #1A1010 100%)',
      paddingTop: 20,
      paddingBottom: 20,
    }}>

      <ParallaxBg src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&fit=crop" opacity={0.1} />

      {/* Bokeh */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-8%',   width: 500, height: 500, borderRadius: '50%', background: 'var(--color-blush)', filter: 'blur(130px)', opacity: 0.07 }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'var(--color-gold)',  filter: 'blur(140px)', opacity: 0.06 }} />
      </div>

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', minHeight: 'auto', position: 'relative', zIndex: 2 }}>

        {/* ── LEFT: editorial panel ── */}
        <div style={{ padding: 'clamp(60px,8vw,100px) clamp(32px,5vw,72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          {/* Vertical gold line */}
          <div style={{ position: 'absolute', left: 'clamp(32px,5vw,72px)', top: '15%', bottom: '15%', width: 1, background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.5), transparent)', opacity: 0.6 }} />

          <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.8)', marginBottom: 16, paddingLeft: 24 }}>
            RSVP · Kindly Reply By
          </p>

          <h2 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontWeight: 300,
            fontSize: 'clamp(72px, 11vw, 116px)',
            color: '#fff', lineHeight: 0.95,
            marginBottom: 24, paddingLeft: 24,
            letterSpacing: '0.15em',
            textShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}>
            RSVP
          </h2>

          <p style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, paddingLeft: 24, marginBottom: 40 }}>
            {rsvpDeadline}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 24, marginBottom: 40 }}>
            <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
            <svg viewBox="0 0 20 30" width={12} height={18} style={{ opacity: 0.6 }}>
              <ellipse cx="10" cy="15" rx="8" ry="14" fill="var(--color-gold)" />
            </svg>
            <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
          </div>

          <p style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 400, fontSize: 15, color: 'rgba(255,255,255,0.3)', lineHeight: 1.9, paddingLeft: 24 }}>
            &ldquo;Two souls, one heart.<br />Join us as we begin forever.&rdquo;
          </p>

          <p className="font-display" style={{ fontSize: 32, color: 'rgba(201,169,110,0.25)', marginTop: 'auto', paddingLeft: 24, paddingTop: 48 }}>
            {name1} &amp; {name2}
          </p>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div style={{
          padding: 'clamp(40px,6vw,72px) clamp(32px,5vw,64px)',
          background: 'rgba(255,255,255,0.025)',
          borderLeft: '1px solid rgba(201,169,110,0.12)',
          backdropFilter: 'blur(8px)',
        }}>
          <form onSubmit={handleSubmit} noValidate>

            <FloatingField id="rsvp-name"  label="Your Full Name"  placeholder="Eleanor Collins"    value={fullName} onChange={setFullName} error={errors.fullName} />
            <FloatingField id="rsvp-email" label="Email Address"   type="email" placeholder="eleanor@mail.com" value={email}    onChange={setEmail}    error={errors.email} />

            {/* Seat stepper */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 600, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', marginBottom: 16 }}>
                Number of Seats
              </p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))} className="rsvp-stepper">−</button>
                <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 40, fontWeight: 300, color: '#fff', minWidth: 64, textAlign: 'center', lineHeight: 1 }}>{guests}</span>
                <button type="button" onClick={() => setGuests(g => Math.min(10, g + 1))} className="rsvp-stepper">+</button>
              </div>
            </div>

            {/* Attending */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 600, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', marginBottom: 16 }}>
                Will You Join Us?
              </p>
              {errors.attending && <p style={{ color: 'rgba(240,140,140,0.9)', fontSize: 11, marginBottom: 12, fontFamily: 'var(--font-jost), sans-serif' }}>{errors.attending}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {(['accepts', 'declines'] as const).map(opt => {
                  const active = attending === opt;
                  return (
                    <button key={opt} type="button" onClick={() => setAttending(opt)} style={{
                      padding: '20px 12px', textAlign: 'center', cursor: 'pointer',
                      border: `1px solid ${active ? 'rgba(201,169,110,0.7)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 4,
                      background: active ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 250ms ease',
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 8 }}>{opt === 'accepts' ? '🌸' : '🕊️'}</div>
                      <p style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: active ? 'rgba(201,169,110,0.9)' : 'rgba(255,255,255,0.4)', transition: 'color 250ms ease' }}>
                        {opt === 'accepts' ? 'Joyfully Accepts' : 'Regretfully Declines'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meal */}
            {attending === 'accepts' && (
              <div style={{ marginBottom: 36, animation: 'rsvpSlideDown 300ms ease' }}>
                <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 600, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', marginBottom: 16 }}>
                  Meal Preference
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {(['Chicken', 'Fish', 'Vegetarian'] as const).map(opt => (
                    <button key={opt} type="button" onClick={() => setMeal(opt)} style={{
                      padding: '9px 22px', borderRadius: 999,
                      border: `1px solid ${meal === opt ? 'rgba(201,169,110,0.7)' : 'rgba(255,255,255,0.12)'}`,
                      background: meal === opt ? 'rgba(201,169,110,0.15)' : 'transparent',
                      color: meal === opt ? 'rgba(201,169,110,0.95)' : 'rgba(255,255,255,0.45)',
                      fontFamily: 'var(--font-jost), sans-serif', fontWeight: meal === opt ? 500 : 300,
                      fontSize: 13, cursor: 'pointer', transition: 'all 220ms ease',
                    }}>{opt}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            <div style={{ marginBottom: 40 }}>
              <label style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 600, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', display: 'block', marginBottom: 14 }}>
                A Note for the Couple <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.25)' }}>(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onFocus={() => setMsgFocused(true)}
                onBlur={() => setMsgFocused(false)}
                rows={3} placeholder="Share your well wishes…"
                style={{
                  width: '100%',
                  background: msgFocused ? 'rgba(201,169,110,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${msgFocused ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 4, padding: '16px 20px',
                  fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
                  fontWeight: 300, fontSize: 16, color: 'rgba(255,255,255,0.75)',
                  outline: 'none', resize: 'none',
                  transition: 'all 220ms ease',
                }}
              />
            </div>

            {/* API error */}
            {apiError && (
              <p style={{ color: 'rgba(240,140,140,0.9)', fontSize: 12, marginBottom: 16, fontFamily: 'var(--font-jost), sans-serif', letterSpacing: '0.05em', textAlign: 'center' }}>
                {apiError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="rsvp-submit-btn"
              style={{
                width: '100%', padding: '18px 40px',
                backgroundImage: submitting
                  ? 'none'
                  : 'linear-gradient(135deg, rgba(201,169,110,0.9) 0%, rgba(232,192,122,0.95) 50%, rgba(201,169,110,0.9) 100%)',
                backgroundColor: submitting ? 'rgba(255,255,255,0.08)' : 'transparent',
                backgroundSize: '200% auto',
                border: 'none', borderRadius: 999,
                fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500,
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: submitting ? 'rgba(255,255,255,0.4)' : '#2C1E1E',
                cursor: submitting ? 'default' : 'pointer',
                transition: 'all 300ms ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: submitting ? 'none' : '0 8px 32px rgba(201,169,110,0.25)',
              }}
            >
              {submitting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'rsvpSpin 1s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                    <path d="M8 2a6 6 0 016 6" stroke="rgba(201,169,110,0.8)" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  Sending your reply…
                </>
              ) : (
                <>Send My RSVP ✦</>
              )}
            </button>

          </form>
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

      <style>{`
        .rsvp-stepper {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent; color: rgba(255,255,255,0.4);
          font-size: 20px; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 200ms ease; font-family: inherit;
        }
        .rsvp-stepper:hover { border-color: rgba(201,169,110,0.6); color: rgba(201,169,110,0.9); }
        .rsvp-submit-btn:hover:not(:disabled) {
          background-position: right center !important;
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(201,169,110,0.35) !important;
        }
        @keyframes rsvpSpin      { to { transform: rotate(360deg); } }
        @keyframes rsvpSlideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes rsvpFadeUp    { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </section>
  );
}
