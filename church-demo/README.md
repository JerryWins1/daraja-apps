# The Church App — the demo church

**Live:** https://jerrywins1.github.io/daraja-apps/church-demo/

This is the app a buyer tries before they buy. It is a complete, working copy of The
Church App filled with an **invented church — Grace Harbor Church**. Nothing in it is
real, and nothing in it can reach anybody.

## Why it exists

Until 8 November 2026 the store's "try it" link went to
`https://jerrywins1.github.io/immanuel-app/` — Immanuel Church in Gurnee, a real
congregation paying for a real app. Every stranger who tapped "try it" landed on their
prayer wall, their giving page and their office phone number, which is why the product
video had to say *"look around, but please do not send anything to their office."*

A demo removes the need for that sentence.

## What is invented, and where

| in the file | what it holds now |
| --- | --- |
| `<title>`, icons, manifest, logo | Grace Harbor Church, an anchor mark drawn for the demo |
| brand colour | teal `#0E7C86` (`--brand`, `--brand-deep`, `--brand-tint`) |
| `MESSAGES` | twelve invented sermons across three invented series |
| `THUMBS` | series artwork drawn for the demo — no YouTube thumbnails are ever fetched |
| `EVENTS` | an invented calendar, four weeks of rhythm plus the season's one-offs |
| `TEAM` | eight invented staff |
| `SEED_PRAYERS` | three invented requests, so the wall is not empty |
| `NOTES` / `V1_SLIDES` | an invented sermon outline for the latest message |
| address, phone, email | 1200 Harbor Way, Lakeside · (555) 555-0137 · office@graceharbor.example |

The phone number is in the 555-01xx range reserved for fiction and the email is on the
reserved `.example` domain, so neither can reach a person even if someone tries.

## What is switched off

Every link that would reach a church — website, giving, live stream, socials,
directions, YouTube — is left **unset** (`href="#"`). A short block at the bottom of the
file catches taps on unset links and says so instead of opening a blank page. The prayer
form still saves to the phone, as it really does, but sends no email.

That block does **not** need deleting when you copy this file for a church. It only ever
touches links that are still unset, so filling in a church's real links switches it off
by itself. It is a good checklist of what is left to fill in.

## Two things this demo does that a church's app should not

Both are marked `DEMO ONLY` in the file, with a comment saying what to write instead:

1. **`DAY()` dates.** A real church writes `date:"2026-11-15"`. The demo's calendar
   slides to whichever week it is being read in, so a buyer never opens it to find last
   year's events and an abandoned-looking app.
2. **Seeded prayer requests.** A church starts with an empty wall.

## Keeping it current

This demo is now **the template**, and it is maintained here, by hand, like any other
app. It is no longer derived from Immanuel's file.

If you ever do re-derive it from `JerryWins1/immanuel-app` to pick up a new feature,
every item in the table above has to be scrubbed again, and these checks have to come
back clean before it ships:

```
grep -ic "immanuel\|gurnee\|dilleys\|pushpay\|847-336" church-demo/index.html   # must be 0
```

and, in a browser: no console errors, no network requests to anything but the file
itself, and no broken images.

`CLAUDE.md` → "An app is not just the app": a change here is not finished until this
app's videos and store card say the same thing. The videos live in `shop/apps_data.js`
and are re-recorded with `python3 shop/voicemaker.py --all`.

## What this is not

- It is not Immanuel's app. That is `JerryWins1/immanuel-app`, a real church's live app,
  and nothing lands there without Jerry saying so.
- It is not Church HQ (`church-hq/`), which is the separate four-page admin tool.
- The Weekly Update page is not inside this file. It is a separate page —
  `immanuel-update/` — and each church needs their own copy of it pointed at their own
  repository. `church-demo/SETUP.md` covers that.
