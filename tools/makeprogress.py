#!/usr/bin/env python3
"""Rebuild kenya/progress.json: which apps each tester has already finished, from the Jerry HQ sheet.

Run it from the repo root with the same .xlsx the scheduled jobs download:

    python3 tools/makeprogress.py <the .xlsx>

Why it exists. A tester's list of finished apps is kept only on their phone. When they clear their
browsing history it is gone, the page starts them at app 1 again, and they redo apps two or three
times (13 November: one tester had 32 reports for 26 apps). The tester page now asks this file what
HQ already has from them and puts those apps back.

What is in it. Nothing that names anybody. Each entry is the SHA-256 of a tester's personal code,
and the page hashes its own code the same way to look itself up. A code is 16 random characters, so
the hash cannot be turned back into one. The value is a plain list of app keys.

Who counts as the same tester. People are matched exactly as the managers' page matches them: the
name on the report, then the spellings in kenya/lead/teams.json "aliases". Every row for that person
in the people sheet gets the same list, so a tester with two codes (the 'Brian' and 'Brian Maina
Kamau' rows) is restored under either.

Reports count whenever they were filed - this is about what the tester has finished, not about
which pay week it fell in.
"""
import hashlib, json, os, re, sys, datetime
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KENYA = os.path.join(ROOT, 'kenya')


def norm(s):
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z ]', '', str(s or '').lower())).strip()


def main(xlsx):
    teams = json.load(open(os.path.join(KENYA, 'lead', 'teams.json'), encoding='utf-8'))
    aliases = teams.get('aliases', {})
    junk = re.compile(teams.get('junk', '$^'), re.I)
    byname, first = {}, {}
    for t in teams['teams'].values():
        for p in t['people']:
            byname[norm(p['name'])] = p['name']
            first.setdefault(norm(p['name']).split(' ')[0], []).append(p['name'])
    for k, v in aliases.items():
        if norm(v) in byname:
            byname[norm(k)] = v

    def whois(n):
        nn = norm(n)
        if not nn or junk.search(str(n)):
            return None
        if nn in byname:
            return byname[nn]
        if ' ' in nn:
            return None
        h = first.get(nn, [])
        return h[0] if len(h) == 1 else None

    wb = openpyxl.load_workbook(xlsx, read_only=True, data_only=True)
    people = list(wb['people'].iter_rows(values_only=True))[1:]
    rows = list(wb['messages'].iter_rows(values_only=True))[1:]

    done = {}
    for r in rows:
        tx = str(r[7] or '')
        if not tx.startswith('KENYA|'):
            continue
        who = whois(r[3])
        if not who:
            continue
        app = tx.split('|')[1].strip()
        if re.match(r'^[a-z0-9]{2,30}$', app):
            done.setdefault(who, set()).add(app)

    out = {}
    for p in people:
        name, project, token = p[1], p[4], p[5]
        if project != 'kenya' or not token or len(str(token)) < 12:
            continue
        who = whois(name)
        if not who or who not in done:
            continue
        key = hashlib.sha256(str(token).strip().encode('utf-8')).hexdigest()
        out[key] = sorted(done[who])

    doc = {
        '_': 'Apps each tester has already finished, from the Jerry HQ log. Keys are SHA-256 hashes of personal codes. '
             'Written by tools/makeprogress.py on the scheduled jobs; never edit by hand.',
        'updated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'),
        'testers': dict(sorted(out.items())),
    }
    path = os.path.join(KENYA, 'progress.json')
    old = None
    try:
        old = json.load(open(path, encoding='utf-8')).get('testers')
    except Exception:
        pass
    if old == doc['testers']:
        print('progress.json: no change (%d testers)' % len(out))
        return
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(doc, f, indent=1, ensure_ascii=False)
        f.write('\n')
    print('progress.json: wrote %d testers' % len(out))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('usage: python3 tools/makeprogress.py <the .xlsx>')
    main(sys.argv[1])
