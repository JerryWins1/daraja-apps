# ff-yahoo

The server half of Yahoo support for **My Scores** (`/ff/`).

**Status: built, not deployed.** Yahoo's Fantasy API is behind an application and
review process. Nothing here should go live until Yahoo approves the application
submitted on 22 October 2026, and until someone has read the API Access and Use
Agreement they hand over at that point — it was not published anywhere we could read
beforehand, and it governs whether this data can be used in an app that is sold.

## Why a Worker exists at all

ESPN and Sleeper are read straight from the browser. Yahoo cannot be, for two
separate reasons, and there is no client-side way round either:

1. Yahoo needs an OAuth 2.0 bearer token. There is no cookie path like ESPN's, so
   a user being signed into Yahoo in their browser authorises nothing.
2. Yahoo's API sends no CORS headers, so even holding a valid token, page
   JavaScript cannot read the response.

Swapping an auth code for a token also needs the client secret, which can never sit
in a file served from GitHub Pages.

So this Worker holds the secret, talks to Yahoo server-to-server, and hands the page
back JSON it is allowed to read.

**It stores nothing.** No KV, no database, no user records. Tokens go to the browser
and live only in that browser's `localStorage`, which keeps the promise that a user's
data stays on their own device. The one secret here is Daraja's, not the user's.

## Routes

| Route | Purpose |
|---|---|
| `GET /login?state=…` | Redirects to Yahoo's consent screen. Takes no return-URL parameter, on purpose, so it can't be used as an open redirect. |
| `GET /callback` | Yahoo sends the user back here. Swaps the code for tokens and redirects to the app with them in the URL **fragment**, which browsers never send to a server. |
| `POST /refresh` | Body `{refresh_token}`. Returns a fresh pair plus an absolute `expires_at`. |
| `GET /api/<yahoo path>` | Relays to `fantasysports.yahooapis.com/fantasy/v2/…` with the page's bearer token. Read-only, host-pinned, `format=json` forced. |
| `GET /health` | Liveness. |

## Deploying, when the time comes

Each step is one thing. Finish it, then do the next.

1. Install Wrangler if it isn't there: `npm install -g wrangler`
2. Sign in: `wrangler login`
3. Open `wrangler.toml` and put the Yahoo **Client ID** in `YAHOO_CLIENT_ID`.
   That one is public by design and belongs in the file.
4. Put the **Client Secret** in from the terminal, where it stays out of the repo:
   `wrangler secret put YAHOO_CLIENT_SECRET`
5. Deploy: `npm run deploy`
6. Check it answers: open `https://ff-yahoo.daraja-studio.workers.dev/health`
7. Confirm the Redirect URI on the Yahoo app page is exactly
   `https://ff-yahoo.daraja-studio.workers.dev/callback`. If the deployed Worker got
   a different subdomain, change the Yahoo app to match, and `REDIRECT_URI` too.

## Tests

```
npm test
```

40 tests, no network, no dependencies.

**What they prove:** routing, CORS (never a wildcard, never an unknown origin), the
`state` check, that the relay can't be pointed at another host, that private league
data is never put in a shared cache, that errors don't leak the secret, and that
Yahoo's XML-shaped JSON gets untangled into the exact shapes the app's screens
already consume.

**What they cannot prove:** that Yahoo's live responses look like the fixtures. Those
were built from Yahoo's documented resource model, not captured from a real call,
because Yahoo is unreachable from the machine this was written on. Expect the first
real round trip to need corrections in `yahooSideSummary` and `yahooRoster`. The
helpers underneath them should hold.

When that first real call happens: capture the actual JSON, replace the fixture in
`test/adapter.test.mjs`, watch the suite go red, then fix the adapter until it's
green. Don't fix the adapter by eye against a live response — the fixture is what
stops the next person breaking it.

## Wiring the page up

`client/yahoo-adapter.js` is the browser half. It is kept as its own module rather
than pasted into `ff/index.html` because that file changes many times a day and a
feature that cannot ship yet has no business adding merge conflicts to it.

It produces the same shapes as the ESPN and Sleeper adapters, so the screens need no
changes:

```
sideSummary -> { id, name, owner, logo, record, pts, proj, starters[, bench] }
starter     -> { id, name, pos, pts, projPts, teamAbbr, injury }
standings   -> [{ rank, name, owner, record, pf, pa }]
```

To wire it in: call `yahooHandleReturn()` once on load, `yahooConnect()` from a
"Connect Yahoo" button, and use `yahooMyLeagues()` in the add-a-team wizard beside
the ESPN and Sleeper paths. The `export` keywords come off if it goes inline.

The `#wYahoo` card in `ff/index.html` currently tells users Yahoo isn't supported.
That copy comes out in the same change.

## Before any of this ships

Yahoo's attribution terms are mandatory and specific:

- Every screen showing Yahoo data needs **"Fantasy data provided by Yahoo Fantasy"**
  with their official logo, linking back to Yahoo Fantasy.
- The logo must be used **unmodified**: no recolouring, no effects, no reproportioning.
- It must **not be combined with other brands or marks**. In an app carrying Daraja
  branding, that means giving it its own line rather than setting it beside the
  Daraja wordmark.

`YAHOO_ATTRIBUTION_HTML` at the bottom of the adapter is a starting point. It
references `yahoo-fantasy-logo.png`, **which does not exist yet** — the official asset
has to be downloaded from Yahoo by hand, since Yahoo is unreachable from here.
