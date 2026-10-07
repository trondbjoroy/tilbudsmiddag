# tilbudsmiddag.no

Middagsforslag for hver dag i uken, laget av ukens tilbud i dagligvarekjedene. Hver middag har oppskrift og handleliste med butikknavn.

## Slik virker det

- `scripts/update-data.mjs` henter alle tilbud fra tilbudsavisene (Tjek/eTilbudsavis) og skriver `data/offers.json`. Tjek-API-et krever avtale med Tjek. Den automatiske hentingen er slått av til avtalen er på plass.
- `assets/ingredients.js` kobler hver vare til tilbud med søkemønstre.
- `assets/recipes.js` har oppskriftene. Mengder gjelder 4 porsjoner.
- `assets/app.js` gir poeng til oppskriftene etter tilbudene og lager ukeplanen.
- `scripts/build-pages.mjs` lager en side per oppskrift (`/oppskrift/<navn>/`), oversikten `/oppskrifter/`, oppskriftslisten på forsiden, `sitemap.xml`, `robots.txt` og `404.html`. Kjør `npm run build-pages` etter endringer i oppskriftene.

GitHub Actions-jobben `update-data` kan kjøres for hånd. Den faste kjøringen kl. 06 og 18 er slått av til avtalen med Tjek er på plass.

## Lokalt

```bash
npm run update-data
npm run dev
```

## Legge til en oppskrift

Legg et nytt objekt i `assets/recipes.js`. Bruk varenøkler fra `assets/ingredients.js`. Mangler varen, legg den til der med et søkemønster. Kjør deretter `npm run build-pages`.
