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

## Who runs it, and what the run itself must do

The nightly **Daraja · Store Manager** job, 5:54am Central, fires into
https://claude.ai/code/session_01SneDTZZK3LM6dXHfqB8Jeg. **That job's own prompt is
where its steps live** — what to publish, what to commit, what to open a pull request
for, and what to tell Jerry. This file does not duplicate them, and if it ever appears
to, the job's prompt wins and the duplicate here should be deleted rather than updated.
