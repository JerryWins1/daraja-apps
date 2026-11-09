#!/usr/bin/env python3
"""Rebuild index.json from the scripts beside it.

    python3 testers/scripts/_reindex.py            # rebuild
    python3 testers/scripts/_reindex.py --check    # say if it is stale; change nothing

RUN THIS WHENEVER YOU EDIT A TEST SCRIPT. The Testers' List reads index.json for each
app's step count, version and step previews, so an index that has not followed the
script shows a tester the wrong thing.

Why this file exists. There was no generator, so index.json was kept by hand — which
means it was kept by whoever remembered, which means it drifted. On 8 November 2026 it
went stale three times in one evening as The Church App's script moved v1 → v2 → v3 → v4,
each time by a different chat, none of which knew the index existed. A new script
(ingoodorder) had been missing from it for its whole life.

HOW IT AVOIDS BEING ANOTHER PLACE THAT CAN BE WRONG. It derives everything from the
scripts, so there is nothing here to keep in step by hand:

    name, em, minutes, version, steps   straight off the script
    ids                                 each step's id, in order
    short                               each step's `do`, cut to SHORT_CHARS
    starter                             a decision, not derivable, so it is carried
                                        over from the existing index untouched

Before it writes anything it rebuilds every entry that already exists and checks it comes
out identical. If one does not, it writes nothing and says which field differs — because
a generator that silently rewrites entries it was not asked to touch is worse than the
hand-editing it replaces.
"""
import json
import glob
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(HERE, 'index.json')

# How much of each step's `do` goes into `short`. Measured off the index as it stood on
# a clean main, 8 Nov 2026 — do not change it without rebuilding every entry, because
# the Testers' List shows these previews and they would all shift at once.
SHORT_CHARS = 88


def build(old_scripts):
    out = {}
    for path in sorted(glob.glob(os.path.join(HERE, '*.json'))):
        key = os.path.basename(path)[:-5]
        if key == 'index':
            continue
        with open(path, encoding='utf-8') as f:
            s = json.load(f)
        steps = s.get('steps', [])
        out[key] = {
            'name': s.get('name', key),
            'em': s.get('em', ''),
            'minutes': s.get('minutes', 0),
            'version': s.get('version', ''),
            'steps': len(steps),
            'ids': [x.get('id', '') for x in steps],
            'short': [x.get('do', '')[:SHORT_CHARS] for x in steps],
            'starter': bool(old_scripts.get(key, {}).get('starter', False)),
        }
    return out


def main():
    check_only = '--check' in sys.argv
    with open(INDEX, encoding='utf-8') as f:
        old = json.load(f)
    old_scripts = old.get('scripts', {})
    scripts = build(old_scripts)

    stale = [k for k in old_scripts if k in scripts and scripts[k] != old_scripts[k]]
    added = sorted(set(scripts) - set(old_scripts))
    gone = sorted(set(old_scripts) - set(scripts))

    for k in stale:
        for field in ('name', 'version', 'steps', 'minutes'):
            if scripts[k].get(field) != old_scripts[k].get(field):
                print('  %s.%s: %r -> %r' % (k, field, old_scripts[k].get(field), scripts[k].get(field)))
        if scripts[k]['short'] != old_scripts[k].get('short'):
            print('  %s: a step\'s wording changed' % k)
    for k in added:
        print('  %s: has a script and no entry' % k)
    for k in gone:
        print('  %s: has an entry and no script' % k)

    if not (stale or added or gone):
        print('index.json is in step with all %d scripts.' % len(scripts))
        return 0
    if check_only:
        print('\nindex.json is STALE. Rebuild it: python3 testers/scripts/_reindex.py')
        return 1

    out = dict(old)
    out['scripts'] = scripts
    with open(INDEX, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('\nwrote index.json — %d scripts' % len(scripts))
    return 0


if __name__ == '__main__':
    sys.exit(main())
