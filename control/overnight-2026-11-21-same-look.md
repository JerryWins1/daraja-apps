# Overnight, 21 Nov 2026 — same look across every app

Asked for by Jerry on 21 Nov ("making sure all the apps have the same user interface… we're
close to launching"), relayed by Daraja · Store Manager. Run by an overnight chat while he slept.

## Contact sheet

**https://jerrywins1.github.io/daraja-apps/control/same-look/**

43 apps at 390px. Each card shows two shots — what opens, and the app after its welcome
— with the differences in red under them. The shots were taken before tonight's fixes, so
they still show the old version stamps. The fixes don't change anything visible in a desktop
browser (see below).

## What was fixed tonight

Only apps whose `control/apps.json` card says `no-chat`. Small and safe: nothing on any
screen does anything different.

**`viewport-fit=cover` added to 10 apps.** Each one already uses `env(safe-area-inset-bottom)`
in its own CSS and in the house block — on the lifted bottom buttons, the dock and the sheets.
Without `viewport-fit=cover`, iPhone reports those insets as 0, so on a phone with a home bar
none of that lifting happened. Now it does.

| app | stamp |
| --- | --- |
| Daraja Academy | v2.8 → v2.9 |
| The Clubhouse | v1.10 → v1.11 |
| GameDay | v1.7 → v1.8 |
| The Key · Church Edition | v1.12 → v1.13 |
| Serve Board | v1.12 → v1.13 |
| Message Assistant | v1.11 → v1.12 |
| In My Own Words | v1.17 → v1.18 |
| The Key | v1.17 → v1.18 |
| Break-Even | v1.5 → v1.6 |
| Next Step Board | v1.12 → v1.13 |

`node shop/checkvideos.js` on all ten: **30 of 30 videos good.** No video wording changed,
so nothing needed recording again.

**Left alone on purpose, though they're no-chat:**
- *Keepsake Pro*, *Get organized* (`organize/`) and *Daraja for churches* (`church/`, which
  only redirects to `church-apps/`) are sales pages, not apps. Keepsake has no `env()` anywhere,
  so `viewport-fit=cover` would do nothing there. Whether a sales page needs an icon or a
  manifest is the store's call.
- *FlipKit*'s condition chips and *My Safety Plan*'s tabs measure 40–43px, under the 44px
  target. That comes from the shared `daraja-readable-v4-css` block, which sets chips, tabs
  and nav buttons to 40px on purpose in 26 apps. One app shouldn't override it. It's listed
  under house findings below.
- Fonts. Academy, both Keys and In My Own Words use Georgia headings, and Break-Even uses Iowan.
  That looks like a deliberate warmer look for those shelves, not a mistake. Making them match is
  a design decision for the house chat, not a quiet overnight change.

## Fixes for apps owned by other chats — for the Store Manager to relay

Nothing below was edited. Each line says what was found and where.

**Paperwork and compliance documents** — Receipt Maker (`np-receipts/`)
- No `viewport-fit=cover` in the viewport meta. Add it, then bump the stamp.
- On first open, a `×` button sits at the bottom right (x 313, y 788), under the house `?` dock.
- The version stamp is only found inside a script, not in the footer like the other apps.

**Daraja · tester pack** — Feedback Studio (`feedback-studio/`)
- No `viewport-fit=cover`.
- No version stamp on the first screen.
- The house dock doesn't show. That may be on purpose, since it's a tool and not a shelf app.

**Kenya · Duka shop app** — Duka (`duka/`)
- No `<link rel="apple-touch-icon">`. The folder has no `icon.svg` either. Most apps use
  `<link rel="apple-touch-icon" href="icon.svg">`.

**Daraja · F1 fantasy app (Pit Wall)** — `f1/`
- No `apple-touch-icon`.
- The stamp sits in `p.small` rather than the footer.
- Expected in the cloud: the calendar can't load (`api.jolpi.ca` is blocked here), as CLAUDE.md says.

**Daraja · Built on Faith (the dresser app)** — `builtonfaith/`
- The only app with **no house block at all**: no `?` dock, no Aa, no voice switch, no greeting.
- No `apple-touch-icon`, no manifest, no version stamp.
- Its own font, Atkinson Hyperlegible. Every other app uses the system font.

**Daraja · Porchlight assistant** — On Guard (`porchlight/`)
- Its own font, Atkinson Hyperlegible, and a blue main button (`#1D4EA0`). The house is dark teal.
- No version stamp on the first screen.

**Daraja · Ahead of It — the merge** — `ahead-of-it/`
- No version stamp on the first screen.

**Daraja · Fantasy football app** — My Scores (`ff/`)
- A blue main button on a dark page. Fine for the "just for fun" shelf, but it's the odd one out.
- The stamp is in `small#stamp`, not a footer.

**Daraja · The Church App** — Church HQ (`church-hq/`), and probably `church-demo/`
- Church HQ's main button is gold (`#C9982A`) where the house uses dark teal.
- `church-demo/` has no card in `apps.json`. On first open, the house `?` sits on the "All
  events" link and the first event row, just above the tab bar.

**Daraja · Family Money Dashboard** — `familydash/`
- The stamp reads **v9.9 · 2026-11-20**. Every other app is on v0–v7, so check that's the number you meant.

**Daraja · Store Manager** — Rafiki, Jar by Jar, Trip Tab
- Rafiki's main button is coral (`#E0653C`). Nothing else was flagged on any of the three.

**Daraja · One Thing / Daraja · Compass** (`Apps (installable site)/nownext`, `…/compass`)
- The stamp shows in the splash (One Thing) or wasn't found in a footer element (Compass).
  Nothing else was flagged.

**No card in `apps.json`**: `business/`, `home/`, `quickquote/`, `business-manager-ke/`,
`church-demo/` and `Apps (installable site)/occ/`. On `business/` (a sales page) the house
`?` sits on the "Try it free ›" button, and there's no touch icon or manifest. The others
weren't flagged. Somebody should give these a card so they have an owner.

Nothing was flagged on Who's Coming, My Circle, Business Manager or Quick Quote.

## House-level findings — for Daraja · house layer + store

1. **Tap size.** `daraja-readable-v4-css` (in 26 apps) sets `nav button, .pills button,
   .chips button, .tabs button { min-height: 40px !important }`. Every other tap target in the
   house is 44px. Raising it to 44 would fix FlipKit and My Safety Plan and keep things in step everywhere.
2. **The `?` dock over app content.** On first open it lands on something tappable in seven apps:
   - a lesson tile in Academy
   - a habit tile in Every Day
   - "The building" in The Key · Church Edition
   - the `×` in Receipt Maker
   - "Try it free ›" on `business/` and `organize/`
   - the event list on `church-demo/`

   Most of these scroll clear, but a person's first look has the `?` sitting on a button.
   `yieldDock()` only steps aside for sheets. It could also nudge up when a tappable is under it,
   or the house could add bottom padding equal to the dock.
3. **`env()` is 0 without `viewport-fit=cover`.** All the house's lifting uses
   `env(safe-area-inset-*)`, which silently does nothing in an app missing `viewport-fit=cover`.
   Ten apps were fixed tonight. Receipt Maker, Feedback Studio and Keepsake are still missing it.
   The house could warn in the console when the meta lacks it.
4. **Two kinds of welcome.** Most apps open on the house's cream "WHAT IT DOES" sheet, then
   "How do you want to start?". Seven open on their own dark card with a yellow button instead:
   OCC Box Counter, My Safety Plan, Church HQ, Feedback Studio, FlipKit, Family Money Dashboard
   and On Guard. Both look fine, but they're two looks.
5. **Headers come in three kinds.**
   - a plain title on cream (most home apps)
   - a coloured band (the church shelf, Message Assistant, Receipt Maker, Business Manager, Pit Wall)
   - a centred serif title (Academy, both Keys, In My Own Words, Break-Even)

   A house rule on which to use would settle it.
6. **Main button colour.** Dark teal (`#23504F` / `#1C2B29`) is the house majority. The
   exceptions are listed per app above: gold, coral, blue, rust.
7. **Colour tokens** are mostly shared already. `--ink` is in all 43 apps, `--line` in 41,
   `--soft` in 36, `--bg` in 33 and `--gold` in 30. `--brand` / `--accent` / `--green` / `--blue`
   are split between names for the same job.
8. **The greeting toast** ("Good morning…") covers the top of every app's header for its first
   seconds, including the app's name.

## What could not be tested

- **Anything on a real iPhone.** `viewport-fit=cover` only changes things on a phone with a
  notch or home bar. In this container's Chromium the insets are always 0, so tonight's change
  can only be confirmed by opening one of the ten apps from the Home Screen on an iPhone.
- **Voice.** `checkvideos.js` checks the pictures, not the audio. No audio changed tonight.
- **Empty states.** The audit looked for "nothing yet / add your first" text on first screens,
  but most apps open on example data. Comparing empty states would need "Start fresh" tapped
  in each app, which wasn't done.
- **Pit Wall's calendar** — `api.jolpi.ca` is blocked from the cloud.
- The shots were taken with the house tour quietened (`dj_tour_quiet`), as a returning visitor.
