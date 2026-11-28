#!/usr/bin/env python3
"""Fetch the testers' screenshots for one app and lay them out six to a sheet, so the app's chat can read them.

usage: python3 -I tools/shots/fetch.py <app-key> [out-dir]      e.g.  python3 -I tools/shots/fetch.py ourtable /tmp/shots

Testers add a full-size screenshot on any step of an app's test script (testers/index.html). It goes to the training
database's script_answers table, tagged role = daraja, session = the app's key, step = the step id. This reads them back
with the public key, keeps the newest picture per tester and step, and writes:
    <out>/<tester>/<step>.jpg       the picture
    <out>/sheet-1.jpg, sheet-2.jpg  six to a sheet, each labelled with the step number and what the tester answered
    <out>/steps.md                  every step's "do" and "should see" text next to its picture, and the tester's note
Needs ImageMagick (montage). Pictures come from practice copies; they can still show a phone's notification bar,
so do not copy them into the repo.
"""
import base64, json, os, re, subprocess, sys, urllib.parse, urllib.request
URL = 'https://dlpdjdswzfpmqymdswsg.supabase.co'; KEY = 'sb_publishable_DiInkgUuq_4vl6M-rC7B_g_whohrpB1'
app = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else '/tmp/shots-' + app
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.normpath(os.path.join(here, '..', '..'))
os.makedirs(out, exist_ok=True)
q = 'select=tester,step,answer,note,shot,client_at&role=eq.daraja&session=eq.' + urllib.parse.quote(app) + '&shot=not.is.null&order=client_at.desc&limit=1000'
req = urllib.request.Request(URL + '/rest/v1/script_answers?' + q, headers={'apikey': KEY, 'Authorization': 'Bearer ' + KEY})
rows = json.load(open(os.environ['SHOTS_FILE'])) if os.environ.get('SHOTS_FILE') else json.load(urllib.request.urlopen(req, timeout=60))  # SHOTS_FILE: rows from a local file, for testing
script = {}
try:
    sc = json.load(open(os.path.join(root, 'testers', 'scripts', app + '.json'), encoding='utf-8'))
    script = {s['id']: (i + 1, s) for i, s in enumerate(sc['steps'])}
except Exception: pass
seen = set(); keep = []
for r in rows:
    k = (r['tester'], r['step'])
    if k in seen: continue
    seen.add(k); keep.append(r)
keep.sort(key=lambda r: (script.get(r['step'], (999,))[0], r['tester']))
files = []; md = ['# Screenshots for ' + app + '\n']
for r in keep:
    m = re.match(r'data:image/\w+;base64,(.*)', r['shot'] or '', re.S)
    if not m: continue
    d = os.path.join(out, re.sub(r'\W+', '_', r['tester'])); os.makedirs(d, exist_ok=True)
    f = os.path.join(d, r['step'] + '.jpg'); open(f, 'wb').write(base64.b64decode(m.group(1)))
    n, st = script.get(r['step'], ('?', {}))
    icon = {'ok': 'worked', 'fail': 'DID NOT WORK', 'unsure': 'not sure'}.get(r['answer'], r['answer'])
    files.append((f, 'step %s · %s · %s' % (n, r['tester'].split(' ')[0], icon)))
    md += ['## Step %s (%s), %s: %s' % (n, r['step'], r['tester'].split(' ')[0], icon), 'Do: ' + (st.get('do') or ''), 'Should see: ' + (st.get('see') or ''),
           'Tester says: ' + (r.get('note') or '(nothing)'), '![](%s)' % os.path.relpath(f, out), '']
open(os.path.join(out, 'steps.md'), 'w', encoding='utf-8').write('\n'.join(md))
for i in range(0, len(files), 6):
    chunk = files[i:i + 6]; args = ['montage']
    for f, label in chunk: args += ['-label', label, f]
    args += ['-tile', '3x2', '-geometry', '420x800+6+6', '-pointsize', '16', '-background', '#222', '-fill', 'white', os.path.join(out, 'sheet-%d.jpg' % (i // 6 + 1))]
    subprocess.run(args, check=True)
print('%d picture(s) for %s -> %s (%d sheet(s))' % (len(files), app, out, (len(files) + 5) // 6))
