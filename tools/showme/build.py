#!/usr/bin/env python3
"""▶ Show me — build the small files the house block reads to play an app's own videos inside the app.
v1 · 2026-11-26

Jerry, 25 Nov: can each app's videos play INSIDE the app, in parts, right at the screen they explain,
instead of sending people away? The house block (section 14c, house/house-v88.js) answers that with a
▶ Show me sheet that plays shop/watch.html?embed=1 in place, from line A to line B of one video.

To know which part belongs to which screen, it needs each video cut into scenes, and the lines in
shop/apps_data.js already say where the screen changes: a line with `js` opens a screen, a line with
`point` rings a control on it. This script cuts every video at those lines and writes, for each app:

    shop/showme/index.json        {"v": ..., "paths": {"/daraja-apps/ourtable/": "ourtable", ...}}
    shop/showme/<key>.json        {"key", "name", "vids": [{"m", "t", "n", "s", "ch": [[from, to, sec, title, [selectors]]]}]}

The whole catalogue is ~490 KB; one app's file is a few KB, fetched only when the person taps or the
page has sat still for a while. RUN IT AGAIN whenever a video's lines change (same moment as
voicemaker.py):  python3 tools/showme/build.py   (from the repo root; needs macOS jsc or node).
"""
import json, os, re, subprocess, sys, pathlib, shutil, urllib.parse

ROOT = pathlib.Path(__file__).resolve().parents[2]
SHOP = ROOT / 'shop'
OUT = SHOP / 'showme'
JSC = '/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc'
VERSION = 'v1 · 2026-11-26'

def load_catalogue():
    src = (SHOP / 'apps_data.js').read_text(encoding='utf-8')
    tail = "\n;(function(){var o={};Object.keys(APPS).forEach(function(k){var a=APPS[k];o[k]={name:a.showName||a.name,em:a.em,cat:a.cat,try:a.try||'',video:a.video,lines:a.lines||null,train:a.train||null,extra:a.extra||null};});var s=JSON.stringify({apps:o,launch:(typeof LAUNCH!=='undefined'?LAUNCH:null)});if(typeof print==='function')print(s);else console.log(s);})();"
    tmp = OUT / '_cat.js'
    tmp.write_text(src + tail, encoding='utf-8')
    try:
        if os.path.exists(JSC):
            r = subprocess.run([JSC, str(tmp)], capture_output=True, text=True)
        else:
            r = subprocess.run(['node', str(tmp)], capture_output=True, text=True)
        if r.returncode != 0: sys.exit('could not read apps_data.js: ' + r.stderr[:400])
        return json.loads(r.stdout)
    finally:
        tmp.unlink(missing_ok=True)

SCROLL_ONLY = re.compile(r'^(?:\s*try\s*\{\s*window\.scrollTo\([^)]*\)\s*;?\s*\}\s*catch\s*\(\s*e\s*\)\s*\{\s*\}\s*;?)+\s*$')
def opens_screen(js):
    return bool(js) and not SCROLL_ONLY.match(js) and 'scrollTo' != js.strip()[:8]

def selectors_in(js):
    out = []
    for m in re.finditer(r"querySelector(?:All)?\(\s*(['\"])(.*?)(?<!\\)\1\s*\)", js or ''):
        out.append(m.group(2).replace('\\"', '"').replace("\\'", "'"))
    for m in re.finditer(r"getElementById\(\s*(['\"])([A-Za-z][\w-]*)\1\s*\)", js or ''):
        out.append('#' + m.group(2))
    return out

def first_sentence(t, n=90):
    t = re.sub(r'\s+', ' ', str(t)).strip()
    m = re.match(r'(.+?[.!?…])(\s|$)', t)
    s = m.group(1) if m else t
    return s if len(s) <= n else s[:n - 1].rsplit(' ', 1)[0] + '…'

def text_of(l): return l if isinstance(l, str) else (l.get('t') or '')

def chapters(lines, cues):
    """Cut at every line whose js opens a screen. A part of one line is merged into the next, so
    nobody is offered a three-second clip. Each part keeps the selectors its lines ring or open."""
    starts = [0] + [i for i, l in enumerate(lines) if i and isinstance(l, dict) and opens_screen(l.get('js'))]
    spans = [[a, (starts[k + 1] - 1) if k + 1 < len(starts) else len(lines) - 1] for k, a in enumerate(starts)]
    merged = []
    for a, b in spans:
        if merged and merged[-1][1] - merged[-1][0] == 0: merged[-1][1] = b     # a one-line part joins the next
        else: merged.append([a, b])
    if len(merged) > 1 and merged[-1][1] - merged[-1][0] == 0:
        last = merged.pop(); merged[-1][1] = last[1]
    out = []
    for a, b in merged:
        sels = []
        for l in lines[a:b + 1]:
            if not isinstance(l, dict): continue
            if l.get('point'): sels.append(l['point'])
            sels += selectors_in(l.get('js'))
        sels = list(dict.fromkeys(s for s in sels if s and len(s) < 160))[:10]
        sec = None
        if cues and len(cues) == len(lines):
            try: sec = round(cues[b][1] - cues[a][0] + 0.5 * (b - a))
            except Exception: sec = None
        if sec is None: sec = round(sum(len(text_of(l)) for l in lines[a:b + 1]) / 14.5)
        out.append([a, b, int(sec), first_sentence(text_of(lines[a])), sels])
    return out

def main():
    OUT.mkdir(exist_ok=True)
    cat = load_catalogue()
    voice = json.loads((SHOP / 'voice' / 'index.json').read_text(encoding='utf-8'))
    paths, wrote = {}, 0
    for k, a in cat['apps'].items():
        vids = []
        def add(m, title, lines):
            if not lines: return
            v = voice.get(f'{k}-{m}') or {}
            cues = v.get('cues') if v.get('cues') and len(v['cues']) == len(lines) else None
            ch = chapters(lines, cues)
            total = sum(c[2] for c in ch)
            vids.append({'m': m, 't': title, 'n': len(lines), 's': total, 'ch': ch})
        if a.get('lines') and a.get('video') is not False: add('overview', 'The short overview', a['lines'])
        ex = a.get('extra') or {}
        if ex.get('firsttime'): add('firsttime', ex['firsttime'].get('title') or 'Explain it to me', ex['firsttime'].get('lines'))
        if a.get('train'): add('train', 'Step by step', a['train'])
        if not vids or not a.get('try'): continue
        u = urllib.parse.urlparse(a['try'])
        if u.netloc != 'jerrywins1.github.io': continue
        p = urllib.parse.unquote(u.path)
        p = re.sub(r'index\.html$', '', p)
        if not p.endswith('/'): p = p.rsplit('/', 1)[0] + '/'
        paths.setdefault(p, k)   # first entry wins (business-manager is shared by two keys; ?mode decides — see house)
        (OUT / f'{k}.json').write_text(json.dumps({'key': k, 'name': a.get('name'), 'em': a.get('em'), 'v': VERSION, 'vids': vids}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        wrote += 1
    # two keys share one page: the house picks by ?mode= (quotes → quickquote)
    modes = {'/daraja-apps/business-manager/': {'quotes': 'quickquote', 'full': 'businessmanager'}}
    (OUT / 'index.json').write_text(json.dumps({'v': VERSION, 'paths': paths, 'modes': modes}, ensure_ascii=False, indent=0), encoding='utf-8')
    print(f'{wrote} apps written to shop/showme/, {len(paths)} paths')

if __name__ == '__main__':
    main()
