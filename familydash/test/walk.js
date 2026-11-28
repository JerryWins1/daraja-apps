// The walk-through tester: taps only what a person can see, by its words, from the real first page, the way Jerry tests.
// A screenshot at every step (for Claude to read), and checks a person would notice: a loop, a repeated line, a button that does nothing.
// usage: node walk.js <script.json> <outdir> [ipad|mac|phone]
const { chromium, devices } = require('playwright'); const fs = require('fs');
const [,, scriptPath, out = 'walk', dev = 'ipad'] = process.argv; const S = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
fs.mkdirSync(out, { recursive: true });
(async()=>{ const b = await chromium.launch();
  const ctxOpt = dev === 'mac' ? { viewport:{ width:1280, height:860 } } : dev === 'phone' ? devices['iPhone 13'] : devices['iPad Pro 11 landscape'];
  const ctx = await b.newContext(ctxOpt);
  await ctx.route('**/jszip.min.js', r => r.fulfill({ path: require.resolve('jszip/dist/jszip.min.js'), contentType:'application/javascript' }));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', x => errs.push(x.message)); p.on('dialog', d => { errs.push('DIALOG: ' + d.message().slice(0, 120)); d.accept(); });
  await p.goto(S.url || 'http://localhost:8731/familydash/?practice=fresh'); await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelectorAll('#djTour,#djHello,#djMenu,#djA2HS,#djUpdated').forEach(x => x.remove()));
  const issues = []; const seen = {}; let n = 0;
  const screenText = async () => p.evaluate(() => { const g = document.querySelector('.gvc'), sh = document.getElementById('sheet'); const root = g || (sh && sh.classList.contains('on') ? document.getElementById('sheetIn') : document.getElementById('main')); return (root ? root.innerText : document.body.innerText).replace(/\s+/g, ' '); });
  const snap = async (label) => { n++; const f = out + '/' + String(n).padStart(2, '0') + '.png'; await p.screenshot({ path:f }); return f; };
  // what a person would notice on any screen
  const look = async (label) => { const t = await screenText();
    const lines = await p.evaluate(() => [...document.querySelectorAll('.gvc .gvcA, .gvc .gvcM')].map(x => x.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
    const dup = lines.filter((x, i) => i && x === lines[i - 1]); if(dup.length) issues.push(label + ': the same line twice in a row — "' + dup[0].slice(0, 60) + '"');
    const key = t; seen[key] = (seen[key] || 0) + 1; if(seen[key] === 3 && !/type|name the/.test(label)) issues.push(label + ': this screen has come back 3 times — a loop?');
    const box = await p.evaluate(() => !!document.getElementById('gdBox')); if(box) issues.push(label + ': a helper box is floating on screen');
    const faint = await p.evaluate(() => [...document.querySelectorAll('button, .tap')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && getComputedStyle(e).opacity < .5; }).length); if(faint > 2) issues.push(label + ': ' + faint + ' buttons look greyed out');
    return t; };
  const tapText = async (txt) => { // the visible button or row whose words match, the topmost layer first
    return p.evaluate((txt) => { const vis = e => { const r = e.getBoundingClientRect(); if(!r.width || !r.height) return false; const s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none'; };
      const layers = [document.getElementById('sheet') && document.getElementById('sheet').classList.contains('on') ? document.getElementById('sheetIn') : null, document.querySelector('.gvc'), document.body].filter(Boolean);
      for(const L of layers){ const all = [...L.querySelectorAll('button, .tap, a, label, [onclick]')].filter(vis); const hit = all.find(e => e.innerText.replace(/\s+/g, ' ').trim().toLowerCase() === txt.toLowerCase()) || all.find(e => e.innerText.replace(/\s+/g, ' ').toLowerCase().includes(txt.toLowerCase()));
        if(hit){ hit.scrollIntoView({ block:'center' }); hit.click(); return hit.innerText.replace(/\s+/g, ' ').trim().slice(0, 60); } }
      return null; }, txt); };
  let before = await look('start'); const log = [{ n:1, step:'start', shot:await snap('start') }];
  for(const st of S.steps){ const label = st.say || st.tap || st.type;
    if(st.type){ await p.fill(st.into || '.gvc input:visible', st.type).catch(e => issues.push(label + ': could not type — ' + e.message.slice(0, 80))); }
    if(st.click){ try{ await p.click(st.click, { timeout:4000 }); }catch(e){ issues.push(label + ': could not tap ' + st.click); } }
    if(st.until){ let k = 0; for(; k < (st.max || 12); k++){ const t0 = await screenText(); if(new RegExp(st.until, 'i').test(t0)) break; const h = await tapText(st.tap); if(!h) break; await p.waitForTimeout(st.wait || 350); await look(label + ' #' + (k + 1)); }
      const t1 = await screenText(); if(!new RegExp(st.until, 'i').test(t1)) issues.push(label + ': kept tapping "' + st.tap + '" but never reached /' + st.until + '/'); log.push({ step:label + ' ×' + k, shot:await snap(label) }); before = t1; continue; }
    if(st.tap){ const hit = await tapText(st.tap); if(!hit){ issues.push('could not find a button "' + st.tap + '" to tap'); log.push({ step:label, missing:true, shot:await snap(label) }); if(st.must !== false) break; continue; } }
    await p.waitForTimeout(st.wait || 450);
    if(st.file){ /* a file picker opened by the tap */ }
    const after = await look(label);
    if(st.tap && after === before && !st.same) issues.push('"' + st.tap + '" changed nothing on screen');
    if(st.expect && !new RegExp(st.expect, 'i').test(after)) issues.push(label + ': expected to see /' + st.expect + '/ — not there');
    if(st.never && new RegExp(st.never, 'i').test(after)) issues.push(label + ': should not see /' + st.never + '/');
    log.push({ step:label, shot:await snap(label), text:after.slice(-300) }); before = after; }
  fs.writeFileSync(out + '/log.json', JSON.stringify({ issues, errs, log }, null, 1));
  console.log('steps', log.length, '| issues', issues.length, '| errors', errs.length); issues.forEach(x => console.log('ISSUE', x)); errs.forEach(x => console.log('ERROR', x));
  await b.close(); })();
