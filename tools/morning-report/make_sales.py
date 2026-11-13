#!/usr/bin/env python3
"""control/sales.json for the 💰 Sales tab in Daraja HQ.

usage: make_sales.py <data.json> [--stripe <export.json>] [--weekly control/weekly.json] [--out control/sales.json]

data.json is what compute.py writes (its `sales` block). The Stripe export is optional: a JSON
list of Checkout Sessions or charges (or {"data":[...]}), each with amount_total or amount (cents),
created (unix seconds) and client_reference_id (the store key). Without it the donation numbers
already in the output file are kept and donations.source reads "not connected yet".
DJ_TODAY=YYYY-MM-DD pins today for a test run.
"""
import argparse, collections, datetime, json, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))


def load_names():
    """Store key -> app name, out of shop/apps_data.js (read with node, as voicemaker.py does)."""
    path = os.path.join(REPO, 'shop', 'apps_data.js')
    if not shutil.which('node'):
        return {}
    js = ('const fs=require("fs");'
          'const f=new Function(fs.readFileSync(%r,"utf8")+";return APPS;");'
          'const A=f(),o={};for(const k in A)o[k]=A[k].showName||A[k].name||k;'
          'process.stdout.write(JSON.stringify(o));' % path)
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if out.returncode:
        print('apps_data.js did not parse; names fall back to store keys', file=sys.stderr)
        return {}
    return json.loads(out.stdout)


def read(path, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def donations_from(rows, today, names):
    if isinstance(rows, dict):
        rows = rows.get('data', [])
    d7 = today - datetime.timedelta(days=7)
    d30 = today - datetime.timedelta(days=30)
    c = {'count_7d': 0, 'amount_7d': 0.0, 'count_30d': 0, 'amount_30d': 0.0, 'count_all': 0, 'amount_all': 0.0}
    per = collections.defaultdict(lambda: [0, 0.0])
    for r in rows:
        if not isinstance(r, dict):
            continue
        # a session that was never paid, or a charge that failed or was refunded, is not a gift
        if r.get('payment_status') not in (None, 'paid') or r.get('status') in ('failed', 'expired', 'open'):
            continue
        if r.get('refunded') is True or r.get('paid') is False:
            continue
        cents = r.get('amount_total', r.get('amount'))
        if not isinstance(cents, (int, float)):
            continue
        amt = cents / 100.0
        try:
            day = datetime.datetime.fromtimestamp(int(r.get('created')), datetime.timezone.utc).date()
        except (TypeError, ValueError):
            day = None
        key = (r.get('client_reference_id') or (r.get('metadata') or {}).get('client_reference_id') or 'unknown').strip() or 'unknown'
        c['count_all'] += 1; c['amount_all'] += amt
        if day and day > d30:
            c['count_30d'] += 1; c['amount_30d'] += amt
        if day and day > d7:
            c['count_7d'] += 1; c['amount_7d'] += amt
        per[key][0] += 1; per[key][1] += amt
    by_app = [{'app': k, 'name': 'The store' if k == 'store' else names.get(k, k), 'count': v[0], 'amount': round(v[1], 2)}
              for k, v in sorted(per.items(), key=lambda kv: (-kv[1][1], -kv[1][0], kv[0]))]
    out = {k: (round(v, 2) if k.startswith('amount') else v) for k, v in c.items()}
    out['by_app'] = by_app
    out['source'] = 'Stripe export, ' + today.isoformat()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('data')
    ap.add_argument('--stripe')
    ap.add_argument('--weekly', default=os.path.join(REPO, 'control', 'weekly.json'))
    ap.add_argument('--out', default=os.path.join(REPO, 'control', 'sales.json'))
    a = ap.parse_args()

    today = datetime.date.fromisoformat(os.environ['DJ_TODAY']) if os.environ.get('DJ_TODAY') \
        else datetime.datetime.now(datetime.timezone.utc).date()
    names = load_names()
    S = read(a.data, {}).get('sales') or {}
    prev = read(a.out, {})

    opens = S.get('opens') or {}
    interest = S.get('interest') or {}

    if a.stripe:
        donations = donations_from(read(a.stripe, []), today, names)
    else:
        donations = prev.get('donations') or {'count_7d': 0, 'amount_7d': 0, 'count_30d': 0, 'amount_30d': 0,
                                               'count_all': 0, 'amount_all': 0, 'by_app': []}
        donations['source'] = 'not connected yet'

    wk = read(a.weekly, {})
    out = {
        'updated': today.isoformat(),
        'donations': donations,
        'opens': {
            'by_app': [{'app': k, 'name': names.get(k, k), 'opens_7d': v.get('last_7_days', 0), 'opens_all': v.get('all_time', 0)}
                       for k, v in opens.items()],
            'total_7d': (S.get('opens_total') or {}).get('last_7_days', 0),
        },
        'signups': {
            'total': interest.get('total', 0),
            'by_shelf': [{'shelf': k, 'count': v} for k, v in (interest.get('by_shelf') or {}).items()],
            'by_app': [{'app': k, 'name': 'The store' if k == 'store' else names.get(k, k), 'count': v}
                       for k, v in (interest.get('by_app') or {}).items()],
            'kenya_news_yes': interest.get('kenya_yes', 0),
        },
        'weekly_note': {k: wk.get(k, '') for k in ('id', 'app', 'from', 'to')},
        'notes': prev.get('notes') or ['Live counting started 13 Nov 2026.'],
    }
    # week by week: one row per ISO week, the latest run in a week replaces that week's row
    iso = today.isocalendar()
    week = '%d-W%02d' % (iso[0], iso[1])
    row = {'week': week, 'opens_7d': out['opens']['total_7d'], 'signups': out['signups']['total'],
           'donations_7d': donations.get('count_7d', 0), 'amount_7d': donations.get('amount_7d', 0)}
    weeks = [w for w in (prev.get('weeks') or []) if w.get('week') != week] + [row]
    out['weeks'] = sorted(weeks, key=lambda w: w['week'])[-26:]

    with open(a.out, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('sales.json:', out['donations']['count_all'], 'gifts ·', out['opens']['total_7d'], 'opens this week ·',
          out['signups']['total'], 'sign-ups')


if __name__ == '__main__':
    main()
