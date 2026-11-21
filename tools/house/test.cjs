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
  await p.evaluate(() => { for (const id of ['djTour','djBanner']) { const t = document.getElementById(id); if (t) t.remove(); } });
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

async function same(){
  console.log('\nThe block itself');
  const crypto = require('crypto');
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const f = path.join(d, e.name);
    if (e.isDirectory()) return e.name === '.git' || e.name === 'node_modules' ? [] : walk(f);
    return e.name === 'index.html' ? [f] : [];
  });
  const files = walk(ROOT).filter(f => /dj-house-v\d+/.test(fs.readFileSync(f, 'utf8')));
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
    if (!only || only === 'fresh') await fresh(b, s.port);
    if (!only || only === 'same') await same();
  } finally { await b.close(); s.stop(); }
  console.log(`\n${ok.length} passed, ${bad.length} failed`);
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('the run itself failed:', e); process.exit(1); });
