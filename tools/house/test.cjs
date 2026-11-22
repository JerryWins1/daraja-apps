#!/usr/bin/env node
/* Checks on the shared house block (the <script id="dj-house-vNN"> every app carries).
 *
 *   node tools/house/test.cjs            all of it
 *   node tools/house/test.cjs back       one group: back, mic, tell, fresh, beta, hello, same
 *
 * Why this file exists. On 20 November the back-stack, the microphone and the tell
 * box were each fixed and each verified by a throwaway script in a container that
 * then went away, and the Ahead of It chat lost its Start fresh harness the same
 * way. A check nobody can re-run is a check that only happened once.
 *
 * Three traps make a run here lie, each of them silently, and each is guarded
 * against below: serviceWorkers: 'block', http rather than file://, and no
 * seeding init script left alive across a reload. README.md in this folder says
 * what each one does and what it costs — read it there rather than here, so
 * there is one copy to correct when one of them turns out to be wrong. One
 * already did.
 */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json',
                '.css':'text/css', '.png':'image/png', '.svg':'image/svg+xml',
                '.m4a':'audio/mp4', '.webmanifest':'application/manifest+json' };

function serve(){
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      let p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
      if (!p.startsWith(ROOT) || !fs.existsSync(p)) { r.writeHead(404); return r.end('no'); }
      r.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(r);
    }).listen(0, () => res({ port: s.address().port, stop: () => s.close() }));
  });
}

const ok = [], bad = [];
const ck = (n, pass, detail) => {
  (pass ? ok : bad).push(n);
  console.log((pass ? '  ok   ' : '  FAIL ') + n + (pass || detail === undefined ? '' : '  <-- ' + JSON.stringify(detail)));
};

/* a page with the tour cleared, which otherwise swallows the first tap */
async function open(ctx, port, app){
  const p = await ctx.newPage();
  p.on('pageerror', e => ck('no page error: ' + e.message, false));
  await p.goto(`http://localhost:${port}/${app}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1400);
  /* djSetup joined these on 22 November: it is a real full-screen offer on a first open, so a
     check that drives the app past it has to answer it the way a person would. */
  await p.evaluate(() => { for (const id of ['djTour','djBanner','djSetup']) { const t = document.getElementById(id); if (t) t.remove(); }
    try { window.DJ_HOLD = 0; localStorage.setItem('dj_setup_no_' + (location.pathname.split('/').filter(Boolean).pop() || ''), '1'); } catch (e) {} });
  return p;
}

async function back(b, port){
  console.log('\nThe back-stack — djBack, the ? menu, and the phone\'s own Back');
  const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  const p = await open(ctx, port, 'advent');
  /* a stand-in app that opens its own screens, the way a real app's would */
  await p.evaluate(() => {
    window.appOpen = function(name){
      const prev = document.getElementById('appPanel');
      if (prev) { const was = prev.dataset.n; window.djBack.push(function(){ window.appOpen(was); }); }
      let el = prev || Object.assign(document.createElement('div'), { id: 'appPanel' });
      if (!prev) document.body.appendChild(el);
      el.dataset.n = name;
    };
  });
  const screen = () => p.evaluate(() => document.getElementById('appPanel').dataset.n);
  const depth  = () => p.evaluate(() => window.djBack.depth());

  await p.evaluate(() => { appOpen('Home'); appOpen('Library'); appOpen('Sermon'); });
  ck('an app trail two deep', await depth() === 2, await depth());
  await p.goBack(); await p.waitForTimeout(250);
  ck("the phone's Back steps back one, not out", await screen() === 'Library' && p.url().includes('/advent/'));
  await p.goBack(); await p.waitForTimeout(250);
  ck('and again, to the first screen', await screen() === 'Home' && await depth() === 0 && p.url().includes('/advent/'));

  await p.evaluate(() => appOpen('Library'));
  await p.evaluate(() => document.getElementById('djDockToggle').click()); await p.waitForTimeout(300);
  ck('the ? menu opens over an app trail', await p.isVisible('#djDockSheet'));
  ck('  and keeps the trail (it used to wipe it)', await depth() === 1, await depth());
  ck('  with no Back chip of its own', await p.$('#djDockSheet .djBackB') === null);
  await p.click('text=Which AI do you use?'); await p.waitForTimeout(350);
  ck('a house screen one deeper shows the chip', await p.isVisible('#djAISheet .djBackB'));
  await p.click('#djAISheet .djBackB'); await p.waitForTimeout(300);
  ck('  the chip returns to the ? menu', await p.isVisible('#djDockSheet'));
  await p.evaluate(() => document.querySelector('#djDockSheet button:last-of-type').click()); await p.waitForTimeout(300);
  ck('closing the menu leaves the app trail alone', await p.$('#djDockSheet') === null && await depth() === 1, await depth());
  await p.goBack(); await p.waitForTimeout(250);
  ck("the phone's Back then steps the app back", await screen() === 'Home' && p.url().includes('/advent/'));
  await ctx.close();
}

async function mic(b, port){
  console.log('\nDictation — it must not stop at the first pause');
  const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => {           /* a recogniser we can drive; Chromium has none */
    window.__SRS = [];
    window.SpeechRecognition = function(){
      this.continuous = false; this.interimResults = false; this.lang = '';
      this.start = function(){ window.__SRS.push(this); };
      this.stop  = function(){ if (this.onend) this.onend(); };
      this.abort = function(){ if (this.onend) this.onend(); };
    };
  });
  const p = await open(ctx, port, 'advent');
  const r = await p.evaluate(async () => {
    const out = {};
    const inp = document.createElement('input'); inp.type = 'text';
    document.body.appendChild(inp); inp.focus();
    await new Promise(r => setTimeout(r, 600));
    const m = document.getElementById('djMic'); if (!m) return out;
    m.click(); await new Promise(r => setTimeout(r, 100));
    const a = window.__SRS[window.__SRS.length - 1];
    out.continuous = a.continuous;                       /* false on a one-line box was the bug */
    a.onresult({ results: [[{ transcript: 'buy milk' }]] });
    a.onend();                                           /* Chrome closing the session itself */
    await new Promise(r => setTimeout(r, 100));
    out.restarted = window.__SRS.length === 2;
    window.__SRS[1].onresult({ results: [[{ transcript: 'and bread' }]] });
    out.text = inp.value;
    m.click(); await new Promise(r => setTimeout(r, 100));
    out.stopStays = window.__SRS.length === 2;
    return out;
  });
  ck('a one-line box keeps listening', r.continuous === true, r.continuous);
  ck('a session the browser closes is started again', r.restarted === true);
  ck('  and the words already said survive it', r.text === 'buy milk and bread', r.text);
  ck('tapping stop does not start it again', r.stopStays === true);
  await ctx.close();
}

async function tell(b, port){
  console.log('\nThe tell box — a date must reach the app that owns it');
  for (const [label, seed, expect] of [
    ['the merged app is installed', () => localStorage.setItem('aheadofit_v1', JSON.stringify({ items: [{ n: 'mine' }] })), 'aheadofit_v1'],
    ['only an old install',         () => localStorage.setItem('ahead_v1',     JSON.stringify({ items: [{ n: 'old'  }] })), 'ahead_v1'],
  ]) {
    const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(seed);
    const p = await open(ctx, port, 'academy');
    await p.evaluate(() => document.getElementById('djDockToggle').click()); await p.waitForTimeout(300);
    await p.click('text=Tell it'); await p.waitForTimeout(400);
    await p.fill('#djTellIn', 'car registration due 1 March'); await p.waitForTimeout(400);
    const said = await p.innerText('#djAISheet');
    ck(`${label}: it offers Ahead of It`, /to Ahead of It/.test(said) && !/isn.t set up/.test(said), said.slice(0, 120));
    await p.click('text=Yes, add it'); await p.waitForTimeout(500);
    const where = await p.evaluate(() => {
      const n = k => { try { return (JSON.parse(localStorage.getItem(k) || '{}').items || []).length; } catch(e){ return 0; } };
      return n('aheadofit_v1') === 2 ? 'aheadofit_v1' : (n('ahead_v1') === 2 ? 'ahead_v1' : 'nowhere');
    });
    ck(`  and the date lands in ${expect}`, where === expect, where);
    await ctx.close();
  }
}

async function fresh(b, port){
  console.log('\nStart fresh — it must erase everything this app owns, and nothing that belongs to another');
  const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  const p = await open(ctx, port, 'ahead-of-it');
  p.on('dialog', d => d.accept());          /* it asks twice before anything is erased */

  /* a phone that had all three of the old apps before the merge, plus this one, plus a
     scanned paper in the pocket, plus two other apps' data that must come out untouched */
  await p.evaluate(async () => {
    const one = n => JSON.stringify({ items: [{ id: n, n, cat: 'Mine', due: '2027-01-01', rep: 365,
      sev: 'm', bite: '', lad: [[7, 'Do it']], who: '', amt: '', where: '', stepsDone: [], hist: [] }], owner: '', tell: '' });
    localStorage.setItem('ahead_v1',        one('an old household date'));
    localStorage.setItem('steward_v1',      one('an old church date'));
    localStorage.setItem('goodstanding_v1', one('an old nonprofit date'));
    localStorage.setItem('aheadofit_v1', JSON.stringify({ items: [{ id: 'mine', n: 'my own date',
      cat: 'Mine', due: '2026-12-05', rep: 365, sev: 'm', bite: '', lad: [[7, 'Do it']], who: '',
      amt: '', where: '', stepsDone: [], hist: [] }], owner: 'Smith home', tell: 'Spouse', modes: ['h'], migrated: 1 }));
    localStorage.setItem('daraja_intro_aheadofit', '1');
    localStorage.setItem('drumbeat_v1', '{"keep":"another app"}');
    localStorage.setItem('now_next_v1', '{"keep":"the shared shoebox"}');
    await new Promise(res => {
      const r = indexedDB.open('ahead_papers', 1);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('files')) r.result.createObjectStore('files'); };
      r.onsuccess = () => { const t = r.result.transaction('files', 'readwrite');
        t.objectStore('files').put(new Blob(['a scanned policy']), 'paper1'); t.oncomplete = res; t.onerror = res; };
      r.onerror = res;
    });
  });

  /* Reopen so the app reads the seeded data. The seeding above is done on the page, not in an
     init script, because startFresh ends in location.replace and an init script would write it
     all back — the third trap in the README.
     The wait is longer than it looks like it needs to be. The house claims window.djStartFresh
     at 0, 300 and 1500 ms, over an older erase layer at the end of the page whose key names are
     guesses. On this app the house was measured to own the name at every moment sampled from
     0 ms on, so there is no window here to lose; the wait is kept as the safe default for an app
     nobody has measured, not as a fix for anything seen on this one. */
  await p.goto(`http://localhost:${port}/ahead-of-it/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2200);
  await p.evaluate(() => { for (const id of ['djTour','djBanner','introOv','fsIntro']) { const t = document.getElementById(id); if (t && t.parentNode) t.parentNode.removeChild(t); } });

  const keys = await p.evaluate(() => (window.djOwnedKeys ? window.djOwnedKeys() : []).slice().sort());
  ck('the erase list names this app and all three the merge replaced',
     ['ahead_v1', 'aheadofit_v1', 'goodstanding_v1', 'steward_v1'].every(k => keys.includes(k)), keys);
  ck('  and names nothing belonging to another app',
     !keys.includes('drumbeat_v1') && !keys.includes('now_next_v1'), keys);

  await p.evaluate(() => window.djStartFresh());
  await p.waitForTimeout(3500);
  await p.waitForLoadState('load').catch(() => {});
  await p.waitForTimeout(2600);              /* the papers pocket is finished on this next open */

  const after = await p.evaluate(() => {
    const saved = localStorage.getItem('aheadofit_v1');
    let list = null; try { const d = JSON.parse(saved || 'null'); list = d && d.items ? d.items.map(i => i.n) : null; } catch(e){}
    return {
      saved, list,
      oldLeft: ['ahead_v1', 'steward_v1', 'goodstanding_v1'].filter(k => !!localStorage.getItem(k)),
      others:  ['drumbeat_v1', 'now_next_v1'].filter(k => !!localStorage.getItem(k)),
      rows:    document.querySelectorAll('#v-next .item').length,
      welcome: !!(document.getElementById('welcome') && getComputedStyle(document.getElementById('welcome')).display !== 'none')
    };
  });
  /* null, not []: the merge deliberately writes nothing on a cold open with nothing to bring
     over, because an empty record made the house read the app as one the person had used. */
  ck('no saved list survives it', after.saved === null || (Array.isArray(after.list) && after.list.length === 0), after.list);
  ck('the three old lists are gone, so the next open cannot migrate them back', after.oldLeft.length === 0, after.oldLeft);
  ck('nothing is left on the page', after.rows === 0 && after.welcome === true,
     { rows: after.rows, welcomeCard: after.welcome, list: after.list });
  ck('the other apps on the phone are untouched', after.others.length === 2, after.others);

  const papers = await p.evaluate(() => new Promise(res => {
    const r = indexedDB.open('ahead_papers');
    r.onsuccess = () => { const db = r.result;
      if (!db.objectStoreNames.contains('files')) return res('store gone');
      const q = db.transaction('files', 'readonly').objectStore('files').getAllKeys();
      q.onsuccess = () => res(q.result); q.onerror = () => res('could not read it'); };
    r.onerror = () => res('db gone');
  }));
  ck('the scanned papers went with it', papers === 'db gone' || papers === 'store gone' || (Array.isArray(papers) && !papers.length), papers);
  await ctx.close();
}

async function beta(b, port){
  console.log("\nA beta copy — it must be the same app, and must say it is not the released one");
  const { execFileSync } = require('child_process');
  const run = a => execFileSync(process.execPath, [path.join(ROOT, 'tools', 'rollout.js'), ...a], { cwd: ROOT, encoding: 'utf8' });
  let made = false;
  try {
    run(['start', 'advent']); made = true;
    const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
    let p = await open(ctx, port, 'advent');
    await p.evaluate(() => { try{ localStorage.setItem('dj_a2hs_advent', 'done'); }catch(e){} });
    await p.evaluate(() => document.getElementById('djDockToggle').click()); await p.waitForTimeout(300);
    const stampOf = t => (t.replace(/\s+/g, ' ').match(/You are on (.+?)(?:  |$)/) || [])[1];
    const liveStamp = stampOf(await p.innerText('#djDockSheet'));
    ck('the released app shows no band', await p.$('#djBeta') === null);

    p = await open(ctx, port, 'advent/beta');
    ck('the beta says it is the next version, not released', /Next version[\s\S]*not released yet/.test(await p.innerText('#djBeta').catch(() => '')));
    ck('  with a way back to the released one', (await p.getAttribute('#djBeta a', 'href').catch(() => null)) === '../');
    await p.evaluate(() => document.getElementById('djDockToggle').click()); await p.waitForTimeout(300);
    const betaStamp = stampOf(await p.innerText('#djDockSheet'));
    ck('  it is the same app version', !!betaStamp && betaStamp === liveStamp, [betaStamp, liveStamp]);
    ck('  it shares the released app’s records, not a set of its own',
       await p.evaluate(() => localStorage.getItem('dj_a2hs_advent') === 'done' && !localStorage.getItem('dj_a2hs_beta')));
    ck('  and the ? button sits clear of the band', await p.evaluate(() => {
      const bb = document.getElementById('djBeta'), d = document.getElementById('djDock') || document.getElementById('djDockToggle');
      if (!bb || !d) return false;
      return d.getBoundingClientRect().bottom <= bb.getBoundingClientRect().top + 1;
    }));
    await ctx.close();
    /* the hold is what stops a bad version reaching everyone an hour later */
    let refused = '';
    try { run(['promote', 'advent']); } catch (e) { refused = String(e.stderr || e.message || ''); }
    ck('promoting before the 24 hours are up is refused', /hours left/.test(refused), refused.slice(0, 90));
  } finally {
    if (made) { try { run(['drop', 'advent']); } catch (e) {} }
    ck('the trial beta cleaned up after itself', !fs.existsSync(path.join(ROOT, 'advent', 'beta')));
  }
}

async function hello(b, port){
  console.log("\nThe greeting — it must not cover the app's own name");
  const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  /* a spread, not all 55: these are apps whose header the greeting used to cover completely */
  const some = ['everyday', 'jarbyjar', 'ourtable', 'story-keeper', 'tripstab', 'whoscoming', 'f1'];
  let covered = [];
  for (const a of some) {
    const p = await ctx.newPage();
    try {
      await p.goto(`http://localhost:${port}/${a}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await p.waitForTimeout(1500);
      const pct = await p.evaluate(() => {
        const h = document.getElementById('djHello');
        const head = document.querySelector('h1, header, .hd, #hdr, .title, #title, .brand');
        if (!h || !head) return null;
        const a = h.getBoundingClientRect(), r = head.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        const w = Math.min(r.right, a.right) - Math.max(r.left, a.left);
        const t = Math.min(r.bottom, a.bottom) - Math.max(r.top, a.top);
        return (w > 0 && t > 0) ? Math.round(100 * w * t / (r.width * r.height)) : 0;
      });
      if (pct !== null && pct > 40) covered.push(`${a} ${pct}%`);
    } catch (e) {}
    await p.close();
  }
  ck('it starts below the header, not over it', covered.length === 0, covered);
  await ctx.close();
}

/* 21 Nov 2026. The AI door now reads a photographed receipt as well as a PDF, so the sheet
   that shows the person what is about to leave the phone has to name which it is. A sheet
   that says "the file receipt.jpg (PDF, 380 KB)" over a photograph is a wrong preview, and
   a wrong preview is worse than none — that was the reasoning when the sheet first learned
   to name a file, and it is the reasoning here. */
async function filekind(b, port){
  console.log('\nThe confirm sheet — it must name what it is about to send');
  const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  /* the door's real address is in control/ai.json; stand in for both it and the door */
  await ctx.route('**/control/ai.json*', r => r.fulfill({ contentType: 'application/json',
    body: JSON.stringify({ endpoint: 'https://door.test/ask' }) }));
  let sent = null;
  await ctx.route('https://door.test/ask', r => {
    try { sent = JSON.parse(r.request().postData() || '{}'); } catch (e) { sent = 'unparseable'; }
    return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ text: 'Menards, $41.37.' }) });
  });
  const p = await open(ctx, port, 'advent');

  const data = 'A'.repeat(4 * 1024);                 /* base64 for 3 KB */
  const ask = async (file) => {
    await p.evaluate(f => { window.djAI.ask({ title: 'Read it', prompt: 'Read this', file: f }); }, file);
    await p.waitForTimeout(700);
    return await p.evaluate(() => {
      const s = document.getElementById('djAISheet');
      return s ? s.innerText.replace(/\s+/g, ' ') : null;
    });
  };
  const cancel = async () => {
    await p.evaluate(() => { const x = document.getElementById('djAIX'); if (x) x.click(); });
    await p.waitForTimeout(300);
  };

  let t = await ask({ media_type: 'application/pdf', name: 'statement.pdf', data });
  ck('a PDF is still called a PDF', /statement\.pdf/.test(t || '') && /\(PDF, 3 KB\)/.test(t || ''), t);
  await cancel();

  t = await ask({ media_type: 'image/jpeg', name: 'receipt.jpg', data });
  ck('a photo is called a photo, not a PDF', /receipt\.jpg/.test(t || '') && /\(photo, 3 KB\)/.test(t || '') && !/PDF/.test(t || ''), t);
  await cancel();

  t = await ask({ media_type: 'image/png', data });
  ck('a photo with no name still says photo', /a photo/.test(t || '') && !/PDF/.test(t || ''), t);

  /* and it really goes to the door, with the type the app chose */
  await p.evaluate(() => { const g = document.getElementById('djAIGo'); if (g) g.click(); });
  await p.waitForTimeout(1200);
  ck('the photo reaches the door with its own media_type',
     !!sent && sent.file && sent.file.media_type === 'image/png' && sent.file.data === 'A'.repeat(4 * 1024),
     sent && sent.file ? sent.file.media_type : sent);
  await ctx.close();
}

/* 22 Nov 2026. Jerry: "I'd also like to improve the store so we download an app that has an icon
   on it right away rather than having to horse around and download it and all that stuff."
   A link from the store carries ?dj_install=1 and the house answers it with ONE screen, alone.
   What is checked here is the "alone" — four things used to arrive in the first two and a half
   seconds and the install card was the one buried deepest, so a check that only asked whether the
   screen EXISTS would have passed on the broken version too. */
async function install(b, port){
  console.log('\nThe install screen — one screen, alone, for someone arriving from the store');
  const seen = p => p.evaluate(() => Array.from(document.querySelectorAll('html > *, body > *')).filter(e => {
    const c = getComputedStyle(e), r = e.getBoundingClientRect();
    return e.id !== '' && e.checkVisibility() && r.width > 0 && r.height > 0 && (c.position === 'fixed' || +c.zIndex > 100);
  }).map(e => e.id));

  /* 22 Nov, Jerry's answer: ONE Daraja icon, not one per app. So the marker on an app does not
     show the screen there at all — Safari's Add to Home Screen bookmarks the page you are
     standing on, so an install offered from inside Who's Coming makes a Who's Coming icon
     whatever any manifest says. It forwards to the front door, which is the only place the
     steps really do add Daraja, and then sends them on to the app they tapped. */
  let ctx = await b.newContext({ ...require('playwright').devices['iPhone 13'], serviceWorkers: 'block' });
  let p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://localhost:${port}/whoscoming/?dj_install=1`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3500);
  ck('the marker on an app forwards to the front door', /\/home\/\?dj_install=1&go=/.test(p.url()), p.url());
  ck('and carries the app it came from', /whoscoming/.test(decodeURIComponent(p.url())), p.url());
  await p.close();

  p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  const appUrl = `http://localhost:${port}/whoscoming/?v=1`;
  await p.goto(`http://localhost:${port}/home/?dj_install=1&go=${encodeURIComponent(appUrl)}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(4000);
  let ids = await seen(p);
  ck('on the front door it is the only thing up, with the dock', ids.includes('djInstall') && !ids.includes('djTour') && !ids.includes('djHello') && !ids.includes('djA2HS'), ids);
  const txt = await p.evaluate(() => (document.getElementById('djInstall') || {}).innerText || '');
  ck('it offers DARAJA, not the app', /Daraja/.test(txt) && !/Who’s Coming on your Home Screen/.test(txt), txt.replace(/\s+/g, ' ').slice(0, 80));
  ck('it keeps the line Jerry approved, word for word',
     /Put it on your Home Screen and it opens like any other app — full screen, straight from the icon\./.test(txt), txt.replace(/\s+/g, ' ').slice(0, 160));
  ck('it says where the app they tapped went', /One icon for every Daraja app/.test(txt) && /Whoscoming included/i.test(txt), txt.replace(/\s+/g, ' ').slice(0, 200));
  ck('and still offers a way past it', /Not now, just open it/.test(txt));
  ck('the icon on it is a real file that loaded', await p.evaluate(() => { const i = document.getElementById('djInstallIcon'); return !!i && i.naturalWidth > 0; }));
  ck('it sits above the welcome tour', await p.evaluate(() => +getComputedStyle(document.getElementById('djInstall')).zIndex > 2147483000));
  /* answered either way, they land in the app they tapped */
  await p.evaluate(() => document.querySelector('#djInstall button[data-a="skip"]').click());
  await p.waitForTimeout(2500);
  ck('"Not now" still takes them on to the app they tapped', /\/whoscoming\//.test(p.url()), p.url());
  ck('no page errors', errs.length === 0, errs);
  await p.close(); await ctx.close();

  /* Android: Chrome decides a page is installable on its own schedule, usually after this is up */
  ctx = await b.newContext({ ...require('playwright').devices['Pixel 5'], serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/home/?dj_install=1`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1500);
  const before = await p.evaluate(() => document.querySelector('#djInstall button[data-a]').innerText);
  ck('before Chrome offers anything it shows Chrome\'s own steps', /added it/.test(before), before);
  await p.evaluate(() => { const e = new Event('beforeinstallprompt');
    e.prompt = () => { window.__called = 1; }; e.userChoice = Promise.resolve({ outcome: 'accepted' }); window.dispatchEvent(e); });
  await p.waitForTimeout(600);
  const after = await p.evaluate(() => document.querySelector('#djInstall button[data-a]').innerText);
  ck('a prompt arriving LATE turns it into one tap', /Install Daraja/.test(after), after);
  await p.evaluate(() => document.querySelector('#djInstall button[data-a="install"]').click());
  await p.waitForTimeout(600);
  ck('and that tap really calls Chrome, not our own steps', await p.evaluate(() => !!window.__called));
  ck('accepting it is remembered, so the screen never comes back', await p.evaluate(() => localStorage.getItem('dj_a2hs_home')) === 'done');
  await p.close(); await ctx.close();

  /* nowhere to put an icon: a laptop just opens the app */
  ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/home/?dj_install=1`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  ck('a laptop is never shown it', !(await seen(p)).includes('djInstall'));
  await p.close(); await ctx.close();

  /* the loop this very check found: answering it with nothing to go on to resolved an empty go
     against the current address, so it sent them back to the same URL, marker and all */
  ctx = await b.newContext({ ...require('playwright').devices['iPhone 13'], serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/home/?dj_install=1`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const wasAt = p.url();
  await p.evaluate(() => document.querySelector('#djInstall button[data-a="skip"]').click());
  await p.waitForTimeout(2500);
  ck('answering it with nowhere to go on to does not loop',
     !(await seen(p)).includes('djInstall') && p.url() === wasAt, p.url());
  await p.close(); await ctx.close();

  /* someone who already added it */
  ctx = await b.newContext({ ...require('playwright').devices['iPhone 13'], serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('dj_a2hs_home', 'done'); } catch (e) {} });
  await p.goto(`http://localhost:${port}/home/?dj_install=1&go=${encodeURIComponent(`http://localhost:${port}/whoscoming/`)}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  ck('someone who already has the icon goes straight to the app', !(await seen(p)).includes('djInstall') && /\/whoscoming\//.test(p.url()), p.url());
  await p.close(); await ctx.close();

  /* no marker: an ordinary visit is untouched, except that the greeting no longer burns
     its eight seconds behind the tour's 72% shade (measured 22 Nov, before and after) */
  ctx = await b.newContext({ ...require('playwright').devices['iPhone 13'], serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(4000);
  ids = await seen(p);
  ck('an ordinary visit still gets the tour and no install screen', ids.includes('djTour') && !ids.includes('djInstall'), ids);
  ck('and the greeting is not spent underneath it', !ids.includes('djHello'), ids);
  await p.close(); await ctx.close();

  /* the store's own links */
  ctx = await b.newContext({ ...require('playwright').devices['iPhone 13'], serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/shop/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(4000);
  const links = await p.evaluate(() => Array.from(document.querySelectorAll('a.btn.get, a.btn.try'))
    .map(a => a.getAttribute('href') || '').filter(h => h && !/^mailto:/.test(h)));
  ck('the store has Get and Try links to show', links.length > 20, links.length);
  const without = links.filter(h => !/\/home\/\?dj_install=1&go=/.test(h));
  ck('every store link that opens an app goes through the front door', without.length === 0, without.slice(0, 5));
  ck('and each still carries the v= stamp that beats the cached copy',
     links.every(h => /v%3D\d+/.test(h) || /[?&]v=\d+/.test(decodeURIComponent(h))), links.slice(0, 2));
  ck('an open redirect is refused', await p.evaluate(async () => {
    const u = location.origin + '/home/?dj_install=1&go=' + encodeURIComponent('https://evil.example/');
    const r = await fetch(u); const t = await r.text();
    return /djSafeGo/.test(t);   /* the guard is in the shipped block */
  }));
  await p.close(); await ctx.close();
}

/* 22 Nov 2026. Jerry: "a way for you to interview the user to see what they would like to see in
   the system … and then either build what they're looking for or add it to the system as a
   feature." The door is MOCKED here — these cost nothing and prove the house's own logic. What a
   real model actually answers is Jerry on a real phone, as ever.

   The thing most worth checking is the line that holds: the AI arranges what the app already has.
   So the scripted plan below deliberately asks for a figure this app does not keep, and the
   report must DROP it and say so — a figure quietly missing and a figure quietly wrong look the
   same on a page. */
async function mine(b, port){
  console.log('\nMake it mine — the setup questions, the interview, and the report it builds');
  const devs = require('playwright').devices;
  const sheet = p => p.evaluate(() => { const s = document.getElementById('djAISheet'); return s ? s.innerText.replace(/\s+/g, ' ') : ''; });
  const openMine = async p => {
    await p.evaluate(() => { const t = document.getElementById('djTour'); if (t) t.remove(); });
    await p.evaluate(() => document.getElementById('djDockToggle').click());
    await p.waitForTimeout(400);
    await p.evaluate(() => { const r = Array.from(document.querySelectorAll('#djDockSheet button')).find(x => /Make it mine/.test(x.innerText)); if (r) r.click(); });
    await p.waitForTimeout(300);
    await p.evaluate(() => document.getElementById('stMine').click());
    await p.waitForTimeout(300);
  };
  const door = async (ctx, replies, seen) => {
    await ctx.route('**/control/ai.json*', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ endpoint: 'https://door.test/ask' }) }));
    await ctx.route('https://door.test/ask', r => {
      try { seen.push(JSON.parse(r.request().postData() || '{}')); } catch (e) {}
      const n = replies.shift();
      if (!n) return r.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'no more scripted replies' }) });
      if (n.status) return r.fulfill({ status: n.status, contentType: 'application/json', body: JSON.stringify({ error: n.error }) });
      return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ text: JSON.stringify(n) }) });
    });
  };

  /* 1 · the four setup questions, on a first open */
  let ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  let p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  let up = await p.evaluate(() => Array.from(document.querySelectorAll('html > *, body > *'))
    .filter(e => e.id && e.checkVisibility() && (getComputedStyle(e).position === 'fixed' || +getComputedStyle(e).zIndex > 100)).map(e => e.id));
  /* the tour goes first — it is the app explaining itself, and it is what they came for */
  ck('the app\'s own welcome tour still comes first', up.includes('djTour') && !up.includes('djSetup'), up);
  await p.evaluate(() => { const t = document.getElementById('djTour'); if (t) t.remove();
    try { localStorage.setItem('dj_tour_' + (window.DJ_TOUR || {}).slug, 'done'); } catch (e) {} });
  await p.waitForTimeout(2500);
  up = await p.evaluate(() => Array.from(document.querySelectorAll('html > *, body > *'))
    .filter(e => e.id && e.checkVisibility() && (getComputedStyle(e).position === 'fixed' || +getComputedStyle(e).zIndex > 100)).map(e => e.id));
  ck('then the setup offer comes up, alone', up.includes('djSetup') && !up.includes('djHello'), up);
  ck('it says how long it takes before asking anything', /Four questions, all taps/.test(await p.evaluate(() => document.getElementById('djSetup').innerText)));
  await p.evaluate(() => document.querySelector('#djSetup button[data-go]').click());
  for (let i = 0; i < 4; i++) { await p.evaluate(() => document.querySelector('#djSetup button[data-a]').click()); await p.waitForTimeout(150); }
  await p.waitForTimeout(400);
  const prof = await p.evaluate(() => JSON.parse(localStorage.getItem('dj_profile_whoscoming') || '{}'));
  ck('four answers are kept, on this phone, for this app', !!(prof.use && prof.who && prof.first && prof.style && prof.done), prof);
  await p.waitForTimeout(3500);
  const after = await p.evaluate(() => Array.from(document.querySelectorAll('html > *, body > *'))
    .filter(e => e.id && e.checkVisibility() && (getComputedStyle(e).position === 'fixed' || +getComputedStyle(e).zIndex > 100)).map(e => e.id));
  ck('then it gets out of the way', !after.includes('djSetup'), after);
  ck('no page errors', errs.length === 0, errs);
  await p.close(); await ctx.close();

  /* 22 Nov, from The Church App chat and confirmed before anything changed: on church-hq this
     card went up at 250ms and the app's OWN welcome (#djStart, z 9000) at 500ms, underneath it.
     elementFromPoint at the middle of the screen returned djSetup and a click retried 60 times
     and timed out. Two full-screen cards before a church secretary can type a service time.
     Waiting for cardOpen() before showing was not enough on its own: at the moment of that check
     the app's card does not exist yet. */
  ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/church-hq/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(7000);
  const own = await p.evaluate(() => {
    const st = document.getElementById('djStart');
    const at = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return { theirs: !!(st && st.checkVisibility()), setup: !!document.getElementById('djSetup'),
             centre: at ? (at.id || (at.closest('[id]') || {}).id || at.tagName.toLowerCase()) : null };
  });
  ck("it never opens on top of an app's own welcome card", own.theirs && !own.setup, own);
  ck('and that card is the thing you actually touch', own.centre === 'djStart', own);
  /* and it is not suppressed for good - it takes its turn once their card has gone */
  await p.evaluate(() => { const d = document.getElementById('djStart'); if (d) d.remove(); });
  await p.waitForTimeout(5000);
  ck('once their card has gone, it takes its turn', await p.evaluate(() => !!document.getElementById('djSetup')));
  await p.close(); await ctx.close();

  /* 22 Nov, from the Ahead of It chat: a keyword test on the person's own first sentence used to
     decide report or request, so "a packet for the board meeting" was emailed to us instead of
     being built out of figures the app had. The AI decides now, so the words below deliberately
     contain none of report, summary, statement, overview, chart or totals. */
  const s5 = [];
  ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  await door(ctx, [{ done: true, plan: { title: 'A packet for the board', period: 'all', watch: '',
    items: [{ field: 'apps_here', as: 'number', label: 'Apps with something saved' }] } }], s5);
  p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('dj_setup_no_whoscoming', '1'); } catch (e) {} });
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  await openMine(p);
  await p.evaluate(() => { document.getElementById('mnBox').value = 'a packet for the board meeting'; document.getElementById('mnGo').click(); });
  await p.waitForTimeout(300);
  /* the words are behind "see exactly what is sent", so read what is really going, not the blurb */
  const words = await p.evaluate(() => (document.getElementById('mnWords') || {}).textContent || '');
  ck('the app\'s own figures go with it whatever they call it', /apps_here/.test(words) && /problem_list/.test(words), words.replace(/\s+/g, ' ').slice(0, 140));
  ck('and the prompt no longer assumes which of the two it is', /reply with a finished PLAN/.test(words) && /reply with a SUMMARY/.test(words), words.replace(/\s+/g, ' ').slice(-200));
  await p.evaluate(() => document.getElementById('mnOk').click());
  await p.waitForTimeout(1500);
  ck('and a wish with no report-word in it still builds one',
     await p.evaluate(() => !!document.getElementById('rpKeep')), (await sheet(p)).slice(0, 110));
  await p.close(); await ctx.close();

  /* a plan naming nothing this app keeps is a request with a title on it, not an empty page */
  const s6 = [];
  ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  await door(ctx, [{ done: true, plan: { title: 'My bank month', period: 'all', items: [{ field: 'bank_balance', as: 'number', label: 'Balance' }] } }], s6);
  p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('dj_setup_no_whoscoming', '1'); } catch (e) {} });
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  await openMine(p);
  await p.evaluate(() => { document.getElementById('mnBox').value = 'everything about my bank account'; document.getElementById('mnGo').click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('mnOk').click());
  await p.waitForTimeout(1600);
  const dead = await sheet(p);
  ck('a plan the app cannot fill becomes a request, not an empty page',
     /cannot build that by itself/.test(dead) && !/nothing recorded yet/.test(dead), dead.slice(0, 130));
  await p.close(); await ctx.close();

  /* 2 · an interview that ends in a report */
  const seen = [];
  ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  await door(ctx, [
    { done: false, question: 'Which of these matters most to you?', options: ['How many apps I use', 'What went wrong'] },
    { done: true, plan: { title: 'My Daraja month', period: 'month', watch: 'More than three problems in a week is worth telling us about.',
      items: [{ field: 'apps_here', as: 'number', label: 'Apps with something saved' },
              { field: 'problem_list', as: 'list', label: 'What went wrong' },
              { field: 'bank_balance', as: 'number', label: 'Your bank balance' }] } }
  ], seen);
  p = await ctx.newPage();
  const e2 = []; p.on('pageerror', e => e2.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem('dj_setup_no_whoscoming', '1');
    localStorage.setItem('dj_problems', JSON.stringify([{ t: '9:01', m: 'AI: no answer' }])); } catch (e) {} });
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  await p.evaluate(() => { const t = document.getElementById('djTour'); if (t) t.remove(); });
  await p.evaluate(() => document.getElementById('djDockToggle').click());
  await p.waitForTimeout(400);
  ck('the ? menu carries a Make it mine row', await p.evaluate(() => Array.from(document.querySelectorAll('#djDockSheet button')).some(x => /Make it mine/.test(x.innerText))));
  await p.evaluate(() => { Array.from(document.querySelectorAll('#djDockSheet button')).find(x => /Make it mine/.test(x.innerText)).click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('stMine').click());
  await p.waitForTimeout(300);
  await p.evaluate(() => { document.getElementById('mnBox').value = 'I would like a report on how I am using this'; document.getElementById('mnGo').click(); });
  await p.waitForTimeout(400);
  const conf = await sheet(p);
  ck('ONE confirmation covers the whole interview', /Before we start/.test(conf) && /every answer you give/.test(conf), conf.slice(0, 90));
  ck('it says how many asks it will cost before it starts', /asks out of your household/.test(conf), conf.slice(0, 120));
  ck('nothing is sent until that is accepted', seen.length === 0, seen.length);
  await p.evaluate(() => document.getElementById('mnOk').click());
  await p.waitForTimeout(1300);
  const q1 = await sheet(p);
  ck('the first question arrives with tappable answers', /Question 1 of up to/.test(q1) && await p.evaluate(() => !!document.querySelector('#ivOpts button')), q1.slice(0, 80));
  ck('and a box for anyone whose answer is not on it', await p.evaluate(() => !!document.getElementById('ivBox')));
  await p.evaluate(() => document.querySelector('#ivOpts button').click());
  await p.waitForTimeout(1500);
  const rep = await sheet(p);
  ck('the report is built from this app\'s own figures', /My Daraja month/.test(rep) && /What went wrong/.test(rep), rep.slice(0, 100));
  ck('it says where the figures came from', /comes from .* own records on this phone/.test(rep), rep.slice(0, 140));
  /* the line that holds */
  ck('a figure the app does not keep is DROPPED, not invented', /Left out because this app does not keep it/.test(rep) && /bank_balance/.test(rep), rep.slice(-120));
  ck('the whole interview cost 2 asks, not one per screen', seen.length === 2, seen.length);
  ck('and every one of them asked for JSON', seen.every(x => x.want === 'json'), seen.map(x => x.want));
  await p.evaluate(() => document.getElementById('rpKeep').click());
  await p.waitForTimeout(500);
  ck('keeping it saves it on the phone', await p.evaluate(() => (JSON.parse(localStorage.getItem('dj_reports_whoscoming') || '[]')[0] || {}).title) === 'My Daraja month');
  await p.evaluate(() => document.getElementById('rpOk').click());
  await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('djDockToggle').click());
  await p.waitForTimeout(400);
  ck('and a My reports row appears once there is one', await p.evaluate(() => Array.from(document.querySelectorAll('#djDockSheet button')).some(x => /My reports/.test(x.innerText))));
  ck('no page errors', e2.length === 0, e2);
  await p.close(); await ctx.close();

  /* 3 · the door refuses */
  const s3 = [];
  ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  await door(ctx, [{ status: 422, error: 'the assistant declined that one' }], s3);
  p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('dj_setup_no_whoscoming', '1'); } catch (e) {} });
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  await openMine(p);
  await p.evaluate(() => { document.getElementById('mnBox').value = 'a report about my week'; document.getElementById('mnGo').click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('mnOk').click());
  await p.waitForTimeout(1600);
  const bad = await sheet(p);
  ck('a refusal says so plainly and loses nothing', /That did not work/.test(bad) && /Nothing was lost/.test(bad), bad.slice(0, 90));
  ck('and offers to send it to us instead', await p.evaluate(() => !!document.getElementById('ivSend')));
  await p.close(); await ctx.close();

  /* 4 · they stop half way */
  const s4 = [];
  ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  await door(ctx, [{ done: false, question: 'Over what period?', options: ['This week', 'This month'] }], s4);
  p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('dj_setup_no_whoscoming', '1'); } catch (e) {} });
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  await openMine(p);
  await p.evaluate(() => { document.getElementById('mnBox').value = 'a report about my week'; document.getElementById('mnGo').click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('mnOk').click());
  await p.waitForTimeout(1400);
  await p.evaluate(() => document.getElementById('ivStop').click());
  await p.waitForTimeout(1600);
  ck('stopping half way really stops it', await p.evaluate(() => !document.getElementById('djAISheet')));
  ck('and sends nothing more after it', s4.length === 1, s4.length);
  await p.close(); await ctx.close();

  /* 5 · nowhere near the kids' page or the crisis tool, and Start fresh takes it all with it */
  ctx = await b.newContext({ ...devs['iPhone 13'], serviceWorkers: 'block' });
  p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/safety/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2200);
  ck('My Safety Plan is never offered any of it', !(await p.evaluate(() => !!document.getElementById('djSetup'))));
  await p.close();
  p = await ctx.newPage();
  await p.addInitScript(() => { try {
    localStorage.setItem('dj_profile_whoscoming', '{"done":1}');
    localStorage.setItem('dj_reports_whoscoming', '[{"id":"r1","title":"x"}]');
    localStorage.setItem('dj_name', 'Jerry');
  } catch (e) {} });
  await p.goto(`http://localhost:${port}/whoscoming/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const owned = await p.evaluate(() => (window.djOwnedKeys && window.djOwnedKeys()) || []);
  ck('Start fresh erases the setup answers and the reports with the app',
     owned.includes('dj_profile_whoscoming') && owned.includes('dj_reports_whoscoming'), owned.filter(k => /profile|reports/.test(k)));
  ck('and still leaves the names shared across apps alone', !owned.includes('dj_name'), owned.filter(k => k === 'dj_name'));
  await ctx.close();
}

/* The icons and manifests behind all of it. No browser: these are file facts, and a file fact
   that is wrong makes Chrome quietly refuse to offer Install, which looks like nothing at all. */
function icons(){
  console.log('\nIcons and manifests — what Chrome and iOS are actually handed');
  const pins = JSON.parse(fs.readFileSync(path.join(__dirname, 'pinned.json'), 'utf8')).pinned || [];
  const walkAll = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const f = path.join(d, e.name);
    if (e.isDirectory()) return e.name === '.git' || e.name === 'node_modules' ? [] : walkAll(f);
    return e.name === 'index.html' ? [f] : [];
  });
  const files = walkAll(ROOT).filter(f => /dj-house-v\d+/.test(fs.readFileSync(f, 'utf8')))
    .filter(f => !pins.some(p => path.relative(ROOT, f).startsWith(p.path + path.sep)));

  const noTouch = [], badTouch = [], badManifest = [], missingIcon = [], svgOnly = [];
  for (const f of files) {
    const dir = path.dirname(f), rel = path.relative(ROOT, dir) || '.';
    const s = fs.readFileSync(f, 'utf8');
    const t = s.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i);
    if (!t) noTouch.push(rel);
    else if (/\.svg(\?|$)/i.test(t[1])) badTouch.push(`${rel} -> ${t[1]}`);
    else if (!/^(data|https?):/i.test(t[1]) && !fs.existsSync(path.join(dir, t[1].split('?')[0]))) badTouch.push(`${rel} -> ${t[1]} is not there`);
    const m = s.match(/<link[^>]*rel=["']manifest["'][^>]*href=["']([^"']+)["']/i);
    if (!m || /^(data|https?):/i.test(m[1])) continue;
    const mp = path.join(dir, m[1].split('?')[0]);
    if (!fs.existsSync(mp)) { badManifest.push(`${rel}: links ${m[1]}, which is not there`); continue; }
    let j; try { j = JSON.parse(fs.readFileSync(mp, 'utf8')); } catch (e) { badManifest.push(`${rel}: will not parse`); continue; }
    const ic = Array.isArray(j.icons) ? j.icons : [];
    for (const i of ic) {
      const raw = String(i.src || '').split('?')[0];
      if (!raw || /^(data|https?):/i.test(raw)) continue;
      /* decode first: Pit Wall's icons live at ../Apps%20(installable%20site)/, which is a real
         folder with a space in its name. Checking the undecoded path called them missing. */
      let src = raw; try { src = decodeURIComponent(raw); } catch (e) {}
      if (!fs.existsSync(path.join(path.dirname(mp), src))) missingIcon.push(`${rel} -> ${raw}`);
    }
    if (ic.length && !ic.some(i => /\.png(\?|$)/i.test(i.src || '') || i.type === 'image/png')) svgOnly.push(rel);
  }
  /* iOS does not render SVG for apple-touch-icon — a blank white tile, #543 */
  ck('no app points its Home Screen tile at an SVG', badTouch.length === 0, badTouch);
  ck('every manifest an app links is really there and parses', badManifest.length === 0, badManifest);
  ck('every icon a manifest names is really there', missingIcon.length === 0, missingIcon);
  /* whether Chrome will offer Install on an SVG-only manifest could NOT be measured from this
     container (Page.getInstallabilityErrors reported no errors even for a page with no manifest at
     all, so it is simply not running), and the guidance that was reachable says to carry a
     rasterised icon beside an SVG. tools/icons/manifest.cjs puts a 192 and a 512 in each. */
  ck('no manifest offers Chrome an SVG and nothing else', svgOnly.length === 0, svgOnly);
  /* found by the Pit Wall chat on 22 Nov: f1/ carried a manifest.json nothing referenced, still
     pointing at the SVG. Nothing reads it, so nothing breaks — and that is exactly why it sat
     there. A spare manifest is the next person's wrong answer. */
  const spare = [];
  for (const f of files) {
    const dir = path.dirname(f), rel = path.relative(ROOT, dir) || '.';
    const s2 = fs.readFileSync(f, 'utf8');
    const m2 = s2.match(/<link[^>]*rel=["']manifest["'][^>]*href=["']([^"']+)["']/i);
    const linked = m2 && !/^(data|https?):/i.test(m2[1]) ? path.basename(m2[1].split('?')[0]) : null;
    for (const name of fs.readdirSync(dir)) {
      if (!/^manifest\.(json|webmanifest)$/i.test(name)) continue;
      if (name !== linked) spare.push(`${rel}/${name}`);
    }
  }
  ck('no app carries a spare manifest nothing links', spare.length === 0, spare);

  const hm = JSON.parse(fs.readFileSync(path.join(ROOT, 'home', 'manifest.webmanifest'), 'utf8'));
  /* "../" resolves one level above home/, which on the real site is /daraja-apps/ — so every app
     opened from the Daraja icon stays inside it instead of falling out into Safari. Relative on
     purpose: an absolute "/daraja-apps/" would be wrong everywhere but the live site. */
  ck('the Daraja icon covers every app, not just the front door', hm.scope === '../', hm.scope || '(no scope)');
  const sm = path.join(ROOT, 'shop', 'manifest.webmanifest');
  ck('the store itself can be put on a Home Screen', fs.existsSync(sm) && /rel=["']manifest["']/.test(fs.readFileSync(path.join(ROOT, 'shop', 'index.html'), 'utf8')));
}

async function same(){
  console.log('\nThe block itself');
  const crypto = require('crypto');
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const f = path.join(d, e.name);
    if (e.isDirectory()) return e.name === '.git' || e.name === 'node_modules' ? [] : walk(f);
    return e.name === 'index.html' ? [f] : [];
  });
  const all = walk(ROOT).filter(f => /dj-house-v\d+/.test(fs.readFileSync(f, 'utf8')));
  /* A copy deliberately held on an older block is not drift. tools/house/pinned.json names each
     one, who owns it and why; without that list the two Business Manager test copies pinned at v72
     on 21 November turned this whole group red, which reads exactly like a broken sweep. The pins
     are PRINTED, not just skipped — a pin nobody remembers is how a copy quietly becomes the oldest
     code in the house. */
  const pins = JSON.parse(fs.readFileSync(path.join(__dirname, 'pinned.json'), 'utf8')).pinned || [];
  const pinnedPath = f => pins.find(p => path.relative(ROOT, f).startsWith(p.path + path.sep));
  const files = all.filter(f => !pinnedPath(f));
  const held = all.filter(pinnedPath);
  if (held.length) {
    console.log(`  (${held.length} ${held.length > 1 ? 'copies' : 'copy'} deliberately pinned, skipped below)`);
    for (const f of held) { const p = pinnedPath(f);
      console.log(`     ${path.relative(ROOT, f)} — ${p.version} since ${p.since}, ${p.chat}: ${p.reason}`); }
  }
  const stalePin = pins.filter(p => !fs.existsSync(path.join(ROOT, p.path)));
  ck('every pin in pinned.json still names a real folder', stalePin.length === 0, stalePin.map(p => p.path));
  const seen = {};
  for (const f of files) {
    const s = fs.readFileSync(f, 'utf8');
    const i = s.indexOf('<script id="dj-house-v'), j = s.indexOf('</script>', i);
    (seen[crypto.createHash('sha1').update(s.slice(i, j)).digest('hex').slice(0, 10)] ||= []).push(path.relative(ROOT, f));
  }
  const groups = Object.values(seen).sort((a, b) => b.length - a.length);
  ck(`${files.length} apps carry the house block`, files.length >= 50, files.length);
  /* Four copies differ on purpose; any more is drift somebody should know about. */
  const odd = groups.slice(1).flat();
  ck('at most four apps differ from the rest, each for a reason its own chat owns',
     odd.length <= 4, odd);
  const vers = new Set(files.map(f => (fs.readFileSync(f, 'utf8').match(/dj-house-v(\d+)/) || [])[1]));
  ck('every app is on the same house version', vers.size === 1, [...vers]);
  /* env(safe-area-inset-*) reads 0 without this, so the dock, the greeting and the Home Screen
     card all sit under the notch or the home bar on the phones that have them. Five apps were
     missing it on 21 November, the store and the front door among them. A console warning would
     only reach somebody already looking; this reaches whoever runs the checks. */
  const noCover = files.filter(f => {
    const m = fs.readFileSync(f, 'utf8').match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
    return !m || !/viewport-fit=cover/.test(m[0]);
  }).map(f => path.relative(ROOT, f));
  ck('every app asks for the whole screen (viewport-fit=cover)', noCover.length === 0, noCover);
  /* 22 Nov: a browser reads the charset out of the first 1024 bytes and nothing further. The house
     block is about 300 KB and sits at the top of the head, so every app was declaring its encoding
     long past the point anything looks. GitHub Pages sends charset=utf-8 in the header and hides it
     there; any other copy is left to the browser's guess. The beta check found it by serving the
     same bytes twice and reading them two different ways — the released app fine, the beta full of
     mojibake. It is a flake only in the sense that a guess is sometimes right. */
  const lateCharset = files.filter(f => {
    const b = fs.readFileSync(f); const i = b.indexOf(Buffer.from('charset'));
    return i < 0 || i > 1024;
  }).map(f => path.relative(ROOT, f));
  ck('every app declares its charset in the first 1024 bytes', lateCharset.length === 0, lateCharset);
}

(async () => {
  const only = process.argv[2];
  const s = await serve();
  const b = await chromium.launch();
  try {
    if (!only || only === 'back') await back(b, s.port);
    if (!only || only === 'mic')  await mic(b, s.port);
    if (!only || only === 'tell') await tell(b, s.port);
    if (!only || only === 'beta') await beta(b, s.port);
    if (!only || only === 'hello') await hello(b, s.port);
    if (!only || only === 'filekind') await filekind(b, s.port);
    if (!only || only === 'install') await install(b, s.port);
    if (!only || only === 'mine') await mine(b, s.port);
    if (!only || only === 'icons') icons();
    if (!only || only === 'fresh') await fresh(b, s.port);
    if (!only || only === 'same') await same();
  } finally { await b.close(); s.stop(); }
  console.log(`\n${ok.length} passed, ${bad.length} failed`);
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('the run itself failed:', e); process.exit(1); });
