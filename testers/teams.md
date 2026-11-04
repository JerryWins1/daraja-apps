# The teams

Built 4 November 2026 for the next round. Five teams, one per shelf, Emmanuel Koki leading
across all of them.

Pay is settled and out of scope here — Jerry paid the October round himself and has not
decided whether the next one is paid at all. Nothing in this file assumes it is.

## Why the teams are built this way

Not by what anyone seems to prefer. Every heavy tester came back with the *same* spread —
church 9, home 6, later 5, work 5, free 3 — because October handed apps out on a fixed
rotation, so coverage measures the rotation, not the person. Using it to guess a specialism
would have been inventing a signal.

What the data does say:

- **Volume**, and it falls off a cliff. Four people covered 25–28 apps, five covered 13–17,
  and then it drops straight to 5, 1 and 0. Eleven of the 27 have tested one app or none.
- **Who finds faults.** Fredrick Nganga found five, Brian Maina Kamau one. Nobody else found
  any that were ever confirmed.

So each team gets one anchor from the top of that list, the people who found faults are put
where their own fix needs confirming, and the untested are grouped on the shortest apps.

## ⛪ Church — 6 apps

Advent Together · The Church App · Ahead of It · Church · Receipt Maker · Serve Board · The Clubhouse

| Tester | |
| --- | --- |
| **Faith Wangari** | anchor — 28 apps in October |
| Brian Maina Kamau | found the Receipt Maker fault; it is fixed and bumped, so he confirms it |
| Veronicah Kimani | |
| Jay Jeneson | the only tester who is actually at a church |
| Jane Njeri | |
| Zachariah | |
| Zachariah Nganga Maina | may be the same person as above — see kenya/roster.md |

Advent Together is the one with a deadline: its doors unlock 1 December.

## 🧰 Business — 5 apps

Business Manager · Duka · Next Step Board · Ahead of It · Nonprofit · Message Assistant

| Tester | |
| --- | --- |
| **Kevin Ngugi** | anchor — 28 apps, and the fastest at it |
| Erickben Maina | |
| Richard Gichiriri Wambui | already down to be messaged about Duka |
| Zipporah Martha | |
| Maurice Njeru | |

The two longest tests in the whole set are here — Duka at 30 minutes and Business Manager at
25 — and **neither has ever been tested by anyone**, because until 4 November their test
buttons were missing.

## 🏠 Household — 3 apps

One Thing · Who's Coming · Ahead of It

| Tester | |
| --- | --- |
| **Frank Ndung'u** | anchor — 28 apps |
| David Chege | |
| George Njau | |
| Milka Njeri | |

## 🌿 Later life — 3 apps

Every Day · Porchlight · Rafiki

| Tester | |
| --- | --- |
| **Fredrick Nganga** | anchor — found five of the six faults fixed this week |
| Ruth Waitherero Kiarie | 25 apps |
| John Coleman | |
| Faith Mwende | |

Rafiki is here, and it is the one that most needs this team: the Android voice fault Fredrick
found has only ever been tested against a stubbed browser, never a real Kenyan phone.

## 🎁 Free & the front door — 3 apps

Daraja (the front door) · Daraja Compass · My Safety Plan

| Tester | |
| --- | --- |
| **Nicholas Mureithi** | anchor |
| Kara Winslow | |
| George Wambui | |
| Mary Njeri | |
| Kelvin Kangethe | |
| Heidi Coan | |

This is where the people who have never tested anything start, because these are the shortest
apps — 10 to 15 minutes each. The front door matters more than its size suggests: every
customer lands on it, and **nobody has ever tested it.**

## How a team's round ends

Every app in the team's shelf with 2 or more passes on its current version, or 7 days,
whichever comes first — the same gate as before, now read per team instead of per group.

Six apps start the round needing passes: the front door and Duka (never tested), Receipt
Maker, and Rafiki, Ahead of It and In My Own Words, whose versions were bumped on 4 November
because their code changed.

## What switching the teams on takes

Nothing in this file is live yet. Each tester's link carries their shelf as
`?line=<church|business|household|later|free>`, which `testers/index.html` has handled since
4 November. Turning it on means sending each team their own link — and that is Jerry's hands
on the keyboard, because Claude cannot send WhatsApp.

Right now the Kenyan squad still has no line and sees all 20 apps, which was Jerry's call on
4 November: let them test everything once, then use the result to place them. These teams are
that placement, drawn a round early so it is ready rather than guessed at later.
