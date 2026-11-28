// Walk-through crawler for every Daraja app: starts on the app's real first page and taps only what a person can see, by its words.
// One screenshot per tap. Flags what a person would notice: errors, dialogs, taps that change nothing, loops, "undefined"/"NaN",
// broken pictures, sideways scrolling, an empty screen. The same spirit as familydash/test/walk.js, with no per-app script.
// usage: node tools/walk/walk_all.js <app-dir> <outdir> <phone|ipad> [port]
const { chromium, devices } = require('playwright'); const fs = require('fs');
const [,, app, out, dev = 'phone', port = '8731'] = process.argv;
fs.mkdirSync(out, { recursive: true });
const SKIP = /delete|erase|remove|clear|reset|start over|sign ?out|log ?out|buy|purchase|pay\b|donate|send|share|call\b|text us|whatsapp|email|print|download|install|rate|review|submit|publish/i;
const DISMISS = /^(skip( the tour)?|no thanks.*|not now|later|got it|maybe later|close|✕|×|x|dismiss|don.t ask again|ok|okay)$/i;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(dev === 'ipad' ? devices['iPad Pro 11 landscape'] : devices['iPhone 13']);
  await ctx.route(/^(?!https?:\/\/localhost)/, r => r.abort());
  const p = await ctx.newPage();
  const issues = [], errs = []; let n = 0; const seen = {}; const tried = new Set();
  p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  p.on('dialog', d => { issues.push('a browser pop-up appeared: ' + d.message().slice(0, 80)); d.accept().catch(() => {}); });
  p.on('response', r => { if (r.status() >= 400 && r.url().startsWith('http://localhost')) issues.push('a file did not load (' + r.status() + '): ' + r.url().replace(/.*localhost:\d+/, '')); });
  const url = 'http://localhost:' + port + '/' + app + '/';
  try { await p.goto(url, { waitUntil: 'load', timeout: 20000 }); } catch (e) { issues.push('the first page did not open: ' + e.message.slice(0, 80)); }
  await p.waitForTimeout(1500);
  const text = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  // everything a person could see change: the words, the highlight on a chip, a ticked box, what is typed
  const sig = () => p.evaluate(() => { let h = 5381; const str = document.body.innerHTML + '|' + [...document.querySelectorAll('input,select,textarea')].map(e => (e.checked ? 1 : 0) + e.value).join(',') + '|' + location.hash; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return h; });
  const snap = async () => { n++; const f = out + '/' + String(n).padStart(2, '0') + '.png'; await p.screenshot({ path: f }).catch(() => {}); return f; };
  const check = async (label) => {
    const t = await text();
    if (t.length < 20) issues.push(label + ': the screen is nearly empty');
    if (/\bundefined\b|\bNaN\b|\[object |null null/.test(t)) issues.push(label + ': the screen shows "undefined", "NaN" or "[object"');
    seen[t] = (seen[t] || 0) + 1; if (seen[t] === 3) issues.push(label + ': this screen came back 3 times, a loop?');
    const x = await p.evaluate(() => ({ wide: document.documentElement.scrollWidth > innerWidth + 3, img: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).length }));
    if (x.wide) issues.push(label + ': the page scrolls sideways'); if (x.img) issues.push(label + ': ' + x.img + ' picture(s) did not load');
    return t;
  };
  const list = () => p.evaluate(([SKIPs, DISs]) => {
    const SK = new RegExp(SKIPs, 'i'), DS = new RegExp(DISs, 'i');
    const vis = e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) return false; const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || s.pointerEvents === 'none') return false; const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(innerHeight - 1, Math.max(0, r.top + Math.min(r.height / 2, 30))); const top = document.elementFromPoint(cx, cy); return !!top && (top === e || e.contains(top) || top.contains(e)); };
    const all = [...document.querySelectorAll('button, a, [role=button], [onclick], summary, label.tab, .tab')].filter(vis);
    return all.map((e, i) => { const lab = (e.innerText || e.getAttribute('aria-label') || e.title || '').replace(/\s+/g, ' ').trim().slice(0, 50);
      const href = e.tagName === 'A' ? (e.getAttribute('href') || '') : ''; const ext = /^(https?:|tel:|mailto:|sms:|whatsapp:)/i.test(href) && !href.startsWith(location.origin);
      return { i, lab, dismiss: DS.test(lab), skip: !lab || SK.test(lab) || ext || e.disabled === true, fixed: getComputedStyle(e).position === 'fixed' }; });
  }, [SKIP.source, DISMISS.source]);
  const tapIdx = async (i) => p.evaluate((i) => { const vis = e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) return false; const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || s.pointerEvents === 'none') return false; const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(innerHeight - 1, Math.max(0, r.top + Math.min(r.height / 2, 30))); const top = document.elementFromPoint(cx, cy); return !!top && (top === e || e.contains(top) || top.contains(e)); }; const all = [...document.querySelectorAll('button, a, [role=button], [onclick], summary, label.tab, .tab')].filter(vis); const e = all[i]; if (!e) return false; e.click(); return true; }, i);
  let before = await check('first page'), beforeSig = await sig(); const log = [{ step: 'first page', shot: await snap() }];
  let dismissed = 0;
  for (let step = 0; step < 16; step++) {
    const c = await list();
    let pick = dismissed < 5 ? c.find(x => x.dismiss && !x.skip) : null; if (pick) dismissed++;
    if (!pick) pick = c.find(x => !x.skip && !x.dismiss && !tried.has(x.lab));
    if (!pick) { const back = c.find(x => /^(‹|←|back|close|home|menu|done)/i.test(x.lab)); if (back && !tried.has('B' + step)) { tried.add('B' + step); pick = back; } else break; }
    tried.add(pick.lab);
    const ok = await tapIdx(pick.i); await p.waitForTimeout(550);
    const label = 'tap "' + pick.lab + '"';
    if (!ok) { issues.push(label + ': could not be tapped'); continue; }
    let after = await check(label), afterSig = await sig();
    if (afterSig === beforeSig && !pick.dismiss) { await p.waitForTimeout(1100); afterSig = await sig(); after = await text(); } // a slow fade is not 'nothing'
    if (afterSig === beforeSig && !pick.dismiss) issues.push(label + ' changed nothing on screen');
    log.push({ step: label, shot: await snap(), text: after.slice(0, 160) }); before = after; beforeSig = afterSig;
  }
  fs.writeFileSync(out + '/log.json', JSON.stringify({ app, dev, issues: [...new Set(issues)], errs: [...new Set(errs)], log }, null, 1));
  console.log(app, dev, 'steps', log.length, '| issues', new Set(issues).size, '| errors', new Set(errs).size);
  await b.close();
})();
