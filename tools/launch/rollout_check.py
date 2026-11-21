#!/usr/bin/env python3
"""Which betas may be promoted tonight — launch idea 9's missing half (control/launch-plan.md).

usage: python3 -I tools/launch/rollout_check.py <unzipped HQ export dir>

For every hold in control/rollout.json whose hours have passed, look for a
"Send us a message" problem (FEEDBACK|kind:problem) for that app dated on or
after the beta started. Prints one line per hold:
    PROMOTE <app>   hold passed, no new problem reported
    HOLD <app>      hold passed, but N problem(s) since it started — the app's chat decides
    WAIT <app>      still inside its hold
The line, set by the Store Manager on 21 Nov: ANY problem since the beta started
holds it. Claude does not judge whether a problem "counts"; the app's own chat
reads it and promotes with --now if it is unrelated. Holding a good version a day
too long costs nothing; releasing a broken one to everyone costs a lot.
"""
import datetime, json, os, re, sys, html

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE = 'https://jerrywins1.github.io/daraja-apps/'


def problems(X):
    ss = [html.unescape(re.sub('<[^>]+>', '', m)) for m in re.findall(r'<si>(.*?)</si>', open(X + '/xl/sharedStrings.xml').read(), re.S)]
    wb = open(X + '/xl/workbook.xml').read(); rels = open(X + '/xl/_rels/workbook.xml.rels').read(); n = None
    for name, rid in re.findall(r'<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wb):
        if name == 'messages':
            n = re.search(r'sheet(\d+)', re.search(r'Id="%s"[^>]*Target="([^"]+)"' % rid, rels).group(1)).group(1)
    x = open('%s/xl/worksheets/sheet%s.xml' % (X, n)).read(); out = []
    for r in re.findall(r'<row[^>]*>(.*?)</row>', x, re.S):
        d = {}
        for ref, attrs, body in re.findall(r'<c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</c>)', r, re.S):
            v = re.search(r'<v>(.*?)</v>', body or ''); t = re.search(r'<t[^>]*>(.*?)</t>', body or '', re.S)
            d[ref] = ss[int(v.group(1))] if v and 't="s"' in attrs else (v.group(1) if v else (html.unescape(t.group(1)) if t else ''))
        head = (d.get('H', '') or '').split('\n')[0]
        if head.startswith('FEEDBACK|') and 'kind:problem' in head:
            app = re.search(r'app:([^|]+)', head)
            out.append(((app.group(1).strip() if app else ''), d.get('B', '')))
    return out


def dir_aliases():
    """folder name -> every key a message from that app might carry (store key, folder name)."""
    import subprocess
    js = ('const fs=require("fs");const A=new Function(fs.readFileSync(%r,"utf8")+";return APPS;")();'
          'process.stdout.write(JSON.stringify(A));' % os.path.join(ROOT, 'shop', 'apps_data.js'))
    A = json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True).stdout or '{}')
    m = {}
    for k, a in A.items():
        t = a.get('try') or ''
        if t.startswith(SITE):
            import urllib.parse
            folder = urllib.parse.unquote(t[len(SITE):]).split('?')[0].strip('/').split('/')[-1]
            m.setdefault(folder, {folder}).add(k)
    return m


def main():
    book = json.load(open(os.path.join(ROOT, 'control', 'rollout.json')))
    holds = book.get('holds') or []
    if not holds:
        print('Nothing is waiting.'); return
    P = problems(sys.argv[1]); alias = dir_aliases(); now = datetime.datetime.now(datetime.timezone.utc)
    for h in holds:
        app, since = h['app'], h['since']; hrs = h.get('hours') or 24
        start = datetime.datetime.fromisoformat(since.replace('Z', '+00:00'))
        if (now - start).total_seconds() / 3600 < hrs:
            print('WAIT %s' % app); continue
        keys = alias.get(app, {app})
        n = sum(1 for a, at in P if a in keys and at[:19] >= since[:19])
        print(('HOLD %s  %d problem(s) since %s' % (app, n, since[:16])) if n else ('PROMOTE %s' % app))


if __name__ == '__main__':
    main()
