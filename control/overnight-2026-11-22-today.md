# Overnight, 22 Nov 2026 — Daraja Today (preview, v0.1)

Asked for by Jerry on 21 Nov ("find one really, really big thing… look ahead and give you
ideas of what is coming up in the weeks and months ahead"), chosen and relayed by
Daraja · Store Manager. Built by an overnight chat while he slept.

## Open it on your phone

**https://jerrywins1.github.io/daraja-apps/home/today/**

One screen that reads the Daraja apps on the phone and shows the whole day and what is
coming. It only reads. It never writes to any app (checked: every stored value was
byte-for-byte the same before and after the page ran).

## The one thing to know before judging it

**On an iPhone, an app added to the Home Screen keeps its own storage, apart from Safari
and apart from every other icon.** So Today sees everything only when the apps were
opened in the same place as Today itself: all in Safari, or all inside the one Daraja
icon. An app used from its own Home Screen icon will be missing from Today, and the page
cannot tell that it is missing. The house layer chat is working on the one-icon fix. Until
that lands, the fair test is: open the link above in Safari, then open two or three apps
from Safari too, add something, and come back. The page says this in a small line at the
bottom.

## What it shows

| section | what is in it |
| --- | --- |
| **Today** | the one thing from One Thing (and how many after it) · jobs today from Business Manager · dinner tonight from Our Table · habits left in Every Day · anything due today or overdue in Ahead of It · a late tax date · a birthday today |
| **This week** (next 7 days) | Ahead of It dates · Business Manager jobs, bills and tax dates · who has not answered in Who's Coming · birthdays from My Circle · things set for a later day in One Thing |
| **Coming up** (day 8 to 8 weeks) | the same sources, further out |
| **✨ What should I know?** | shows the exact words first, then sends only those to Daraja's own AI and asks for three sentences |

Every line opens the app it came from. An app with nothing in it shows nothing. With
nothing anywhere it says "Open an app and add something, and it will show up here" and
offers One Thing, Ahead of It and My Circle.

## Which apps it reads, and how carefully

Each reader copies the app's own rule, read out of that app's code, not guessed.

| app | storage read | rule copied from the app |
| --- | --- | --- |
| One Thing | `now_next_profiles_v1`, `now_next_v1_<profile>` | the first task not done; tasks stamped another day are NOT shown as today's (it says "left over from last time" instead) |
| Business Manager | `bizmgr_v1` | jobs by date; bills the app itself would flag under Worth knowing; tax to-dos, weekend moved to Monday. The example business is ignored |
| Our Table | `dj_ourtable_v1`, `dj_ourtable_plan` | this week's night for today; last week's plan is ignored |
| Every Day | `dj_everyday_v1` | due today and not ticked; a day off shows nothing; the six starter cards show nothing until one is ticked or one is added |
| Ahead of It | `aheadofit_v1` (or `ahead_v1` before the merged app is first opened) | days to the due date; example items ignored |
| Who's Coming | `dj_whoscoming_v1` | people in the group with no answer, open questions only |
| My Circle | `dj_circle_v1` | nobody marked private, and nobody at all if sharing people is off |

**Left out of v0.1:** Family Money Dashboard is not read at all (if it has a passcode the
page says so in a small line; without one it is simply not read yet). Also not read:
Business Manager's money owed, unbilled jobs and waiting estimates; One Thing's regulars
on future days; Our Table beyond tonight; Jar by Jar, Trip Tab, The Key, Advent Together
and every church app.

## What the AI button sends

Only the lines on the screen, and it shows them first. Three guards:

- Business Manager bills go **without their amount** ("Truck insurance is due Fri 4 Dec").
- Invoices, job totals, crew pay and the bank balance are never read by the page at all.
- Any long run of digits is replaced with "[number left out]", so an account number typed
  into a name cannot ride along.

Ahead of It amounts (a household bill's cost) do go, because they are on the screen and in
the words shown. That is Jerry's call to change.

If the door fails, the page says so and offers "Copy the words" for the person's own AI.
Cancel sends nothing.

## What was tested

In Chromium at phone width (390px), with the repo served locally.

- **Empty phone:** the friendly message and three suggestions; no button; storage empty.
- **Seeded by really using seven apps**, not by writing their keys: four dates in Ahead of
  It, three people in My Circle (one private), a new card and a tick in Every Day, two
  tasks and one later-dated task in One Thing, tonight's dinner in Our Table, a group of
  two with one answer in Who's Coming, and in Business Manager the set-up, two jobs, a
  monthly bill and a tax to-do. The only thing set by hand was the house's "seen the tour"
  flags, to get past the welcome screens.
- **Every line checked against what each app had stored:** 15 lines, all true. The private
  person did not appear. The date 120 days out did not appear. Every Day said 6 left and
  the app's own tile said 1/7.
- **Every link:** all 10 opened the right app, the two job links on the right job.
- **AI button, with the door mocked:** the words posted were identical to the words shown;
  the answer appeared; cancel posted nothing; a failed door gave the plain message.
- **Bad data:** rubbish in every key, wrong shapes, impossible dates and a name containing
  HTML. The page never broke and the HTML showed as plain text.
- **Edge cases:** Family Money locked line; One Thing list from another day; the example
  business; My Circle sharing off; last week's Our Table plan; starter habit cards only.

## What could not be tested from a cloud chat

- **The real AI door.** It cannot be reached from here, so the answer was a mock. Whether
  the Worker accepts a request from an app called `today`, and how good its three
  sentences are, is unknown until Jerry taps the button on his phone.
- **A real iPhone.** Safe-area spacing, dark mode on the device, and above all the
  storage point above.
- Business Manager's Kenya edition (KES amounts) is coded for but was not driven.

## To make it the front screen of the Daraja icon

1. **The one-icon fix first** (house layer chat). Today is only as good as what it can see.
2. **Jerry's words.** Every heading and line on it is a first draft and his to change.
3. **Put it in the icon.** Either make Today the first tab of `home/index.html`, or point
   the icon's `start_url` at it. That file belongs to the house layer chat, so it was not
   touched tonight.
4. **A switch per app**, so a person can leave an app out of Today.
5. **Family Money**, read only with the person's say-so, and never while locked.
6. **Tell the door about `today`** if the Worker keeps a list of apps.
7. **Then the store side:** a card in `control/apps.json` with an owning chat, a store
   card, a video, a test script. None of those exist yet; this is a preview.

No card was added to `control/apps.json` tonight: that file is the Store Manager's.
