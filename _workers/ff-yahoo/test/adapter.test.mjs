/* Tests for the browser-side Yahoo adapter.
   Run with:  node --test test/adapter.test.mjs

   What these prove: that the helpers untangle Yahoo's XML-shaped JSON correctly, and
   that standings come out in the exact shape the app's existing screens expect.

   What they cannot prove: that Yahoo's real responses are shaped like the fixtures
   below. Those are built from Yahoo's documented resource model, not captured from
   a live call, because Yahoo is unreachable from the machine this was written on.
   If the first real round trip disagrees, fix the fixture here first, watch this
   suite go red, then fix the adapter until it is green again. */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ylist, ymerge, yrecord, yahooStandings, yahooHandleReturn, yahooTokens, yahooSignOut
} from "../client/yahoo-adapter.js";

/* ---------------------------- the helpers ---------------------------- */

test("ylist turns Yahoo's numeric-keyed object into an array", () => {
  assert.deepEqual(ylist({ "0": "a", "1": "b", "2": "c", count: 3 }), ["a", "b", "c"]);
  assert.deepEqual(ylist({ count: 0 }), []);
  assert.deepEqual(ylist(null), []);
  assert.deepEqual(ylist(["already", "an", "array"]), ["already", "an", "array"]);
});

test("ylist stops at the first gap rather than trusting count", () => {
  // A truncated response shouldn't produce undefined holes downstream.
  assert.deepEqual(ylist({ "0": "a", "2": "c", count: 3 }), ["a"]);
});

test("ymerge folds Yahoo's array-of-partials into one object", () => {
  assert.deepEqual(
    ymerge([{ team_key: "k" }, { team_id: "1" }, { name: "Team A" }]),
    { team_key: "k", team_id: "1", name: "Team A" }
  );
});

test("ymerge flattens the nested arrays Yahoo sometimes wraps records in", () => {
  assert.deepEqual(ymerge([[{ a: 1 }, { b: 2 }], { c: 3 }]), { a: 1, b: 2, c: 3 });
  assert.deepEqual(ymerge({ already: "object" }), { already: "object" });
  assert.deepEqual(ymerge(null), {});
});

test("yrecord merges the head parts and keeps the trailing extras", () => {
  const node = {
    team: [
      [{ team_key: "449.l.1.t.1" }, { name: "Blue Thunder" }],
      { team_standings: { rank: 1 } }
    ]
  };
  const got = yrecord(node, "team");
  assert.equal(got.team_key, "449.l.1.t.1");
  assert.equal(got.name, "Blue Thunder");
  assert.equal(got.team_standings.rank, 1);
});

/* ---------------------------- standings ----------------------------
   A fixture in Yahoo's documented standings shape: fantasy_content.league is an
   array whose first element is the league head and whose second carries standings;
   teams hang off a numeric-keyed wrapper one level further down. */

function standingsFixture() {
  const team = (id, name, nick, wins, losses, ties, pf, pa) => ({
    team: [
      [
        { team_key: "449.l.12345.t." + id },
        { team_id: String(id) },
        { name },
        { team_logos: { "0": { team_logo: { size: "large", url: "https://img/" + id + ".png" } }, count: 1 } },
        { managers: { "0": { manager: { nickname: nick } }, count: 1 } }
      ],
      {
        team_standings: {
          outcome_totals: { wins: String(wins), losses: String(losses), ties: String(ties) },
          points_for: String(pf),
          points_against: String(pa)
        }
      }
    ]
  });

  return {
    fantasy_content: {
      league: [
        { league_key: "449.l.12345", name: "Let's Win Slow" },
        {
          standings: {
            "0": {
              teams: {
                "0": team(1, "Blue Thunder", "Jerry", 5, 2, 0, 800.5, 700.1),
                "1": team(2, "Red Rockets", "Sam", 6, 1, 0, 910.2, 690.0),
                "2": team(3, "Gold Rush", "Alex", 5, 1, 1, 805.0, 700.0),
                count: 3
              }
            }
          }
        }
      ]
    }
  };
}

/* Minimum browser the adapter touches, plus a stubbed Worker. */
function browser(responseBody) {
  const store = new Map([["djYahooTok", JSON.stringify({
    access_token: "AT", refresh_token: "RT", expires_at: Math.floor(Date.now() / 1e3) + 9999
  })]]);
  globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k)
  };
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push(String(url));
    return new Response(JSON.stringify(responseBody), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  };
  return { calls, store };
}

test("standings come out in exactly the shape the app's screens already take", async () => {
  const b = browser(standingsFixture());
  const rows = await yahooStandings("449.l.12345");

  assert.equal(rows.length, 3);
  assert.deepEqual(Object.keys(rows[0]).sort(), ["name", "owner", "pa", "pf", "rank", "record"]);

  // Best record first, and ties count half: Red Rockets 6-1 (.857) edges
  // Gold Rush 5-1-1 (.785), which in turn beats Blue Thunder 5-2 (.714).
  assert.deepEqual(rows.map(r => r.name), ["Red Rockets", "Gold Rush", "Blue Thunder"]);
  assert.deepEqual(rows.map(r => r.rank), [1, 2, 3]);
  assert.equal(rows[1].record, "5-1-1");
  assert.equal(rows[2].record, "5-2");
  assert.equal(rows[0].owner, "Sam");
  assert.equal(rows[0].pf, 910.2);
  assert.equal(rows[0].pa, 690);
});

test("standings ask the Worker, never Yahoo directly", async () => {
  const b = browser(standingsFixture());
  await yahooStandings("449.l.12345");
  assert.equal(b.calls.length, 1);
  assert.match(b.calls[0], /^https:\/\/ff-yahoo\.daraja-studio\.workers\.dev\/api\/league\/449\.l\.12345\/standings$/);
  assert.doesNotMatch(b.calls[0], /yahooapis\.com/);
});

test("points come back as numbers, not Yahoo's strings", async () => {
  browser(standingsFixture());
  const rows = await yahooStandings("449.l.12345");
  for (const r of rows) {
    assert.equal(typeof r.pf, "number");
    assert.equal(typeof r.pa, "number");
  }
});

/* ---------------------------- the return trip ---------------------------- */

function landOn(hash, sessionState) {
  const session = new Map(sessionState ? [["djYahooState", sessionState]] : []);
  globalThis.sessionStorage = {
    getItem: k => (session.has(k) ? session.get(k) : null),
    setItem: (k, v) => session.set(k, String(v)),
    removeItem: k => session.delete(k)
  };
  const store = new Map();
  globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k)
  };
  let replaced = null;
  globalThis.location = { hash, pathname: "/daraja-apps/ff/", search: "" };
  globalThis.history = { replaceState: (a, b, url) => { replaced = url; } };
  return { get replaced() { return replaced; } };
}

test("a good return stores the tokens and scrubs them from the address bar", () => {
  const page = landOn("#yh_at=AT-1&yh_rt=RT-1&yh_exp=9999999999&state=abc123", "abc123");
  assert.equal(yahooHandleReturn(), "connected");
  const t = yahooTokens();
  assert.equal(t.access_token, "AT-1");
  assert.equal(t.refresh_token, "RT-1");
  // The fragment must not survive — it would otherwise sit in history and in any
  // screenshot of the address bar.
  assert.equal(page.replaced, "/daraja-apps/ff/");
});

test("a mismatched state is refused and nothing is stored", () => {
  landOn("#yh_at=AT-1&yh_rt=RT-1&yh_exp=9999999999&state=attacker", "mine");
  assert.equal(yahooHandleReturn(), "error:state_mismatch");
  assert.equal(yahooTokens(), null);
});

test("a missing state is refused too", () => {
  landOn("#yh_at=AT-1&yh_rt=RT-1&yh_exp=9999999999&state=abc123", null);
  assert.equal(yahooHandleReturn(), "error:state_mismatch");
  assert.equal(yahooTokens(), null);
});

test("an error from Yahoo comes back named, with the bar scrubbed", () => {
  const page = landOn("#yh_error=access_denied", "abc123");
  assert.equal(yahooHandleReturn(), "error:access_denied");
  assert.equal(page.replaced, "/daraja-apps/ff/");
});

test("an ordinary page load is left alone", () => {
  landOn("", null);
  assert.equal(yahooHandleReturn(), null);
  landOn("#some-other-anchor", null);
  assert.equal(yahooHandleReturn(), null);
});

test("signing out really removes the tokens", () => {
  landOn("#yh_at=AT-1&yh_rt=RT-1&yh_exp=9999999999&state=abc123", "abc123");
  yahooHandleReturn();
  assert.ok(yahooTokens());
  yahooSignOut();
  assert.equal(yahooTokens(), null);
});

/* ---------------------------- league discovery ---------------------------- */

test("my leagues unwraps Yahoo's users -> games -> leagues nesting", async () => {
  const fixture = {
    fantasy_content: {
      users: {
        "0": {
          user: [
            [{ guid: "ABC123" }],
            {
              games: {
                "0": {
                  game: [
                    [{ game_key: "449" }, { code: "nfl" }, { season: "2026" }],
                    {
                      leagues: {
                        "0": { league: [[{ league_key: "449.l.12345" }, { name: "Newport Cove" }, { num_teams: "12" }]] },
                        "1": { league: [[{ league_key: "449.l.67890" }, { name: "Let's Win Slow" }, { num_teams: "10" }]] },
                        count: 2
                      }
                    }
                  ]
                },
                count: 1
              }
            }
          ]
        },
        count: 1
      }
    }
  };
  const b = browser(fixture);
  const { yahooMyLeagues } = await import("../client/yahoo-adapter.js");
  const leagues = await yahooMyLeagues();

  assert.deepEqual(leagues, [
    { key: "449.l.12345", name: "Newport Cove", teams: 12 },
    { key: "449.l.67890", name: "Let's Win Slow", teams: 10 }
  ]);
  assert.match(b.calls[0], /\/api\/users;use_login=1\/games;game_keys=nfl\/leagues$/);
});

test("a user with no NFL leagues yields an empty list, not a crash", async () => {
  browser({ fantasy_content: { users: { "0": { user: [[{ guid: "X" }], { games: { count: 0 } }] }, count: 1 } } });
  const { yahooMyLeagues } = await import("../client/yahoo-adapter.js");
  assert.deepEqual(await yahooMyLeagues(), []);
});
