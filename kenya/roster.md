# The tester roster

Set by Jerry, 4 November 2026, name by name. This file is the record, so who is
invited does not live only inside a chat.

No phone numbers or tokens are kept here. Those stay in the `people` sheet in
Jerry HQ, which is private. This file holds names, coverage and Jerry's decision.

## How the list was built

The `people` sheet held 100 rows, which is not 100 testers:

- **19 were not people** — `(Zuri BW)` placeholders, `Nightly check`, `Anonymous
  tester`, and Jerry's and the iPad's own test accounts.
- **13 names appeared two or three times.** The pattern is systematic: nearly
  every Kenya tester also has a row under the Zuri project with a different role
  and no phone, because the same people were recruited twice — once to test the
  apps, once for the call centre.
- **6 phone numbers appeared under two spellings of a name**: Frank Ndung'u /
  Frank Ndungu, Brian Maina / Brian Maina Kamau, Maurice Njeru / njeru maurice,
  Zachariah Maina / Zachariah Nganga maina, Nicholas Mureithi / Nico smith, and
  three rows for Jerry.

Merged, there are **45 real testers**. Coverage below is apps ever ticked
"I tried it" on the shared board during the 11–28 October round.

## In — 27 testers

**Emmanuel Koki manages the team.**

| Tester | Apps | Note |
| --- | --- | --- |
| Faith Wangari | 28 | Full coverage, 22.8 hours |
| Frank Ndung'u | 28 | Full coverage |
| Kevin Ngugi | 28 | Full coverage in 20.6 hours — the fastest |
| Ruth Waitherero Kiarie | 25 | |
| Brian Maina Kamau | 17 | His 12 failed One Thing steps all traced to the app not starting empty — the thing the test-copy notice now fixes |
| Fredrick Nganga | 15 | Found the Rafiki Android voice fault. Four of this week's fixes came from his reports |
| Veronicah Kimani | 14 | Also the Zuri call-centre tester |
| Erickben Maina | 13 | |
| Zachariah | 5 | May be the same person as Zachariah Nganga Maina |
| John Coleman | 4 | |
| David Chege | 2 | |
| Emmanuel Koki | 1 | **Team lead.** Most recently active of the whole group |
| George Njau | 1 | |
| Jane Njeri | 1 | |
| Maurice Njeru | 1 | One of only two testers who ever gave an email address |
| Milka Njeri | 1 | |
| Nicholas Mureithi | 1 | Also appeared as "Nico smith" |
| Zachariah Nganga Maina | 1 | May be the same person as Zachariah |
| Faith Mwende | 1 | |
| George Wambui | 0 | Never tested anything yet |
| Heidi Coan | 0 | US tester, sent a link on 7 October, never opened an app |
| Jay Jeneson | 0 | The only church tester. This round has six church apps |
| Kara Winslow | 0 | Against OCC collection week, 16–23 November, in Jerry's calendar |
| Mary Njeri | 0 | |
| Richard Gichiriri Wambui | 0 | Active on the Zuri side; down to be messaged about Duka |
| Zipporah Martha | 0 | |
| Kelvin Kangethe | 0 | Not the same person as Kevin Ngugi |

## Undecided — 8

Parked rather than refused. They can be added mid-round without anything else
changing.

Josphat Thuo (28 apps) · Nessy Mukami (21) · Thao Mita (21 apps in 5 hours —
the fastest coverage of anyone) · Francis Koikai (7) · Clinton Mburu (2) ·
Jackline Nkirote Muriithi (1) · Lemayian Siongoh (1) · Anthony Coleman (0)

## Not this round — 10

Shamsuddin Jamal Mukira (28 apps, 26.9 hours — the most hours of anyone; Jerry's
HQ notes mention an unresolved pay hold) · Cedric Omambia Onguso · George Saitoti ·
Hoo Cas · Sheila Atieno · Steve Kanyi · Brian · Diane Donaldson ·
Eunice Muriithi · Mary Achola

## Which apps each tester sees

Two separate settings, and they stack:

- **project** decides the invite link and which page a tester lands on —
  `kenya`, `daraja`, `church` or `zuri`.
- **line** decides which shelf of apps their list shows, from `?line=<name>` on
  their link. Church 6 apps, business 5, household 3, later life 3, free 3.

**Jerry's decision, 4 November: the Kenyan testers get no line.** They see all 20
apps of the live round, and the results decide which line each one is put on next
round. Everyone else gets their line now.

## There is still no score

The app awards coins — 1 a step, +5 per problem Jerry confirms, +10 for finishing
and sending — but **not one scored completion has ever reached the shared board**.
All 320 ticks are plain "I tried it" marks, because the October round ran on
Feedback Studio reports and the scripted path arrived afterwards. Coverage above
is the only available measure, so this roster is Jerry's judgement, not a ranking.

Two things worth fixing before the next round is tiered on merit:

1. The board's reward line was never set, so a tester opening a script reads
   *"A keep-forever code for the app you tested"* rather than the 250 KES in
   `kenya/pay.md`.
2. `kenya/leaderboard.json` still shows the week of 23–29 October, and its
   **Bug hunter** award is empty even though Fredrick Nganga's 23 October Rafiki
   report is exactly what it is for.
