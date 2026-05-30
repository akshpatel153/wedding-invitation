'use client';

import { useEffect, useState, useCallback } from 'react';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
const SLUG       = 'sarah-james';

const gold  = '#C9A96E';
const dark  = '#0e0808';
const card  = '#140c0c';
const border = 'rgba(201,169,110,0.18)';

// ── Firestore helpers ──────────────────────────────────────────────────────
async function loadConfig() {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/wedding_configs/${SLUG}?key=${API_KEY}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const doc = await res.json();
  const str = doc.fields?.data?.stringValue;
  return str ? JSON.parse(str) : null;
}

async function saveConfig(data: unknown) {
  const mask = 'updateMask.fieldPaths=data&updateMask.fieldPaths=slug&updateMask.fieldPaths=updatedAt';
  const url  = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/wedding_configs/${SLUG}?key=${API_KEY}&${mask}`;
  const body = {
    fields: {
      slug:      { stringValue: SLUG },
      data:      { stringValue: JSON.stringify(data) },
      updatedAt: { timestampValue: new Date().toISOString() },
    },
  };
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.ok;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function Field({ label, value, onChange, textarea = false, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; placeholder?: string;
}) {
  const shared: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${border}`, borderRadius: 4,
    padding: '10px 14px', color: '#ecdcc0',
    fontFamily: 'inherit', fontSize: 13, outline: 'none',
    transition: 'border-color 200ms ease',
    userSelect: 'text', WebkitUserSelect: 'text',
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: gold, marginBottom: 6 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={{ ...shared, resize: 'vertical', minHeight: 80 }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={shared} />
      }
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, marginTop: 8 }}>
      <div style={{ height: 1, width: 24, background: `linear-gradient(to right, transparent, ${gold})` }} />
      <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: gold }}>{children}</span>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${gold}33, transparent)` }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function WeddingAdminPage() {
  const [tab, setTab]         = useState('basics');
  const [data, setData]       = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const cfg = await loadConfig();
    setData(cfg);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const patch = (path: string[], value: unknown) => {
    setData(prev => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  const patchArr = (key: string, idx: number, field: string, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      (next[key] as Record<string, unknown>[])[idx][field] = value;
      return next;
    });
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    const ok = await saveConfig(data);
    setSaving(false);
    showToast(ok ? '✓ Saved to Firestore — changes are live!' : '✗ Save failed. Check Firestore rules.', ok);
  };

  const seed = async () => {
    setSeeding(true);
    const res = await fetch('/api/wedding/seed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: SLUG }) });
    const json = await res.json();
    setSeeding(false);
    if (json.ok) { showToast('✓ Seeded from JSON file!', true); load(); }
    else showToast('✗ Seed failed', false);
  };

  const tabs = [
    { id: 'basics',    label: 'Couple' },
    { id: 'event',     label: 'Event' },
    { id: 'ceremony',  label: 'Ceremony' },
    { id: 'reception', label: 'Reception' },
    { id: 'story',     label: 'Our Story' },
    { id: 'travel',    label: 'Travel' },
    { id: 'registry',  label: 'Registry' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: `${gold}66` }}>Loading…</div>
    </div>
  );

  const couple   = (data as Record<string, Record<string, string>>)?.couple   || {};
  const wedding  = (data as Record<string, Record<string, string>>)?.wedding  || {};
  const ceremony = (data as Record<string, Record<string, string>>)?.ceremony || {};
  const reception= (data as Record<string, Record<string, string>>)?.reception|| {};
  const travel   = (data as Record<string, Record<string, unknown>>)?.travel  || {};
  const story    = ((data as Record<string, unknown[]>)?.story    || []) as Record<string, string>[];
  const registry = ((data as Record<string, unknown[]>)?.registry || []) as Record<string, string>[];
  const hotels   = ((travel.hotels as unknown[]) || []) as Record<string, string>[];

  return (
    <div style={{ minHeight: '100vh', background: dark, fontFamily: "'Helvetica Neue', sans-serif", color: 'rgba(255,255,255,0.75)' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.ok ? 'rgba(60,140,60,0.15)' : 'rgba(180,40,40,0.15)',
          border: `1px solid ${toast.ok ? 'rgba(100,200,100,0.4)' : 'rgba(220,80,80,0.4)'}`,
          borderRadius: 4, padding: '12px 24px',
          color: toast.ok ? '#8ddb8d' : '#e08080', fontSize: 13, letterSpacing: '0.05em',
          backdropFilter: 'blur(12px)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: card, borderBottom: `1px solid ${border}`, padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <a href="/wedding/sarah-james" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${gold}66`, textDecoration: 'none', display: 'block', marginBottom: 8 }}>
            ← Back to wedding
          </a>
          <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 28, color: '#fff', margin: 0 }}>
            Wedding Admin
          </h1>
          <p style={{ fontSize: 11, color: `${gold}88`, margin: '4px 0 0', letterSpacing: '0.1em' }}>
            Changes save to Firestore and go live instantly — no deploy needed
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {!data && (
            <button onClick={seed} disabled={seeding} style={{
              padding: '10px 20px', borderRadius: 999, border: `1px solid ${border}`,
              background: 'rgba(201,169,110,0.08)', color: gold, fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
            }}>
              {seeding ? 'Seeding…' : '⬆ Seed from JSON'}
            </button>
          )}
          <button onClick={save} disabled={saving || !data} style={{
            padding: '10px 28px', borderRadius: 999, border: 'none',
            background: `linear-gradient(135deg, #b8922e, #e8c87a, #b8922e)`,
            color: '#1a0e0e', fontSize: 10, letterSpacing: '0.25em',
            textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
            opacity: saving || !data ? 0.5 : 1,
          }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {!data ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: `${gold}88`, marginBottom: 24 }}>
            No data in Firestore yet.
          </p>
          <button onClick={seed} disabled={seeding} style={{
            padding: '14px 40px', borderRadius: 999,
            background: `linear-gradient(135deg, #b8922e, #e8c87a)`,
            color: '#1a0e0e', border: 'none', fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
          }}>
            {seeding ? 'Seeding…' : '⬆ Seed from JSON file to get started'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>

          {/* Sidebar tabs */}
          <nav style={{ width: 180, background: card, borderRight: `1px solid ${border}`, padding: '24px 0', flexShrink: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: tab === t.id ? gold : 'rgba(255,255,255,0.35)',
                borderLeft: `2px solid ${tab === t.id ? gold : 'transparent'}`,
                transition: 'all 200ms ease',
              }}>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div style={{ flex: 1, padding: '36px 48px', maxWidth: 760 }}>

            {/* ── COUPLE & BASICS ─────────────────────────────── */}
            {tab === 'basics' && (<>
              <SectionTitle>Couple</SectionTitle>
              <Field label="Partner 1 Name" value={couple.name1 || ''} onChange={v => patch(['couple','name1'], v)} />
              <Field label="Partner 2 Name" value={couple.name2 || ''} onChange={v => patch(['couple','name2'], v)} />
              <Field label="Monogram (e.g. S & J)" value={couple.monogram || ''} onChange={v => patch(['couple','monogram'], v)} />
              <SectionTitle>Hero Image</SectionTitle>
              <Field label="Hero Image URL" value={(data as Record<string, string>).heroImage || ''} onChange={v => patch(['heroImage'], v)} placeholder="https://images.unsplash.com/..." />
              {(data as Record<string, string>).heroImage && (
                <img src={(data as Record<string, string>).heroImage} alt="Hero preview"
                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4, marginTop: 8, border: `1px solid ${border}` }} />
              )}
            </>)}

            {/* ── EVENT ───────────────────────────────────────── */}
            {tab === 'event' && (<>
              <SectionTitle>Event Details</SectionTitle>
              <Field label="Date (ISO, e.g. 2026-09-20T17:30:00)" value={wedding.date || ''} onChange={v => patch(['wedding','date'], v)} />
              <Field label="Date Display (formal, shown in hero)" value={wedding.dateDisplay || ''} onChange={v => patch(['wedding','dateDisplay'], v)} placeholder="Saturday, the Twentieth of September..." />
              <Field label="Date Short (shown in footer)" value={wedding.dateShort || ''} onChange={v => patch(['wedding','dateShort'], v)} placeholder="September 20, 2026" />
              <Field label="Day of Week" value={wedding.dayOfWeek || ''} onChange={v => patch(['wedding','dayOfWeek'], v)} placeholder="SATURDAY" />
              <Field label="Ceremony Time" value={wedding.time || ''} onChange={v => patch(['wedding','time'], v)} placeholder="5:30 PM" />
              <Field label="RSVP Deadline" value={wedding.rsvpDeadline || ''} onChange={v => patch(['wedding','rsvpDeadline'], v)} placeholder="August 1st, 2026" />
              <Field label="Dress Code" value={wedding.dressCode || ''} onChange={v => patch(['wedding','dressCode'], v)} placeholder="Black Tie Optional" />
            </>)}

            {/* ── CEREMONY ────────────────────────────────────── */}
            {tab === 'ceremony' && (<>
              <SectionTitle>Ceremony Venue</SectionTitle>
              <Field label="Venue Name" value={ceremony.venue || ''} onChange={v => patch(['ceremony','venue'], v)} />
              <Field label="Street Address" value={ceremony.address || ''} onChange={v => patch(['ceremony','address'], v)} />
              <Field label="City / Region" value={ceremony.city || ''} onChange={v => patch(['ceremony','city'], v)} />
              <Field label="Ceremony Time" value={ceremony.time || ''} onChange={v => patch(['ceremony','time'], v)} />
              <Field label="Google Maps URL" value={ceremony.mapsUrl || ''} onChange={v => patch(['ceremony','mapsUrl'], v)} />
            </>)}

            {/* ── RECEPTION ───────────────────────────────────── */}
            {tab === 'reception' && (<>
              <SectionTitle>Reception Venue</SectionTitle>
              <Field label="Venue Name" value={reception.venue || ''} onChange={v => patch(['reception','venue'], v)} />
              <Field label="Sub-venue / Hall" value={reception.subvenue || ''} onChange={v => patch(['reception','subvenue'], v)} />
              <Field label="City / Region" value={reception.city || ''} onChange={v => patch(['reception','city'], v)} />
              <Field label="Start Time" value={reception.time || ''} onChange={v => patch(['reception','time'], v)} placeholder="Immediately Following" />
              <Field label="Details / Description" value={reception.details || ''} onChange={v => patch(['reception','details'], v)} placeholder="Dinner & Dancing Until Midnight" />
              <Field label="Google Maps URL" value={reception.mapsUrl || ''} onChange={v => patch(['reception','mapsUrl'], v)} />
            </>)}

            {/* ── OUR STORY ───────────────────────────────────── */}
            {tab === 'story' && (<>
              <SectionTitle>Our Story Milestones</SectionTitle>
              {story.map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: 4, padding: '20px 20px 8px', marginBottom: 16 }}>
                  <p style={{ fontSize: 10, color: `${gold}88`, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Milestone {i + 1}</p>
                  <Field label="Date" value={m.date || ''} onChange={v => patchArr('story', i, 'date', v)} placeholder="May 2019" />
                  <Field label="Title" value={m.title || ''} onChange={v => patchArr('story', i, 'title', v)} />
                  <Field label="Story" value={m.body || ''} onChange={v => patchArr('story', i, 'body', v)} textarea placeholder="Tell the story..." />
                  <Field label="Image URL" value={m.image || ''} onChange={v => patchArr('story', i, 'image', v)} />
                </div>
              ))}
            </>)}

            {/* ── TRAVEL ──────────────────────────────────────── */}
            {tab === 'travel' && (<>
              <SectionTitle>Getting There</SectionTitle>
              <Field label="Directions Note" value={(travel.directionsNote as string) || ''} onChange={v => patch(['travel','directionsNote'], v)} textarea />
              <Field label="Address" value={(travel.address as string) || ''} onChange={v => patch(['travel','address'], v)} />
              <Field label="Google Maps URL" value={(travel.mapsUrl as string) || ''} onChange={v => patch(['travel','mapsUrl'], v)} />
              <Field label="Room Block Note" value={(travel.roomBlock as string) || ''} onChange={v => patch(['travel','roomBlock'], v)} textarea />
              <SectionTitle>Nearby Hotels</SectionTitle>
              {hotels.map((h, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: 4, padding: '16px 20px 4px', marginBottom: 12 }}>
                  <p style={{ fontSize: 10, color: `${gold}88`, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Hotel {i + 1}</p>
                  <Field label="Hotel Name" value={h.name || ''} onChange={v => {
                    const arr = JSON.parse(JSON.stringify(hotels));
                    arr[i].name = v;
                    patch(['travel','hotels'], arr);
                  }} />
                  <Field label="Distance from Venue" value={h.distance || ''} onChange={v => {
                    const arr = JSON.parse(JSON.stringify(hotels));
                    arr[i].distance = v;
                    patch(['travel','hotels'], arr);
                  }} placeholder="0.3 km from venue" />
                  <Field label="Booking URL" value={h.url || ''} onChange={v => {
                    const arr = JSON.parse(JSON.stringify(hotels));
                    arr[i].url = v;
                    patch(['travel','hotels'], arr);
                  }} />
                </div>
              ))}
            </>)}

            {/* ── REGISTRY ────────────────────────────────────── */}
            {tab === 'registry' && (<>
              <SectionTitle>Gift Registry</SectionTitle>
              {registry.map((r, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: 4, padding: '16px 20px 4px', marginBottom: 12 }}>
                  <p style={{ fontSize: 10, color: `${gold}88`, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Registry {i + 1}</p>
                  <Field label="Store Name" value={r.store || ''} onChange={v => patchArr('registry', i, 'store', v)} />
                  <Field label="Description" value={r.description || ''} onChange={v => patchArr('registry', i, 'description', v)} />
                  <Field label="Registry URL" value={r.url || ''} onChange={v => patchArr('registry', i, 'url', v)} />
                  <Field label="Icon (home / kitchen / travel)" value={r.icon || ''} onChange={v => patchArr('registry', i, 'icon', v)} />
                </div>
              ))}
            </>)}

          </div>
        </div>
      )}
    </div>
  );
}
