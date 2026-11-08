# How testers are paid

Rates set by Jerry, 7 November 2026. Jerry, same day: *"I have the pay rates.
There's nothing pending."* This file is the record, so the rule does not live only
inside a chat.

## The rule

Per app tested, by how long that app's test script is:

| What | KES |
| --- | --- |
| Test a **small** app (14–17 steps) | 100 |
| Test a **normal** app (18–21 steps) | 150 |
| Test a **big** app (22–30 steps) | 250 |
| A report that **finds a real problem** | 50 |
| **Use an app 5 days** in one week | 100 |

The problem bonus is **per report, not per problem** — a report carrying three
faults earns 50, once.

**A report the app accepted is a paid test.** There is no completion gate. The old
four-part gate (challenge attempt, step results, ease rating, own words) was removed
on 7 November: the only part that ever failed anybody was the ease rating, which the
app itself told them they could skip.

Which app counts as which size is generated from its own test script and lives in
`kenya/lead/bands.json`. The rates the managers' page reads are
`kenya/lead/rates.json`; changing that one file changes the page.

## Testing is permanent, not a round

Jerry, 7 November: *"it's just a test situation. It's always gonna be a test
situation."*

There are no rounds and no round-close dates. Testing runs in **weekly cycles,
Monday 00:00 to Sunday 23:59, Kenya time**. Nothing carries over between cycles —
every count builds from zero on Monday. **Cycle 1 is Monday 9 November to Sunday
15 November 2026.**

Pay is worked out at **5:47am Monday, Kenya time** — after the week has actually
closed, not before it. That is Sunday evening in Illinois, so Jerry has the figures
with an evening still ahead of him and can message both managers before Kenya wakes
up. An earlier version ran at 6:41pm Sunday Kenya and would have missed the last
five hours of every week.

The managers pay their teams out of their float during the week, and the next cycle
starts the Monday after.

October is settled and paid at the old flat rate; none of it counts here.

## Two teams, and the managers do the paying

| Team | Manager |
| --- | --- |
| Team 1 | Emmanuel Koki |
| Team 2 | Veronicah Kimani |

That is all of it. The teams are in `kenya/lead/teams.json`.

Jerry sends each manager a float — 25,000 KES to start. They pay their own team out
of it and write each payment down on their own page. **Claude never marks anyone
paid**, and never quotes a figure to a tester.

## Where the money is tracked

**The managers' page — https://jerrywins1.github.io/daraja-apps/kenya/lead/**

Each manager has their own link and sees only their own team. It needs no sign-in,
which is the point: neither manager has an email address or a Claude account. It
shows what each tester earned, what has been paid, what is left in the float, and it
opens WhatsApp with the words ready.

`kenya/lead/standing.json` is what the managers are told is true right now. When a
WhatsApp message and that page disagree, the page is right.

**Jerry's own page — https://jerrywins1.github.io/daraja-apps/kenya/lead/jerry/**

Both teams at once: every tester's apps, problems, earned and owed, who has gone
quiet, what each manager has been sent against what reached the testers, and what
each manager has told their team. It writes nothing.

**Money Jerry sends — `kenya/lead/floats.json`**

Money going out is written by the managers, on their own page. Money coming in is
written only here, when Jerry says he has sent it. They are kept in different places
on purpose: neither hand can quietly write the other's record. Where a manager has
paid out more than Jerry has sent, their page says they are owed that much out of
their own pocket rather than showing a negative balance.

## Who owns this

The **Daraja · tester pack** chat — https://claude.ai/code/session_01EPPiddho9jmdtB6N6bkQbf
— owns all testing and all pay: both teams, the managers' page, the rates, and the
Sunday cycle close that works out the week's money. Nothing about pay is decided or
changed anywhere else.

The **Daraja · Store Manager** chat owns the store and nothing in this file.

## Why per app, and not flat or per week

The October round paid 3,500 KES flat to each of 19 testers — 66,500 KES for 287
app-tests and 217.5 logged hours. Flat pay made the effective rate wildly uneven:

| Tester | Apps | Hours | KES per hour |
| --- | --- | --- | --- |
| Shamsuddin Jamal Mukira | 28 | 26.9 | 130 |
| FAITH WANGARI | 28 | 22.8 | 154 |
| Kevin | 28 | 20.6 | 170 |
| Brian Maina Kamau | 17 | 17.5 | 200 |
| Fredrick Nganga | 14 | 15.9 | 221 |
| Thao mita | 20 | 5.0 | 695 |
| John Coleman | 3 | 2.5 | 1,429 |
| Clinton Mburu | 1 | 0.3 | 10,500 |

An 80-fold spread for the same money. Five testers covered all 28 apps; three
covered one.

Paying **per week** would be worse still — it pays for calendar time rather than
work, rewards spreading the work out, and would place Veronicah (14 apps over 11
days) above Thao mita (20 apps in 2 days).

Sizing by script length fixes the remaining unfairness in a flat per-app rate: a
30-step app was worth the same as a 14-step one.

## The bonus, and why it exists

Clean passes teach you nothing you did not already know. Fredrick's 23 October
report on Rafiki — *"I can't find any options to pick a voice"* — uncovered a fault
that left **every Android user with no voices at all**, on the one app whose whole
purpose is talking. That single report was worth more than ten passes.

## What was removed on 7 November, and why

Two things in this repo were a second pay system running beside the real one, on the
old flat 250 rate and the removed four-part gate:

- `kenya/pay/` and `kenya/payroll.json` — a second managers' page
- `tools/payroll/payroll.py` and a payroll step in `tools/morning-report/refresh.sh`

They would have shown Emmanuel and Veronicah different money from the page they
actually use. Deleted rather than corrected: one pay system, or none.

The nightly "Daraja round — did anybody test today?" job was switched off the same
day. It reported the round every evening, which the Sunday cycle close already
covers, and it was the job keeping the deleted page current.
