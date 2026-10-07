// Henter ukens tilbud fra tilbudsavisene (Tjek / eTilbudsavis) og
// prissammenligning fra enhver.no. Skriver data/offers.json.
// Kjør: node scripts/update-data.mjs
import { writeFile, mkdir } from 'node:fs/promises';

const TJEK = 'https://squid-api.tjek.com/v2';
const OUT = new URL('../data/offers.json', import.meta.url);

// Dagligvarekjedene vi bruker. Nøkkel = Tjek dealer_id.
const CHAINS = {
  faa0Ym: 'REMA 1000',
  '257bxm': 'KIWI',
  '80742m': 'Extra',
  '51dawm': 'Obs',
  f5d5lm: 'Coop Prix',
  de79dm: 'Coop Mega',
  '4333pm': 'MENY',
  c062vm: 'SPAR',
  b3e8Fm: 'Joker',
  '5b11sm': 'Bunnpris',
};

// enhver.no bruker egne kjede-ID-er.
const ENHVER_BRANDS = { 1: 'KIWI', 3: 'MENY', 4: 'Obs', 6: 'REMA 1000', 8: 'SPAR', 9: 'Extra', 7: 'Coop Prix', 10: 'Bunnpris' };

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'tilbudsmiddag.no data-oppdatering' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchCatalogs() {
  const ids = Object.keys(CHAINS).join(',');
  const url = `${TJEK}/catalogs?dealer_ids=${ids}&r_lat=59.9139&r_lng=10.7522&r_radius=700000&limit=100`;
  const now = Date.now();
  return (await getJson(url)).filter((c) => c.offer_count > 0 && Date.parse(c.run_till) > now);
}

async function fetchOffers(catalog) {
  const all = [];
  for (let offset = 0; ; offset += 100) {
    const page = await getJson(`${TJEK}/offers?catalog_id=${catalog.id}&limit=100&offset=${offset}`);
    all.push(...page);
    if (page.length < 100) break;
  }
  return all.map((o) => ({
    id: o.id,
    chain: CHAINS[catalog.dealer_id],
    heading: o.heading.replace(/\s+/g, ' ').trim(),
    description: (o.description || '').replace(/\s+/g, ' ').trim(),
    price: o.pricing.price,
    prePrice: o.pricing.pre_price,
    size: o.quantity?.size?.from ?? null,
    unit: o.quantity?.unit?.symbol ?? null,
    image: o.images?.thumb ?? null,
    from: o.run_from,
    till: o.run_till,
    catalog: catalog.id,
  }));
}

// SvelteKit "devalue"-format: en flat liste der objekter peker på indekser.
function unflatten(values) {
  const out = new Array(values.length);
  const h = (i) => {
    if (i < 0) return undefined;
    if (i in out) return out[i];
    const v = values[i];
    if (!v || typeof v !== 'object') return (out[i] = v);
    if (Array.isArray(v)) {
      const a = (out[i] = []);
      v.forEach((x) => a.push(h(x)));
      return a;
    }
    const o = (out[i] = {});
    for (const k in v) o[k] = h(v[k]);
    return o;
  };
  return h(0);
}

async function fetchEnhver() {
  const j = await getJson('https://enhver.no/comparison/__data.json');
  const layout = unflatten(j.nodes[1].data);
  const page = unflatten(j.nodes[2].data);
  return {
    week: layout.webSettings?.week ?? null,
    updatedAt: layout.webSettings?.weekUpdatedAt ?? null,
    summary: layout.webSettings?.weekSummary ?? null,
    flyers: layout.adPapers.map((a) => ({ chain: a.title, url: a.url })),
    // Basisvarer med pris i hver kjede. Brukes når en vare ikke er på tilbud.
    staples: page.products.map((p) => ({
      title: p.title,
      prices: p.prices
        .map((x) => ({ chain: ENHVER_BRANDS[x.brandId], price: x.price }))
        .filter((x) => x.chain)
        .sort((a, b) => a.price - b.price),
    })),
  };
}

const catalogs = await fetchCatalogs();
const offers = [];
for (const c of catalogs) offers.push(...(await fetchOffers(c)));

let enhver = null;
try {
  enhver = await fetchEnhver();
} catch (err) {
  console.warn('enhver.no feilet:', err.message);
}

await mkdir(new URL('../data/', import.meta.url), { recursive: true });
await writeFile(
  OUT,
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    catalogs: catalogs.map((c) => ({ id: c.id, chain: CHAINS[c.dealer_id], label: c.label, from: c.run_from, till: c.run_till, offers: c.offer_count })),
    offers,
    enhver,
  }),
);
console.log(`${catalogs.length} aviser, ${offers.length} tilbud, enhver: ${enhver ? enhver.staples.length + ' basisvarer' : 'mangler'}`);
