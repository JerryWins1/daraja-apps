# The teams

Built 4 November 2026. **Two teams, two managers, and that is the whole of it.**

Jerry, 7 November 2026: *"we only have two. It's team one and team two, and it's run by
Veronicah and Emmanuel, and that's all."*

**Testing is permanent, not a round.** It runs in weekly cycles, Monday to Sunday, Kenya
time, starting Monday 9 November 2026. There is no round and no closing date. Pay is
settled — the rates are in `kenya/pay.md` and the managers' own page is
https://jerrywins1.github.io/daraja-apps/kenya/lead/

**The teams, the pay and the managers' page are owned by the Daraja · tester pack chat** —
https://claude.ai/code/session_01EPPiddho9jmdtB6N6bkQbf — and `kenya/lead/teams.json` is
the live copy the page reads. This file is the reasoning behind them; when the two
disagree, `teams.json` is right.

## Team 1 — Emmanuel Koki leads

| Tester | Apps in October | |
| --- | --- | --- |
| **Emmanuel Koki** | 1 | **lead** |
| Kevin Ngugi | 28 | proven — fastest full coverage of anyone |
| Brian Maina Kamau | 17 | proven — found the Receipt Maker fault |
| Fredrick Nganga | 15 | proven — found five of the six faults fixed on 4 Nov |
| Zipporah Martha | 14 | |
| Erickben Maina | 13 | |
| John Coleman | 4 | |
| David Chege | 2 | |
| Jane Njeri | 1 | |
| Milka Njeri | 1 | |
| Faith Mwende | 1 | |
| Heidi Coan | 0 | never tested |
| Kara Winslow | 0 | never tested |
| Richard Gichiriri Wambui | 0 | never tested — already down to be messaged about Duka |

14 people. 97 apps covered between them in October.

## Team 2 — Veronicah Kimani leads

| Tester | Apps in October | |
| --- | --- | --- |
| **Veronicah Kimani** | 14 | **lead** |
| Faith Wangari | 28 | proven — full coverage |
| Frank Ndung'u | 28 | proven — full coverage |
| Ruth Waitherero Kiarie | 25 | proven |
| Zachariah | 5 | |
| Zachariah Nganga Maina | 5 | may be the same person as above |
| George Njau | 1 | |
| Maurice Njeru | 1 | |
| Nicholas Mureithi | 1 | |
| George Wambui | 0 | never tested |
| Jay Jeneson | 0 | never tested — the only tester actually at a church |
| Mary Njeri | 0 | never tested |
| Kelvin Kangethe | 0 | never tested |

13 people, or 12 if the two Zachariahs turn out to be one man. 103 apps covered between them
in October.

## Why two teams, and why these two leads

An earlier draft of this file had five teams, one per shelf, each with an "anchor". That was
wrong, and worth saying so plainly: four of those five anchors were simply the highest-volume
testers with a label attached. **Nobody had asked them to lead, and a lead who does not know
they are a lead chases nobody.**

Emmanuel is the only person in the records with an actual leadership role. Veronicah is the
right second, on evidence rather than impression:

- she is one of only **three people across 1,242 reports** who ever had a problem confirmed
- the Zuri Test Desk's own notes call her the one who "knows Zuri best"
- she found a real search fault on 29 October
- she was active to 30 October, more recently than most of the squad

## Why the strong testers are split across both teams

Jerry's first idea was Team 1 as "the Kenyan testers we did the Zuri app on". Two things made
that worse than it sounds.

**"The Zuri team" means two different things in the records.** Seventeen of the 27 invited
have a Zuri row. The Test Desk only names four as the active squad — Veronicah, Kevin,
Fredrick and Brian. So the phrase picks out either 4 people or 17, depending which record
you read.

**And it would have handed Veronicah only the untested.** Eleven of the 27 have tested one
app or none. If Team 1 took the proven testers, Team 2 inherits all eleven, and a first-time
lead gets the weakest group — the arrangement most likely to fail, and it would have failed
on her.

So each lead has three proven testers and the rest split to keep the teams level: 97 apps
against 103, and 14 people against 13. Emmanuel keeps the three who already report to him,
which is a working relationship raw coverage does not measure.

## How a cycle ends

Sunday night, Kenya time, every week. Nothing has to be finished for a cycle to close —
each tester is paid for what they filed that week and the counts start again at zero on
Monday. The "2 passes or 7 days" round rule is gone, and with it the idea that one stuck
app holds up anyone's money.

Six apps have never had a pass on their current version: the Daraja front door and Duka
(never tested by anyone), Receipt Maker, and Rafiki, Ahead of It and In My Own Words,
whose versions were bumped on 4 November because their code changed.

Two of those sit with the people who found the faults: **Brian** is on Team 1 and found the
Receipt Maker fault; **Fredrick** is on Team 1 and found the Rafiki one, which has only ever
been tested against a stubbed browser and never a real Kenyan phone.

## What switching the teams on takes

**Live from 5 November 2026.** Jerry sent Emmanuel and Veronicah their messages that
morning, each naming their own team and the six apps that need passes first. Those
messages said nothing about pay, because pay was not settled until 7 November. Counting
for money starts Monday 9 November; nothing before that date is paid under these rates.

The `?line=` machinery exists — `testers/index.html` has handled every shelf since
4 November — but these are teams of people, not shelves, so the two leads divide the apps
between their own testers rather than each team being locked to one shelf. The Kenyan squad
still has no line and still sees all 20 apps, which was Jerry's call: let them test
everything once, then place them on what the results show.

Sending anything to the squad is always Jerry's hands on the keyboard, because Claude cannot
send WhatsApp.

## The clash this round ran into, found 5 November

**Thirty hours in, not one Daraja app had been tested.** The last Daraja report of any kind
was 28 October. All six apps that opened the round still sat at zero passes on their current
versions.

The cause is structural, not effort. **The five people who run these two teams are the Zuri
Business Week squad**: Emmanuel Koki leads both, and Veronicah Kimani, Kevin Ngugi, Fredrick
Nganga and Brian Maina Kamau are the squad he leads there. Zuri has a daily script, a morning
breakage check and an evening watch all chasing it. Daraja has nobody chasing it. On 5 November
Emmanuel, Fredrick and Brian filed 35 rows between them — every one of them Zuri.

Four of the six testers marked **proven** at the top of these teams are in that squad. The
exception is Veronicah's three: Faith Wangari, Frank Ndung'u and Ruth Waitherero Kiarie are
free of Zuri entirely, and between them have tested nearly everything. None of them had filed
anything either.

Jerry's call on 5 November was to leave it — Business Week looked close to finishing. It
finished, and on 7 November Jerry said so: *"The zuri business week group is completed. We
moved to two bigger groups led by Veronicah and Emmanuel."* The five people are no longer
split across two jobs, which is what the clash was. Counting for pay starts fresh on
Monday 9 November, so the ten silent days cost nobody anything.
