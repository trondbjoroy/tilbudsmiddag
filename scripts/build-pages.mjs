// Lager statiske sider for søkemotorer ut fra oppskriftsbasen og ukens tilbud:
// /oppskrift/<navn>/, /oppskrifter/, oppskriftslisten på forsiden, temasider
// (/middagstilbud/, /billig-middag/, /middagstips/ m.fl.), sitemap.xml, robots.txt og 404.html.
// Kjør etter endringer i oppskriftene: node scripts/build-pages.mjs
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { RECIPES } from '../assets/recipes.js';
import { INGREDIENTS } from '../assets/ingredients.js';
import { slugify } from '../assets/slug.js';

const SITE = 'https://tilbudsmiddag.no';
const ROOT = new URL('../', import.meta.url);
const TODAY = new Date().toISOString().slice(0, 10);
// Kreditering per bilde (laget av scripts/download-photos.py).
const CREDITS = JSON.parse(await readFile(new URL('../assets/img/credits.json', import.meta.url), 'utf8').catch(() => '{}'));
function creditHtml(slug) {
  const c = CREDITS[slug];
  if (!c) return 'KI-generert illustrasjon'; // Bilder uten oppføring er laget med bildeskriptet.
  if (c.kind === 'pexels') return `Illustrasjonsfoto: <a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.author)} / Pexels</a>`;
  if (c.kind === 'commons') return `Foto: <a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.author)}</a>, ${c.licenseUrl ? `<a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license)}, via Wikimedia Commons`;
  return 'KI-generert illustrasjon';
}
const creditText = (slug) => creditHtml(slug).replace(/<[^>]+>/g, '');

// Ukens tilbud: tilbud som gjelder en gang de neste 7 dagene.
const DATA = JSON.parse(await readFile(new URL('../data/offers.json', import.meta.url), 'utf8').catch(() => '{"offers":[]}'));
const NOW = Date.now();
const ACTIVE = DATA.offers.filter((o) => Date.parse(o.till) > NOW && Date.parse(o.from) < NOW + 7 * 864e5);
const WEEK_NO = (() => {
  const t = new Date();
  const d = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil(((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7);
})();
const perKg = (o) => o.unit === 'kg' && o.size === 1 && !/(^|[^\d,])1 ?kg/i.test(o.description);
const kr = (n) => (n % 1 ? n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n.toLocaleString('nb-NO')) + ' kr';
const priceLabel = (o) => kr(o.price) + (perKg(o) ? '/kg' : '');
function offersFor(key) {
  const d = INGREDIENTS[key];
  if (!d?.match) return [];
  return ACTIVE.filter((o) => d.match.test(o.heading) && !(d.not && d.not.test(o.heading)) && !(d.and && !d.and.test(o.heading))).sort((a, b) => a.price - b.price);
}
// Kilopris når pakningen har vekt eller volum, ellers null.
function kgPrice(o) {
  if (perKg(o)) return o.price;
  const f = { g: 1000, ml: 1000, kg: 1, l: 1 }[o.unit];
  return f && o.size ? (o.price * f) / o.size : null;
}
const byKgPrice = (a, b) => (kgPrice(a) ?? Infinity) - (kgPrice(b) ?? Infinity) || a.price - b.price;
// Billigste tilbud (etter kilopris) på hovedråvaren i en oppskrift, eller null.
// Hovedråvaren er kjøtt eller fisk (vekt 3) når oppskriften har det, ellers vekt 2 (egg, bønner o.l.).
function mainDeal(r) {
  const top = Math.max(...r.ing.map(([k]) => INGREDIENTS[k].w ?? 0));
  if (top < 2) return null;
  const deals = r.ing.filter(([k]) => INGREDIENTS[k].w === top).map(([k]) => ({ key: k, offer: [...offersFor(k)].sort(byKgPrice)[0] })).filter((x) => x.offer);
  return deals.sort((a, b) => byKgPrice(a.offer, b.offer))[0] || null;
}

const CATS = { kylling: 'Kylling', storfe: 'Kjøttdeig og storfe', svin: 'Svin', lam: 'Lam', fisk: 'Fisk og sjømat', vegetar: 'Vegetar' };
const CAT_ORDER = Object.keys(CATS);
const TAGS = { glutenfri: 'Uten gluten', laktosefri: 'Uten laktose', barn: 'Barnevennlig', fredag: 'Fredagskos', helg: 'Helgemiddag' };
const DIET_SCHEMA = { glutenfri: 'https://schema.org/GlutenFreeDiet', laktosefri: 'https://schema.org/LowLactoseDiet' };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const url = (r) => `/oppskrift/${slugify(r.name)}/`;
// Bilde av retten, eller null hvis det ikke er laget ennå.
const img = (r) => (existsSync(new URL(`../assets/img/${slugify(r.name)}.webp`, import.meta.url)) ? `/assets/img/${slugify(r.name)}.webp` : null);
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

function ingredientText([key, qty, unit, note]) {
  const name = INGREDIENTS[key].name;
  const lower = name.charAt(0).toLowerCase() + name.slice(1);
  const extra = note ? ` (${note})` : '';
  if (qty == null) return `${name} etter smak${extra}`;
  return `${qty.toLocaleString('nb-NO')}${unit ? ' ' + unit : ''} ${lower}${extra}`;
}

const KIND = { kylling: 'kyllingmiddag', storfe: 'middag med kjøtt', svin: 'middag med svinekjøtt', lam: 'lammemiddag', fisk: 'fiskemiddag', vegetar: 'vegetarmiddag' };
function describe(r) {
  const kind = (r.tags.includes('barn') ? 'barnevennlig ' : r.time <= 45 ? 'enkel ' : 'god ') + KIND[r.cat];
  return `${r.name} – ${kind} som tar ${r.time} minutter og gir 4 porsjoner. Se oppskriften og hvor ingrediensene er billigst denne uken.`;
}

function page({ title, description, path, body, head = '', noindex = false, image = '/assets/og.png' }) {
  return `<!doctype html>
<html lang="nb">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE}${path}">`}
  <meta property="og:site_name" content="Tilbudsmiddag">
  <meta property="og:locale" content="nb_NO">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${SITE}${path}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#c8442b">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/theme.js"></script>
  <script src="/assets/analytics.js"></script>
  ${head}
</head>
<body>
  <header class="site-head">
    <div class="wrap head-row">
      <a class="logo" href="/"><span class="logo-mark" aria-hidden="true"></span>tilbudsmiddag</a>
      <nav class="nav" aria-label="Hovedmeny">
        <a href="/#ukemeny" class="hide-xs">Ukemeny</a>
        <a href="/oppskrifter/">Oppskrifter</a>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Bytt fargemodus">
          <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>
          <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
      </nav>
    </div>
  </header>
  <main class="wrap">
${body}
  </main>
  <footer class="site-foot">
    <div class="wrap foot-row">
      <p><strong>tilbudsmiddag.no</strong> – middager fra ukens tilbudsaviser.</p>
      <nav aria-label="Bunnmeny"><a href="/">Ukens middager</a> · <a href="/oppskrifter/">Alle oppskrifter</a> · <a href="/middagstilbud/">Middagstilbud</a> · <a href="/billig-middag/">Billig middag</a> · <a href="/middagstips/">Middagstips</a> · <a href="/bildekreditering/">Bildekreditering</a></nav>
    </div>
  </footer>
</body>
</html>
`;
}

const crumbs = (items) => `    <nav class="crumbs" aria-label="Brødsmuler">${items.map(([name, href]) => (href ? `<a href="${href}">${esc(name)}</a>` : `<span aria-current="page">${esc(name)}</span>`)).join(' <span aria-hidden="true">›</span> ')}</nav>`;
const crumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(href ? { item: SITE + href } : {}) })),
});

function recipeCard(r, note = '') {
  const pic = img(r) ? `<img src="${img(r)}" alt="" width="1024" height="768" loading="lazy" decoding="async">` : '';
  return `<a class="rcard" href="${url(r)}" data-cat="${r.cat}">${pic}<span class="cat">${esc(CATS[r.cat])}</span><span class="rcard-name">${esc(r.name)}</span><span class="time">${r.time} min</span>${note ? `<span class="deal-note">${note}</span>` : ''}</a>`;
}
// Kort med tilbudsmerke når hovedråvaren er på tilbud denne uken.
function dealCard(r) {
  const d = mainDeal(r);
  return recipeCard(r, d ? `${esc(INGREDIENTS[d.key].name)} ${priceLabel(d.offer)} hos ${esc(d.offer.chain)}` : '');
}

function recipePage(r) {
  const path = url(r);
  const description = describe(r);
  const trail = [['Forside', '/'], ['Oppskrifter', '/oppskrifter/'], [CATS[r.cat], `/oppskrifter/#${r.cat}`], [r.name]];
  const related = RECIPES.filter((x) => x.cat === r.cat && x.id !== r.id).slice(0, 6);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: r.name,
    description,
    inLanguage: 'nb-NO',
    author: { '@type': 'Organization', name: 'Tilbudsmiddag', url: SITE + '/' },
    ...(img(r) ? { image: [SITE + img(r)] } : {}),
    recipeCategory: 'Middag',
    recipeCuisine: 'Norsk',
    totalTime: `PT${r.time}M`,
    recipeYield: '4 porsjoner',
    keywords: [r.name, 'middag', 'middagstips', CATS[r.cat].toLowerCase(), ...r.tags.map((t) => TAGS[t]?.toLowerCase()).filter(Boolean)].join(', '),
    recipeIngredient: r.ing.map(ingredientText),
    recipeInstructions: r.steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text, url: `${SITE}${path}#steg-${i + 1}` })),
    ...(r.tags.some((t) => DIET_SCHEMA[t]) || r.cat === 'vegetar'
      ? { suitableForDiet: [...r.tags.filter((t) => DIET_SCHEMA[t]).map((t) => DIET_SCHEMA[t]), ...(r.cat === 'vegetar' ? ['https://schema.org/VegetarianDiet'] : [])] }
      : {}),
  };
  const body = `${crumbs(trail)}
    <article class="recipe-page" data-cat="${r.cat}">
      ${img(r) ? `<figure class="recipe-fig"><img class="recipe-img" src="${img(r)}" alt="${esc(r.name)}" width="1024" height="768" fetchpriority="high"><figcaption>${creditHtml(slugify(r.name))}</figcaption></figure>` : ''}
      <header class="recipe-head">
        <div class="card-top"><span class="cat">${esc(CATS[r.cat])}</span><span class="time">${r.time} min</span>${r.tags.filter((t) => TAGS[t]).map((t) => `<span class="tag">${TAGS[t]}</span>`).join('')}</div>
        <h1>${esc(r.name)}</h1>
        <p class="lead">${esc(description)}</p>
        <a class="btn" href="/#oppskrift=${r.id}">Se handleliste med ukens tilbud →</a>
      </header>
      <div class="r-grid">
        <section>
          <h2>Ingredienser <span class="muted">(4 porsjoner)</span></h2>
          <ul class="ing">${r.ing.map((i) => `<li>${esc(ingredientText(i))}</li>`).join('')}</ul>
        </section>
        <section>
          <h2>Slik gjør du</h2>
          <ol class="steps">${r.steps.map((s, i) => `<li id="steg-${i + 1}">${esc(s)}</li>`).join('')}</ol>
        </section>
      </div>
    </article>
    ${related.length ? `<section class="related"><h2>Flere oppskrifter: ${esc(CATS[r.cat].toLowerCase())}</h2><div class="rcards">${related.map(recipeCard).join('')}</div></section>` : ''}`;
  return page({ title: `${r.name} – oppskrift | Tilbudsmiddag`, description, path, body, head: jsonLd(ld) + jsonLd(crumbLd(trail)), ...(img(r) ? { image: img(r) } : {}) });
}

function byCategory() {
  return CAT_ORDER.map((cat) => [cat, RECIPES.filter((r) => r.cat === cat).sort((a, b) => a.name.localeCompare(b.name, 'nb'))]);
}

function overviewPage() {
  const trail = [['Forside', '/'], ['Oppskrifter']];
  const body = `${crumbs(trail)}
    <section class="intro">
      <h1>Middagsoppskrifter</h1>
      <p class="lead">${RECIPES.length} enkle middager for hverdag og helg. Hver oppskrift viser hvor ingrediensene er på tilbud denne uken.</p>
      <nav class="chips" aria-label="Kategorier">${CAT_ORDER.map((c) => `<a class="chip" href="#${c}">${esc(CATS[c])}</a>`).join('')}</nav>
    </section>
    ${byCategory().map(([cat, list]) => `<section class="rsection" id="${cat}"><h2>${esc(CATS[cat])}</h2><div class="rcards">${list.map(recipeCard).join('')}</div></section>`).join('\n    ')}`;
  const list = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: RECIPES.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + url(r) })) };
  return page({
    title: 'Middagsoppskrifter – enkle middager for hele uken | Tilbudsmiddag',
    description: 'Middagsoppskrifter for hele uken med ingredienser som er på tilbud denne uken.',
    path: '/oppskrifter/',
    body,
    head: jsonLd(list) + jsonLd(crumbLd(trail)),
  });
}

function homeList() {
  return byCategory().map(([cat, list]) => `      <div class="rlist"><h3><a href="/oppskrifter/#${cat}">${esc(CATS[cat])}</a></h3><ul>${list.map((r) => `<li><a href="${url(r)}">${esc(r.name)}</a></li>`).join('')}</ul></div>`).join('\n');
}

// Sjekk at ingen to oppskrifter får samme adresse.
const slugs = RECIPES.map((r) => slugify(r.name));
const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
if (dup) throw new Error(`To oppskrifter får samme adresse: ${dup}`);

await rm(new URL('oppskrift/', ROOT), { recursive: true, force: true });
for (const r of RECIPES) {
  const dir = new URL(`oppskrift/${slugify(r.name)}/`, ROOT);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), recipePage(r));
}
await mkdir(new URL('oppskrifter/', ROOT), { recursive: true });
await writeFile(new URL('oppskrifter/index.html', ROOT), overviewPage());

const indexUrl = new URL('index.html', ROOT);
const index = await readFile(indexUrl, 'utf8');
const marked = index.replace(/<!-- RECIPES:START -->[\s\S]*<!-- RECIPES:END -->/, `<!-- RECIPES:START -->\n      <div class="rlists">\n${homeList()}\n      </div>\n<!-- RECIPES:END -->`);
if (marked === index && !index.includes('<!-- RECIPES:START -->')) throw new Error('Fant ikke RECIPES-markørene i index.html');
await writeFile(indexUrl, marked);

// Liste over bildene som finnes, så appen ikke ber om bilder som mangler.
await writeFile(new URL('assets/images.js', ROOT), `// Laget av scripts/build-pages.mjs. Ikke rediger.
export const IMAGES = new Map(${JSON.stringify(RECIPES.filter(img).map((r) => [slugify(r.name), creditText(slugify(r.name))]))});
`);

// Side med kreditering av alle bilder.
await mkdir(new URL('bildekreditering/', ROOT), { recursive: true });
await writeFile(
  new URL('bildekreditering/index.html', ROOT),
  page({
    title: 'Bildekreditering | Tilbudsmiddag',
    description: 'Fotografer og lisenser for bildene på tilbudsmiddag.no.',
    path: '/bildekreditering/',
    body: `${crumbs([['Forside', '/'], ['Bildekreditering']])}
    <section class="intro"><h1>Bildekreditering</h1><p class="lead">Bildene fra Pexels er illustrasjonsfoto og viser ikke nødvendigvis akkurat vår oppskrift. KI-genererte bilder er laget med Qwen-Image. Takk til fotografene.</p></section>
    <ul class="credits">${RECIPES.filter(img).map((r) => `<li><a href="${url(r)}">${esc(r.name)}</a> – ${creditHtml(slugify(r.name)) || 'Tilbudsmiddag'}</li>`).join('')}</ul>`,
  }),
);

// ---------- Temasider ----------
const TOPICS = [
  { slug: 'rask-middag', name: 'Rask middag', h1: 'Rask middag på 25 minutter', title: 'Rask middag – enkle middager på 25 minutter', desc: 'Raske middager som er klare på 25 minutter eller mindre. Med oppskrift og hvor ingrediensene er på tilbud denne uken.', intro: 'Middager som er på bordet på 25 minutter eller mindre. Perfekt for travle hverdager.', filter: (r) => r.time <= 25 },
  { slug: 'barnevennlig-middag', name: 'Barnevennlig middag', h1: 'Barnevennlig middag', title: 'Barnevennlig middag – middager hele familien liker', desc: 'Barnevennlige middager som hele familien liker. Enkle oppskrifter med ingredienser på tilbud denne uken.', intro: 'Trygge favoritter som barn liker, fra taco og pizza til fiskekaker og kjøttboller.', filter: (r) => r.tags.includes('barn') },
  { slug: 'vegetarmiddag', name: 'Vegetarmiddag', h1: 'Vegetarmiddag', title: 'Vegetarmiddag – enkle vegetaroppskrifter', desc: 'Enkle vegetarmiddager med bønner, linser, egg og grønnsaker. Se hvor ingrediensene er billigst denne uken.', intro: 'Middager uten kjøtt og fisk. Mettende, rimelige og raske å lage.', filter: (r) => r.cat === 'vegetar' },
  { slug: 'fiskemiddag', name: 'Fiskemiddag', h1: 'Fiskemiddag', title: 'Fiskemiddag – oppskrifter med laks, torsk og sei', desc: 'Fiskemiddager med laks, torsk, sei, ørret og reker. Oppskrifter og ukens tilbud på fisk.', intro: 'Laks, torsk, sei, ørret og sjømat. Fisk er ofte på tilbud, og passer godt to dager i uken.', filter: (r) => r.cat === 'fisk' },
  { slug: 'kyllingmiddag', name: 'Kyllingmiddag', h1: 'Kyllingmiddag', title: 'Kyllingmiddag – enkle oppskrifter med kylling', desc: 'Enkle middager med kyllingfilet, lårfilet og hel kylling. Oppskrifter og ukens tilbud på kylling.', intro: 'Kylling er en av varene som oftest er på tilbud. Her er middagene som passer.', filter: (r) => r.cat === 'kylling' },
  { slug: 'fredagsmiddag', name: 'Fredagsmiddag', h1: 'Fredagsmiddag og fredagskos', title: 'Fredagsmiddag – taco, pizza og burger', desc: 'Fredagsmiddag med taco, pizza, burger og annen kosemat. Oppskrifter og ukens tilbud på ingrediensene.', intro: 'Taco, hjemmelaget pizza, burgere og annen kosemat til fredagen.', filter: (r) => r.tags.includes('fredag') },
];
const topicChips = `<nav class="chips topic-chips" aria-label="Temaer">${[['middagstilbud', 'Middagstilbud'], ['billig-middag', 'Billig middag'], ['middagstips', 'Middagstips'], ...TOPICS.map((t) => [t.slug, t.name])].map(([s, n]) => `<a class="chip" href="/${s}/">${esc(n)}</a>`).join('')}</nav>`;
const weekNote = ACTIVE.length ? `Tilbudene gjelder uke ${WEEK_NO}, hentet fra tilbudsavisene til ${new Set(ACTIVE.map((o) => o.chain)).size} dagligvarekjeder.` : 'Ukens tilbud er ikke klare ennå. Oppskriftene vises likevel.';

async function writePage(path, html) {
  await mkdir(new URL(`.${path}`, ROOT), { recursive: true });
  await writeFile(new URL(`.${path}index.html`, ROOT), html);
}
function listPage({ path, name, title, desc, body, list }) {
  const trail = [['Forside', '/'], [name]];
  const ld = list?.length ? jsonLd({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: list.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + url(r) })) }) : '';
  return page({ title: `${title} | Tilbudsmiddag`, description: desc, path, body: `${crumbs(trail)}\n${body}`, head: ld + jsonLd(crumbLd(trail)) });
}

for (const t of TOPICS) {
  const list = RECIPES.filter(t.filter).sort((a, b) => (mainDeal(a) ? 0 : 1) - (mainDeal(b) ? 0 : 1) || a.name.localeCompare(b.name, 'nb'));
  const onDeal = list.filter(mainDeal).length;
  await writePage(`/${t.slug}/`, listPage({
    path: `/${t.slug}/`, name: t.name, title: t.title, desc: t.desc, list,
    body: `    <section class="intro"><h1>${esc(t.h1)}</h1><p class="lead">${esc(t.intro)} ${list.length} oppskrifter, ${onDeal} av dem med hovedråvaren på tilbud denne uken.</p>${topicChips}</section>
    <section class="rsection"><div class="rcards">${list.map(dealCard).join('')}</div><p class="muted fine-note">${esc(weekNote)}</p></section>`,
  }));
}

// /middagstilbud/: ukens middagsvarer på tilbud.
{
  const keys = Object.keys(INGREDIENTS).filter((k) => INGREDIENTS[k].w >= 2 && offersFor(k).length).sort((a, b) => INGREDIENTS[a].name.localeCompare(INGREDIENTS[b].name, 'nb'));
  const sections = keys.map((k) => {
    const offers = [...new Map(offersFor(k).map((o) => [o.chain, o])).values()].slice(0, 4);
    const recipes = RECIPES.filter((r) => r.ing.some(([key]) => key === k));
    return `<section class="deal-block"><h2>${esc(INGREDIENTS[k].name)} på tilbud</h2>
      <ul class="deal-list">${offers.map((o) => `<li><b>${priceLabel(o)}</b> hos ${esc(o.chain)} <span class="muted">– ${esc(o.heading.charAt(0) + o.heading.slice(1).toLowerCase())}${o.prePrice && o.prePrice > o.price ? `, før ${kr(o.prePrice)}` : ''}</span></li>`).join('')}</ul>
      ${recipes.length ? `<p class="deal-recipes">Middager med ${esc(INGREDIENTS[k].name.toLowerCase())}: ${recipes.map((r) => `<a href="${url(r)}">${esc(r.name)}</a>`).join(', ')}</p>` : ''}</section>`;
  }).join('\n    ');
  await writePage('/middagstilbud/', listPage({
    path: '/middagstilbud/', name: 'Middagstilbud', title: `Middagstilbud uke ${WEEK_NO} – ukens beste tilbud til middag`,
    desc: 'Ukens middagstilbud: kjøtt, kylling, fisk og andre middagsvarer på tilbud hos REMA 1000, KIWI, Extra, Coop, MENY, SPAR, Joker og Bunnpris, med oppskrifter.',
    body: `    <section class="intro"><h1>Middagstilbud denne uken</h1><p class="lead">Her er ukens tilbud på middagsvarer, samlet fra tilbudsavisene. Under hver vare finner du middager du kan lage med den. ${esc(weekNote)}</p>${topicChips}</section>
    ${sections || '<p class="lead">Ukens tilbud er ikke klare ennå. Se <a href="/oppskrifter/">alle oppskriftene</a>.</p>'}
    <p><a class="btn" href="/#ukemeny">Se hele ukemenyen →</a></p>`,
  }));
}

// /billig-middag/: middager der hovedråvaren er billigst på tilbud.
{
  const list = RECIPES.filter(mainDeal).sort((a, b) => byKgPrice(mainDeal(a).offer, mainDeal(b).offer)).slice(0, 18);
  await writePage('/billig-middag/', listPage({
    path: '/billig-middag/', name: 'Billig middag', title: `Billig middag – ukens billigste middager (uke ${WEEK_NO})`,
    desc: 'Billig middag denne uken: middager der hovedråvaren er på tilbud. Enkle oppskrifter og handleliste som viser hvor varene er billigst.',
    list,
    body: `    <section class="intro"><h1>Billig middag denne uken</h1><p class="lead">Middagene der kjøttet, fisken eller hovedråvaren er billigst på tilbud akkurat nå. Rangert etter kiloprisen på hovedråvaren. ${esc(weekNote)}</p>${topicChips}</section>
    <section class="rsection"><div class="rcards">${list.map(dealCard).join('') || '<p>Ukens tilbud er ikke klare ennå.</p>'}</div></section>
    <section class="tips"><h2>Slik lager du billig middag</h2><ul>
      <li><b>Planlegg ut fra tilbudene.</b> Velg middager der kjøttet eller fisken er på tilbud. Det er den dyreste delen av middagen.</li>
      <li><b>Kjøp storpakning og frys.</b> Kjøttdeig og kyllingfilet i storpakning er ofte billigst per kilo. Del opp og frys det du ikke bruker.</li>
      <li><b>Bruk bønner og linser.</b> Bytt ut halvparten av kjøttdeigen med bønner eller linser i taco, chili og gryter.</li>
      <li><b>Lag dobbel porsjon.</b> Gryter, supper og lasagne blir gode rester til lunsj eller en ekstra middag.</li>
      <li><b>Sammenlign kilopris.</b> En større pakke kan være billigere enn tilbudet på den lille. Handlelisten vår regner ut dette for deg.</li>
    </ul></section>`,
  }));
}

// /middagstips/: ett middagsforslag per dag, valgt ut fra ukens tilbud.
{
  const days = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
  const pool = [...RECIPES].sort((a, b) => (mainDeal(a) ? 0 : 1) - (mainDeal(b) ? 0 : 1));
  const used = new Set();
  const pick = (test) => {
    const r = pool.find((x) => !used.has(x.id) && test(x)) || pool.find((x) => !used.has(x.id));
    used.add(r.id);
    return r;
  };
  const week = days.map((d, i) => [d, pick((r) => (i === 4 || i === 5 ? r.tags.includes('fredag') : i === 6 ? r.tags.includes('helg') : r.time <= 35 && !r.tags.includes('fredag')))]);
  await writePage('/middagstips/', listPage({
    path: '/middagstips/', name: 'Middagstips', title: `Middagstips for hele uken – uke ${WEEK_NO}`,
    desc: 'Middagstips for hele uken: forslag til middag hver dag, raske hverdagsmiddager, barnevennlige retter og ukens middagstilbud.',
    list: week.map(([, r]) => r),
    body: `    <section class="intro"><h1>Middagstips for hele uken</h1><p class="lead">Vet du ikke hva du skal ha til middag? Her er ett forslag for hver dag denne uken, valgt ut fra ukens tilbud. Vil du ha flere forslag og handleliste, se <a href="/#ukemeny">ukemenyen</a>.</p>${topicChips}</section>
    <section class="week-tips">${week.map(([d, r]) => `<div class="week-tip"><h2>${d}</h2>${dealCard(r)}</div>`).join('')}</section>
    <section class="tips"><h2>Flere middagstips</h2><ul>
      <li><a href="/rask-middag/">Rask middag</a> – middager på 25 minutter eller mindre.</li>
      <li><a href="/barnevennlig-middag/">Barnevennlig middag</a> – favoritter hele familien liker.</li>
      <li><a href="/billig-middag/">Billig middag</a> – ukens billigste middager.</li>
      <li><a href="/middagstilbud/">Middagstilbud</a> – kjøtt, fisk og kylling på tilbud denne uken.</li>
      <li><a href="/fredagsmiddag/">Fredagsmiddag</a> – taco, pizza og burger.</li>
      <li><a href="/vegetarmiddag/">Vegetarmiddag</a>, <a href="/fiskemiddag/">fiskemiddag</a> og <a href="/kyllingmiddag/">kyllingmiddag</a>.</li>
    </ul></section>`,
  }));
}

const urls = ['/', '/oppskrifter/', '/middagstilbud/', '/billig-middag/', '/middagstips/', ...TOPICS.map((t) => `/${t.slug}/`), ...RECIPES.map(url)];
await writeFile(
  new URL('sitemap.xml', ROOT),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod>${u === '/' ? '<changefreq>daily</changefreq>' : ''}</url>`).join('\n')}\n</urlset>\n`,
);
await writeFile(new URL('robots.txt', ROOT), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await writeFile(
  new URL('404.html', ROOT),
  page({
    title: 'Fant ikke siden | Tilbudsmiddag',
    description: 'Siden finnes ikke.',
    path: '/404',
    noindex: true,
    body: `    <section class="intro"><h1>Fant ikke siden</h1><p class="lead">Siden finnes ikke, eller den er flyttet.</p><p><a class="btn" href="/">Til ukens middager</a> <a class="btn btn-ghost" href="/oppskrifter/">Alle oppskrifter</a></p></section>`,
  }),
);
console.log(`${RECIPES.length} oppskriftssider, ${TOPICS.length + 3} temasider (${ACTIVE.length} aktive tilbud, uke ${WEEK_NO}), sitemap (${urls.length} adresser), robots.txt og 404.html`);
