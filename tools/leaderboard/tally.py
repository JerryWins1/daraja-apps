# Kenya weekly leaderboard: reads the Jerry HQ sheet export (x/ unzipped xlsx dir),
# rewrites kenya/leaderboard.json for the CURRENT Friday-to-Thursday week.
#
# usage: tally.py <unzipped xlsx dir> <repo root> <out leaderboard.json> [now ISO, for testing]
#
# This replaces the tally.py that used to run outside the repo and stopped on 24 Oct 2026,
# leaving the page showing a finished week as if it were current. It is deliberately a plain
# script over the already-exported sheet, so the nightly Store Manager job — which exports
# that sheet anyway — can run it with no new credentials and no new scheduled job.
#
# What it does NOT do: invent anything. An award with nobody in it is written empty, because
# an empty leaderboard at the start of a round is true and a stale one is not.
import re, html, json, sys, datetime, collections

X, REPO, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
NOW = (datetime.datetime.fromisoformat(sys.argv[4]) if len(sys.argv) > 4
       else datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None))

# ---- the sheet, parsed the same way tools/morning-report/compute.py does it (no openpyxl) ----
ss = [html.unescape(re.sub('<[^>]+>', '', m))
      for m in re.findall(r'<si>(.*?)</si>', open(X + '/xl/sharedStrings.xml').read(), re.S)]

def rows(n):
    x = open(f'{X}/xl/worksheets/sheet{n}.xml').read(); out = []
    for r in re.findall(r'<row[^>]*>(.*?)</row>', x, re.S):
        d = {}
        for ref, attrs, body in re.findall(r'<c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</c>)', r, re.S):
            v = re.search(r'<v>(.*?)</v>', body or '')
            t = re.search(r'<t[^>]*>(.*?)</t>', body or '', re.S)
            d[ref] = ss[int(v.group(1))] if v and 't="s"' in attrs else (
                v.group(1) if v else (html.unescape(t.group(1)) if t else ''))
        out.append(d)
    return out

wb = open(X + '/xl/workbook.xml').read(); rels = open(X + '/xl/_rels/workbook.xml.rels').read()
sheets = {}
for name, rid in re.findall(r'<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wb):
    tgt = re.search(r'Id="%s"[^>]*Target="([^"]+)"' % rid, rels).group(1)
    sheets[name] = int(re.search(r'sheet(\d+)', tgt).group(1))

MSG = rows(sheets['messages'])[1:]      # id A, at B, person_id C, name D, ... text H
REQ = rows(sheets['requests'])[1:]      # id A, at B, person_id C, name D, app E, kind F, text G, status H, likes I, fixed J
PPL = rows(sheets['people'])[1:]        # id A, name B, phone C, role D, project E, token F

# ---- the competition week: Friday to Thursday, Kenya time (the FAQ's own rule) ----
today = NOW.date()
fri = today - datetime.timedelta(days=(today.weekday() - 4) % 7)
thu = fri + datetime.timedelta(days=6)
inweek = lambda iso: bool(iso) and fri.isoformat() <= iso[:10] <= thu.isoformat()

# ---- who is a real tester (my own test rows and Jerry's are not) ----
JUNK = re.compile(r'claude|^jerry\b|^ipad|mary test|^joe$|test vero|anonymous|nightly|^zz\b', re.I)
real = lambda n: bool(n) and not JUNK.search(n)

# ---- the page's own identity hash, so "You're 2nd" finds the right person ----
def fnv1a(s):
    h = 2166136261
    for ch in s:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    return h

hex8 = lambda s: '%08x' % fnv1a(s)
normname = lambda n: re.sub(r'\s+', ' ', str(n or '').lower()).strip()
token_of = {normname(p.get('B')): (p.get('F') or '') for p in PPL if p.get('B')}

# ---- count the three awards a machine can count ----
apps_done = collections.defaultdict(set)   # tester -> distinct apps finished with the challenge PASSED
streak = collections.defaultdict(int)      # tester -> best "testing streak N days" the app itself reported
bugs = collections.Counter()               # tester -> problems Jerry confirmed

for d in MSG:
    who, at, txt = (d.get('D') or '').strip(), d.get('B', ''), d.get('H', '') or ''
    if not real(who) or not inweek(at):
        continue
    line = txt.split('\n')[0]
    if line.startswith('KENYA|') or line.startswith('FRIEND|'):
        f = line.split('|')
        kv = dict(p.split(':', 1) for p in f[2:] if ':' in p)
        if re.match(r'\d+/\d+ PASS', kv.get('challenge', '')):
            apps_done[who].add(f[1])
    # the app computes the streak itself; trust its number rather than re-deriving it
    m = re.search(r'testing streak (\d+) days?', txt)
    if m:
        streak[who] = max(streak[who], int(m.group(1)))

for d in REQ:
    who, at, fixed = (d.get('D') or '').strip(), d.get('B', ''), (d.get('J') or '').strip()
    if not real(who) or not inweek(at) or not fixed:
        continue
    if fixed.lower() in ('test', 'test note', 'test report', 'rehearsal sign-up'):
        continue
    bugs[who] += 1

# ---- first names only on the board, as the page's own footer promises ----
# Two Faiths and two Brians test the squad, and the sheet stores some names in capitals.
# So: title-cased first name, plus the surname's initial when the first name is shared,
# which is the "Faith W." / "Brian K." form the old tally.py used.
def _parts(n):
    return [p for p in re.split(r'\s+', str(n or '').strip()) if p]

# Counted over the WHOLE roster, not just this week's scorers: "Brian" is ambiguous to a
# reader who knows both Brians, whether or not the other one scored. This is why the old
# tally.py wrote "Brian K." in a week when only one Brian was on the board.
#
# Count DISTINCT SURNAMES per first name, not rows. The people sheet holds the same person
# more than once — Frank Ndung'u and Frank Ndungu, among others — so counting rows would
# make every repeated name look like two people and print "Frank N." where the old tally.py
# correctly printed "Frank". Surnames are compared letters-only, so the apostrophe in
# Ndung'u does not split one man into two.
_surnames = collections.defaultdict(set)
_roster = [(p.get('B') or '').strip() for p in PPL]
for _n in _roster + list(set(list(apps_done) + list(streak) + list(bugs))):
    if not real(_n):
        continue
    _q = _parts(_n)
    if len(_q) > 1:
        _surnames[_q[0].lower()].add(re.sub(r'[^a-z]', '', _q[-1].lower()))
_firsts = {k: len(v) for k, v in _surnames.items()}

def first(n):
    p = _parts(n)
    if not p:
        return str(n)
    given = p[0].capitalize() if p[0].isupper() or p[0].islower() else p[0]
    if len(p) > 1 and _firsts.get(p[0].lower(), 0) > 1:
        return f'{given} {p[-1][0].upper()}.'
    return given

def leaders(scores, unit, units):
    rank = sorted(((v, k) for k, v in scores.items() if v > 0), key=lambda t: (-t[0], t[1]))
    top = [{'name': first(k), 'score': v, 'label': f'{v} {unit if v == 1 else units}'} for v, k in rank[:5]]
    return top, rank

AWARDS = {
    'apps':   leaders(dict((k, len(v)) for k, v in apps_done.items()), 'app', 'apps'),
    'streak': leaders(dict(streak), 'day', 'days'),
    'bugs':   leaders(dict(bugs), 'confirmed problem', 'confirmed problems'),
}

# ---- every spelling of one person, grouped by phone ----
# A tester's standing is looked up from the name stored on their own phone, which is not
# always the spelling that reached the sheet: Frank is "Frank Ndungu" in some rows and
# "Frank Ndung'u" in others, and he topped a week while being unfindable under one of them.
# So emit a key for EVERY spelling the roster holds of that person, not just the one that
# happened to arrive with the report.
_byphone = collections.defaultdict(set)
_phone_of = {}
for _p in PPL:
    _n, _ph = (_p.get('B') or '').strip(), re.sub(r'\D', '', str(_p.get('C') or '').replace('.0', ''))
    if not real(_n) or len(_ph) < 9:
        continue
    _byphone[_ph[-9:]].add(_n)
    _phone_of[normname(_n)] = _ph[-9:]

def spellings(who):
    """Every roster spelling of this person, plus the name as reported."""
    out = {who}
    ph = _phone_of.get(normname(who))
    if ph:
        out |= _byphone[ph]
    return out

players = {}
def place(award_id, rank):
    best = rank[0][0] if rank else 0
    pos, prev, n = 0, None, 0
    for score, who in rank:
        n += 1
        if score != prev:
            pos, prev = n, score
        tie = sum(1 for s, _ in rank if s == score) > 1
        standing = {'rank': pos, 'score': score, 'behind': best - score, **({'tie': True} if tie else {})}
        keys = set()
        for nm in spellings(who):
            keys.add('n:' + hex8('dj|' + normname(nm)))
            tok = token_of.get(normname(nm))
            if tok:
                keys.add('t:' + hex8('dj|' + tok))
        for key in keys:
            players.setdefault(key, {})[award_id] = standing

for aid, (_, rank) in AWARDS.items():
    place(aid, rank)

# ---- keep Jerry's wording: read the existing file and replace only what we computed ----
lb = json.load(open(OUT))
lb['week'] = {'start': fri.isoformat(), 'end': thu.isoformat()}
lb['updated'] = f"{NOW.strftime('%a')} {NOW.day} {NOW.strftime('%b, %H:%M')} UTC"
for a in lb['awards']:
    if a['id'] in AWARDS:
        a['top'] = AWARDS[a['id']][0]
lb['players'] = players
lb['note'] = ('Written by tools/leaderboard/tally.py from the Jerry HQ sheet. Awards Jerry picks himself '
              '(Best idea, Tester of the week) are left for him. An award with nobody in it is written '
              'empty on purpose — a stale week is worse than an empty one.')
open(OUT, 'w', encoding='utf-8').write(json.dumps(lb, indent=1, ensure_ascii=False) + '\n')

# ---- say what it found, so a nightly run that found nothing says so out loud ----
print(f'leaderboard: week {fri} to {thu}')
for a in lb['awards']:
    t = a.get('top') or []
    who = ', '.join(f"{x['name']} {x['label']}" for x in t) if t else '(nobody this week)'
    print(f"  {a['id']:<7} {who}")
print(f'  players: {len(players)} standing(s)')
