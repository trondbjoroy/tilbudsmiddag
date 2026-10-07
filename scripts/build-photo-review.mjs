// Lager photo-review.html: forslag til bilde per rett, til godkjenning.
import { readFileSync, writeFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { RECIPES } from '../assets/recipes.js';
import { slugify } from '../assets/slug.js';
const picks = Object.fromEntries(readFileSync(new URL('photo-picks.txt', import.meta.url), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => { const p = l.split('|'); return [p[0], p]; }));
const commons = JSON.parse(readFileSync(new URL('photo-commons.json', import.meta.url), 'utf8'));
const cands = JSON.parse(readFileSync(new URL('photo-candidates.json', import.meta.url), 'utf8'));
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=300`;
let n = 0;
const rows = RECIPES.filter((r) => !existsSync(new URL(`../assets/img/${slugify(r.name)}.webp`, import.meta.url))).map((r) => {
  const c = commons[r.id] && cands[r.id]?.candidates.find((x) => x.title === commons[r.id].title);
  const p = picks[r.id];
  let main = '', alt = '';
  if (c) main = `<img src="${c.full}"><small>Wikimedia: ${c.author} (${c.license})</small>`;
  else if (p) { main = `<img src="${px(p[1])}"><small>Pexels: ${p[4]}</small>`; if (p[5]) alt = `<img src="${px(p[5])}"><small>Alternativ: ${p[7]}</small>`; }
  else return '';
  n++;
  return `<div class="r"><b>${n}. ${r.name}</b><div class="i"><figure>${main}</figure>${alt ? `<figure class="alt">${alt}</figure>` : ''}</div></div>`;
}).join('');
writeFileSync(new URL('../photo-review.html', import.meta.url), `<!doctype html><meta charset="utf-8"><title>Bildeforslag</title><style>body{font:14px system-ui;margin:16px;background:#faf6f0}h1{font-size:20px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:14px}.r{background:#fff;border:1px solid #e6ddd0;border-radius:10px;padding:10px}.i{display:flex;gap:8px;margin-top:6px}figure{margin:0;flex:1}figure img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px}.alt{opacity:.75}small{display:block;color:#6f665c;font-size:11px}</style><h1>Bildeforslag (${n} retter) – venstre = valgt, høyre = alternativ</h1><div class="g">${rows}</div>`);
console.log(n, 'retter i oversikten');
