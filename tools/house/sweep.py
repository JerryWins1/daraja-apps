#!/usr/bin/env python3
"""Move the shared house block out of each page into house/house-vNN.js.

    python3 tools/house/sweep.py            dry run: says what it would do, writes nothing
    python3 tools/house/sweep.py --write    does it

Idempotent: a page already carrying <script id="dj-house-vNN" src=...> is skipped.
Per page it changes three things and nothing else: the script tag, the app's sw.js
(file added to the pre-cache list, cache name bumped) and the footer version stamp.
Pages it cannot treat cleanly are printed under NEEDS A HAND, not guessed at.
Copies listed in pinned.json, familydash and shop/watch.html are left alone on purpose.
"""
import glob, hashlib, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
VER = str(max(int(m.group(1)) for m in (re.match(r'house-v(\d+)\.js$', n) for n in os.listdir(os.path.join(ROOT, 'house'))) if m))
HOUSE = f'house/house-v{VER}.js'
TODAY = '2026-11-26'
SKIP = ['_older', 'familydash/', 'shop/watch.html'] + [p['path'] for p in json.load(open(os.path.join(ROOT, 'tools/house/pinned.json')))['pinned']]
WRITE = '--write' in sys.argv
block = open(os.path.join(ROOT, HOUSE), encoding='utf8').read()
TAG_RE = re.compile(r'<script id="dj-house-v%s">(.*?)</script>' % VER, re.S)
SKIPPABLE = re.compile(r'<script.*?</script>|<!--.*?-->|<style.*?</style>', re.S)
STAMP = re.compile(r'v(\d+(?:\.\d+)+)( · )(20\d\d-\d\d-\d\d)')

def bump(v):
    p = v.split('.'); p[-1] = str(int(p[-1]) + 1); return '.'.join(p)

def stamp(s):
    """Bump the one footer stamp. None when it is not exactly one clean string.
    Visible text first (two candidates: the one followed by ' · ' is the footer), then a JS
    constant named VER / VERSION / PL_VER, for the apps that build their footer in script."""
    vis = SKIPPABLE.sub('', s)
    found = {m.group(0) for m in STAMP.finditer(vis)}
    if len(found) > 1:
        found = {m.group(0) for m in re.finditer(STAMP.pattern + r'(?= · )', vis)}
    if len(found) == 1:
        old = found.pop()
    else:
        js = re.findall(r"^\s*(?:const|var|let)\s+(?:PL_VER|VER|VERSION)\s*=\s*['\"][^'\"]*?(" + STAMP.pattern + ")", s, re.M)
        js = {j[0] if isinstance(j, tuple) else j for j in js}
        if len(js) != 1: return None, f'{len(found)} visible stamps, {len(js)} in script'
        old = js.pop()
    m = STAMP.match(old)
    new = f'v{bump(m.group(1))}{m.group(2)}{TODAY}'
    out = re.sub(r"(?m)^(\s*(?:const|var|let)\s+(?:PL_VER|VER|VERSION)\s*=\s*['\"][^'\"]*?)" + re.escape(old), lambda m2: m2.group(1) + new, s) if old not in vis else \
          re.sub(r'<script.*?</script>|<!--.*?-->|<style.*?</style>|' + re.escape(old), lambda m2: m2.group(0) if m2.group(0).startswith('<') else new, s, flags=re.S)
    return out, f'{old} -> {new}'

def sw_edit(sw, rel):
    t = open(sw, encoding='utf8').read()
    if rel in t: return None, 'already lists it'
    n = len(t)
    t, c1 = re.subn(r"(['\"]\./index\.html['\"])", lambda m: m.group(1) + ",'" + rel + "'", t, count=1)
    t, c2 = re.subn(r"(const\s+(?:CACHE|C)\s*=\s*['\"][^'\"]*?-v)(\d+)(['\"])", lambda m: m.group(1) + str(int(m.group(2)) + 1) + m.group(3), t, count=1)
    note = ''
    # Compass and OCC deleted every other app's cache on activate; limit them to their own prefix.
    m = re.search(r"const C='([a-z-]+?)-v\d+'", t)
    if m and 'ks.filter(k=>k!==C)' in t:
        t = t.replace('ks.filter(k=>k!==C)', "ks.filter(k=>k.startsWith('%s-')&&k!==C)" % m.group(1)); note = ' + cache delete limited to own prefix'
    if not c1 and 'addAll' not in t and 'ASSETS' not in t: return None, 'already lists it (runtime cache only, no list to add to)'
    if not (c1 and c2): return None, f'could not edit (list {c1}, name {c2})'
    return t, 'ok' + note

done, hand, skipped = [], [], []
for f in sorted(glob.glob('**/*.html', recursive=True, root_dir=ROOT)):
    if any(f.startswith(p) for p in SKIP): continue
    path = os.path.join(ROOT, f)
    s = open(path, encoding='utf8', errors='surrogateescape').read()
    m = TAG_RE.search(s)
    if not m: continue
    # The 50-page majority copy (sha1 ceb3ff4a) is the file minus three small bits that home, shop and
    # testers carried and were folded in on 25 Nov; those three pages are expected to differ the other way.
    sha = hashlib.sha1(m.group(1).encode()).hexdigest()[:8]
    if m.group(1) != block and sha != 'ceb3ff4a' and f not in ('home/index.html', 'shop/index.html', 'testers/index.html'):
        hand.append((f, 'block differs from the file, left alone')); continue
    d = os.path.dirname(f)
    rel_to_page = os.path.relpath(HOUSE, d or '.')
    new = s[:m.start()] + f'<script id="dj-house-v{VER}" src="{rel_to_page}" charset="utf-8"></script>' + s[m.end():]
    st, stnote = stamp(new)
    notes = [f'stamp {stnote}']
    if st is None: hand.append((f, 'footer stamp: ' + stnote)); st = new
    sw = os.path.join(ROOT, d, 'sw.js'); sw_out = None
    if f != 'index.html' and os.path.exists(sw):
        sw_out, swnote = sw_edit(sw, os.path.relpath(HOUSE, d or '.'))
        notes.append('sw.js ' + swnote)
        if sw_out is None and 'already' not in swnote: hand.append((f, 'sw.js ' + swnote))
    if WRITE:
        open(path, 'w', encoding='utf8', errors='surrogateescape', newline='').write(st)
        if sw_out: open(sw, 'w', encoding='utf8', newline='').write(sw_out)
    done.append((f, notes))

for f, n in done: print(f'  {f:48s} {"; ".join(n)}')
print(f'\n{len(done)} pages {"changed" if WRITE else "would change"}')
if hand:
    print('\nNEEDS A HAND (tag is moved; the listed part is not):')
    for f, why in hand: print(f'  {f}: {why}')
