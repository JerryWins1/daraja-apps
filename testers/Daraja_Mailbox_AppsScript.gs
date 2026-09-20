/**
 * Daraja mailbox — Google Apps Script (testers' board · help questions · "tell me when" signups)
 * ------------------------------------------------------------------
 * One shared place for the Daraja testers: who tried what, the problems and
 * ideas they post, and the 👍 "me too" taps. The page at
 * jerrywins1.github.io/daraja-apps/testers/ reads and writes here.
 * Data lives in a Google Sheet this script creates next to itself.
 *
 * FIVE-MINUTE DEPLOY (same recipe as Pit Wall, Family Sync and Zuri HQ)
 *  1. Go to https://script.google.com/home → New project → delete the sample code.
 *  2. Paste this whole file → 💾 save → name it "Daraja mailbox".
 *  3. Deploy → New deployment → ⚙ type: Web app
 *        Execute as: Me · Who has access: Anyone → Deploy → Authorize
 *        (Google will warn; Advanced → Go to Daraja mailbox).
 *  4. Copy the Web app URL (ends in /exec).
 *  5. Tell Claude: "the Daraja mailbox is https://…/exec". He wires it in a minute.
 *     Testers just open the page link; nothing to install, no accounts.
 */
var SHEET = 'board';
var MAX_POSTS = 500;

function doGet(e) {
  var st = load_();
  var pub = { ok: true, posts: st.posts, tried: st.tried, at: new Date().toISOString(), subs: (st.subs || []).length };
  if (e && e.parameter && e.parameter.jerry === '1') { pub.helps = st.helps || []; pub.subsList = st.subs || []; }   /* the Control Center asks with ?jerry=1 */
  return out_(pub);
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) { return out_({ ok: false, error: 'Busy, try again' }); }
  try {
    var b = JSON.parse(e.postData.contents || '{}');
    var st = load_();
    var name = clean_(b.name, 40); if (!name && b.action !== 'subscribe') return out_({ ok: false, error: 'Who are you? Add your name first.' });
    name = name || 'someone';
    var now = new Date().toISOString();
    if (b.action === 'post') {
      var text = clean_(b.text, 600); if (!text) return out_({ ok: false, error: 'Say something first.' });
      st.posts.unshift({ id: Utilities.getUuid().slice(0, 8), name: name, app: clean_(b.app, 40), kind: clean_(b.kind, 12) || 'idea', text: text, at: now, likes: [], fixed: '' });
      if (st.posts.length > MAX_POSTS) st.posts.length = MAX_POSTS;
    } else if (b.action === 'tried') {
      st.tried[name] = st.tried[name] || {}; st.tried[name][clean_(b.app, 40)] = now;
    } else if (b.action === 'like') {
      var p = find_(st, b.id); if (p && p.likes.indexOf(name) < 0) p.likes.push(name);
    } else if (b.action === 'fixed') {           /* Jerry or Claude marks a post fixed; the word is the version or the date */
      if (clean_(b.by, 40).toLowerCase() !== 'jerry' && clean_(b.by, 40).toLowerCase() !== 'claude') return out_({ ok: false, error: 'Only Jerry or Claude can mark fixed.' });
      var q = find_(st, b.id); if (q) q.fixed = clean_(b.note, 80) || now.slice(0, 10);
    } else if (b.action === 'help') {          /* a question from the Help page — name, how to reach them, which app, the words */
      var q2 = clean_(b.text, 800); if (!q2) return out_({ ok: false, error: 'Say what you need help with.' });
      st.helps = st.helps || []; st.helps.unshift({ id: Utilities.getUuid().slice(0, 8), name: name, contact: clean_(b.contact, 80), app: clean_(b.app, 40), text: q2, at: now, answered: '' });
      if (st.helps.length > 300) st.helps.length = 300;
      save_(st); return out_({ ok: true, thanks: true });
    } else if (b.action === 'subscribe') {     /* "tell me when things change" — one line per person */
      var c = clean_(b.contact, 80); if (!c) return out_({ ok: false, error: 'An email or a mobile number, so we can reach you.' });
      st.subs = st.subs || []; if (!st.subs.some(function (x) { return x.contact.toLowerCase() === c.toLowerCase(); })) st.subs.push({ name: name, contact: c, at: now, from: clean_(b.from, 40) });
      save_(st); return out_({ ok: true, thanks: true, subs: st.subs.length });
    } else if (b.action === 'answered') {
      if (clean_(b.by, 40).toLowerCase() !== 'jerry' && clean_(b.by, 40).toLowerCase() !== 'claude') return out_({ ok: false, error: 'Only Jerry or Claude.' });
      (st.helps || []).forEach(function (h) { if (h.id === b.id) h.answered = clean_(b.note, 80) || now.slice(0, 10); });
      save_(st); return out_({ ok: true });
    } else return out_({ ok: false, error: 'Unknown action' });
    save_(st);
    return out_({ ok: true, posts: st.posts, tried: st.tried, at: now });
  } catch (err) { return out_({ ok: false, error: String(err && err.message || err) }); }
  finally { lock.releaseLock(); }
}
function find_(st, id) { for (var i = 0; i < st.posts.length; i++) if (st.posts[i].id === id) return st.posts[i]; return null; }
function clean_(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n); }
function sheet_() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('ssid'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create('Testers mailbox'); props.setProperty('ssid', ss.getId()); }
  var sh = ss.getSheetByName(SHEET); if (!sh) { sh = ss.insertSheet(SHEET); sh.getRange(1, 1).setValue('{"posts":[],"tried":{}}'); }
  return sh;
}
function load_() { try { var v = sheet_().getRange(1, 1).getValue(); var st = JSON.parse(v || '{}'); st.posts = st.posts || []; st.tried = st.tried || {}; st.helps = st.helps || []; st.subs = st.subs || []; return st; } catch (e) { return { posts: [], tried: {}, helps: [], subs: [] }; } }
function save_(st) { sheet_().getRange(1, 1).setValue(JSON.stringify(st)); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
