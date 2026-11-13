# Morning report kit

The scripts behind the Ready to Sell page and the daily digest. Built 20 Oct 2026.

**This file describes the scripts and nothing else.** It carries no rules about how to
work, what to merge, or how to write to Jerry. It used to, and on 8 Nov 2026 all three
of those rules turned out to be wrong — it told the nightly job to merge its own pull
requests (Jerry merges), to end every report with a numbered list of steps (he gets one
step, never a list), and that a cloud session cannot message another session (it can;
three were messaged that night). The job was told this file was its source of truth, so
every run read all three. **The rules live in `daraja-apps/CLAUDE.md`, in one copy.**
Read that and follow it; do not work from a paraphrase, and do not add one here.

## What it makes

- `ready_to_sell.html` — the private Ready to Sell page (artifact
  https://claude.ai/artifact/CwykaFQWkemdWtt7VEGD7t). An app is *ready* when 2 or more
  testers passed its challenge on the **current version**, there are no failed steps on
  that version, and the average ease is 4 or more.
- a digest, printed to stdout: store counts and what changed since yesterday, tester
  questions waiting for an answer, ❌ problems, invite-code stops, app errors, store
  tests sent, new testers.

It writes no pay file. One briefly existed and was removed on 7 Nov 2026 — tester pay
is worked out by the Sunday cycle close and shown on `kenya/lead/`. See `kenya/pay.md`.

## How to run it

1. Export the Jerry HQ sheet as .xlsx with the Google Drive connector
   (`download_file_content`, file id `1ezYrpd-ah47ws_MVaw_Jh8TqbFkwDWQ1T79QIiLrUEc`,
   exportMimeType
   `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`). It is too big
   to show, so it saves to a tool-results file.
2. `tools/morning-report/refresh.sh <that tool-results file> [work dir] [since ISO]` —
   pass the tool-results JSON itself, not a decoded xlsx; the script does its own
   base64 extraction.
3. Publish `<work>/ready_to_sell.html` to the Ready to Sell artifact above, same URL
   every day.

## The files

- `compute.py` — reads the sheet's `messages` tab (KENYA| / FRIEND| result lines) plus
  each app's current version from the repo → `data.json`
- `build.py` + `template.html` — `data.json` → the page
- `digest.py` — the digest
- `refresh.sh` — all of the above in one go. It reads app versions from a detached
  worktree of `origin/main`, so it never switches anyone's branch.

## Sales signals in `data.json`

`compute.py` also counts two kinds of line that the apps send to the same mailbox as the
tester reports (`testers/config.json` → `mailbox`, as action `report`), so they arrive in the
`messages` tab like any other row. The first line of column H is the tagged line; for
`INTEREST` the second line is the name and contact the person typed, which stays in the sheet
and is not copied into `data.json`.

| line | sent by | means |
| --- | --- | --- |
| `OPEN\|app:<store key>\|day:YYYY-MM-DD` | every app's house layer (section 14b), at most once per app per phone per day | an app was opened that day. Name column reads `Anonymous`. No id, no cookie, nothing typed |
| `INTEREST\|app:<store key>\|shelf:<shelf>\|kenya:yes\|no\|day:YYYY-MM-DD` | Keep me posted, in the 🌉 sheet (`app` is that app) or on the store (`app:store`, `shelf` is the one picked, `all` for every shelf) | someone asked to hear about that shelf; `kenya:yes` means they also ticked Loving InDeed's Kenya news |

They land in `data.json` under `sales`:

| field | what it is |
| --- | --- |
| `last_day` | the last full day counted (yesterday, by UTC date; `DJ_TODAY=YYYY-MM-DD` pins today for a test run) |
| `week_from` | first day of the 7-day window, which ends on `last_day` |
| `opens` | per store key: `last_day`, `last_7_days`, `all_time` OPEN rows, busiest this week first |
| `opens_total` | the same three numbers over every app |
| `interest.total` / `interest.last_day` | INTEREST rows all time / on `last_day` |
| `interest.kenya_yes` | how many of them said yes to Kenya news |
| `interest.by_shelf` / `interest.by_app` | INTEREST rows per shelf key and per store key |

`digest.py` prints these as a short **Sales signals** section at the end. The date in each
line is the phone's own date, so a row is counted under the day the person opened the app.

Donations are not in the sheet: each donation link carries `client_reference_id=<store key>`
(`store` for the store's own note), which Stripe shows on the payment.

## Who runs it, and what the run itself must do

The nightly **Daraja · Store Manager** job, 5:54am Central, fires into
https://claude.ai/code/session_01SneDTZZK3LM6dXHfqB8Jeg. **That job's own prompt is
where its steps live** — what to publish, what to commit, what to open a pull request
for, and what to tell Jerry. This file does not duplicate them, and if it ever appears
to, the job's prompt wins and the duplicate here should be deleted rather than updated.

## control/weekly.json — "This week from Daraja"

One small note a week from HQ, shown inside every Daraja app by the shared house layer
(section 15b). The Store Manager chat writes this file each Monday from the marketing
plan, after Jerry has OK'd the words.

| field | what it does |
| --- | --- |
| `id` | the note's name, e.g. `2026-W47`. A phone shows each id once; a new id shows again |
| `from`, `to` | first and last day it can show, `YYYY-MM-DD`, read as the phone's local date |
| `title` | the one bold line |
| `text` | one or two short sentences under it |
| `app` | the store key in `shop/apps_data.js` of the app the button opens (its `try` link). It must be on the store (in `LAUNCH` while `PHASE` is `'donate'`). The note never shows inside that app itself |
| `button` | the button's words, e.g. "Open Shoebox Counter" |

All seven fields are required. If the file is missing, out of date, or any field is
missing or malformed, apps show nothing. The note never shows on children's pages, in My
Safety Plan, on the store, door, control, test, help or tester pages, or inside a frame,
and it waits until the daily hello has faded. Apps fetch it with an hourly cache key, so a change reaches phones within the hour.
