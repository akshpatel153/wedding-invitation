import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { setWeddingConfig } from '@/lib/firestore';

/**
 * POST /api/wedding/seed
 * Seeds Firestore with data from the local JSON file.
 * Call this once from the admin panel to migrate your data.
 *
 * Body: { slug: "sarah-james" }  (defaults to sarah-james)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug = body.slug || 'sarah-james';

    const filePath = path.join(process.cwd(), 'data', 'couples', `${slug}.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    const ok = await setWeddingConfig(slug, data);
    if (!ok) {
      return NextResponse.json({ error: 'Firestore write failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, slug, message: 'Seeded successfully' });
  } catch (err) {
    console.error('[Seed]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
