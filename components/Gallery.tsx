'use client';
import { useState } from 'react';
import ParallaxBg from './ParallaxBg';

interface GalleryImage {
  src: string | null;
  alt: string;
  ratio: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prev  = () => setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : null);
  const next  = () => setLightboxIndex(i => i !== null ? (i + 1) % images.length : null);
  const close = () => setLightboxIndex(null);

  return (
    <>
      <section id="gallery" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #1A1010 0%, #231414 50%, #1A1010 100%)',
        padding: 'clamp(80px, 12vw, 130px) 24px',
      }}>

        <ParallaxBg src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1920&q=80&fit=crop" opacity={0.08} />

        {/* Bokeh */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '5%',   left: '-5%',  width: 600, height: 600, borderRadius: '50%', background: 'var(--color-blush)', filter: 'blur(160px)', opacity: 0.06 }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'var(--color-gold)',  filter: 'blur(160px)', opacity: 0.05 }} />
        </div>

        {/* Top rule */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(50px, 7vw, 80px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
              <p style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.8)', margin: 0 }}>
                Captured Moments
              </p>
              <div style={{ width: 48, height: 1, background: 'rgba(201,169,110,0.5)' }} />
            </div>
            <h2 className="font-display" style={{
              fontSize: 'clamp(56px, 9vw, 100px)',
              color: '#fff', lineHeight: 0.95,
              textShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 24,
            }}>
              Our Gallery
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
              <svg viewBox="0 0 20 30" width={12} height={18} style={{ opacity: 0.6 }}>
                <ellipse cx="10" cy="15" rx="8" ry="14" fill="var(--color-gold)" />
              </svg>
              <div style={{ width: 80, height: 1, background: 'rgba(201,169,110,0.25)' }} />
            </div>

            {/* Share CTA */}
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <a
                href="/photos.html"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: 'var(--font-jost), sans-serif', fontWeight: 500,
                  fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(201,169,110,0.9)', textDecoration: 'none',
                  border: '1px solid rgba(201,169,110,0.4)', borderRadius: 999,
                  padding: '13px 32px',
                  background: 'rgba(201,169,110,0.06)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 260ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(201,169,110,0.14)';
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.8)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(201,169,110,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg viewBox="0 0 18 18" width={14} height={14} fill="none">
                  <circle cx="9" cy="9" r="8" stroke="rgba(201,169,110,0.8)" strokeWidth="1.2"/>
                  <path d="M9 5.5v7M5.5 9h7" stroke="rgba(201,169,110,0.8)" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                Add Photos to Our Gallery
              </a>
              <p style={{
                marginTop: 12,
                fontFamily: 'var(--font-cormorant), sans-serif', fontStyle: 'italic',
                fontSize: 13, color: 'rgba(255,255,255,0.25)',
              }}>
                Share your memories from our special day
              </p>
            </div>
          </div>

          {/* Masonry grid */}
          <div
            className="masonry-grid"
            style={{ maxWidth: 1100, margin: '0 auto', columnCount: 3, columnGap: 12 }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="fade-up gallery-item"
                style={{
                  breakInside: 'avoid', marginBottom: 12,
                  borderRadius: 4, overflow: 'hidden',
                  cursor: 'pointer', position: 'relative',
                  transitionDelay: `${i * 60}ms`,
                  border: '1px solid rgba(201,169,110,0.1)',
                }}
                onClick={() => setLightboxIndex(i)}
              >
                {img.src ? (
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{ width: '100%', display: 'block', transition: 'transform 500ms ease' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', aspectRatio: img.ratio,
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
                      <path d="M9 3L7.17 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.17L15 3H9z" stroke="rgba(201,169,110,0.4)" strokeWidth="1.5" fill="none" />
                      <circle cx="12" cy="13" r="3.5" stroke="rgba(201,169,110,0.4)" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="gallery-overlay" style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(20,10,10,0.55)',
                  opacity: 0, transition: 'opacity 300ms ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '1px solid rgba(201,169,110,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="none">
                      <path d="M12 8v8M8 12h8" stroke="rgba(201,169,110,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.8) 40%, rgba(201,169,110,0.8) 60%, transparent)' }} />
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={close}
          style={{ background: 'rgba(14,8,8,0.97)', cursor: 'pointer' }}
        >
          {/* Prev */}
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: '50%', width: 52, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(201,169,110,0.85)', fontSize: 22, cursor: 'pointer',
            transition: 'all 200ms ease',
          }}>←</button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '88vw', maxHeight: '88vh', position: 'relative' }}>
            {images[lightboxIndex].src && (
              <>
                <img
                  src={images[lightboxIndex].src!}
                  alt={images[lightboxIndex].alt}
                  style={{
                    maxWidth: '88vw', maxHeight: '88vh',
                    objectFit: 'contain', borderRadius: 4,
                    border: '1px solid rgba(201,169,110,0.2)',
                    boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
                  }}
                />
                {/* Index indicator */}
                <p style={{
                  textAlign: 'center', marginTop: 16,
                  fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
                  fontSize: 11, letterSpacing: '0.2em',
                  color: 'rgba(201,169,110,0.5)',
                }}>
                  {lightboxIndex + 1} / {images.length}
                </p>
              </>
            )}
          </div>

          {/* Next */}
          <button onClick={e => { e.stopPropagation(); next(); }} style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: '50%', width: 52, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(201,169,110,0.85)', fontSize: 22, cursor: 'pointer',
            transition: 'all 200ms ease',
          }}>→</button>

          {/* Close */}
          <button onClick={close} style={{
            position: 'absolute', top: 24, right: 24,
            background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: '50%', width: 44, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(201,169,110,0.85)', fontSize: 20, cursor: 'pointer',
          }}>×</button>
        </div>
      )}

      <style>{`
        .gallery-item:hover .gallery-overlay { opacity: 1 !important; }
        .gallery-item:hover img { transform: scale(1.04); }
        @media (max-width: 768px) { .masonry-grid { column-count: 2 !important; } }
        @media (max-width: 480px) { .masonry-grid { column-count: 1 !important; } }
      `}</style>
    </>
  );
}
