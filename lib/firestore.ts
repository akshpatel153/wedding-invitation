/**
 * lib/firestore.ts
 * Thin wrapper around the Firestore REST API for wedding config storage.
 * Works on both server (API routes) and client (browser) since it uses fetch.
 *
 * Data is stored as a single JSON string in the `data` field of:
 *   Collection: wedding_configs
 *   Document:   {slug}   (e.g. "sarah-james")
 */

function getEnv(serverKey: string, clientKey: string): string {
  // Server-side env vars are available in Node; client-side needs NEXT_PUBLIC_ prefix
  if (typeof process !== 'undefined' && process.env[serverKey]) {
    return process.env[serverKey] as string;
  }
  if (typeof process !== 'undefined' && process.env[clientKey]) {
    return process.env[clientKey] as string;
  }
  return '';
}

function baseUrl() {
  const projectId = getEnv('FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

function apiKey() {
  return getEnv('FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY');
}

// ── Read ───────────────────────────────────────────────────────────────────
export async function getWeddingConfig(slug: string): Promise<unknown | null> {
  try {
    const res = await fetch(
      `${baseUrl()}/wedding_configs/${slug}?key=${apiKey()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const doc = await res.json();
    const jsonStr = doc.fields?.data?.stringValue;
    if (!jsonStr) return null;
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// ── Write ──────────────────────────────────────────────────────────────────
export async function setWeddingConfig(slug: string, data: unknown): Promise<boolean> {
  try {
    const body = {
      fields: {
        slug:      { stringValue:    slug },
        data:      { stringValue:    JSON.stringify(data) },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    };

    const mask = 'updateMask.fieldPaths=data&updateMask.fieldPaths=slug&updateMask.fieldPaths=updatedAt';
    const res = await fetch(
      `${baseUrl()}/wedding_configs/${slug}?key=${apiKey()}&${mask}`,
      {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
