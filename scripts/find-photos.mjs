// Finner bildekandidater for retter uten bilde: Pexels (fri lisens) og
// Wikimedia Commons (CC-lisenser med kreditering). Skriver photo-candidates.json.
// Kjør: node scripts/find-photos.mjs
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { RECIPES } from '../assets/recipes.js';
import { slugify } from '../assets/slug.js';
import { QUERIES } from './photo-queries.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const OK_LICENSES = /^(CC0|Public domain|CC BY(-SA)? [0-9.]+)$/i;
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function pexels(query) {
  const html = await (await fetch(`https://www.pexels.com/search/${encodeURIComponent(query)}/`, { headers: { 'User-Agent': UA } })).text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return [];
  const items = JSON.parse(m[1]).props?.pageProps?.initialData?.data ?? [];
  return items
    .filter((x) => x.type === 'photo' && x.attributes.width >= 1200)
    .slice(0, 4)
    .map(({ attributes: a }) => ({
      source: 'Pexels',
      title: a.title || a.description,
      author: [a.user.first_name, a.user.last_name].filter(Boolean).join(' '),
      license: 'Pexels-lisens',
      licenseUrl: 'https://www.pexels.com/license/',
      page: `https://www.pexels.com/photo/${a.slug}-${a.id}/`,
      thumb: `https://images.pexels.com/photos/${a.id}/pexels-photo-${a.id}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      full: `https://images.pexels.com/photos/${a.id}/pexels-photo-${a.id}.jpeg?auto=compress&cs=tinysrgb&w=1200`,
    }));
}

async function commons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch=${encodeURIComponent(query + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1200`;
  const j = await (await fetch(url, { headers: { 'User-Agent': 'tilbudsmiddag.no/1.0' } })).json();
  return Object.values(j.query?.pages ?? {})
    .sort((a, b) => a.index - b.index)
    .map((p) => ({ p, i: p.imageinfo[0], m: p.imageinfo[0].extmetadata }))
    .filter(({ i, m }) => i.width >= 800 && OK_LICENSES.test(strip(m.LicenseShortName?.value)))
    .slice(0, 3)
    .map(({ p, i, m }) => ({
      source: 'Wikimedia Commons',
      title: p.title.replace(/^File:/, ''),
      author: strip(m.Artist?.value) || 'Ukjent',
      license: strip(m.LicenseShortName?.value),
      licenseUrl: strip(m.LicenseUrl?.value) || null,
      page: i.descriptionurl,
      thumb: i.thumburl.replace(/\/\d+px-/, '/400px-'),
      full: i.thumburl,
    }));
}

const out = {};
for (const r of RECIPES) {
  if (existsSync(new URL(`../assets/img/${slugify(r.name)}.webp`, import.meta.url))) continue;
  const q = QUERIES[r.id] ?? {};
  const list = [];
  if (q.commons) list.push(...(await commons(q.commons).catch(() => [])));
  if (q.pexels) list.push(...(await pexels(q.pexels).catch(() => [])));
  out[r.id] = { name: r.name, candidates: list };
  console.log(r.id, list.length);
  await new Promise((res) => setTimeout(res, 400));
}
await writeFile(new URL('photo-candidates.json', import.meta.url), JSON.stringify(out, null, 1));
console.log('ferdig');
