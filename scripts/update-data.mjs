// Henter ukens tilbud fra tilbudsavisene (Tjek / eTilbudsavis). Skriver data/offers.json.
// NB: Tjek-API-et krever avtale med Tjek. Ikke kjør skriptet før avtalen er på plass.
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

const catalogs = await fetchCatalogs();
const offers = [];
for (const c of catalogs) offers.push(...(await fetchOffers(c)));

await mkdir(new URL('../data/', import.meta.url), { recursive: true });
await writeFile(
  OUT,
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    catalogs: catalogs.map((c) => ({ id: c.id, chain: CHAINS[c.dealer_id], label: c.label, from: c.run_from, till: c.run_till, offers: c.offer_count })),
    offers,
  }),
);
console.log(`${catalogs.length} aviser, ${offers.length} tilbud`);
