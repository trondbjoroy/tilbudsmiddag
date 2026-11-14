---
name: Tilbudsmiddag
description: Ukens middager fra tilbudsavisene. Hyllekant – every price is a shelf-edge label.
colors:
  shelf-bg: "#eceeee"
  label-white: "#ffffff"
  shelf-2: "#e2e5e5"
  ink: "#111416"
  muted: "#545c60"
  line: "#d3d8d9"
  rail: "#262c2e"
  rail-ink: "#f4f6f6"
  signal-yellow: "#ffe14d"
  link: "#1d5fa8"
  save: "#1d7346"
  save-bg: "#dcefe3"
  cat-kylling: "#b57b0a"
  cat-storfe: "#a8432c"
  cat-svin: "#c04f68"
  cat-lam: "#7a5aa8"
  cat-fisk: "#2f6fb0"
  cat-vegetar: "#3a8547"
  dark-bg: "#121516"
  dark-surface: "#1c2123"
  dark-ink: "#eef1f1"
  dark-muted: "#9ea7aa"
  dark-rail: "#0b0d0e"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  heading:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 750
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  label: "3px"
  md: "6px"
  dialog: "8px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "28px"
components:
  price-label:
    backgroundColor: "{colors.label-white}"
    textColor: "{colors.ink}"
    typography: "{typography.price}"
    rounded: "{rounded.label}"
    padding: "1px 7px"
  price-label-offer:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.price}"
    rounded: "{rounded.label}"
    padding: "2px 9px"
  header-rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.rail-ink}"
    height: "60px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-white}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.ink}"
  card:
    backgroundColor: "{colors.label-white}"
    rounded: "{rounded.md}"
    padding: "16px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.shelf-bg}"
    rounded: "{rounded.label}"
---

# Tilbudsmiddag design system

## Overview

Hyllekant: the world of the Norwegian shelf-edge price label. Prices are the product, so they look like the labels people read in the aisle: a crisp rectangle with a 1.5px ink border and big condensed numerals. A dark shelf rail carries the header. The surface is an Operate screen: the visitor plans the week and finds the cheapest store, so standard controls and clear hierarchy come first. The world adds only type, palette, crisp shapes, and the price label.

## Colors

- Cool shelf grey ground (`shelf-bg`), label-white surfaces, ink-black text and actions.
- `signal-yellow` is reserved. It marks offer prices: the card's offer total, the cheapest result in the price search, deal notes on topic pages, text selection, and focus. Never use it as decoration or as a large background.
- Category colours (kylling, storfe, svin, lam, fisk, vegetar) are data: a small square plus the uppercase category name. Never as card borders.
- Chain colours stay as small squares next to chain names.
- Dark mode swaps to near-black shelf tones; the rail goes darker than the ground; yellow labels keep ink text.

## Typography

- Archivo (Google Fonts, variable width) for headings, the wordmark, and every price. Display and prices run at 75% width, headings at 80–85%, weight 750–800. Keep `word-spacing: 0.1em` on condensed headings so words do not run together.
- System sans for running text, labels, and controls.
- Prices use tabular numerals.

## Layout

- Max width 1240px, 16px side gutter.
- Homepage: filters in a sticky 280px column on desktop, collapsed above the plan below 900px.
- Day headings sit on a 2px ink rule, like a shelf edge.
- Process steps ("Slik finner vi …") are plain columns with a 2px top rule, not cards.

## Elevation & Depth

Low, soft shadows only: `0 1px 1px rgb(17 20 22 / 6%), 0 3px 10px rgb(17 20 22 / 7%)`. Cards lift 2px with a deeper shadow on hover (200ms, exponential ease-out). No hard offset shadows, no glows.

## Shapes

Crisp: 3px on labels, chips, and tags; 6px on cards, inputs, buttons; 8px on the dialog. No pills and no circles, except the photo crops.

## Components

- **Price label:** inline-block, 1.5px ink border, Archivo 75% / 800. White for single offer prices (shopping list, search results). Yellow for the offer total on a dinner card and for the cheapest search result.
- **Logo:** a yellow hang tag pointing left, with a punched hole and a fork (assets/favicon.svg). Wordmark "tilbudsmiddag" in Archivo 75% / 800 on the rail.
- **Buttons:** ink background, white text; hover turns yellow with ink text.
- **Chips:** 4px radius, hairline border; selected = ink fill.
- **Focus:** 3px yellow outline plus a 5px ink ring, visible on both themes.

## Do's and Don'ts

- Do let the price label be the strongest element on a card.
- Do keep yellow scarce; one yellow label per card.
- Don't add coloured left/top borders to cards, gradients, or emoji icons.
- Don't bring back cream grounds, serif display faces, or terracotta accents.
- Don't invent savings claims; labels show real offer prices only.
