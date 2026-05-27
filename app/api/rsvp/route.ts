import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wedding, fullName, email, guests, attending, meal, message } = body;

    if (!fullName || !email || !attending) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      wedding,
      fullName,
      email,
      guests: Number(guests),
      attending,
      meal: meal || null,
      message: message || null,
    };

    // Save to data/rsvp-responses.json
    const filePath = path.join(process.cwd(), 'data', 'rsvp-responses.json');

    let existing: typeof response[] = [];
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — start fresh
    }

    existing.push(response);
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true, id: response.id });
  } catch (err) {
    console.error('[RSVP API]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// View all RSVPs (GET — password protect before going to production!)
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'rsvp-responses.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const responses = JSON.parse(raw);
    return NextResponse.json({ total: responses.length, responses });
  } catch {
    return NextResponse.json({ total: 0, responses: [] });
  }
}
