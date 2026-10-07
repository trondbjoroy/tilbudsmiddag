# Laster ned godkjente bilder fra Pexels og Wikimedia Commons, beskjærer til 4:3
# (1024x768) og lagrer som WebP i assets/img/. Skriver kreditering til assets/img/credits.json.
# Kjør: python scripts/download-photos.py
import io, json, re, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / 'assets' / 'img'
UA = {'User-Agent': 'tilbudsmiddag.no/1.0'}

def slugify(s):
    s = s.lower().replace('æ', 'ae').replace('ø', 'o').replace('å', 'a').replace('&', ' og ')
    import unicodedata
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def recipes():
    text = (ROOT / 'assets' / 'recipes.js').read_text(encoding='utf8')
    return dict(re.findall(r"id: '([^']+)', name: '([^']+)'", text))

def save(url, dest):
    data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
    im = Image.open(io.BytesIO(data)).convert('RGB')
    w, h = im.size
    target = 4 / 3
    if w / h > target:
        nw = int(h * target); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im.resize((1024, 768), Image.LANCZOS).save(dest, 'WEBP', quality=80)

names = recipes()
credits_path = IMG / 'credits.json'
credits = json.loads(credits_path.read_text(encoding='utf8')) if credits_path.exists() else {}

# Bilder som allerede finnes uten kreditering er KI-genererte.
for f in IMG.glob('*.webp'):
    credits.setdefault(f.stem, {'kind': 'ai', 'text': 'KI-generert illustrasjon'})

picks = {}
for line in (ROOT / 'scripts' / 'photo-picks.txt').read_text(encoding='utf8').splitlines():
    if line and not line.startswith('#'):
        p = line.split('|'); picks[p[0]] = p
commons = json.loads((ROOT / 'scripts' / 'photo-commons.json').read_text(encoding='utf8'))
cands = json.loads((ROOT / 'scripts' / 'photo-candidates.json').read_text(encoding='utf8'))

done = 0
for rid, name in names.items():
    slug = slugify(name)
    dest = IMG / f'{slug}.webp'
    if dest.exists():
        continue
    c = None
    if rid in commons:
        c = next((x for x in cands.get(rid, {}).get('candidates', []) if x['title'] == commons[rid]['title']), None)
    if c:
        save(c['full'], dest)
        credits[slug] = {'kind': 'commons', 'author': c['author'], 'license': c['license'], 'licenseUrl': c['licenseUrl'], 'page': c['page']}
    elif rid in picks:
        p = picks[rid]
        save(f'https://images.pexels.com/photos/{p[1]}/pexels-photo-{p[1]}.jpeg?auto=compress&cs=tinysrgb&w=1400', dest)
        credits[slug] = {'kind': 'pexels', 'author': p[4], 'page': f'https://www.pexels.com/photo/{p[2]}-{p[1]}/'}
    else:
        continue
    done += 1
    print('ok', slug)

credits_path.write_text(json.dumps(dict(sorted(credits.items())), ensure_ascii=False, indent=1), encoding='utf8')
print(done, 'nye bilder,', len(list(IMG.glob('*.webp'))), 'totalt')
