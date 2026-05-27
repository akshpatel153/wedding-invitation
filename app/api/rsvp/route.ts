import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Resend } from 'resend';

const NOTIFY_EMAIL = process.env.RSVP_NOTIFY_EMAIL || 'patelaksh1503@gmail.com';

// ── Luxury email template ──────────────────────────────────────────────────
function buildEmail(data: {
  fullName: string; email: string; attending: string;
  guests: number; meal: string | null; message: string | null;
  submittedAt: string;
}) {
  const isAttending = data.attending === 'accepts';
  const gold        = '#C9A96E';
  const submitted   = new Date(data.submittedAt).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // Detail row helper
  const row = (icon: string, label: string, value: string | number | null) =>
    value != null && value !== ''
      ? `<tr>
           <td width="20" style="padding:10px 0;vertical-align:top">
             <span style="color:${gold};font-size:14px">${icon}</span>
           </td>
           <td width="100" style="padding:10px 12px 10px 8px;color:#a89070;font-size:11px;letter-spacing:.15em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${label}</td>
           <td style="padding:10px 0;color:#ecdcc0;font-size:14px;font-family:Georgia,serif;font-style:italic;vertical-align:top">${value}</td>
         </tr>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New RSVP — Sarah &amp; James</title>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background:#0e0808;-webkit-font-smoothing:antialiased">

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background:#0e0808;min-height:100vh">
<tr><td align="center" style="padding:32px 16px 48px">

  <!-- Card -->
  <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0"
         style="max-width:580px;width:100%;border:1px solid #3d2a1a;border-radius:2px;overflow:hidden;
                box-shadow:0 40px 120px rgba(0,0,0,0.8)">

    <!-- ═══ HERO ═══ -->
    <tr>
      <td style="padding:0;position:relative">
        <!--[if mso]>
        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"
                style="width:580px;height:320px">
          <v:fill type="frame" src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1160&q=85&fit=crop" color="#1A1010"/>
          <v:textbox inset="0,0,0,0">
        <![endif]-->
        <div style="background-image:url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1160&q=85&fit=crop');
                    background-size:cover;background-position:center;
                    background-color:#1A1010">
          <!-- Dark overlay -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:linear-gradient(180deg,rgba(14,8,8,0.55) 0%,rgba(14,8,8,0.82) 60%,rgba(14,8,8,0.97) 100%);
                          padding:56px 40px 48px;text-align:center">

            <!-- Eyebrow line -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-bottom:1px solid rgba(201,169,110,0.35);width:60px">&nbsp;</td>
              <td style="padding:0 16px;white-space:nowrap;font-family:Arial,sans-serif;font-size:9px;
                         letter-spacing:.4em;text-transform:uppercase;color:${gold}">
                RSVP Notification
              </td>
              <td style="border-bottom:1px solid rgba(201,169,110,0.35)">&nbsp;</td>
            </tr>
            </table>

            <!-- Script names -->
            <div style="font-family:'Great Vibes',Georgia,cursive;font-size:62px;
                        color:#fff;line-height:1;margin:20px 0 4px;
                        text-shadow:0 2px 20px rgba(0,0,0,0.6)">
              Sarah &amp; James
            </div>

            <!-- Date -->
            <div style="font-family:Georgia,serif;font-style:italic;font-size:14px;
                        color:rgba(201,169,110,0.75);letter-spacing:.12em;margin-bottom:28px">
              September 20, 2026 &nbsp;·&nbsp; Venice, Italy
            </div>

            <!-- Status badge -->
            <div style="display:inline-block;padding:8px 28px;border-radius:999px;
                        font-family:Arial,sans-serif;font-size:10px;letter-spacing:.25em;
                        text-transform:uppercase;font-weight:700;
                        background:${isAttending ? 'rgba(201,169,110,0.18)' : 'rgba(180,60,60,0.18)'};
                        color:${isAttending ? gold : '#e08080'};
                        border:1px solid ${isAttending ? 'rgba(201,169,110,0.5)' : 'rgba(180,60,60,0.4)'}">
              ${isAttending ? '✦ &nbsp;Joyfully Accepts' : '✦ &nbsp;Regretfully Declines'}
            </div>

          </td></tr>
          </table>
        </div>
        <!--[if mso]></v:textbox></v:rect><![endif]-->
      </td>
    </tr>

    <!-- ═══ GOLD RULE ═══ -->
    <tr>
      <td style="background:linear-gradient(to right,#1A1010,rgba(201,169,110,0.6) 30%,rgba(201,169,110,0.9) 50%,rgba(201,169,110,0.6) 70%,#1A1010);
                 height:1px;font-size:1px;line-height:1px">&nbsp;</td>
    </tr>

    <!-- ═══ GUEST INFO ═══ -->
    <tr>
      <td style="background:#140c0c;padding:36px 44px">

        <!-- Section title -->
        <div style="font-family:Georgia,serif;font-style:italic;font-size:11px;
                    letter-spacing:.35em;text-transform:uppercase;color:${gold};
                    margin-bottom:20px;text-align:center">
          Guest Details
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-top:1px solid rgba(201,169,110,0.12);border-bottom:1px solid rgba(201,169,110,0.12)">
          ${row('✦', 'Guest', data.fullName)}
          ${row('✉', 'Email', `<a href="mailto:${data.email}" style="color:${gold};text-decoration:none">${data.email}</a>`)}
          ${isAttending ? row('✦', 'Attending', `${data.guests} guest${data.guests !== 1 ? 's' : ''}`) : ''}
          ${isAttending && data.meal ? row('✦', 'Meal', data.meal) : ''}
          ${data.message ? row('❝', 'Message', `<em style="color:#d4bfa0">&ldquo;${data.message}&rdquo;</em>`) : ''}
          ${row('◷', 'Received', submitted)}
        </table>

      </td>
    </tr>

    <!-- ═══ GOLD RULE ═══ -->
    <tr>
      <td style="background:linear-gradient(to right,#1A1010,rgba(201,169,110,0.4) 30%,rgba(201,169,110,0.7) 50%,rgba(201,169,110,0.4) 70%,#1A1010);
                 height:1px;font-size:1px;line-height:1px">&nbsp;</td>
    </tr>

    <!-- ═══ CTA ═══ -->
    <tr>
      <td style="background:#0e0808;padding:32px 44px;text-align:center">
        <a href="https://wedding-invitation-akshpatel153.vercel.app/admin/rsvp"
           style="display:inline-block;padding:14px 40px;
                  background:linear-gradient(135deg,#b8922e,#e8c87a,#b8922e);
                  color:#1a0e0e;text-decoration:none;
                  border-radius:999px;
                  font-family:Arial,sans-serif;font-size:10px;
                  letter-spacing:.25em;text-transform:uppercase;font-weight:700">
          View All Responses &rarr;
        </a>
        <div style="margin-top:16px;font-family:Georgia,serif;font-style:italic;
                    font-size:13px;color:rgba(201,169,110,0.4)">
          You can manage all RSVPs from the admin dashboard
        </div>
      </td>
    </tr>

    <!-- ═══ FOOTER ═══ -->
    <tr>
      <td style="background:#080404;padding:20px 44px;text-align:center;
                 border-top:1px solid rgba(201,169,110,0.08)">
        <div style="font-family:Georgia,serif;font-style:italic;
                    font-size:11px;color:rgba(201,169,110,0.3);letter-spacing:.15em">
          BLOOM &nbsp;·&nbsp; Wedding Platform
        </div>
      </td>
    </tr>

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

    // 1. Save to local JSON file (works in local dev, silently skipped on Vercel)
    try {
      const filePath = path.join(process.cwd(), 'data', 'rsvp-responses.json');
      let existing: typeof response[] = [];
      try {
        const raw = await fs.readFile(filePath, 'utf-8');
        existing = JSON.parse(raw);
      } catch { /* file doesn't exist yet */ }
      existing.push(response);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
    } catch {
      // Silently skip on Vercel (read-only filesystem) — Firestore handles persistence
    }

    // 2. Save to Firestore via REST API (works everywhere including Vercel)
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const apiKey    = process.env.FIREBASE_API_KEY;
      if (projectId && apiKey) {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/rsvp_responses?key=${apiKey}`;
        await fetch(firestoreUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              id:          { integerValue:  String(response.id) },
              submittedAt: { stringValue:   response.submittedAt },
              wedding:     { stringValue:   response.wedding || '' },
              fullName:    { stringValue:   response.fullName },
              email:       { stringValue:   response.email },
              guests:      { integerValue:  String(response.guests) },
              attending:   { stringValue:   response.attending },
              meal:        { stringValue:   response.meal    || '' },
              message:     { stringValue:   response.message || '' },
            },
          }),
        });
      }
    } catch (fsErr) {
      console.error('[RSVP Firestore]', fsErr);
      // Non-blocking — don't fail the submission
    }

    // 3. Send notification email (non-blocking)
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
      }
    } catch (emailErr) {
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
