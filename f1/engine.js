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

  const CLASSIFIED = /^(Finished|Lapped|\+\d+ Laps?)$/;   /* 7 Oct deep check: "Lapped" (2026 data) is a classified finish */

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
        const ok = !scoring.unclassifiedScoresZero || s.classified === true || CLASSIFIED.test(s.status || 'Finished');
        d.sprint = ok ? (scoring.sprintUsesRows ? rowPoints(s.position, scoring) : racePlacePoints(s.position, scoring)) : 0;
        if (s.fastestLap && scoring.sprintFastestLapBonus) d.fl += scoring.sprintFastestLapBonus;
      }
      if (results.race && results.race[id]) {
        const r = results.race[id];
        d.status = r.status || '';
        const ok = !scoring.unclassifiedScoresZero || r.classified === true || CLASSIFIED.test(r.status || 'Finished');
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


  /* ---------------------- planning the rest of the season ----------------------
     One fact drives all of this: a driver can run at most once in a race. So a
     driver's drives are only worth something up to the number of races left —
     eleven drives with eight races to go is eight drives and three wasted, and no
     amount of cleverness changes that. Everything below is that arithmetic, laid
     out so a player can check it against his own card. It makes no prediction
     about who will be fast; that part is left to the briefing and a human. */
  function seasonPlan(o) {
    const allRaces = Math.max(0, (o.racesLeft || []).length);
    const perRace = o.perRace || 2;
    // Picks already in for the next race have ALREADY come off that player's drives, so for him
    // that weekend is settled: counting it as a slot again would invent a shortfall that is not real.
    const picked = o.alreadyPicked || {};
    const nm = o.name || (x => x);
    const lead = (o.standings && o.standings.length) ? (+o.standings[0].pts || 0) : 0;

    const rows = (o.players || []).map(p => {
      const races = Math.max(0, allRaces - (picked[p.id] ? 1 : 0));
      const roster = (o.roster && o.roster[p.id]) || [];
      const rem = (o.remaining && o.remaining[p.id]) || {};
      const left = d => Math.max(0, +rem[d] || 0);
      const wild = Math.max(0, +rem._wild || 0);

      const usable = roster.filter(d => left(d) > 0);
      const spent = roster.filter(d => left(d) <= 0);
      // what a driver's drives are actually worth, and what can never be spent
      const effective = roster.reduce((a, d) => a + Math.min(left(d), races), 0);
      const stranded = roster.reduce((a, d) => a + Math.max(0, left(d) - races), 0);
      // a wild card weekend fills every slot and uses nobody's drives
      const capNoWild = races * perRace;
      const capAllWild = Math.max(0, (races - wild) * perRace);
      const surplus = Math.max(0, effective - capNoWild);
      const shortfall = Math.max(0, capNoWild - effective);
      const wildCost = Math.max(0, effective - capAllWild) - surplus;
      // a driver with at least as many drives as there are races has to run every one
      const forced = usable.filter(d => left(d) >= races);
      const locked = races > 0 && usable.length > 0 && usable.length <= perRace;

      const st = (o.standings || []).find(x => x.id === p.id);
      const pts = st ? (+st.pts || 0) : 0;
      const behind = Math.max(0, lead - pts);

      const lines = [];
      if (!races) lines.push({ k: 'done', t: 'The season is over — nothing left to plan.' });
      else if (!usable.length) lines.push({ k: 'bad', t: 'No drives left on anybody. Every remaining weekend will be auto-drafted and score nothing.' });
      else {
        if (locked) lines.push({ k: 'forced', t: 'Your lineup is already decided: <b>' + usable.map(nm).join('</b> and <b>') + '</b> every weekend, because nobody else has a drive left.' });
        else forced.forEach(d => lines.push({ k: 'forced', t: '<b>' + nm(d) + '</b> has ' + left(d) + ' drives and only ' + races + ' races left, so he has to run every single weekend.' }));
        if (stranded) lines.push({ k: 'waste', t: '<b>' + stranded + ' drive' + (stranded > 1 ? 's' : '') + ' can never be spent</b> — a driver can only run once in a race, and there are not enough races left.' });
        else if (surplus) lines.push({ k: 'waste', t: '<b>' + surplus + ' drive' + (surplus > 1 ? 's' : '') + ' more than slots</b> — that many will go unused whatever you do.' });
        if (shortfall) lines.push({ k: 'short', t: '<b>' + shortfall + ' slot' + (shortfall > 1 ? 's' : '') + ' you cannot fill.</b> Those weekends get auto-drafted from whoever still has a drive.' });
        if (wild && wildCost) lines.push({ k: 'wild', t: 'Playing ' + (wild > 1 ? 'both wild cards' : 'your wild card') + ' would strand ' + wildCost + ' more drive' + (wildCost > 1 ? 's' : '') + ', because a wild card weekend uses none.' });
        else if (wild) lines.push({ k: 'wild', t: 'Your wild card costs you nothing in drives — there is room for it.' });
        if (!wild) lines.push({ k: 'wild', t: 'No wild cards left.' });
        if (spent.length) lines.push({ k: 'spent', t: 'Used up: <b>' + spent.map(nm).join('</b>, <b>') + '</b>.' });
        if (!surplus && !shortfall && !stranded) lines.push({ k: 'ok', t: 'Your drives fit the races left exactly — nothing wasted, nothing short.' });
      }

      return {
        id: p.id, name: p.name, pts, behind, races, settledNext: !!picked[p.id],
        drives: roster.reduce((a, d) => a + left(d), 0),
        effective, stranded, surplus, shortfall, wild, wildCost,
        slots: capNoWild, locked,
        usable: usable.map(d => ({ id: d, name: nm(d), left: left(d), mustRunEvery: left(d) >= races })),
        spent: spent.map(d => ({ id: d, name: nm(d) })),
        lines
      };
    });

    return { races: allRaces, perRace, slots: allRaces * perRace, rows };
  }

  // The whole picture in plain words, for pasting into a chat. Everything the app
  // knows and nothing it doesn't: no guesses about pace, tracks or form.
  function seasonBrief(o) {
    const plan = seasonPlan(o);
    const nm = o.name || (x => x);
    const L = [];
    L.push('I am in a homegrown fantasy motor racing league with four friends. Help me plan the rest of the season.');
    L.push('');
    L.push('HOW IT WORKS');
    L.push('  Each player has ' + ((o.roster && o.players && o.players[0] && (o.roster[o.players[0].id] || []).length) || 4) + ' drivers for the year.');
    L.push('  Each race you run ' + plan.perRace + ' of them, and that uses one drive from each.');
    L.push('  Every driver starts the season with a fixed number of drives, so you cannot run a favourite every week.');
    L.push('  A wild card runs all your drivers at once and uses no drives at all.');
    L.push('  A driver can only be run once in a race, so drives beyond the number of races left are wasted.');
    L.push('  Points come from where your drivers qualify and finish, so a good car scores more.');
    L.push('');
    L.push('RACES LEFT (' + plan.races + ')');
    (o.racesLeft || []).forEach((r, i) => L.push('  ' + (i + 1) + '. ' + r.name + (r.sprint ? '  (sprint weekend — extra points)' : '') + (r.date ? '  ' + r.date : '')));
    L.push('');
    L.push('WHERE EVERYONE STANDS');
    (o.standings || []).forEach((t, i) => L.push('  ' + (i + 1) + '. ' + t.name + ' ' + t.pts + (i ? '  (' + (((+o.standings[0].pts) || 0) - (+t.pts || 0)) + ' behind)' : '  (leader)')));
    L.push('');
    plan.rows.forEach(r => {
      L.push((o.me && r.id === o.me ? 'MY TEAM — ' : '') + r.name.toUpperCase() + '  (' + r.pts + ' points)');
      r.usable.forEach(d => L.push('  ' + d.name + ': ' + d.left + ' drives left' + (d.mustRunEvery ? '  — more drives than races left, so he has to run every weekend' : '')));
      r.spent.forEach(d => L.push('  ' + d.name + ': none left'));
      L.push('  wild cards left: ' + r.wild);
      if (r.settledNext) L.push('  (picks are already in for the next race, so the numbers below cover the ' + r.races + ' races after it)');
      L.push('  Totals: ' + r.drives + ' drives on paper. Only ' + r.effective + ' of those can actually be run in ' +
        r.races + ' races, and there are ' + (r.races * (o.perRace || 2)) + ' slots to fill.');
      const why = [];
      if (r.stranded) why.push(r.stranded + ' drive' + (r.stranded > 1 ? 's are' : ' is') + ' stuck on drivers who already have more drives than there are races left');
      if (r.surplus) why.push(r.surplus + ' more drive' + (r.surplus > 1 ? 's' : '') + ' than slots, so that many go unused whichever drivers I pick');
      if (r.shortfall) why.push(r.shortfall + ' slot' + (r.shortfall > 1 ? 's' : '') + ' cannot be filled and will be auto-drafted');
      if (why.length) L.push('  So: ' + why.join('; ') + '.');
      else L.push('  So: an exact fit — nothing wasted, nothing short.');
      L.push('');
    });
    L.push('WHAT I WANT FROM YOU');
    L.push('1. Race by race, which drivers should I run, and why? Say where my hands are tied by the arithmetic and where I actually have a choice.');
    L.push('2. Which races should I save my best drivers for, and which are worth spending a weak driver on?');
    if (plan.rows.some(r => r.id === o.me && r.wild)) L.push('3. Which race should I use my wild card on?');
    L.push((plan.rows.some(r => r.id === o.me && r.wild) ? '4' : '3') + '. Can I still catch the leader? If not, who can I realistically finish above?');
    L.push('');
    L.push('Use what you know about the cars and the circuits this season. Keep it short and say plainly where you are guessing. If anything above looks wrong or out of date, tell me.');
    return L.join('\n');
  }

  return { snakeOrder, draftTurn, draftTaken, draftCheck, draftRosters, formatDraftOrder, formatDraftResult, DEFAULT_SCORING, suggestDrives, racePlacePoints, rowPoints, scoreLineup, usage, remaining, autoDraft, deadlineFor, fridayBefore, formatPost, formatUsage, ordinalList, deepMerge, mergeStream, liveBoard, fastestOf, lapToMs, seasonPlan, seasonBrief };
});
