import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Resend } from 'resend';

const NOTIFY_EMAIL = process.env.RSVP_NOTIFY_EMAIL || 'patelaksh1503@gmail.com';

// ── Email HTML template ────────────────────────────────────────────────────
function buildEmail(data: {
  fullName: string; email: string; attending: string;
  guests: number; meal: string | null; message: string | null;
  submittedAt: string;
}) {
  const attending  = data.attending === 'accepts';
  const gold       = '#C9A96E';
  const dark       = '#1A1010';
  const badge      = attending
    ? `background:#1a2e1a;color:#6dbf6d;border:1px solid #3a5c3a`
    : `background:#2e1a1a;color:#d97777;border:1px solid #5c3a3a`;
  const badgeText  = attending ? '✓ Attending' : '✗ Not Attending';
  const submitted  = new Date(data.submittedAt).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const row = (label: string, value: string | number | null) => value
    ? `<tr>
        <td style="padding:8px 0;color:#888;font-size:13px;width:110px;vertical-align:top">${label}</td>
        <td style="padding:8px 0;color:#eee;font-size:13px">${value}</td>
       </tr>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1c1010;border:1px solid #3a2a2a;border-radius:6px;overflow:hidden;max-width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#2a1a1a,#1a1010);padding:36px 40px;text-align:center;border-bottom:1px solid #${gold.slice(1)}33">
          <div style="font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:${gold};margin-bottom:10px">Sarah &amp; James · September 20, 2026</div>
          <div style="font-size:26px;color:#fff;font-weight:300">New RSVP Received</div>
        </td></tr>

        <!-- Badge -->
        <tr><td style="padding:28px 40px 0;text-align:center">
          <span style="display:inline-block;padding:6px 20px;border-radius:999px;font-size:12px;letter-spacing:.15em;text-transform:uppercase;${badge}">${badgeText}</span>
        </td></tr>

        <!-- Details table -->
        <tr><td style="padding:24px 40px 28px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #3a2a2a;padding-top:16px">
            ${row('Name',      data.fullName)}
            ${row('Email',     `<a href="mailto:${data.email}" style="color:${gold};text-decoration:none">${data.email}</a>`)}
            ${attending ? row('Guests', data.guests) : ''}
            ${attending && data.meal ? row('Meal', data.meal) : ''}
            ${data.message ? row('Message', `<em style="color:#ccc">&ldquo;${data.message}&rdquo;</em>`) : ''}
            ${row('Submitted', submitted)}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 36px;text-align:center">
          <div style="border-top:1px solid #3a2a2a;padding-top:24px">
            <a href="https://wedding-invitation-git-main-akshpatel153.vercel.app/admin/rsvp"
               style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#c9a96e,#e8c07a);color:#2c1a1a;text-decoration:none;border-radius:999px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:600">
              View All Responses →
            </a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#140d0d;padding:16px 40px;text-align:center;border-top:1px solid #3a2a2a">
          <span style="font-size:11px;color:#555;letter-spacing:.1em">BLOOM · Wedding Platform</span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── POST — submit RSVP ─────────────────────────────────────────────────────
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
      meal:    meal    || null,
      message: message || null,
    };

    // 1. Save to JSON file
    const filePath = path.join(process.cwd(), 'data', 'rsvp-responses.json');
    let existing: typeof response[] = [];
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(raw);
    } catch { /* first submission */ }
    existing.push(response);
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

    // 2. Send notification email (non-blocking — don't fail the RSVP if email fails)
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        const resend = new Resend(apiKey);
        const isAttending = attending === 'accepts';
        await resend.emails.send({
          from:    'RSVP Notifications <onboarding@resend.dev>',
          to:      NOTIFY_EMAIL,
          subject: `🌹 New RSVP — ${fullName} ${isAttending ? 'is attending!' : "can't make it"}`,
          html:    buildEmail(response),
        });
      } else {
        console.warn('[RSVP Email] RESEND_API_KEY not set — skipping email');
      }
    } catch (emailErr) {
      // Log but don't block the success response
      console.error('[RSVP Email]', emailErr);
    }

    return NextResponse.json({ success: true, id: response.id });

  } catch (err) {
    console.error('[RSVP API]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── GET — list RSVPs ───────────────────────────────────────────────────────
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
