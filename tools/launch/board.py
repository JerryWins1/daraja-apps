#!/usr/bin/env python3
"""Launch board data: one row per store app, each check green or red.

Writes control/launch.json, which control/launch.html shows. Run it any time:
    python3 tools/launch/board.py
The nightly Store Manager job runs it so the board is never hand-written
(CLAUDE.md: "Don't do the caretaker's work by hand").

Launch idea 1, chosen by Jerry on 21 Nov 2026 — see control/launch-plan.md.
Everything here is read from the repo; nothing is typed in by hand.
"""
import datetime, json, os, re, sys, urllib.parse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'shop'))
import voicemaker as vm  # noqa: E402

AI = re.compile(r'\bAI\b|ChatGPT|Claude|Gemini')
SITE = 'https://jerrywins1.github.io/daraja-apps/'
NOT_FOR_SALE = {'hq', 'tester', 'hello'}          # Daraja HQ, the tester kickoff and greeting: not store apps
# The house hides the AI buttons on these on purpose (crisisPage, kidsPage), so their videos
# must NOT claim AI — control/overnight-2026-11-21-videos.md. The check does not apply to them.
NO_AI = {'safety', 'churchclubhouse'}
SCRIPT_OF = {'businessmanager': 'bizmgr', 'quickquote': 'bizmgr'}   # store key -> testers/scripts name


def page_of(app):
    t = app.get('try') or ''
    if not t.startswith(SITE):
        return None, t
    rel = urllib.parse.unquote(t[len(SITE):]).split('?')[0].split('#')[0].strip('/')
    return (os.path.join(ROOT, rel, 'index.html') if rel else None), t


def head_checks(html):
    return {
        'phone fit': 'viewport-fit=cover' in html,
        'home icon': 'apple-touch-icon' in html,
        'theme colour': 'theme-color' in html,
        'installable': 'rel="manifest"' in html or "rel='manifest'" in html,
        'version stamp': bool(re.search(r'v\d+\.\d+[^\n<]{0,40}?20\d\d-\d\d-\d\d', html)),
    }


def main():
    apps = vm.load_apps()
    with open(vm.INDEX, encoding='utf-8') as f:
        index = json.load(f)
    good, missing, stale, unverified = vm.audit(apps, index)
    bad = {k: why for k, _, _, why in missing + stale + unverified}
    vids = {}
    for key, appkey, mode in vm.every_video(apps):
        vids.setdefault(appkey, []).append((key, mode))
    cards = {}
    try:
        with open(os.path.join(ROOT, 'control', 'apps.json'), encoding='utf-8') as f:
            d = json.load(f)
        for c in (d if isinstance(d, list) else d.get('apps', [])):
            cards[c.get('url', '').rstrip('/')] = c
    except Exception:
        pass
    houses = []
    rows = []
    for k, a in sorted(apps.items(), key=lambda kv: kv[1].get('name', kv[0])):
        if k.startswith('tpl') or k.startswith('nourish') or k in NOT_FOR_SALE:
            continue
        path, url = page_of(a)
        html = ''
        if path and os.path.exists(path):
            html = open(path, encoding='utf-8', errors='ignore').read()
        m = re.search(r'dj-house-v(\d+)', html)
        house = int(m.group(1)) if m else None
        if house:
            houses.append(house)
        checks = {'page found': bool(html)}
        if html:
            checks.update(head_checks(html))
        vlist = vids.get(k, [])
        vbad = [key + ': ' + bad[key] for key, _ in vlist if key in bad]
        noai = [key for key, mode in vlist
                if not AI.search(' '.join(vm.lines_of(apps, k, mode) or []))]
        checks['videos current'] = bool(vlist) and not vbad
        if k not in NO_AI:
            checks['videos say AI'] = bool(vlist) and not noai
        checks['test script'] = os.path.exists(os.path.join(ROOT, 'testers', 'scripts', SCRIPT_OF.get(k, k) + '.json'))
        card = cards.get(url.rstrip('/'), {})
        rows.append({'key': k, 'name': a.get('name', k), 'em': a.get('em', ''), 'url': url,
                     'house': house, 'checks': checks, 'videos': len(vlist),
                     'notes': vbad + (['no AI line: ' + ', '.join(noai)] if noai else []),
                     'card': card.get('status', ''), 'chat': card.get('chat_name', '')})
    top = max(houses) if houses else None
    for r in rows:
        if r['checks']['page found']:
            r['checks']['house current'] = r['house'] == top
        r['ready'] = all(r['checks'].values())
    out = {'made': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'), 'house': top,
           'ready': sum(r['ready'] for r in rows), 'total': len(rows), 'apps': rows}
    with open(os.path.join(ROOT, 'control', 'launch.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print('%d of %d apps ready' % (out['ready'], out['total']))


if __name__ == '__main__':
    main()
