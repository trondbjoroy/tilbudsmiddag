// Vercel-funksjon for kontaktskjemaet på annonser.html.
// Sender e-post via Resend. Mottakeren står bare i miljøvariabelen CONTACT_TO,
// så adressen vises aldri på siden eller i koden.
// Miljøvariabler: RESEND_API_KEY, CONTACT_TO, CONTACT_FROM (valgfri).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Bare POST er tillatt.' });

  let body = req.body ?? {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Ugyldig forespørsel.' });
    }
  }

  // Enkel spamsperre: skjult felt og minste utfyllingstid.
  if (body.website || Number(body.elapsed) < 3000) return res.status(200).json({ ok: true });

  const name = clean(body.name, 100);
  const company = clean(body.company, 100);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const topic = clean(body.topic, 40) || 'Annonsering';
  const message = clean(body.message, 4000);
  if (!name || !EMAIL.test(email) || !message) {
    return res.status(400).json({ error: 'Fyll ut navn, en gyldig e-postadresse og en melding.' });
  }

  const to = process.env.CONTACT_TO;
  const key = process.env.RESEND_API_KEY;
  if (!to || !key) return res.status(500).json({ error: 'Skjemaet er ikke satt opp ennå.' });

  const text = [
    `Ny henvendelse fra tilbudsmiddag.no (${topic})`,
    '',
    `Navn: ${name}`,
    `Firma: ${company || '–'}`,
    `E-post: ${email}`,
    `Telefon: ${phone || '–'}`,
    '',
    message,
  ].join('\n');

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Tilbudsmiddag <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `${topic}: ${company || name}`,
      text,
    }),
  });
  if (!sent.ok) {
    console.error('Resend feilet', sent.status, await sent.text());
    return res.status(502).json({ error: 'Vi klarte ikke å sende meldingen.' });
  }
  return res.status(200).json({ ok: true });
}
