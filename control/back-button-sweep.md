# Back-button sweep — 20 Nov 2026

Jerry: *"If you go one screen too far or something, you can't go back to the previous one."*
House v68 added `window.djBack`. This sweep wired it into the store apps that have no chat of
their own, plus the Store Manager's. Merged in #464 and #471.

## Got a ← Back chip
| app | version | where Back now works |
| --- | --- | --- |
| Jar by Jar | v1.2 | a jar → Spend / Move money in; over budget → Pick another jar |
| Serve Board | v1.12 | a slot → "is in" message; a slot → A new job |
| Next Step Board | v1.12 | Your minutes → back to the notes |
| Our Table | v1.21 | recipe → Edit / Cook; a night → Swap; Plan a meal → New recipe |
| Trip Tab | v0.2 | All my trips → Start a new trip |
| The Key | v1.17 | Pull facts from a policy → Check the facts |
| Every Day | v1.16 | card list → history → Change this card |
| Who's Coming | v1.20 | Send the summary → A link; Pick people → a different contacts file |
| Daraja Academy | v2.8 | had its own ‹ Back; three gaps filled (L2 and L4 games, the quiz) |

## Checked — nothing needed, don't re-check
| app | why |
| --- | --- |
| Shoebox Counter (church-drive) | each box opens from a list row and closes with its own Done; none leads to another |
| GameDay | one page, no screens |
| The Clubhouse | one page; last week's lesson opens on the same page |
| Advent Together | already steps ‹ Day / Day › |
| In My Own Words | already has ‹ Back, ‹ All chapters, ‹ Back to writing throughout |
| Keepsake Pro | one landing page; the sample is a real page, so the phone's Back works |
| Rafiki | one chat screen |
| The Key · Church Edition | one page of fold-open cards |
| My Safety Plan | three peer tabs, always visible |
| Break-Even Calculator | one screen |
| FlipKit | one scrolling page |
| Message Assistant | one scrolling page |

## Phone Back — fixed in the house, 20 Nov
House v70 (#481) makes the phone's own Back button and edge swipe step back through an app's own
screens too, for every app that calls `djBack.push`. No app change was needed. Checked in Jar by
Jar: two screens in, the phone's Back lands on the jar, then the chip and Close still work.
