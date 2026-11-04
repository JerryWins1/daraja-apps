# The Kenya weekly leaderboard

`tally.py` writes `kenya/leaderboard.json` — the "🏆 This week" card on the Kenya Test Week
page, with its five 500/1,000 KES awards.

## Why this exists

The original `tally.py` lived outside this repo and **stopped running on 24 October 2026**.
Nothing noticed. By 4 November the page was still showing the week of 23–29 October as
"This week", with October's winners listed and prize money against them — and `players` held
26 per-tester placings, so the page could tell a returning tester *"You're 2nd in Longest
streak!"* about a competition that had already ended and been paid.

This version lives in the repo so it can be read, tested and fixed.

## Running it

    cp kenya/leaderboard.json <work>/leaderboard.json
    python3 -I tools/leaderboard/tally.py <work>/x <repo root> <work>/leaderboard.json [now ISO]

`<work>/x` is the Jerry HQ sheet, exported as xlsx and unzipped — exactly what
`tools/morning-report/refresh.sh` already produces. That script now runs this one and prints
the path, so the nightly Store Manager job gets a fresh leaderboard for free: same sheet,
no new credentials, no new scheduled job.

**It writes to the work dir, never to the repo.** Like `ready_to_sell.html`, what happens to
the file afterwards is the caller's decision.

The optional `now` argument fixes the date, which is what makes the thing testable — see
below.

## What it counts, and what it refuses to

Three awards a machine can count honestly, over the current **Friday-to-Thursday** week
(the page's own rule):

| Award | Counted from |
| --- | --- |
| 📱 Most apps finished | distinct apps with `challenge:n/n PASS` in a `KENYA|`/`FRIEND|` report |
| 🔥 Longest streak | the `testing streak N days` the app itself worked out — its number, not a re-derivation |
| 🐞 Bug hunter | rows in `requests` with a non-empty `fixed`, i.e. problems Jerry has confirmed |

**💡 Best idea and ⭐ Tester of the week are Jerry's picks and are left alone.**

An award with nobody in it is written **empty**. Nothing is carried over and nothing is
invented: an empty leaderboard at the start of a round is true, and a stale one is not.

## Two things that took care, because the data is messier than it looks

**Names.** Two Faiths and two Brians test the squad, and the sheet stores some names in
capitals. The board shows a title-cased first name, plus the surname's initial when the first
name is genuinely shared — the `Faith W.` / `Brian K.` form the old script used. Collisions
are counted by **distinct surname**, letters only, not by row: the people sheet holds
`Frank Ndung'u` and `Frank Ndungu` as separate rows for one man, and counting rows printed
`Frank N.` where the old script correctly printed `Frank`.

**Identity.** The page finds a tester's own standing with
`'n:' + hex8('dj|' + normName(FULL))`, or `'t:' + hex8('dj|' + WHO)` for their token, where
`hash` is FNV-1a over UTF-16 code units. `tally.py` reproduces that hash in Python, and emits
a key for **every roster spelling of the same person**, grouped by phone number — because
Frank topped a week's streak while being unfindable under one of his two spellings, so the
page could not have told him.

Verified against the original's output: both rank-1 keys the old script wrote for that week,
`t:cfd0bfaf` and `n:a9f64084`, come back out of this one at rank 1.

## Testing it

Pass a `now` to pin the week, and compare against a week whose answer is already known:

    python3 -I tools/leaderboard/tally.py <work>/x . <work>/lb.json 2026-10-24T10:07:00

For the week of 23–29 October that gives Frank and Shamsuddin leading the streak and Thao
leading apps, which is what the original wrote on 24 October. The scores come out higher
because this run sees the whole week and the original ran on day two.

## One limitation, stated rather than hidden

The page's rule is "Friday to Thursday, **Kenya time**". This script takes the week from the
UTC date, and Kenya is UTC+3, so the two disagree only for a run between 21:00 and midnight
UTC. The nightly job runs at 05:54 Chicago — 11:54 UTC, 14:54 in Kenya — so it is never in
that window. Worth knowing before anyone reschedules the job to late evening UTC.

## Still open

Nothing rolls the week over on its own. If the nightly job stops, or stops running this, the
card goes stale again exactly as it did — just with a `note` field in the JSON now saying who
wrote it and when, so the next person is not misled into thinking something is tending it.
