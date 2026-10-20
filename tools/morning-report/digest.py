# Morning digest: reads the Jerry HQ sheet export (unzipped xlsx dir) and prints what Jerry needs to know.
# usage: python3 -I digest.py <export_dir> <since ISO, e.g. 2026-10-19T10:55> [ready data.json] [previous data.json]
import sys, re, html, json, collections

X, SINCE = sys.argv[1], sys.argv[2]
DATA = sys.argv[3] if len(sys.argv) > 3 else None
PREV = sys.argv[4] if len(sys.argv) > 4 else None

ss = [html.unescape(re.sub('<[^>]+>', '', m)) for m in re.findall(r'<si>(.*?)</si>', open(X + '/xl/sharedStrings.xml').read(), re.S)]
def rows(n):
    x = open(f'{X}/xl/worksheets/sheet{n}.xml').read(); out = []
    for r in re.findall(r'<row[^>]*>(.*?)</row>', x, re.S):
        d = {}
        for ref, attrs, body in re.findall(r'<c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</c>)', r, re.S):
            v = re.search(r'<v>(.*?)</v>', body or ''); t = re.search(r'<t[^>]*>(.*?)</t>', body or '', re.S)
            d[ref] = ss[int(v.group(1))] if v and 't="s"' in attrs else (v.group(1) if v else (html.unescape(t.group(1)) if t else ''))
        out.append(d)
    return out
wb = open(X + '/xl/workbook.xml').read(); rels = open(X + '/xl/_rels/workbook.xml.rels').read(); sheets = {}
for name, rid in re.findall(r'<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wb):
    tgt = re.search(r'Id="%s"[^>]*Target="([^"]+)"' % rid, rels).group(1); sheets[name] = int(re.search(r'sheet(\d+)', tgt).group(1))
M = [d for d in rows(sheets['messages'])[1:] if d.get('B', '') >= SINCE]

out = []
P = out.append
P(f'# Digest since {SINCE} UTC — {len(M)} new rows\n')

# 1. Store (Ready to Sell)
if DATA:
    d = json.load(open(DATA)); c = d['counts']
    P(f"## Store: {c.get('ready',0)} ready · {c.get('almost',0)} almost · {c.get('needs',0)} need testing")
    if PREV:
        try:
            p = {a['key']: a['status'] for a in json.load(open(PREV))['apps']}
            newly = [a['name'] for a in d['apps'] if a['status'] == 'ready' and p.get(a['key']) != 'ready']
            if newly: P('- Newly ready: ' + ', '.join(newly))
        except Exception as e: P(f'- (could not compare with previous: {e})')
    one = [a['name'] for a in d['apps'] if a['status'] == 'almost' and len(a['passers']) == 1]
    if one: P('- One pass away: ' + ', '.join(one))
    none = [a['name'] for a in d['apps'] if not a['testers']]
    if none: P('- Never tested: ' + ', '.join(none))
    bad = [f"{a['name']} (ease {a['ease']})" for a in d['apps'] if a['ease'] and a['ease'] < 4] + [f"{a['name']} ({a['fails']} failed steps)" for a in d['apps'] if a['fails']]
    if bad: P('- Needs a look: ' + ', '.join(bad))
    P('')

# 2. Tester questions (store) — every *-q row is a question someone is waiting on
Q = [d for d in M if d.get('G', '').endswith('-q')]
P(f'## Tester questions waiting for an answer ({len(Q)})')
for d in Q: P(f"- {d.get('B','')[:16]} **{d.get('D','?')}**: {d.get('H','').splitlines()[0][:300]}")
P('')

# 3. Business Week (zuri-bw summaries + zuri problem rows)
day = collections.OrderedDict()
for d in M:
    h = d.get('H', '')
    m = re.match(r'ZURI-BW\|day (\d+)\|(\w+)\|([^|]+)\|app (v[\d.]+)(.*)', h.split('\n')[0])
    if m:
        dn, role, name, ver, rest = m.groups()
        done = re.search(r'done (\d+)/(\d+)', rest); ease = re.search(r'ease ([\d.]+)', rest)
        k = (dn, name)
        if done: day[k] = f"day {dn} · {name} ({role}) · {done.group(1)}/{done.group(2)} done" + (f" · ease {ease.group(1)}" if ease else '') + f" · {ver}"
if day:
    P('## Business Week progress'); [P('- ' + v) for v in day.values()]; P('')
probs = [d for d in M if d.get('G') == 'zuri' and d.get('H', '').startswith('❌')]
P(f'## Business Week problems ({len(probs)})')
seen = set()
for d in probs:
    t = d.get('H', '').split('\n')[0][:260]
    if (d.get('D'), t) in seen: continue
    seen.add((d.get('D'), t)); P(f"- {d.get('B','')[:16]} **{d.get('D','?')}**: {t}")
notes = [d for d in M if d.get('G') == 'zuri' and not re.match(r'(❌|📝|app v|secs=|🤖)', d.get('H', ''))]
if notes:
    P('\n## Other Zuri notes'); [P(f"- {d.get('B','')[:16]} **{d.get('D','?')}**: {d.get('H','').splitlines()[0][:220]}") for d in notes]
gate = [d for d in M if 'invite-code screen' in d.get('H', '')]
crashes = [d for d in M if d.get('H', '').startswith('🤖') and 'invite-code' not in d.get('H', '')]
P(f'\n## Automatic reports\n- Invite-code stops: {len(gate)}' + (' — links without &code=ZURI-BW: ' + ', '.join(sorted({re.sub(r".*?(/preview/[^ ]*).*", r"\1", d["H"])[:70] for d in gate})) if gate else ''))
P(f'- App errors reported by Zuri itself: {len(crashes)}')
for d in crashes[:8]: P(f"  - {d.get('D','?')}: {d.get('H','')[:200]}")

# 4. Store test activity
apps = collections.Counter(d.get('G') for d in M if (d.get('H', '').startswith(('KENYA|', 'FRIEND|'))))
if apps: P('\n## Store tests sent: ' + ', '.join(f'{k} {v}' for k, v in apps.most_common()))
joins = [d.get('D') for d in M if d.get('G', '').endswith('-join')]
if joins: P('## New testers joined: ' + ', '.join(joins))
print('\n'.join(out))
