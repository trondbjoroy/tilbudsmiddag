// Lager bilder av rettene med Qwen-Image (Apache 2.0) via en offentlig Hugging Face Space.
// Hopper over bilder som finnes. Kjør: node scripts/generate-images.mjs [id ...]
// Uten innlogging er gratiskvoten svært liten. Sett HF_TOKEN (lesenøkkel fra huggingface.co/settings/tokens)
// for å bruke kvoten til din egen konto.
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { RECIPES } from '../assets/recipes.js';
import { slugify } from '../assets/slug.js';
import { PROMPTS, STYLE } from './image-prompts.mjs';

const API = 'https://mcp-tools-qwen-image-fast.hf.space/gradio_api';
const DIR = new URL('../assets/img/', import.meta.url);
const AUTH = process.env.HF_TOKEN ? { Authorization: `Bearer ${process.env.HF_TOKEN}` } : {};

async function generate(prompt, seed) {
  const r = await fetch(`${API}/call/generate_image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...AUTH },
    body: JSON.stringify({ data: [prompt, seed, false, '4:3', 1, 8] }),
  });
  if (!r.ok) throw new Error(`POST ${r.status}`);
  const { event_id } = await r.json();
  const text = await (await fetch(`${API}/call/generate_image/${event_id}`, { headers: AUTH })).text();
  const m = text.match(/event: (complete|error)\ndata: (.*)/);
  if (!m || m[1] === 'error') throw new Error(text.slice(-300));
  const img = await fetch(JSON.parse(m[2])[0].url, { headers: AUTH });
  return Buffer.from(await img.arrayBuffer());
}

await mkdir(DIR, { recursive: true });
const only = process.argv.slice(2);
for (const r of RECIPES) {
  if (only.length && !only.includes(r.id)) continue;
  const file = new URL(`${slugify(r.name)}.webp`, DIR);
  if (existsSync(file) && !only.length) continue;
  if (!PROMPTS[r.id]) throw new Error(`Mangler bildebeskrivelse for ${r.id}`);
  for (let attempt = 1; ; attempt++) {
    try {
      await writeFile(file, await generate(`${PROMPTS[r.id]} ${STYLE}`, 7 + attempt));
      console.log('ok', r.id);
      break;
    } catch (err) {
      console.log('feil', r.id, attempt, String(err.message).slice(0, 200));
      if (attempt >= 3) throw err;
      await new Promise((res) => setTimeout(res, 20000 * attempt));
    }
  }
}
console.log('ferdig');
