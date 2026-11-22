# Tester ideas and problems, 22 Nov 2026

Written by Daraja · tester pack for the Store Manager's morning list. First names only. No pay figures and no contact details.

## The short version

**Nothing has come in from the Kenyan testers since 20 Nov 04:19 UTC.** No failed step, no idea, no "confusing" note, from either group.

Why, as far as I can see:
- The last real report in the Jerry HQ sheet is Shamsuddin's, on 20 Nov at 04:19 UTC. Frank's daily taps on 20 Nov (06:03 to 06:13 UTC, 13 apps) carried no notes.
- The Zuri log has nothing from a tester since Emmanuel's run on 19 Nov (script answers, all "ok").
- The extra testing days were only put to Emmanuel on the evening of 21 Nov. The message with the videos and links was sent that evening, and he has not given a start day yet. So the four testers have most likely not started. I cannot see WhatsApp, so I cannot say whether he has replied.
- The links themselves work: the testing board (https://jerrywins1.github.io/daraja-apps/testing/board/) and the Zuri script (https://jerrywins1.github.io/zuri-system/preview/testers/?script=areas) both open.

The board is ready for when they start. It will show each tester's apps and reports.

## What was filed since 20 Nov, by app

| app | what | who | kind |
| --- | --- | --- | --- |
| Zuri | nothing from testers | nobody | none |
| Clubhouse | Frank's one-sentence answer to the daily job: "Be courageous" | Frank | not a problem or idea, an answer |
| Quick Quote, Who's Coming, Fresh Friends (ff), Now Next, Story Keeper, Rafiki, Church Drive, Church, Our Table, Business Manager | app opens or daily taps only, no notes | Anonymous, Frank | none |

The "OPEN" rows from Anonymous are people opening an app, not testers reporting. Quick Quote (about 10 opens) and Who's Coming (about 4) are the busiest.

## The 21 automatic Zuri rows: they were mine

Twenty-one rows in the sheet and the Zuri log say "A file did not arrive: chart.umd.min.js", all Chrome 153, practice mode, 13:04 to 13:50 UTC on 21 Nov.

**They were this chat's own browser checks**, run while building and checking the new Zuri three-areas script and video. The container blocks the chart library's host, so Zuri reported it. It is not a real phone, and the chart is not failing for anyone.

I should have blocked the report while checking. I have fixed it so it cannot happen again: Zuri now skips these self-reports in a browser driven by a script, and a real phone still reports as before. Merged: https://github.com/JerryWins1/zuri-system/pull/64

The 21 rows are still in the log. I did not delete them: it is the testers' log, and deleting is Jerry's call. Count them as mine, not as a fault.

## Other problems I can see (not from testers)

- The nightly check on 20 and 21 Nov lists "Daraja Store: a file or link on this page is missing (404)". That belongs to the Store Manager's chat.
- The same check lists "Pit Wall: the browser logged an error while loading". That is the known cloud block on the F1 data host, so it is probably not a real fault. I have not checked it again.
- On 20 Nov it also listed the Testers' List with a 404. It was not on the 21 Nov list.

## Not tested yet, and ideas from me

These are mine, not testers'.

- **Zuri three areas: the database side is untested.** The screen now keeps Zuri A and B staff in their own area, but whether the database itself refuses an A login asking for B's rows has not been tested. I have no login to try it. A tester running the new script can only check what the screen shows. This is for Jerry's decision.
- **Anne and Baraka exist only in practice mode.** The new "Zuri A office" and "Zuri B office" people are pretend. Real Zuri A and B staff need an area set on their profile under Admin, People.
- **Overlap in the groups.** Frank and Faith Wangari are still on Veronicah's team in the Kenya pay pages, and Kara is still on Emmanuel's roster. Left alone on purpose, so pay does not move.
- **The video voice** is a stock voice, not Jerry's. It needs one listen on a phone.

## Nothing to relay to other chats

No tester has reported a bug or a confusing step in any app, so there is nothing to send to another app's chat from this file.
