# Launch plan — the five ideas Jerry chose, 21 Nov 2026

Jerry: "work on the best way to manage it… new leading edge ideas for the world's leading AI app store."
Ten were offered; he chose 1, 2, 5, 8 and 9.

| # | idea | who builds it | depends on |
|---|---|---|---|
| 1 | **Launch board**: one page, every app green or red on: video current (`voicemaker.py --check`), AI line in its videos, same-look audit passed, test script passed, store card true. Refreshed by the nightly job. | Store Manager (nightly caretaker) | the two overnight reports |
| 2 | **AI sorts the messages**: each night, every `FEEDBACK|kind:` row from "Send us a message" is read. Problems are relayed to the owning chat (control/apps.json), ideas go on an idea board, questions get a drafted reply for Jerry to approve. Nothing is sent to a customer without Jerry. | Store Manager (nightly) | house layer shipping "Send us a message" |
| 5 | **AI concierge on the store**: "Tell me about your week" → 2–3 apps that fit, with why. Uses the Daraja AI door; answers only from the store catalogue (shop/apps_data.js). | Store Manager | the AI door (live) |
| 8 | **Sunday scorecard**: opens per app (openPing), messages by kind, gifts (sales.json total only), and the top request, on one screen. | Store Manager (nightly) | 2 |
| 9 | **Safe rollout**: a new app version goes to the test copy first; after 24 hours with no new problems it goes to everyone. | house layer + store chat | ~~a decision on how the test copy is served~~ — decided and built, 21 Nov; see below |

Order: 1 and 5 first (no dependencies), then 2 and 8 once "Send us a message" ships, then 9.
Words a customer reads (concierge wording, any reply) are Jerry's to approve before they ship.


---

## Idea 9 — how the test copy is served

Decided and built on 21 November by the house layer chat. House block v75,
`tools/rollout.js`, `control/rollout.json`.

### What cannot be done, measured rather than assumed

**Nothing can be held back from one person and not another.** GitHub Pages serves
one copy of `main` to everybody. There is no server to ask who is visiting, so a
tester and a customer at the same address get the same bytes. Two ways round it
were looked at and rejected:

- **Hold it in the service worker.** Every app has its own `sw.js` and there are
  **34 different ones**, each belonging to that app's chat. The common shape is
  network-first — `fetch().catch(() => caches.match())` — so each serves the
  newest the moment it is pushed. Rewriting all of them to gate on a date would
  be a change across other chats' files, and its failure mode is the one that
  cannot be recovered from: a worker that wrongly decides never to update leaves
  every customer stranded on a stale version, with no way to push them a fix.
- **Serve two copies from one address.** Needs a server. Pages is not one.

### What is built instead

The new version is published at a **second address that only testers are given**,
and moved to the real address when it has earned it. "Held back" then means
nothing more than *the released file has not changed yet*, which is true, simple,
and cannot strand anybody.

```
node tools/rollout.js start <app>      the working copy goes to <app>/beta/
node tools/rollout.js list             what is waiting, and how long is left
node tools/rollout.js promote <app>    the beta becomes the released app
node tools/rollout.js drop <app>       throw the beta away; released app untouched
```

`promote` refuses before the 24 hours are up unless `--now` is passed, and asks
for the reason to go in the commit.

The beta is a **byte-identical copy** of the app — no build step, no injected
marker, nothing that can drift from what was tested. The house block recognises
that it is sitting at `<app>/beta/` and does two things:

- uses the parent folder as the app's slug, so the tester's saved work, backup
  entry, tour and Home Screen record all still belong to the same app. Without
  this a beta would call itself an app named "beta" and open empty.
- shows a band along the bottom: *Next version of <app> — not released yet. Your
  saved work is the same as in the released one*, with a button to the released
  one. The ? button lifts clear of it. It is at the bottom because the greeting
  card floats over the top on purpose (v62).

Checked by `node tools/house/test.cjs beta`, eight checks, which make a real
beta, drive it, confirm the 24-hour refusal and clean up after themselves.

### What is still needed, and whose it is

- **Giving testers the link.** `<app>/beta/` is reachable but nothing points at
  it. The tester pages belong to the **tester pack** chat.
- **Promoting on time.** Nothing promotes by itself. The natural home is the
  nightly **Store Manager** job: run `list`, and promote anything whose hold has
  passed and whose app has no new `FEEDBACK|kind:problem` since the beta started
  — which is exactly what idea 2 already reads each night.
- **Deciding what counts as "a new problem".** A judgement, not code.
