#!/usr/bin/env python3
"""Generate kenya/teams-lite.json from kenya/lead/teams.json.

The testers' page needs one thing from the team list: which team a person is on,
so it can show that team's own manager's notices and nobody else's. It must NOT
need the rest of the file. teams.json carries each manager's personal page token,
and the testers' page is opened by twenty-five people on their own phones, so
fetching teams.json there would put those tokens in every one of their browsers.

So this writes a second file with names and managers only — no tokens, no phone
numbers, nothing that opens a page. Run it after editing teams.json:

    python3 tools/maketeamslite.py           # write it
    python3 tools/maketeamslite.py --check   # say whether it has fallen behind
"""
import json, sys, collections, io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'kenya', 'lead', 'teams.json')
OUT = os.path.join(ROOT, 'kenya', 'teams-lite.json')


def build():
    src = json.load(io.open(SRC, encoding='utf-8'), object_pairs_hook=collections.OrderedDict)
    managers, who = collections.OrderedDict(), collections.OrderedDict()
    for num, t in src['teams'].items():
        managers[num] = t['manager']
        for p in t['people']:
            who[p['name']] = num
    lite = collections.OrderedDict([
        ('_', 'Generated from kenya/lead/teams.json by tools/maketeamslite.py. Do not hand-edit. '
              'Names and managers only — never a token or a phone number: the testers\' page fetches '
              'this on twenty-five phones.'),
        ('managers', managers),
        ('who', who),
        ('aliases', src.get('aliases') or {}),
    ])
    # a generated file is the easiest place for a secret to reappear by accident
    blob = json.dumps(lite, ensure_ascii=False).lower()
    for t in src['teams'].values():
        tok = str(t.get('token') or '')
        if tok and tok.lower() in blob:
            raise SystemExit('REFUSING TO WRITE: a manager token reached the lite file')
    # and nothing token-shaped either, whatever it is called
    import re
    for hit in re.findall(r'[0-9a-f]{12,}', blob):
        raise SystemExit('REFUSING TO WRITE: something token-shaped reached the lite file: ' + hit[:8] + '…')
    return lite


def main():
    lite = build()
    text = json.dumps(lite, ensure_ascii=False, indent=1) + '\n'
    old = io.open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
    print('%d people across %d teams' % (len(lite['who']), len(lite['managers'])))
    for num, m in lite['managers'].items():
        n = sum(1 for v in lite['who'].values() if v == num)
        print('  team %s · %-18s %d people' % (num, m, n))
    if '--check' in sys.argv:
        print('\nteams-lite.json is ' + ('in step.' if text == old else 'OUT OF DATE — run without --check.'))
        sys.exit(0 if text == old else 1)
    io.open(OUT, 'w', encoding='utf-8').write(text)
    print('\nwrote ' + os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
