# How testers are paid

**Set by Jerry, 7 November 2026, confirmed 8 November.** This file is the record,
so the rule does not live only inside a chat. It replaces the version of
4 November, which had one flat rate of 250 KES per app-test and a four-part
completion gate.

The numbers themselves live in `kenya/lead/rates.json`, which the testers' page,
both managers' pages and the weekly pay run all read. Change that file and every
screen changes with it. This file explains the rule; that file holds the figures.

## The rule

**Paid per app, by the size of the app.**

| Band | Rate | Apps | How it is decided |
| --- | --- | --- | --- |
| Small | 100 KES | 8 | 14 to 17 steps |
| Normal | 150 KES | 16 | 18 to 21 steps |
| Big | 250 KES | 7 | 22 to 30 steps |

The size comes from each app's own test script, counted into
`kenya/lead/bands.json`. Nobody classifies an app by hand, so an app that gains
steps moves band by itself when that file is regenerated.

**Plus 50 KES for a report that finds a real problem.** A step marked failed
*and* a note saying what happened. It is **per report, not per problem** — a
report that finds twelve things earns 50 KES, not 600. Nobody has to confirm it:
the bonus is automatic, and refusing one is what takes effort (type `no:` and a
reason in that report's `fixed` cell).

**Plus 100 KES in any week a tester uses an app on 5 days out of 7.** Once a
week, not per day, and not five in a row — a sick day or a power cut costs
nobody 100 KES. The apps count this themselves through the "✅ I used it today"
button.

**A report the app accepted is a paid test.** There is no completion gate. The
app already refuses to send a report without a challenge attempt, step results
and a written comment, so a gate on top of that caught nothing — checked against
all 306 reports on 6 November, the only thing that ever failed anybody was the
ease rating, which the app itself told testers they could skip.

**Failing the challenge does not cost the money.** A test that shows something is
broken is worth as much as one that passes. The old rule paid only on a pass,
which quietly priced honesty below speed.

A re-test after an app is updated is paid again, which is what the app already
promises on screen.

## The week

**Monday to Sunday, Kenya time.** The week closes at midnight Kenya on Sunday and
the pay is worked out early Monday Kenya time — which is Sunday evening in
Illinois, so Jerry can send the managers their figures before Kenya wakes up.

A report filed on Sunday is in that week. One filed on Monday is in the next.
Nothing carries over; each week is settled on its own.

## Who does what

| | |
| --- | --- |
| Works out the numbers | The weekly pay run, from the testers' own reports |
| Sends the money | Jerry, to each manager |
| Pays the testers | Emmanuel Koki for team 1, Veronicah Kimani for team 2 |
| Records the payment | The manager, on their own page |
| Records money sent | Jerry, in `kenya/lead/floats.json` |
| Changes a rate | Jerry, in `kenya/lead/rates.json` |

A tester asks their own manager about their own pay, not Jerry.

The pages: a manager opens `kenya/lead/` with their personal link; Jerry's view of
both teams is `kenya/lead/jerry/`.

## What is no longer paid

Replaced by the single 100 KES weekly use bonus, from 9 November 2026:

| Was offered | Amount |
| --- | --- |
| 7 days in a row with one app, once per app | 150 KES |
| 3-day testing streak | 50 KES |
| 7-day testing streak | 150 KES |
| Weekly award — longest streak, bug hunter, best idea, most apps | 500 KES each |
| Tester of the week | 1,000 KES |

They stacked, none of it was budgeted, and together they made daily use pay
better per hour than testing — the opposite of the point.

**Anything already earned under them is still paid.**

## Why per app, and why by size

The October round paid 3,500 KES flat to each of 19 testers — 66,500 KES for 287
app-tests and 217.5 logged hours. Flat pay made the real rate wildly uneven:
Shamsuddin Jamal Mukira earned about 130 KES an hour for 28 apps; Clinton Mburu
about 10,500 for one. An 80-fold spread for the same money.

Paying per week would be worse: it pays for calendar time rather than work.

One flat rate per app fixed the spread but created another problem — a 14-step
app and a 30-step one paying the same drives testers onto the short apps. Three
bands fix that without overcorrecting. Jerry first set 100 / 250 / 350 on
7 November, then chose 100 / 150 / 250 the same day: at 350 a big app pays
roughly double per hour what a small one does, which just drives testers the
other way.

The same October work under these rules comes to 52,050 KES — 22% less than was
actually paid, with the money moved toward the people who did the work.

## Why the problem bonus is automatic

The old rule needed Jerry to confirm each find by hand. In a month he did that
three times, so the bonus was promised to testers and never paid. Making the
default the outcome is what turned it into real money: 22 reports, 53 problems,
1,100 KES, counted on 7 November.

The reason it matters: Fredrick's 23 October report on Rafiki — *"I can't find
any options to pick a voice"* — uncovered a fault that left every Android user
with no voices at all, on the one app whose whole purpose is talking. That single
report was worth more than ten clean passes.

## The round before this

The October round was paid at the old flat rate and is settled separately. This
rule starts with the week beginning Monday 9 November 2026.
