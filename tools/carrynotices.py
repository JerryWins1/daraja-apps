#!/usr/bin/env python3
"""Carry the managers' messages onto the testers' page — from the Jerry HQ sheet.

Emmanuel and Veronicah write to their teams from kenya/lead/ ("Tell my team").
Their page posts the words to the same mailbox the testers' app posts reports
through, so they land in the Jerry HQ sheet. This reads that sheet and writes
kenya/notices.json, which the testers' page shows to that team and nobody else.

No key, anywhere. That is the point. The key that reads the pay database also
reads every payment row — every tester's name and what they have been paid — so
it is kept out of this path entirely, and out of the testers' public page.

    python3 tools/carrynotices.py <the sheet.xlsx>
    python3 tools/carrynotices.py <the sheet.xlsx> --check    # change nothing

The scheduled runs already download that sheet, so this adds no new step.

WHAT IT REFUSES. The mailbox is open — a tester's phone posts to it — so anyone
could send a line that claims to be from a manager. A notice is only carried if
the name on it is that team's actual manager in kenya/lead/teams.json. Anything
else is listed as refused and left where it is.
"""
import collections
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'kenya', 'notices.json')
TEAMS = os.path.join(ROOT, 'kenya', 'lead', 'teams.json')
KEEP = 3                       # per team, on the tester's home screen
HEAD = re.compile(r'^TEAMNOTE\|(\d+)\|(.+)$')


def managers():
    t = json.load(io.open(TEAMS, encoding='utf-8'))
    return {str(n): v['manager'] for n, v in t['teams'].items()}


def read_sheet(path):
    import openpyxl
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    rows = list(wb['messages'].iter_rows(values_only=True))[1:]
    return [(str(r[1] or ''), str(r[3] or ''), str(r[7] or '')) for r in rows]


def collect(rows, mgrs):
    found, refused = collections.defaultdict(list), []
    for at, sender, text in reversed(rows):          # newest first
        lines = text.split('\n')
        m = HEAD.match(lines[0].strip())
        if not m:
            continue
        team, claimed = m.group(1), m.group(2).strip()
        body = '\n'.join(lines[1:]).strip()
        if team not in mgrs or claimed != mgrs[team]:
            refused.append('%s · says team %s, signed "%s"' % (at[:16], team, claimed[:40]))
            continue
        if not body or len(found[team]) >= KEEP:
            continue
        found[team].append(collections.OrderedDict(
            [('at', at[:10]), ('manager', claimed), ('body', body[:900])]))
    return found, refused


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        print('Give me the Jerry HQ sheet as an .xlsx. Nothing changed.')
        return 2
    mgrs = managers()
    found, refused = collect(read_sheet(args[0]), mgrs)
    teams = collections.OrderedDict((t, found.get(t, [])) for t in sorted(mgrs))

    for t in teams:
        n = len(teams[t])
        print('team %s · %-18s %d message%s%s' % (t, mgrs[t], n, '' if n == 1 else 's',
              ' · newest: ' + teams[t][0]['body'][:50].replace('\n', ' ') if n else ''))
    for r in refused:
        print('REFUSED — not that team\'s manager: ' + r)

    old = json.load(io.open(OUT, encoding='utf-8')) if os.path.exists(OUT) else {}
    if (old.get('teams') or {}) == json.loads(json.dumps(teams)):
        print('\nNo change since the last run.')
        return 0
    if '--check' in sys.argv:
        print('\nThere is something new to carry across. Run it without --check.')
        return 1
    doc = collections.OrderedDict([
        ('_', old.get('_', '')),
        ('updated', max([m['at'] for t in teams for m in teams[t]] or [''])),
        ('teams', teams),
    ])
    io.open(OUT, 'w', encoding='utf-8').write(json.dumps(doc, ensure_ascii=False, indent=1) + '\n')
    print('\nwrote kenya/notices.json')
    return 0


if __name__ == '__main__':
    sys.exit(main())
