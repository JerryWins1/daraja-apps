/* Rebuilds c01.png .. cNN.png from slides.html in this folder.
 *
 *     node kenya/changes/makeslides.js
 *
 * One <section class="slide"> in slides.html makes one picture, at 720x1280,
 * in the order they appear. The spoken lines live in index.html and have to be
 * changed with the words here — the picture and the voice are one thing.
 *
 * This is committed on purpose. The leader video's makeslides.js never was,
 * so when its screen changed on 9 November its slides could not be rebuilt.
 */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const dir = __dirname;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(dir, 'slides.html'), { waitUntil: 'load' });
  await p.waitForTimeout(400);

  const n = await p.evaluate(() => document.querySelectorAll('section.slide').length);
  if (!n) { console.error('no slides found in slides.html'); process.exit(1); }

  for (let i = 0; i < n; i++) {
    await p.evaluate(k => {
      document.querySelectorAll('section.slide').forEach((s, j) => {
        s.style.display = (j === k) ? 'block' : 'none';
      });
      window.scrollTo(0, 0);
    }, i);
    await p.waitForTimeout(120);
    const name = 'c' + String(i + 1).padStart(2, '0') + '.png';
    await p.screenshot({ path: path.join(dir, name) });
    console.log('wrote', name);
  }
  await b.close();
  console.log(n + ' slides rebuilt');
})();
