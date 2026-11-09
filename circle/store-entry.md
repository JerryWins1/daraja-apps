# My Circle — the store entry, ready to paste

Written 8 November 2026 by the **Daraja · My Circle** chat, which owns this app.

`shop/apps_data.js` belongs to the **house layer + store chat**, so this chat does not edit it.
Everything below is written to be lifted straight in, with nothing left to decide.

## What Jerry settled, 8 November

| | |
| --- | --- |
| **Price** | **$9 one-time.** No membership. It sits with FlipKit, the nearest household app. |
| **Shelf** | **🏠 Your household** (`cat:'home'`) — with Our Table, Who's Coming, One Thing, The Key. |

The dashboard row in `control/apps.json` stays under 🌿 Family, Legacy & Seniors, and that is
correct, not an oversight. The panel and the store use two different lists: `control/apps.json`
has no household group at all, and Our Table, Who's Coming, One Thing and The Key all sell on
🏠 Your household while sitting under 🌿 Family, Legacy & Seniors in the panel. My Circle now
matches its neighbours in both.

The price is **not spoken in any of the three videos**, on purpose. Every membership in the store
changed on 7 November and 39 lines had to be re-recorded because the narration said the old price
out loud. These scripts say what the app does and let the card carry the number.

## The card

- **name** My Circle
- **emoji** 👪
- **sub** what your AI knows about you
- **price** $9
- **try** `https://jerrywins1.github.io/daraja-apps/circle/?tour=1`

**tag —**

> Tell your apps about your people once, and they all remember. Then see the exact words an AI
> would read about you, in full, before a single one of them is sent. Why not just ChatGPT?
> ChatGPT forgets your family between questions, and never shows you what it was told. My Circle
> keeps them on your phone, and shows you the sentences.

Lead with the preview box wherever this app is described. It is the thing nothing else in the
catalogue does: it shows a person the exact text an AI would receive about them, *before* they
agree to it.

## Why `?tour=1`

Video rule 2 says the page has to be showable. My Circle opens completely empty, so a video about
"Exactly what your AI would read" would film a blank panel. `?tour=1` (added to `circle/index.html`
on 8 Nov, v1.3) seeds an **invented** example family in memory only:

- nothing is written to the phone, and the person's own My Circle is never read or changed
- Erase is turned off while the tour is on, so it cannot reach real data
- an amber card at the top says the family is made up
- the daily hello is suppressed, so nothing covers the screens the video is showing
- **Walt is marked private on purpose** — he is in the list and is *not* in the preview, which is
  the app's whole claim, demonstrated on screen rather than asserted

Sam, Ruth, Dana, Eli and Walt are invented. This repository is public; none of it is anyone's
real household.

## The entry

Paste into `shop/apps_data.js` on the household shelf, beside `flipkit`. Three tracks: overview,
train, firsttime. (The fourth track, `explain`, is built from `shop/kenya/circle.json` — that file
is a test script, so it belongs to the **Daraja · tester pack** chat, not to the store and not to
this chat.)

```js
 circle: {
  name:'My Circle', em:'👪', sub:'what your AI knows about you', cat:'home', price:'$9', testing:true, fresh:true, video:true,
  tag:'Tell your apps about your people once, and they all remember. Then see the exact words an AI would read about you, in full, before a single one of them is sent. Why not just ChatGPT? ChatGPT forgets your family between questions, and never shows you what it was told. My Circle keeps them on your phone, and shows you the sentences.',
  try:BASE+'circle/?tour=1',
  extra:{ firsttime:{title:"Explain it to me", sub:"About three minutes, for a first-timer: what it is for, who it helps, and what it will not do. Sound on.", lines:[
   {t:'Welcome. This video explains My Circle: what it is for, who it helps, and what it will not do.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#tourNote"},
   {t:'What you are looking at is an example family. Sam, his wife Ruth, his daughter Dana, his grandson Eli, and his friend Walt. None of them are real. They are here so you can see a filled-in page instead of an empty one.', point:"#tourNote"},
   'Now, the problem. An AI is useful when it knows your situation, and most of the time it knows nothing about you. So you explain your family at the start of every single question, or you get an answer meant for somebody else.',
   {t:'My Circle is where you say it once.', point:"#people"},
   {t:'Who you are, and the town you live in.', point:"#meName"},
   {t:'Your people. A name, how they are related to you, a birthday, and what they like.', point:"#people"},
   {t:'Your house. Who is in it, the dog, and the food nobody eats.', point:"#homeWho"},
   {t:'And your work, if you have one. That part is optional.', point:"#workName"},
   {t:'Who is it for? Anyone who asks an AI for help more than once a week, and anyone with a family big enough to lose track of. If you have grandchildren, it earns its keep in birthdays alone.', point:"#upcoming"},
   {t:'Now here is the part that matters most, and the reason this app exists. This box shows you the exact words an AI would read about you.', point:"#preview"},
   {t:'Not a description of what might be sent. The sentences themselves, in full, before any of them move.', point:"#preview"},
   {t:'You choose what is in them. Four switches: about me, my people, our home, my work. Turn one off and those words disappear from the box while you watch.', point:"#shWork"},
   {t:'And anyone you mark private never appears, with every switch turned on. Walt is marked private. Read those words and you will not find him.', point:"#preview"},
   {t:'What My Circle will not do: it will not send anything by itself. Everything is held on this phone, there is no account, and when an app wants to use it a tick box appears that says Include My Circle. Untick it and nothing goes.', point:".promise"},
   {t:'And if you ever want it gone, one button at the bottom erases it from this phone for good.', point:"#eraseBtn"},
   {t:'That is My Circle. Fill it in once, and every Daraja app you own stops asking who your family is.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#people"}
  ]} },
  lines:[
   {t:"This is My Circle, the app that tells all your other apps who your people are. You fill it in once.", js:"try{window.scrollTo(0,0);}catch(e){}", point:".promise"},
   "Here is the problem it solves. Every time you ask an AI for help with a gift, or a meal, or what to write in a card for your daughter, you start by explaining your family all over again. It never remembers.",
   {t:"My Circle remembers. Your people go in once, on your own phone, with their birthdays and what they like.", point:"#people"},
   {t:"Your town goes in, so an answer fits where you actually live.", point:"#meTown"},
   {t:"So does the house. Who is in it, the dog, and what nobody eats. Those are the things that change an answer.", point:"#homeFood"},
   {t:"And now the part no other app in this store does. This box shows you the exact words an AI would read about you.", point:"#preview"},
   {t:"Not a summary of what might be sent. The sentences themselves, before you send anything at all.", point:"#preview"},
   {t:"You decide what goes in them with these four switches. And anyone you mark private never appears in those words, however the switches are set.", point:"#shPeople"},
   {t:"Nothing leaves this phone on its own. When an app wants to use it you get a tick box, and if you untick it, nothing goes.", point:".promise"},
   {t:"Fill it in once, and every Daraja app you own knows your family. Start with the person you talk to most.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#people"}
  ],
  train:[
   {t:"Let us fill in your My Circle. About four minutes, and you only ever do this once.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#meName"},
   {t:"Step one: your first name, and the town you live in. The town is enough. An AI only wants it so an answer fits where you are.", point:"#meTown"},
   {t:"Step two: a line or two about you. What you did, what you like. Write it the way you would say it out loud.", point:"#meAbout"},
   {t:"Step three: tap Add, and put in the person you talk to most. Their name, how they are related to you, and their birthday.", point:"#people"},
   {t:"The birthday is the part that earns its keep. Every app can then remind you it is coming, and suggest a gift, without you looking anything up.", point:"#upcoming"},
   {t:"If somebody should never be mentioned to an AI, tick private when you add them. They stay in your list and they stay out of every answer.", point:"#people"},
   {t:"Step four: the house. Who lives here, the pets, and the food you avoid. That last one is why a meal suggestion comes back right the first time.", point:"#homeFood"},
   {t:"Step five, and this is the one to actually stop and read. This box is exactly what an AI would be told about you. Read it properly once.", point:"#preview"},
   {t:"If any of it is more than you want to share, turn that section off here, and watch the words change in front of you.", point:"#shHome"},
   {t:"That is the whole job, and it is done for good. Every Daraja app reads it from here.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#people"}
  ]},
```

## After it lands

1. `python3 shop/voicemaker.py --all` records the three new tracks into `shop/voice/`.
   **Coordinate first** — the store chat was re-recording 39 lines on the night of 7–8 November
   for the membership removal, and the recorder should not be run twice over the same work.
2. `python3 shop/voicemaker.py --check` should still report everything current, with
   `circle-overview`, `circle-train` and `circle-firsttime` added.
3. `node shop/checkvideos.js circle` — watches them the way Jerry watches them. Every `point`
   above is a real, visible element on `circle/?tour=1`; this is what proves it.
4. Tester coverage, including the `explain` track and `shop/kenya/circle.json`, is the
   **Daraja · tester pack** chat's — https://claude.ai/code/session_01EPPiddho9jmdtB6N6bkQbf
