# Who gets paid

`payroll.py` writes `kenya/payroll.json` — what each tester has earned this round, split by the
two leads' teams. The leads read it at **`kenya/pay/`**, one link each:

- Emmanuel — `https://jerrywins1.github.io/daraja-apps/kenya/pay/?lead=emmanuel`
- Veronicah — `https://jerrywins1.github.io/daraja-apps/kenya/pay/?lead=veronicah`
- Jerry, both teams — `https://jerrywins1.github.io/daraja-apps/kenya/pay/`

## Why it exists

Jerry, 7 November 2026: *"each leader, Veronica and Emmanuel, have an app that gets data from
you, and then it tracks the scores of the testers and how much they get paid, and then if they
get paid and when."*

Before this, the scores were counted (`tools/leaderboard`), the rule was written
(`kenya/pay.md`) and the money was settled in a spreadsheet — and nothing joined them up.
The one page that came close, the Kenya Test Tally artifact, was a report for Jerry, had no
chat tending it, and had been stale since 24 October showing rates that no longer applied.

## Running it

    python3 -I tools/payroll/payroll.py <work>/x <repo root> <work>/payroll.json [since YYYY-MM-DD]

`<work>/x` is the Jerry HQ sheet, exported as xlsx and unzipped — exactly what
`tools/morning-report/refresh.sh` already produces. That script now runs this one, so the
nightly Store Manager job gets a fresh payroll for free: same sheet, no new credentials, no new
scheduled job.

**It writes to the work dir, never to the repo**, like `ready_to_sell.html` and the leaderboard.
What happens to the file afterwards is the caller's decision.

## The gate, and why it is not loosened here

From `kenya/pay.md`: **250 KES per completed app-test**, plus **50 KES per confirmed find**. A
report counts as one completed app-test only when it carries all four parts:

| part | in the report |
| --- | --- |
| a challenge attempt | `challenge:N/N PASS` or `FAIL` — both count |
| step results | `steps:N/N ok,N fail,N unsure` |
| an ease rating | `ease:N` |
| their own words | a non-empty `In their own words:` section |

The fourth is the one that stops a rushed report counting, and it is the one a machine could
most easily be talked out of checking, so reports failing any part are counted separately and
shown on the page as "not counted" rather than quietly dropped.

## The date argument, which matters more than it looks

`since` defaults to **2026-11-05**, the day this round opened, and it is not cosmetic.

`kenya/pay.md` says the 250-per-test rule *"starts with the next round"*; October was settled
separately at a flat 3,500 each. Counting all history here would re-price work that is already
paid — and underprice it badly, because the report format gained `ease` and
`In their own words` partway through October. Of 612 reports in the sheet, 442 carry `ease` and
306 carry their own words, so roughly half of October fails a gate that did not exist when it
was written. Kevin Ngugi covered 28 apps in October and scores 4 against the current gate.

So anything before `since` is counted as history (`before` on each person) and never turned
into money.

## Names

The sheet spells one person several ways — `Frank Ndung'u` and `Frank Ndungu` are one man, and
some rows are in capitals. Matching is on letters only, falling back to the first name when
exactly one person on the roster has it. This is the same resolution `tools/leaderboard/tally.py`
already does, for the same reason.

## What it found on the first run, and has not fixed

**Seven people have filed 108 reports between them and are on neither team.** Shamsuddin Jamal
Mukira (31 reports), Josphat Thuo (28), Nessy Mukami (21), Thao mita (20), Francis Koikai (6),
Clinton Mburu (1), Jacqueline Nkirote Muriithi (1). They are listed under `unplaced` in the
output and are **not paid by either lead**, because this script will not invent a team for
somebody. Shamsuddin covered 28 apps in October — more than anyone on Veronicah's roster bar
Faith. That is a roster question for Jerry, not something to paper over here.

## The paid half

This script only ever reads. Whether somebody has been paid, and when, is tapped by the lead
on the page and stored in the **testers' mailbox** as an ordinary board post with
`kind: "paid"` — so it needed no change to the Apps Script already deployed, and no key on the
page. The page reads those posts back to show who is settled.

One limit, stated rather than hidden: the mailbox keeps the most recent 500 posts. At 27
testers that is many rounds away, but it is not a permanent ledger, and a payment record that
rolls off would show as unpaid. If this becomes the real books rather than a working list, the
record needs somewhere that does not roll.
