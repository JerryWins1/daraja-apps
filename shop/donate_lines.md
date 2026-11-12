# Donate mode — the spoken lines to swap

Written 12 Nov 2026, for review. **Nothing here is live.** The lines in `shop/apps_data.js`
are unchanged and stay right for today's store (PHASE `'testing'`).

## Why a file and not a second field in the player

An alternate field (`t_donate` beside `t`) was the other choice. It was not taken because a
recorded video plays its m4a only while every line's fingerprint matches its cue (see
`voicemaker.py --check`). The moment PHASE flipped, every video with a swapped line would drop
off its recording onto the browser voice, the one that stalls on the iPad, and voicemaker would
need a second track for each video to fix it. A file keeps today's videos exactly as they are,
lets Jerry read the words first (words a customer hears are his call), and makes the swap one
clean step on flip day.

## On flip day, in this order

1. Replace each **old** line below with its **new** line in `shop/apps_data.js` (same app, same
   video, same line number counted from 0).
2. Record each changed video **by name**, never with `--all`:
   `python3 shop/voicemaker.py <app> <mode>` (for example `nownext overview`).
3. `python3 shop/voicemaker.py --check`, then a real phone for the voice.

The new lines mention giving, so swap them only once `DONATE_LINK` is set. Without a link the
store shows no donate button, and the voice should not mention one either.

**Spelling for the voice:** the lines say "Loving Indeed". The charity's own name is Loving
InDeed; the plain spelling is there so the recorded voice says it as two ordinary words. The
written statement on the store keeps the real spelling.

## The lines

Every price the videos speak is below, and every "Any profit helps…" line that follows one.
**Jerry to decide:** while apps are free there is no profit, so the Kenya lines are dropped in the
new versions instead of reworded. If the Kenya promise still holds some other way, say how and
those lines can come back.

| app | video | # | old line | new line |
|---|---|---|---|---|
| advent | overview | 12 | Advent Together is seven dollars for a family, or forty-nine for a whole church. Try the Day 1 sample below. Any profit helps orphans and students in Kenya. | Advent Together is free, for every family and every church. Try the Day 1 sample below. If it helps you, you can give a suggested donation of seven dollars to Loving Indeed, a charity. It is optional. |
| advent | firsttime | 26 | Everything stays on this phone. There is no account, and nothing to sign up for. Advent Together is seven dollars for a family, or forty-nine for a whole church. | Everything stays on this phone. There is no account, and nothing to sign up for. Advent Together is free, and a donation is optional. |
| home | overview | 8 | Daraja is free and always will be. You only pay for an app you decide you want. | Daraja is free and always will be, and right now so is every app in it. |
| home | overview | 9 | And every app bought helps a student in Kenya stay in school. | If an app helps you, you can give a suggested donation to Loving Indeed, a charity. It is optional, and the app is yours either way. |
| home | firsttime | 11 | Daraja itself is free, and always will be. You only ever pay for an app you decide you want. | Daraja itself is free, and always will be. Right now every app in it is free too. |
| home | firsttime | 12 | And every app that somebody buys helps a student in Kenya stay in school. That is not a slogan bolted on the end — it is why the whole thing exists. | If an app helps you, you can give a suggested donation to Loving Indeed, a charity. It is optional, and nothing is locked if you do not. |
| nownext | overview | 13 | It is four dollars ninety-nine, once. No account, no ads, it works with no signal, and your list stays on your phone. Try the whole thing right now with the button below. | It is free. No account, no ads, it works with no signal, and your list stays on your phone. Get the whole thing right now with the button below. |
| nownext | firsttime | 26 | One Thing is four dollars ninety-nine, once. Any profit helps orphans and students in Kenya. | One Thing is free. If it helps you, you can give a suggested donation of four ninety-nine to Loving Indeed, a charity. It is optional. |
| ahead | overview | 10 | Nineteen dollars, once. No account, no cloud, no bank login, ever. Try it below — put three real dates of your own in and see how it feels. | It is free. No account, no cloud, no bank login, ever. Get it below — put three real dates of your own in and see how it feels. |
| ahead | firsttime | 23 | Ahead of It is nineteen dollars, once. Nothing renews. Any profit helps orphans and students in Kenya. | Ahead of It is free, and nothing renews. If it helps you, you can give a suggested donation of nineteen dollars to Loving Indeed, a charity. It is optional. |
| nextstep | overview | 7 | It is nine dollars, once. No account, and it works offline. | It is free. No account, and it works offline. |
| nextstep | firsttime | 25 | Next Step Board is nine dollars, once. | Next Step Board is free. A donation is optional. |
| thekey | firsttime | 22 | The Key is free, forever. Daraja's profits help students in Kenya stay in school. | The Key is free, forever. |
| academy | overview | 9 | Lesson one is free. The full course is nineteen dollars, and it's a beautiful gift for a parent or grandparent. | The whole course is free, all six lessons, and it's a beautiful gift for a parent or grandparent. |
| academy | firsttime | 26 | The price: lesson one is free, and the whole course is nineteen dollars. | The price: the whole course is free. A donation is optional. |
| drumbeat | overview | 8 | It is nineteen dollars, once. Try it below. | It is free. Get it below. |
| drumbeat | firsttime | 26 | Message Assistant is nineteen dollars, once. | Message Assistant is free. A donation is optional. |
| pitwall | overview | 13 | Nine dollars covers a league for a season, and you only pay for the seasons you play. Try it below, and tell us honestly whether your league would pay for it. | Pit Wall is free for your league. Try it below, and tell us honestly whether your league would use it. |
| pitwall | firsttime | 27 | Pit Wall costs nine dollars per season you play. Nothing renews by itself. | Pit Wall is free. Nothing renews. |
| churchhq | overview | 7 | It is twenty-nine dollars, once, for the church that would rather not phone anybody. Try it below. | It is free, for the church that would rather not phone anybody. Try it below. |
| church | overview | 7 | It is a hundred and forty-nine dollars for the first year, with the setting up done for you, then forty-nine a year to keep it current. Stop paying and it keeps working. The one you can try below is a demo church we invented, so look around as much as you like. | It is free, for every church. The one you can try below is a demo church we invented, so look around as much as you like. |
| church | firsttime | 26 | The Church App is a hundred and forty-nine dollars for the first year, set up for your church with your own name on it, then forty-nine a year to keep it current. Stop paying and it keeps working. Any profit helps orphans and students in Kenya. | The Church App is free, with your own church's name on it. If it helps your church, you can give a suggested donation to Loving Indeed, a charity. It is optional. |
| churchserve | overview | 11 | It is nineteen dollars, once, for every ministry team you have. Try it below. | It is free, for every ministry team you have. Get it below. |
| churchserve | firsttime | 22 | Serve Board is nineteen dollars, once. Any profit helps orphans and students in Kenya. | Serve Board is free. A donation is optional. |
| churchdrive | overview | 12 | It is nineteen dollars, once, for every drive you will ever run. Try it below. | It is free, for every drive you will ever run. Get it below. |
| churchdrive | firsttime | 23 | The Shoebox Counter is nineteen dollars, once. Any profit helps orphans and students in Kenya. | The Shoebox Counter is free. A donation is optional. |
| churchclubhouse | overview | 10 | It is twenty-nine dollars, once, and families sign up for nothing. Safer than social media, warmer than a flyer. Try it below. | It is free, and families sign up for nothing. Safer than social media, warmer than a flyer. Get it below. |
| churchclubhouse | firsttime | 23 | The Clubhouse is twenty-nine dollars, once. Families pay nothing and sign up for nothing. | The Clubhouse is free. Families pay nothing and sign up for nothing. |
| churchclubhouse | firsttime | 24 | And the round question mark button has text size, the tour, and help, any time. Profits help students in Kenya stay in school. | And the round question mark button has text size, the tour, and help, any time. |
| churchgameday | overview | 11 | It is twenty-nine dollars, once, for every season. Try it below. | It is free, for every season. Get it below. |
| churchgameday | firsttime | 22 | GameDay is twenty-nine dollars, once, for every season of your league. | GameDay is free, for every season of your league. |
| churchgameday | firsttime | 23 | And the round question mark button has text size, the tour, and help, any time. Profits help students in Kenya stay in school. | And the round question mark button has text size, the tour, and help, any time. |
| churchkey | overview | 11 | It is nineteen dollars, once, and the building stops depending on any one memory. Try it below. | It is free, and the building stops depending on any one memory. Get it below. |
| churchkey | firsttime | 22 | The Key, church edition is nineteen dollars, once. Any profit helps orphans and students in Kenya. | The Key, church edition is free. A donation is optional. |
| npreceipts | overview | 4 | It is nineteen dollars, once. Your treasurer will hug you. Try it below. | It is free. Your treasurer will hug you. Get it below. |
| npreceipts | firsttime | 24 | Receipt Maker is nineteen dollars, once. Any profit helps orphans and students in Kenya. | Receipt Maker is free. A donation is optional. |
| rafiki | overview | 9 | It is nineteen dollars, once, which is rather less than one afternoon of company usually costs. | It is free, which is rather less than one afternoon of company usually costs. |
| rafiki | firsttime | 25 | Rafiki is nineteen dollars, once. | Rafiki is free. A donation is optional. |
| porchlight | firsttime | 27 | Any profit helps orphans and students in Kenya. | *(remove the line — then the video has one line fewer; or keep: "On Guard is free.")* |

## Lines left alone, and why

- **"… is free" lines** (Every Day, Our Table, Who's Coming, Break-Even, My Safety Plan, In My
  Own Words, Compass, The Key, Box Counter, My Scores): still true in donate mode.
- **"every Daraja app helps a student in Kenya stay in school"** in Every Day overview 11, Our
  Table overview 11 and firsttime 29, Who's Coming overview 15 and firsttime 32: same question
  as above for Jerry. Not rewritten until he says whether the Kenya line still holds.
- **Tester videos** (`hello` overview 17, `tester` overview 14: "every app that gets good enough
  to sell…"): these belong to the tester pack chat, not the store.
- **Dollar figures inside an app's example** (Quick Quote's fifteen hundred and twenty-five
  dollars, Break-Even's candles, receipts at Home Depot): the example's money, not the app's price.
- **Shop/kenya explainers** (`?mode=explain`): none of them speaks a price.
- **No line says "membership" or "founding members"** any more; those 35 were rewritten on
  8 Nov 2026.
