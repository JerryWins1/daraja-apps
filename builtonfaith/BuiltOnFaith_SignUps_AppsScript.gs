/**
 * Built on Faith — sign-up box (Google Apps Script)
 * ------------------------------------------------------------------
 * The dresser sign-up page at jerrywins1.github.io/daraja-apps/builtonfaith/
 * posts here when somebody taps "Count me in".
 *
 * WHY THIS EXISTS AT ALL. Until now those sign-ups went into the Kenyan
 * testers' mailbox, filed as support tickets. A neighbour's name and phone
 * number do not belong there. This box is Built on Faith's own, and nothing
 * else writes to it.
 *
 * WHAT IT DOES WITH A SIGN-UP
 *  · writes one row in a Google Sheet it makes next to itself, and
 *  · emails it to you straight away, so you see it without opening anything.
 *
 * WHAT IT WILL NOT DO. A plain GET returns only how many people have signed
 * up — never a name, never a number. There is no "show me everyone" link to
 * guess or leak, which is exactly the hole the old box had.
 *
 * FIVE-MINUTE DEPLOY (the same recipe as the other Daraja boxes)
 *  1. Go to https://script.google.com/home → New project → delete the sample code.
 *  2. Paste this whole file → save → name it "Built on Faith sign-ups".
 *  3. Deploy → New deployment → type: Web app
 *        Execute as: Me · Who has access: Anyone → Deploy → Authorize
 *        (Google warns about an unverified app; Advanced → Go to Built on Faith sign-ups.)
 *  4. Copy the Web app URL. It ends in /exec.
 *  5. Give that URL to the Built on Faith chat. It goes in builtonfaith/config.json
 *     and the page starts using it. The URL is public by design — the page has to
 *     call it — which is why this script hands back no personal details.
 */
var SHEET = 'signups';

function doGet() {
  return out_({ ok: true, count: rows_().length });   /* a count and nothing else, on purpose */
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) { return out_({ ok: false, error: 'Busy, try again' }); }
  try {
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (b.action !== 'signup') return out_({ ok: false, error: 'Unknown action' });
    var name = clean_(b.name, 60);
    if (!name) return out_({ ok: false, error: 'Please add your name.' });
    var contact = clean_(b.contact, 80);
    if (!contact) return out_({ ok: false, error: 'Please add a phone or email so we can reach you.' });
    var row = [new Date(), name, contact, clean_(b.how, 10), clean_(b.count, 6), clean_(b.day, 12), clean_(b.note, 300)];
    sheet_().appendRow(row);
    tell_(row);
    return out_({ ok: true, thanks: true });
  } catch (err) {
    return out_({ ok: false, error: String((err && err.message) || err) });
  } finally {
    lock.releaseLock();
  }
}

/* email it to whoever owns this script, so a sign-up reaches you without you looking */
function tell_(r) {
  try {
    var to = Session.getEffectiveUser().getEmail();
    if (!to) return;
    MailApp.sendEmail(to, 'Built on Faith: ' + r[1] + ' is in',
      r[1] + ' signed up for the build day.\n\n' +
      'Reach them: ' + r[2] + (r[3] ? ' (prefers ' + r[3] + ')' : '') + '\n' +
      'Coming: ' + (r[4] || '1') + '\n' +
      (r[5] ? 'Build day: ' + r[5] + '\n' : '') +
      (r[6] ? 'They said: ' + r[6] + '\n' : '') +
      '\nThe full list is in the "Built on Faith sign-ups" sheet in your Drive.');
  } catch (err) { /* a sign-up is saved even if the email fails */ }
}

function rows_() {
  var sh = sheet_(), n = sh.getLastRow();
  return n < 2 ? [] : sh.getRange(2, 1, n - 1, 1).getValues();
}
function clean_(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n); }
function sheet_() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('ssid'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (err) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create('Built on Faith sign-ups');
    props.setProperty('ssid', ss.getId());
  }
  var sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(['When', 'Name', 'Phone or email', 'Prefers', 'How many', 'Build day', 'Anything else']);
    sh.setFrozenRows(1);
  }
  return sh;
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
