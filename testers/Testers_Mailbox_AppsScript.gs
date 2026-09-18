/**
 * Testers' List mailbox — Google Apps Script
 * ------------------------------------------------------------------
 * One shared place for the Daraja testers: who tried what, the problems and
 * ideas they post, and the 👍 "me too" taps. The page at
 * jerrywins1.github.io/daraja-apps/testers/ reads and writes here.
 * Data lives in a Google Sheet this script creates next to itself.
 *
 * FIVE-MINUTE DEPLOY (same recipe as Pit Wall, Family Sync and Zuri HQ)
 *  1. Go to https://script.google.com/home → New project → delete the sample code.
 *  2. Paste this whole file → 💾 save → name it "Testers mailbox".
 *  3. Deploy → New deployment → ⚙ type: Web app
 *        Execute as: Me · Who has access: Anyone → Deploy → Authorize
 *        (Google will warn; Advanced → Go to Testers mailbox).
 *  4. Copy the Web app URL (ends in /exec).
 *  5. Tell Claude: "the testers mailbox is https://…/exec". He wires it in a minute.
 *     Testers just open the page link; nothing to install, no accounts.
 */
var SHEET = 'board';
var MAX_POSTS = 500;

function doGet(e) {
  var st = load_();
  return out_({ ok: true, posts: st.posts, tried: st.tried, at: new Date().toISOString() });
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) { return out_({ ok: false, error: 'Busy, try again' }); }
  try {
    var b = JSON.parse(e.postData.contents || '{}');
    var st = load_();
    var name = clean_(b.name, 40); if (!name) return out_({ ok: false, error: 'Who are you? Add your name first.' });
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
function load_() { try { var v = sheet_().getRange(1, 1).getValue(); var st = JSON.parse(v || '{}'); st.posts = st.posts || []; st.tried = st.tried || {}; return st; } catch (e) { return { posts: [], tried: {} }; } }
function save_(st) { sheet_().getRange(1, 1).setValue(JSON.stringify(st)); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
