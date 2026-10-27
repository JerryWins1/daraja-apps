/* Daraja Studio · My Scores · Yahoo adapter · v1.0
   The browser half. Pairs with the ff-yahoo Worker.

   This produces exactly the same shapes the ESPN and Sleeper adapters already hand
   the app, so the screens need no changes:
     sideSummary -> { id, name, owner, logo, record, pts, proj, starters[, bench] }
     starter     -> { id, name, pos, pts, projPts, teamAbbr, injury }
     standings   -> [{ rank, name, owner, record, pf, pa }]

   Tokens live in this browser's localStorage and nowhere else. The Worker stores
   nothing, so signing out here really is signing out.

   HONEST CAVEAT, read before trusting the parsing below: every path and field name
   here is written from Yahoo's documented resource model, not from a live response,
   because the machine this was written on cannot reach Yahoo. The flattening helpers
   are tested against hand-built fixtures in that documented shape. Expect the first
   real round trip to need corrections in `yahooSideSummary` and `yahooStandings`;
   the helpers underneath them should hold. */

const WORKER = "https://ff-yahoo.daraja-studio.workers.dev";
const STORE = "djYahooTok";

/* ---------------------------- tokens ---------------------------- */

export function yahooTokens() {
  try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) { return null; }
}

function saveTokens(t) {
  try { localStorage.setItem(STORE, JSON.stringify(t)); } catch (e) { /* private mode; session-only is fine */ }
}

export function yahooSignOut() {
  try { localStorage.removeItem(STORE); } catch (e) {}
}

export function yahooConnected() {
  const t = yahooTokens();
  return !!(t && t.refresh_token);
}

/* Start the consent trip. The random `state` is kept here and checked on the way
   back, which is what stops someone else's callback being replayed into this page. */
export function yahooConnect() {
  const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, "0")).join("");
  try { sessionStorage.setItem("djYahooState", state); } catch (e) {}
  location.href = WORKER + "/login?state=" + encodeURIComponent(state);
}

/* Call once on page load. Yahoo sends the user back to the app with tokens in the
   URL fragment; this picks them up, checks the state, stores them, and scrubs the
   address bar so the tokens aren't left sitting in history or a shared screenshot.
   Returns "connected", "error:<reason>", or null when this wasn't a return trip. */
export function yahooHandleReturn() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return null;
  const p = new URLSearchParams(hash);

  const err = p.get("yh_error");
  const at = p.get("yh_at");
  if (!err && !at) return null;

  const clean = () => history.replaceState(null, "", location.pathname + location.search);

  if (err) { clean(); return "error:" + err; }

  const expected = (() => { try { return sessionStorage.getItem("djYahooState"); } catch (e) { return null; } })();
  if (!expected || p.get("state") !== expected) { clean(); return "error:state_mismatch"; }
  try { sessionStorage.removeItem("djYahooState"); } catch (e) {}

  saveTokens({
    access_token: at,
    refresh_token: p.get("yh_rt") || "",
    expires_at: Number(p.get("yh_exp")) || 0
  });
  clean();
  return "connected";
}

async function freshAccessToken() {
  const t = yahooTokens();
  if (!t || !t.refresh_token) throw new Error("NOTCONNECTED");
  // Refresh a minute early rather than waiting for a 401 round trip.
  if (t.access_token && t.expires_at > Math.floor(Date.now() / 1000) + 60) return t.access_token;

  const res = await fetch(WORKER + "/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: t.refresh_token })
  });
  if (!res.ok) { yahooSignOut(); throw new Error("NOTCONNECTED"); }
  const next = await res.json();
  saveTokens(next);
  return next.access_token;
}

/* One Yahoo call. Retries once on an expired token, because a token can lapse
   between the check above and the request actually landing. */
export async function yahooGet(path) {
  let token = await freshAccessToken();
  let res = await fetch(WORKER + "/api/" + path, { headers: { Authorization: "Bearer " + token } });

  if (res.status === 401) {
    const t = yahooTokens();
    if (t) saveTokens({ ...t, expires_at: 0 });   // force the refresh
    token = await freshAccessToken();
    res = await fetch(WORKER + "/api/" + path, { headers: { Authorization: "Bearer " + token } });
  }

  if (res.status === 401) { yahooSignOut(); throw new Error("NOTCONNECTED"); }
  if (!res.ok) throw new Error("Yahoo said " + res.status);
  return res.json();
}

/* ------------------- untangling Yahoo's JSON -------------------
   Yahoo's JSON is a translation of their XML, and it shows. Lists arrive as objects
   keyed "0", "1", "2" with a `count` alongside, and a single record is often an
   array of partial objects that are meant to be merged. These two helpers are the
   whole trick; everything below them reads normally. */

export function ylist(node) {
  if (!node) return [];
  if (Array.isArray(node)) return node;
  const out = [];
  for (let i = 0; ; i++) {
    const v = node[String(i)];
    if (v === undefined) break;
    out.push(v);
  }
  return out;
}

export function ymerge(node) {
  if (!node) return {};
  if (!Array.isArray(node)) return node;
  const out = {};
  for (const part of node) {
    if (Array.isArray(part)) Object.assign(out, ymerge(part));
    else if (part && typeof part === "object") Object.assign(out, part);
  }
  return out;
}

/* A Yahoo record is usually `{ "0": [ ...parts ], "1": {...extras} }`. Pull the
   merged head and keep the rest reachable by name. */
export function yrecord(node, name) {
  const wrapper = node && node[name] ? node[name] : node;
  if (!wrapper) return {};
  const head = ymerge(wrapper[0] !== undefined ? wrapper[0] : wrapper);
  const rest = {};
  for (let i = 1; ; i++) {
    const v = (wrapper || {})[String(i)];
    if (v === undefined) break;
    Object.assign(rest, v);
  }
  return { ...head, ...rest };
}

/* ---------------------------- leagues ----------------------------
   Every NFL league the signed-in user belongs to, as { key, name, teamKey }.
   `game_keys=nfl` resolves to the current season on Yahoo's side. */
export async function yahooMyLeagues() {
  const d = await yahooGet("users;use_login=1/games;game_keys=nfl/leagues");
  const out = [];
  for (const u of ylist((d.fantasy_content || {}).users)) {
    const user = yrecord(u, "user");
    for (const g of ylist(user.games)) {
      const game = yrecord(g, "game");
      for (const l of ylist(game.leagues)) {
        const league = yrecord(l, "league");
        if (league.league_key) {
          out.push({
            key: league.league_key,
            name: league.name || league.league_key,
            teams: Number(league.num_teams) || 0
          });
        }
      }
    }
  }
  return out;
}

const POS_CLEAN = p => (p === "DEF" ? "D/ST" : p || "");

/* ---------------------------- one matchup ----------------------------
   Yahoo's scoreboard carries both teams and their live points, but not rosters, so
   each side's starters come from a second call per team. That is three calls for a
   matchup view against ESPN's one — the price of the API being resource-shaped. */
export async function yahooMatchup(leagueKey, week) {
  const wk = week ? ";week=" + week : "";
  const d = await yahooGet("league/" + leagueKey + "/scoreboard" + wk);
  const league = yrecord((d.fantasy_content || {}).league, null);
  const matchups = ylist((league.scoreboard || {}).matchups || ((league.scoreboard || {})["0"] || {}).matchups);

  const first = ymerge((matchups[0] || {}).matchup);
  const teams = ylist(first.teams);
  const sides = [];
  for (const t of teams) {
    const team = yrecord(t, "team");
    sides.push(await yahooSideSummary(team, week));
  }
  return sides;
}

export async function yahooSideSummary(team, week) {
  const logos = ylist(team.team_logos).map(l => (l.team_logo || {}).url).filter(Boolean);
  const pts = Number((team.team_points || {}).total) || 0;
  const proj = Number((team.team_projected_points || {}).total) || 0;
  const standing = team.team_standings || {};
  const rec = standing.outcome_totals || {};

  let starters = [];
  let bench = [];
  if (team.team_key) {
    try {
      const roster = await yahooRoster(team.team_key, week);
      starters = roster.starters;
      bench = roster.bench;
    } catch (e) { /* a roster that won't load shouldn't blank the whole matchup */ }
  }

  return {
    id: team.team_key || team.team_id,
    name: team.name || ("Team " + (team.team_id || "")),
    owner: ((ylist(team.managers)[0] || {}).manager || {}).nickname || "",
    logo: logos[0] || "",
    record: (rec.wins || 0) + "-" + (rec.losses || 0) + (rec.ties ? "-" + rec.ties : ""),
    pts, proj, starters, bench
  };
}

export async function yahooRoster(teamKey, week) {
  const wk = week ? ";week=" + week : "";
  const d = await yahooGet("team/" + teamKey + "/roster" + wk + "/players/stats;type=week" + (week ? ";week=" + week : ""));
  const team = yrecord((d.fantasy_content || {}).team, null);
  const players = ylist((team.roster || {}).players || ((team.roster || {})["0"] || {}).players);

  const starters = [];
  const bench = [];
  for (const p of players) {
    const pl = yrecord(p, "player");
    const slot = ((pl.selected_position && ymerge(pl.selected_position)) || {}).position || "";
    const entry = {
      id: pl.player_key || pl.player_id,
      name: (pl.name || {}).full || "",
      pos: POS_CLEAN(slot || (pl.primary_position || "")),
      pts: Number((pl.player_points || {}).total) || 0,
      projPts: Number((pl.player_projected_points || {}).total) || 0,
      teamAbbr: pl.editorial_team_abbr || null,
      injury: pl.status_full || pl.status || "ACTIVE"
    };
    if (slot === "BN" || slot === "IR") bench.push(entry); else starters.push(entry);
  }
  return { starters, bench };
}

/* ---------------------------- standings ---------------------------- */
export async function yahooStandings(leagueKey) {
  const d = await yahooGet("league/" + leagueKey + "/standings");
  const league = yrecord((d.fantasy_content || {}).league, null);
  const teams = ylist((league.standings || {}).teams || ((league.standings || {})["0"] || {}).teams);

  const rows = teams.map(t => {
    const team = yrecord(t, "team");
    const s = team.team_standings || {};
    const rec = s.outcome_totals || {};
    const wins = Number(rec.wins) || 0, losses = Number(rec.losses) || 0, ties = Number(rec.ties) || 0;
    const games = wins + losses + ties;
    return {
      name: team.name || "",
      owner: ((ylist(team.managers)[0] || {}).manager || {}).nickname || "",
      wins, losses, ties,
      pf: Number(s.points_for) || 0,
      pa: Number(s.points_against) || 0,
      // Ties count half, matching how the ESPN and Sleeper adapters already rank.
      pct: games ? (wins + ties / 2) / games : 0
    };
  });

  rows.sort((a, b) => b.pct - a.pct || b.pf - a.pf);
  return rows.map((s, i) => ({
    rank: i + 1, name: s.name, owner: s.owner,
    record: s.wins + "-" + s.losses + (s.ties ? "-" + s.ties : ""),
    pf: s.pf, pa: s.pa
  }));
}

/* ---------------------------- attribution ----------------------------
   Yahoo's terms require this wherever their data shows, linking back, with their
   logo, and specifically NOT combined with another brand's marks — so give it its
   own line rather than setting it beside the Daraja wordmark. */
export const YAHOO_ATTRIBUTION_HTML =
  '<a class="yh-credit" href="https://football.fantasysports.yahoo.com/" target="_blank" rel="noopener">' +
  '<img src="yahoo-fantasy-logo.png" alt="Yahoo Fantasy" height="16">' +
  '<span>Fantasy data provided by Yahoo Fantasy</span></a>';
