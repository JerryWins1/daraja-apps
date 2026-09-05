/**
 * Pit Wall mailbox — Google Apps Script
 * ------------------------------------------------------------------
 * One shared place for the F1 Group's picks, settings and paddock chat.
 * The app (jerrywins1.github.io/daraja-apps/f1/) reads and writes here.
 * Data is stored in a Google Sheet that this script creates next to itself.
 *
 * FIVE-MINUTE DEPLOY (same recipe as Family Sync and Zuri HQ)
 *  1. Go to https://script.google.com/home → New project → delete the sample code.
 *  2. Paste this whole file → 💾 save → name it "Pit Wall mailbox".
 *  3. Deploy → New deployment → ⚙ type: Web app
 *        Execute as: Me · Who has access: Anyone → Deploy → Authorize (Google will warn; Advanced → Go to Pit Wall mailbox).
 *  4. Copy the Web app URL (ends in /exec).
 *  5. In the app: Setup → Mailbox → paste the URL → Connect. Your device's league data seeds the mailbox.
 *     Everyone else just opens the app link; it is already connected once you share it.
 *
 * What it enforces (the app enforces the same, this is the backstop):
 *  - Every player has a PIN. First PIN sent for a player is accepted and kept.
 *  - Picks after the deadline are rejected unless the commissioner sends them.
 *  - Only the commissioner can change settings, rosters, scoring, history, or other people's picks.
 */

var SHEET_NAME = 'state';
var MAX_CHAT = 300;

function doGet(e) {
  if (e && e.parameter && e.parameter.live) return out_(liveSnapshot_());
  var key = (e && e.parameter && e.parameter.league) || 'f1';
  var st = load_(key);
  return out_(st ? { ok: true, state: publicState_(st) } : { ok: true, empty: true });
}

/* ---------- live timing relay ----------
   The free F1 live timing page is fed by plain files on livetiming.formula1.com. A browser may not be
   allowed to read them directly, so the app asks this script, which fetches them, replays the patches
   into the current state, trims it down, and caches the answer for 40 seconds so five phones polling
   every minute cost one fetch. */
var LT_BASE = 'https://livetiming.formula1.com/static/';
function liveSnapshot_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('live_v1'); if (hit) return JSON.parse(hit);
  var res;
  try {
    var si = JSON.parse(UrlFetchApp.fetch(LT_BASE + 'SessionInfo.json', { muteHttpExceptions: true, followRedirects: true }).getContentText());
    var path = si.Path || '';
    var dlText = UrlFetchApp.fetch(LT_BASE + path + 'DriverList.jsonStream', { muteHttpExceptions: true }).getContentText();
    var tdText = UrlFetchApp.fetch(LT_BASE + path + 'TimingData.jsonStream', { muteHttpExceptions: true }).getContentText();
    var dl = mergeStream_(dlText), td = mergeStream_(tdText);
    var drivers = {}, lines = {};
    var dlLines = dl.Lines || dl;
    for (var n in dlLines) { var d = dlLines[n] || {}; if (d && (d.Tla || d.LastName)) drivers[n] = { Tla: d.Tla || '', LastName: d.LastName || d.BroadcastName || '' }; }
    var tdLines = (td && td.Lines) || {};
    for (var m in tdLines) { var L = tdLines[m] || {}; lines[m] = { Position: L.Position, Retired: !!L.Retired, Stopped: !!L.Stopped, NumberOfLaps: L.NumberOfLaps, BestLapTime: { Value: L.BestLapTime && L.BestLapTime.Value || '' } }; }
    res = { ok: true, session: { meeting: si.Meeting && si.Meeting.Name, type: si.Type, name: si.Name, start: si.StartDate, end: si.EndDate, gmt: si.GmtOffset, path: path }, driverList: drivers, timing: { Lines: lines }, at: new Date().toISOString(), source: 'mailbox' };
  } catch (err) { res = { ok: false, error: 'Live timing not reachable: ' + String(err && err.message || err), at: new Date().toISOString() }; }
  try { cache.put('live_v1', JSON.stringify(res), 40); } catch (e2) { }
  return res;
}
function deepMerge_(target, patch) {
  if (patch === null || typeof patch !== 'object') return patch;
  if (target === null || typeof target !== 'object') target = Array.isArray(patch) ? [] : {};
  for (var k in patch) target[k] = deepMerge_(target[k], patch[k]);
  return target;
}
function mergeStream_(text) {
  var state = {}; var lines = String(text || '').split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) { var j = lines[i].indexOf('{'); if (j < 0) continue; try { state = deepMerge_(state, JSON.parse(lines[i].slice(j))); } catch (e) { } }
  return state;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) { return out_({ ok: false, error: 'Busy, try again' }); }
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var key = body.league || 'f1';
    var st = load_(key);
    var action = body.action;

    if (action === 'seed') {
      if (st) return out_({ ok: true, state: publicState_(st) });         // already seeded: hand back the truth
      if (!body.seedState || !body.seedState.players) return out_({ ok: false, error: 'Nothing to seed' });
      st = body.seedState; st.league = st.league || {}; delete st.league.mailboxUrl;
      save_(key, st); return out_({ ok: true, state: publicState_(st) });
    }
    if (!st) return out_({ ok: false, error: 'Mailbox is empty. Connect from the commissioner\'s device first.' });

    var player = findPlayer_(st, body.player);
    if (!player) return out_({ ok: false, error: 'Unknown player' });
    var pin = String(body.pin || '');
    if (!/^\d{4,6}$/.test(pin)) return out_({ ok: false, error: 'PIN is 4 to 6 digits' });
    if (!player.pin) { player.pin = pin; save_(key, st); }
    else if (player.pin !== pin) return out_({ ok: false, error: 'That PIN does not match' });
    var isCommish = st.league && st.league.commissioner === player.id;

    if (action === 'hello') return out_({ ok: true, state: publicState_(st) });

    if (action === 'pick') {
      var s = st.seasons && st.seasons[body.year];
      if (!s) return out_({ ok: false, error: 'No such season' });
      var dl = s.deadlines && s.deadlines[body.raceKey];
      if (dl && new Date() >= new Date(dl) && !isCommish) return out_({ ok: false, error: 'Picks are locked for this race' });
      var pk = body.pick || {};
      var clean = pk.wildcard ? { wildcard: true } : { drivers: (pk.drivers || []).slice(0, 4) };
      clean.ts = new Date().toISOString();
      s.picks = s.picks || {}; s.picks[body.raceKey] = s.picks[body.raceKey] || {};
      s.picks[body.raceKey][player.id] = clean;
      save_(key, st); return out_({ ok: true, state: publicState_(st) });
    }

    if (action === 'chat') {
      var text = String(body.text || '').trim().slice(0, 500);
      if (!text) return out_({ ok: false, error: 'Empty message' });
      st.paddock = st.paddock || [];
      st.paddock.push({ id: Utilities.getUuid().slice(0, 8), player: player.id, text: text, ts: new Date().toISOString() });
      if (st.paddock.length > MAX_CHAT) st.paddock = st.paddock.slice(-MAX_CHAT);
      save_(key, st); return out_({ ok: true, state: publicState_(st) });
    }

    if (action === 'set') {
      if (!isCommish) return out_({ ok: false, error: 'Only the commissioner can change that' });
      var path = body.path || [];
      if (!path.length) return out_({ ok: false, error: 'No path' });
      if (path[0] === 'players' && path[2] === 'pin') return out_({ ok: false, error: 'Use resetpin' });
      var o = st;
      for (var i = 0; i < path.length - 1; i++) { if (o[path[i]] == null || typeof o[path[i]] !== 'object') o[path[i]] = (typeof path[i + 1] === 'number') ? [] : {}; o = o[path[i]]; }
      if (body.value === null || body.value === undefined) delete o[path[path.length - 1]]; else o[path[path.length - 1]] = body.value;
      if (path[0] === 'league') delete st.league.mailboxUrl;
      save_(key, st); return out_({ ok: true, state: publicState_(st) });
    }

    if (action === 'resetpin') {
      if (!isCommish) return out_({ ok: false, error: 'Only the commissioner can reset a PIN' });
      var t = findPlayer_(st, body.target); if (t) t.pin = '';
      save_(key, st); return out_({ ok: true, state: publicState_(st) });
    }

    return out_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message || err) });
  } finally { lock.releaseLock(); }
}

/* ---------- storage: one row per league in a sheet next to this script ---------- */
function sheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create('Pit Wall mailbox data'); props.setProperty('SHEET_ID', ss.getId()); }
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  return sh;
}
function load_(key) {
  var sh = sheet_(); var rows = sh.getDataRange().getValues();
  for (var i = 0; i < rows.length; i++) if (rows[i][0] === key) {
    // JSON may span several cells (50k chars per cell limit)
    var parts = []; for (var c = 1; c < rows[i].length; c++) if (rows[i][c] !== '') parts.push(String(rows[i][c]));
    try { return JSON.parse(parts.join('')); } catch (e) { return null; }
  }
  return null;
}
function save_(key, st) {
  var sh = sheet_(); var rows = sh.getDataRange().getValues(); var row = -1;
  for (var i = 0; i < rows.length; i++) if (rows[i][0] === key) row = i + 1;
  if (row < 0) row = Math.max(1, sh.getLastRow() + 1);
  var json = JSON.stringify(st); var chunks = []; for (var p = 0; p < json.length; p += 45000) chunks.push(json.slice(p, p + 45000));
  sh.getRange(row, 1, 1, Math.max(sh.getMaxColumns(), chunks.length + 1)).clearContent();
  sh.getRange(row, 1).setValue(key);
  sh.getRange(row, 2, 1, chunks.length).setValues([chunks]);
}
function findPlayer_(st, id) { var ps = (st && st.players) || []; for (var i = 0; i < ps.length; i++) if (ps[i].id === id) return ps[i]; return null; }
// Never send PINs back to the browser.
function publicState_(st) {
  var copy = JSON.parse(JSON.stringify(st));
  (copy.players || []).forEach(function (p) { p.hasPin = !!p.pin; delete p.pin; });
  return copy;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
