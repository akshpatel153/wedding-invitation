'use client';

import { useEffect, useState } from 'react';

interface RSVPEntry {
  id: number;
  submittedAt: string;
  wedding: string;
  fullName: string;
  email: string;
  guests: number;
  attending: 'accepts' | 'declines';
  meal?: string;
  message?: string;
}

export default function AdminPage() {
  const [entries, setEntries]   = useState<RSVPEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<'all' | 'accepts' | 'declines'>('all');

  useEffect(() => {
    fetch('/api/rsvp-list')
      .then(r => r.json())
      .then(data => { setEntries(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = entries.filter(e => {
    const matchSearch = e.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        e.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || e.attending === filter;
    return matchSearch && matchFilter;
  });

  const accepting = entries.filter(e => e.attending === 'accepts');
  const totalGuests = accepting.reduce((sum, e) => sum + (e.guests || 1), 0);

  const gold   = 'rgba(201,169,110,0.9)';
  const goldDim = 'rgba(201,169,110,0.25)';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg,#1A1010 0%,#261616 100%)',
      fontFamily: 'var(--font-jost,sans-serif)',
      color: 'rgba(255,255,255,0.8)',
      padding: '60px 24px',
    }}>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 48 }}>
        <a href="/wedding/sarah-james" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', textDecoration: 'none', marginBottom: 32,
        }}>
          ← Back to wedding
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${goldDim})` }} />
          <span style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: gold }}>Admin</span>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${goldDim})` }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-great-vibes,cursive)', fontSize: 64, color: '#fff', textAlign: 'center', marginBottom: 8 }}>
          RSVP Responses
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'var(--font-cormorant,serif)', fontStyle: 'italic' }}>
          Sarah &amp; James — September 20, 2026
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Stats row */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
            {[
              { label: 'Total RSVPs',   value: entries.length },
              { label: 'Attending',     value: accepting.length },
              { label: 'Total Guests',  value: totalGuests },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${goldDim}`,
                borderRadius: 4, padding: '20px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, fontFamily: 'var(--font-cormorant,serif)', color: gold, fontWeight: 300 }}>{s.value}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${goldDim}`,
              borderRadius: 4, padding: '10px 16px',
              color: '#fff', fontFamily: 'inherit', fontSize: 13, outline: 'none',
            }}
          />
          {(['all','accepts','declines'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '10px 20px', borderRadius: 999,
              border: `1px solid ${filter === f ? gold : goldDim}`,
              background: filter === f ? 'rgba(201,169,110,0.12)' : 'transparent',
              color: filter === f ? gold : 'rgba(255,255,255,0.35)',
              fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.15em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>
              {f === 'all' ? 'All' : f === 'accepts' ? '✓ Attending' : '✗ Declined'}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontFamily: 'var(--font-cormorant,serif)', fontSize: 20 }}>
            Loading responses…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontFamily: 'var(--font-cormorant,serif)', fontSize: 20 }}>
            No responses found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.sort((a, b) => b.id - a.id).map(e => (
              <div key={e.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${e.attending === 'accepts' ? 'rgba(201,169,110,0.2)' : 'rgba(255,80,80,0.1)'}`,
                borderRadius: 4, padding: '20px 24px',
                display: 'grid', gridTemplateColumns: '1fr auto',
                gap: 8, alignItems: 'start',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontFamily: 'var(--font-cormorant,serif)', color: '#fff', fontWeight: 400 }}>{e.fullName}</span>
                    <span style={{
                      fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999,
                      background: e.attending === 'accepts' ? 'rgba(201,169,110,0.15)' : 'rgba(255,80,80,0.1)',
                      color: e.attending === 'accepts' ? gold : 'rgba(255,120,120,0.8)',
                      border: `1px solid ${e.attending === 'accepts' ? 'rgba(201,169,110,0.3)' : 'rgba(255,80,80,0.2)'}`,
                    }}>
                      {e.attending === 'accepts' ? '✓ Attending' : '✗ Declined'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: e.message ? 12 : 0 }}>
                    <span>{e.email}</span>
                    {e.attending === 'accepts' && <span>{e.guests} guest{e.guests !== 1 ? 's' : ''}</span>}
                    {e.meal && <span>🍽 {e.meal}</span>}
                    <span>{new Date(e.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {e.message && (
                    <p style={{ fontFamily: 'var(--font-cormorant,serif)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 1.6 }}>
                      &ldquo;{e.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
          Data stored at bloom/data/rsvp-responses.json
        </p>
      </div>
    </div>
  );
}
