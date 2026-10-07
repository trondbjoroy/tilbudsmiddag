// Lokal utviklingsserver for statiske filer.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT) || 5173;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const path = normalize(join(ROOT, rel));
  if (!path.startsWith(ROOT)) return res.writeHead(403).end();
  try {
    const file = await readFile(path);
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' }).end(file);
  } catch {
    const notFound = await readFile(join(ROOT, '404.html')).catch(() => 'Ikke funnet');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(notFound);
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
