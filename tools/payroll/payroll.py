# Who has earned what, per lead's team. Reads the Jerry HQ sheet export (the same unzipped
# xlsx dir tools/morning-report/refresh.sh already makes) + testers/teams.md, writes payroll.json.
#
# Jerry, 7 Nov 2026: "each leader, Veronica and Emmanuel, have an app that gets data from you,
# and then it tracks the scores of the testers and how much they get paid, and then if they get
# paid and when."
#
# This is the earned half. The paid half is tapped by the lead on the page and lives in the
# testers' mailbox, because this script only ever reads.
#
# THE GATE comes from kenya/pay.md and is not loosened here. A report counts as one completed
# app-test only when it carries all four:
#   1. a challenge attempt   — challenge:N/N PASS or FAIL, both count
#   2. step results          — steps:N/N ok,N fail,N unsure
#   3. an ease rating        — ease:N
#   4. their own words       — a non-empty "In their own words:" section in the body
# The fourth is what stops a rushed report counting, and it is the one a machine could most
# easily be talked out of checking, so it is checked last and counted separately in the output.
import re, html, json, sys, os, collections, datetime

X, REPO, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
# The round this is paying for. kenya/pay.md says the 250-per-test rule "starts with the next
# round", and the October round was settled separately at the old flat rate — so counting all
# history here would re-price work that is already paid, and underpay it badly: the report
# format gained `ease` and "In their own words" partway through October, so half of those
# reports fail a gate that did not exist when they were written. Kevin Ngugi alone covers 28
# apps in October and would score 4. Anything before this date is shown as history, never paid.
SINCE = sys.argv[4] if len(sys.argv) > 4 else '2026-11-05'
PER_TEST = 250          # KES, kenya/pay.md
PER_FIND = 50           # KES per problem Jerry confirms — the finder's bonus, as the Kenya page states it

def shared():
    return [html.unescape(re.sub('<[^>]+>', '', m))
            for m in re.findall(r'<si>(.*?)</si>', open(X + '/xl/sharedStrings.xml').read(), re.S)]

def sheet_no(name):
    wb = open(X + '/xl/workbook.xml').read(); rels = open(X + '/xl/_rels/workbook.xml.rels').read()
    for nm, rid in re.findall(r'<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wb):
        if nm == name:
            tgt = re.search(r'Id="%s"[^>]*Target="([^"]+)"' % rid, rels).group(1)
            return int(re.search(r'sheet(\d+)', tgt).group(1))
    return None

def rows(n, ss):
    x = open(f'{X}/xl/worksheets/sheet{n}.xml').read(); out = []
    for r in re.findall(r'<row[^>]*>(.*?)</row>', x, re.S):
        d = {}
        for ref, attrs, body in re.findall(r'<c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</c>)', r, re.S):
            v = re.search(r'<v>(.*?)</v>', body or ''); t = re.search(r'<t[^>]*>(.*?)</t>', body or '', re.S)
            d[ref] = ss[int(v.group(1))] if v and 't="s"' in attrs else (
                v.group(1) if v else (html.unescape(t.group(1)) if t else ''))
        out.append(d)
    return out

# ── the two teams, from the file that is the record ──────────────────────────
def teams():
    s = open(REPO + '/testers/teams.md', encoding='utf-8').read()
    out = []
    for m in re.finditer(r'^## (Team \d) — (.+?) leads\n(.*?)(?=\n## |\Z)', s, re.S | re.M):
        people = [p.strip() for p in re.findall(r'^\| \*{0,2}([^|*]+?)\*{0,2} \|', m.group(3), re.M)]
        people = [p for p in people if p and p != 'Tester' and set(p) - set('- ')]
        out.append({'team': m.group(1), 'lead': m.group(2), 'people': people})
    return out

# ── names ────────────────────────────────────────────────────────────────────
# The sheet spells one person several ways: "Frank Ndung'u" and "Frank Ndungu" are one man,
# and some rows are in capitals. Match on letters only, and fall back to the first name, which
# is how tools/leaderboard/tally.py already resolves the same people.
def norm(n):
    return re.sub(r'[^a-z]', '', (n or '').lower())
def first(n):
    return norm((n or '').split()[0] if (n or '').split() else '')

def main():
    ss = shared()
    M = rows(sheet_no('messages'), ss)
    T = teams()

    who_of = {}                      # normalised name -> (team, lead, roster spelling)
    firsts = collections.defaultdict(list)
    for t in T:
        for p in t['people']:
            who_of[norm(p)] = (t['team'], t['lead'], p)
            firsts[first(p)].append(norm(p))

    def place(who):
        n = norm(who)
        if n in who_of: return who_of[n]
        f = first(who)
        if len(firsts.get(f, [])) == 1: return who_of[firsts[f][0]]   # one roster person with that first name
        return None                                                   # ambiguous or not on a team

    def blank():
        return {'tests': 0, 'apps': set(), 'partial': 0, 'missing': collections.Counter(), 'was': 0}
    per = collections.defaultdict(blank)
    unplaced = collections.Counter()
    for d in M[1:]:
        txt = d.get('H', '')
        if not (txt.startswith('KENYA|') or txt.startswith('FRIEND|')): continue
        head = txt.split('\n')[0]; f = head.split('|')
        if len(f) < 2: continue
        key = f[1]; who = (d.get('D') or '').strip(); at = (d.get('B') or '')[:10]
        kv = {}
        for part in f[2:]:
            if ':' in part:
                a, b = part.split(':', 1); kv[a] = b
        miss = []
        if not re.match(r'\d+/\d+ (PASS|FAIL)', kv.get('challenge', '')): miss.append('challenge')
        if not re.match(r'\d+/\d+ ok', kv.get('steps', '')): miss.append('steps')
        if not kv.get('ease', '').isdigit(): miss.append('ease')
        own = re.search(r'In their own words:[ \t]*(.*)', txt)
        if not (own and own.group(1).strip() and own.group(1).strip().lower() not in ('none', '-', '—')):
            miss.append('their own words')

        spot = place(who)
        if not spot:
            if who: unplaced[who] += 1
            continue
        p = per[spot[2]]
        if at and at < SINCE:
            p['was'] += 1                 # before this round: history, already settled at the old rate
            continue
        if miss:
            p['partial'] += 1
            for m_ in miss: p['missing'][m_] += 1
        else:
            p['tests'] += 1; p['apps'].add(key)

    # the finder's bonus: problems Jerry has confirmed, i.e. a requests row with a non-empty `fixed`
    finds = collections.Counter()
    rn = sheet_no('requests')
    if rn:
        R = rows(rn, ss)
        hdr = {v: k for k, v in (R[0] if R else {}).items()}
        cn, cf, ca = hdr.get('name'), hdr.get('fixed'), hdr.get('at')
        for d in R[1:]:
            if not cn or not cf: break
            nm = (d.get(cn) or '').strip()
            if not (nm and (d.get(cf) or '').strip()): continue
            at = (d.get(ca) or '')[:10] if ca else ''
            if at and at < SINCE: continue      # October's confirmed finds were settled with October's pay
            spot = place(nm)
            if spot: finds[spot[2]] += 1

    out = {'updated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'),
           'rate': PER_TEST, 'find': PER_FIND,
           'gate': ['a challenge attempt', 'step results', 'an ease rating', 'their own words'],
           'since': SINCE, 'teams': []}
    for t in T:
        people = []
        for name in t['people']:
            p = per.get(name, blank())
            earned = p['tests'] * PER_TEST + finds[name] * PER_FIND
            people.append({'name': name, 'tests': p['tests'], 'apps': len(p['apps']),
                           'finds': finds[name], 'earned': earned, 'partial': p['partial'],
                           'missing': dict(p['missing']), 'before': p['was']})
        people.sort(key=lambda x: (-x['earned'], x['name']))
        out['teams'].append({'team': t['team'], 'lead': t['lead'],
                             'key': first(t['lead']), 'people': people,
                             'tests': sum(x['tests'] for x in people),
                             'earned': sum(x['earned'] for x in people)})
    out['unplaced'] = [{'name': n, 'reports': c} for n, c in unplaced.most_common()]
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)

    print('counting reports from %s onward (the round). Earlier ones are history.' % SINCE)
    for t in out['teams']:
        print('%-10s %-18s %2d people · %3d completed tests · %6d KES   (%d reports before the round)' %
              (t['key'], t['lead'], len(t['people']), t['tests'], t['earned'],
               sum(x['before'] for x in t['people'])))
    if out['unplaced']:
        print('not on either team (%d names): %s' %
              (len(out['unplaced']), ', '.join(u['name'] for u in out['unplaced'][:8])))
    print('wrote', OUT)

main()
