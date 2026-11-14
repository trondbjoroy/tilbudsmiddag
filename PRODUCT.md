# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Budget-tight households in Norway: students, people living alone, and low-income families. Price is the main reason they come. They use the site mostly on a phone, when they plan the week's dinners and when they stand in the store.

## Product Purpose

tilbudsmiddag.no reads the week's offer flyers from ten Norwegian grocery chains and turns the offers into dinner suggestions for every weekday. Each dinner has a recipe and a shopping list that shows which store has each item cheapest. A price search finds the store with the cheapest offer on any item. Success: the visitor plans cheap dinners for the week in a few minutes and knows where to buy what.

## Positioning

Dinners are chosen from this week's actual offers, not the other way round. Prices are compared per kilo or litre across chains, so the cheapest store is a fact, not a guess.

## Operating Context

- Offers update every Sunday from the chains' flyers (REMA 1000, KIWI, Extra, Obs, Coop Prix, Coop Mega, MENY, SPAR, Joker, Bunnpris).
- New recipes are added weekly. Recipe pages and topic pages are static and built for search (SEO).
- Light and dark mode. No login, no ads, no cookies.

## Capabilities and Constraints

- Static site, vanilla JS ES modules, hosted on Vercel. No framework.
- Functions that must stay: week plan, filters, recipe dialog, shopping list (copy and print), price search, light/dark mode, portions.
- Prices are only offer prices from the flyers. Normal shelf prices are not known.

## Brand Commitments

- Name: Tilbudsmiddag, domain tilbudsmiddag.no.
- Copy is Norwegian (bokmål). Keep the existing text and voice: plain, friendly, practical.
- Keep the existing dish photos and AI images.

## Evidence on Hand

- Real weekly offer data (data/offers.json), 81 recipes with images (assets/img/), image credits.
- No testimonials, user counts, or savings claims exist. Do not invent them.

## Product Principles

- Price first: the cheapest option must be obvious at a glance.
- Fast on a phone: the week plan and shopping list work one-handed in a store.
- Honest numbers: show what the price covers (offer items only, per kilo or litre).
- Free and calm: no ads, no sign-up, no pressure.
