/* Pit Wall — league engine. Pure functions, no DOM, no network.
   Loaded by index.html in the browser and by tests in node.
   Everything here is the rulebook: scoring tables, driver usage, wild cards,
   auto-draft, deadlines, and Steve's post format. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.F1Engine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- defaults (the 2025/2026 rules) ---------- */
  const DEFAULT_SCORING = {
    racePlace: [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1], // P1..P20; beyond = 0
    rowPoints:  [10,9,8,7,6,5,4,3,2,1],                              // row 1..10 (2 cars per row); beyond = 0
    sprintUsesRows: true,          // sprint race scored like qualifying (option B, 2025)
    fastestLapBonus: 5,            // only if that driver was in your lineup
    sprintFastestLapBonus: 0,      // floated in 2025, never voted in
    unclassifiedScoresZero: true,  // DNF / DSQ = 0 race points (qualifying still counts)
    perRace: 2                      // drivers run on a normal weekend
  };

  const CLASSIFIED = /^(Finished|\+\d+ Laps?)$/;

  /* ---------- allowance ---------- */
  // How many drives each driver should get so the season works out.
  // activeRaces: races that will actually happen; wildcards: per player; driversPer: drivers per player.
  function suggestDrives(activeRaces, wildcards, driversPer, perRace) {
    perRace = perRace || 2;
    const normal = Math.max(0, activeRaces - (wildcards || 0));
    const needed = normal * perRace;
    const each = Math.ceil(needed / Math.max(1, driversPer));
    return { drives: each, needed, capacity: each * driversPer, slack: each * driversPer - needed };
  }

  /* ---------- scoring ---------- */
  function racePlacePoints(pos, scoring) {
    const t = (scoring || DEFAULT_SCORING).racePlace; const p = Number(pos);
    return p >= 1 && p <= t.length ? t[p - 1] : 0;
  }
  function rowPoints(pos, scoring) {
    const t = (scoring || DEFAULT_SCORING).rowPoints; const p = Number(pos);
    if (!(p >= 1)) return 0;
    const row = Math.ceil(p / 2);
    return row <= t.length ? t[row - 1] : 0;
  }

  /* results shape (normalized from Jolpica):
     { quali: {driverId: position}, sprint: {driverId: {position, status}}, race: {driverId: {position, status, fastestLap:boolean}} }
     lineup: array of driverIds (2 normally, 4 on a wild card)
     returns { total, drivers: [{id, quali, sprint, race, fl, total}], fastestLapDriver } */
  function scoreLineup(lineup, results, scoring) {
    scoring = scoring || DEFAULT_SCORING;
    const out = { total: 0, drivers: [], fastestLapDriver: null };
    for (const id of lineup) {
      const d = { id, quali: 0, sprint: 0, race: 0, fl: 0, total: 0, status: '' };
      if (results.quali && results.quali[id]) d.quali = rowPoints(results.quali[id], scoring);
      if (results.sprint && results.sprint[id]) {
        const s = results.sprint[id];
        const ok = !scoring.unclassifiedScoresZero || CLASSIFIED.test(s.status || 'Finished');
        d.sprint = ok ? (scoring.sprintUsesRows ? rowPoints(s.position, scoring) : racePlacePoints(s.position, scoring)) : 0;
        if (s.fastestLap && scoring.sprintFastestLapBonus) d.fl += scoring.sprintFastestLapBonus;
      }
      if (results.race && results.race[id]) {
        const r = results.race[id];
        d.status = r.status || '';
        const ok = !scoring.unclassifiedScoresZero || CLASSIFIED.test(r.status || 'Finished');
        d.race = ok ? racePlacePoints(r.position, scoring) : 0;
        if (r.fastestLap) { d.fl += scoring.fastestLapBonus; out.fastestLapDriver = id; }
      }
      d.total = d.quali + d.sprint + d.race + d.fl;
      out.total += d.total;
      out.drivers.push(d);
    }
    return out;
  }

  /* ---------- usage ---------- */
  // picks: {round: {playerId: {drivers:[ids], wildcard:bool, auto:bool}}}
  // roster: {playerId: [driverIds]}
  // returns {playerId: {driverId: used, _wild: usedWildcards}}
  function usage(roster, picks, rounds) {
    const u = {};
    for (const p in roster) { u[p] = { _wild: 0 }; roster[p].forEach(d => u[p][d] = 0); }
    (rounds || Object.keys(picks || {})).forEach(r => {
      const rp = picks && picks[r]; if (!rp) return;
      for (const p in rp) {
        const pk = rp[p]; if (!pk || !u[p]) continue;
        if (pk.wildcard) { u[p]._wild++; continue; }           // wild cards don't burn drives
        (pk.drivers || []).forEach(d => { if (d in u[p]) u[p][d]++; });
      }
    });
    return u;
  }
  function remaining(roster, picks, rounds, drivesPer, wildcardsPer) {
    const u = usage(roster, picks, rounds); const out = {};
    for (const p in roster) {
      out[p] = { _wild: (wildcardsPer || 0) - u[p]._wild };
      roster[p].forEach(d => out[p][d] = drivesPer - u[p][d]);
    }
    return out;
  }

  /* ---------- auto-draft ---------- */
  // rank: {driverId: number} higher is better (F1 championship points to date, or fantasy points).
  // Returns the two highest-ranked drivers that still have drives left. Falls back to any with drives.
  function autoDraft(rosterForPlayer, remainingForPlayer, rank, perRace) {
    perRace = perRace || 2;
    const avail = rosterForPlayer.filter(d => (remainingForPlayer[d] || 0) > 0);
    avail.sort((a, b) => ((rank && rank[b]) || 0) - ((rank && rank[a]) || 0) || rosterForPlayer.indexOf(a) - rosterForPlayer.indexOf(b));
    return avail.slice(0, perRace);
  }

  /* ---------- deadlines ---------- */
  // race: normalized {date:'YYYY-MM-DD', time:'HH:MM:SSZ', qualifying:{date,time}, sprintQualifying:{date,time}}
  // rule: 'friday'  = 11:59 pm Friday Central before the race, or the first qualifying-type session if that is earlier (default; Steve's practice)
  //       'eve'     = 11:59 pm Central the night before the first qualifying-type session (Thursday for a Saturday race or a sprint weekend)
  //       'quali'   = the moment the first qualifying-type session starts
  function deadlineFor(race, rule, tz) {
    tz = tz || 'America/Chicago';
    const sessions = [];
    if (race.qualifying && race.qualifying.date) sessions.push(toDate(race.qualifying.date, race.qualifying.time));
    if (race.sprintQualifying && race.sprintQualifying.date) sessions.push(toDate(race.sprintQualifying.date, race.sprintQualifying.time));
    const firstQuali = sessions.length ? new Date(Math.min.apply(null, sessions.map(d => d.getTime()))) : null;
    const raceDay = toDate(race.date, race.time || '12:00:00Z');
    const friday = fridayBefore(raceDay, tz);
    if (!firstQuali) return friday;
    if (rule === 'quali') return firstQuali;
    if (rule === 'eve') {
      const p = partsIn(firstQuali, tz);
      const eve = atLocalTime(new Date(Date.UTC(p.y, p.m - 1, p.d - 1, 12, 0, 0)), tz, 23, 59);
      return new Date(Math.min(eve.getTime(), firstQuali.getTime()));
    }
    return new Date(Math.min(friday.getTime(), firstQuali.getTime()));
  }
  function toDate(date, time) { return new Date(date + 'T' + (time || '00:00:00Z').replace(/Z?$/, 'Z')); }
  // 23:59 local (tz) on the last Friday strictly before the race day (local).
  function fridayBefore(raceDay, tz) {
    const local = partsIn(raceDay, tz);              // y,m,d,weekday in tz
    let back = (local.weekday - 5 + 7) % 7; if (back === 0) back = 7; // Friday=5; if race is Friday, previous Friday
    const fri = new Date(Date.UTC(local.y, local.m - 1, local.d - back, 12, 0, 0));
    return atLocalTime(fri, tz, 23, 59);
  }
  function partsIn(date, tz) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' });
    const o = {}; f.formatToParts(date).forEach(p => o[p.type] = p.value);
    const wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
    return { y: +o.year, m: +o.month, d: +o.day, weekday: wd };
  }
  // Build the instant that is hh:mm in tz on the calendar day of `day` (a UTC-noon date).
  function atLocalTime(day, tz, hh, mm) {
    const p = partsIn(day, tz);
    let guess = new Date(Date.UTC(p.y, p.m - 1, p.d, hh, mm, 0));
    const off = tzOffsetMinutes(guess, tz);
    guess = new Date(guess.getTime() - off * 60000);
    return guess;
  }
  function tzOffsetMinutes(date, tz) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const o = {}; f.formatToParts(date).forEach(p => o[p.type] = p.value);
    const asUTC = Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second);
    return Math.round((asUTC - date.getTime()) / 60000);
  }

  /* ---------- Steve's post ---------- */
  function ordinalList(rows) {
    // rows: [{name, pts}] sorted desc; ties share the LOWER place number like Steve's posts ("3) jerry 3) robbi")
    let out = [], place = 0, prev = null, i = 0;
    rows.forEach(r => { i++; if (r.pts !== prev) place = i; prev = r.pts; out.push(place + ') ' + String(r.name).toLowerCase() + ' - ' + r.pts); });
    return out.join('\n');
  }
  function formatPost(o) {
    // o: {raceName, weekend:[{name,pts}], flDriverName, flPlayerName, flBonus, overall:[{name,pts}], next:{raceName, dateText, deadlineText, sprint}}
    const L = [];
    L.push(o.raceName.toLowerCase());
    L.push(''); L.push(ordinalList(o.weekend)); L.push('');
    if (o.flDriverName) L.push(o.flPlayerName ? ('fastest lap ' + o.flDriverName.toLowerCase() + ' ' + o.flPlayerName.toLowerCase() + ' gets ' + o.flBonus + ' bonus points') : ('fastest lap ' + o.flDriverName.toLowerCase() + '..no bonus points awarded'));
    L.push(''); L.push('overall'); L.push(''); L.push(ordinalList(o.overall));
    if (o.next) { L.push(''); L.push('next up is the ' + o.next.raceName.toLowerCase() + ' ' + o.next.dateText + '. please submit ur drivers by ' + o.next.deadlineText + (o.next.sprint ? '. this is a sprint race weekend' : '') + ' 🤓👍🏎🏁'); }
    return L.join('\n');
  }
  function formatUsage(o) {
    // o: {year, afterRaceName, players:[{name, drivers:[{name, left, of}], wildLeft, wildOf}]}
    const L = [o.year + ' formula one driver usage list' + (o.afterRaceName ? ' after ' + o.afterRaceName.toLowerCase() : '')];
    o.players.forEach(p => {
      L.push(''); L.push(p.name.toLowerCase());
      p.drivers.forEach((d, i) => L.push((i + 1) + ') ' + d.name.toLowerCase() + ' ' + d.left + '/' + d.of));
      L.push((p.drivers.length + 1) + ') wild card ' + p.wildLeft + '/' + p.wildOf);
    });
    return L.join('\n');
  }

  /* ---------- F1 live timing (.jsonStream) ---------- */
  // The free live timing page is fed by files where every line is "HH:MM:SS.mmm{json patch}".
  // Replaying the patches in order gives the current state. Arrays arrive as objects keyed by index.
  function deepMerge(target, patch) {
    if (patch === null || typeof patch !== 'object') return patch;
    if (target === null || typeof target !== 'object') target = Array.isArray(patch) ? [] : {};
    for (const k in patch) target[k] = deepMerge(target[k], patch[k]);
    return target;
  }
  function mergeStream(text) {
    let state = {};
    String(text || '').split(/\r?\n/).forEach(line => {
      const i = line.indexOf('{'); if (i < 0) return;
      try { state = deepMerge(state, JSON.parse(line.slice(i))); } catch (e) { /* skip a torn line */ }
    });
    return state;
  }
  // TimingData + DriverList -> [{num, tla, name, pos, retired, stopped, lap, best}] sorted by position.
  function liveBoard(timing, driverList) {
    const lines = (timing && timing.Lines) || {}; const dl = (driverList && driverList.Lines) || driverList || {};
    const out = [];
    for (const num in lines) {
      const L = lines[num] || {}; const D = dl[num] || {};
      const pos = parseInt(L.Position, 10);
      out.push({ num, tla: D.Tla || '', name: D.LastName || D.BroadcastName || num, pos: isNaN(pos) ? 99 : pos,
        retired: !!L.Retired, stopped: !!L.Stopped, lap: L.NumberOfLaps != null ? +L.NumberOfLaps : null,
        best: L.BestLapTime && L.BestLapTime.Value ? L.BestLapTime.Value : null });
    }
    out.sort((a, b) => a.pos - b.pos);
    return out;
  }
  function lapToMs(v) { if (!v) return Infinity; const m = String(v).match(/^(?:(\d+):)?(\d+)\.(\d+)$/); if (!m) return Infinity; return ((+m[1] || 0) * 60 + (+m[2])) * 1000 + parseInt((m[3] + '00').slice(0, 3), 10); }
  function fastestOf(board) { let best = null; board.forEach(d => { const ms = lapToMs(d.best); if (ms < Infinity && (!best || ms < best.ms)) best = { num: d.num, tla: d.tla, ms }; }); return best; }

  /* ---------- the draft (once a year, snake order) ----------
     Round 1 is drawn at random; round 2 reverses it; round 3 repeats round 1; round 4 reverses again.
     Four rounds for four drivers each. `seed` makes the draw repeatable (tests, or a draw everyone can verify). */
  function seededRandom(seed) { let x = (seed >>> 0) || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function snakeOrder(playerIds, rounds, seed) {
    const first = playerIds.slice(); const rnd = seed == null ? Math.random : seededRandom(seed);
    for (let i = first.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [first[i], first[j]] = [first[j], first[i]]; }
    const out = []; for (let r = 0; r < rounds; r++) out.push(r % 2 === 0 ? first.slice() : first.slice().reverse());
    return out;
  }
  // draft = { order: [[ids]...], picks: [{player, driver}] }. Returns who is on the clock, or null when the draft is complete.
  function draftTurn(draft) {
    const order = (draft && draft.order) || []; const n = (draft && draft.picks || []).length;
    let i = n; for (let r = 0; r < order.length; r++) { if (i < order[r].length) return { round: r + 1, slot: i + 1, player: order[r][i], overall: n + 1, total: order.reduce((a, x) => a + x.length, 0) }; i -= order[r].length; }
    return null;
  }
  function draftTaken(draft) { return ((draft && draft.picks) || []).map(p => p.driver); }
  // Validate a pick without applying it. Returns '' when fine, else the reason.
  function draftCheck(draft, playerId, driverId, allowedDrivers) {
    if (!draft || draft.status !== 'open') return 'The draft is not open';
    const t = draftTurn(draft); if (!t) return 'The draft is complete';
    if (t.player !== playerId) return 'Not your turn';
    if (!driverId) return 'Pick a driver';
    if (draftTaken(draft).includes(driverId)) return 'Already taken';
    if (allowedDrivers && allowedDrivers.length && !allowedDrivers.includes(driverId)) return 'Not on the entry list';
    return '';
  }
  // Rosters from a finished (or partial) draft, in pick order per player.
  function draftRosters(draft) { const out = {}; (draft && draft.order || []).forEach(r => r.forEach(p => out[p] = out[p] || [])); ((draft && draft.picks) || []).forEach(p => { (out[p.player] = out[p.player] || []).push(p.driver); }); return out; }
  // Steve's "2026 f1 draft order" post
  function formatDraftOrder(order, names, year) {
    const nm = id => (names && names[id]) || id;
    return year + ' draft order\n\n' + order.map((r, i) => 'round ' + (i + 1) + '\n' + r.map((p, j) => (j + 1) + ') ' + String(nm(p)).toLowerCase()).join('\n')).join('\n\n');
  }
  // Steve's driver list "at full allowance": hamilton 12/12
  function formatDraftResult(rosters, names, driverNames, drivesPer, year) {
    const nm = id => (names && names[id]) || id, dn = id => (driverNames && driverNames[id]) || id;
    return year + ' drivers\n\n' + Object.keys(rosters).map(p => String(nm(p)).toLowerCase() + '\n' + rosters[p].map((d, i) => (i + 1) + ') ' + String(dn(d)).toLowerCase() + ' ' + drivesPer + '/' + drivesPer).join('\n')).join('\n\n');
  }

  return { snakeOrder, draftTurn, draftTaken, draftCheck, draftRosters, formatDraftOrder, formatDraftResult, DEFAULT_SCORING, suggestDrives, racePlacePoints, rowPoints, scoreLineup, usage, remaining, autoDraft, deadlineFor, fridayBefore, formatPost, formatUsage, ordinalList, deepMerge, mergeStream, liveBoard, fastestOf, lapToMs };
});
