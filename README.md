# tilbudsmiddag.no

Middagsforslag for hver dag i uken, laget av ukens tilbud i dagligvarekjedene. Hver middag har oppskrift og handleliste med butikknavn.

## Slik virker det

- `scripts/update-data.mjs` henter alle tilbud fra tilbudsavisene (Tjek/eTilbudsavis) og skriver `data/offers.json`. Tjek-API-et krever avtale med Tjek. Den automatiske hentingen er slått av til avtalen er på plass.
- `assets/ingredients.js` kobler hver vare til tilbud med søkemønstre.
- `assets/recipes.js` har oppskriftene. Mengder gjelder 4 porsjoner.
- `assets/app.js` gir poeng til oppskriftene etter tilbudene og lager ukeplanen.
- `api/contact.js` sender kontaktskjemaet på `annonser.html` som e-post via Resend.

GitHub Actions-jobben `update-data` kan kjøres for hånd. Den faste kjøringen kl. 06 og 18 er slått av til avtalen med Tjek er på plass.

## Lokalt

```bash
npm run update-data
DEV_FAKE_MAIL=1 npm run dev
```

`DEV_FAKE_MAIL=1` skriver e-posten til konsollen i stedet for å sende den.

## Miljøvariabler på Vercel

| Navn | Innhold |
| --- | --- |
| `RESEND_API_KEY` | API-nøkkel fra resend.com |
| `CONTACT_TO` | Adressen som skal motta henvendelser fra annonsører |
| `CONTACT_FROM` | Valgfri. Avsender, f.eks. `Tilbudsmiddag <post@tilbudsmiddag.no>` når domenet er verifisert i Resend |

Mottakeradressen skal bare ligge i `CONTACT_TO`, aldri i koden.

## Legge til en oppskrift

Legg et nytt objekt i `assets/recipes.js`. Bruk varenøkler fra `assets/ingredients.js`. Mangler varen, legg den til der med et søkemønster.
