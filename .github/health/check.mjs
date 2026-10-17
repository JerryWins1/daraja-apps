// Daraja nightly health check · v1.0 · 2026-10-14
// Loads every live page in pages.json as an iPhone 12 mini (360x780, iPhone UA), records what breaks,
// HEAD-checks same-site links/files, then (in GitHub Actions) opens/updates/closes ONE issue and,
// only when something is wrong, posts one plain-words line to Daraja HQ via the public "help" action.
// Source of truth: Daraja Studio/_build tools/health/ on Jerry's Mac (make_pages.py rebuilds pages.json).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const HERE = new URL('.', import.meta.url);
const pages = JSON.parse(readFileSync(new URL('pages.json', HERE)));
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const PARALLEL = 8, NAV_TIMEOUT = 45000, IDLE_WAIT = 15000;

// Known noise — not faults. Each line says why. (List what we ignore so nobody wonders.)
const IGNORE = [
  [/favicon/i, 'missing favicon'],
  [/livetiming\.formula1\.com/i, 'Pit Wall: the F1 live feed refuses browsers; the app falls back by design'],
  [/net::ERR_ABORTED|net::ERR_FAILED/i, 'a request the check itself stopped (writes are blocked) or the browser cancelled'],
  [/Failed to load resource: the server responded with a status of 404/i, 'console echo of a 404 — the 404 itself is reported once as a missing file'],
  [/Failed to load resource/i, 'console echo of a blocked/failed request — real misses are reported as missing files'],
  [/googletagmanager|google-analytics|doubleclick/i, 'third-party analytics'],
  [/ServiceWorker|service worker/i, 'service workers are blocked during the check'],
  [/Notification|permission/i, 'browser permission prompts are not available headless'],
];
const ignored = new Map();
const noise = (t) => { for (const [re, why] of IGNORE) if (re.test(t)) { ignored.set(why, (ignored.get(why) || 0) + 1); return true; } return false; };

const sameSite = (u, base) => {
  try { const a = new URL(u, base), b = new URL(base);
    const root = b.origin + '/' + b.pathname.split('/')[1] + '/';
    return a.href.startsWith(root) ? a.href.split('#')[0] : null; } catch { return null; }
};

async function checkPage(browser, p) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 3, isMobile: true,
    hasTouch: true, userAgent: UA, serviceWorkers: 'block' });
  // A check must never write anywhere: only GET/HEAD leave the browser (same rule as runcheck.py).
  await ctx.route('**/*', (route) => ['GET', 'HEAD'].includes(route.request().method()) ? route.continue() : route.abort());
  const page = await ctx.newPage();
  const faults = [], missing = new Set();
  page.on('pageerror', (e) => { const t = String(e.message || e).split('\n')[0].slice(0, 200); if (!noise(t)) faults.push({ kind: 'script', text: t }); });
  page.on('console', (m) => { if (m.type() === 'error') { const t = m.text().slice(0, 200); if (!noise(t)) faults.push({ kind: 'console', text: t }); } });
  page.on('response', (r) => { if (r.status() === 404) { const u = sameSite(r.url(), p.url); if (u && !noise(u)) missing.add(u); } });
  const out = { key: p.key, name: p.name || p.key, url: p.url, status: 0, faults, links: [] };
  try {
    const resp = await page.goto(p.url, { waitUntil: 'load', timeout: NAV_TIMEOUT });
    out.status = resp ? resp.status() : 0;
    if (out.status >= 400) faults.push({ kind: 'http', text: 'HTTP ' + out.status });
    await page.waitForLoadState('networkidle', { timeout: IDLE_WAIT }).catch(() => { out.busy = true; }); // polling pages never go idle; not a fault
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => ({
      title: document.title.trim(),
      words: (document.body && document.body.innerText || '').trim().length,
      house: !!document.querySelector('script[id^="dj-house-v"]'),
      redbar: (document.getElementById('djBanner') || {}).innerText || '',
      refs: [...document.querySelectorAll('a[href],link[href],script[src],img[src],source[src],iframe[src]')]
        .map((e) => e.getAttribute('href') || e.getAttribute('src')),
    }));
    if (!info.title && info.words < 20) faults.push({ kind: 'blank', text: 'no title and almost no words on screen' });
    if (info.redbar) faults.push({ kind: 'redbar', text: info.redbar.replace(/\n/g, ' ').slice(0, 120) });
    if (p.house && !info.house) faults.push({ kind: 'house', text: 'dj-house layer missing' });
    out.links = [...new Set(info.refs.map((r) => r && !/^(mailto|tel|sms|javascript|data|blob):/i.test(r) ? sameSite(r, page.url()) : null).filter(Boolean))];
  } catch (e) {
    faults.push({ kind: 'load', text: String(e.message || e).split('\n')[0].slice(0, 160) });
  }
  for (const u of missing) faults.push({ kind: 'missing', text: '404 ' + u });
  await ctx.close();
  return out;
}

async function pool(items, n, fn) {
  const res = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; res[k] = await fn(items[k]); } }));
  return res;
}

const PLAIN = {
  http: 'The page does not open.',
  load: 'The page did not finish loading.',
  script: 'A script error while loading — part of the page may not work.',
  console: 'The browser logged an error while loading.',
  blank: 'The page came up blank.',
  redbar: 'The red “something went wrong” bar shows on this page.',
  house: 'The Daraja menu/help layer is missing from this page.',
  missing: 'A file or link on this page is missing (404).',
};

const t0 = Date.now();
const browser = await chromium.launch();
let results = await pool(pages, PARALLEL, (p) => checkPage(browser, p));
// second look at anything that failed, so one slow night on GitHub Pages does not cry wolf
const retry = results.filter((r) => r.faults.length).map((r) => pages.find((p) => p.url === r.url));
if (retry.length) {
  const again = await pool(retry, 4, (p) => checkPage(browser, p));
  for (const a of again) { const i = results.findIndex((r) => r.url === a.url); results[i] = a; }
}
await browser.close();

// HEAD-check every same-site link found (once each), skipping ones already seen as 404 above
const linkPages = new Map();
for (const r of results) for (const l of r.links) { if (!linkPages.has(l)) linkPages.set(l, []); linkPages.get(l).push(r); }
const already = new Set(results.flatMap((r) => r.faults.filter((f) => f.kind === 'missing').map((f) => f.text.slice(4))));
const head = async (u) => { for (let a = 0; a < 2; a++) { try { const r = await fetch(u, { method: 'HEAD', redirect: 'follow' }); if (r.status !== 404) return r.status; } catch { if (a) return -1; } } return 404; };
await pool([...linkPages.keys()].filter((u) => !already.has(u)), 16, async (u) => {
  if ((await head(u)) === 404) for (const r of linkPages.get(u)) r.faults.push({ kind: 'missing', text: '404 ' + u });
});

const bad = results.filter((r) => r.faults.length);
const problems = bad.reduce((n, r) => n + r.faults.length, 0);
const secs = Math.round((Date.now() - t0) / 1000);
const day = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
console.log(`\n${results.length} pages, ${linkPages.size} links checked in ${secs}s — ${problems} problems on ${bad.length} pages`);
for (const r of results) console.log(`${r.faults.length ? '✗' : '✓'} ${r.key.padEnd(24)} ${r.status} ${r.faults.map((f) => f.kind + ': ' + f.text).join(' | ').slice(0, 400)}`);
console.log('\nIgnored as known noise:'); for (const [why, n] of ignored) console.log(`  ${n}× ${why}`);
writeFileSync('health-results.json', JSON.stringify({ day, secs, results, ignored: [...ignored] }, null, 1));

// ---------- report (only inside GitHub Actions) ----------
const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_SERVER_URL, GITHUB_RUN_ID, QUIET } = process.env;
if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) process.exit(0);
const api = async (path, method = 'GET', body) => {
  const r = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}${path}`, { method, headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'daraja-health',
    ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return r.status === 204 ? {} : r.json();
};
const runUrl = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
const open = (await api('/issues?labels=nightly-check&state=open&per_page=10')).filter?.((i) => !i.pull_request) || [];

if (!bad.length) {
  for (const i of open) {
    await api(`/issues/${i.number}/comments`, 'POST', { body: `✅ Clean night ${day}: all ${results.length} pages and ${linkPages.size} links fine. Closing. ([run](${runUrl}))` });
    await api(`/issues/${i.number}`, 'PATCH', { state: 'closed', state_reason: 'completed' });
  }
  console.log('Clean — nothing posted to HQ.');
  process.exit(0);
}

const title = `Nightly check: ${problems} problem${problems === 1 ? '' : 's'}`;
let body = `**Nightly check ${day}** — ${problems} problem${problems === 1 ? '' : 's'} on ${bad.length} of ${results.length} pages (iPhone 12 mini, 360×780). [Full log](${runUrl})\n\n`;
for (const r of bad) {
  body += `### ${r.name}\n${r.url}\n`;
  for (const f of r.faults) body += `- **${PLAIN[f.kind] || f.kind}** \`${f.text.replace(/`/g, "'")}\`\n`;
  body += '\n';
}
body += `<sub>Known noise ignored: ${[...ignored].map(([w, n]) => `${n}× ${w}`).join('; ') || 'none'}. This issue updates each night and closes itself on a clean night. Say “run the nightly check” to rerun.</sub>`;
const labels = await api('/labels/nightly-check');
if (labels.message === 'Not Found') await api('/labels', 'POST', { name: 'nightly-check', color: 'd93f0b', description: 'Opened and closed by the nightly health check' });
if (open.length) {
  await api(`/issues/${open[0].number}`, 'PATCH', { title, body });
  await api(`/issues/${open[0].number}/comments`, 'POST', { body: `Still ${problems} problem${problems === 1 ? '' : 's'} on ${day}. ([run](${runUrl}))` });
  console.log('Updated issue #' + open[0].number);
} else {
  const i = await api('/issues', 'POST', { title, body, labels: ['nightly-check'] });
  console.log('Opened issue #' + i.number);
}

if (QUIET === 'true') { console.log('Quiet run — not posting to HQ.'); process.exit(0); }
try {
  const cfg = await (await fetch('https://jerrywins1.github.io/daraja-apps/testers/config.json?cb=' + Date.now())).json();
  if (!cfg.mailbox) throw new Error('no mailbox in config');
  const short = bad.slice(0, 3).map((r) => `${r.name.split(/ [—·-] /)[0]}: ${(PLAIN[r.faults[0].kind] || r.faults[0].kind).replace(/\.$/, '').toLowerCase()}`).join('; ');
  const text = `Nightly check ${day}: ${problems} problem${problems === 1 ? '' : 's'} — ${short}${bad.length > 3 ? `; +${bad.length - 3} more pages` : ''}. Details in GitHub: ${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/issues?q=label%3Anightly-check`;
  const r = await fetch(cfg.mailbox, { method: 'POST', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'help', name: 'Nightly check', contact: '', app: 'health', text }), redirect: 'follow' });
  console.log('HQ post:', r.status, (await r.text()).slice(0, 120));
} catch (e) { console.log('HQ post failed (the issue still has everything):', e.message); }
