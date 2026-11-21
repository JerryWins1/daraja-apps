#!/usr/bin/env node
/* Safe rollout — Jerry's idea 9: a new version goes to testers first, and reaches everyone a day
 * later if nothing has gone wrong.
 *
 *   node tools/rollout.js start <app>     put the working copy at <app>/beta/ for testers
 *   node tools/rollout.js list            what is waiting, and how long is left
 *   node tools/rollout.js promote <app>   the beta becomes the released app
 *   node tools/rollout.js drop <app>      throw the beta away, released app untouched
 *
 * WHAT CANNOT BE DONE, and why this works the way it does. GitHub Pages serves ONE copy of main to
 * everybody. There is no way to hand a tester different bytes from the ones a customer gets, so
 * nothing can be "held back" from some people at one address. Two other ideas were measured and
 * rejected on 21 November:
 *
 *   · Hold it in the service worker. Every app has its own sw.js and there are 34 different ones,
 *     each owned by that app's chat; the common shape is network-first
 *     (fetch().catch(() => caches.match())), so it serves the newest the moment it is pushed.
 *     Rewriting all of them to gate on a date is a change across other chats' files, and the
 *     failure mode is the one you cannot recover from: a worker that decides wrongly never to
 *     update leaves every customer stranded on a stale version with no way to push them a fix.
 *   · Serve two copies from one address. Not possible without a server, and Pages is not one.
 *
 * So the only honest mechanism is the obvious one: publish the new version at a SECOND ADDRESS
 * that only testers are given, and move it to the real address when it has earned it. "Held back"
 * then means nothing more than "the released file has not changed yet", which is true, simple, and
 * cannot strand anybody.
 *
 * The beta is a byte-identical copy of the app. It needs no build step and no injected marker: the
 * house block (v75) sees that it is sitting at <app>/beta/, uses the parent folder as the app's
 * slug so the tester's saved work, backup entry and tour all still belong to the same app, and
 * shows a band saying this is the next version with a way back to the released one.
 */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BOOK = path.join(ROOT, 'control', 'rollout.json');
const HOLD_HOURS = 24;

const read = () => { try { return JSON.parse(fs.readFileSync(BOOK, 'utf8')); } catch (e) { return { holds: [] }; } };
const write = b => fs.writeFileSync(BOOK, JSON.stringify(b, null, 1) + '\n');
const live = app => path.join(ROOT, app, 'index.html');
const beta = app => path.join(ROOT, app, 'beta', 'index.html');
const hours = since => (Date.now() - Date.parse(since)) / 36e5;

function houseOf(file) {
  const s = fs.readFileSync(file, 'utf8');
  const m = s.match(/id="dj-house-v(\d+)"/);
  return m ? Number(m[1]) : null;
}

function start(app) {
  if (!fs.existsSync(live(app))) throw new Error(`there is no ${app}/index.html`);
  const v = houseOf(live(app));
  if (v === null || v < 75) throw new Error(`${app} carries house v${v || '?'}; the beta band and the slug fix arrived in v75`);
  fs.mkdirSync(path.dirname(beta(app)), { recursive: true });
  fs.copyFileSync(live(app), beta(app));
  const b = read();
  b.holds = b.holds.filter(h => h.app !== app);
  b.holds.push({ app, since: new Date().toISOString(), hours: HOLD_HOURS });
  write(b);
  console.log(`${app}: the next version is at ${app}/beta/ for testers.`);
  console.log(`Released app is untouched. Promotable in ${HOLD_HOURS} hours, if nothing has gone wrong.`);
}

function list() {
  const b = read();
  if (!b.holds.length) return console.log('Nothing is waiting.');
  for (const h of b.holds) {
    const left = (h.hours || HOLD_HOURS) - hours(h.since);
    const there = fs.existsSync(beta(h.app));
    console.log(`${h.app.padEnd(22)} ${there ? '' : 'BETA FILE MISSING  '}` +
      (left > 0 ? `${left.toFixed(1)}h to go` : `ready — ${(-left).toFixed(1)}h past its hold`));
  }
}

function promote(app, force) {
  const b = read();
  const h = b.holds.find(x => x.app === app);
  if (!h) throw new Error(`${app} has no beta waiting — run start first`);
  if (!fs.existsSync(beta(app))) throw new Error(`${app}/beta/index.html is gone; run drop and start again`);
  const left = (h.hours || HOLD_HOURS) - hours(h.since);
  if (left > 0 && !force) throw new Error(`${app} has ${left.toFixed(1)} hours left of its ${h.hours || HOLD_HOURS}-hour hold. Pass --now to go early, and say why in the commit.`);
  fs.copyFileSync(beta(app), live(app));
  fs.rmSync(path.join(ROOT, app, 'beta'), { recursive: true, force: true });
  b.holds = b.holds.filter(x => x.app !== app);
  write(b);
  console.log(`${app}: the beta is now the released app, and ${app}/beta/ is gone.`);
  console.log('Commit both, and anyone still on the beta link lands on the released one.');
}

function drop(app) {
  const b = read();
  fs.rmSync(path.join(ROOT, app, 'beta'), { recursive: true, force: true });
  b.holds = b.holds.filter(x => x.app !== app);
  write(b);
  console.log(`${app}: the beta is gone. The released app was never touched.`);
}

const [cmd, app] = process.argv.slice(2);
const force = process.argv.includes('--now');
try {
  if (cmd === 'start' && app) start(app);
  else if (cmd === 'list') list();
  else if (cmd === 'promote' && app) promote(app, force);
  else if (cmd === 'drop' && app) drop(app);
  else {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 9).join('\n').replace(/^ \* ?/gm, ''));
    process.exit(1);
  }
} catch (e) { console.error(String(e.message || e)); process.exit(1); }
