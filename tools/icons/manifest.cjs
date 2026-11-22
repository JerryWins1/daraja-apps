#!/usr/bin/env node
/* Put real PNG icons in every app's web app manifest.
 *
 *   node tools/icons/manifest.cjs            every app whose manifest lists no PNG
 *   node tools/icons/manifest.cjs home shop  just these
 *   node tools/icons/manifest.cjs --check    report, change nothing
 *
 * WHY. Chrome decides on its own whether a page can be installed, and only when it says yes does
 * it hand the page a beforeinstallprompt — which is the one-tap Install button on the install
 * screen the house shows to someone arriving from the store. An SVG-only icon list is the part of
 * that decision nobody here can see: measured 22 November, this container's Chromium answers
 * Page.getInstallabilityErrors with an empty list even for shop/, which at the time had NO
 * manifest at all, so the check is simply not running in headless and tells us nothing. Chrome's
 * own installability page was not reachable from this container either. What every piece of
 * guidance that WAS reachable agrees on is to carry a rasterised icon beside an SVG, so this puts
 * a 192 and a 512 PNG in each manifest and the question stops mattering.
 *
 * The render and its ink check come from make.cjs, which does the same job for the iOS
 * apple-touch-icon tile at 180. One renderer, so the two cannot drift apart.
 *
 * A manifest is only ever ADDED TO. An app's own icons, name, colours and scope are its chat's,
 * and an app that already lists a PNG is left alone.
 */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { renderIcon, ROOT, walk, isPinned } = require('./make.cjs');

const SIZES = [192, 512];

function manifestOf(appDir) {
  const f = path.join(ROOT, appDir, 'index.html');
  const s = fs.readFileSync(f, 'utf8');
  const m = s.match(/<link[^>]*rel=["']manifest["'][^>]*href=["']([^"']+)["']/i);
  if (!m) return null;
  const href = m[1].split('?')[0];
  if (/^(data|https?):/i.test(href)) return { href, external: true };
  const p = path.join(ROOT, appDir, href);
  if (!fs.existsSync(p)) return { href, missing: true };
  return { href, path: p };
}

function apps() {
  return walk(ROOT).filter(f => !isPinned(f) && /dj-house-v\d+/.test(fs.readFileSync(f, 'utf8')))
    .map(f => path.relative(ROOT, path.dirname(f)));
}

(async () => {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const want = args.filter(a => a !== '--check');

  const todo = [], skip = [];
  for (const a of apps().filter(a => !want.length || want.some(w => a === w || a.endsWith('/' + w)))) {
    const mf = manifestOf(a);
    if (!mf) { skip.push(`${a}: no manifest linked — nothing to add to`); continue; }
    if (mf.external) { skip.push(`${a}: its manifest is a ${mf.href.split(':')[0]}: URL, its chat's own`); continue; }
    if (mf.missing) { skip.push(`${a}: links ${mf.href}, which is not there`); continue; }
    let j;
    try { j = JSON.parse(fs.readFileSync(mf.path, 'utf8')); }
    catch (e) { skip.push(`${a}: its manifest will not parse — left alone`); continue; }
    const icons = Array.isArray(j.icons) ? j.icons : [];
    if (icons.some(i => /\.png(\?|$)/i.test(i.src || '') || (i.type || '') === 'image/png')) {
      skip.push(`${a}: already lists a PNG`); continue;
    }
    if (!fs.existsSync(path.join(ROOT, a, 'icon.svg'))) { skip.push(`${a}: no icon.svg to render from`); continue; }
    todo.push({ app: a, mf, j, icons });
  }

  if (check) {
    console.log(`${todo.length} manifests would get a 192 and a 512 PNG:`);
    todo.forEach(t => console.log('  ' + t.app));
    if (skip.length) { console.log(`\n${skip.length} left alone:`); skip.forEach(s => console.log('  ' + s)); }
    return;
  }
  if (!todo.length) { console.log('Nothing to do.'); skip.forEach(s => console.log('  ' + s)); return; }

  const b = await chromium.launch();
  const ctx = await b.newContext({ deviceScaleFactor: 1 });
  const done = [], refused = [];
  for (const t of todo) {
    const svg = path.join(ROOT, t.app, 'icon.svg');
    const made = [];
    let flat = 0;
    for (const size of SIZES) {
      const { buf, colours } = await renderIcon(ctx, svg, size);
      if (colours < 2) { flat = colours; break; }
      made.push({ size, buf });
    }
    if (flat !== 0 || made.length !== SIZES.length) {
      refused.push(`${t.app}: a render came out flat (${flat} colour) — nothing written`); continue;
    }
    for (const m of made) fs.writeFileSync(path.join(ROOT, t.app, `icon-${m.size}.png`), m.buf);
    /* added after whatever the app already lists, so its own SVG stays the first choice */
    t.j.icons = t.icons.concat(SIZES.map(s => ({ src: `icon-${s}.png`, sizes: `${s}x${s}`, type: 'image/png', purpose: 'any maskable' })));
    fs.writeFileSync(t.mf.path, JSON.stringify(t.j, null, 2) + '\n');
    done.push(`${t.app}  ${made.map(m => `${m.size} ${(m.buf.length / 1024).toFixed(1)}KB`).join(', ')}`);
  }
  await b.close();
  console.log(`${done.length} manifests now carry PNG icons:`);
  done.forEach(d => console.log('  ' + d));
  if (refused.length) { console.log(`\n${refused.length} refused:`); refused.forEach(r => console.log('  ' + r)); }
  if (skip.length) { console.log(`\n${skip.length} left alone:`); skip.forEach(s => console.log('  ' + s)); }
})().catch(e => { console.error(String(e.message || e)); process.exit(1); });
