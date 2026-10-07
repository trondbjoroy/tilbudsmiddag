import { INGREDIENTS } from './ingredients.js';
import { RECIPES } from './recipes.js';

const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const DAY_MS = 864e5;
const CATS = { kylling: 'Kylling', storfe: 'Storfe', svin: 'Svin', lam: 'Lam', fisk: 'Fisk', vegetar: 'Vegetar' };
const DIETS = { glutenfri: 'Uten gluten', laktosefri: 'Uten laktose', barn: 'Barnevennlig' };
const TIMES = [[0, 'Alle'], [20, '20 min'], [30, '30 min'], [45, '45 min']];
const DEFAULTS = { week: 0, chains: [], cats: [], diets: [], maxTime: 0, portions: 4, perDay: 2, q: '' };

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const kr = (n) => (n % 1 ? n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n.toLocaleString('nb-NO')) + ' kr';
const shortDate = (d) => new Date(d).toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' });

let DATA;
let WEEKS = [];
let state = loadState();
let plan = [];

// ---------- Tilstand ----------
function loadState() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('tm-state') || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}
function saveState() {
  try {
    localStorage.setItem('tm-state', JSON.stringify(state));
  } catch {}
}

// ---------- Uker ----------
function mondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil(((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / DAY_MS + 1) / 7);
}
function buildWeeks() {
  const now = Date.now();
  const start = mondayOf(new Date()).getTime();
  const weeks = [0, 1].map((i) => {
    const s = start + i * 7 * DAY_MS;
    return { start: s, end: s + 7 * DAY_MS, from: Math.max(s, now), no: isoWeek(new Date(s)) };
  });
  weeks.forEach((w) => (w.count = DATA.offers.filter((o) => validIn(o, w)).length));
  // Neste uke vises bare når kjedene har publisert avisene sine.
  return weeks.filter((w, i) => i === 0 || w.count >= 50);
}
const validIn = (o, w) => Date.parse(o.from) < w.end && Date.parse(o.till) > w.from;

// ---------- Tilbud og priser ----------
// Pakkestørrelse i kg eller liter. null når avisen ikke oppgir vekt eller volum.
function packSize(o) {
  const f = { g: 1000, ml: 1000, kg: 1, l: 1 }[o.unit];
  return f && o.size ? o.size / f : null;
}
// Løsvekt: prisen gjelder per kilo, ikke per pakke.
const isPerKg = (o) => o.unit === 'kg' && o.size === 1 && !/(^|[^\d,])1 ?kg/i.test(o.description);

// Mengden oppskriften trenger, i kg eller liter. null for stk, boks osv.
function needAmount(it) {
  if (it.qty == null) return null;
  const f = { g: 0.001, kg: 1, dl: 0.1, l: 1 }[it.unit];
  return f ? it.qty * f * (state.portions / 4) : null;
}

// Hva du betaler for mengden i oppskriften med dette tilbudet.
function estimate(o, need) {
  const pre = o.prePrice && o.prePrice > o.price ? o.prePrice : null;
  if (isPerKg(o)) {
    const kg = need ?? 1;
    return { cost: o.price * kg, saved: pre ? (pre - o.price) * kg : 0, packs: 0, kg };
  }
  const size = packSize(o);
  const packs = need && size ? Math.max(1, Math.ceil(need / size - 0.1)) : 1;
  return { cost: o.price * packs, saved: pre ? (pre - o.price) * packs : 0, packs };
}

function activeOffers() {
  const w = WEEKS[state.week] || WEEKS[0];
  return DATA.offers.filter((o) => validIn(o, w) && (!state.chains.length || state.chains.includes(o.chain)));
}

function buildMatcher(offers) {
  const cache = {};
  return (key) => {
    if (key in cache) return cache[key];
    const def = INGREDIENTS[key];
    if (def.pantry || !def.match) return (cache[key] = []);
    return (cache[key] = offers.filter((o) => def.match.test(o.heading) && !(def.not && def.not.test(o.heading)) && !(def.and && !def.and.test(o.heading))));
  };
}

function staplePrice(def) {
  if (!def.staple || !DATA.enhver) return null;
  const s = DATA.enhver.staples.find((x) => x.title === def.staple);
  if (!s) return null;
  const prices = s.prices.filter((p) => !state.chains.length || state.chains.includes(p.chain));
  return prices.length ? { title: s.title, ...prices[0], all: prices } : null;
}

function evaluate(recipe, match) {
  const items = recipe.ing.map(([key, qty, unit, note]) => {
    const def = INGREDIENTS[key];
    const it = { key, def, qty, unit, note };
    const need = needAmount(it);
    // Billigst for mengden i oppskriften kommer først.
    // Tilbud uten vekt kan ikke sammenlignes når oppskriften oppgir vekt. De kommer sist.
    const unknown = (o) => (need && !isPerKg(o) && !packSize(o) ? 1 : 0);
    it.offers = match(key).map((o) => ({ ...o, est: estimate(o, need) })).sort((a, b) => unknown(a) - unknown(b) || a.est.cost - b.est.cost);
    it.best = it.offers[0] || null;
    it.staple = it.best ? null : staplePrice(def);
    return it;
  });
  let score = 0, cost = 0, saved = 0, onOffer = 0, mainOnOffer = false;
  for (const it of items) {
    if (it.def.pantry) continue;
    if (it.best) {
      const pre = it.best.prePrice;
      const discount = pre && pre > it.best.price ? Math.min(0.6, (pre - it.best.price) / pre) : 0.1;
      score += it.def.w * (1 + discount);
      cost += it.best.est.cost;
      saved += it.best.est.saved;
      onOffer++;
      if (it.def.w >= 2) mainOnOffer = true;
    } else if (it.staple) {
      cost += it.staple.price;
    }
  }
  if (!mainOnOffer) score *= 0.4; // Middager der hovedråvaren er på tilbud kommer først.
  const need = items.filter((i) => !i.def.pantry).length;
  return { recipe, items, score, cost, saved, onOffer, need };
}

// ---------- Filtrering og ukeplan ----------
function passesFilters(r) {
  if (state.cats.length && !state.cats.includes(r.cat)) return false;
  if (state.maxTime && r.time > state.maxTime) return false;
  if (state.diets.some((d) => !r.tags.includes(d))) return false;
  if (state.q) {
    const q = state.q.toLowerCase();
    const text = (r.name + ' ' + r.ing.map(([k]) => INGREDIENTS[k].name).join(' ')).toLowerCase();
    if (!text.includes(q)) return false;
  }
  return true;
}

function dayBonus(r, d) {
  let b = 0;
  const weekend = d >= 4;
  if (r.tags.includes('fredag')) b += d === 4 || d === 5 ? 4 : -4;
  if (r.tags.includes('helg')) b += d >= 5 ? 3 : -4;
  if (!weekend && r.time <= 30) b += 1;
  return b;
}

function makePlan() {
  const match = buildMatcher(activeOffers());
  const pool = RECIPES.filter(passesFilters).map((r) => evaluate(r, match)).sort((a, b) => b.score - a.score);
  const days = DAYS.map(() => []);
  const used = new Set();
  let repeats = 0;
  for (let row = 0; row < state.perDay; row++) {
    for (let d = 0; d < 7; d++) {
      const prev = days[d - 1]?.[row]?.recipe.cat;
      const sameDay = days[d].map((e) => e.recipe.cat);
      const candidates = pool.filter((e) => !used.has(e.recipe.id)).sort((a, b) => b.score + dayBonus(b.recipe, d) - (a.score + dayBonus(a.recipe, d)));
      let pick = candidates.find((e) => e.recipe.cat !== prev && !sameDay.includes(e.recipe.cat)) || candidates.find((e) => !sameDay.includes(e.recipe.cat)) || candidates[0];
      // Hver dag skal ha minst én middag. Er oppskriftene brukt opp, gjentar vi en.
      if (!pick && row === 0 && pool.length) {
        const prevId = days[d - 1]?.[0]?.recipe.id;
        const next = pool[repeats++ % pool.length];
        pick = { ...(next.recipe.id === prevId && pool.length > 1 ? pool[repeats++ % pool.length] : next), repeat: true };
      }
      if (pick) {
        days[d].push(pick);
        used.add(pick.recipe.id);
      }
    }
  }
  return days;
}

// ---------- Mengder ----------
function fmtQty(qty, unit) {
  if (qty == null) return 'etter smak';
  let n = qty * (state.portions / 4);
  if (unit === 'g') n = n >= 100 ? Math.round(n / 50) * 50 : Math.round(n / 5) * 5;
  else if (['stk', 'fedd', 'boks', 'bokser', 'glass', 'pose', 'pk', 'beger', 'plater', 'skiver', 'terning', 'terninger'].includes(unit)) n = Math.max(1, Math.round(n * 2) / 2);
  else n = Math.round(n * 10) / 10;
  const num = n.toLocaleString('nb-NO');
  return unit ? `${num} ${unit}` : num;
}

// ---------- Visning ----------
function chainBadge(chain) {
  return `<span class="chain" data-chain="${esc(chain)}">${esc(chain)}</span>`;
}

function renderControls() {
  const chains = [...new Set(DATA.catalogs.map((c) => c.chain))].sort((a, b) => a.localeCompare(b, 'nb'));
  const chip = (group, value, label, on) => `<button type="button" class="chip" aria-pressed="${on}" data-group="${group}" data-value="${esc(value)}">${esc(label)}</button>`;

  $('#weeks').innerHTML = WEEKS.map((w, i) => `<button type="button" class="seg" aria-pressed="${state.week === i}" data-week="${i}">${i ? 'Neste uke' : 'Denne uken'} <small>uke ${w.no}</small></button>`).join('');
  $('#f-chains').innerHTML = chip('chains', '', 'Alle', !state.chains.length) + chains.map((c) => chip('chains', c, c, state.chains.includes(c))).join('');
  $('#f-cats').innerHTML = chip('cats', '', 'Alle', !state.cats.length) + Object.entries(CATS).map(([k, v]) => chip('cats', k, v, state.cats.includes(k))).join('');
  $('#f-diets').innerHTML = Object.entries(DIETS).map(([k, v]) => chip('diets', k, v, state.diets.includes(k))).join('');
  $('#f-time').innerHTML = TIMES.map(([v, l]) => chip('maxTime', v, l, state.maxTime === v)).join('');
  $('#f-perday').innerHTML = [1, 2, 3].map((v) => chip('perDay', v, String(v), state.perDay === v)).join('');
  $('#f-portions').textContent = state.portions;
  $('#f-q').value = state.q;
  const active = state.chains.length + state.cats.length + state.diets.length + (state.maxTime ? 1 : 0) + (state.q ? 1 : 0);
  $('#filter-count').textContent = active ? `(${active})` : '';
}

function cardHtml(e, d, i) {
  const r = e.recipe;
  const highlights = e.items.filter((it) => it.best && it.def.w >= 1).slice(0, 2);
  return `<article class="card" data-cat="${r.cat}">
    <button type="button" class="card-hit" data-open="${d}:${i}" aria-label="Åpne ${esc(r.name)}"></button>
    <div class="card-top"><span class="cat">${CATS[r.cat]}</span><span class="time">${r.time} min</span></div>
    <h3>${esc(r.name)}</h3>${e.repeat ? '<p class="repeat">Gjentas – få retter passer filtrene</p>' : ''}
    <ul class="deals">${highlights.map((it) => `<li><span>${esc(it.def.name)}</span> <b>${priceLabel(it.best)}</b> ${chainBadge(it.best.chain)}</li>`).join('') || '<li class="muted">Ingen hovedråvare på tilbud</li>'}</ul>
    <div class="card-foot">
      <span class="pill">${e.onOffer} av ${e.need} varer på tilbud</span>
      ${e.saved >= 5 ? `<span class="save">Spar ca. ${kr(Math.round(e.saved))}</span>` : ''}
    </div>
    <span class="card-cta">Oppskrift og handleliste →</span>
  </article>`;
}

function renderPlan() {
  plan = makePlan();
  const w = WEEKS[state.week] || WEEKS[0];
  const today = mondayOf(new Date()).getTime() === w.start ? (new Date().getDay() + 6) % 7 : -1;
  const empty = plan.every((d) => !d.length);
  const chainCount = state.chains.length || new Set(DATA.catalogs.map((c) => c.chain)).size;
  $('#summary').innerHTML = `Uke ${w.no} · ${activeOffers().length} tilbud fra ${chainCount} ${chainCount === 1 ? 'kjede' : 'kjeder'}`;
  if (empty) {
    $('#plan').innerHTML = `<div class="empty"><h3>Ingen middager passer filtrene</h3><p>Prøv å fjerne et filter, eller velg flere butikker.</p><button type="button" class="btn" data-reset>Nullstill filtre</button></div>`;
    return;
  }
  $('#plan').innerHTML = plan.map((entries, d) => {
    const date = new Date(w.start + d * DAY_MS).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' });
    const ad = d === 2 ? adSlot('wide') : '';
    return `<section class="day${d === today ? ' today' : ''}" id="dag-${d}">
      <h2>${DAYS[d]} <span>${date}${d === today ? ' · i dag' : ''}</span></h2>
      <div class="cards">${entries.map((e, i) => cardHtml(e, d, i)).join('')}</div>
    </section>${ad}`;
  }).join('');
}

function adSlot(kind) {
  return `<aside class="ad ad-${kind}" aria-label="Annonseplass">
    <span class="ad-label">Annonse</span>
    <p><strong>Din annonse her?</strong> Nå folk som planlegger ukens middager og handel.</p>
    <a class="btn btn-small" href="annonser.html">Annonser hos oss</a>
  </aside>`;
}

function renderFlyers() {
  const e = DATA.enhver;
  const chains = [...new Set(DATA.catalogs.map((c) => c.chain))];
  const link = (chain) => e?.flyers.find((f) => f.chain.toLowerCase() === chain.toLowerCase() || (chain === 'Extra' && f.chain === 'Coop Extra') || (chain === 'Obs' && f.chain === 'Coop Obs'))?.url || `https://etilbudsavis.no/${encodeURIComponent(chain.replace(/\s+/g, '-'))}`;
  $('#flyers').innerHTML = chains.sort((a, b) => a.localeCompare(b, 'nb')).map((c) => {
    const cats = DATA.catalogs.filter((x) => x.chain === c);
    const n = cats.reduce((s, x) => s + x.offers, 0);
    const till = Math.max(...cats.map((x) => Date.parse(x.till)));
    return `<a class="flyer" href="${esc(link(c))}" target="_blank" rel="noopener">${chainBadge(c)}<span>${n} tilbud</span><small>til ${shortDate(till)}</small></a>`;
  }).join('');
  // Bare de to første setningene. Resten forklarer metoden til enhver.no og forvirrer her.
  const summary = e?.summary?.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
  if (summary) $('#enhver-summary').innerHTML = `<p>${esc(summary)}</p><p class="muted">Kilde: <a href="https://enhver.no/" target="_blank" rel="noopener">enhver.no</a>, uke ${esc(e.week)}</p>`;
}

// ---------- Oppskrift og handleliste ----------
function shoppingGroups(e) {
  const byChain = new Map();
  const notOnOffer = [];
  const pantry = [];
  for (const it of e.items) {
    if (it.def.pantry) pantry.push(it);
    else if (it.best) {
      if (!byChain.has(it.best.chain)) byChain.set(it.best.chain, []);
      byChain.get(it.best.chain).push(it);
    } else notOnOffer.push(it);
  }
  return { byChain: [...byChain.entries()].sort((a, b) => b[1].length - a[1].length), notOnOffer, pantry };
}

function oneStoreTable(e) {
  const rows = new Map();
  for (const it of e.items) {
    if (it.def.pantry) continue;
    const seen = new Set();
    for (const o of it.offers) {
      if (seen.has(o.chain)) continue;
      seen.add(o.chain);
      const r = rows.get(o.chain) || { n: 0, sum: 0 };
      r.n++;
      r.sum += o.est.cost;
      rows.set(o.chain, r);
    }
  }
  return [...rows.entries()].sort((a, b) => b[1].n - a[1].n || a[1].sum - b[1].sum).slice(0, 5);
}

const priceLabel = (o) => kr(o.price) + (isPerKg(o) ? '/kg' : '');
function estText(o) {
  if (o.est.packs > 1) return ` × ${o.est.packs} = ${kr(Math.round(o.est.cost))}`;
  if (!o.est.packs && o.est.kg !== 1) return ` ≈ ${kr(Math.round(o.est.cost))} for ${Math.round(o.est.kg * 1000).toLocaleString("nb-NO")} g`;
  return '';
}
function offerLine(o) {
  const pre = o.prePrice && o.prePrice > o.price ? ` <s>${priceLabel({ ...o, price: o.prePrice })}</s>` : '';
  return `<b>${priceLabel(o)}</b>${pre}${estText(o)} <span class="muted">· ${esc(o.heading)}${o.description ? ' – ' + esc(o.description) : ''} · t.o.m. ${shortDate(o.till)}</span>`;
}

function openRecipe(d, i) {
  const e = plan[d]?.[i];
  if (!e) return;
  const r = e.recipe;
  const g = shoppingGroups(e);
  const item = (it, body) => `<li><label><input type="checkbox"><span class="item-name">${esc(it.def.name)}</span> <span class="qty">${fmtQty(it.qty, it.unit)}${it.note ? ', ' + esc(it.note) : ''}</span></label>${body ? `<div class="item-offer">${body}</div>` : ''}</li>`;
  const others = (it) => {
    const alt = [...new Map(it.offers.slice(1).filter((o) => o.chain !== it.best.chain).map((o) => [o.chain, o])).values()].slice(0, 3);
    return alt.length ? `<div class="alt">Også på tilbud: ${alt.map((o) => `${esc(o.chain)} ${priceLabel(o)}`).join(' · ')}</div>` : '';
  };
  const stores = oneStoreTable(e);

  $('#dlg-body').innerHTML = `
    <header class="dlg-head" data-cat="${r.cat}">
      <div class="card-top"><span class="cat">${CATS[r.cat]}</span><span class="time">${r.time} min</span>${r.tags.filter((t) => DIETS[t]).map((t) => `<span class="tag">${DIETS[t]}</span>`).join('')}</div>
      <h2 id="dlg-title">${esc(r.name)}</h2>
      <p class="muted">${DAYS[d]} · ${e.onOffer} av ${e.need} varer på tilbud${e.cost ? ` · handleliste ca. ${kr(Math.round(e.cost))}` : ''}${e.saved >= 5 ? ` · spar ca. ${kr(Math.round(e.saved))}` : ''}</p>
      <div class="portions">Porsjoner <button type="button" class="step" data-portions="-1" aria-label="Færre porsjoner">−</button><b>${state.portions}</b><button type="button" class="step" data-portions="1" aria-label="Flere porsjoner">+</button></div>
    </header>
    <div class="dlg-grid">
      <section class="shop">
        <h3>Handleliste</h3>
        ${g.byChain.map(([chain, items]) => `<div class="store">
          <h4>${chainBadge(chain)} <span class="muted">${items.length} ${items.length === 1 ? 'vare' : 'varer'} · ca. ${kr(Math.round(items.reduce((s, it) => s + it.best.est.cost, 0)))}</span></h4>
          <ul>${items.map((it) => item(it, offerLine(it.best) + others(it))).join('')}</ul></div>`).join('')}
        ${g.notOnOffer.length ? `<div class="store"><h4>Ikke på tilbud denne uken</h4><ul>${g.notOnOffer.map((it) => item(it, it.staple ? `Billigst hos ${chainBadge(it.staple.chain)} ca. ${kr(it.staple.price)} <span class="muted">(${esc(it.staple.title)}, enhver.no)</span>` : '')).join('')}</ul></div>` : ''}
        ${g.pantry.length ? `<div class="store pantry"><h4>Har du sikkert hjemme</h4><p>${g.pantry.map((it) => esc(it.def.name.toLowerCase())).join(', ')}</p></div>` : ''}
        ${stores.length > 1 ? `<div class="onestore"><h4>Vil du handle alt i én butikk?</h4><table>${stores.map(([c, v]) => `<tr><td>${chainBadge(c)}</td><td>${v.n} av ${e.need} varer på tilbud</td><td class="num">${kr(Math.round(v.sum))}</td></tr>`).join('')}</table></div>` : ''}
        <div class="actions"><button type="button" class="btn" data-copy>Kopier handleliste</button><button type="button" class="btn btn-ghost" data-print>Skriv ut</button></div>
        <p class="fine">Prisene er fra tilbudsavisene. Pakningsstørrelse og utvalg kan variere mellom butikker. Sjekk etiketten ved allergier.</p>
      </section>
      <section class="howto">
        <h3>Ingredienser</h3>
        <ul class="ing">${e.items.map((it) => `<li><span>${esc(it.def.name)}${it.note ? ` <span class="muted">(${esc(it.note)})</span>` : ''}</span><span class="qty">${fmtQty(it.qty, it.unit)}</span></li>`).join('')}</ul>
        <h3>Slik gjør du</h3>
        <ol class="steps">${r.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      </section>
    </div>`;
  $('#dlg').dataset.open = `${d}:${i}`;
  if (!$('#dlg').open) $('#dlg').showModal();
}

function shoppingText(e) {
  const g = shoppingGroups(e);
  const lines = [`Handleliste: ${e.recipe.name} (${state.portions} porsjoner)`, ''];
  for (const [chain, items] of g.byChain) {
    lines.push(chain.toUpperCase());
    items.forEach((it) => lines.push(`- ${it.def.name}, ${fmtQty(it.qty, it.unit)}: ${priceLabel(it.best)}${estText(it.best)} (${it.best.heading})`));
    lines.push('');
  }
  if (g.notOnOffer.length) {
    lines.push('IKKE PÅ TILBUD');
    g.notOnOffer.forEach((it) => lines.push(`- ${it.def.name}, ${fmtQty(it.qty, it.unit)}${it.staple ? ` (billigst hos ${it.staple.chain})` : ''}`));
    lines.push('');
  }
  if (g.pantry.length) lines.push('Har du hjemme: ' + g.pantry.map((it) => it.def.name.toLowerCase()).join(', '));
  lines.push('', 'tilbudsmiddag.no');
  return lines.join('\n');
}

// ---------- Hendelser ----------
function update() {
  saveState();
  renderControls();
  renderPlan();
}

function onClick(ev) {
  const t = ev.target.closest('button, [data-open]');
  if (!t) return;
  if (t.dataset.week) {
    state.week = Number(t.dataset.week);
    update();
  } else if (t.dataset.group) {
    const { group, value } = t.dataset;
    if (group === 'maxTime' || group === 'perDay') state[group] = Number(value);
    else if (!value) state[group] = [];
    else state[group] = state[group].includes(value) ? state[group].filter((v) => v !== value) : [...state[group], value];
    update();
  } else if (t.dataset.portions) {
    state.portions = Math.min(12, Math.max(1, state.portions + Number(t.dataset.portions)));
    update();
    const open = $('#dlg').dataset.open;
    if ($('#dlg').open && open) openRecipe(...open.split(':').map(Number));
  } else if (t.dataset.open) {
    openRecipe(...t.dataset.open.split(':').map(Number));
  } else if ('reset' in t.dataset) {
    state = { ...DEFAULTS, week: state.week, portions: state.portions, perDay: state.perDay };
    update();
  } else if ('copy' in t.dataset) {
    const [d, i] = $('#dlg').dataset.open.split(':').map(Number);
    navigator.clipboard.writeText(shoppingText(plan[d][i])).then(() => {
      t.textContent = 'Kopiert!';
      setTimeout(() => (t.textContent = 'Kopier handleliste'), 2000);
    });
  } else if ('print' in t.dataset) {
    window.print();
  } else if ('close' in t.dataset) {
    $('#dlg').close();
  }
}

async function init() {
  if (matchMedia('(max-width: 900px)').matches) $('.filters details').open = false;
  document.addEventListener('click', onClick);
  $('#f-q').addEventListener('input', (ev) => {
    state.q = ev.target.value.trim();
    update();
  });
  $('#dlg').addEventListener('click', (ev) => {
    if (ev.target === $('#dlg')) $('#dlg').close();
  });
  try {
    DATA = await (await fetch('data/offers.json', { cache: 'no-cache' })).json();
  } catch {
    $('#plan').innerHTML = '<div class="empty"><h3>Klarte ikke å hente ukens tilbud</h3><p>Prøv å laste siden på nytt.</p></div>';
    return;
  }
  WEEKS = buildWeeks();
  if (state.week >= WEEKS.length) state.week = 0;
  $('#updated').textContent = new Date(DATA.generatedAt).toLocaleString('nb-NO', { dateStyle: 'long', timeStyle: 'short' });
  renderFlyers();
  update();
}

init();
