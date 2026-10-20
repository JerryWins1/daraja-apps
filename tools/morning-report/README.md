# Morning report kit

Built 20 Oct 2026 so whoever runs Daraja in the morning (Claude or Jerry) does the same thing every day.

**What it makes**
- `ready_to_sell.html` — the private "Ready to Sell" page (artifact https://claude.ai/artifact/CwykaFQWkemdWtt7VEGD7t). An app is *ready* when 2+ testers passed its challenge on the **current version**, there are no failed steps on that version, and the average ease is 4 or more.
- a digest (printed): store counts and what changed since yesterday, **tester questions waiting for an answer**, Business Week progress and ❌ problems, invite-code stops, app errors, store tests sent, new testers.

**Every morning**
1. Export the Jerry HQ sheet as .xlsx with the Google Drive connector (`download_file_content`, file id `1ezYrpd-ah47ws_MVaw_Jh8TqbFkwDWQ1T79QIiLrUEc`, exportMimeType `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`). It is too big to show, so it is saved to a tool-results file.
2. `tools/morning-report/refresh.sh <that file> [work dir] [since]`
3. Publish `<work>/ready_to_sell.html` to the Ready to Sell artifact (same URL every day).
4. Act on the digest:
   - every tester question gets an answer in `kenya/news.json` → `answers` (the testers read it on their page);
   - a store bug → fix it on a branch, test it in Chromium, merge;
   - Zuri problems → Zuri fixes are done in Jerry's "Business management system for Kenya" chat; give Jerry a paste-ready box (cloud sessions can't message other sessions);
   - end the report to Jerry with **"What to do now": numbered steps, every message written out in full** (Jerry's standing rule, 19 Oct).

**Files**
- `compute.py` — reads the sheet's `messages` tab (KENYA| / FRIEND| result lines) + each app's current version from the repo → `data.json`
- `build.py` + `template.html` — `data.json` → the page
- `digest.py` — the digest
- `refresh.sh` — all of the above in one go; it reads app versions from a detached worktree of `origin/main`, so it never switches anyone's branch.
