# Findings

Things noticed in passing that belong somewhere more durable than a chat.
A chat dies with the computer it runs on; this file does not.

Each entry says when it was checked and how, so a later reader can tell a live
problem from a stale one. When you fix something, move it to **Settled** with
the date rather than deleting it — that stops the same thing being raised again
six weeks later.

---

## Open

### 1. "Ready to sell" collapsed from 16 apps to 2

*Checked 23 Nov 2026, against the nightly Ready to Sell board (updated 11:58 UTC).*

| | 1 Nov | 23 Nov |
| --- | --- | --- |
| ready | 16 | **2** |
| almost | 12 | 26 |
| needs work | 1 | 1 |

The only two passing are **Church Steward v1.11** and **NP Good Standing v1.11**.

Nothing got worse. The selling rule is *two or more testers passed **the current
version***, so shipping a new version of an app sets its pass count back to
zero until two testers run it again. Roughly 800 commits landed between those
two dates, so most apps are now on a version nobody has passed yet.

Worth deciding deliberately, because the two pull against each other: ship fast
and the board stays empty, or freeze versions to let passes accumulate. A third
option is to let a pass carry forward across a patch version and only reset on a
minor one — but that is a change to what "ready" means, so it is Jerry's call,
not a chat's.

### 2. The same tester counted twice

*Checked 23 Nov 2026, by comparing recorded device signatures.*

Two names are near-certainly one person each — same screen, same browser, same
pixel ratio, near-identical spelling:

- **Frank Ndungu** (28 apps) and **Frank Ndung'u** (22) — both `Android 10 · Chrome · 360x806@2`
- **Veronicah** (14) and **Veronicah Kimani** (11) — both `iPhone 18.7 · Safari · 428x926@3`

Three more pairs share a first name but use different devices, so they may be two
people or one person on two phones. Worth a human glance, not an assumption:
*FAITH WANGARI / Faith Wangari*, *Zipporah Martha / Zipporah*,
*Ruth / Ruth Waitherero Kiarie*.

Also **ZZ Test** is counted as a tester, with 11 apps and three devices.

This matters beyond tidiness: a split identity splits pass credit, so an app can
sit at "one tester passed" when the same person passed it twice under two
spellings — which feeds straight into finding 1.

### 3. Daraja Compass asks four questions and never uses the answers

*Checked 23 Nov 2026, in the shipped app (`Apps (installable site)/compass/`).*

Fifteen questions are asked. Four are stored and then referenced nowhere — not in
the five-year portrait, not in the goals, not in the monthly check-in:

- where you are from
- what the people who love you say you are good at
- what work makes you lose track of time
- what most often stops you

The last one's prompt reads *"name it and it shrinks."* Nothing shrinks it.

These are the most personal questions in the app, which makes asking them and
doing nothing worse than not asking. Either use them or drop them.

---

## Settled

Kept so they are not raised again.

### Testing rested on five people — resolved by 23 Nov 2026

On 1 Nov, five testers had each covered 28 of 29 apps while six others had
covered one to three. That was a single point of failure. It is gone: there are
now 30 tester records and seventeen people have covered 18 or more apps.

### "Works on a cheap small phone" was barely tested — resolved by 23 Nov 2026

On 1 Nov only three of eighteen recorded devices were genuinely small screens,
while that claim is central to Compass. There are now 26 small-screen device
records (≤430px wide) across roughly eighteen people, including several at
360×806 and 360×760.

### Compass pointed at a Claude-login-only calculator — found already fixed 23 Nov 2026

The Break-Even link in an earlier draft of Compass pointed at a `claude.ai`
artifact, which a Kenyan user with no Claude account could not open. The shipped
app now uses a relative path (`../breakeven/index.html`), open to anyone.

---

## Notes for whoever reads this next

- **Daraja Launchpad is not in this repository.** It exists only as an artifact
  and is not on the store, so problems found in it are not live product problems.
  Two were noted on 2 Nov in case it is ever shipped: its Kiswahili toggle
  translates only the seven door names and the buttons, leaving every question
  and the whole business kit in English; and the Daraja shelf terms
  ("they collect, pay you monthly, keep 20% digital / 10% physical") sit as the
  tenth item of a tick-list, which is a thin place for a commercial commitment
  that young people take to lenders.

- **`control/focus.json` has not moved since 2 Nov 2026** (v2.5, 12 of 53 done)
  while roughly 800 commits landed on main. The file that tracks what gets built
  keeps running; the one that tracks where Jerry is going stops. It is worth a
  look whenever the two disagree this far.
