#!/usr/bin/env node
/* Watch every video the way Jerry watches it, and say which ones are broken.
 *
 *     node shop/checkvideos.js                 # every video
 *     node shop/checkvideos.js hq duka         # just these apps
 *     node shop/checkvideos.js --mode firsttime
 *
 * Why this exists. On 6 Nov 2026 all three Daraja HQ videos shipped showing nothing but the
 * page's password box for three minutes. They had been "tested" — but the test unhid the panel
 * by hand and fed it stub data first, so it watched a page that cannot exist for a real viewer.
 * Rule 5 in apps_data.js came out of that: test it the way he watches it. This is that test.
 *
 * So it does the real thing and nothing helpful:
 *   · it opens shop/watch.html in a browser and presses the play button,
 *   · with NOTHING in localStorage — no key, no saved state, a first-time visitor,
 *   · it serves the live jerrywins1.github.io URLs out of this working copy, so the player and
 *     the app sit on one origin exactly as they do in production, and the step scripts can run,
 *   · then it walks every line: the js must not throw, the pointer must land on something a
 *     person could actually see, and the page inside the frame must not be empty or asking to
 *     be let in.
 *
 * It needs a static server on the port below, serving the repository root:
 *     python3 -m http.server 8731
 */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8731;
const ROOT = path.resolve(__dirname, '..');
const LIVE = 'https://jerrywins1.github.io/daraja-apps/';

const args = process.argv.slice(2);
const only = args.filter(a => !a.startsWith('--'));
const modeArg = (() => { const i = args.indexOf('--mode'); return i >= 0 ? args[i + 1] : null; })();

function serveLocal(p) {
  return new Promise((res, rej) => {
    http.get({ host: 'localhost', port: PORT, path: p }, r => {
      const c = [];
      r.on('data', d => c.push(d));
      r.on('end', () => res({ status: r.statusCode, body: Buffer.concat(c),
                              type: r.headers['content-type'] || 'application/octet-stream' }));
    }).on('error', rej);
  });
}

/* ── does the video start before the app is ready? ──
 * Found on 7 Nov by the Compass chat, in a video every check here had passed. Compass opens on
 * "📍 Where are you?" until setPlace runs. Thirty-six of its lines call setPlace; the two opening
 * lines are plain strings, so the voice introduces the app for twenty seconds over a screen that
 * is not the app yet. Nothing here caught it: a line with no js and no pointer is only tested for
 * a password box and a blank page, and a country card is neither.
 *
 * This is the shape of that fault, and it can be seen without opening a browser at all. If a call
 * runs on nearly every directed line, the video needs it to be true — it is setup, re-done each
 * step because the frame may have moved on. A line 0 that skips it plays before the app is set up.
 *
 * Tidying is not setup: close/hide/toggle/reset undo something, and on line 0 there is nothing to
 * undo, so not calling them changes nothing a viewer could see. Navigation is not setup either —
 * hoisting show() to line 0 was tried on 6 Nov and made every video open on the wrong screen.
 * With those two out, this flags Compass's two videos and nothing else in the whole catalogue. */
const TIDY = /^(close|hide|dismiss|reset|clear|toggle|collapse|cancel|stop|blur)/i;
const NAV  = /^(show|go|goTo|tab|openTab|setTab|nav|screen|view|render|draw|paint|scrollTo|focus|toast)$/i;
const PLAIN = /^(if|try|catch|for|while|function|typeof|return|eval|setTimeout|setInterval|JSON|Date|Math|console|parseInt|parseFloat|String|Number|Object|Array|querySelector|getElementById)$/;
const bare = js => js.replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, "''");
const setupCalls = js => [...new Set((bare(js).match(/(?:^|[^\w.$])([A-Za-z_$][\w$]*)\s*\(/g) || [])
  .map(m => m.replace(/[^\w$]*$/, '').replace(/^[^\w$]*/, '')))]
  .filter(n => !PLAIN.test(n) && !TIDY.test(n) && !NAV.test(n) && !/^__/.test(n));

function setupGap(lines) {
  const directed = lines.filter(l => l && typeof l === 'object' && l.js);
  if (directed.length < 3) return null;
  const tally = {};
  directed.forEach(l => setupCalls(l.js).forEach(n => { tally[n] = (tally[n] || 0) + 1; }));
  const needed = Object.keys(tally).filter(n => tally[n] / directed.length >= 0.6);
  if (!needed.length) return null;
  const first = lines[0], firstJs = (first && typeof first === 'object' && first.js) || '';
  const missing = needed.filter(n => !new RegExp('\\b' + n + '\\s*\\(').test(firstJs));
  if (!missing.length) return null;
  return 'line 0 runs before ' + missing.map(n => n + '()').join(' and ') +
         ', which ' + Math.round(tally[missing[0]] / directed.length * 100) +
         '% of its other lines call — the opening talks over a screen the app has not set up yet';
}

const elsewhere = [];
function videos() {
  const APPS = new Function(fs.readFileSync(path.join(ROOT, 'shop/apps_data.js'), 'utf8') + ';return APPS;')();
  const out = [];
  for (const k of Object.keys(APPS)) {
    if (/^tpl/.test(k) || /^nourish/.test(k)) continue;        // templates, not apps
    const a = APPS[k];
    if (!a.try) continue;                                      // nothing to show
    // Some apps live in another repository (The Church App is in immanuel-app). In production
    // they sit on the same host as the player, so their videos work; from here there is no copy
    // to serve, so say that rather than calling the video broken.
    if (a.try.indexOf(LIVE) !== 0) { elsewhere.push(k + ' → ' + a.try); continue; }
    if (a.lines) out.push({ key: k + '-overview', app: k, mode: '', lines: a.lines });
    if (a.train) out.push({ key: k + '-train', app: k, mode: 'train', lines: a.train });
    for (const m of Object.keys(a.extra || {}))
      out.push({ key: k + '-' + m, app: k, mode: m, lines: a.extra[m].lines });
  }
  return out.filter(v => (!only.length || only.includes(v.app)) && (!modeArg || v.mode === modeArg));
}

(async () => {
  const list = videos();
  console.log('Checking ' + list.length + ' video(s), the way a first-time viewer sees them.\n');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pg = await ctx.newPage();

  // No mailbox, no outside world: a video must stand up on its own.
  await pg.route('**script.google.com/**', r => r.abort());
  await pg.route(LIVE.replace('https://', '**') + '**', async r => {
    const u = new URL(r.request().url());
    try {
      const f = await serveLocal(u.pathname.replace('/daraja-apps', '') + u.search);
      r.fulfill({ status: f.status, body: f.body, contentType: f.type });
    } catch (e) { r.abort(); }
  });

  const broken = [];
  for (const v of list) {
    const url = LIVE + 'shop/watch.html?app=' + encodeURIComponent(v.app) + (v.mode ? '&mode=' + v.mode : '');
    let report;
    try {
      await pg.goto(url, { waitUntil: 'load', timeout: 25000 });
      await pg.waitForTimeout(1500);
      await pg.click('#bigPlay', { timeout: 8000 });
      await pg.waitForTimeout(2500);
      await pg.evaluate(() => { try { togglePause(); } catch (e) {} });
      report = await pg.evaluate(async (n) => {
        const fr = document.getElementById('appFrame');
        if (!fr) return { fatal: 'the player has no frame' };
        let d; try { d = fr.contentDocument; } catch (e) { d = null; }
        if (!d) return { fatal: 'the app page is not reachable from the player' };
        const faults = [], screens = [];
        /* A line's js is written `try{ something(); }catch(e){}`, so if `something` does not exist
         * on that page the step fails in total silence and the screen simply never changes. That is
         * how businessmanager-firsttime shipped with twenty directed lines and one screen. So before
         * running a step, check that whatever it calls is actually there. */
        const BUILTIN = /^(window|document|localStorage|sessionStorage|JSON|Date|Math|console|setTimeout|setInterval|String|Number|Object|Array|parseInt|parseFloat|alert|scrollTo|eval)$/;
        /* Look only at code, never at text: a step that sets a style carries CSS like
         * translateY(...) inside a string, which is not a function on the page and never was. */
        const codeOnly = js => js.replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, "''");
        const callsOf = js => [...new Set((codeOnly(js).match(/(?:^|[^\w.$])([A-Za-z_$][\w$]*)\s*\(/g) || [])
          .map(m => m.replace(/[^\w$]*$/, '').replace(/^[^\w$]*/, '')))]
          .filter(nm => !BUILTIN.test(nm) && nm !== 'try' && nm !== 'catch' && nm !== 'if' && nm !== 'function');
        for (let step = 0; step < n; step++) {
          /* Tell the player which line we are on. It tames an app's first-run overlays on every
           * step, and a line may ask to keep one (keep:'.modewrap.show'); it reads that from the
           * line the player thinks it is on. Step without setting this and the player helpfully
           * closes the very screen the line is about — which looked like a broken video and was
           * a broken test. */
          try { eval('i = ' + step); } catch (e) {}
          const l = LINES[step];
          if (l && l.js) {
            try { fr.contentWindow.eval(l.js); } catch (e) { faults.push(step + ': js threw — ' + e.message.slice(0, 50)); continue; }
            /* Check the names AFTER running it, not before: a step is allowed to bootstrap its
             * own helper first (My Scores does exactly that). What matters is whether the thing
             * it calls exists by the time it is called — if it still does not, the step did
             * nothing at all and said nothing about it. */
            for (const nm of callsOf(l.js)) {
              let t = 'undefined';
              try { t = fr.contentWindow.eval('typeof ' + nm); } catch (e) {}
              if (t !== 'function') faults.push(step + ': ' + nm + '() does not exist on this page — the step does nothing');
            }
          }
          await new Promise(r => setTimeout(r, 350));   // the player's own pause before it points
          const doc = fr.contentDocument;
          const gate = doc.getElementById('gate');
          if (gate && !gate.hidden && gate.getBoundingClientRect().height > 40) { faults.push(step + ': the page is asking for a password'); continue; }
          const body = (doc.body && doc.body.innerText || '').trim();
          if (body.length < 30) faults.push(step + ': the page is blank (' + body.length + ' characters)');
          // what screen are we on? apps signal it differently, so try the usual places in turn
          const on = doc.querySelector('.tab.on, .pane.on, [data-screen].on, .view.on, .screen.on');
          const head = doc.querySelector('#ttl, #appTitle, #boardName, h1');
          const name = (on && on.id) || (doc.location && doc.location.hash) ||
                       (head && head.textContent.trim().slice(0, 24)) || body.slice(0, 18).replace(/\s+/g, ' ');
          if (screens[screens.length - 1] !== name) screens.push(name);
          if (l && l.point) {
            /* Give it the time a viewer does. The finger lands while a sentence is being spoken,
             * and a card that slides or a list that fills can take most of a second — so poll
             * rather than judge it on one reading, which only measures this script's impatience. */
            let el = null, r = null, seen = false;
            for (let t = 0; t < 1600; t += 200) {
              el = doc.querySelector(l.point);
              if (el) { r = el.getBoundingClientRect(); if (r.width > 2 && r.height > 2) { seen = true; break; } }
              await new Promise(z => setTimeout(z, 200));
            }
            if (!el) { faults.push(step + ': nothing matches ' + l.point); continue; }
            if (!seen) faults.push(step + ': ' + l.point + ' is on the page but never becomes visible');
          }
        }
        return { faults, screens: screens.length, steps: n };
      }, v.lines.length);
    } catch (e) {
      report = { fatal: e.message.split('\n')[0].slice(0, 70) };
    }
    if (report && report.faults) { const g = setupGap(v.lines); if (g) report.faults.unshift(g); }
    if (report.fatal) { broken.push([v.key, report.fatal]); console.log('  ✗ ' + v.key.padEnd(28) + report.fatal); }
    else if (report.faults.length) { broken.push([v.key, report.faults.join('; ')]);
      console.log('  ✗ ' + v.key.padEnd(28) + report.faults.length + ' problem(s)');
      report.faults.slice(0, 6).forEach(f => console.log('      ' + f)); }
    else console.log('  ✓ ' + v.key.padEnd(28) + report.steps + ' steps, ' + report.screens + ' screens');
  }

  await browser.close();
  console.log('\n' + (list.length - broken.length) + ' of ' + list.length + ' good.');
  if (elsewhere.length) {
    console.log('\nNot checked — these apps live outside this repository, so there is nothing here to serve:');
    [...new Set(elsewhere)].forEach(e => console.log('  ' + e));
  }
  if (broken.length) {
    console.log(broken.length + ' need fixing:');
    broken.forEach(([k, why]) => console.log('  ' + k.padEnd(28) + why.slice(0, 110)));
    process.exit(1);
  }
})();
