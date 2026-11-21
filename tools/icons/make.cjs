#!/usr/bin/env node
/* Render each app's icon.svg to a 180x180 icon-180.png for the Home Screen.
 *
 *   node tools/icons/make.cjs            every app whose apple-touch-icon is an SVG
 *   node tools/icons/make.cjs advent     just one
 *   node tools/icons/make.cjs --check    report, change nothing
 *
 * Why: iOS does not render SVG for <link rel="apple-touch-icon">. An app that points there gets a
 * blank white tile on the Home Screen — found by the Pit Wall chat on 21 November, and it undercuts
 * the "Put this app on your Home Screen" row the house shipped the same day. Chrome and Android
 * read the manifest instead, so this is an iOS-only fault with an iOS-only fix.
 *
 * Each PNG is checked for ink before it is kept: a file that comes out blank, or all one colour, is
 * refused rather than written, because a blank PNG looks exactly like the bug it is meant to fix.
 */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const SIZE = 180;

const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
  const f = path.join(d, e.name);
  if (e.isDirectory()) return ['.git', 'node_modules', '_older versions'].includes(e.name) ? [] : walk(f);
  return e.name === 'index.html' ? [f] : [];
});

function appsWithSvgIcon() {
  return walk(ROOT).filter(f => /dj-house-v\d+/.test(fs.readFileSync(f, 'utf8')))
    .filter(f => /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']icon\.svg["']/i.test(fs.readFileSync(f, 'utf8')))
    .map(f => path.relative(ROOT, path.dirname(f)));
}

(async () => {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const want = args.filter(a => a !== '--check');
  let apps = appsWithSvgIcon();
  if (want.length) apps = apps.filter(a => want.some(w => a === w || a.endsWith('/' + w)));
  if (!apps.length) { console.log('Nothing to do — no app points apple-touch-icon at an SVG.'); return; }
  if (check) { console.log(`${apps.length} apps still point at an SVG:`); apps.forEach(a => console.log('  ' + a)); return; }

  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 });
  const done = [], refused = [];
  for (const a of apps) {
    const svg = path.join(ROOT, a, 'icon.svg');
    if (!fs.existsSync(svg)) { refused.push(`${a}: no icon.svg`); continue; }
    const p = await ctx.newPage();
    /* Apple wants a full-bleed square with no transparency and applies its own rounded mask. These
       icons draw their own rounded rect, so the corners come out transparent and iOS would show
       black through them. Paint the page in the rect's own colour first, so the tile is solid. */
    const src = fs.readFileSync(svg, 'utf8');
    const bgm = src.match(/<rect[^>]*fill=["'](#[0-9a-fA-F]{3,8}|[a-z]+)["']/) || src.match(/fill=["'](#[0-9a-fA-F]{3,8})["']/);
    const bg = bgm ? bgm[1] : '#ffffff';
    await p.setContent(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:${SIZE}px;height:${SIZE}px;overflow:hidden;background:${bg}}
      img{width:${SIZE}px;height:${SIZE}px;display:block}</style><img src="data:image/svg+xml;base64,${Buffer.from(src).toString('base64')}">`);
    await p.waitForTimeout(250);
    const buf = await p.screenshot({ type: 'png' });
    /* ink check: a tile that is blank, or one flat colour, is the very bug this fixes */
    const colours = await p.evaluate(async (size) => {
      const img = document.querySelector('img');
      const c = document.createElement('canvas'); c.width = c.height = size;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, size, size);
      const d = x.getImageData(0, 0, size, size).data, seen = new Set();
      for (let i = 0; i < d.length; i += 4 * 37) seen.add(`${d[i]},${d[i+1]},${d[i+2]},${d[i+3]}`);
      return seen.size;
    }, SIZE).catch(() => 0);
    await p.close();
    if (colours < 2) { refused.push(`${a}: the render came out flat (${colours} colour) — left alone`); continue; }
    fs.writeFileSync(path.join(ROOT, a, 'icon-180.png'), buf);
    const f = path.join(ROOT, a, 'index.html');
    const s = fs.readFileSync(f, 'utf8');
    const n = s.replace(/(<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["'])icon\.svg(["'])/i, '$1icon-180.png$2');
    if (n === s) { refused.push(`${a}: the link did not change`); continue; }
    fs.writeFileSync(f, n);
    done.push(`${a}  ${(buf.length / 1024).toFixed(1)} KB, ${colours} colours`);
  }
  await b.close();
  console.log(`${done.length} icons rendered and pointed at:`);
  done.forEach(d => console.log('  ' + d));
  if (refused.length) { console.log(`\n${refused.length} left alone:`); refused.forEach(r => console.log('  ' + r)); }
})().catch(e => { console.error(String(e.message || e)); process.exit(1); });
