# Testing groups

Set by Jerry, 4 November 2026, app by app. This file is the record, so the order
does not live only inside a chat.

Every app with a tester script is here. Four were pulled out of the rounds
altogether; the rest are in Group 1, 2 or 3.

**Live now: Groups 1 and 2 together — 20 apps.** Jerry chose on 4 November to run
both at once rather than wait for Group 1 to close, so `TEST_NOW` in
`shop/apps_data.js` holds all twenty. Group 1 still leads the list. Group 3 is
held back. The pay gate still reads per group, so Group 1 can close and pay out
while Group 2 is still running.

## Group 1 — first (9 apps)

| App | Script | Why it is here |
| --- | --- | --- |
| Advent Together | `advent` | The 24 doors unlock 1 December. Hardest deadline on the list. |
| Business Manager | `bizmgr` | 25-minute test, and still short of passes. Carries the Business membership. |
| Daraja | `home` | The front door. A fault here hides every app behind it. |
| Duka · Electronics Shop | `duka` | 30-minute test, and the one app the Kenyan squad can judge better than anyone. |
| Every Day | `everyday` | |
| Next Step Board | `nextstep` | Test copy turned on 4 Nov, so testers stop working in their real data. |
| One Thing | `nownext` | |
| The Church App | `church` | Script points at Immanuel's real live app, not a test copy. |
| Who's Coming | `whoscoming` | |

## Group 2 — second (11 apps)

| App | Script | Why it is here |
| --- | --- | --- |
| Ahead of It | `ahead` | Undo window went 12s → 45s on 4 Nov. Needs a re-test. |
| Ahead of It · Church | `churchsteward` | |
| Ahead of It · Nonprofit | `npgoodstanding` | |
| Daraja Compass | `compass` | |
| Message Assistant | `drumbeat` | Ships inside the Business membership. |
| My Safety Plan | `safety` | |
| Porchlight | `porchlight` | Script tips added 4 Nov for the two steps testers kept failing. |
| Rafiki | `rafiki` | Fredrick's Android voice fault, fixed 4 Nov. Needs an Android tester to confirm. |
| Receipt Maker | `npreceipts` | In-kind gift label reworded 4 Nov. Needs a re-test. |
| Serve Board | `churchserve` | |
| The Clubhouse | `churchclubhouse` | |

## Group 3 — last (7 apps)

| App | Script | Why it is here |
| --- | --- | --- |
| Break-Even | `breakeven` | |
| Daraja Academy | `academy` | |
| In My Own Words | `storykeeper` | Relation can now be corrected after adding someone. Fixed 4 Nov. |
| Our Table | `ourtable` | The app used in the how-to-test video, so testers already know it. |
| Shoebox Counter | `churchdrive` | OCC collection week is mid-November. |
| The Key | `thekey` | Script expected `1 of 5 · 20%` where the app correctly shows `2 of 5 · 40%`. Fixed 4 Nov. |
| The Key · Church Edition | `churchkey` | |

## Not in the rounds (4 apps)

| App | Script | Why it is out |
| --- | --- | --- |
| Feedback Studio | `feedback` | The squad's own reporting tool — testers use it every day, so faults surface on their own. It is still a $12 product and ships with the Business membership. |
| GameDay | `churchgameday` | Read-only page. |
| My Scores | `ff` | |
| Pit Wall | `pitwall` | |

## What this does not change

The pay rule is unchanged — 250 KES per completed app-test, see `kenya/pay.md`.
A round still ends when every app in it has 2 or more passes on its current
version, or 7 days, whichever comes first. That gate now applies per group, so
Group 1 can finish and be paid while Group 2 is still running.
