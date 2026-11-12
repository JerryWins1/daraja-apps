# Donate mode — what the switch does not cover yet

Written 12 Nov 2026. PHASE `'donate'` in `shop/apps_data.js` already changes: the store
(`shop/index.html`), the video player's end screen (`shop/watch.html`), and One Thing's code gate.
Everything below still speaks a price, a purchase or a membership, and would read wrong in donate
mode. The video lines that spoke a price were swapped and re-recorded on 12 Nov 2026 (branch `donate-videos`). The "every Daraja app helps a student in Kenya" lines in Every Day, Our Table and Who's Coming were left for Jerry to decide, as was the tester videos' Kenya line. Each is owned by the chat named for it in `control/apps.json`; the house layer and the
group pages belong to the shared-layer chat.

## Before PHASE flips (must)

| page | what it says now | what it needs |
|---|---|---|
| The More-from-Daraja sheet (house layer, the same code in ~35 pages, e.g. `shop/index.html` around line 1483) | "one price… Every purchase keeps a student in Kenya in school"; in live mode "Get it · $X" | read PHASE: in donate mode "Get it free" and drop the purchase sentence. One change in the house layer, copied out the usual way |
| `home/index.html` (the door) | outside testing, each tile reads "try it · $X" | in donate mode, "free" |
| `shop/next/index.html` (the new store) | its own copy of prices, Get buttons and PHASE checks | the same donate branch as `shop/index.html` |
| `business/`, `church-apps/`, `organize/`, `start/` (group pages Jerry texts) | prices in plain words, "Family membership" tags, "bought on its own" | read PHASE, or carry hidden donate wording the way `shop/index.html` now does (`data-paid` / `data-donate` / `data-give`) |
| `academy/index.html` | "The course is $19 — all six are open while we're testing" | "The whole course is free" |
| In-app price words in `ahead-of-it/`, `business-manager/`, `business-manager-ke/`, `church-clubhouse/`, `church-gameday/`, `church/care/`, `drumbeat/` | a price or "one-time" in the app's own about or help text | free wording, or hide in donate mode |
| `shop/policies.html` | refunds within 30 days; "your membership covers every update" | a donations paragraph: who receives (Loving InDeed, Inc.), that gifts are optional, and the refund route for a donation, which is the charity's, not Daraja's (CPA to confirm the wording) |
| `shop/index.html` `<meta>` description and share text | "pay once, own forever… every purchase" | static tags cannot follow PHASE; rewrite on flip day |
| `shop/index.html` header line | "Our profits keep students in Kenya in school" | Jerry's call: does it still hold while apps are free? |
| `shop/index.html` template and book cards (`kind:'download'`) | "will be $12 · Ask Jerry for a copy" | decide: free too, or keep as they are (they are not apps) |
| `shop/index.html` Made-in-Kenya shelf line | "priced here — in shillings" | Duka has no price yet; drop "priced" or leave |
| The `VS` rival-price lines on store cards | already say "This: free." in donate mode | nothing |

## Tester and founding pages (tester pack chat's call, not the store's)

| page | what it says now |
|---|---|
| `founding/index.html` | "yearly memberships (Family is $39 a year), and as a founding member…" |
| `friends/index.html`, `kenya/index.html`, `join/friends/`, `join/church/` | "first year of the … membership free, then half price for life" |
| `testers/index.html` | the founding-tester reward is "the membership" |

A Founding Tester's reward is a discount on something that would now be free. That reward needs
a new shape before PHASE flips, and it is a promise already made to people, so it is Jerry's.

## Changelog-only mentions (nothing to change)

`whats-new/index.html` (a dated entry about membership prices), `shop/watch.html` and
`business-manager/index.html` (code comments).

## One Thing, on flip day

The donate branch is already in `Apps (installable site)/nownext/index.html`. Its footer version
stamp was not bumped, because nothing a person sees changes while PHASE is `'testing'`, and a bump
would reset the testers' passes for nothing. Bump it in the same change that flips PHASE.
`Apps (installable site)/nownext/nownext/index.html` is an older copy with no gate and no buy link;
nothing links to it.
