#!/usr/bin/env python3
"""Carry the managers' messages onto the testers' page.

Emmanuel and Veronicah write to their teams from kenya/lead/ ("Tell my team").
Those words land in the daraja_notice table. This copies them into
kenya/notices.json, which the testers' page reads with no key at all — which is
the whole point: the key that reads daraja_notice also reads daraja_payment,
every tester's name and what they have been paid, and the testers' page is
public.

The key is never typed into a chat and never committed. It comes from the
environment:

    DARAJA_SB_KEY=...   python3 tools/carrynotices.py
                        python3 tools/carrynotices.py --check   # change nothing

Run it from the scheduled runs. If the key is missing it says so and changes
nothing, so a run without it is harmless.
"""
import collections
import io
import json
import os
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'kenya', 'notices.json')
SB = 'https://wlawjwowdmneatdffpsy.supabase.co/rest/v1'
KEEP = 3          # per team, on the tester's home screen
TEAMS = ('1', '2')


def fetch(key):
    url = SB + '/daraja_notice?select=at,team,manager,body&order=at.desc&limit=60'
    req = urllib.request.Request(url, headers={'apikey': key, 'Authorization': 'Bearer ' + key})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode('utf-8'))


def shape(rows):
    out = collections.OrderedDict((t, []) for t in TEAMS)
    for row in rows:
        team = str(row.get('team'))
        if team not in out or len(out[team]) >= KEEP:
            continue
        body = (row.get('body') or '').strip()
        if not body:
            continue
        out[team].append(collections.OrderedDict([
            ('at', (row.get('at') or '')[:10]),
            ('manager', row.get('manager') or ''),
            ('body', body[:900]),
        ]))
    return out


def main():
    key = (os.environ.get('DARAJA_SB_KEY') or '').strip()
    if not key:
        print('DARAJA_SB_KEY is not set, so there is nothing to read. Nothing changed.')
        print('Jerry adds it once in the environment settings; it is never typed into a chat.')
        return 0

    try:
        rows = fetch(key)
    except urllib.error.HTTPError as e:
        print('Supabase said %s. Nothing changed.' % e.code)
        return 1
    except Exception as e:
        print('Could not reach Supabase (%s). Nothing changed.' % e.__class__.__name__)
        return 1

    teams = shape(rows)
    old = json.load(io.open(OUT, encoding='utf-8')) if os.path.exists(OUT) else {}
    doc = collections.OrderedDict([
        ('_', old.get('_', '')),
        ('updated', ''),
        ('teams', teams),
    ])
    same = (old.get('teams') or {}) == json.loads(json.dumps(teams))
    for t in TEAMS:
        n = len(teams[t])
        newest = teams[t][0]['body'][:60] + '…' if n else '(nothing)'
        print('team %s · %d message%s · newest: %s' % (t, n, '' if n == 1 else 's', newest))

    if same:
        print('\nNo change since the last run.')
        return 0
    doc['updated'] = max([m['at'] for t in TEAMS for m in teams[t]] or [''])
    if '--check' in sys.argv:
        print('\nThere is something new to carry across. Run it without --check.')
        return 1
    io.open(OUT, 'w', encoding='utf-8').write(json.dumps(doc, ensure_ascii=False, indent=1) + '\n')
    print('\nwrote kenya/notices.json')
    return 0


if __name__ == '__main__':
    sys.exit(main())
