// Lokal utviklingsserver: statiske filer + /api/contact.
// Med DEV_FAKE_MAIL=1 logges e-posten i konsollen i stedet for å sendes.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from '../api/contact.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT) || 5173;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

if (process.env.DEV_FAKE_MAIL) {
  process.env.CONTACT_TO ||= 'test@example.com';
  process.env.RESEND_API_KEY ||= 'dev';
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    if (String(url).startsWith('https://api.resend.com')) {
      console.log('[DEV_FAKE_MAIL]', opts.body);
      return new Response('{}', { status: 200 });
    }
    return realFetch(url, opts);
  };
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/contact') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    req.body = raw;
    res.status = (code) => ((res.statusCode = code), res);
    res.json = (obj) => (res.setHeader('Content-Type', 'application/json'), res.end(JSON.stringify(obj)));
    return handler(req, res);
  }
  const path = normalize(join(ROOT, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname)));
  if (!path.startsWith(ROOT)) return res.writeHead(403).end();
  try {
    const file = await readFile(path);
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' }).end(file);
  } catch {
    res.writeHead(404).end('Ikke funnet');
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
