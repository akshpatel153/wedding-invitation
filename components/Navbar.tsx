'use client';

import { useEffect, useState } from 'react';

interface NavProps {
  monogram: string;
  slug: string;
}

export default function Navbar({ monogram, slug }: NavProps) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Highlight active nav section
      const sections = ['story', 'details', 'gallery', 'registry', 'rsvp'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id); return;
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Our Story', href: '#story',         id: 'story'    },
    { label: 'Details',   href: '#details',       id: 'details'  },
    { label: 'Gallery',   href: '#gallery',       id: 'gallery'  },
    { label: 'Registry',  href: '#registry',      id: 'registry' },
    { label: 'Admin',     href: '/admin/wedding', id: 'admin'    },
  ];

  const scrollTo = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '14px 48px' : '22px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(18, 10, 10, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,169,110,0.15)' : 'none',
        transition: 'all 400ms cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Monogram / Logo */}
        <button
          onClick={() => scrollTo('#home')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          {/* Gold petal icon */}
          <svg viewBox="0 0 16 24" width={14} height={20} style={{ opacity: scrolled ? 0.85 : 0.7, transition: 'opacity 400ms ease' }}>
            <ellipse cx="8" cy="12" rx="7" ry="11" fill="rgba(201,169,110,0.9)" />
          </svg>
          <span className="font-display" style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1,
            letterSpacing: '0.02em',
            textShadow: scrolled ? 'none' : '0 2px 12px rgba(0,0,0,0.5)',
            transition: 'all 400ms ease',
          }}>
            {monogram}
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-links">
          {navLinks.map(link => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="nav-link"
                data-active={isActive}
                style={{
                  fontFamily: 'var(--font-jost), sans-serif',
                  fontWeight: 400, fontSize: 11,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: isActive
                    ? 'rgba(201,169,110,0.95)'
                    : 'rgba(255,255,255,0.65)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px 0', position: 'relative',
                  transition: 'color 250ms ease',
                  textShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.5)',
                }}
              >
                {link.label}
              </button>
            );
          })}

          {/* RSVP pill CTA */}
          <button
            onClick={() => scrollTo('#rsvp')}
            className="nav-cta"
            style={{
              fontFamily: 'var(--font-jost), sans-serif',
              fontWeight: 500, fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.9)',
              background: 'transparent',
              border: '1px solid rgba(201,169,110,0.4)',
              borderRadius: 999,
              padding: '9px 24px', cursor: 'pointer',
              transition: 'all 250ms ease',
              marginLeft: 4,
            }}
          >
            RSVP
          </button>

        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none', flexDirection: 'column', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 1.5, borderRadius: 2,
              background: 'rgba(255,255,255,0.85)',
              transition: 'all 300ms ease',
              transform: mobileOpen
                ? i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                : i === 2 ? 'rotate(-45deg) translate(4.5px, -4.5px)'
                : 'none'
                : 'none',
              opacity: mobileOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: 'rgba(14, 8, 8, 0.97)',
        backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 40,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Decorative gold rule top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.6) 40%, rgba(201,169,110,0.6) 60%, transparent)' }} />

        <div className="font-display" style={{ fontSize: 48, color: 'rgba(201,169,110,0.5)', marginBottom: 8 }}>{monogram}</div>

        {navLinks.map((link, i) => (
          <button
            key={link.label}
            onClick={() => scrollTo(link.href)}
            style={{
              fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
              fontWeight: 300, fontSize: 'clamp(28px, 6vw, 40px)',
              color: 'rgba(255,255,255,0.75)',
              background: 'none', border: 'none', cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'color 200ms ease',
              animation: mobileOpen ? `navItemIn 400ms ${i * 60}ms both ease` : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,169,110,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            {link.label}
          </button>
        ))}

        {/* Decorative gold rule bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.6) 40%, rgba(201,169,110,0.6) 60%, transparent)' }} />
      </div>

      <style>{`
        .nav-link::after {
          content: '';
          position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: rgba(201,169,110,0.7);
          transition: width 250ms ease;
        }
        .nav-link:hover { color: rgba(255,255,255,0.95) !important; }
        .nav-link:hover::after { width: 100%; }
        .nav-link[data-active="true"]::after { width: 100%; }
        .nav-cta:hover {
          background: rgba(201,169,110,0.12) !important;
          border-color: rgba(201,169,110,0.8) !important;
          color: rgba(201,169,110,1) !important;
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          nav { padding: 16px 24px !important; }
        }
        @keyframes navItemIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
