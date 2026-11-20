#!/usr/bin/env python3
"""Pull paid Stripe Checkout Sessions into a file make_sales.py --stripe can read.

usage: stripe_export.py <out.json> [--since YYYY-MM-DD]

Runs from a cloud chat whose environment holds the read-only Stripe key as a network
secret for api.stripe.com: the proxy adds the real key, so the dummy below is all this
script ever sees. Only amount, created, client_reference_id and status are written —
no names, emails or card details.

--since drops anything before that day. It defaults to 2026-11-13 because the one
payment before it ($1.00 on 12 Nov) was Jerry's own test.
"""
import argparse, datetime, json, subprocess, sys

KEEP = ('amount_total', 'created', 'client_reference_id', 'payment_status', 'status', 'currency')


def get(url):
    out = subprocess.run(['curl', '-sSg', url, '-H', 'Authorization: Bearer rk_live_dummy'],
                         capture_output=True, text=True)
    return json.loads(out.stdout or '{}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('--since', default='2026-11-13')
    a = ap.parse_args()
    since = int(datetime.datetime.fromisoformat(a.since).replace(tzinfo=datetime.timezone.utc).timestamp())
    rows, after = [], None
    while True:
        url = f'https://api.stripe.com/v1/checkout/sessions?limit=100&created[gte]={since}'
        if after:
            url += f'&starting_after={after}'
        r = get(url)
        if 'error' in r or 'data' not in r:
            sys.exit('Stripe read failed: ' + str((r.get('error') or {}).get('message', r))[:200])
        rows += [{k: s.get(k) for k in KEEP} for s in r['data']]
        if not r.get('has_more') or not r['data']:
            break
        after = r['data'][-1]['id']
    json.dump(rows, open(a.out, 'w'))
    paid = [x for x in rows if x['payment_status'] == 'paid']
    print(f'stripe: {len(rows)} sessions since {a.since}, {len(paid)} paid')


if __name__ == '__main__':
    main()
