/* Daraja Store — one shared catalog. v3.4 · 2026-11-06 (the Daraja HQ videos show the page instead of its password box — control/?tour=1; the video rules written out below instead of buried in this line)
   v3.3 · 2026-11-06 (every video recorded — 54 of them, incl. the 👋 Karibuni greeting for the testers; voicemaker --check says when one goes stale)
   v3.2 · 2026-11-06 (the three Daraja HQ videos are recorded now, not read aloud by the browser — shop/voicemaker.py)
   v3.1 · 2026-11-06 (the rules video gains rule five, every link every time)
   v3.0 · 2026-11-06 (Daraja HQ: three videos instead of one — the tour redone for the 📝 Jotter and 🎥 Make a video tabs and the eight chat folders, plus “How the apps get made” and “The rules we work by”)
   v2.9 · 2026-11-06 (Who’s Coming: a read-only link to the answers)
   v2.8 · 2026-11-06 (WhatsApp buttons: Business Manager, Our Table, Every Day, Message Assistant, Serve Board, Shoebox Counter)
   v2.7 · 2026-10-23 (Every Day / Our Table videos say Family membership, not “free”; American words in One Thing — trash, ads; voice re-recorded) · v2.6 · 2026-10-23 (narration speaks the yearly memberships instead of the old one-time prices — 20 apps; the shoebox app is called Shoebox Counter everywhere while Samaritan's Purse permission is pending; voice re-recorded) · v2.5 · 2026-10-21 (mem: the membership each app comes with, from the 10 Oct membership model — the video player and the new store show it instead of the old one-time price; price: kept for the old live store · showName: the name the video player shows, e.g. Shoebox Counter while the OCC-name permission is pending) · v2.4 · 2026-10-10 (every app gets its videos: 2-minute, Explain it to me (?mode=firsttime), step-by-step training — lines JSON-quoted) · v2.3 · 2026-10-07 (deep-check fixes: the videos show what they talk about — training raises the level for the tour only; tester send line is the HQ way; Academy on Later life; one emoji per app; Pit Wall price says nothing renews) · v2.2 · 2026-10-07 (The Church App video line made true: no claim of automatic YouTube sync) · v2.1 · 2026-10-02 (card words from the away-day audit: 8 weakest cards rewritten, honest prices, why-not-ChatGPT and no-ads lines) · v2.0 · 2026-09-07 (+ church shelf, Pit Wall, Message Assistant — every finished app is now on a shelf) · v1.6 · 2026-08-30 (+ success endings; scene-directed + pointing finger — the app changes screens with the story)
   To add an app to the store: add one entry here. The shelf card AND its
   2-minute video come from this data — nothing else to build. */
/* ══ HOW TO MAKE A PROPER VIDEO ══ written out 6 Nov 2026, because the rules were real but
   buried in the changelog above, as one clause inside a very long line, and so got broken again.
   Jerry: "If I have a screen up, I explain it, and then I have another explanation of the next
   screen. The next screen should come up, right? So it should page through."

   1. THE SCREEN FOLLOWS THE STORY. 30 Aug 2026: "the app changes screens with the story."
      7 Oct 2026: "the videos show what they talk about." A section that talks about a screen opens
      that screen, in the same line, with js. A line about one field points at that field. A video
      that holds one screen while the words move on is not finished, however true the words are.

   2. THE PAGE HAS TO BE SHOWABLE. If the real page asks for a password, or opens empty, the video
      shows a password box for three minutes. Give that page a way to open for a tour — Daraja HQ
      has ?tour=1 — and point `try` at it. Nothing private may appear in such a mode.

   3. RECORD IT. The browser's own voice stalls on the iPad; see shop/watch.html. Run
      `python3 shop/voicemaker.py --all`, from any chat, no Mac needed.

   4. CHECK IT AFTER EVERY WORDING CHANGE. `python3 shop/voicemaker.py --check`. Reword one line
      and the whole video silently drops back to the voice that stalls.

   5. TEST IT THE WAY HE WATCHES IT. Open shop/watch.html in a browser, with no key in storage,
      press play, and look at the iframe. Do not unhide anything, do not stub the data, do not test
      the lines on their own — all three of the HQ videos passed that way on 6 Nov while showing
      Jerry nothing but the password gate. If the test has not seen the screens change, it has not
      tested the video. */

/* ══ THE MASTER SWITCH ══ 'testing' = test-flight store (banner, TESTING badges, Get=Try free)
   'live'    = launched store (banner gone, badges gone, Get buttons use each app's buy link)
   Launch day = change this ONE word + tell Claude "we're live" (gates come off the apps). */
const PHASE = 'testing';

/* The catalogue's own version, in code rather than only in the comment at the top, so a page can
   show which copy of the store it is holding. Bump it with the header above, same string. */
const STORE_V = 'v3.4 · 2026-11-06';

/* ══ ON SALE, ONE APP AT A TIME ══ 3 Nov 2026. PHASE above is all-or-nothing: flipping it
   to 'live' puts prices on all 29 cards and strands every app without a buy link on
   "Coming soon". Naming an app here sells just that one — its card shows its real
   membership and its Get button goes to its buy link — while the rest of the store stays
   in test flight. Launching for real is still the one word above.
   To put an app on sale it needs BOTH its id here AND a buy: link on its entry. */
const LIVE = [];

/* ══ WHAT WE ARE TESTING THIS ROUND ══ Jerry, 11 Sep: "the store needs only the apps we want
   to test — it gets confusing." While PHASE is 'testing', the store and Test Day show only
   these by default (the switch on the store turns the rest back on). Say "test these: …" */
/* 4 Nov 2026: Groups 1 and 2 of the three testing groups Jerry set app by app — see
   testers/groups.md. Jerry chose to run both at once rather than wait for Group 1 to
   close. Group 1's nine lead, Advent Together first because its 24 doors unlock
   1 December; Group 2's eleven follow. Group 3 is in that file, still held back.
   The pay gate in kenya/pay.md still reads per group, so Group 1 can close and pay
   out while Group 2 is still running. */
const TEST_NOW = [
  /* 6 Nov 2026: five apps got a WhatsApp button beside their text button today, so their
     test scripts gained steps and every pass recorded on the old version stopped counting.
     They lead the list so a tester working down it meets the new buttons straight away.
     Advent Together keeps its place ahead of them: Jerry put it first on 4 Nov because its
     24 doors unlock 1 December, the hardest deadline on the list, and that has not changed.
     NOTE the Testers' List hoists READY apps above this order, so One Thing actually shows
     first and Advent second — see renderApps() in testers/index.html.
     The Group 1 / Group 2 split still lives in testers/groups.md, which the pay gate reads;
     this array only sets the order the Testers' List shows. Shoebox Counter and Our Table
     changed today too and were in GROUP 3; Jerry moved them out the same afternoon, so
     this list is 22 apps, not 20. Group 3's remaining five stay held back. */
  'advent',
  /* 6 Nov, Jerry's call: Shoebox Counter comes OUT of Group 3 and straight to the top.
     Its own reason for being held back was that OCC collection week is mid-November --
     which is next week -- so the app with the nearest real-world date was the one app
     no tester could reach. Our Table comes out with it: it changed the same day and was
     already marked READY, which hoists it above this order anyway. */
  'churchdrive',
  /* changed 6 Nov */ 'businessmanager','whoscoming','everyday','drumbeat','churchserve','ourtable',
  /* Group 1, the rest */ 'home','duka','nownext','nextstep','church',
  /* Group 2, the rest */ 'ahead','churchsteward','npgoodstanding','compass','safety','porchlight','rafiki','npreceipts','churchclubhouse'
];
/* 6 Oct 2026, Jerry: “One Thing is ready to go… Our Table looks good, post it to the testers.” READY apps lead the store, the Testers' List and Founding Testers. */
const READY = ['nownext','ourtable'];

/* ══ THE DOOR'S SORT ══ Jerry, 18 Sep: the Daraja door (home/) and the 🌉 More-from-Daraja sheet
   group apps this way; the store shelves above stay as they are for selling. */
const DOOR = { pitwall:'fun', ff:'fun', everyday:'home', nourishdairy:'home', nourishpeanut:'home', academy:'later', compass:'free' };   /* compass: a young person's five-year plan, not a later-life tool (Jerry, 2 Oct) */
const DOOR_SHELF = { home:'Your household', later:'Later life & the people we love', church:'Your church', work:'Your business or nonprofit', free:'Free, and for good', fun:'Just for fun' };

const BASE = 'https://jerrywins1.github.io/daraja-apps/';
const A = BASE + 'Apps%20(installable%20site)/';

const APPS = {
 hq: {
   "name": "Daraja HQ",
   "em": "🧭",
   "sub": "the one page that holds everything",
   "cat": "off",
   "off": "your own panel, not something sold in the store",
   "video": true,
   "tag": "Everything going on, and everyone in it — on one page",
   "try": BASE+'control/?tour=1',   /* the video must SHOW the page, not the password gate — see ?tour=1 in control/index.html */
   "extra": {
     "firsttime": {
       "title": "Explain it to me",
       "sub": "About three minutes: what each tab is for, and which one to open when. Sound on.",
       "lines": [
         {
           "t": "Hello Jerry. This is a short walk through Daraja HQ — the one page that holds everything, so you never have to remember where anything is.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('today');}catch(e){}"
         },
         {
           "t": "You do not need to remember its address. On the Mac it is the Daraja HQ app in your Dock, and on your phone it is one tap from Jerry’s List."
         },
         {
           "t": "Across the top is a row of tabs. Each one answers a different question. There are more than fit on a phone, so you can slide that row sideways with your finger.",
           "point": "#tabs",
           "js": "try{window.scrollTo(0,0);}catch(e){}"
         },
         {
           "t": "Start with Apps. This is the tab that tells you what is waiting on you.",
           "point": "#tabs button[data-t=\"apps\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}"
         },
         {
           "t": "Every app we have is listed here with the one chat that looks after it. The ones needing you come first, and each says in plain words what it is waiting for."
         },
         {
           "t": "Tap a chat’s name and that conversation opens. You never have to work out which chat to go back to."
         },
         {
           "t": "Next, Where.",
           "point": "#tabs button[data-t=\"where\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}"
         },
         {
           "t": "This is everything you own, in one list. Pages, apps, chats, and the things that only live on your Mac."
         },
         {
           "t": "At the top is Start here — the handful you open most. Jerry’s List, this page, Ready to Sell, and the Control Room, which tells you whether the robots are still running."
         },
         {
           "t": "Under that are your chats, now gathered into eight folders — one for each shelf of the store. The folder tells you which chat looks after which apps, and one app only ever has one chat, so two of them can never make the same change twice."
         },
         {
           "t": "And if you cannot find something, type part of its name in this box. It searches the whole page.",
           "point": "#whereQ"
         },
         {
           "t": "Now Videos.",
           "point": "#tabs button[data-t=\"videos\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('videos');}catch(e){}"
         },
         {
           "t": "All thirty-eight apps have at least one narrated video now, and every one of them is in this list."
         },
         {
           "t": "There are three kinds. Explain it to me tells you what an app is for. Watch it work drives the real app while it talks. And Train me stops and waits for you to do each step yourself."
         },
         {
           "t": "This is the tab to use when you have forgotten how something works. It is quicker than asking me, and it will not get tired of the question."
         },
         {
           "t": "Beside it is Make a video, which is new today. That one is for asking for a video rather than watching one.",
           "point": "#tabs button[data-t=\"makevid\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('makevid');}catch(e){}"
         },
         {
           "t": "It works out which apps are still missing which kind of video, every time you open it. Tap an app’s name and the exact words to ask for it are copied — then paste them into that app’s chat."
         },
         {
           "t": "Jerry’s List is a tab here too.",
           "point": "#tabs button[data-t=\"list\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('list');}catch(e){}"
         },
         {
           "t": "That is your to-do list, and this is now the only copy of it. It used to sit in your Claude sidebar as well, the two drifted apart, and we retired that one. This is the list."
         },
         {
           "t": "And next to it, Jotter — also new today.",
           "point": "#tabs button[data-t=\"jot\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('jot');}catch(e){}"
         },
         {
           "t": "This is for the stray thought. Something you want to ask about, or check out, but not this minute. Type it in, tap Jot it down, and it is kept for you — on the phone and on the Mac both, not just on the one you typed it on.",
           "point": "#jotWhat"
         },
         {
           "t": "Nothing happens to a note until you ask. I can read them, but a note there is a reminder for you, not an instruction to me."
         },
         {
           "t": "Chats shows the conversations that are going on, and Today shows what has happened lately.",
           "point": "#tabs button[data-t=\"chats\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('chats');}catch(e){}"
         },
         {
           "t": "So: five questions, five tabs. What is waiting on me — Apps. Where is that thing — Where. How does this work — Videos. What should I do next — Jerry’s List. And what was that thought I had — Jotter.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}"
         },
         {
           "t": "There are two more videos about this page, and they are in the Videos tab under Daraja HQ. One is how the apps get made and looked after. The other goes through every rule we work by, so you know what is in there."
         },
         {
           "t": "If you ever feel lost, open Daraja HQ and start at Apps. Everything else is one tap from here. That is the whole page — there is nothing else to learn."
         }
       ]
     },
     "apps": {
       "title": "How the apps get made",
       "sub": "Under three minutes: one app, one chat — how a new app starts, who looks after it, and how you can tell where each one stands. Sound on.",
       "lines": [
         {
           "t": "This one is about the apps themselves. How a new one gets made, who looks after it afterwards, and how you can tell at a glance where each one stands.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}"
         },
         {
           "t": "Start with the rule the whole thing rests on. One app, one chat.",
           "point": "#tabs button[data-t=\"apps\"]"
         },
         {
           "t": "Every app has exactly one conversation that looks after it, and no conversation looks after two. That is not tidiness. Two chats working on one app is how the same change gets made twice, and that happened before the rule existed."
         },
         {
           "t": "This tab is the list of them. Every app we have, and for each one: what it is, which chat owns it, and what it is waiting for.",
           "point": "#appsFull"
         },
         {
           "t": "Every entry carries one of five words, and each word means exactly one thing."
         },
         {
           "t": "Needs means it is waiting on you — the line underneath is the question or the tap. Review means the work is finished and you can look at it when it suits you."
         },
         {
           "t": "Open means the work is still on my side, so there is nothing for you to do yet. Clear means nothing is waiting at all."
         },
         {
           "t": "And no chat means no conversation owns that app yet. Most of them sit there, and that is fine. An app gets a chat when it gets work, not before."
         },
         {
           "t": "Only the ones we are actually working on have a chat, and that number goes up as we go, not all at once."
         },
         {
           "t": "So, how a new app gets made. You ask — in any chat, or in a brand new one. That chat becomes the app’s chat, and it writes the app into this list straight away so you can see it.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}"
         },
         {
           "t": "From then on that one chat does everything to that app. If something turns up in it that belongs to a different app, it does not fix it. It tells you which chat owns that one, and leaves it alone.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}",
           "point": "#whereFull"
         },
         {
           "t": "And a chat writes its entry back here before it stops: the status, what it is waiting for, and today’s date. So this list stays current without you updating anything.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}",
           "point": "#appsFull"
         },
         {
           "t": "There are two deliberate exceptions. The house layer that every app shares, and the store catalogue, run across all the apps — so they have their own entry and their own chat. They are the exception, not permission to widen.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}"
         },
         {
           "t": "Now, what happens after an app is built. It goes to the Kenyan testers before it goes into the store.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('scripts');}catch(e){}"
         },
         {
           "t": "An app counts as ready when two different people have passed it on its current version. Two of them, on the current one — that second part is the part that surprises people."
         },
         {
           "t": "Because the moment an app’s code changes, its version goes up, and the old passes stop counting. The app drops off Ready to Sell and goes back to the testers.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('scripts');}catch(e){}"
         },
         {
           "t": "That is on purpose. A pass is a pass of the version they actually held in their hand."
         },
         {
           "t": "It also means fixing six faults in one afternoon can make the Ready to Sell list get shorter. Nothing broke. The passes just went stale, and five apps went back to the queue.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('scripts');}catch(e){}"
         },
         {
           "t": "So if you want a new app, or a change to one you have, ask in that app’s chat. This tab tells you which chat that is.",
           "point": "#tabs button[data-t=\"apps\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}"
         },
         {
           "t": "And if you do not know which chat, ask in any of them. The worst that happens is it tells you where to go."
         },
         {
           "t": "That is the whole arrangement. One app, one chat, written down here so neither of us has to hold it in our head."
         }
       ]
     },
     "rules": {
       "title": "The rules we work by",
       "sub": "About five minutes: every rule in the system, and why each one is there. Sound on.",
       "lines": [
         {
           "t": "This one is a list of the rules. They are all written down in the system already, and every chat reads them before it starts. This is just me reading them to you, so you know what is in there.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('today');}catch(e){}"
         },
         {
           "t": "There are four groups. How I talk to you. How the chats stay out of each other’s way. What is never allowed. And what I simply cannot do."
         },
         {
           "t": "First, how I talk to you. There are five of these. You had to say the first four three times before they stuck, which is why they now sit at the very top of the file instead of further down.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('chats');}catch(e){}"
         },
         {
           "t": "One. Answer what you asked, then stop. Not the question behind it, not the next question, not what you might ask next. If you say go ahead, the whole correct reply is to go ahead.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('chats');}catch(e){}"
         },
         {
           "t": "Two. Add nothing you did not ask for. No table, no cost breakdown, no summary of where things stand. If a second table is being written, the rule is already broken."
         },
         {
           "t": "Three. Every question comes with tappable options and a recommendation, one question at a time. Never an open question buried in a message, and never two questions stacked in one reply.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('chats');}catch(e){}"
         },
         {
           "t": "Four. Say what was done, not how it was done. The reasoning goes into the commit and the pull request, where you can go and read it if you ever want it."
         },
         {
           "t": "Five, and this one is from today. Every link, every time. If a reply names a page, a chat, a pull request or a board, the whole link goes in that same reply. Never “open the Test Desk” with no link — you are on a phone, and going hunting for it is the one thing these rules exist to stop.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}",
           "point": "#whereQ"
         },
         {
           "t": "And one more about steps. One step at a time, never a list of five. Everything the step needs goes inside the step — the exact words to paste, the whole address, the real name of the button. Each one tells you how far along you are. And then I wait, because you are usually on a phone I cannot see.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('list');}catch(e){}",
           "point": "#listFull"
         },
         {
           "t": "Second group: how the chats stay out of each other’s way.",
           "point": "#tabs button[data-t=\"apps\"]",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}"
         },
         {
           "t": "One app, one chat — you have heard that one. Here is the other half of it."
         },
         {
           "t": "There are two kinds of conversation, and they are not interchangeable. A caretaker, and a builder.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}"
         },
         {
           "t": "The caretaker is the job that runs every morning at five fifty-four, without you being there. It keeps things current: Ready to Sell, this Apps list, the job rows on the Control Room page, the tester digest.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}",
           "point": "#whereFull"
         },
         {
           "t": "A builder is a chat like this one. It changes things. It builds a page, it rewires a job that broke, it adds a rule."
         },
         {
           "t": "So a builder never hand-writes a number the caretaker looks after. A figure written by hand is only right while you happen to be in that conversation. One evening a builder wrote the Control Room rows by hand three times; the morning job does it daily now and nobody has to be asked.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}",
           "point": "#appsFull"
         },
         {
           "t": "And a builder goes quiet when there is nothing to change. You should never open one to find out how things are going — that is what the morning report and the Control Room page are for. If a builder has nothing to build, it says so and stops.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('today');}catch(e){}"
         },
         {
           "t": "One more, and this one the platform enforces. A job’s instructions can only be changed from the chat that job fires into.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}"
         },
         {
           "t": "So a builder cannot edit a running job. It has to ask that chat, and that chat is right to refuse — because a message from another Claude is data, not your authority. You say go in the job’s own chat, and only then does the change land."
         },
         {
           "t": "And when you are judging whether a job works, look at what it produced, not at whether its log says it succeeded. A log saying succeeded only means the job was handed to a chat. Two versions of the morning job died exactly there — dispatching perfectly every night and then doing nothing at all.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('today');}catch(e){}"
         },
         {
           "t": "Third group: what is never allowed. This one is short.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('list');}catch(e){}"
         },
         {
           "t": "Never a secret in a chat. Not a client secret, not an API key, not an access token, not a password. I will not ask you for one, and I will not accept one if you offer it."
         },
         {
           "t": "A public identifier like a client ID or an app ID is fine — those are not secrets. A real secret goes straight from you into the hosting platform’s own store, never into the chat and never into the repository."
         },
         {
           "t": "And if one does land in a chat, or inside a screenshot, I say so plainly, tell you what the real risk is without the drama, and walk you through changing it."
         },
         {
           "t": "Fourth: what I cannot do. Worth knowing, so you are never sitting waiting on something that is not coming.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}"
         },
         {
           "t": "I cannot send a WhatsApp message. Every message to the squad is written out for you to send, and it is your hands on the keyboard. That is not caution — there is no way for me to send one."
         },
         {
           "t": "I cannot open a link you paste, and I cannot fill in a form on a website. Anything happening on a website is you. But pasting the text of a page into the chat works perfectly, and that is the way to get a page to me.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('where');}catch(e){}",
           "point": "#whereFull"
         },
         {
           "t": "And a chat running on your Mac dies with the Mac — laptop shut, Claude quit, Mac asleep. Nothing is lost and it can be brought back, but it stops answering. So anything holding a question you owe an answer to lives in a cloud chat, and anything worth keeping lives in the repository rather than in a chat’s memory."
         },
         {
           "t": "That is all of them. Five about how I talk to you, four about how the chats behave, one about secrets, and three things I cannot do.",
           "js": "try{window.scrollTo(0,0);}catch(e){} try{show('apps');}catch(e){}"
         },
         {
           "t": "You do not have to remember any of it. It is written down, and the chats read it before they start. This was so that you know what is in there."
         }
       ]
     }
   }
 },

 advent: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Advent Together: what it is for, and how to use it.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
    {"t": "First, one word. Advent means the four weeks before Christmas, when Christians get ready to celebrate the birth of Jesus.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} "},
    {"t": "Many families want to pray and read the Bible together in Advent. But December is busy, and a good plan is forgotten after three days.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} "},
    {"t": "Advent Together makes it simple. Every day from the first of December to the twenty-fourth, it gives a family one short Bible reading, one prayer, and one small thing to do together.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} "},
    {"t": "It is for families, grandparents with grandchildren, and whole churches reading the same door on the same day.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} "},
    {"t": "Everything is on one long page. You just scroll down.", "point": "header", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
    {"t": "The first time you open it, a welcome card explains the app. Tap Let's begin and it goes away.", "point": "#first", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{var f=document.getElementById('first');if(f&&!db.first)f.style.display='';}catch(e){} window.scrollTo(0,0);"},
    {"t": "At the top is the big card. Before December, it counts the days until Advent begins.", "point": "#hero", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
    {"t": "Before December, tap Try the Day 1 sample to see what a day looks like. From the first of December, this card shows today's door.", "point": "#hero button"},
    {"t": "Next is the Advent wreath. One more candle is lit each Sunday: Hope, Peace, Joy and Love, and the white Christ candle on Christmas Eve. The app lights them by itself.", "point": "#wreath", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('wreath').scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "Then the twenty-four doors, one for each day before Christmas. A lock means the door is not open yet. It opens on its own day.", "point": "#doors", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('doors').scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "Tap a locked door, and a note tells you when it opens. The Today button jumps to today's door, or before December, to the Day 1 sample.", "point": "#todayBtn"},
    {"t": "After door twenty-four comes a Christmas Day page, which opens on December the twenty-fifth.", "point": "#doors .door.xmas"},
    {"t": "Inside a door, the top shows the day, the date, and a short title.", "point": "#dayTitle", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{openDay(1,'sample');}catch(e){}"},
    {"t": "Then the Bible verse, from the King James Bible. Then Think about it: a few plain words on what the verse means.", "point": "#dayIn .verse"},
    {"t": "For the little ones is a line for children. Pray together is a short prayer. Do this together today is one small, kind thing, like calling someone who lives alone.", "point": "#dayIn .blk.kids"},
    {"t": "When your family has done it, tap We did it. Your family gets a star for that day, and the app counts how many days in a row you have done.", "point": "#didBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('didBtn').scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "Stars only start on December the first, because each star belongs to its own day.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} "},
    {"t": "Read it aloud reads the whole day to the family. Share sends the day by text or email, to someone far away.", "point": "#speakBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('speakBtn').scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "Close a door with the X at the top.", "point": "#dayClose", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('dayClose').scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "Further down is Our family. Type the names of the people doing Advent with you, and their names appear on every day's reading.", "point": "#names", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('names').scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "Below the names are your stars out of twenty-four, and your days in a row.", "point": "#familyCard .tally"},
    {"t": "Then For churches. Tap Open the church kit, and a church leader types the church's name.", "point": "#churchBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('churchBtn').scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "The kit makes a one-page bulletin insert with all twenty-four readings, ready to print, and a Sunday announcement to copy. Nothing in the kit is sent anywhere.", "point": "#insertPreview", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{openChurch();}catch(e){}"},
    {"t": "At the bottom is Settings. Bigger type makes the words larger. Preview mode, for pastors and teachers, opens every door now so you can read ahead. Stars still only come on the real day.", "point": "#settings", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{var s=document.getElementById('settings');s.open=true;s.scrollIntoView({block:'center'});}catch(e){}"},
    {"t": "How to start: try the Day 1 sample, type your family's names, and if you lead a church, open the church kit. Then come back on the first of December.", "point": "#hero", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
    {"t": "Everything stays on this phone. There is no account, and nothing to sign up for. Advent Together comes with the Family membership, or the Church membership for a whole church.", "point": ".foot", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,99999);"},
    {"t": "And when you open the app itself, the question mark button in the bottom corner has the tour and help any time.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} "}]} },
  train:[
   {"t": "Getting Advent Together ready takes a few minutes, and you can do it any time before December.", "point": "#hero", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
   {"t": "Step one: tap Try the Day 1 sample at the top, to see what a day looks like. Close it with the X.", "point": "#hero button", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
   {"t": "Step two: scroll down to Our family. In the box Who's doing Advent together, type your names, like Grandma, Emma and Noah. They will show on every day's reading.", "point": "#names", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('names').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Step three, for a church: tap Open the church kit, and type your church's name. It goes on the insert and the announcement.", "point": "#churchName", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{openChurch();}catch(e){}"},
   {"t": "Step four: tap Print the insert, for one letter-size page with all twenty-four days.", "point": "#printBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('printBtn').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Then tap Copy the announcement. Read it from the front, or paste it into your newsletter or email. Close the kit with the X.", "point": "#copyAnn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('copyAnn').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Step five: at the bottom, open Settings. Turn on Bigger type if the words are small. Pastors and teachers can turn on Preview mode, to read every door ahead of time.", "point": "#settings", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{var s=document.getElementById('settings');s.open=true;s.scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Step six: from the first of December, open today's door each day. The Today button jumps straight to it.", "point": "#todayBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('doors').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Step seven: read it together, pray, do the one small thing, then tap We did it to earn that day's star. Stars can only be earned on the day itself.", "point": "#didBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{openDay(1,'sample');}catch(e){} try{document.getElementById('didBtn').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "You'll know you're ready when your family's names are under Our family, and the top card is counting down to Advent.", "point": "#familyCard .tally", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('familyCard').scrollIntoView({block:'center'});}catch(e){}"}],
  lines:[
   {"t": "This is Advent Together. Twenty-four days to Christmas, one door a day.", "point": "#hero", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
   {"t": "December rushes by. We mean to slow down and remember what Christmas is about, but there is shopping, baking and travel, and the days slip away.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} "},
   {"t": "Each door holds a short Bible reading, a few words to think about, a line for the little ones, a prayer, and one small thing to do together. About five minutes, around supper or bedtime.", "point": "#dayIn .verse", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{openDay(1,'sample');}catch(e){}"},
   {"t": "When you have done it, tap We did it, and your family gets a star for that day. The app counts your days in a row.", "point": "#didBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('didBtn').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Read it aloud reads the whole day to the family. Share sends it by text or email, to grandchildren far away.", "point": "#speakBtn", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{document.getElementById('speakBtn').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Before December, the top card counts down to Advent, and you can try the Day 1 sample. From the first of December, it opens today's door.", "point": "#hero", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"},
   {"t": "The Advent wreath lights its candles by itself, one more each Sunday: Hope, Peace, Joy and Love, and the Christ candle on Christmas Eve.", "point": "#wreath", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('wreath').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "The twenty-four doors each open on their own day. A lock means not yet. A star means your family did that day.", "point": "#doors", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('doors').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Type the names of who is doing Advent with you, and they appear on every day's reading.", "point": "#names", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{document.getElementById('names').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "For churches, the church kit prints a one-page bulletin insert with all twenty-four days, and gives you a Sunday announcement to read out.", "point": "#insertPreview", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{openChurch();}catch(e){}"},
   {"t": "Pastors and teachers can turn on Preview mode in Settings, to read every door ahead of time.", "point": "#settings", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} try{var s=document.getElementById('settings');s.open=true;s.scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Everything stays on this phone. No account, nothing to sign up for. The verses are from the King James Bible.", "point": ".foot", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,99999);"},
   {"t": "Advent Together comes with the Family membership, and a whole church gets it with the Church membership. Founding members get their first year free. Try the Day 1 sample below. Any profit helps orphans and students in Kenya.", "point": "#hero", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeDay();}catch(e){} try{document.getElementById('churchSheet').classList.remove('on');}catch(e){} try{document.getElementById('settings').open=false;}catch(e){} try{document.getElementById('first').style.display='none';}catch(e){} window.scrollTo(0,0);"}],
  name:'Advent Together', em:'🕯️', sub:'24 days to Christmas: one prayer, one reading, one small thing to do together', fresh:true, cat:'church', mem:'Family membership · churches: Church membership', price:'$7 a family · $49 a whole church', testing:true,
  tag:'24 days to Christmas: one prayer, one reading, one small thing to do together',
  try:BASE+'advent/', video:true
 },
 quickquote: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About three minutes, for a first-timer: what it is for, who it helps, and every screen. Sound on.", lines:[
    {t:"Welcome. This video explains Quick Quote: who it is for, and what it does.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"It is for one thing \u2014 getting a priced estimate in front of a customer before you leave their driveway.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"Quick Quote is the quotes-only edition of Business Manager. The same app underneath, with invoices, expenses and profit kept out of your way.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"Everything here is an example business, Miller Plumbing and Repair. Nothing is saved to your phone.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"Start with your price list. This is the heart of it \u2014 your work, at your prices.", js:"try{BM.tourShow('prices')}catch(e){}"},
    {t:"Now describe a job the way you would say it out loud: replace a fifty gallon water heater, take the old one away.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"The estimate is built from your list. Fifteen hundred and twenty-five dollars, itemised in words the customer understands.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"Your prices always win. Even when the app drafts the quote for you, it never invents a number of its own.", js:"try{BM.tourShow('prices')}catch(e){}"},
    {t:"Offer three choices \u2014 Good, Better and Best. The church restroom job shows all three. Given three options, people choose the middle one far more often than they choose nothing.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"Add photos to the quote, so there is no argument later about what the job was.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"The customer signs on your phone, standing in their own kitchen. That is the moment most jobs are won or lost.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"It works with no signal. In a basement, in a crawlspace, out on a site with one bar \u2014 the quote still goes out.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"And if you later want invoices, receipts and profit, turning on the full office keeps every quote, price and signature. Nothing is retyped. Go and try it \u2014 you cannot break the example.", js:"try{BM.tourShow('home')}catch(e){}"}
  ]} },
  name:'Quick Quote', em:'🧾', sub:'a priced estimate in a minute, from your own price list', fresh:true, cat:'work', mem:'Quotes-only membership', price:'$49 a year', testing:true,
  tag:'Describe the job, get a priced estimate from YOUR price list: three options, the customer signs on your phone, photos on the quote. Works with no signal. The quotes-only edition of Business Manager: move up any time and your quotes come with you.',
  try:BASE+'business-manager/?mode=quotes',
  train:[
   {t:'Quick Quote setup \u2014 about five minutes, and the quotes come fast afterwards.', js:"try{BM.tourShow('setup');}catch(e){}"},
   {t:'First your business: name, trade and phone. That is the header on every estimate you send.', js:"try{BM.tourShow('setup');}catch(e){}", point:"#su0"},
   {t:'Then the price list, which is the whole engine. Pick your trade for a starting set, then go through and change every price to yours.', js:"try{BM.tourShow('prices');}catch(e){}", point:"#plist"},
   {t:'Set your trip charge and your hourly labour rate, so the short awkward jobs price themselves properly instead of being guessed at.', js:"try{BM.tourShow('prices');}catch(e){}"},
   {t:'Add a deposit rule if you take one \u2014 a percentage or a flat amount, shown on the quote so it is agreed before you start.', js:"try{BM.tourShow('more');}catch(e){}"},
   {t:'Decide whether add-ons are included in a price or charged separately. Get this right once and every later quote is right.', js:"try{BM.tourShow('more');}catch(e){}"},
   {t:'That is setup. Quote your first job. If you ever want invoices, receipts and profit as well, turning on the full office keeps every quote you have written.', js:"try{BM.tourShow('home');}catch(e){}"}
  ],
  lines:[
   {t:'This is Quick Quote \u2014 a priced estimate in about a minute, from your own price list.', js:"try{BM.tourShow('home');}catch(e){}"},
   {t:'Everything here is an example business, Miller Plumbing and Repair. Nothing is saved to your phone.', js:"try{BM.tourShow('home');}catch(e){}", point:".stats"},
   {t:'Describe the job the way you would say it out loud: replace a fifty gallon water heater, take the old one away.', js:"try{BM.tourShow('job/j3');}catch(e){}", point:"#priceCard"},
   {t:'The estimate is built from YOUR price list \u2014 not a guess, and not somebody else\u2019s prices.', js:"try{BM.tourShow('prices');}catch(e){}", point:"#plist"},
   {t:'Fifteen hundred and twenty-five dollars, itemised in words the customer actually understands.', js:"try{BM.tourShow('job/j3');}catch(e){}", point:"table.lines"},
   {t:'Offer three choices \u2014 Good, Better and Best. People pick a middle option far more often than they pick nothing.', js:"try{BM.tourShow('job/j3');}catch(e){}", point:".tiers"},
   {t:'Add photos to the quote, so there is no argument later about what the job was.', js:"try{BM.tourShow('job/j3');}catch(e){}"},
   {t:'The customer signs on your phone, standing in their own kitchen.', js:"try{BM.tourShow('job/j3');}catch(e){}", point:".steps"},
   {t:'It works with no signal \u2014 a basement, a crawlspace, a site with one bar. The quote still goes out.', js:"try{BM.tourShow('home');}catch(e){}"},
   {t:'It is the quotes-only edition of Business Manager. Turn on the full office any time and every quote comes with you.', js:"try{BM.tourShow('more');}catch(e){}"}
  ]
 },
 businessmanager: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every screen. Sound on.", lines:[
    {t:"Welcome. This video explains Business Manager: who it is for, and what each screen does.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"It is built for a one-truck trade business. A plumber, an electrician, a painter, a landscaper \u2014 someone who does the work AND runs the office, usually at night.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"Everything you are about to see is an example business, Miller Plumbing and Repair. It is not real, and nothing here is saved to your phone.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"This is the home screen. It opens on today: a water heater at nine this morning, a kitchen faucet tomorrow afternoon.", js:"try{BM.tourShow('home')}catch(e){}"},
    {t:"Jobs is every piece of work you have on, from a first estimate through to paid and closed.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"A job holds what you agreed: the work, the line items and the price. Fifteen hundred and twenty-five dollars to replace a fifty gallon heater and take the old one away.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"For the church restrooms, Dan offered three choices \u2014 Good, Better and Best. Given three options, people choose the middle one far more often than they choose nothing at all.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"The customer signs on your phone, at their kitchen table. No printing, no posting, no waiting for a reply.", js:"try{BM.tourShow('jobs')}catch(e){}"},
    {t:"When the work is done, the quote becomes an invoice in one tap. You never retype a price.", js:"try{BM.tourShow('money')}catch(e){}"},
    {t:"Money is who owes you what. That drain cleaning invoice went out twenty days ago and is six days overdue \u2014 on the screen, not lost in a notebook in the van.", js:"try{BM.tourShow('money')}catch(e){}"},
    {t:"The invoice carries a pay link, so the money can arrive before you have packed up your tools.", js:"try{BM.tourShow('money')}catch(e){}"},
    {t:"Deposits work the same way. The bathroom remodel took thirty percent up front, so the materials were not coming out of your own pocket.", js:"try{BM.tourShow('money')}catch(e){}"},
    {t:"Receipts: photograph them as you buy. A thousand and twelve dollars at Home Depot, put against the water heater job.", js:"try{BM.tourShow('receipts')}catch(e){}"},
    {t:"Which gives you the number most trades never actually see \u2014 what each job made you, after the materials and the hours.", js:"try{BM.tourShow('receipts')}catch(e){}"},
    {t:"Customers keeps the history: what you did for them, what they paid, and when you were last there.", js:"try{BM.tourShow('custs')}catch(e){}"},
    {t:"Your price list is the engine. Describe a job in plain words and the estimate is built from your own numbers \u2014 never a guess, and never somebody else's prices.", js:"try{BM.tourShow('prices')}catch(e){}"},
    {t:"To-dos hold the dates that cost you money when they slip: the truck registration, the insurance renewal, the quarterly estimated taxes.", js:"try{BM.tourShow('todo')}catch(e){}"},
    {t:"It opens in your phone's browser. Nothing to install, no account to make, and what you type stays on your phone.", js:"try{BM.tourShow('home')}catch(e){}"},
   "New in November: every message to a customer can go by WhatsApp as well as by text or email. On the Kenya edition it opens that customer's own WhatsApp; elsewhere it asks you which chat.",
    {t:"If all you want is quotes, start in quotes-only mode and the rest stays out of your way until you ask for it. That is the whole app. Go and try it with this example business \u2014 you cannot break anything.", js:"try{BM.tourShow('home')}catch(e){}"}
  ]} },
  name:'Business Manager', em:'🧰', sub:'the office for a one-truck trade business', fresh:true, cat:'work', mem:'Business membership', price:'$149 a year', testing:true,
  tag:'Quotes your customer signs, invoices with a pay link, receipts split by job, your real profit, to-dos and tax dates. Includes Next Step Board, Message Assistant and Feedback Studio.',
  try:BASE+'business-manager/?mode=full',
  train:[
   {t:'Business Manager setup \u2014 about five minutes, and you only do it once.', js:"try{BM.tourShow('setup');}catch(e){}"},
   {t:'Start with the business itself: your name, your trade, your phone, and whether you are licensed and insured. That is what prints at the top of every quote and every invoice you send.', js:"try{BM.tourShow('setup');}catch(e){}", point:"#su0"},
   {t:'Then your price list. Choose your trade and it starts you off with the usual work at typical prices. Go through and make them yours \u2014 this is the part worth the five minutes.', js:"try{BM.tourShow('prices');}catch(e){}", point:"#plist"},
   {t:'The price list is the engine of the whole app. Describe a job in plain words and the estimate is built from these numbers. Even when the app drafts one for you, your prices always win.', js:"try{BM.tourShow('prices');}catch(e){}", point:"#plist"},
   {t:'Next, how you get paid: card, PayPal, Venmo, Cash App, Zelle or a cheque. Whatever you fill in is what shows on the invoice, so leave blank anything you do not use.', js:"try{BM.tourShow('more');}catch(e){}"},
   {t:'If you work with crew, add them with their hourly rate. Then hours logged against a job turn into real labour cost, and the profit figure tells the truth.', js:"try{BM.tourShow('more');}catch(e){}"},
   {t:'If you only want quotes, choose quotes-only mode. Invoices, expenses, profit, schedule, crew and to-dos stay hidden \u2014 hidden, never deleted. Turn them on any time and every quote and price comes with you.', js:"try{BM.tourShow('more');}catch(e){}"},
   {t:'That is setup done. Add your first customer, then your first job, and the app follows the work from there.', js:"try{BM.tourShow('home');}catch(e){}"}
  ],
  lines:[
   {t:'This is Business Manager \u2014 the office for a one-truck trade business, in the phone in your pocket.', js:"try{BM.tourShow('home');}catch(e){}"},
   'Everything here is an example business, Miller Plumbing and Repair. Nothing is saved to your phone.',
   {t:'The home screen opens on today. A water heater to replace at nine, a kitchen faucet tomorrow afternoon.', js:"try{BM.tourShow('home');}catch(e){}", point:".stats"},
   {t:'A job holds what you agreed: the work, the line items, the price. Fifteen hundred and twenty-five dollars, heater replaced and the old one taken away.', js:"try{BM.tourShow('job/j3');}catch(e){}", point:"table.lines"},
   {t:'For the church restrooms Dan offered three choices \u2014 Good, Better and Best. People pick a middle option far more often than they pick nothing.', js:"try{BM.tourShow('job/j3');}catch(e){}", point:".tiers"},
   {t:'The customer signs on your phone, right there at the kitchen table.', js:"try{BM.tourShow('job/j3');}catch(e){}", point:".steps"},
   {t:'When the work is done the quote becomes an invoice in one tap, with a pay link on it, so the money can arrive before you have packed the van.', js:"try{BM.tourShow('money');}catch(e){}"},
   {t:'Money shows who still owes you. That drain cleaning invoice is six days overdue, and it is on the screen instead of lost in a notebook.', js:"try{BM.tourShow('money');}catch(e){}", point:".btns"},
   {t:'Photograph receipts as you buy them. A thousand and twelve dollars at Home Depot, against the water heater job.', js:"try{BM.tourShow('expenses');}catch(e){}"},
   {t:'Which gives you the number most trades never see: what each job actually made, after materials and hours.', js:"try{BM.tourShow('pl');}catch(e){}"},
   {t:'To-dos carry the dates that cost you money if you miss them \u2014 truck registration, insurance renewal, the quarterly estimated taxes.', js:"try{BM.tourShow('todo');}catch(e){}"},
   {t:"New in November: the send row has a WhatsApp button next to Text it, and the invoice page your customer opens has one too — so they can send their M-Pesa code straight back.", js:"try{BM.tourShow('job/j3');}catch(e){}"},
   {t:'It opens in your phone browser. Nothing to install, no account, and what you type stays on your phone.', js:"try{BM.tourShow('home');}catch(e){}"}
  ]
 },
 hello: {
    "name": "Karibuni — hello from Daraja",
    "em": "👋",
    "sub": "a thank you to the testers",
    "cat": "off",
    "off": "a greeting for the Kenyan squad, not something sold in the store",
    "video": true,
    "tag": "Two minutes, nothing to do: what October's testing actually fixed, and who found it",
    "try": BASE+'testers/',
    "lines": [
      {
        "t": "Hello. This one is not a test, and there is nothing for you to do. It is two minutes, and it is a thank you.",
        "js": "try{window.scrollTo(0,0);}catch(e){} try{go('try');}catch(e){}"
      },
      {
        "t": "In October, twenty-seven of you tested these apps. Between you, you sent one thousand, two hundred and forty-two reports. That is not a small number. That is a month of real work, on real phones, in between everything else you had on.",
        "point": "#tlTitle"
      },
      {
        "t": "So before anything else. Thank you."
      },
      {
        "t": "Here is what that work actually did, because you may not have seen it from where you were sitting."
      },
      {
        "t": "Brian Maina Kamau found the fault in Receipt Maker. Fredrick Nganga found five of the six faults that were fixed on the fourth of November. Five out of six, from one person."
      },
      {
        "t": "Veronicah Kimani found a fault in search on the twenty-ninth of October. And out of all one thousand, two hundred and forty-two reports, only three people have ever had a problem confirmed. She is one of the three."
      },
      {
        "t": "Kevin Ngugi got through every app faster than anybody. Faith Wangari and Frank Ndung'u each tested all twenty-eight. Ruth Waitherero Kiarie, twenty-five."
      },
      {
        "t": "And everyone else who opened an app, poked at it, and said what they honestly thought. That is the job. There is no such thing as a small report."
      },
      {
        "t": "Now here is the thing we would most like you to believe.",
        "js": "try{window.scrollTo(0,0);}catch(e){} try{go('fixed');}catch(e){}"
      },
      {
        "t": "Finding a problem is not bad news for us. It is the entire point. This list is every single thing that has been fixed because somebody said something.",
        "point": "#fixedList"
      },
      {
        "t": "Every line on it started as a tester being honest. Nobody here is marked down for breaking an app. If you broke it, it was already broken. You just found it first."
      },
      {
        "t": "So. What is happening at the moment.",
        "js": "try{window.scrollTo(0,0);}catch(e){} try{go('try');}catch(e){}"
      },
      {
        "t": "There are two teams now. Emmanuel Koki leads one, and Veronicah Kimani leads the other. Your lead will tell you which apps are yours.",
        "point": "#appList"
      },
      {
        "t": "This round closes on the twelfth of November, and the apps on this page are the ones that need eyes first. Some of them have never been opened by anybody."
      },
      {
        "t": "If something confuses you, say so here. You do not have to be polite about it. Say it the way you would say it to a friend.",
        "js": "try{window.scrollTo(0,0);}catch(e){} try{go('board');}catch(e){}",
        "point": "#board"
      },
      {
        "t": "And if you would rather talk than type, there is a microphone. Nobody is marking your spelling."
      },
      {
        "t": "Last thing, and it is the real reason any of this exists.",
        "js": "try{window.scrollTo(0,0);}catch(e){} try{go('try');}catch(e){}"
      },
      {
        "t": "Every app that gets good enough to sell helps a student in Kenya stay in school. That is what the testing is for. Not for us — for them."
      },
      {
        "t": "That is all. Thank you for October. We will see what you find this time."
      }
    ]
  },

 tester: {
  name:'How to be a tester', em:'🧪', sub:'three minutes: a real test, start to finish', cat:'off', price:'', testing:true, video:true,
  tag:'The tester video — watch one short test from start to finish: use the app, point at what is wrong, say why, send the report',
  try:BASE+'feedback-studio/?app='+encodeURIComponent(BASE+'ourtable/'),
  lines:[
   "Hello, and thank you for testing. In the next three minutes you will watch one whole test, start to finish. Then you do the same.",
   "First, what this is. Daraja Studio makes small phone apps for households, churches and later life. One small yearly membership, no account, no ads. Your information stays on your phone.",
   "You are not being tested. The app is. If something confuses you, that is the app's fault, and that is exactly what we need to hear.",
   {t:"Here is the trick that makes it easy. Every app opens inside a wrapper called Feedback Studio. The app is in the middle. The tools are around it. Every tap you make is written down for us, so you never have to remember what you did.", point:"#appframe"},
   {t:"Watch me do a short test. This app is Our Table. It plans a week of dinners. I will just use it, the way I would at home.", js:"try{sessionStorage.setItem('__djDemo',JSON.stringify({o:localStorage.getItem('dj_ourtable_v1'),f:localStorage.getItem('feedback_studio_v1')}));document.getElementById('appframe').contentWindow.go('week')}catch(e){}"},
   {t:"I tap Fill the blanks for me, and it fills the week with dinners.", js:"try{document.getElementById('appframe').contentWindow.fillWeek()}catch(e){}"},
   {t:"Now, something bothers me. I cannot tell which nights I chose and which nights it chose for me. That is a finding. So I tap Point.", point:"#pointBtn"},
   {t:"With Point on, I would tap the thing on the screen that bothers me. That marks the exact spot, so nobody has to guess what I meant.", point:"#appframe"},
   {t:"Then I say what bothered me. Tap the red microphone and talk, in your own words. Short is fine. Grumpy is fine.", point:"#micBtn"},
   {t:"If you would rather type, there is a box for that too. Watch: my comment lands in the list on the side.", js:"try{var sb=document.getElementById('fsSideBtn'); if(sb && !document.body.classList.contains('fsSideOn') && window.matchMedia('(max-width:860px)').matches) sb.click();}catch(e){} try{var t=document.getElementById('typeIn'); t.value='(video demo) The week filled itself, but I cannot tell which nights I picked and which it picked for me.'; addTyped();}catch(e){}", point:"#typeIn"},
   "Three or four findings per app is plenty. If nothing is wrong, say that too. It is just as useful.",
   {t:"When you are finished, tap I am done, build the report. It writes the report for you, from your taps and your words.", js:"try{doneSession()}catch(e){}"},
   {t:"Here is the report. Tap Send to Claude, and it goes straight to Jerry. Nothing to pick, no number needed. That is the whole job. Claude reads it that evening and fixes what he can overnight.", point:"#reportBox footer .btn.green"},
   {t:"One last thing. The Testers' List is a shared page: the apps to try, what the other testers found, and what got fixed. Tick I tried it when you finish an app.", js:"try{hideReport();var k=JSON.parse(sessionStorage.getItem('__djDemo')||'null');if(k){['dj_ourtable_v1','feedback_studio_v1'].forEach(function(n,i){var v=i?k.f:k.o;if(v==null)localStorage.removeItem(n);else localStorage.setItem(n,v);});sessionStorage.removeItem('__djDemo');setTimeout(function(){location.reload();},1500);}}catch(e){}"},
   "That is all there is. Open an app in the tester. Use it. Point at what is wrong. Say why. Send it. Thank you. Every app that gets better because of you helps a student in Kenya stay in school."]
 },

 home: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About three minutes, for a first-timer: what the front door is, and why you would put it on your phone. Sound on.", lines:[
   {t:'Welcome. This explains Daraja itself — not one of the apps, but the front door they all live behind.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   'Daraja means bridge in Swahili. That is the whole idea: a short way across from where you are to the thing you were trying to do.',
   {t:'Here is the problem it solves. Once you are using three or four small apps, you stop being able to find them. They scatter across your phone, buried in folders, and you end up not using the ones you liked.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   {t:'Daraja is one page that holds them all. Put it on your home screen once, and it is the only icon you need.', point:"#host"},
   {t:'The apps you use sit together under Mine, so the ones you actually open are the ones you see first.', point:"#host"},
   {t:'Tap one and it opens right there inside Daraja, with a back arrow to bring you home again. No hunting, no going back to a browser.', point:"#host"},
   {t:'If you would rather give an app its own window, there is open on its own — handy for the one you live in all day.', point:"#host"},
   {t:'New apps turn up here by themselves as they are built. Nothing to update, nothing to reinstall.', point:"#host"},
   'It works with no signal. Once it has loaded, it keeps working on a train, in a basement, or out where the bars run out.',
   'Nothing is sent anywhere. No account to make, no password, no ads. What each app knows stays on your phone.',
   {t:'Two links sit at the bottom: the store, for anything you have not got yet, and what’s new, for what has changed lately.', point:"#host"},
   {t:'Daraja itself is free, and always will be. You only ever pay for an app you decide you want.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   'And every app that somebody buys helps a student in Kenya stay in school. That is not a slogan bolted on the end — it is why the whole thing exists.',
   {t:'That is the front door. Add it to your home screen, and everything else is one tap away.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"}
  ]} },
  name:'Daraja', em:'🌉', sub:'your family of apps, one front door', fresh:true, cat:'free', mem:'Free', price:'Free', testing:true,
  tag:'your family of apps, one front door',
  try:BASE+'home/',
  train:[
   {t:'Setting up your front door — about three minutes, once.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   {t:'Open Daraja in your phone’s browser. That link is the only address you need to remember.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   'Now put it on your home screen. On an iPhone, tap the share button and choose Add to Home Screen. On Android, open the browser menu and choose Install or Add to Home screen.',
   {t:'That gives you a Daraja icon beside your other apps. From then on it opens straight up, with no address bar in the way.', point:"#host"},
   {t:'Tap any app once to start using it, and it joins Mine so it is waiting for you next time.', point:"#host"},
   'If an app is one you use all day, open it on its own and give that its own home screen icon too. The two live happily side by side.',
   {t:'That is the whole setup. New apps will appear on their own, so there is nothing to come back and do.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"}
  ],
  lines:[
   {t:'This is Daraja — your family of apps behind one front door.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   'Daraja means bridge in Swahili.',
   {t:'Once you are using three or four small apps, you stop being able to find them. They scatter across your phone and you quietly stop using them.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   {t:'This is one page that holds them all. Add it to your home screen and it is the only icon you need.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   {t:'The apps you use gather under Mine, so what you actually open is what you see first.', point:"#host"},
   {t:'Tap one and it opens inside Daraja, with a back arrow home. Or open it on its own if you prefer its own window.', point:"#host"},
   {t:'New apps appear here by themselves. Nothing to update, nothing to reinstall.', point:"#host"},
   'It works with no signal, and nothing is sent anywhere — no account, no password, no ads.',
   {t:'Daraja is free and always will be. You only pay for an app you decide you want.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#host"},
   {t:'And every app bought helps a student in Kenya stay in school.', point:"#host"}
  ]
 },
 everyday: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Every Day: what it is for, and how to use it.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
    {"t": "First, the problem. The small things in a day slip away. A short walk. Taking your pills. Calling someone. Drinking enough water.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} "},
    {"t": "Not because we don't care. It's because nothing reminds us, and nothing notices when we do them.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} "},
    {"t": "Every Day is for anyone, but it was made with older people in mind, and with family far away who like to know they are all right.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} "},
    {"t": "Here is the whole idea. Each small thing is a card, like a playing card. When you have done it today, you tap the card. That is all.", "point": "#hand", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
    {"t": "Everything is on one screen. Under the name is the helper line. It says what is still left to do today.", "point": "#host", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
    {"t": "Under it are three numbers. Today shows how many of today's cards are done.", "point": "#sToday"},
    {"t": "Best run is the most days in a row you have kept a card going. Perfect this week counts the days when every card was done.", "point": "#sWeek"},
    {"t": "Then the week, Monday to Sunday. A gold day means everything was done. The dot marks today.", "point": "#weekrow"},
    {"t": "Then the cards. Each has a picture, a name, and a big number: its run, how many days in a row it has been done.", "point": "#hand .cardh:not(.addcard) .num"},
    {"t": "Tap a card when it is done, and it turns gold with a tick. Tap it again to undo a mistake.", "point": "#hand .cardh:not(.addcard)"},
    {"t": "If a card says not today, it isn't due today, so it can't break the run. Finish every card due today, and the screen celebrates a perfect day.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} "},
    {"t": "To make a new card, scroll down and tap Add a card, the one with the plus sign.", "point": "button.addcard[onclick=\"openEdit()\"]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,99999);"},
    {"t": "Under What is it, type a few words, like Walk to the corner. Then tap a picture.", "point": "#hName", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();openEdit();}catch(e){} setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},200);setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},450);"},
    {"t": "Then How often. On set days means every day, or only the days you tap, like only Sunday. Some times a week means, say, three times a week on any days you like.", "point": "#freqChips"},
    {"t": "Pills are special. Tap Yes, add times of day, and add a line for each time, like Morning and Evening. The card gets its own tick for each one.", "point": "#addDose"},
    {"t": "Tap Save to keep it, or Cancel to leave everything as it was.", "point": "#editSheet button[onclick=\"saveHabit()\"]"},
    {"t": "To change or remove a card later, tap Change or remove a card, then the card's name. Remove asks first.", "point": "#viewIn [data-ch]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();editList();}catch(e){}"},
    {"t": "Next to each card is history: its run, its best run ever, and the last four weeks. Green means done.", "point": "#viewIn p.small", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();editList();if(db.habits.length)openView(db.habits[0].id);}catch(e){}"},
    {"t": "Now the button called Settings, I'm OK text, day off. Inside is Let someone know I'm OK.", "point": "#viewIn [data-go=ok]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();openSettings();}catch(e){}"},
    {"t": "Type the name and mobile number of one or two people, like a son or a daughter. Then choose when it offers: when you finish your last card, or at a time you pick.", "point": "#okWhen", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();openSettings();document.querySelector('#viewIn [data-go=ok]').click();}catch(e){} setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},200);setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},450);"},
    {"t": "Then the app gets a short text ready: I'm OK, and what was done today. It never sends by itself. You tap, your messages open, and you press Send.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} "},
    {"t": "Back in Settings is Sick day, day off. If you are unwell, take the day off and your runs stay safe. You can do this once every seven days.", "point": "#viewIn [data-go=off]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();openSettings();}catch(e){}"},
    {"t": "How to start. The first time you open it, a short welcome tour shows you around. At the end, keep the six example cards, or start fresh with your own.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
    {"t": "Then tap one card you have already done today, and change one example into something you really do.", "point": "#hand .cardh:not(.addcard)"},
    {"t": "Everything stays on this phone. There is no account and nothing to sign up for. Every Day comes with the Family membership, with as many pill cards as you need.", "point": ".foot", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,99999);"},
   "New in November: when the app offers to tell someone you are OK, there are now two buttons — a text message, or WhatsApp. The tick beside their name only comes from the button with their name on it, because WhatsApp cannot tell the app which chat you picked.",
    {"t": "And when you open the app itself, the question mark button in the bottom corner has the tour and help any time.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} "}]} },
  train:[
   {"t": "Setting up Every Day takes about five minutes. Here is how, one step at a time.", "point": "#hand", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
   {"t": "Step one: look at the six example cards. To change or remove one, scroll down and tap Change or remove a card, then tap the card's name. Remove is inside, and it asks first.", "point": "#viewIn [data-ch]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();editList();}catch(e){}"},
   {"t": "Step two: to make your own, tap Add a card. Under What is it, type a few words, like Walk to the corner. Then tap a picture.", "point": "#hName", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();openEdit();}catch(e){} setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},200);setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},450);"},
   {"t": "Step three: under How often, choose On set days, then Every day, or just the days you tap. Or choose Some times a week, for something like three times a week on any days.", "point": "#freqChips"},
   {"t": "Step four, for pills: tap Yes, add times of day, and add a line for each time, like Morning and Evening. Each one gets its own tick. Then tap Save.", "point": "#addDose"},
   {"t": "Step five: tap Settings, I'm OK text, day off. Choose Let someone know I'm OK.", "point": "#viewIn [data-go=ok]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();openSettings();}catch(e){}"},
   {"t": "Type one or two names and mobile numbers, choose when it should offer, when you finish your last card or at a time you pick, and tap Save.", "point": "#okWhen", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();openSettings();document.querySelector('#viewIn [data-go=ok]').click();}catch(e){} setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},200);setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},450);"},
   {"t": "Step six: each day, tap a card as soon as it is done. When the last one is done, the I'm OK text is ready. Tap it, your messages open, and you press Send.", "point": "#hand .cardh:not(.addcard)", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
   {"t": "Step seven: on a day you feel unwell, open Settings, tap Sick day, day off, then Take today off. Your runs stay safe.", "point": "#viewIn [data-go=off]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();openSettings();}catch(e){}"},
   {"t": "To see how a card has gone, open Change or remove a card and tap history next to it. You see the last four weeks, one square a day.", "point": "#viewIn p.small", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();editList();if(db.habits.length)openView(db.habits[0].id);}catch(e){}"},
   {"t": "You'll know you're set when your own cards are on the screen, and the top line tells you what is left today.", "point": "#host", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"}],
  lines:[
   {"t": "This is Every Day. Six small things worth doing, laid out on one screen like a hand of cards.", "point": "#hand", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
   {"t": "The small things slip. A short walk. Your pills. Calling someone. A glass of water. Not because we don't care, but because nothing reminds us, and nothing notices when we do them.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} "},
   {"t": "Every Day notices. When you have done one, tap its card. It turns gold with a tick. Tapped it by mistake? Tap it again, and the tick goes away.", "point": "#hand .cardh:not(.addcard)", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
   {"t": "The big number on each card is its run: how many days in a row you have kept it going. A missed day just means you start again tomorrow. No guilt.", "point": "#hand .cardh:not(.addcard) .num"},
   {"t": "At the top, a helper line says in plain words what is left today. The week below turns a day gold when every card was done.", "point": "#host", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
   {"t": "Make the cards your own. Tap Add a card, type a few words, pick a picture, and choose how often: every day, only on certain days, or a few times a week.", "point": "#freqChips", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();openEdit();}catch(e){} setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},200);setTimeout(function(){try{document.activeElement&&document.activeElement.blur();}catch(e){}},450);"},
   {"t": "Pills can have a tick for each time of day, like morning and evening, all on one card. Make as many pill cards as you need.", "point": "#addDose"},
   {"t": "For family far away, open Settings and choose Let someone know I'm OK. When your last card is done, it gets a short text ready. You press Send yourself. Nothing goes by itself.", "point": "#viewIn [data-go=ok]", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeEdit();openSettings();}catch(e){}"},
   {"t": "Feeling poorly? Take a sick day, and your runs stay safe. You can do that once every seven days.", "point": "#viewIn [data-go=off]"},
   {"t": "Everything stays on this phone. There is no account, and nothing to sign up for.", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"},
   "New in November: under the button that tells Susan you are OK there is a WhatsApp one, so you can say it in the chat you already use.",
   {"t": "Every Day comes with the Family membership, and founding members get their first year free. Try it below: tap one card you have already done today, and see how it feels. And every app helps a student in Kenya stay in school.", "point": "#hand", "js": "try{['djTour','djHello','djA2HS','djMenu'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});document.body.style.overflow='';}catch(e){} try{closeView();closeEdit();}catch(e){} window.scrollTo(0,0);"}],
  name:'Every Day', em:'🌱', sub:'six small habits, one tap each', fresh:true, cat:'later', mem:'Family membership', price:'Free', testing:true,
  tag:'A walk, your pills, a call, some water: tap each one when it’s done and watch the streak grow. Change the six to suit you.',
  try:BASE+'everyday/', video:true
 },
 ourtable: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. In about four minutes, you will know what Our Table is for and how to use it.", "js": "try{var s=JSON.parse(localStorage.getItem('dj_level_ourtable')||'{}');s.level=3;s.auto=false;s.nudge=false;s.intro=1;parent.tourSet&&parent.tourSet('dj_level_ourtable',JSON.stringify(s));}catch(e){}"},
    {"t": "First, the problem. Every evening: what's for dinner? And every week, another trip back to the store, because somebody forgot the onions.", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
    "Our Table answers both. You keep the dinners your family really cooks. You put one on each night of the week. Then the app makes one shopping list for the whole week.",
    "Who is it for? Anyone who cooks for a household: a busy parent, a couple tired of deciding, a grandparent with the grandkids on Sundays.",
    {"t": "Here is the layout. At the bottom are the tabs. Recipes is your list of dinners. This week is the seven nights. Shopping is the list for the store.", "point": "nav", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
    {"t": "At the top, a green helper card suggests one next thing to do, with a button that does it.", "point": "#host"},
    {"t": "Above it is your Level. Level one is recipes and the week. Level two adds the Shopping tab. Level three adds sharing. Tap it to change, any time. Nothing is lost.", "point": "#djLevelPill"},
    {"t": "Let's start on Recipes. To find a recipe, type part of its name, or an ingredient like beef, in the search box.", "point": "#search"},
    {"t": "New recipe opens a blank recipe page.", "point": "#p-recipes button[onclick=\"openEdit()\"]"},
    {"t": "Type the name. Pick a picture if you like. Then tap the tags that fit, like Quick or Sunday.", "point": "#rName", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){} try{openEdit();}catch(e){}"},
    {"t": "Under Ingredients, write what to buy, one thing on each line. These go on the shopping list. The rest is optional. Then tap Save.", "point": "#rIng"},
    {"t": "In a hurry? The gold box, Put your own dinners in, takes just the names. You can add the ingredients later with Edit.", "point": "#qaName", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
    {"t": "Recipes somewhere else? Bring your dinners over pastes them in from another app, a website or your notes.", "point": "#impBtn"},
    {"t": "Tap any recipe to open it. You see the ingredients and how to make it.", "point": "#viewIn", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){} try{var r=document.querySelector('#recipeList .recipe');if(r)r.click();}catch(e){}"},
    {"t": "Made it tonight adds one to its count. Put it on a night adds it to this week. Edit changes it, and inside Edit is Delete.", "point": "#viewIn button.ok"},
    {"t": "Cook shows the steps one at a time, in big letters, and keeps the screen on while you cook.", "point": "#viewIn [data-act=\"cook\"]"},
    {"t": "Now the This week tab. It shows the week, Monday to Sunday. Tap a night to pick its dinner.", "point": "#weekList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('week');window.scrollTo(0,0);}catch(e){}"},
    {"t": "Tap a recipe, or type your own words, like Pizza night. Leave blank empties the night.", "point": "#pickSheet .in", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('week');window.scrollTo(0,0);}catch(e){} try{openPick('Mon');}catch(e){}"},
    {"t": "Fill the blanks for me puts your dinners on the empty nights for you, favorites first. Clear the week empties all seven nights.", "point": "#p-week button[onclick=\"fillWeek()\"]", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} "},
    {"t": "How many at the table? Change the number, and the shopping amounts grow or shrink to match.", "point": "#servRow"},
    {"t": "In Family favorites, type who eats at your table. Tap Who likes it and pass the phone around: each person gives a dinner a heart or a thumbs down. Fill the blanks skips the thumbs downs.", "point": "#famCard"},
    {"t": "When the week is planned, tap Build the shopping list.", "point": "#p-week button[onclick=\"buildList()\"]"},
    {"t": "Now the Shopping tab. The list joins the ingredients from every night and sorts them by the part of the store.", "point": "#shopList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('shop');window.scrollTo(0,0);}catch(e){}"},
    {"t": "Tick things off as you buy them. Have it marks what is already in the cupboard. To add anything else, like paper towels, type it in the Add box.", "point": "#extraItem"},
    {"t": "Text the list sends it to whoever is going to the store. Print gives you a paper copy.", "point": "#p-shop button[onclick=\"shareList('sms')\"]"},
    {"t": "How to start: type the names of three dinners you really cook, and tap Remove the three examples. Then put them on this week's nights.", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
    "Everything stays on this phone. There is no account and nothing to sign up for. Our Table comes with the Family membership.",
    {"t": "The question mark button in the corner has the tour and help, any time."},
   "New in November: the week of dinners and the shopping list can both go out on WhatsApp as well as by text. WhatsApp is the one that can reach a family group chat.",
    "And every Daraja app helps a student in Kenya stay in school. Enjoy your dinners."]} },
  train:[
   {"t": "Setting up Our Table takes about ten minutes, once. Here is how, screen by screen.", "js": "try{var s=JSON.parse(localStorage.getItem('dj_level_ourtable')||'{}');s.level=3;s.auto=false;s.nudge=false;s.intro=1;parent.tourSet&&parent.tourSet('dj_level_ourtable',JSON.stringify(s));}catch(e){}"},
   {"t": "Step one: on the Recipes tab, type the names of three dinners you really cook in the box called Put your own dinners in. Tap Add after each one.", "point": "#qaName", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Step two: tap Remove the three examples, so only your own dinners are left.", "point": "#quickAdd button[onclick=\"dropExamples()\"]"},
   {"t": "Step three: for a favorite, tap New recipe. Give it a name and write the ingredients, one per line. Those are what go on the shopping list. Then tap Save.", "point": "#rIng", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){} try{openEdit();}catch(e){}"},
   {"t": "Step four: open the This week tab. Tap a night and pick a dinner, or tap Fill the blanks for me. Leave a night blank for leftovers or eating out.", "point": "#weekList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('week');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Step five: under Family favorites, type the name of each person at your table and tap Add. Then tap Who likes it, pass the phone around, and everyone gives each dinner a heart or a thumbs down.", "point": "#famCard"},
   {"t": "Step six: tap Build the shopping list. Our Table adds up the ingredients for the whole week and sorts them by aisle.", "point": "#p-week button[onclick=\"buildList()\"]"},
   {"t": "Step seven: on the Shopping tab, type anything extra in the Add box. Tap Have it for things already in the cupboard. Tick each item as it goes in the cart.", "point": "#extraItem", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('shop');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Step eight: tap Text the list to send it to whoever is shopping, or Print it for the fridge.", "point": "#p-shop button[onclick=\"shareList('sms')\"]"},
   {"t": "You'll know you are set when the week has your own dinners on it and the shopping list fills itself from them. The question mark button has the tour again, any time.", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"}],
  lines:[
   {"t": "This is Our Table. Your family's recipes, a week of dinners, and one shopping list, all on your phone.", "js": "try{var s=JSON.parse(localStorage.getItem('dj_level_ourtable')||'{}');s.level=3;s.auto=false;s.nudge=false;s.intro=1;parent.tourSet&&parent.tourSet('dj_level_ourtable',JSON.stringify(s));}catch(e){}"},
   {"t": "Every night someone asks what's for dinner. The recipes are scattered across books, cards and your head. And the shopping list always forgets something.", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Our Table starts with the dinners you actually cook. Type just the names to begin. Add the ingredients and steps for your favorites whenever you like.", "point": "#recipeList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Tap a recipe and it opens: what to buy, how to make it, and buttons to mark it made tonight or put it on a night this week.", "point": "#viewIn", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){} try{var r=document.querySelector('#recipeList .recipe');if(r)r.click();}catch(e){}"},
   {"t": "The This week tab shows seven nights. Tap a night to pick its dinner, or tap Fill the blanks for me, and it fills the empty nights from your favorites.", "point": "#p-week button[onclick=\"fillWeek()\"]", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('week');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Put in who eats at your table, and each person can give a dinner a heart or a thumbs down. Filling the week then skips the dinners someone doesn't like.", "point": "#famCard"},
   {"t": "Then one tap builds the shopping list. Every ingredient for the week, added up and sorted by the part of the store you find it in.", "point": "#shopList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('shop');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Tick things off as you shop, add anything extra like milk or paper towels, and text the list to whoever is going to the store.", "point": "#p-shop button[onclick=\"shareList('sms')\"]"},
   {"t": "The Level line at the top keeps it simple to start. Level one is recipes and the week. Level two adds the shopping list. Level three adds sharing. Change it any time.", "point": "#djLevelPill", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet','djLevelSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{closeView();}catch(e){} try{closePick();}catch(e){} try{closeEdit();}catch(e){} try{go('recipes');window.scrollTo(0,0);}catch(e){}"},
   "There is no account and nothing to sign up for. Your recipes stay on your phone, so nobody can shut it down.",
   "New in November: next to Text it there is a WhatsApp button — for the week of dinners and for the shopping list. Pick the family chat and press send.",
   "Our Table comes with the Family membership, and every Daraja app helps a student in Kenya stay in school. Try it below: put in three dinners your family really eats, and plan this week."],
  name:'Our Table', em:'🍽', sub:'dinner, decided', fresh:true, cat:'home', mem:'Family membership', price:'Free', testing:true,
  tag:'Keep the recipes you actually cook, fill the week in one tap, and get one shopping list for all of it. Your recipes stay on your phone — nobody can shut it down.',
  try:BASE+'ourtable/', video:true
 },
 whoscoming: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    "Welcome. In about four minutes, you will know what Who's Coming is for and how to use it.",
    {"t": "First, the problem. You want to ask a group one simple question, like Sunday lunch at one, who's coming? So you send it to the group text.", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
    "The answers come back mixed in with jokes and photos. Some people answer twice, some forget, and you end up counting on your fingers.",
    "Who's Coming solves that. You ask one question to one group, and the app keeps every person's answer on one screen: yes, no, maybe, and who hasn't answered yet.",
    "Who is it for? A family planning a lunch. A church choir. A team choosing a practice night. Anyone who organizes people.",
    "It uses your phone's own text messages. Nothing is sent unless you press Send yourself, and nobody has to sign up to answer.",
    {"t": "Here is the layout. At the bottom are two tabs. Asks is where your questions are. People is where your groups are.", "point": "nav", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
    {"t": "At the top is the helper card. The first time, it asks your name and mobile number, because answers come back to that number.", "point": "#host"},
    {"t": "Start on the People tab. Each group is a card. The first time, there is one example group to show you how it looks.", "point": "#groupList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('people');window.scrollTo(0,0);}catch(e){}"},
    {"t": "Under New group, type a group name, like Sunday lunch crew, and tap Add group.", "point": "#gName"},
    "Inside the new group, type a name and tap Add, one person at a time. A mobile number is optional, but it lets the app text them.",
    "Or tap Paste a list, type one person on each line, and tap Add them all. From contacts brings people in from your phone.",
    "Rename changes a group's name. The small x takes one person out. Remove group asks first, and its questions stay on the Asks tab.",
    {"t": "Further down, under Me, you can save your name and number too.", "point": "#myName"},
    {"t": "Now go to the Asks tab and tap the big button, Ask the group something.", "point": "#newAskBtn", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
    {"t": "First, choose who you are asking.", "point": "#askGroup", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){} try{toggleNew(true);}catch(e){}"},
    {"t": "Then type the question. Keep it short, like: Sunday lunch at one, who's coming?", "point": "#askQ"},
    {"t": "Then choose how they answer: Yes, No, Maybe. Or Pick one, with your choices typed one per line. Or In their own words.", "point": "#askKind"},
    {"t": "Answer by is optional. Put a date if you need the answers by then.", "point": "#askWhen"},
    {"t": "Tap Save and send. If your group has mobile numbers, your messages app opens one group text with a link to tap. You press Send. With no numbers, the app copies the message for you to paste anywhere.", "point": "#newAsk button.primary"},
    "When someone taps the link, they see your question with big answer buttons. Tapping one opens a text back to you, with their answer already typed in.",
    {"t": "Now the important part. Your question becomes a card on the Asks tab, with answer buttons by each person. When someone tells you their answer, by text, phone or face to face, tap it on the card.", "point": "#askList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
    "The card counts the answers at the top: how many yes, how many no, how many maybe. People who haven't answered show not yet. If you tap the wrong one, the x clears it.",
    "Nudge the quiet ones reminds only the people who haven't answered. Copy the tally copies every name and answer. Close puts the question away.",
    "How to start: put in your name and number, make one real group with three people, and ask them one question.",
    "Everything stays on this phone. There is no account and there are no ads. Who's Coming is free.",
    "There is one more box when you write a question: if they say yes, also ask them. Type anything you like there \u2014 what are you bringing, what time will you get here, how many are coming.",
    "Only the people who tap Yes are asked it, and they can skip it. What they type arrives beside their answer, so your list reads: Emma, Yes, a pudding.",
    "When the answers are in, tap Send the summary. It writes out who is coming, who cannot, and what each one is bringing, and sends it to everyone, or only to the people who are coming.",
    "And every send now offers a text message or WhatsApp. Pick whichever the people you are asking actually use.",
    "The question mark button in the corner has the tour and help, any time.",
   "Also new: Send the summary can hand you a link instead. Anyone who taps it sees the whole list — who is coming, who cannot, and what each one is bringing — with nothing to tap and nothing to join. It is a photograph of the answers, not a live window, and the page says so, so nobody is misled.",
    "And every Daraja app helps a student in Kenya stay in school. Happy asking."]} },
  train:[
   "Setting up Who's Coming takes about five minutes. Here is how.",
   {"t": "Step one: open the People tab. Under Me, type your name and your mobile number, and tap Save. Answers come back to that number.", "point": "#myName", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('people');window.scrollTo(0,0);}catch(e){} try{document.getElementById('myName').scrollIntoView({block:'center'});}catch(e){}"},
   {"t": "Step two: under New group, type a name, like Sunday lunch, and tap Add group.", "point": "#gName"},
   {"t": "Step three: in the new group, type each person's name and mobile number and tap Add. Or tap Paste a list and put one person on each line, or bring people in with From contacts.", "point": "#groupList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('people');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Step four: go to the Asks tab and tap Ask the group something.", "point": "#newAskBtn", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Step five: pick the group, type your question, and choose how they can answer. Add an Answer by date if you need one.", "point": "#askQ", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){} try{toggleNew(true);}catch(e){}"},
   {"t": "Step six: tap Save and send. Your messages app opens with one group text. Check it and press Send. If nobody in the group has a number, the message is copied so you can paste it anywhere.", "point": "#newAsk button.primary"},
   {"t": "Step seven: when someone answers, by text, by phone or in person, tap their answer on the question card. The tally counts itself.", "point": "#askList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
   "Step eight: tap Nudge the quiet ones to remind only the people who haven't answered. When you have your answers, tap Copy the tally to share it, then Close.",
   "You'll know you are set when your question card shows every name with an answer next to it. The question mark button has the tour again, any time."],
  lines:[
   "This is Who's Coming. Ask a group one question, and see everyone's answer on one screen.",
   {"t": "A group text with twelve people turns into forty messages. Somebody answers twice, somebody never does, and you are left counting thumbs-ups by hand.", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
   {"t": "With Who's Coming, you make your groups once. The grandkids, the choir, the Saturday crew. Type the names one at a time, or paste a whole list at once.", "point": "#groupList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('people');window.scrollTo(0,0);}catch(e){}"},
   {"t": "Then tap Ask the group something. Pick the group, type the question, and choose how they answer: yes, no or maybe, pick one, or in their own words.", "point": "#askKind", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){} try{toggleNew(true);}catch(e){}"},
   {"t": "Save and send opens one group text on your own phone, with a link to tap. You press Send. Nothing goes out unless you do.", "point": "#newAsk button.primary"},
   "Your people tap the link and see your question with big answer buttons. Nobody has to sign up to answer. Their answer comes back to you as an ordinary text.",
   {"t": "Each question gets a card on the Asks tab. Tap each person's answer to record it, and the tally counts itself: how many yes, how many no, how many maybe, and who hasn't answered yet.", "point": "#askList", "js": "try{['djMenu','djHello','djDockSheet','djMoreSheet'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});}catch(e){} try{toggleNew(false);}catch(e){} try{go('ask');window.scrollTo(0,0);}catch(e){}"},
   "One tap on Nudge the quiet ones sends a reminder only to the people who haven't answered. Copy the tally gives you every name and answer, ready to paste.",
   {"t": "The first time, the helper card at the top asks your name and mobile number, so the answers come back to you.", "point": "#host"},
   {"t": "New in November: when you set up a question you can add a second one \u2014 what are you bringing? \u2014 and only the people who say yes are asked it.", "point": "#newAskBtn"},
   "Whatever they type comes back beside their answer, so your list reads: Emma, Yes, a pudding.",
   "Then Send the summary writes the whole picture \u2014 who is coming, who cannot, and what each one is bringing \u2014 and sends it back to everyone, or only to the ones coming.",
   "Every send has two buttons now: a text message, or WhatsApp. The app writes the words either way, and you press send.",
   "It works for a family Sunday lunch, a church work day, a team choosing a practice night, or anyone who organizes people.",
   "Or tap A link they can open. One link shows the whole list to anybody, read only, with no app and no account — and it carries a way through to the rest of the Daraja apps.",
   "No ads, no account, and everything stays on your phone. Who's Coming is free, and every Daraja app helps a student in Kenya stay in school. Try it below: make a group and ask your first question."],
  name:'Who’s Coming', em:'🙋', sub:'one question, everyone’s answer', fresh:true, cat:'home', mem:'Family membership', price:'Free', testing:true,
  tag:'Ask the family or the group one question (“Sunday lunch at 1?”) and see who said yes, no and maybe on one screen. It goes from your own phone. No ads, and nobody has to sign up to answer.',
  try:BASE+'whoscoming/', video:true
 },
 nownext: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains One Thing: what it is for, and how to use it.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}"},
    "First, the problem. A long to-do list can feel like a wall. You look at twenty things, cannot pick one, and end up doing none.",
    {"t": "One Thing fixes that. Your whole list is inside, but the screen shows only one thing: the thing to do now, with a timer and a Done button.", "point": "#nowCard"},
    "It is for anyone whose mind runs fast: a child, a student, a busy parent. One phone can hold the whole family, each with their own list.",
    {"t": "The first time you open it, it asks Who's first. Type a name, then tap Kid or Grown-up. A kid gets coins and a cheering buddy. A grown-up gets calmer routines.", "keep": ".modewrap.show", "js": "try{openPicker(true);var n=document.getElementById('pNew');if(n)n.style.display='block';}catch(e){}", "point": "#pName"},
    {"t": "Then it asks how much you want to see. That is your Level. Level 1 is just today. Level 2 adds routines and the week. Level 3 adds Wins and the whole family. Tap change any time.", "point": "#nnLevel"},
    "A short card called Setting up then asks four things, one at a time: a routine, something that repeats, something on a date, and your one thing. Answer, or skip.",
    {"t": "Now the main screen, called Now. At the top is whose list it is. Tap the name to switch person, or to add someone.", "js": "try{var s=JSON.parse(localStorage.getItem('nn_level_v1')||'{}');s.level=3;s.auto=false;s.intro=1;s.nudge=false;parent.tourSet&&parent.tourSet('nn_level_v1',JSON.stringify(s));}catch(e){} try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}", "point": "#whoami"},
    {"t": "Beside it are your coins, and the things you finished today.", "point": "#pts"},
    {"t": "Look changes the colors. My photo puts your own picture behind everything. Aa Size makes the words bigger.", "point": "#r7Pills"},
    {"t": "The big card is the Now card. Tap Start, and everything else hides until the timer ends. Tap Done when you finish. You get a star, and the next thing comes up.", "point": "#nowCard"},
    "Starting is the hard part? Tap Just 5 min.",
    {"t": "Below is Today's list. Type one small step in the box, choose the minutes, and tap Add. Or tap the microphone and say it.", "point": "#newTask"},
    "Keep tasks small: put shoes on, not get ready. A job of an hour or more? The app offers to split it into pieces you can begin.",
    "The circle on the left ticks a task done. Tap the words of a task to bring it up to Now, or to see its buttons.",
    {"t": "At the bottom are four tabs: Now, Routines and regulars, Brain dump, and Wins.", "js": "try{var n=document.querySelector('nav');if(n){n.style.transform='translateY(-230px)';n.style.zIndex='500';}}catch(e){}", "point": "#n-routines"},
    {"t": "Routines and regulars asks one question: what do you want to set up?", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('routines');window.scrollTo(0,0)}catch(e){}", "point": "#djAsk"},
    {"t": "A routine is a set of steps, like Morning or Bedtime. Tap one, and its steps land on Today, in order.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('routines');djRoutineStep('routine');var d=document.querySelector('[data-dj-pane=\"routine\"] details');if(d)d.open=true;}catch(e){}", "point": "#v-routines .routine"},
    {"t": "A regular repeats, like taking out the trash every Thursday. Type it, choose the days, and tap Save regular. It appears on its day by itself.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('routines');djRoutineStep('regular');var d=document.querySelector('[data-dj-pane=\"regular\"] details');if(d)d.open=true;}catch(e){}", "point": "#rgText"},
    {"t": "Something coming up is one thing on one date, like a dentist visit. Tap Put it on that day, and it lands on Today that morning.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('routines');djRoutineStep('upcoming');var d=document.querySelector('[data-dj-pane=\"upcoming\"] details');if(d)d.open=true;}catch(e){}", "point": "#upText"},
    {"t": "The Brain dump parks thoughts so they stop spinning. Type or talk, then tap Park it here. Later, one tap makes a thought a task.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('dump');window.scrollTo(0,0)}catch(e){}", "point": "#dumpBox"},
    {"t": "Wins is the trophy room: what you finished today, your streak, and the week, day by day. Add more people, and a friendly family race begins.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('wins');window.scrollTo(0,0)}catch(e){}", "point": "#v-wins .wins"},
    {"t": "Further down are coins and rewards, decided together, and My buddy, who cheers for you.", "point": ".bankcard"},
    {"t": "The round calendar button opens Our Week. Type the family's week, tap Spread the week for me, then Send to everyone's lists.", "js": "try{go('today');var b=document.getElementById('wkBtn');if(b)b.click();}catch(e){}", "point": "#wkText"},
    {"t": "To start: add yourself, load one routine, and add one small thing. Then tap Start on the Now card, and finish it. That is your first two minutes.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}", "point": "#nowCard"},
    "Everything stays on this phone. No account, no ads, and it works with no signal.",
    "One Thing comes with the Family membership. Any profit helps orphans and students in Kenya.",
    {"t": "The round question mark button in the corner has the tour, help and settings, any time.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "Let's set up One Thing. Five minutes, then it runs your mornings.", "keep": ".modewrap.show"},
   {"t": "Step one: when it opens, it asks Who's first. Type a name and tap Kid or Grown-up. You can add the rest of the family later, from the name at the top.", "keep": ".modewrap.show", "js": "try{openPicker(true);var n=document.getElementById('pNew');if(n)n.style.display='block';}catch(e){}", "point": "#pName"},
   {"t": "Step two: answer the short set-up questions, or skip them. Then add a task: type one small thing in the box, pick the minutes, and tap Add.", "js": "try{var s=JSON.parse(localStorage.getItem('nn_level_v1')||'{}');s.level=3;s.auto=false;s.intro=1;s.nudge=false;parent.tourSet&&parent.tourSet('nn_level_v1',JSON.stringify(s));}catch(e){} try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}", "point": "#v-today .add"},
   {"t": "Step three: the Now card shows one thing, with a timer. Tap Start, do it, then tap Done, and enjoy the party. That is the whole engine.", "point": "#nowCard"},
   {"t": "Step four: routines. Open Routines and regulars, tap A routine, and pick Morning, Homework or Bedtime. All its steps land on Today, in order.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('routines');djRoutineStep('routine');var d=document.querySelector('[data-dj-pane=\"routine\"] details');if(d)d.open=true;}catch(e){}", "point": "#v-routines .routine"},
   {"t": "Step five: things that repeat. Tap Something that repeats, type it, choose the days, and tap Save regular. From then on it shows up on its day by itself.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('routines');djRoutineStep('regular');var d=document.querySelector('[data-dj-pane=\"regular\"] details');if(d)d.open=true;}catch(e){}", "point": "#rgText"},
   {"t": "Step six: tap the round calendar button to plan the whole week. Type things like doctor Tuesday — it picks the day itself. Tap Spread the week for me, then Send to everyone's lists.", "js": "try{go('today');var b=document.getElementById('wkBtn');if(b)b.click();}catch(e){}", "point": "#wkText"},
   {"t": "Step seven: make it yours. My photo puts a picture you love behind your whole day. Look changes the outfit: River, Warm Paper, or Quest H U D game mode. Aa Size makes the words bigger.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}", "point": "#r7Pills"},
   {"t": "Don't worry about learning it all. The first time you open a new part, a little card explains it, and Read it to me says it out loud. Tap Got it and it never bothers you again.", "keep": "#r7Tip.show", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){};try{var t=document.getElementById('r7Tip');if(t&&t.innerHTML)t.classList.add('show');}catch(e){}"},
   {"t": "Last: peek at Wins now and then. Stars, streaks, coins and the family race live there.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('wins');window.scrollTo(0,0)}catch(e){}", "point": "#v-wins .wins"},
   {"t": "You'll know it's set up right when the Now card shows one thing with a timer, and somebody taps Done and gets the party.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}", "point": "#nowCard"}],
  lines:[
   {"t": "This is One Thing. It is for anyone whose brain runs faster than their day — a child, a grown-up, either.", "js": "try{var s=JSON.parse(localStorage.getItem('nn_level_v1')||'{}');s.level=3;s.auto=false;s.intro=1;s.nudge=false;parent.tourSet&&parent.tourSet('nn_level_v1',JSON.stringify(s));}catch(e){} try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}"},
   "It answers a very particular ache: knowing exactly what needs doing, and still not being able to begin.",
   {"t": "Here is the whole idea. The screen shows one thing. Not the long list, just the one thing to do now.", "point": "#nowCard"},
   "A timer keeps that one thing short, and when it is done the app makes a small fuss of you — high fives, coins, and a family board if you want one.",
   {"t": "Mornings, homework and bedtime run on routines you load with one tap, and regulars show up on their day by themselves.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('routines');djRoutineStep('routine');var d=document.querySelector('[data-dj-pane=\"routine\"] details');if(d)d.open=true;}catch(e){}", "point": "#v-routines .routine"},
   "That is the part parents notice. It shows a child what is ahead, so they start on their own — which builds their confidence, and quietly builds trust between you.",
   {"t": "Everyone in the house gets their own list, their own coins and their own cheering buddy, all on one phone.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}", "point": "#whoami"},
   {"t": "Big jobs get broken into pieces you can actually start: a two-hour garage becomes five small wins.", "point": "#newTask"},
   {"t": "The week planner lets you empty your head — laundry, appointments, visits — and spreads it over sensible days with one tap.", "js": "try{go('today');var b=document.getElementById('wkBtn');if(b)b.click();}catch(e){}", "point": "#wkText"},
   {"t": "It notices things too. Four days in a row, do not break the chain. Two more and it is your best day yet. A helper on your shoulder, never a boss.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('wins');window.scrollTo(0,0)}catch(e){}", "point": "#winWeek"},
   {"t": "You can make it yours: your own family photo as the background, and three different looks — including a points-and-levels one that teenagers actually like.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}", "point": "#r7Pills"},
   {"t": "Once a week it can also go looking for gentle things to do near you — the open gym, the beginner chess night. It uses a grown-up's A.I. to find them. No feed, no pressure.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('wins');window.scrollTo(0,0)}catch(e){};setTimeout(function(){try{var h=document.getElementById('hzCard');if(h)h.scrollIntoView({block:'center'})}catch(e){}},300)", "point": "#hzCard"},
   {"t": "Every new part of it explains itself the first time you touch it, in plain words, out loud if you like.", "js": "try{var o=document.getElementById('wkOv');if(o)o.style.display='none';var n=document.querySelector('nav');if(n)n.style.transform='';}catch(e){} try{go('today');window.scrollTo(0,0)}catch(e){}"},
   "It comes with the Family membership, and founding members get their first year free. No account, no ads, it works with no signal, and your list stays on your phone. Try the whole thing right now with the button below."],
  buy:'https://buy.stripe.com/aFaeVcey6ch5eE23Qo04800',
  name:'One Thing', em:'🧭', sub:'what to do right now', fresh:true, cat:'home', mem:'Family membership', price:'$4.99', testing:true,
  tag:'Your whole list is in there — it just shows one step at a time, so the day stops looking like a pile. For kids and grown-ups whose brains run fast.',
  try:A+'nownext/?code=TESTING', video:true,   /* ?code= is read by the key gate once nownext ships the 2026-10-02 patch; until then it is ignored */
  
  },
 ahead: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Ahead of It: what it is for, and how to use it.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
    "First, the problem. Every home has dates that cost money if you forget them. Insurance to renew. A tax to pay. A license that runs out. The dog's shots.",
    "They come once a year, at different times, and they all live in one person's head. And heads forget.",
    "Ahead of It holds those dates for you. It shows what is coming next, and what it costs you to miss each one.",
    "It is for whoever carries the household. It also has ready-made items for a small business or a nonprofit.",
    {"t": "At the top is the name, and a small word that says empty, all clear, or how many things are overdue.", "point": "#calm"},
    {"t": "Under it is the Level line. Level 1 shows only what is next. Level 2 adds the Year map, the Library, and a How button on each item. Level 3 adds the Hand-off list. Tap change to choose.", "point": "#djLevelPill"},
    {"t": "The main page is called Next. It has four groups: Overdue, Do something now, Next ninety days, and Later.", "js": "try{var s=JSON.parse(localStorage.getItem('dj_level_ahead')||'{}');s.level=3;s.auto=false;s.intro=1;s.nudge=false;parent.tourSet&&parent.tourSet('dj_level_ahead',JSON.stringify(s));}catch(e){} try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}", "point": "#lOver"},
    "Each line shows a name, how many days away it is, and a color. Red means missing it costs real money. Yellow means a hassle. Green means no big deal.",
    {"t": "The fastest way to begin is the gold button, Quick setup. When the list is empty, it says tick what's yours.", "point": "#qsBtn", js:"try{['ahWelcome','welcome'].forEach(function(i){var w=document.getElementById(i);if(w)w.style.display='none';});}catch(e){}"},
    {"t": "It opens every common item on one screen. Tick what your house has, fix the date on that line if you know it, and tap Save my list at the bottom. Two is plenty to start.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');setTimeout(function(){var q=document.getElementById('qsBtn');if(q)q.click();},150)}catch(e){}"},
    {"t": "To add something of your own, tap the orange button with the plus sign.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}", "point": ".fab", js:"try{['ahWelcome','welcome'].forEach(function(i){var w=document.getElementById(i);if(w)w.style.display='none';});}catch(e){}"},
    "A form opens. Write what it is, the next due date, how often it repeats, and how bad it is to miss. Add the amount and where the papers are kept. Then tap Save.",
    "Never type a password into it. Write where the login is kept, not the login itself. To change an item later, tap its name.",
    "Every item has three reminder steps: thirty days out, seven days, and one day. When a step is due, it shows under Do something now.",
    "When a bill is paid, tap done on its line. The item moves to its next date, ready for next year. There is an Undo if you tap it by mistake.",
    "At Level 2, the How button opens your own playbook for that item: the website, the steps, and your notes. I paid, record it saves the amount and the confirmation number.",
    {"t": "Near the top is the money strip. Put amounts on your bills, and it adds up what is due this month, and what is paid.", "point": "#ahMoney"},
    {"t": "The Year tab shows twelve months on one page. Print the year map for the fridge, or add every date to your phone's calendar.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('year');window.scrollTo(0,0)}catch(e){}", "point": "#v-year .row"},
    {"t": "The Library has twenty-seven ready-made items, from taxes and insurance to pets and renewals. Tap one to add it, with its usual date and its reminder steps.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('lib');window.scrollTo(0,0)}catch(e){}", "point": "#lib .card"},
    {"t": "The Hand-off tab is the list someone else would need if you were ever not around. Copy it into a note or an email, or print it. Save a backup file here too.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('more');window.scrollTo(0,0)}catch(e){}", "point": "#v-more .card"},
    {"t": "Here is how to start. Tap Quick setup, tick three real things from your own house, and save. Then look at the Next page. That is your first two minutes.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
    "Everything stays on this phone. There is no account and no bank login, and nothing is sent anywhere.",
    "Ahead of It comes with the Family membership. Any profit helps orphans and students in Kenya.",
    {"t": "The round question mark button in the corner has the tour, help and settings, any time.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "Setting up Ahead of It takes about five minutes, once. Then nothing catches you off guard again.", "js": "try{var s=JSON.parse(localStorage.getItem('dj_level_ahead')||'{}');s.level=3;s.auto=false;s.intro=1;s.nudge=false;parent.tourSet&&parent.tourSet('dj_level_ahead',JSON.stringify(s));}catch(e){} try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Step one: tap the gold Quick setup button. Every common item is on one screen, in groups like taxes, home and vehicles.", "point": "#qsBtn", js:"try{['ahWelcome','welcome'].forEach(function(i){var w=document.getElementById(i);if(w)w.style.display='none';});}catch(e){}"},
   {"t": "Step two: tick the ones your house actually has, fix the date on each line if you know it, and tap Save my list at the bottom.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');setTimeout(function(){var q=document.getElementById('qsBtn');if(q)q.click();},150)}catch(e){}"},
   {"t": "Step three: for anything else, tap the orange plus. Write what it is, the next due date, how often it repeats, and how bad it is to miss. Add the amount and where the papers are kept, then Save.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}", "point": ".fab", js:"try{['ahWelcome','welcome'].forEach(function(i){var w=document.getElementById(i);if(w)w.style.display='none';});}catch(e){}"},
   {"t": "Step four: read the Next page from the top. Overdue, then Do something now, then the next ninety days, then later. Red costs real money, yellow is a hassle, green is no big deal.", "point": "#lOver"},
   "Step five: each item has three reminder steps — thirty days out, seven days, and one day. When one comes due, it shows under Do something now. Tick it off with the step button.",
   "Step six: when the bill is paid, tap done on its line. It moves to its next date, ready for next time, and there is an Undo.",
   {"t": "Step seven: put amounts on your bills, and the money strip at the top adds up what is due this month and what is paid.", "point": "#ahMoney"},
   {"t": "Step eight: on the Year tab, print the year map for the fridge, or tap Add all to my calendar.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('year');window.scrollTo(0,0)}catch(e){}", "point": "#v-year .row"},
   {"t": "Step nine: fill in the Hand-off. Copy it into a note or an email for the person who would take over, or print it. And save a backup file now and then.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('more');window.scrollTo(0,0)}catch(e){}", "point": "#v-more .card"},
   {"t": "You'll know you're set when the Next page shows your real dates, in order, and nothing on it surprises you.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"}],
  lines:[
   {"t": "This is Ahead of It — for whoever carries the household.", "js": "try{var s=JSON.parse(localStorage.getItem('dj_level_ahead')||'{}');s.level=3;s.auto=false;s.intro=1;s.nudge=false;parent.tourSet&&parent.tourSet('dj_level_ahead',JSON.stringify(s));}catch(e){} try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   "Every house has its own list, and it is different in every house. The insurance renewal. The property tax. The car registration. The dentist. The dog's shots.",
   "None of it is difficult. It is just that all of it lives in one person's head, and heads leak.",
   {"t": "So you put your real ones in, with your real dates, and it holds them for you.", "point": "#qsBtn", js:"try{['ahWelcome','welcome'].forEach(function(i){var w=document.getElementById(i);if(w)w.style.display='none';});}catch(e){}"},
   {"t": "You don't start from a blank page. A library of twenty-seven common ones — taxes, insurance, the car, the dog — comes with the usual dates and three reminder steps each. You just tap yours.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('lib');window.scrollTo(0,0)}catch(e){}", "point": "#lib .card"},
   {"t": "It shows what is overdue, what needs doing now, and what is coming in the next ninety days — and what it actually costs you to miss each one, so you can tell what matters from what can wait.", "point": "#lOver", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Put an amount on a bill, and the top of the page adds up what is due this month, and what is already paid.", "point": "#ahMoney"},
   {"t": "There is a year map, the whole calendar on one page, which is the bit people print for the fridge.", "js": "try{go('year')}catch(e){}", "point": "nav button[data-v='year']"},
   {"t": "And it can add every date to your phone's calendar in one go, so they sit right beside the rest of your week.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('year');window.scrollTo(0,0)}catch(e){}", "point": "#v-year .row"},
   {"t": "And there is a hand-off list, so if you are ever not the one carrying the household, somebody else can pick it up without detective work.", "js": "try{go('more')}catch(e){}", "point": "nav button[data-v='more']"},
   {"t": "Nothing catches you off guard. No late fees, no lapsed insurance, no 'I thought you renewed it.'", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   "It comes with the Family membership. Try it below — put three real things from your own house in and see how it feels."],
  name:'Ahead of It', em:'🧾', sub:'never miss a deadline', fresh:true, cat:'home', mem:'Family membership', price:'$9', testing:true,
  tag:'Taxes, renewals, insurance, the dog’s shots: every date that costs money if you miss it, on one calm page, with the next 30 days always in view. No bank login, ever.',
  try:A+'ahead/', video:true,
  
  },
 nextstep: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Next Step Board. In about four minutes you will know what it is for and how to use it.", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ var a=document.getElementById('apOv'); if(a) a.remove(); var o=document.getElementById('aiOv'); if(o) o.style.display='none'; document.querySelector('#filters [data-f=all]').click(); window.scrollTo(0,0); }catch(e){}"},
    "First, the problem. Most of us carry many projects at once. A church event, the taxes, a repair at home.",
    "Projects rarely stall because they are hard. They stall because the next move is fuzzy, or because you forgot you were waiting on someone.",
    {"t": "Next Step Board fixes that with one idea. For every project, write down one thing: the next small step, and whose turn it is.", "point": "#grid .card .next"},
    "It is for anyone juggling more than a few things: a busy family, a church volunteer, a small business owner.",
    {"t": "Let us look at the screen. At the very top is the name of the board. Tap the name to rename it, for example Church projects, or Home.", "point": "#boardName"},
    {"t": "Under the name is a row of buttons: All, Active, Waiting, Blocked, Paused, and Needs me. They choose which cards you see.", "point": "#filters", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} "},
    {"t": "Needs me shows only the cards where it is your turn.", "point": "#filters [data-f=mine]", "js": "try{ document.querySelector('#filters [data-f=mine]').click(); }catch(e){}"},
    {"t": "Below that is a box called Where you left off. It counts what is waiting and suggests which project to start with.", "point": "#banner", "js": "try{ document.querySelector('#filters [data-f=all]').click(); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Under the box are the cards. Each card is one project: an emoji, a name, one line about it, and a small status label on the right.", "point": "#grid .card .top"},
    {"t": "The most important part of a card is the Next step. One small thing to do, and under it, who does it and how long it takes.", "point": "#grid .card .next", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} "},
    {"t": "Beside the priority, P3, are two small arrows. Tap up to raise it, down to lower it. Higher priority cards sort to the top.", "point": "#grid .card .pri"},
    {"t": "Tap plus due date and type a date, month first. It turns orange when the date is close, and red when it is overdue.", "point": "#grid .card .due"},
    "When a step is due within a week, a Coming up bar appears at the top, with an add to calendar link.",
    {"t": "Now the buttons on each card. The pencil button, Next, changes the next step. It asks what the step is, then who and how long.", "point": "#grid .card .acts button.primary"},
    {"t": "Status, with the little arrow, moves the card along. Active, then Waiting, then Blocked, then Paused, and back to Active.", "point": "#grid .card .acts button:nth-child(2)", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} "},
    "Waiting means the ball is in someone else's court. Blocked means something is in the way. Paused means later, and the card fades so it stops nagging.",
    {"t": "Today, with the check mark, says you worked on it today. Card changes the name and emoji. The red X deletes the card, and asks you first.", "point": "#grid .card .acts button.done"},
    {"t": "At the bottom of each card is the Checklist. Type a small job in the box that says add an item, and tap Add. Tick it when it is done.", "point": "#grid .card details summary"},
    {"t": "To add your own project, scroll down and tap plus Add project. A form slides up for the name, the next step, and who does it. Then tap Add it.", "point": ".foot button[onclick='addProject()']"},
    {"t": "Rather talk it through? Let your AI build my board gives you a prompt to copy into Claude or ChatGPT. Paste the answer back, and it builds the cards.", "point": ".foot button[onclick='aiFill()']", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} "},
    "Here is how to start. The board opens with a few Example cards, so you can see how it reads.",
    "Add one real project and write its next step. Delete the examples with the red X when you are ready.",
    "Then the habit. Every morning, read down the board and do the next steps that are yours.",
    {"t": "Your board saves on this phone by itself. No account, nothing to sign up for, and it works without internet. Tap Backup once a week to keep a copy.", "point": ".foot button[onclick='exportJSON()']"},
    "Next Step Board comes with the Business membership.",
    {"t": "And the question mark button in the corner has the tour and help any time you need them.", "point": "#djDockToggle", "js": "try{ window.scrollTo(0,0); }catch(e){}"}]} },
  name:'Next Step Board', em:'🗂', sub:'every project\'s next move', fresh:true, cat:'work', mem:'Comes with the Business membership', price:'$9', testing:true,
  tag:'Every project, its next step, whose turn — one screen',
  try:A+'nextstep/', video:true,
  train:[
   {t:"Next Step Board setup — five minutes with your coffee.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#boardName"},
   {t:"Step one: add every project you're juggling. Work, home, church — all of them, one screen.", point:"#grid"},
   {t:"Step two: for each project write ONE next step, and whose turn it is — yours, or someone you're waiting on.", point:"#grid"},
   {t:"Step three: set priorities and due dates so the important things float to the top.", point:"#filters"},
   {t:"Step four: every morning, open the board and just go down the list. Add anything new in one tap.", point:"#grid"},
   {t:"Step five: when a step gets done, write the next one right away. Projects never stall when the next step is always written. That's the whole secret.", point:"#grid"},
   {t:"You'll know it's working when every project on the board has a next step written. No blanks — blanks are where projects go to sleep.", point:"#count"}],
  lines:[
   {t:"This is Next Step Board — for anyone juggling more than three projects.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#boardName"},
   "The problem: projects don't stall because they're hard. They stall because nobody wrote down the NEXT STEP.",
   {t:"How it works: one screen. Every project you've got, its very next step, and whose turn it is — yours or someone you're waiting on.", point:"#grid"},
   {t:"Priorities and due dates keep the important things on top. A 'coming up' bar shows what's about to land.", point:"#filters"},
   {t:"Add a task in one tap, send a date to your calendar in one tap.", point:"#grid"},
   {t:"Sit down with your coffee, open the board, and go down the list — business person or household manager, it's the same relief.", point:"#grid"},
   {t:"The benefit: nothing stalls, nothing gets forgotten, and you always know what to do next.", point:"#count"},
   "It comes with the Business membership. No account, and it works offline.",
   {t:"Try it below — put your three real projects in and watch your morning get simpler.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#grid"}]},
 breakeven: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Break-Even. In about three and a half minutes you will know what it is for and how to use it.", "js": "try{ window.scrollTo(0,0); }catch(e){}"},
    "First, the problem. Many small sellers choose a price by guessing. They copy the table next to them, or pick a round number.",
    "Then they work hard all month, and at the end there is almost nothing left. And they do not know why.",
    "The answer is usually hiding in three numbers. Break-Even asks for those three numbers and gives you one honest answer.",
    "Who is it for? Anyone who sells something: candles at a craft fair, baked goods, a side business online. The math is the same.",
    {"t": "The question at the top is the whole app: how many sales until you stop losing money?", "point": "h1"},
    {"t": "Below it are three boxes. Box one is called Average price per sale. It is what a customer pays you for one, on average.", "point": "#p"},
    {"t": "Box two is Variable cost per sale. What each one costs you: materials, packaging, shipping, card fees. It goes up when you sell more.", "point": "#c"},
    {"t": "Box three is Monthly fixed costs. What you pay every month even if you sell nothing: rent, booth fees, software, insurance.", "point": "#f"},
    "Be careful here. Rent is paid once a month, so it goes in box three. The wax in each candle is used on every sale, so it goes in box two.",
    {"t": "As soon as you type, the answers appear below. There is no button to press, and your numbers save on this phone by themselves.", "point": ".res"},
    {"t": "The first answer is Sales needed a month. This is the big one: the sale where you stop losing money.", "point": ".res .kpi:nth-child(1)"},
    {"t": "Next to it, Revenue needed a month. How much money has to come in to cover everything.", "point": ".res .kpi:nth-child(2)"},
    {"t": "You keep per sale is your price minus what each one costs. That is what pays your monthly bills.", "point": ".res .kpi:nth-child(3)"},
    {"t": "And Margin percent: how many cents you keep out of each dollar a customer pays.", "point": ".res .kpi:nth-child(4)"},
    "Let us try an example together. Say you make candles. You sell each one for ten dollars. The wax, wick and jar cost you four dollars. So you keep six dollars a candle.",
    "Your craft-fair table costs fifty dollars a month, whether you sell or not. Fifty divided by six is a little over eight. So the answer is nine.",
    "Sell nine candles a month and every cost is covered. From the tenth candle on, you are making money.",
    {"t": "Now look at the table under the answers. It is called If your price were. It shows your price now, and ten or twenty percent lower and higher.", "point": "table"},
    "Each row shows the sales you would need at that price. At twelve dollars, only seven candles. At eight dollars, thirteen. Same work, very different month.",
    "If your price is at or below what one costs you, a red message says so plainly: no number of sales will ever break even. The fix is to raise the price.",
    {"t": "Below that is an optional extra: a Cash Flow Tracker spreadsheet that does this plus a twelve-month plan. You do not need it to use Break-Even.", "point": ".cta"},
    "How to start. Type your real price in box one, then what one costs you, then your monthly costs. Read the first answer out loud.",
    "Then try a slightly higher price in the table and see what it does. That is how you pick a price on purpose instead of by guess.",
    {"t": "Your numbers stay only on this phone. There is no account, and nothing is sent anywhere. To clear them, tap Start fresh at the very bottom. It asks you twice first."},
    "Break-Even is free.",
    {"t": "And the question mark button in the corner has the tour and help any time you need them.", "point": "#djDockToggle", "js": "try{ window.scrollTo(0,0); }catch(e){}"}]} },
  name:'Break-Even', em:'🧮', sub:'know your numbers', cat:'free', mem:'Free', price:'Free', testing:false,
  tag:'Price your product — see exactly when you start making money',
  try:A+'breakeven/', video:true,
  train:[
   {t:"Using Break-Even — two minutes to the truth.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#p"},
   {t:"Step one: what do you sell it for? Type your price first.", point:"#p"},
   {t:"Step two: what does each one cost you — supplies, fees, shipping? Then your monthly fixed costs: rent, table fees, software.", point:"#c"},
   {t:"Step three: read the answer. It shows the exact sale where you cross into profit.", point:"#units"},
   {t:"Step four: change the price and look at the table — it shows what ten or twenty percent either way does to the sales you need. That's how you pick a price on purpose instead of by guess.", point:"#tbl"},
   {t:"You'll know it worked when you can say out loud: 'I make money on number twelve.' That sentence is the whole product.", point:"#units"}],
  lines:[
   {t:"This is Break-Even — free, for anyone selling anything.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#p"},
   "The problem: you made a thing, you picked a price… but you honestly don't know when you start making money.",
   {t:"How it works: put in your price, what each one costs you, and your monthly fixed costs — it shows the exact number of sales where you cross into profit.", point:"#c"},
   {t:"Change the price, and the table shows what ten or twenty percent either way would do. Suddenly pricing isn't a guess.", point:"#tbl"},
   {t:"The benefit: you stop selling at a loss without knowing it. Every craft-fair table and side hustle needs this once.", point:"#units"},
   "It's completely free — our gift, and a taste of how we build.",
   {t:"Try it below with your real numbers. It takes two minutes to know the truth.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#p"}]},
 safety: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This video explains My Safety Plan, gently and in plain words. If you need someone right now, Talk to someone now, at the bottom, calls nine-eight-eight.", "point": "#crisis .talk", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ tab('plan'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "First, what a safety plan is. Sometimes a person goes through a very hard time, and may even have thoughts of ending their life. Then it is very hard to think clearly.", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ tab('plan'); window.scrollTo(0,0); }catch(e){}"},
    "A safety plan is a short list, written on a calmer day, of what helps. When a hard moment comes, you do not have to think. You open the plan and follow it.",
    "Counselors and doctors use this kind of plan. The app follows a well-known method called Stanley-Brown safety planning.",
    "It is for anyone who has hard days, and for the people who love them.",
    "Daraja Studio made this app in memory of Ryan.",
    {"t": "Let us look at the screen. At the top is the name, and a small lock. It says private, stays on this device.", "point": "header"},
    {"t": "Under it are three tabs: My plan, Build, edit, and Right now.", "point": ".tabs"},
    {"t": "Build, edit is where the plan is written. Six short steps and one last line. You type a few words in each.", "point": "#t-edit", "js": "try{ tab('edit'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Step one is my warning signs. Signs that a hard time is starting. For example, I stop answering texts.", "point": "#steps .card:nth-child(1)"},
    {"t": "Step two is things I can do on my own to feel a little safer. For example, a walk, a cold shower, or music.", "point": "#steps .card:nth-child(2)"},
    {"t": "Step three is people and places that take my mind off it. Not to talk about the problem, just to be around life.", "point": "#steps .card:nth-child(3)"},
    {"t": "Step four is people I can ask for help. A name and a phone number. People who will pick up.", "point": "#steps .card:nth-child(4)"},
    {"t": "Step five is professionals and agencies, like a counselor or a doctor. The nine-eight-eight Lifeline is already filled in.", "point": "#steps .card:nth-child(5)"},
    {"t": "Step six is making my environment safer: putting distance between you and things you could be hurt with.", "point": "#steps .card:nth-child(6)"},
    {"t": "The last line is the one thing most worth living for, in your own words. It shows first when the plan opens.", "point": "#steps .card:nth-child(7)"},
    {"t": "To add a line, tap plus add another. When you finish, tap Save my plan. It also keeps every word as you type.", "point": "#v-edit > button.btn"},
    {"t": "My plan shows the finished plan, easy to read on a hard day. Each person you added gets a Call button.", "point": "#planBody", "js": "try{ tab('plan'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Right now is for a hard moment. First, an honest check-in. Tap a face. Nobody sees it but you.", "point": "#t-now", "js": "try{ tab('now'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Then breathe with the circle. Tap Start one minute, and breathe in as it grows and out as it shrinks.", "point": "#v-now .card.breathe"},
    {"t": "Below that, your reasons for staying, the things that have helped before, and the people you can reach, each with a Call button.", "point": "#nowPeople"},
    {"t": "Now the most important part. Talk to someone now calls nine-eight-eight, the Suicide and Crisis Lifeline. Free, confidential, day or night, in the US.", "point": "#crisis .talk", "js": "try{ tab('plan'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Under it, more ways to reach out: text nine-eight-eight, emergency nine-one-one, the Veterans line, Spanish, and seven-one-one for deaf or hard of hearing.", "point": "#crisis .toggle", "js": "try{ document.getElementById('crisis').classList.add('open'); }catch(e){}"},
    {"t": "You will reach a real, trained person. It is okay to call just to talk. Outside the US, the app points to findahelpline dot com.", "js": "try{ document.getElementById('crisis').classList.remove('open'); }catch(e){}"},
    "How to start. On a calm day, open Build, edit and write the first three steps. Come back for the rest.",
    "Then show your plan to one person you trust. If you love someone who struggles, fill it out together. That is why this app exists.",
    {"t": "It is completely private. It stays only on this phone, with no account, and nothing is sent anywhere. Save a copy, at the bottom, makes a backup file.", "point": "footer"},
    "My Safety Plan is free, and always will be. It is a tool to keep your plan close, not therapy, and not a substitute for emergency help.",
    {"t": "The question mark button in the corner has the tour and help any time. Take it slowly.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "Filling out My Safety Plan. Do this on a calmer day, maybe with someone you trust or a counselor, so it is ready on a hard one.", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ tab('plan'); window.scrollTo(0,0); }catch(e){}", "point": ".tabs"},
   {"t": "Tap Build, edit at the top. It is six short steps and one last line. You only type a few words in each.", "point": "#t-edit", "js": "try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ tab('plan'); window.scrollTo(0,0); }catch(e){} try{ tab('edit'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step one: my warning signs. The thoughts, moods or situations that tell you a hard time is building. One per line. Plus add another adds a line, and the small x removes one.", "point": "#steps .card:nth-child(1)"},
   {"t": "Step two: things I can do on my own to feel a little safer. Small things that have helped before. A walk, a cold shower, music.", "point": "#steps .card:nth-child(2)"},
   {"t": "Step three: people and places that take my mind off it. Not to talk about it, just to be around life.", "point": "#steps .card:nth-child(3)"},
   {"t": "Step four: people I can ask for help. A name and a phone number for each. Pick people who pick up.", "point": "#steps .card:nth-child(4)"},
   {"t": "Step five: professionals and agencies. Your counselor or doctor. The nine-eight-eight Lifeline is already there for you.", "point": "#steps .card:nth-child(5)"},
   {"t": "Step six: making my environment safer. Who can hold onto things for a while, and where they go. The app says it plainly: this one step saves more lives than any other.", "point": "#steps .card:nth-child(6)"},
   {"t": "The last line: the one thing most worth living for, in your own words. Take your time on this one. It is the first thing you see when the plan opens.", "point": "#steps .card:nth-child(7)"},
   {"t": "Then tap Save my plan. It also keeps your words as you type, so nothing is lost.", "point": "#v-edit > button.btn"},
   {"t": "Your finished plan lives under My plan, easy to read on a hard day. Each person you added gets a Call button.", "point": "#t-plan", "js": "try{ tab('plan'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Right now is for a hard moment: an honest check-in, a breathing circle, and your reasons and your people in one place.", "point": "#t-now", "js": "try{ tab('now'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "And Talk to someone now is always at the bottom, one tap to nine-eight-eight. If you love someone who struggles, fill it out together.", "point": "#crisis .talk", "js": "try{ tab('plan'); window.scrollTo(0,0); }catch(e){}"}],
  name:'My Safety Plan', em:'🫶', sub:'a plan for hard days', cat:'free', mem:'Free', price:'Free forever', testing:true,
  tag:'A private safety plan in your pocket — built in memory of Ryan',
  try:A+'safety/', video:true,
  
  lines:[
   {t:"This is My Safety Plan. It's free, forever — built in memory of Ryan.", js:"try{tab('plan');}catch(e){}"},
   {t:"It's a private safety plan in the proven six-step format counselors use: warning signs, ways to cope, reasons to stay, people to call.", js:"try{tab('plan');}catch(e){}", point:"#planBody"},
   {t:"You fill it out on a calm day — so it's there on a hard one.", js:"try{tab('edit');}catch(e){}"},
   {t:"'Talk to someone now' is one tap: nine-eight-eight, the Suicide and Crisis Lifeline.", js:"try{tab('now');}catch(e){}", point:"#crisis"},
   {t:"It's completely private. No account, nothing leaves your phone.", js:"try{tab('plan');}catch(e){}"},
   "If you love someone who struggles, put this on their phone together. That's the whole reason it exists.",
   {t:"It will never cost anything. Try it below — or share it with someone who needs it today.", js:"try{tab('plan');}catch(e){}"}]},
 feedback: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Feedback Studio. In about four minutes you will know what it is for and how to use it.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); window.scrollTo(0,0); }catch(e){}"},
    {"t": "First, the problem. When someone tries a new app, they notice lots of small things. A button they cannot find. A word they do not understand.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); window.scrollTo(0,0); }catch(e){}"},
    {"t": "But by the time they sit down to write about it, half of it is gone. And a message like, it was confusing, does not help anyone fix anything.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Feedback Studio solves this. You open the app inside Feedback Studio, use it, and say what you think at the same moment. Every comment gets its exact time. At the end it builds one clear report.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); window.scrollTo(0,0); }catch(e){}"},
    "Who is it for? Anyone who builds an app and wants honest reactions, and anyone helping them test it.",
    {"t": "Let us look at the screen. At the top is a box that says paste the address of the app you want to review, and an Open button.", "point": "#urlin"},
    {"t": "In the middle is a list of Quick picks, apps you can try it on straight away. Tap a name and that app opens inside the studio.", "point": "#quickList"},
    "When an app is open, it fills most of the screen. Use it normally: tap, type, scroll. A button at the top left, Start screen, closes it and brings you back here.",
    {"t": "Now the bar at the bottom. The big red button is the microphone. Press it and talk. Each thing you say becomes its own comment.", "point": "#micBtn"},
    "Pause between thoughts. Each pause starts a new comment. If voice does not work on your device, you can type instead.",
    {"t": "Next to it is Point, with a finger. Tap Point, then tap something in the app. It gets an orange outline, and your next comment is about that exact thing.", "point": "#pointBtn"},
    "While pointing is on, taps do not open anything in the app. Tap Stop pointing when you finish.",
    {"t": "The gold button is Mark, with a flag. Tap it at a moment that matters, like when something goes wrong. It drops a marker at that second.", "point": "#recbar .btn.gold"},
    {"t": "The purple button is Screenshot. It takes a picture of the app and keeps it with the report.", "point": "#recbar button[onclick='phoneShot()']"},
    {"t": "The green button, Done, builds the report when you have finished.", "point": "#fsDone"},
    {"t": "And Comments, with a number, opens your list. Here is the comments panel.", "point": "#fsSideBtn", "js": "try{ if(!document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
    {"t": "At the bottom is a box that says or type a comment, with an Add button. Each comment shows its time, and a small x deletes it.", "point": "#typeIn"},
    {"t": "At the top of the panel you choose who the report is for: Claude, ChatGPT, Gemini, or my developer.", "point": "#repFor"},
    {"t": "Then tap I'm done, build the report. Clear, next to it, empties the list and starts fresh.", "point": "#actions .btn.green"},
    "The report lists every comment with its time and the taps you made. Copy to clipboard and Download let you paste it into your A.I. or send it to your developer.",
    "There is also a button called Send to Claude. That one sends the report to the Daraja team, the people who make these apps. Use it when you are reviewing one of ours.",
    {"t": "How to start, in your first two minutes. Tap a quick pick, press the red button, and say one thing you notice. Then open Comments and see it written down with its time.", "point": "#quickList", "js": "try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); window.scrollTo(0,0); }catch(e){}"},
    "A good comment is short and specific. Not, this is bad. Better: I did not understand the word variable in the second box.",
    "Your comments stay on your device until you clear them. If you come back later, it asks whether to keep adding or start fresh. There is no account.",
    "Feedback Studio is the tool my testers use to tell me what they find.",
    "That is all you need. Open an app, talk while you use it, and let the report do the remembering."]} },
  train:[
   {"t": "Using Feedback Studio for the first time. Here is the whole routine. It works on a phone or a computer.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
   {"t": "Step one: open the app you want to review. Paste its address in the box at the top and tap Open, or tap one of the quick picks. The real app appears in the window.", "point": "#urlin", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){} "},
   {"t": "Step two: press the big red button. Your browser asks about the microphone once. Tap Allow.", "point": "#micBtn", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){} "},
   {"t": "Step three: use the app and just talk. Pause between thoughts. Each pause becomes its own comment with its time.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
   {"t": "Step four: want to talk about one exact thing? Tap Point, then tap it in the app. It gets an outline, and your next comment is about it. Tap Stop pointing when you finish.", "point": "#pointBtn"},
   {"t": "Step five: tap Mark, the gold flag, at any moment that matters. Screenshot, next to it, takes a picture of the app for the report.", "point": "#recbar .btn.gold"},
   {"t": "Step six: tap Comments to see everything you said. If voice will not work, type in the box and tap Add.", "point": "#fsSideBtn", "js": "try{ if(!document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
   {"t": "Step seven: pick who the report is for here: Claude, ChatGPT, Gemini, or my developer.", "point": "#repFor"},
   {"t": "Step eight: tap I'm done, build the report. Then Copy to clipboard, or Download, and paste it wherever it needs to go.", "point": "#actions .btn.green"},
   {"t": "You will know it worked when the report reads your own words back with their times. That is a finished session. Tap Start screen at the top to review the next app.", "js": "try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"}],
  lines:[
   {"t": "This is Feedback Studio, for anyone who builds apps, and anyone who tests them.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
   {"t": "The problem: feedback is the hardest part of building. People say looks good, and then never use the thing. Or they forget half of what bothered them by the time they write it down.", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
   {"t": "How it works: the app you are testing opens right here in the window, working for real. Tap one of the quick picks, or paste any app's address at the top and tap Open.", "point": "#quickList", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){} "},
   {"t": "Then press the big red button and just talk while you use it. Every thought becomes a comment, stamped with the exact second you said it.", "point": "#micBtn", "js": "try{ var af=document.getElementById('appframe'); if(af && af.style.display==='none' && !document.getElementById('vidWel')){ var w=document.createElement('style'); w.id='vidWel'; w.textContent='#welcome{display:flex!important}'; document.head.appendChild(w); } }catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djStart,#djTip{display:none!important}'; document.head.appendChild(s); } }catch(e){} try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){} "},
   {"t": "See something worth pointing at? Tap Point, then tap that thing in the app, and your next comment is about it. Tap Mark, with the flag, to say this moment matters.", "point": "#pointBtn"},
   {"t": "No microphone? Type instead. Every comment lands in the Comments list, in order.", "point": "#typeIn", "js": "try{ if(!document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
   {"t": "When you are done, one tap builds a clean report: every comment with its time, and the taps you made. Choose who it is for: Claude, ChatGPT, Gemini, or your developer.", "point": "#repFor"},
   "Copy it or download it, and hand it to whoever is fixing the app. It works with any of them.",
   {"t": "The benefit: honest feedback in five minutes, instead of a meeting nobody schedules. One session can save a week of guessing.", "js": "try{ if(document.body.classList.contains('fsSideOn')) document.getElementById('fsSideBtn').click(); }catch(e){}"},
   "Your comments stay on your own device. There is no account to make.",
   "If you build anything, it saves you an afternoon of notes.",
   "Try it below, on any app you like."],
  name:'Feedback Studio', em:'🎙', sub:'talk while you test', cat:'work', mem:'Comes with the Business membership', price:'$12', testing:true,
  tag:'Use an app, talk out loud — your voice becomes the builder\'s to-do list',
  try:BASE+'feedback-studio/', video:true,
  
  },
 storykeeper: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This video explains In My Own Words from the very beginning. If you have never seen it, that is fine.", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"},
    "Every family has stories: how Grandma met Grandpa, the house she grew up in, the hard years.",
    "But they are almost never written down, and one day they are gone.",
    "In My Own Words asks one gentle question at a time. The person answers out loud, and the app writes the answers into a book, chapter by chapter.",
    "It is for older people who want to leave their story, and often a son, daughter or grandchild who sits beside them and asks.",
    "There are three places: the Home page, the talking screen, and your book. Let us walk down the Home page from the top.",
    {"t": "First, Today's page: a small diary with one question about your day. Pick the kind of page, like My day or Three good things, and tap Talk about today.", "point": "#jCard"},
    {"t": "Below it, a short Let's begin card. Read it once: no typing needed, just sit somewhere quiet and hold the phone close.", "point": "#firstCard"},
    {"t": "Then, Whose story is this. Type the name of the person the book is about. That name goes on the cover.", "point": "#whoName"},
    {"t": "Setting this up for someone else? This button lets you write your own questions for them, and text them a link.", "point": "#askEntry button"},
    {"t": "Next, The people in your story. Type a name, choose how they are related, like Spouse or Grandchild, and tap Add.", "point": "#pName"},
    {"t": "Then, This week's question. A new one every week. Answer one a week, and the book writes itself.", "point": "#qowText"},
    {"t": "Then the heart of it: Chapters of your life. Seven chapters, like Beginnings and Love and marriage, four questions each. Start anywhere.", "point": "#chapGrid"},
    {"t": "Tap a chapter and the talking screen opens. The top line says which question you are on, like one of four. The question is in big letters.", "point": "#qChap", "js": "try{ CUR=null; openChap('begin'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Under it is the big red button. Press it and talk. Press it again when you are done. The first time, the phone asks to use the microphone. Tap Allow.", "point": "#recBtn"},
    {"t": "Your words appear in this box. Heard a wrong word? Tap right in the text and fix it. You can type here too.", "point": "#answer"},
    {"t": "Your real voice is kept as well, so the family can hear it, not just read it.", "point": "#skClips"},
    {"t": "Read it back to me reads your story out loud. Make it book-ready copies it for an AI helper like Claude or ChatGPT to tidy, keeping your voice.", "point": "#scrQ button[onclick=\"readBack()\"]"},
    {"t": "Who is in this story: tap the names of the people who were there. They are printed under the story in the book.", "point": "#qCast"},
    {"t": "A picture from this time? Tap here to add photos from your phone. They go in the book with the story.", "point": "#scrQ .photoBox:not(#polishTip)"},
    {"t": "Save and next question saves and moves on. Back goes to the question before. All chapters takes you home.", "point": "#scrQ button[onclick=\"stepQ(1)\"]"},
    {"t": "Back on Home, near the bottom, is The Key. Write where the photos and important papers are kept. Never passwords.", "point": "#keyText", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Then, See your book so far: the cover with the name, each chapter, each answer, the pictures, and who was there.", "point": "#bookPage .cover", "js": "try{ CUR=null; openBook(); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Read it to me reads the whole book out loud. Print or save as P D F prints it at home, or saves a file to send the family.", "point": "#bookBar button[onclick=\"window.print()\"]"},
    "Your first two minutes: type the name on Home, add one person, then open Beginnings and answer the first question. One story is a book begun.",
    {"t": "Privacy: everything stays on this device. No account, and nothing is sent anywhere unless you choose to share it. So tap Save a backup now and then, and keep the file somewhere safe.", "point": "#scrHome button[onclick=\"backup()\"]", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"},
    "In My Own Words is free. A bound copy you can order is on its way.",
    {"t": "And the question mark button in the corner has the tour, bigger text and help, any time.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "Making a book with In My Own Words. Here's how a good session goes.", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Before you start: sit somewhere quiet, close to the microphone, arm's reach or less. That one habit makes the words come out right.", "point": "#firstCard"},
   {"t": "Step one: type the name of the person whose story this is. It goes on the cover.", "point": "#whoName"},
   {"t": "Step two: add the people of their life. Type a name, choose how they are related, and tap Add. Every story will remember who was there.", "point": "#pName"},
   {"t": "Step three: pick a chapter, press the red button, and just talk, like telling a story at the kitchen table. Press it again when you are done.", "point": "#recBtn", "js": "try{ CUR=null; openChap('love'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Heard a wrong word? Tap right in the words and fix it, or tap Read it back to me and listen.", "point": "#answer"},
   {"t": "Tap the names of the people in this story. Then add a picture from that time, if you have one. The app waits while you find it.", "point": "#qCast"},
   {"t": "Riffed a bit? Make it book-ready copies the story with instructions to paste into an AI helper like Claude or ChatGPT. It smooths the telling but keeps the voice.", "point": "#scrQ button[onclick=\"polishCopy()\"]"},
   {"t": "Tap Save and next question to move on. All chapters takes you back home.", "point": "#scrQ button[onclick=\"stepQ(1)\"]"},
   {"t": "Step four: fill in The Key on the home page. Write where the pictures and accounts are kept, never the passwords themselves.", "point": "#keyText", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step five: tap Save a backup now and then. It makes one small file with every word and picture. Email it to yourself.", "point": "#scrHome button[onclick=\"backup()\"]"},
   {"t": "Then tap See your book so far, and watch a life turn into pages.", "point": "#bookPage .cover", "js": "try{ CUR=null; openBook(); window.scrollTo(0,0); }catch(e){}"},
   {"t": "You'll know it's working when Your Book shows a cover with their name and one real story beneath it. One story is a book begun."}],
  lines:[
   {"t": "This is In My Own Words. Their voice, in a book.", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"},
   "The problem: someone you love is full of stories, and one day the stories go with them. And their forty thousand photos? Scattered, unlabeled, unfindable.",
   {"t": "How it works: sit down together. Pick a chapter of their life, and the app asks a gentle question, like: tell me about the day you met your sweetheart. They press the red button and just talk.", "point": "#recBtn", "js": "try{ CUR=null; openChap('love'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Their words are written down exactly as they said them, and their real voice is kept too. Then the app asks: do you have a picture from this time? I'll wait. Story by story, the photos that matter come out of the pile.", "point": "#scrQ .photoBox:not(#polishTip)"},
   {"t": "Every story remembers who was in it, and the book prints their names under it, so one day a grandchild can find the stories they are part of.", "point": "#qCast"},
   {"t": "There is a small daily diary too. Today's page asks one easy question about your day, and a sentence or two is plenty. Those pages can go in the book as well.", "point": "#jCard", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"},
   {"t": "And at the back: The Key, one page that tells the family where the pictures and accounts live, never the passwords. So nothing is lost.", "point": "#keyText"},
   {"t": "It all becomes a real book you can print at home. Cover, chapters, photos, their exact words.", "point": "#bookPage .cover", "js": "try{ CUR=null; openBook(); window.scrollTo(0,0); }catch(e){}"},
   {"t": "The app is free. Print the book at home, or save it as a P D F to share. A bound copy you can order is on its way. Either way, it's the gift nobody ever forgets getting.", "point": "#bookBar button[onclick=\"window.print()\"]"},
   {"t": "Try it below. Ask someone you love one question tonight.", "js": "try{ CUR=null; goHome(); window.scrollTo(0,0); }catch(e){}"}],
  name:'In My Own Words', em:'📖', sub:'your life, in a book', cat:'later', mem:'Family membership', price:'Free', testing:true,
  tag:'Their voice, in a book — life stories, photos, and The Key. Print the book at home or save it as a PDF; a bound copy you can order is coming.',
  try:BASE+'story-keeper/', video:true,
  
  },
 academy: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This video explains Daraja Academy from the very beginning. If you have never seen it, that is fine.", "point": "#top", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); home(); window.scrollTo(0,0); }catch(e){}"},
    "First, the problem. Everyone is talking about A I. That means artificial intelligence: programs like ChatGPT or Claude that answer questions and write, much the way a person would.",
    "Young people pick these tools up quickly. Many grandparents feel left behind, or a little afraid. And there are new scams: a cheat can now copy a voice and send messages that look real.",
    "Daraja Academy is a short course called A I for Grandparents. Six lessons, about ten minutes each. Big words, one idea at a time, and nothing you do can break anything.",
    "It is for older people who want to understand A I, and often a grandchild sitting beside them. It also makes a lovely gift.",
    {"t": "This is the course home. The green note is your teacher. The first time, it asks your first name. Type it and tap That's me.", "point": ".host"},
    {"t": "Under the teacher, this bar shows how many of the six lessons are finished.", "point": ".progress"},
    {"t": "Then the lesson cards: number, name and minutes. The one outlined in gold is next. Tap a card to open it.", "point": ".lessons .lcard:first-child"},
    {"t": "At the bottom, a wide card for the diploma. It opens when all six lessons are done.", "point": ".lcard.grad"},
    {"t": "Now, inside a lesson. Each page has one idea in big words. The dots at the top show how far along you are.", "point": "#dots", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(1); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Read this page to me reads the page out loud. Tap it again to stop.", "point": "#stage .listen"},
    {"t": "At the bottom, the green button goes forward. It says Next, or something like I'm ready. The white button goes back.", "point": "#stage .navRow"},
    {"t": "Lesson one is Just ask it. It teaches the only rule: talk to it like a person, the way you'd ask a neighbor.", "point": "#stage .card h2", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(2); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Then you practice on a safe practice A I that lives inside the lesson. Tap a question, and its answer appears underneath.", "point": ".askRow", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(3); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Then, Now ask something real. Type your own question. Copy my question copies it, and two buttons open ChatGPT or Claude with it already typed in.", "point": "#myAsk", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(4); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Then the safety rule: a real A I helper never calls you and never asks for money.", "point": "#stage .card h2", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(5); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Every lesson ends with a one-question quiz. Tap A, B or C. Green shows the right answer, with the reason why. Then tap Finish the lesson.", "point": ".quizBtn", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(6); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Lesson two, Spot the fake: messages appear one at a time. For each, tap Fake or Real, and it tells you why.", "point": "#fakeBox", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=2; go(3); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Lesson three, Ask it better: tap the follow-ups and watch the answer change to suit you.", "point": "#stage .pick", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=3; go(2); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Lesson four, Trust, but check: for each answer, decide whether to check it first or just use it.", "point": "#chkBox", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=4; go(3); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Lesson five, Let it write with you: tap who it's to, what it's for, and how it should sound, and the request writes itself.", "point": "#w-to", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=5; go(2); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Lesson six, A I in your pocket: talking instead of typing, showing it a picture, and putting it on your phone's front screen.", "point": "#stage .card a.btn", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=6; go(3); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Stop in the middle, and it opens on the same page next time. Finished lessons get a tick on the course home.", "point": ".progress", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); home(); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Finish all six, and this card opens your diploma, with your name and the date, ready to print.", "point": ".lcard.grad"},
    "Your first ten minutes: type your first name, tap Start lesson one, and go page by page. You'll finish having asked an A I your very first question.",
    "Privacy: everything stays on this device. No account and no password. Nothing you type is sent anywhere, unless you choose to take your question to ChatGPT or Claude yourself.",
    {"t": "The price: lesson one is free, and the whole course comes with the Family membership.", "point": "#stage > p.soft"},
    {"t": "And the question mark button in the corner has the tour, bigger text and help, any time.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "Taking a Daraja Academy lesson. Here's all there is to it.", "point": "#top", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); home(); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step one: the teacher asks your first name. Type it and tap That's me. From then on it greets you by name.", "point": ".host"},
   {"t": "Step two: tap a lesson card to open it. The card outlined in gold is the one to do next, and the bar shows how many of the six you've finished.", "point": ".lessons .lcard:first-child"},
   {"t": "Sit somewhere comfortable, sound on. Every page has a Read this page to me button. Tap it and just listen.", "point": "#stage .listen", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(0); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Go one page at a time with the big green button at the bottom. The white one goes back. Nothing you tap can break anything. That's a promise.", "point": "#stage .navRow", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(1); window.scrollTo(0,0); }catch(e){}"},
   {"t": "The dots at the top show how far through the lesson you are.", "point": "#dots"},
   {"t": "When the lesson asks you to try something, try it. Tap a question, and the practice A I answers right underneath.", "point": ".askRow", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(3); window.scrollTo(0,0); }catch(e){}"},
   {"t": "On Now ask something real, type your own question and tap Copy my question. Buttons then appear to ask it in ChatGPT or Claude.", "point": "#myAsk", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(4); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Every lesson ends with a one-question quiz. Tap A, B or C. Green shows the right answer. Then tap Finish the lesson.", "point": ".quizBtn", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(6); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Stop halfway? It opens right where you left off next time. Back on the course home, each finished lesson gets a tick.", "point": ".progress", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); home(); window.scrollTo(0,0); }catch(e){}"},
   {"t": "After all six, the diploma card opens. Print it, and yes, send a picture of it to the grandkids.", "point": ".lcard.grad"}],
  lines:[
   {"t": "This is Daraja Academy, starting with A I for Grandparents.", "point": "#top", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); home(); window.scrollTo(0,0); }catch(e){}"},
   "The problem: the whole world is talking about A I, and nobody is patiently teaching the people who didn't grow up with it.",
   {"t": "How it works: six short lessons, about ten minutes each. Big print, one thing at a time, and every page can read itself out loud. Like a patient grandson showing you, not a manual.", "point": ".lessons"},
   {"t": "Lesson one: Just ask it. You can't break anything, and the lesson tells you so right there on the very first page.", "point": "#stage .card h2", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(0); window.scrollTo(0,0); }catch(e){}"},
   {"t": "You'll learn the only rule that matters: talk to it like a person, not a computer.", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(2); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Then you try it, safely, with a practice A I that lives right inside the lesson. Tap a question and watch it answer. After that, you ask something real of your own.", "point": ".askRow", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(3); window.scrollTo(0,0); }catch(e){}"},
   {"t": "And the grandparent safety rule: a real A I helper never calls you and never asks for money. The quiz is a voice that sounds just like your grandson, asking for gift cards.", "point": ".quizBtn", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=1; go(6); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Five more lessons follow: Spot the fake, where you practice telling scam messages from real ones. Then Ask it better, Trust but check, Let it write with you, and A I in your pocket.", "point": "#fakeBox", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); lesson=2; go(3); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Finish all six and you get a diploma with your name on it, ready to print. Send a picture to the grandkids. Frame it.", "point": ".lcard.grad", "js": "try{ if(!window.__acSave){ window.__acSave=save; save=function(){}; } try{ voiceOn=false; }catch(e){} if(window.speechSynthesis) speechSynthesis.cancel(); home(); window.scrollTo(0,0); }catch(e){}"},
   "Lesson one is free. The full course comes with the Family membership, and it's a beautiful gift for a parent or grandparent.",
   "Try lesson one below. It only takes ten minutes to feel ten years younger."],
  name:'Daraja Academy', em:'🎓', sub:'six lessons · AI for Grandparents', cat:'later', mem:'Family membership', price:'Lesson 1 free · course $19', testing:true,
  tag:'AI for Grandparents — learn to use AI, the patient way. Why not just open ChatGPT? Because nobody shows you how. This does: big print, one step at a time, out loud.',
  try:BASE+'academy/', video:true,
  
  },
 thekey: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains The Key: what it is for, and how to use it.", "js": "try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}"},
    "First, the problem. In many families, one person knows where everything is. Where the papers are. Which bank. Who to call.",
    "If that person gets sick or passes away, the family can spend months searching. Papers get lost. Money is forgotten in an account. Photos stay locked inside a phone.",
    "The Key fixes that. It is one page that tells your family where everything lives. You fill it in once, and you print it.",
    "It is for anyone who wants to spare their family the hunt: older adults, and the children and grandchildren who help them.",
    "One very important rule. The Key never holds passwords or PIN numbers. You only write where they are kept, like the red notebook in the desk.",
    {"t": "At the top is a bar that shows how ready your Key is. It fills up as you add things, and tells you when it is ready to print.", "point": "#djKeyMeter"},
    {"t": "Below are five sections. Tap a section's title to open it, or to fold it away. A tick shows the ones you have started.", "js": "try{var c=document.getElementById('card_f1');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#card_f1 summary"},
    {"t": "Section one is My pictures live here: a phone, a computer, a cloud, or the albums in the closet. Tap Add a place your pictures live.", "point": "#ksAdd_f1"},
    "A panel slides up. Tap what kind it is, like Phone. Write which one exactly, and who can get in. Then tap Save, and your line shows in the section. Edit opens it again later.",
    {"t": "Section two is My accounts that matter: email, bank, credit cards, subscriptions. There is a box for where your password list is kept. Write the place, never the password.", "js": "try{var c=document.getElementById('card_f2');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f2"},
    {"t": "Section three is Important papers: a will, a trust, a deed, titles, insurance. Write where each paper is kept, and who has a copy.", "js": "try{var c=document.getElementById('card_f3');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f3"},
    {"t": "Section four is The people who know things: the lawyer, the accountant, the doctor, the pastor. Add a name and a phone number. On an iPhone, you can fill one in from your contacts.", "js": "try{var c=document.getElementById('card_f4');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f4"},
    {"t": "Section five is Anything else they should know. It is one open box for a wish, an instruction, or a kind word, in your own words.", "js": "try{var c=document.getElementById('card_f5');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#f5"},
    {"t": "Each section also has an Other notes box, for anything that does not fit a line.", "js": "try{var c=document.getElementById('card_f1');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#f1"},
    {"t": "Under the sections is a note on safety. It says the rule again: never write real passwords here.", "js": "try{var e=document.querySelector('.safety');if(e)e.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}", "point": ".safety"},
    {"t": "Then comes the big button, Print my Key. You get a clean page with every section, dated today. If the page is empty, it asks you to write one line first.", "js": "try{var e=document.querySelector('.btn.wide');if(e)e.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}", "point": ".btn.wide"},
    "Print two copies: one for a drawer at home, and one for the person you trust most.",
    "There is nothing to save by hand. Every word saves on this device as you type, or when you tap Save.",
    "Here is how to start. Open section one, and add one place your pictures live. Then open section three, and write where your will or insurance papers are. Even one line helps them someday.",
    "When life changes, open it again, change a line, and print a fresh copy. The new date shows which page is the latest.",
    "Everything stays on this device. There is no account, and nothing is sent anywhere.",
    "The Key is free, forever. Daraja's profits help students in Kenya stay in school.",
    {"t": "The round question mark button in the corner has the tour, help and settings, any time.", "js": "try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}", "point": "#djDockToggle"}]} },
  train:[
   {"t": "Filling out The Key takes about five minutes. It is one page, in five sections. Tap a section's title to open it.", "js": "try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}", "point": "#card_f1 summary"},
   {"t": "Section one: where your pictures live. Tap Add a place your pictures live, pick the kind — phone, cloud, albums — and say who can get in. Then Save.", "js": "try{var c=document.getElementById('card_f1');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f1"},
   {"t": "Section two: accounts that matter. For each one, write where the password list is KEPT — the notebook, the safe — never the password itself.", "js": "try{var c=document.getElementById('card_f2');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f2"},
   {"t": "Section three: the papers. Will, deed, insurance — where each one is kept, and who has a copy.", "js": "try{var c=document.getElementById('card_f3');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f3"},
   {"t": "Section four: the people who know things. The lawyer, the accountant, the grandson who does computers. Add a name and a phone number.", "js": "try{var c=document.getElementById('card_f4');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f4"},
   {"t": "Section five: anything else they should know. A wish, an instruction, a kindness, in your own words. Every box saves as you type.", "js": "try{var c=document.getElementById('card_f5');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#f5"},
   {"t": "Then tap Print my Key, and print two: one for the drawer, one for the person you trust most. The date prints on the page, so update it when life changes.", "js": "try{var e=document.querySelector('.btn.wide');if(e)e.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}", "point": ".btn.wide"},
   {"t": "You'll know it's done when the printed page is in the drawer and the person you trust has their copy. That's the whole job.", "js": "try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}", "point": "#djKeyMeter"}],
  lines:[
   {"t": "This is The Key — free, forever. The most loving page you'll ever print.", "js": "try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}", "point": "#top"},
   {"t": "The problem: your pictures are on a phone, in a cloud, on an old computer. Your papers are in a drawer somewhere. And the only person who knows where everything is… is you."},
   {"t": "The Key is one page: where the pictures live, where the passwords are kept, where the papers are, and who to call.", "js": "try{var c=document.getElementById('card_f1');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#card_f1 summary"},
   {"t": "There are five short sections: your pictures, your accounts, important papers, the people who know things, and anything else they should know. A few lines each.", "js": "try{var c=document.getElementById('card_f2');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#card_f2 summary"},
   {"t": "Each line is a tap or two: what kind it is, where it is, and who can get in. Every word saves as you type.", "js": "try{var c=document.getElementById('card_f1');if(c){c.open=true;c.scrollIntoView({behavior:'smooth',block:'start'});}}catch(e){}", "point": "#ksAdd_f1"},
   {"t": "Five minutes, once. Then print two copies — one for the drawer, one for the person you trust most.", "js": "try{var e=document.querySelector('.btn.wide');if(e)e.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}", "point": ".btn.wide"},
   {"t": "Never the passwords themselves — just where they're kept. And nothing is sent anywhere; it stays on your device.", "js": "try{var e=document.querySelector('.safety');if(e)e.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}", "point": ".safety"},
   {"t": "When life changes, change a line and print a fresh copy. The date on the page shows which one is newest."},
   {"t": "When the day comes, your family won't have to be detectives. They'll have The Key.", "js": "try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}", "point": "#djKeyMeter"},
   "It's free. Fill yours out tonight — and send this to your parents while you're at it."],
  name:'The Key', em:'🔑', sub:'where everything is', cat:'home', mem:'Free', price:'Free forever', testing:false,
  try:BASE+'thekey/', video:true,
  
  tag:'One page that tells your family where everything lives',
  },
 occ: {
  name:'OCC Box Counter', em:'📦', sub:'count what\'s ready', cat:'off', off:'absorbed — Shoebox Counter is the same app, and this free twin competed with it', mem:'Church membership', price:'Free', testing:false,
  tag:'Shoebox-packing inventory — how many boxes can we build?',
  try:A+'occ/', video:true,
  train:[
   {t:"Using the Box Counter at a packing party — here's the routine.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#canN"},
   {t:"Step one: count what's on the table. Big plus and minus buttons; tap an item's name for plus five and plus ten.", point:"#listBox"},
   {t:"Step two: mark what goes in EVERY box — soap, toothbrush, washcloth — with the 'every box' toggle.", point:"#listBox"},
   {t:"Step three: read the dashboard: READY TO BUILD tells you how many complete boxes you can make, and what you're short on.", point:"#canN"},
   {t:"Step four: as you pack, count down. When it says you're short on washcloths — that's your shopping list.", point:"#listFill"},
   {t:"You'll know it's working when the dashboard says READY TO BUILD and a number. That number is the whole answer.", point:"#canN"}],
  lines:[
   {t:"This is the Box Counter — free, for shoebox-packing teams.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#canN"},
   "The problem: a table full of soap, toothbrushes, and toys — and no idea how many complete boxes you can actually build.",
   {t:"How it works: count your items with big plus and minus buttons. Mark what goes in every box.", point:"#listBox"},
   {t:"The dashboard answers the only question that matters: 'READY TO BUILD: this many boxes' — and exactly what you're short on.", point:"#canN"},
   {t:"Made for shoebox packing parties, church tables, and garage inventories.", point:"#listFill"},
   {t:"It's free. Try it below — your next packing day will thank you.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#canN"}]},
 zuri: {
  name:'Zuri Ops', em:'📡', sub:'run the field team', cat:'off', off:'private — the tool for running the ISP in Maai Mahiu, not for sale', price:'Ask us', testing:false,
  tag:'Field operations for a small ISP — works with no signal',
  try:A+'zuri/', video:true,
  train:[
   {t:"Zuri Ops for the field — the daily rhythm.", js:"try{go('today');}catch(e){}"},
   {t:"Morning: open the app, confirm your float — the cash you're starting with.", js:"try{go('today');}catch(e){}", point:"#kBank"},
   {t:"During the day: log each expense and payment as it happens. It works with no signal; everything waits.", js:"try{go('bills');}catch(e){}"},
   {t:"It learns your habits and warns you before the float runs out.", js:"try{go('today');}catch(e){}", point:"#alerts"},
   {t:"Friday: the Friday Report builds itself — and when the phone finds internet, everything syncs to the HQ dashboard on its own.", js:"try{go('report');}catch(e){}"}],
  lines:[
   {t:"This is Zuri Ops — built for a real internet company in Maai Mahiu, Kenya.", js:"try{go('today');}catch(e){}"},
   {t:"It's field operations on one phone: cash counts, expenses, bills, the Friday Report.", js:"try{go('today');}catch(e){}", point:"#kBank"},
   {t:"It learns your habits, forecasts when the float runs out, and syncs to a headquarters dashboard whenever it finds internet.", js:"try{go('report');}catch(e){}"},
   {t:"Built for teams that work where the signal doesn't — everything works offline first.", js:"try{go('bills');}catch(e){}"},
   "If you run a small field team anywhere in the world, this pattern fits you too. Ask us.",
   {t:"Try the demo below and see a day in the field.", js:"try{go('today');}catch(e){}"}]},
 compass: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Daraja Compass. In about four minutes you will know what it is for and how to use it.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "First, the problem. Many people have a dream. A trade. Their own small business. A good job, a home of their own. But the dream feels far away, and nobody shows them the first step.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} "},
    {"t": "So the years pass, and the dream stays a dream.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Compass helps you turn a dream into a plan. You answer fifteen plain questions about yourself and your future.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Then it writes a picture of your life five years from now, in your own words. And it helps you walk backward from that picture to one small step you can take this month.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Who is it for? A young person finishing school, a student, someone starting over. A parent or a mentor can sit beside them while they do it.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Let us look at the screen. At the top is the name, Daraja Compass. Your life, mapped by you.", "point": "header h1", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='hello'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Under it, a gold box says what Compass is for, in plain words.", "point": "#cpIntro", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "The first card asks: Where are you going? Under it is a Bible verse that changes every day.", "point": "#main .verse", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Tap Start my Compass to begin. It takes about ten minutes.", "point": "#main .go", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Now the questions come one at a time. At the top it says question one of fifteen, and a gold bar fills as you go.", "point": "#main .prog", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=0; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "The first questions are easy: your name, then your age. Type in the box, or tap the microphone and just talk.", "point": "#mic", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Next saves your answer and moves on.", "point": "#main .nav .go", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Many questions have example answers you can tap. Tap one and it goes into the box. Then change the words so they fit you.", "point": "#main .chips", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=2; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Some questions are just a choice, like marriage in the next five years: Yes, Maybe, or Not in five years. Tap one. No typing.", "point": "#main .chips", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=8; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Back goes to the question before. You can skip anything, and there are no wrong answers.", "point": "#main .nav .bk", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "One question asks what monthly income would make that life possible. Compass uses that number later for some simple money math.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "On the last question the button says Paint my picture.", "point": "#main .nav .go", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=14; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Compass writes your five-year picture: your work, your money, your home, your faith, and how you help others.", "point": ".portrait", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='portrait'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "If it is not right, tap Change answers. If it is the life you want, tap Yes, build my path.", "point": "#main .nav .go", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Now the clever part. Compass walks backward from the dream. For each goal there are lines with a time in gold: five years, three years, two years, one year, six months, and this month.", "point": "#main .card", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='goals'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "On each line you write what has to be true by then. To be an electrician in five years, maybe in one year you must finish the course.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "The last line, this month, matters most. One small step you can do in the next few weeks, with a date. Visit a college. Ask one question. Open a savings account.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Then tap Save my path, my Compass, and you arrive at your Compass home. At the top it counts Goals met.", "point": "#main .card .big", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='home'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
    {"t": "The card called This month shows your small steps. When you finish one, tap its box. It turns green with a tick, and you get a star.", "point": "#main .card:nth-of-type(2)", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Every twenty-eight days, Compass asks how the month went. Tick what happened, move what slipped, and write next month's step.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "The printer button at the top prints the screen you are on, handy for your five-year picture or your path.", "point": "header button", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Everything saves on this phone as you go. There is no account, and nothing is sent anywhere.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "Daraja Compass is free.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
    {"t": "And the question mark button in the corner has the tour and help any time you need them.", "point": "#djDockToggle", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(window.__cv){ db.view=window.__cv.v; db.qi=window.__cv.qi; render(); window.scrollTo(0,0); } }catch(e){}"}]} },
  train:[
   {"t": "Using Daraja Compass. Give it a quiet ten minutes.", "point": "#main .go", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='hello'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step one: tap Start my Compass. The questions come one at a time, and the gold bar shows how far you are.", "point": "#main .prog", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=0; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step two: answer in the box. Or tap the microphone and just talk. Next saves the answer and moves on.", "point": "#mic", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "Step three: when the words will not come, tap one of the example answers. It drops into the box, and you change it to fit you.", "point": "#main .chips", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=2; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Some questions are just a choice. Tap one. Back goes to the question before, and you can skip anything.", "point": "#main .nav .bk", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=8; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step four: on the last question the button says Paint my picture. Read your five-year picture. Change answers if it is not right. If it is, tap Yes, build my path.", "point": ".portrait", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='portrait'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step five: on each line of your path, write what has to be true by then. The last line, This month, is one small step with a date.", "point": "#main .card", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='goals'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step six: tap Save my path, my Compass. Your Compass home shows Goals met, and your steps for this month.", "point": "#main .card .big", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='home'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step seven: when you do a step, tap its box. It turns green and adds a star. Every twenty-eight days, do the monthly check-in.", "point": "#main .card:nth-of-type(2)", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "You will know it worked when you can say out loud the one thing you are doing this month. Come back in a season and see what moved.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(window.__cv){ db.view=window.__cv.v; db.qi=window.__cv.qi; render(); window.scrollTo(0,0); } }catch(e){}"}],
  lines:[
   {"t": "This is Daraja Compass. It is free, and it is for a young person starting out, or anyone starting again.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "The problem: big dreams stay vague. Someday I will have my own shop. Without a plan, someday never comes, and nobody sits down and asks you the right questions.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "It asks the questions a good mentor would ask: where you come from, what you are good at, what work you want, what you hope for your home, your faith and your money.", "point": "#main .go", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='hello'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Fifteen plain questions, one at a time. Every one has answers you can tap, and a microphone so you can talk instead of type.", "point": "#main .chips", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='q'; db.qi=2; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Then Compass paints a picture of your life five years from now, written from your own answers.", "point": ".portrait", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='portrait'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "If it is the life you want, it walks backward from it. What has to be true in three years, in one year, in six months, and this month.", "point": "#main .card", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='goals'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Every path ends the same way: one small, dated step you can take this month.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "Your Compass home keeps those steps in front of you. Tick one off and you get a star. Every twenty-eight days it asks how the month went.", "point": "#main .card .big", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(!document.getElementById('vidHide')){ var s=document.createElement('style'); s.id='vidHide'; s.textContent='#djTip,#djStart{display:none!important}'; document.head.appendChild(s); } if(!window.__cv) window.__cv={v:db.view,qi:db.qi}; }catch(e){} try{ db.view='home'; render(); setTimeout(function(){ if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); },150); window.scrollTo(0,0); }catch(e){}"},
   {"t": "There is money math too: what your picture needs each month. And the printer button prints your picture or your path, to keep on the wall.", "point": "header button", js:"try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "A Bible verse at the start keeps it grounded.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "It takes about ten minutes. Everything stays on your phone. No account, and nothing is sent anywhere.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){}"},
   {"t": "It is free. Give it a quiet ten minutes, and see your next five years on one page.", "js": "try{if(typeof place==='function'&&!place())setPlace('ke');}catch(e){} try{ if(window.__cv){ db.view=window.__cv.v; db.qi=window.__cv.qi; render(); window.scrollTo(0,0); } }catch(e){}"}],
  name:'Daraja Compass', em:'🗺️', sub:'your next five years, on one page', fresh:true, cat:'free', mem:'Free', price:'Free', testing:true,
  tag:'For a young person starting out: plain questions about school, work, family and money, and your next five years on one page. Written with Kenyan students in mind.',
  try:A+'compass/', video:true,
  
  },

 /* ── WORK SHELF addition ── */
 drumbeat: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    "Welcome. This short video explains Message Assistant. In about four minutes you will know what it is for and how to use it.",
    {"t": "First, the problem. Your group has something coming up. A fundraiser, a rummage sale, a new service time, a grand opening.", "js": "try{ window.scrollTo(0,0); }catch(e){}"},
    "You send one message a week before. Many people miss it. Others forget. On the day, only a few come.",
    "Big organizations send a plan of messages instead: a save the date, a reminder, a phone call, a poster, a nudge the day before, a thank you after. That is a campaign.",
    "Message Assistant helps a small group do the same, without a marketing team and without a monthly bill.",
    "Who is it for? Church volunteers, school clubs, small business owners, nonprofits. Anyone who needs people to show up.",
    "One important thing first. Message Assistant never sends anything by itself. It plans and it writes. You decide when to press send, from your own phone.",
    {"t": "Let us look at the screen. Section one is called Tell it once. Here you answer five questions.", "point": "#setupCard"},
    {"t": "What are you promoting? For example, Fall Kickoff Party.", "point": "#q_what"},
    {"t": "The big day, or deadline. Tap the box and choose the date.", "point": "#q_when"},
    {"t": "Who needs to hear about it? Type your groups, with commas between them. For example, members, neighborhood families.", "point": "#q_who"},
    {"t": "What do you want them to do? Show up Saturday, come to the sale, give online.", "point": "#q_goal"},
    {"t": "And Anything else that matters is for details and tone, like free food, family-friendly, warm and fun, not salesy.", "point": "#q_more"},
    "Your answers are kept on this phone, even if you leave and come back.",
    {"t": "The next card is Your groups. It is optional. Tap Add a group, type a name like members, then paste their emails or phone numbers once.", "point": "#groupsList + button"},
    "Then any email aimed at that group goes to all of them in one tap, from your own email. Use the same group names you typed in section one, so they match.",
    {"t": "Section two is called Let your AI build the campaign. Tap Copy the campaign prompt. It writes the question for you.", "point": "button[onclick='copyPrompt()']"},
    {"t": "Open Claude or ChatGPT, whichever you use, paste, and send. The A.I. writes the whole campaign. Copy its answer, paste it in this box, and tap Build my plan.", "point": "#aiPaste"},
    {"t": "No A.I. yet? Tap Show me a finished example first, and you can see a real plan before you make your own.", "point": "button[onclick='loadExample()']"},
    "Your plan appears in section three, one day at a time. Each piece shows its type: email, text, calls, artwork, or social. It shows who it is for, and the full message, ready to use.",
    "Under each piece are buttons. Copy copies the words. A text has Open in Messages, and an email has Open in email. These only open your own app with the words ready. Nothing goes until you press send there.",
    "When you have sent a piece, tap mark sent. For a call or a poster, it says mark done. The piece changes, so you always know what is finished.",
    "At the top of the plan, Put every piece on my calendar saves a file that makes your phone remind you when each piece is due. Print the plan gives you a paper copy.",
    "How to start, in your first two minutes. Fill in the five questions for one real event. Then tap Show me a finished example first, so you know what you are about to get.",
    "When you are ready, copy the prompt into your A.I., paste the answer back, and put the pieces on your calendar.",
    "Everything stays on this phone. There are no accounts and no mailing service to sign up for.",
    "Message Assistant comes with the Business membership.",
   "New in November: every piece written for a text message now offers WhatsApp as well as Messages, so a church or family group chat is one tap away.",
    {"t": "And the question mark button in the corner has the tour and help any time you need them.", "point": "#djDockToggle", "js": "try{ window.scrollTo(0,0); }catch(e){}"}]} },
  train:[
   "Using Message Assistant. Ten minutes, and your whole campaign is planned.",
   {"t": "Step one: Tell it once. Type what you are promoting, for example a fall kickoff party, or the giving campaign.", "point": "#q_what", "js": "try{ window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step two: tap The big day and pick the date. Then type who needs to hear about it, your groups with commas between them, and what you want them to do.", "point": "#q_when"},
   {"t": "Step three: the last box, Anything else that matters, is for the tone and the details. Free food, family-friendly, warm and fun.", "point": "#q_more"},
   {"t": "Step four, optional: under Your groups, tap Add a group. Give it a name, then paste that group's emails or phone numbers once. Use the same names you typed above.", "point": "#groupsList + button"},
   {"t": "Step five: tap Copy the campaign prompt. Open Claude or ChatGPT, paste it, and send.", "point": "button[onclick='copyPrompt()']"},
   {"t": "Step six: copy the A.I.'s whole answer, paste it in this box, and tap Build my plan. Want to see one first? Show me a finished example.", "point": "#aiPaste"},
   "Step seven: read your plan, day by day. Each piece says what it is, who it is for, and the full words, ready to use.",
   "Step eight: tap Put every piece on my calendar. Open the file, and your phone reminds you on the right day.",
   "Step nine: when a piece is due, tap Copy, or Open in Messages, or Open in email. Your own app opens with the words ready. You press send. Then tap mark sent, or mark done, and the piece turns green.",
   "You will know it is working when your phone buzzes, you open Message Assistant, and the next piece is already written. New campaign clears the plan for the next one, and keeps your groups."],
  name:'Message Assistant', em:'📣', sub:'one message, every channel', cat:'work', mem:'Comes with the Business membership', price:'$19 one-time', testing:true, video:true,
  tag:'Tell it your news once — it writes the whole campaign and tells you when to send each piece. Why not just ChatGPT? You’d have to know what to ask. This asks for you, then lays out every piece on a calendar.',
  try:BASE+'drumbeat/',
  lines:[
   {t:"This is Message Assistant, and it is for anyone who has to tell the same news to a lot of people.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#setupCard"},
   "A fundraiser, a rummage sale, a new service time, a grand opening. You know what you want to say. What wears you out is saying it eleven times — the email, the text, the Facebook post, the bulletin, the reminder, the last call.",
   {t:"With Message Assistant you tell it once. What is happening, when, and who needs to know.", point:"#q_what"},
   {t:"Then it hands you a written question to paste into whichever A.I. you already use — Claude, or ChatGPT, whichever you like. Paste the answer back, and Message Assistant has your whole campaign: every message, for every channel, in the right order.", point:"#aiPaste"},
   {t:"It lays them out day by day, so you can see the drumbeat build — the announcement, the reminder, the day-before nudge, the thank you.", point:"#aiPaste"},
   {t:"Download the calendar file and your phone buzzes when each piece is due. Open Message Assistant, tap the piece, and fire it.", point:"#groupsList"},
   {t:"And here is the part that matters: nothing sends itself. It goes from your own email, your own Messages, your own account — so there is no mailing service to sign up for and no monthly bill. Message Assistant plans and writes; you press send.", point:"#groupsList"},
   {t:"New in November: a text piece gives you two links — Open in Messages, or WhatsApp. A text message cannot reach a group chat; WhatsApp can.", point:"#aiPaste"},
   {t:"It comes with the Business membership. Try it below.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#setupCard"}]},


 /* ── TEMPLATES & PLANS — the things you download rather than open.
      Real, packaged products sitting in Daraja Studio/Business & Community Line/Products
      and the Nourish Line, with the prices from their own listings. ── */
 tplcashflow: {
  name:'Cash Flow Tracker', em:'📈', sub:'know what is coming, and when', cat:'work',
  price:'$12', kind:'download', file:'Excel · Google Sheets · Numbers',
  tag:'Twelve months of money in and money out, adding itself up — with a break-even line so you know the number you have to hit',
  inside:['12-month cash flow — income, fixed costs and variable costs, totalled by month and by year',
   'Running cash balance — each month’s ending cash rolls into the next, so you can watch your runway',
   'Break-even calculator — how many sales a month until you stop losing money',
   'Price what-if table — your break-even at five different price points, before you change anything',
   'Start Here guide — set up in under five minutes: blue cells you type in, black cells work themselves out']},
 tplinvoice: {
  name:'Invoice &amp; Estimate Pack', em:'💵', sub:'send it, and get paid', cat:'work',
  price:'$9', kind:'download', file:'Excel or Google Sheets + email scripts',
  tag:'A clean invoice, a matching estimate with deposit terms, a log that tracks who owes you what, and five chase-up emails already written'},
 tplcontent: {
  name:'Content &amp; Social Planner', em:'📅', sub:'a month of posts, planned', cat:'work',
  price:'$14', kind:'download', file:'Excel or Google Sheets',
  tag:'Plan a month of posts in one sitting instead of panicking every morning'},
 tplsop: {
  name:'SOP Template Library', em:'📚', sub:'how we do things here', cat:'work',
  price:'$22', kind:'download', file:'Word + Excel',
  tag:'Write down how the work is actually done, so the job can be handed over without it living in one person\u2019s head'},
 tplonboard: {
  name:'Client Onboarding Kit', em:'🤝', sub:'start every job the same way', cat:'work',
  price:'$18', kind:'download', file:'ZIP — a PDF, four editable documents and a spreadsheet',
  tag:'The whole first fortnight with a new client: what to send, what to ask, what to say, and where to track it — so nobody ever starts from a blank page',
  inside:['Start Here guide (PDF) — the order to use everything in',
   'Client intake form — 18 questions that become your project brief, and your cover when the scope is questioned later',
   'Contract checklist — 13 things the agreement must cover before you start, including the clause that stops scope creep',
   'Kickoff call agenda — a 30-minute structure, the questions to ask, and the recap-email habit that turns a conversation into a written agreement',
   'Six email scripts — welcome, gentle nudge, “that is extra”, late payment, final delivery, and the review ask',
   'Project tracker (spreadsheet) — every client, milestone and unpaid balance on one screen, with status dropdowns and balances that add themselves']},
 tplbundle: {
  name:'The Whole Toolkit', em:'🧰', sub:'all five, together', cat:'work',
  price:'$49 (worth $75)', kind:'download', file:'everything above',
  tag:'All five business kits in one download \u2014 $75 of things for $49'},
 nourishdairy: {
  name:'Dairy-Free Family Dinners', em:'🥗', sub:'a fortnight of real dinners', cat:'home',
  price:'$12', kind:'download', file:'PDF \u2014 print or keep on your phone',
  tag:'Two weeks of dinners the whole family eats, with the shopping list written for you \u2014 no dairy, no fuss, no separate meal for one child'},
 nourishpeanut: {
  name:'Peanut-Free Family Kitchen', em:'🥪', sub:'safe food, without the fear', cat:'home',
  price:'$12', kind:'download', file:'PDF \u2014 print or keep on your phone',
  tag:'How to feed a peanut-allergic child without living in fear of the kitchen \u2014 meals, label-reading, and what to tell school and grandparents'},

 /* ── FOR FANS & LEAGUES ── */
 pitwall: {
  train:[
   {"t": "Let's set up Pit Wall for your league. Five minutes, then it runs every race weekend for you.", "js": "try{ go('setup'); }catch(e){}"},
   {"t": "Step one: Setup. Under Players and league, put in each player's name and pick the commissioner. Everyone else needs only a PIN of four to six digits the first time they open the app.", "point": "nav.tabs button[data-tab='setup']"},
   "Step two: Season. Choose the year, how many drivers each team gets, and how many drives each driver is allowed. The app works out the rest from the real calendar, including canceled races.",
   {"t": "Step three: Rosters. Either run the draft room, which fills the rosters for you, or type each player's drivers in by hand. If you are joining mid-season, use Starting point to enter everyone's current points and drives used, exactly as they stand today.", "point": "#view .card h2", "js": "try{ go('draft'); }catch(e){}"},
   "Step four: Scoring. The defaults are twenty down to one for the race, ten down to one by qualifying row, and a five point fastest lap bonus. Change any number, and every future race scores your way.",
   {"t": "Step five: the mailbox. Open Mailbox in Setup and follow its five short steps, or the mailbox setup page that walks you through them. Paste the link and tap Connect. That one link is what you text the group. Their phones connect on their own.", "js": "try{ go('setup'); }catch(e){}"},
   {"t": "Step six: race weekend. On Home, each player taps two drivers before the deadline, or plays a wild card. Anyone late gets auto-drafted. Results arrive by themselves after the race.", "js": "try{go('home')}catch(e){}", "point": "nav.tabs button[data-tab='home']"},
   {"t": "Step seven: if something needs fixing, the commissioner can enter picks for anyone from Home, add a missed weekend under Backfill picks in Setup, or adjust a score from that race's breakdown in Standings. Every change shows its work.", "point": "nav.tabs button[data-tab='standings']", "js": "try{ go('standings'); }catch(e){}"},
   "You'll know it's set up right when Home shows the next race, your drivers, and the deadline, and the Standings match the last post your commissioner made by hand."],
  lines:[
   {"t": "This is Pit Wall, for the friend group that has run its own fantasy racing league by group text for years.", "js": "try{ go('home'); }catch(e){}"},
   "One friend is the commissioner. Every weekend he collects the picks, does the math by hand, and posts the standings. One slip, and it gets argued about for a month.",
   "Pit Wall does the commissioner's job, the same way every time, on everyone's phone.",
   {"t": "This is the weekend card. It knows the real calendar and the deadline. Tap two drivers, then Send my picks.", "point": ".weekend"},
   {"t": "Miss the deadline? The house rule kicks in: it drafts your two highest placed drivers who still have drives. No midnight texts, no favors.", "point": "nav.tabs button[data-tab='races']", "js": "try{ go('races'); }catch(e){}"},
   {"t": "After the checkered flag, results arrive on their own. Twenty points for the win down to one for twentieth, qualifying by grid row, and a bonus for fastest lap. Every number shows its work.", "point": "nav.tabs button[data-tab='standings']", "js": "try{ go('standings'); }catch(e){}"},
   {"t": "Standings race by race, and last year's champion on the front page. That matters more than anyone admits.", "point": "#view .tablewrap"},
   {"t": "The usage board shows how many drives everyone has left on each driver, and who still has a wild card in their pocket.", "point": "nav.tabs button[data-tab='usage']", "js": "try{ go('usage'); }catch(e){}"},
   {"t": "On race day, the Live tab shows what every team would score if the race ended right now.", "point": "nav.tabs button[data-tab='live']", "js": "try{ go('live'); }catch(e){}"},
   {"t": "The paddock is for trash talk. It was always the best part.", "point": "nav.tabs button[data-tab='paddock']", "js": "try{ go('paddock'); }catch(e){}"},
   {"t": "And it bends to your rules. The commissioner sets the players, drivers, drives, wild cards, deadline and every point value, and can fix picks or points for anyone.", "point": "nav.tabs button[data-tab='setup']", "js": "try{ go('setup'); }catch(e){}"},
   {"t": "Once a year there is a draft room: draw the snake order, and everyone picks a driver in turn until the teams are full. The finished draft becomes the season's rosters.", "point": "#view .card h2", "js": "try{ go('draft'); }catch(e){}"},
   {"t": "No accounts, no ads. One shared mailbox your league owns, and the same link on every phone. This preview is a test drive, so you can act as any of the five players.", "js": "try{ go('home'); }catch(e){}"},
   "Nine dollars covers a league for a season, and you only pay for the seasons you play. Try it below, and tell us honestly whether your league would pay for it."],
  name:'Pit Wall', em:'🏁', sub:'your racing league, run for you', cat:'home', price:'$9 per season you play — nothing renews', testing:true, video:true,
  tag:'Picks, deadlines, scoring and standings for your friends’ fantasy racing league, done the same way every race. The commissioner finally gets to watch. Pay only for the seasons you play; nothing renews by itself.',
  try:BASE+'f1/?test=1',
  
  
  extra:{
   firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This video explains Pit Wall from the very beginning. If you have never seen it, that is fine.", "js": "try{ go('home'); }catch(e){}"},
    "The problem: lots of friend groups run a fantasy Formula One league by group text. One person, the commissioner, collects picks, counts drives in a notebook, and adds up points by hand.",
    "Until someone misses a text, or the math is off by a point.",
    "Pit Wall does the commissioner's job: picks with a real deadline, scoring done for you, and standings everyone sees on their own phone.",
    "It is for friends or family who already play, and especially the commissioner, who finally gets to watch the race.",
    {"t": "What you see here is a pretend league: five made-up players and made-up points. Look around freely. Nothing here is real.", "point": "#pwDemo"},
    {"t": "At the top: the league name and the season. Until your group connects a shared mailbox, it says this device only.", "point": "#hdrSub"},
    {"t": "This button is your name. In a real league you tap it, choose who you are, and set a PIN of four to six digits, so nobody else can enter your picks.", "point": "#meBtn"},
    {"t": "Along the bottom are seven tabs: Home, Standings, Usage, Races, Live, Paddock and Setup.", "point": "nav.tabs"},
    {"t": "Home starts with the last race: the podium, and who in your group scored most.", "point": "#view > .card"},
    {"t": "Then the race weekend card: the next Grand Prix, its session times, and exactly when picks are due, in your own time zone.", "point": ".weekend"},
    "Each player has a set of drivers, four to start with. Before the deadline you tap two to run this weekend, then tap Send my picks. Each driver shows how many drives he has left.",
    "A couple of times a season you can play a wild card instead: all your drivers in one race, without using any drives.",
    "Miss the deadline and the house rule steps in: it runs your two highest-placed drivers who still have drives. Same rule for everyone.",
    {"t": "In this pretend league, Test drive lets you act as any player with one tap, to see the app the way they would.", "point": ".weekend button[onclick^='actAs']"},
    {"t": "Lower down: the standings, and last year's champion.", "point": "#view .tower"},
    {"t": "The Standings tab has the season table, and race by race, every player's points for every race.", "point": "#view .tablewrap", "js": "try{ go('standings'); }catch(e){}"},
    "Results come in by themselves. Tap any race for the driver-by-driver breakdown and a results post for the group text.",
    {"t": "The Usage tab counts every driver's drives left, and each player's wild cards. The bookkeeping that used to live in a notebook.", "point": "#view .u-p", "js": "try{ go('usage'); }catch(e){}"},
    {"t": "Races is the whole season calendar: each race, its pick deadline, and whether it is open, scored or canceled.", "point": "#view .race-list", "js": "try{ go('races'); }catch(e){}"},
    {"t": "On race day, once your league's mailbox is connected, the Live tab shows the running order and what everyone would score if the race ended now.", "point": "#view button[onclick^='fetchLive']", "js": "try{ go('live'); }catch(e){}"},
    {"t": "The Paddock is the group chat for trash talk. It was always the best part.", "point": "#chatBox", "js": "try{ go('paddock'); }catch(e){}"},
    {"t": "Setup is the commissioner's room. In the pretend league, Start my own league comes first: it asks your league's name and your first name, and the pretend league goes away.", "point": "#view button[onclick='ownLeague()']", "js": "try{ go('setup'); }catch(e){}"},
    {"t": "Below that: the shared mailbox, the season, scoring, the draft room, rosters, a starting point if you join mid-season, and players.", "point": "#view details"},
    {"t": "Once a year the draft room builds every team: draw a snake order, and everyone picks drivers in turn until the rosters are full.", "point": "#view .card h2", "js": "try{ go('draft'); }catch(e){}"},
    "Your first few minutes: act as one player, read the weekend card, then tap Start my own league in Setup when ready.",
    "Privacy: no account and no ads. Your league lives on this device until your group connects its own free Google mailbox, so the data stays with your league.",
    "Pit Wall costs nine dollars per season you play. Nothing renews by itself.",
    {"t": "And the question mark button in the corner has the tour, bigger text and help, any time.", "point": "#djDockToggle", "js": "try{ go('home'); }catch(e){}"}]},
   join:{ title:'You got the link — how to join (2 minutes)', sub:'For the rest of the group: what the text does, and the one thing you have to do. Sound on.',
    lines:[
     {t:"Somebody in your league just texted you a link. This is what it does, and the one thing it needs from you. It takes about two minutes.", js:"try{go('home')}catch(e){}"},
     "First, what this is not. It is not a new league. It is the same league you have been running by group text for years, with the same rules, the same commissioner and the same arguments. The app just does the counting.",
     {t:"When you tapped the link, your phone joined the league. That is the whole setup. Nothing to install, nothing to sign up for, no password to invent.", point:"nav.tabs button[data-tab='home']"},
     {t:"The one thing it needs from you: tap the button at the top and say which one of you you are. Then pick any four digit number as your PIN. That is only there so nobody else can enter your picks as a joke.", point:"#meBtn"},
     {t:"Now the part you will use every weekend. This is the home card. It knows the real race calendar, so it shows the next race, when picks are due, and a countdown.", point:"nav.tabs button[data-tab='home']"},
     "To make your picks, you tap two of your drivers before that deadline. That is it. No text to send, no reply to wait for. Everybody's phone sees it at once.",
     {t:"Each of your drivers has a set number of runs for the season, and the app counts them down for you. No more arguing about who used Hamilton how many times.", js:"try{go('usage')}catch(e){}", point:"nav.tabs button[data-tab='usage']"},
     "Twice a season you can play a wild card: all four of your drivers at once, and it does not use anybody's runs. The app keeps track of whether you still have one.",
     {t:"Miss the deadline and the house rule takes over, same as always: it starts your two highest placed drivers who still have runs left. No midnight texts, no favours, no exceptions, and it is the same rule for everyone.", js:"try{go('races')}catch(e){}"},
     {t:"After the race, the results come in on their own and the standings do themselves. Tap any race to see exactly how every point was worked out.", js:"try{go('standings')}catch(e){}", point:"nav.tabs button[data-tab='standings']"},
     {t:"On race day the Live tab is a running scoreboard: where everyone's drivers are right now, and what the league table would look like if the race stopped this second.", js:"try{go('live')}catch(e){}", point:"nav.tabs button[data-tab='live']"},
     {t:"And the trash talk gets its own room, because it was always the best part.", js:"try{go('paddock')}catch(e){}", point:"nav.tabs button[data-tab='paddock']"},
     {t:"Last thing, and it is worth doing now: add it to your home screen so it opens like a normal app. On an iPhone, tap the share button at the bottom of the browser, scroll down, and tap Add to Home Screen. On Android it is the three dots, then Install or Add to Home screen.", js:"try{go('home')}catch(e){}"},
     "That is everything. Tap your name, set a PIN, pick two drivers before Friday night. If you want the full rules written out, there is a rulebook link under the video."
    ]},
   draft:{ title:'How the draft works (90 seconds)', sub:'The once-a-year event, start to finish. Sound on.',
    lines:[
     {t:"This is the draft room in Pit Wall. Once a year, a couple of weeks before the first race, every team is built from scratch here.", js:"try{go('draft')}catch(e){}"},
     "Step one, the commissioner ticks who is in this season. Five players, four drivers each, so twenty picks.",
     "Step two, draw the order. Round one is random. Round two runs backwards. Round three repeats round one, and round four runs backwards again. That is a snake draft, and it means the person who picked last in round one picks first in round two.",
     "The commissioner can copy the order straight into the group text, the way it has always been posted.",
     "Step three, start the draft. The board shows every round and every slot, and the big card says who is on the clock.",
     "Every driver on this season's entry list is laid out below, best to worst by last season's points, with the taken ones crossed off as they go.",
     "When it is your turn, you tap a driver. Out of turn? The app says not your turn. Already taken? It says so. Nobody has to referee.",
     "If someone is stuck on a golf course, the commissioner can pick for them, and can undo the last pick if a finger slipped.",
     "After the twentieth pick, the draft closes itself and writes everyone's four drivers into the rosters, each with a full allowance of drives.",
     "One tap copies the finished driver list for the group text, like hamilton twelve of twelve, and the season is ready to run.",
     "That is the whole draft. Fifteen minutes by text used to be an hour. Now it is a board everyone can see."
    ]}
  },
  docs:[{label:'📖 The rulebook: how the league works', href:BASE+'f1/rules.html'}]},

 ff: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This video explains My Scores from the very beginning. If you have never seen it, that is fine.", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
    "First, the everyday problem. Lots of families play fantasy football, often in more than one league, on more than one app. On a Sunday that means hopping between apps to see how everyone is doing.",
    "My Scores puts every team you follow on one screen, yours and your opponent's, with one button to update them all. It works with ESPN and Sleeper leagues.",
    "It is for anyone who plays, from one team to a whole family's worth. And if you run a league, it has tools for that too.",
    {"t": "What you see here is an example league, so you can see how it looks before you add your own.", "point": "#cards .slides > .slide:nth-child(2) .card h2", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
    {"t": "There are four screens: Add a team, My teams, your Scores, and real NFL scores. First, adding a team. It asks one question at a time: where do you play this team?", "point": "#wStep1", "js": "try{ show('wizard'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Open your team in the ESPN or Sleeper app or website, copy the page's link, and paste it in this box. Then tap Find my league.", "point": "#lurl"},
    {"t": "Yahoo, CBS and NFL dot com don't allow this yet. This box says so.", "point": "#wYahoo"},
    "Next it lists every team in the league. Tap yours. Then tap plus Add another team if you play in another league, or I'm done to see your scores.",
    {"t": "My teams lists every team the app follows. First puts a team at the top, and Remove stops following one, after asking.", "point": "#addTeamBtn", "js": "try{ show('setupHome'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Now the Scores screen. Each team gets a card: the league, ESPN or Sleeper, and whether the game is live, final or not started.", "point": "#cards .slides > .slide:nth-child(2) .card h2", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
    {"t": "Your team on the left, your opponent on the right: score, projection and record. The chips count players playing now, finished, or still waiting.", "point": "#cards .slides > .slide:nth-child(2) .vs"},
    {"t": "Underneath: whether you're ahead or behind, by how much, and your odds of winning.", "point": "#cards .slides > .slide:nth-child(2) .foot"},
    {"t": "A red warning means one of your starters is out and his game starts soon. Time to swap him.", "point": "#cards .slides > .slide:nth-child(2) .kickAlert"},
    {"t": "Tap either side to open that team's roster, bench underneath. Green is playing now, yellow not started, grey finished, purple a bye.", "point": "#cards .slides > .slide:nth-child(2) .rlegend", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffOpen('roster'); }catch(e){}"},
    {"t": "A hurt player has a tag: O for out, Q for questionable. Tap his row to read the latest injury news.", "point": "#cards .slides > .slide:nth-child(2) .rrow.tappable"},
    {"t": "Show Assistant Manager spots trouble for you. Lineup suggestions find a bench player projected to beat a starter.", "point": "#cards .slides > .slide:nth-child(2) .assistant .infoHead", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffOpen('am'); }catch(e){}"},
    {"t": "Check available players finds the best free agents for a hurt or bye-week starter, and bye weeks shows who is off this week and next.", "point": "#cards .slides > .slide:nth-child(2) .waiverToggle"},
    {"t": "Or type something plain in the Ask box, like replace my quarterback.", "point": "#cards .slides > .slide:nth-child(2) .askRow"},
    {"t": "For ESPN teams, kickoff alerts message your phone when a starter is out and his game is about to start.", "point": "#cards .slides > .slide:nth-child(2) .pushBox"},
    {"t": "Swipe the card sideways for the other games in your league...", "point": "#cards .slides", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffAt(2); }catch(e){}"},
    {"t": "...then the standings and the latest pickups and trades. It loops back to your game.", "point": "#cards .slides", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffAt(3); }catch(e){}"},
    {"t": "Update scores sits at the bottom of the screen. Tap it any time for the newest numbers.", "point": "#update", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
    {"t": "Below your cards: See real NFL scores shows every real game this week, and League manager tools tracks dues, contacts, group messages and a weekly recap.", "point": "#mgrBtn"},
    "Your first two minutes: open your team on ESPN or Sleeper, copy the link, paste it here, tap Find my league, and tap your team. Done.",
    "Privacy: no account and no sign-up. Your teams are kept on this phone, and scores come straight from ESPN or Sleeper. Kickoff alerts, if you turn them on, go through a small Daraja relay.",
    "My Scores is free.",
    {"t": "And the question mark button in the corner has the tour, bigger text and help, any time."}]} },
  train:[
   {"t": "Let's get My Scores loaded. Two minutes, then it's yours for the season.", "point": "#wStep1", "js": "try{ show('wizard'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step one: open your team in the ESPN or Sleeper app or website, tap Share or copy the page's link, and paste it in this box.", "point": "#lurl"},
   {"t": "Then tap Find my league. If an ESPN league is private, it tells you the one setting your league manager changes to fix it.", "point": "#find"},
   {"t": "Yahoo, CBS and NFL dot com aren't supported yet. This box says so.", "point": "#wYahoo"},
   "Step two: it lists every team in the league. Tap the one that's yours.",
   "Step three: managing more than one team? Tap plus Add another team and do it again. Add a second team from the same league and it asks whether that's really a second team, so it never mixes them up.",
   {"t": "Once you're set up, it opens straight to your scores. Tap the big Update scores button any time for the latest.", "point": "#update", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
   {"t": "Swipe your card sideways to browse the league's other matchups, then the standings. Swipe past the end and it loops back to your game.", "point": "#cards .slides", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffAt(2); }catch(e){}"},
   {"t": "Tap either team's score to open the roster. Green is playing now, yellow not started, grey finished, purple a bye week. Tap a hurt player's row for the injury news.", "point": "#cards .slides > .slide:nth-child(2) .rlegend", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffOpen('roster'); }catch(e){}"},
   {"t": "Step four: tap Show Assistant Manager. Lineup suggestions compare your bench to your starters, and bye weeks cover this week and next.", "point": "#cards .slides > .slide:nth-child(2) .assistant .infoHead", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffOpen('am'); }catch(e){}"},
   {"t": "Check available players finds the best free agents for anyone hurt or on a bye, ranked by how widely they're owned.", "point": "#cards .slides > .slide:nth-child(2) .waiverToggle"},
   {"t": "Or type a plain question in the Ask box, like better defense, and it finds real available options.", "point": "#cards .slides > .slide:nth-child(2) .askRow"},
   {"t": "For ESPN teams, kickoff alerts tell your phone when a starter is out and his game is about to start. On iPhone, add My Scores to your Home Screen first.", "point": "#cards .slides > .slide:nth-child(2) .pushBox"},
   {"t": "That's the whole thing: one button to update, a swipe to browse, and Assistant Manager for everything else. Enjoy the season.", "point": "#update", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"}],
  lines:[
   {"t": "This is My Scores: one screen for every fantasy football team you follow, however many you've got.", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
   {"t": "Setup is one short question at a time. Paste your team's link, tell it which team is yours, and you're in. Works with ESPN and Sleeper leagues.", "point": "#lurl", "js": "try{ show('wizard'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Each card shows the score, the projection, whether you're ahead and your odds of winning. This one is an example league, so you can see it before you add your own.", "point": "#cards .slides > .slide:nth-child(2) .vs", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
   {"t": "And if one of your starters is out with his game about to start, a red warning tells you, in time to swap him.", "point": "#cards .slides > .slide:nth-child(2) .kickAlert"},
   {"t": "One big Update scores button gets every team's score right now, yours and whoever you're playing.", "point": "#update", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
   {"t": "Swipe your own card sideways to see every other matchup in the league, then the standings. It loops right back around.", "point": "#cards .slides", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffAt(2); }catch(e){}"},
   {"t": "Tap either team's score to open the whole roster: starters, then bench, with a colored dot for who's playing right now.", "point": "#cards .slides > .slide:nth-child(2) .roster:not([hidden])", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffOpen('roster'); }catch(e){}"},
   {"t": "Tap a hurt player and you get the real news behind it, not just a one-letter tag.", "point": "#cards .slides > .slide:nth-child(2) .rrow.tappable"},
   {"t": "The Assistant Manager button is the team-management side: lineup suggestions, real waiver-wire replacements, and who's on bye this week and next.", "point": "#cards .slides > .slide:nth-child(2) .assistant .infoHead", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); } __ffOpen('am'); }catch(e){}"},
   {"t": "You can even type a plain question, like 'suggest a defensive replacement', and it goes and finds one.", "point": "#cards .slides > .slide:nth-child(2) .askRow"},
   {"t": "Run the league? League manager tools keep track of who has paid, everyone's phone and email, one-tap group messages, and a weekly recap.", "point": "#mgrBtn", "js": "try{ if(!window.__ffEx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__ffEx')>=0){ eval(d.go); return true; } return false; }); } else { __ffEx(); __ffAt(1); window.scrollTo(0,0); }  }catch(e){}"},
   {"t": "And when you just want the real games, See real NFL scores shows every game this week.", "point": "#nflBtn"},
   {"t": "It's free, it's yours, and it works for however many teams your whole family plays. Try it below."}],
  name:'My Scores', em:'🏈', sub:'every team\u2019s score, one button', fresh:true, cat:'home', mem:'Free', price:'Free', testing:true, video:true,
  tag:'Every fantasy football team you follow, yours and your opponent\u2019s, on one screen with one Update button. Works with ESPN and Sleeper.',
  try:BASE+'ff/',
  
  },

 churchhq: {
  name:'Church HQ', em:'🏢', sub:'keep the church app current, yourself', cat:'off', off:'folded into The Church App — it is how you keep the one you bought current', mem:'Church membership', price:'$29 one-time', video:true,
  tag:'The app that keeps your church app up to date — no website, no web designer, no waiting',
  try:BASE+'church-hq/',
  lines:[
   {t:"This is Church HQ, and it answers the question every church asks about ten minutes after they see their new app: who keeps it up to date?", js:"try{go('home');}catch(e){}"},
   "The answer used to be: whoever built it. That is a phone call, and a wait, and often a bill. So a service time changes in March and the app still says the old one in July.",
   {t:"Church HQ hands that job back to you. Everything the congregation sees lives on four simple pages: the basics, this week's news, your people, and your ministries.", js:"try{go('basics');}catch(e){}"},
   {t:"Change a service time, type Sunday's announcement, add the new youth leader. Then tap Publish, and every phone in the congregation has it before the sun goes down.", js:"try{go('news');}catch(e){}"},
   {t:"You do not need a website. Plenty of churches have none, and this works exactly the same. Church HQ is where your information lives.", js:"try{go('home');}catch(e){}"},
   {t:"It publishes through a free mailbox on your own Google account — a five minute setup, once, that belongs to you. No account with us, and the mailbox stays yours.", js:"try{go('publish');}catch(e){}"},
   {t:"And if the person who set it up ever leaves, the passphrase hands the whole thing to the next person in about a minute.", js:"try{go('publish');}catch(e){}"},
   {t:"It comes with the Church membership, for the church that would rather not phone anybody. Try it below.", js:"try{go('home');}catch(e){}"}]},
 /* ── CHURCH & NONPROFIT SHELF (renders as its own shelf on the store, and on the dedicated church page) ── */
 church: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This short video explains The Church App. In about four minutes you will know what it is for and how to use it.", "js": "try{ var x=document.querySelector('#sn2.on [data-a=x]'); if(x) x.click(); go('home'); }catch(e){}"},
    "First, the everyday problem. In most churches, news lives in too many places: a paper bulletin left in the pew, sermons somewhere on YouTube, a calendar taped to a wall.",
    "The Church App puts all of it on every member's phone, with your church's own name on the front.",
    "Who is it for? Church members of every age, and the church office, which keeps it current from a phone.",
    "What you are looking at is a demo church we invented, called Grace Harbor. Look around as much as you like: nothing in it reaches anybody.",
    {"t": "Along the very bottom is a bar with six buttons: Home, Watch, Events, Prayer, Give and More. On Home, these round shortcuts jump to the same places.", "point": "#home button[data-tab=watch]"},
    {"t": "Home comes first. At the top is the latest message, which means last Sunday's sermon. Tap it to watch.", "point": "#heroBtn"},
    {"t": "Below that are the service times, the next events under This week, and the Discussion guide for this week's message.", "point": "#home button[onclick*=openSermonNotes]"},
    {"t": "Tap Watch. Every message is here, newest at the top. The buttons above the list are sermon series. Tap one to see only that series.", "js": "try{ go('watch'); }catch(e){}", "point": "#series-filters"},
    {"t": "Each message shows its title, the speaker, the Bible passage and the date.", "point": "#message-list .item"},
    {"t": "Tap a message to open it. Watch message plays the video, and the My notes box is for your own thoughts. It saves by itself, on this phone.", "js": "try{ var it=document.querySelector('#message-list .item'); if(it) it.click(); }catch(e){}", "point": "#note"},
    {"t": "Tap Back to return to the list. A message with notes shows a small Notes saved label.", "js": "try{ var b=document.getElementById('sheet-back'); if(b) b.click(); }catch(e){}"},
    {"t": "The biggest tool is Sermon Notes. On Home, tap My notes on this message. On Sunday mornings, a round notes button also floats over the app.", "js": "try{ go('home'); openSermonNotes(); var d=document.querySelector('#sn2 [data-sntab=during]'); if(d) d.click(); }catch(e){}", "point": "#sn2 [data-a=rec]"},
    "Tap Record the sermon and set the phone on your lap. On many phones it also writes down the words as they are said. Everything stays on your phone.",
    {"t": "Type anything that stands out under My notes, then tap Add. This Sunday's Bible verses are already listed. Tap one to read it right there.", "point": "#sn2In"},
    {"t": "Afterwards, tap After. You get every scripture that was mentioned, and questions to take home.", "js": "try{ var b=document.querySelector('#sn2 [data-sntab=after]'); if(b) b.click(); }catch(e){}", "point": "#sn2 [data-sntab=after]"},
    {"t": "For a summary, tap Copy the sermon, paste it into your own AI app, like ChatGPT or Claude, and paste the answer back. It is free and takes about a minute.", "point": "#sn2 [data-ai=sum]"},
    {"t": "Share this sermon sends the summary, questions and scriptures to your group. The Library keeps every sermon you record.", "point": "#sn2 [data-a=share]"},
    {"t": "Events shows what is coming up. The buttons at the top sort by group, like Kids or Students. Old events disappear by themselves.", "js": "try{ var x=document.querySelector('#sn2.on [data-a=x]'); if(x) x.click(); go('events'); }catch(e){}", "point": "#event-filters"},
    {"t": "Prayer is where you share a request. Send to the prayer team opens an email to the church office. You can also keep it on your own prayer list, on this phone only.", "js": "try{ go('prayer'); }catch(e){}", "point": "#p-text"},
    {"t": "Give opens the church's own giving page.", "js": "try{ go('give'); }catch(e){}"},
    {"t": "More has the ministries, the staff team, and how to reach the office.", "js": "try{ go('more'); }catch(e){}", "point": "#team"},
    {"t": "At the bottom of More is Appearance. System follows your phone, or choose Light or Dark.", "point": "#theme"},
    {"t": "How to start: open the app and tap the latest message. On Sunday, open Sermon Notes and tap Record. That is your first two minutes.", "js": "try{ go('home'); }catch(e){}", "point": "#heroBtn"},
    "The church office has a simple update page and a key. Post Sunday's message, the verses and new events from a phone, and every member sees them. No web designer, no monthly bill.",
    "Members need no account. Notes, recordings and prayer lists stay on each person's own phone.",
    "The Church App comes with the Church membership, set up for your church with your own name on it. Any profit helps orphans and students in Kenya.",
    "If you get lost, tap Home at the bottom, and you are back at the start."]} },
  train:[
   {"t": "This is the five-minute training for Sermon Notes in The Church App: how to use it on a Sunday, and what to do with it afterwards.", "js": "try{ go('home'); openSermonNotes(); }catch(e){}"},
   {"t": "On Sunday morning a round notes button floats over the app. Any other day, tap My notes on this message, in the Discussion guide on Home. Then tap Record the sermon.", "js": "try{ var w=document.getElementById('sn2'); if(!w||!w.classList.contains('on')) openSermonNotes(); var d=document.querySelector('#sn2 [data-sntab=during]'); if(d) d.click(); }catch(e){}", "point": "#sn2 [data-a=rec]"},
   "Set the phone on your lap with the screen on. It dims by itself and keeps recording. On many phones the words are written down as they are said.",
   {"t": "If something stands out, type it under My notes and tap Add. While you record, each note is stamped with its moment, so later you can tap the time and hear that part again.", "point": "#sn2In"},
   {"t": "This Sunday's Bible verses are already here, posted by the church office, with an outline when the office adds one. Tap any verse to read it right there.", "point": "#sn2 .vref"},
   {"t": "When the sermon ends, tap Stop. The After page opens: listen again, every scripture that was mentioned, and questions to take home.", "js": "try{ var b=document.querySelector('#sn2 [data-sntab=after]'); if(b) b.click(); }catch(e){}", "point": "#sn2 [data-sntab=after]"},
   {"t": "For a summary and bullet points, tap Copy the sermon, open ChatGPT or Claude, paste it, then paste the answer back here and tap Save it. It takes about a minute.", "point": "#sn2 [data-ai=sum]"},
   {"t": "Tap Share this sermon to send the summary, questions and scriptures to your small group or your family.", "point": "#sn2 [data-a=share]"},
   {"t": "Everything is saved in your Library, on your own phone. Each recorded sermon lands there, ready to open again.", "js": "try{ var b=document.querySelector('#sn2 [data-a=lib]'); if(b) b.click(); }catch(e){}"},
   {"t": "And for the church office: when you post Sunday's message on the Weekly Update page, add the outline and the verses, and everyone's Sermon Notes has them before the service starts.", "js": "try{ var x=document.querySelector('#sn2 [data-a=x]'); if(x) x.click(); go('home'); }catch(e){}"}],
  name:'The Church App', em:'⛪', sub:'your church in every pocket', cat:'church', mem:'Church membership', price:'$149 one-time', testing:true, video:true,
  tag:'Sermons with notes you can record (with the scriptures and take-home questions pulled out), events, prayer requests and giving, in one app with your church’s name on it. Your office keeps it current from a phone. Set up for you.',
  /* 8 Nov 2026: this pointed at https://jerrywins1.github.io/immanuel-app/ — a real
     congregation's live app. Every buyer who tapped "Try it" was browsing Immanuel's actual
     prayer wall and giving page, which is why the narration below has to ask them not to
     contact that church's office. church-demo/ is a complete copy filled with an invented
     church, Grace Harbor, so there is somewhere honest to send them now.
     8 Nov, later, The Church App chat: done. The lines that named Immanuel are rewritten
     and church-overview, church-firsttime and church-train are re-recorded by name, so the
     words and the voice match. (piper does install in a cloud container after all —
     `pip install piper-tts`, and ffmpeg is already there.)

     The fourth track, church-explain, is NOT re-recorded and its words are untouched. It
     is not a buyer's video: it reads shop/kenya/church.json, which is the Kenyan testers'
     explainer, and that whole file — persona, challenge, start link, tasks naming real
     series and real speakers — is still built around Immanuel's app on purpose, because
     Jerry decided on 8 Nov that the testers do not switch over before cycle 1 starts.
     Re-recording it to describe Grace Harbor would have the video describing one app
     while the tester opens another. It goes with the tester switch, not before it. */
  try:'https://jerrywins1.github.io/daraja-apps/church-demo/',
  lines:[
   "This is The Church App, which puts your whole church in everyone's pocket.",
   "Think about where things live right now: the announcements are in a bulletin nobody keeps, the sermons are on a YouTube channel nobody can find, and the calendar is taped to a wall.",
   "This app gathers all of it into one place, on every member's phone, with your church's own name on the front.",
   "Each Sunday's message lands in the app with its title, speaker and scripture, and the home screen always shows the newest one. Events drop off by themselves the moment they have passed.",
   {t:"Sermon Notes are built right in. Tap record and set the phone on your lap: it records the sermon, writes down the words, and keeps your own notes beside it.", js:"openSermonNotes()", point:"#sn2 [data-a=rec]"},
   {t:"Afterwards it lists every scripture that was mentioned, gives you questions to take home, and with your own AI app, a summary in a minute. Events, prayer requests, giving and your staff page all live in the app too.", js:"(function(){var x=document.querySelector('#sn2 [data-a=x]'); if(x) x.click();})()"},
   "And your own staff keeps it current from a phone, using a simple page and a key we hand you. There is no web designer to hire and no monthly bill to dread.",
   "It comes with the Church membership, priced by the size of your church, and I set it up for you. The one you can try below is a demo church we invented, so look around as much as you like."
  ],
  /* 7 Oct 2026: the 5-minute training — Sermon Notes v2 (record, notes, scriptures, questions, summary, library) */
  },
 churchsteward: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    "This is Ahead of It, church edition. In the next few minutes you will see what it is for, who it is for, and how to use it.",
    "Here is the everyday problem. A church building runs on dates. The fire extinguishers need their yearly service. The van needs its registration. The insurance renews once a year.",
    "Usually one volunteer keeps all of that in their head, often a trustee. When that person is busy, sick, or steps down, the dates quietly slip by.",
    "And a missed date costs real money: a fine, a lapsed policy, or a ministry closed until the inspection is done.",
    "Ahead of It is for whoever looks after the building: a trustee, a facilities volunteer, a church administrator, or the pastor of a small church.",
    "The big idea is simple. Every date lives on one calm page, and each item comes with its own reminder steps, starting thirty days before it is due.",
    {"t": "At the bottom are four tabs: Next, Year, Library, and Hand-off. The round orange plus button adds something of your own.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='next']"},
    {"t": "Start with Library. It holds twenty-four things churches most often forget, in groups like Safety and inspections, Building, Vehicles, Insurance and legal, and Money and filings.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-lib'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='lib'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='lib']"},
    {"t": "Each one shows how often it comes around and how costly a miss would be. Tap one your building has, and it goes on your list.", "point": "#lib .lib button"},
    {"t": "Or tap the gold Quick setup button. It shows the whole library on one screen, with a tick box and a date beside each item.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ var q=document.getElementById('qsBtn'); if(q) q.click(); }catch(e){}", "point": "input[data-qs]"},
    {"t": "Tick what is yours, fix any date you know, and tap Save my list. Two or three items is a fine start.", "point": "#qsOv div[style*='sticky'] button"},
    {"t": "Now the Next tab. This is your main page. It sorts everything by what needs you first.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='next']"},
    {"t": "Overdue is at the top, then Do something now, then Next ninety days, then Later this year. When nothing is overdue, it simply says so.", "point": "#lOver"},
    "Each item shows how many days until it is due, and the one step to take right now, like Gather what you need.",
    "When you finish a step, tap step tick. When the whole job is done, tap done tick, and the app moves the date forward to next time, so it repeats by itself.",
    {"t": "Something not in the library? Tap the round plus button.", "point": ".fab"},
    {"t": "Give it a name and a next due date, choose how often it repeats, and pick how bad a miss would be: No big deal, A hassle, or Costs real money.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ openEdit(); setTimeout(function(){ try{ document.activeElement.blur(); }catch(e){} }, 120); }catch(e){}", "point": "#fSev"},
    {"t": "You can also note what happens if you miss it, who else needs to know, and where the papers are kept. Then tap Save.", "point": "#fWho"},
    {"t": "The Year tab shows the next twelve months on one page. Red costs real money, amber is a hassle, and green is no big deal. Print it, or add every date to your calendar.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-year'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='year'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='year']"},
    {"t": "The Hand-off tab is for the day someone else takes over. It copies or prints one page: what is due, who to tell, and where things are.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-more'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='more'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='more']"},
    {"t": "It also has Save backup file, because everything lives on this one device. And here you write whose list this is.", "point": "button[onclick='exportJson()']"},
    {"t": "Your first two minutes: open Library or Quick setup, tick two or three things your building really has, and put in their real dates.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "#qsBtn"},
    "Then glance at the Next tab once a week. If it says Nothing overdue, you are ahead of it.",
    "Your list stays on this device. There is no account, no cloud, and nothing is sent to anyone.",
    "Ahead of It, church edition comes with the Church membership.",
    {"t": "And the round question mark button has the tour and help, any time. Profits help students in Kenya stay in school.", "point": "#djDockToggle"}]} },
  train:[
   "Here is how to set up Ahead of It, church edition, one step at a time.",
   {"t": "Step one: tap Library at the bottom. Tap each item your building really has, like the fire extinguisher service or the van registration. Each tap adds it to your list.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-lib'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='lib'); }); window.scrollTo(0,0); }catch(e){}", "point": "#lib .lib button"},
   {"t": "Or do step one the quick way: tap the gold Quick setup button, tick everything that is yours, fix the dates you know, and tap Save my list.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ var q=document.getElementById('qsBtn'); if(q) q.click(); }catch(e){}", "point": "input[data-qs]"},
   {"t": "Step two: tap Next. Tap the name of each item, put in its real due date, and tap Save.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='next']"},
   {"t": "Step three: for anything not in the library, tap the round plus button. Fill in what it is, when it is due, how often it repeats, and how bad a miss would be.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ openEdit(); setTimeout(function(){ try{ document.activeElement.blur(); }catch(e){} }, 120); }catch(e){}", "point": "#fName"},
   {"t": "Step four: write who else needs to know, like the treasurer, and where the papers are kept. Then tap Save.", "point": "#fWhere"},
   {"t": "Step five: open the Next tab each week. When a reminder step is due, do it and tap step tick. When the job is finished, tap done tick, and the date moves to next time.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "#lNow"},
   {"t": "Step six: open Hand-off. Fill in whose list this is, and the default person to tell.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-more'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='more'); }); window.scrollTo(0,0); }catch(e){}", "point": "#owner"},
   {"t": "Step seven: tap Save backup file now and then, because everything lives on this one device.", "point": "button[onclick='exportJson()']"},
   {"t": "When the job changes hands, tap Print the hand-off page or Copy hand-off summary, and give it to the next person.", "point": "button[onclick='copyHandoff()']"},
   {"t": "Last, the Year tab. Print the year map for the office wall, or tap Add all to my calendar.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-year'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='year'); }); window.scrollTo(0,0); }catch(e){}", "point": "#v-year .row button"}],
  name:'Ahead of It · Church', em:'📋', sub:'never miss an inspection', cat:'church', mem:'Church membership', price:'$29 one-time', testing:true, video:true,
  tag:'Nothing catches the trustees by surprise',
  try:'https://jerrywins1.github.io/daraja-apps/church-steward/',
  lines:[
   {t:"This is Ahead of It, church edition, and it exists for one person: whoever keeps your church building alive.", js:"try{go('next');}catch(e){}"},
   {t:"Because a church building is really a stack of dates. The fire inspection is due in October, the boiler certificate in January, the van registration in March, and the nursery background checks somewhere in between.", js:"try{go('year');}catch(e){}"},
   {t:"When one of those dates slips past quietly, it costs real money, and sometimes it shuts a ministry down for a season.", js:"try{go('next');}catch(e){}", point:"#lNow"},
   {t:"Ahead of It gathers every one of those dates onto one calm page, and starts whispering thirty days before anything comes due.", js:"try{go('next');}catch(e){}", point:"#calm"},
   {t:"It arrives already loaded with the twenty-four things churches most often forget, so setup is just ticking the ones your building actually has and typing in your real dates.", js:"try{go('lib');}catch(e){}"},
   {t:"And here is the part trustees love: when the role changes hands, and it always does, it prints a complete hand-off list, so nothing lives in only one person's head anymore.", js:"try{go('more');}catch(e){}"},
   {t:"It comes with the Church membership, and it costs a good deal less than one missed inspection fine. Go ahead and try it below.", js:"try{go('next');}catch(e){}"}
  ]},
 churchserve: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This short video explains Serve Board. You have never seen it before, and that is fine. In about four minutes you will know what it is for and how to use it.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); window.scrollTo(0,0); }catch(e){}", "point": "header"},
    "First, the problem. Every Sunday a church needs a lot of volunteers. Someone welcomes people at the door. Someone looks after the babies. Someone runs the sound. Someone makes the coffee.",
    "Usually the plan lives in one person's head, or on scraps of paper. Then on Sunday morning a job is empty, and the same few people cover it again.",
    "Serve Board puts the whole month of volunteers on one page. You see every empty job weeks early, and can ask someone in good time.",
    "Who uses it? Whoever schedules volunteers: a church office, a ministry leader, a youth group, a choir, or a school club.",
    {"t": "Let us look at the screen. The big part of the page is the board. Each Sunday has its own card, with the date at the top and the list of jobs below.", "point": ".week h3"},
    {"t": "Next to each job is a button. If nobody has that job yet, it is orange and says needs someone. Orange means: find a person.", "point": ".week .who"},
    {"t": "Along the top are the buttons: Add a Sunday, My people, Roles and requirements, Print, and Start fresh.", "point": "button[onclick=\"openPeople()\"]"},
    {"t": "Start with your people. Tap My people, then tap Add a person, and type a name. You can also add a phone number and an email.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); openPeople(); }catch(e){}", "point": "#svOv button[onclick=\"addP()\"]"},
    "Under each person is a line called Can serve as. Tap the jobs this person can do. Green means yes. If you tap none, the app thinks they can do any job.",
    {"t": "Already have a list in a spreadsheet? Tap Import from a spreadsheet, paste the rows, and everyone comes in at once.", "point": "#svOv button[onclick=\"openImport()\"]"},
    {"t": "Next, the jobs. Tap Roles and requirements. You can rename a job, remove one, or tap Add a role.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); openRoles(); }catch(e){}", "point": "#svOv input[placeholder=\"role name\"]"},
    {"t": "Under each job you can write what it requires, for example a background check. The app shows that reminder every time you put someone in that job.", "point": "#svOv input[placeholder^=\"what this role requires\"]"},
    {"t": "Now fill the board. Tap an orange button that says needs someone.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); window.scrollTo(0,0); }catch(e){}", "point": ".week .who"},
    {"t": "A box opens. At the top are your people who can do this job. Tap a name. Or type a new name and tap Put them in.", "js": "try{ var b=document.querySelector('.week .who'); if(b) b.click(); }catch(e){}", "point": "#svType"},
    "Then the app shows a short message for that person, so they know they are serving that Sunday. If you saved their phone number, one tap texts it. You can also email it, or copy it.",
    {"t": "Tap Done, back to the board. The orange button is now white, with the person's name in it. Tap a name any time to change it or clear the slot.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); }catch(e){}"},
    {"t": "Need more weeks? Tap Add a Sunday. Sundays that have passed fold away by themselves.", "point": "button[onclick=\"addWeek()\"]"},
    {"t": "Need paper for the bulletin board? Tap Print. You get a clean copy of the board, without the buttons.", "point": "button[onclick=\"window.print()\"]"},
    {"t": "Start fresh near the top only clears the names off the board, after asking. Your people and jobs stay.", "point": "button[onclick=\"resetAll()\"]"},
    "How to start? Add three or four people, then fill next Sunday. That is your first two minutes, and the board already looks less empty.",
    "Privacy: everything stays on this phone. There is no account, and nothing is sent unless you send the message yourself.",
    "Serve Board comes with the Church membership. Any profit helps orphans and students in Kenya.",
   "New in November: once somebody is in, there is a WhatsApp button beside the text one — and it is there even for a person with no phone number saved, because no number goes into the link.",
    {"t": "And the question mark button in the corner has the tour and help, any time you need them.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "This is the training for Serve Board: how to set it up and fill your first month.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); window.scrollTo(0,0); }catch(e){}", "point": "header"},
   "Step one: the welcome card. Choose Keep the examples to play with, or Start fresh with my own for a board with no example people.",
   {"t": "Step two: tap My people, then Add a person. Type a name, a phone number and an email. The phone number is what makes texting one tap.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); openPeople(); }catch(e){}", "point": "#svOv button[onclick=\"addP()\"]"},
   "Under Can serve as, tap every job that person does. Green means yes. They are listed first when you fill those jobs. Tap none, and they can be asked for anything.",
   {"t": "Have a list already? Tap Import from a spreadsheet. Four columns: name, phone, email, and jobs separated by a slash. Paste the rows and tap Add these people.", "point": "#svOv button[onclick=\"openImport()\"]"},
   {"t": "Step three: tap Roles and requirements. Rename a job, tap Add a role for a new one, and type what a job requires, like a background check. The cross at the top closes it.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); openRoles(); }catch(e){}", "point": "#svOv input[placeholder^=\"what this role requires\"]"},
   {"t": "Step four: on the board, tap an orange needs someone slot. Your people who can do that job are at the top. Tap a name.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); window.scrollTo(0,0); }catch(e){}", "point": ".week .who"},
   {"t": "Someone new? Type their name here and tap Put them in. They are added to your people automatically.", "js": "try{ var b=document.querySelector('.week .who'); if(b) b.click(); }catch(e){}", "point": "#svType"},
   "Step five: a message opens, already written. Tap Text or Email to send it, or Copy the message to paste into any chat. Then tap Done, back to the board.",
   {"t": "To change who is serving, tap their name on the board. Pick someone else, or tap Clear this slot.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); }catch(e){}", "point": ".week .who"},
   {"t": "Step six: tap Add a Sunday for more weeks. Sundays that have passed fold away by themselves.", "js": "try{ window.scrollTo(0,0); }catch(e){}", "point": "button[onclick=\"addWeek()\"]"},
   {"t": "Step seven: tap Print for a clean paper copy for the bulletin board, without the buttons.", "point": "button[onclick=\"window.print()\"]"},
   {"t": "Start fresh clears every name off the board, after asking first. Your people and jobs are kept.", "point": "button[onclick=\"resetAll()\"]"},
   {"t": "And the question mark button has help, a backup copy, and the tour, any time.", "point": "#djDockToggle"}],
  lines:[
   {"t": "This is Serve Board, the end of the Sunday-morning scramble.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); window.scrollTo(0,0); }catch(e){}", "point": "header"},
   {"t": "Greeters, nursery, coffee, the tech booth: who is on, for the whole month, on one page. Four Sundays are laid out for you, and more are one tap away.", "point": ".week h3"},
   {"t": "Orange means needs someone. You can see every gap in the schedule at a glance, weeks early, instead of at a quarter to ten on Sunday morning.", "point": ".week .who"},
   {"t": "Tap a slot, and your people who can do that job are listed first. Tap a name, or type one and tap Put them in.", "js": "try{ var b=document.querySelector('.week .who'); if(b) b.click(); }catch(e){}", "point": "#svType"},
   "Then the message is already written: who, which job, which Sunday, and any requirement. If you saved their number, one tap texts it, so nobody turns up surprised.",
   "Need a change? Tap a name on the board to pick someone else, or clear the slot. No phone tree.",
   {"t": "My people is your volunteer list: a name, a phone and an email for each, and the jobs they are willing to do. You can bring a whole list in from a spreadsheet.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); openPeople(); }catch(e){}", "point": "#svOv button[onclick=\"openImport()\"]"},
   {"t": "Roles and requirements: rename the jobs, add new ones, and note what a job needs, like a background check. That reminder shows every time you fill that slot.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); openRoles(); }catch(e){}", "point": "#svOv input[placeholder^=\"what this role requires\"]"},
   {"t": "And when it is set, print it for the bulletin board, because some of your best volunteers do not do phones, and that is fine.", "js": "try{ var o=document.getElementById('svOv'); if(o) o.remove(); window.scrollTo(0,0); }catch(e){}", "point": "button[onclick=\"window.print()\"]"},
   "It lives on your phone, and keeps working without a signal. No account, nothing for your volunteers to sign up for, and no ads.",
   "New in November: the is-in box offers WhatsApp as well as a text message, so you can send somebody their Sunday in the chat they already use.",
   "It comes with the Church membership, for every ministry team you have. Try it below."],
  name:'Serve Board', em:'🙋', sub:'volunteers on one page', cat:'church', mem:'Church membership', price:'$19 one-time', testing:true, video:true,
  tag:'The month of volunteers on one page. No ads to your volunteers.',
  try:'https://jerrywins1.github.io/daraja-apps/church-serve/',
  },
 churchdrive: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This short video explains the Shoebox Counter. In about four minutes you will know what it is for and how to use it.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ qaClose(); }catch(e){} try{ if(document.getElementById('sheet').classList.contains('show')) closeSheet(); }catch(e){} try{ var p=document.getElementById('occPreview'); if(p) p.classList.remove('show'); window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
    {"t": "First, what is a shoebox drive? Each fall, churches fill shoeboxes with small gifts, like a toothbrush, a notebook, pencils and a toy, and the boxes go to children around the world.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
    {"t": "Now the problem. People bring in bags of crayons, socks and toothbrushes. They pile up in the hallway, and nobody knows how many full boxes that makes, or what to buy next.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
    {"t": "Here is the key idea. A box is only complete if it has one of every important thing. Ninety toothbrushes and four notebooks make four complete boxes, not ninety.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
    "This app counts what comes in, and does that math for you. It works for any collection where you count things: a food drive, a school supplies drive, a coat drive.",
    "Who uses it? Whoever is collecting: a church volunteer, a missions team, a school club, or a family.",
    {"t": "Let us look at the screen. At the top is the big number, Complete sets, right now. This is how many full boxes you can pack today.", "point": "#canN"},
    {"t": "Below it, in red, the app tells you which item runs out first. When you reach your goal, it turns green and says so.", "point": "#bott"},
    {"t": "Next is the drive's goal: how many boxes you want to make. Tap the box and type a number.", "point": "#goal"},
    {"t": "Under the goal are the drop-off week, with the days left, and the shipping donation for your goal.", "point": ".occFactRow"},
    {"t": "Then the long list, Everything, A to Z. Each item has a count. A gold EVERY SET tag means every box needs it, and underneath it says how many more you need.", "point": "#listBox .row .nm"},
    {"t": "To add things, tap the green plus for one. For a whole bag, type how many in the small how many box, then tap plus. The minus takes one away.", "point": "#listBox .row .plus"},
    {"t": "You can also tap the number itself. A box asks, How many came in? Type a number, or tap a quick number, then tap Add them.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ var q=document.querySelector('#listBox .row .qbtn'); if(q) q.click(); }catch(e){}", "point": "#qaIn"},
    {"t": "If some went out to be packed, tap Took some out. If you counted again, tap Fix the total. Cancel closes it without changing anything.", "point": "#qaMode"},
    {"t": "Now tap the name of an item. Its own page opens. Goes in every set means every box needs it, so it counts for the big number.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ qaClose(); var n=document.querySelector('#listBox .row .nm'); if(n) n.click(); }catch(e){}", "point": "#sheet label.tog"},
    "We have plenty means you can stop counting it. Here you can also add or take away five or ten, type an exact count, or remove the item. Tap Done to close.",
    {"t": "To add a new item, scroll down to the box that says add an item, type a name, and tap Add.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ if(document.getElementById('sheet').classList.contains('show')) closeSheet(); }catch(e){}", "point": "#newN"},
    {"t": "Back at the top, the green button, Send the group what we still need, writes a message listing everything still missing.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ window.scrollTo(0,0); var p=document.getElementById('occPreview'); if(p && !p.classList.contains('show')) document.getElementById('occShareBtn').click(); }catch(e){}", "point": "#occShareBtn"},
    {"t": "You can change any of the words, then tap Text it, Email it, or Copy. Nothing is sent until you tap send yourself.", "point": "#occText"},
    {"t": "The line called What is not allowed any more lists things that must not go in a box, like soap and toothpaste.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ var p=document.getElementById('occPreview'); if(p) p.classList.remove('show'); }catch(e){}", "point": ".occNo"},
    {"t": "Next year, tap start a new drive at the very bottom. Counts go to zero, and your item list stays.", "point": ".foot button"},
    "How to start? Set your goal, then count the first bag of donations. That is your first two minutes, and the big number starts to move.",
    "Privacy: your counts stay on this phone. There is no account, and nothing is sent anywhere unless you send the message yourself.",
    "The Shoebox Counter comes with the Church membership. Any profit helps orphans and students in Kenya.",
   "New in November: the still-needed message can go out on WhatsApp as well as by text or email — and WhatsApp is the only one of the three that reaches the whole church group at once.",
    {"t": "And the question mark button in the corner has the tour and help, any time you need them.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "This is the training for the Shoebox Counter: how to set up a drive and count what comes in.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ qaClose(); }catch(e){} try{ if(document.getElementById('sheet').classList.contains('show')) closeSheet(); }catch(e){} try{ var p=document.getElementById('occPreview'); if(p) p.classList.remove('show'); window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
   {"t": "Step one: the welcome card. Choose Keep the examples to play with, or Start fresh with my own, for your item list with every count at zero.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
   {"t": "Step two: tap the goal box and type how many boxes your church is aiming for. Everything else measures against it.", "point": "#goal", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
   {"t": "Step three: check the list. Items with a gold EVERY SET tag go in every box, and only those decide the big number.", "point": "#listBox .row .nm", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
   {"t": "Step four: count the donations. Tap the green plus to add one. The minus takes one away.", "point": "#listBox .row .plus"},
   {"t": "For a whole bag, type how many in the small how many box, then tap plus. It adds them all at once.", "point": "#listBox .row .amt"},
   {"t": "Or tap the number itself. Type how many came in, or tap a quick number, then tap Add them. Took some out and Fix the total are there too.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ var q=document.querySelector('#listBox .row .qbtn'); if(q) q.click(); }catch(e){}", "point": "#qaGo"},
   {"t": "Step five: tap an item's name. Tick Goes in every set for things every box needs, or We have plenty to stop counting it. Then tap Done.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ qaClose(); var n=document.querySelector('#listBox .row .nm'); if(n) n.click(); }catch(e){}", "point": "#sheet label.tog"},
   {"t": "Step six: collecting something that is not on the list? Type its name in the add an item box and tap Add. It finds its own place, A to Z.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ if(document.getElementById('sheet').classList.contains('show')) closeSheet(); }catch(e){}", "point": "#newN"},
   {"t": "Step seven: before Sunday, tap Send the group what we still need. The message is written for you. Change any words, then tap Text it, Email it, or Copy.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ window.scrollTo(0,0); }catch(e){}", "point": "#occShareBtn"},
   {"t": "Tap What is not allowed any more to check the banned list before you ask. Soap and toothpaste are on it now.", "point": ".occNo"},
   {"t": "Next year, tap start a new drive at the bottom. Every count goes back to zero, and your item list stays.", "point": ".foot button"},
   {"t": "And the question mark button has help, a backup copy, and the tour, any time.", "point": "#djDockToggle"}],
  lines:[
   {"t": "This is the Shoebox Counter, built for shoebox season, and just as good for a food drive or a coat drive.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ qaClose(); }catch(e){} try{ if(document.getElementById('sheet').classList.contains('show')) closeSheet(); }catch(e){} try{ var p=document.getElementById('occPreview'); if(p) p.classList.remove('show'); window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
   {"t": "The question that matters is not how much stuff do we have. It is how many complete boxes can we pack and hand out right now?", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
   {"t": "A box needs one of every important thing. Ninety toothbrushes and four notebooks make four complete boxes, not ninety.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
   {"t": "This app does that math live, as donations come in. The big number at the top is complete sets, right now.", "point": "#canN", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){}"},
   {"t": "Underneath, in red, it names what runs out first, so you know exactly what to ask for on Sunday, and nobody buys too much of one thing.", "point": "#bott"},
   {"t": "Set your goal, say a hundred boxes, and every item tells you how many more you need.", "point": "#goal"},
   {"t": "Counting is quick. Tap plus for one. For a whole bag, type how many, then tap plus. Or tap the number to fix the total.", "point": "#listBox .row .plus"},
   {"t": "Tap an item's name to mark whether it goes in every set, or whether you have plenty and can stop counting it.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ var n=document.querySelector('#listBox .row .nm'); if(n) n.click(); }catch(e){}", "point": "#sheet label.tog"},
   {"t": "And the green button writes the message for you: everything still needed, with the not-allowed list and the drop-off week. Text it, email it, or copy it.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ if(document.getElementById('sheet').classList.contains('show')) closeSheet(); window.scrollTo(0,0); var p=document.getElementById('occPreview'); if(p && !p.classList.contains('show')) document.getElementById('occShareBtn').click(); }catch(e){}", "point": "#occShareBtn"},
   {"t": "It even adds up the shipping donation for your goal, and counts the days to drop-off week.", "js": "try{ if(!document.getElementById('vidNoTip')){ var st=document.createElement('style'); st.id='vidNoTip'; st.textContent='#djTip{display:none !important}'; document.head.appendChild(st); } }catch(e){} try{ var p=document.getElementById('occPreview'); if(p) p.classList.remove('show'); }catch(e){}", "point": ".occFactRow"},
   "Your counts stay on this phone. No account, nothing to sign up for, and it keeps working without a signal in the church basement.",
   "New in November: the row under the message reads Text it, WhatsApp, Email it, Copy. Tap WhatsApp and pick the group.",
   "It comes with the Church membership, for every drive you will ever run. Try it below."],
  name:'Shoebox Counter', em:'📦', sub:'how many full boxes can we pack?', cat:'church', mem:'Church membership', showName:'Shoebox Counter', price:'$19 one-time', video:true,
  tag:'Count what’s been donated and it tells you how many complete boxes or kits you can make right now, and what to ask for on Sunday. Works for food and coat drives too.',
  try:'https://jerrywins1.github.io/daraja-apps/church-drive/',
  },
 churchclubhouse: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    "This is The Clubhouse. In the next few minutes you will see what it is for, who it is for, and how a family uses it.",
    "Here is the everyday problem. On Sunday, children learn a Bible story and a memory verse, and they get a paper to take home.",
    "By Monday the paper is lost in the car. By Wednesday, nobody remembers the story or the verse.",
    "Many parents would welcome a phone app for this. But most apps for kids come with ads, chat, strangers, or an account to make. Parents are right to worry.",
    "The Clubhouse is one page from the church to the children. The church writes, and the family reads. That is the whole deal.",
    "There are no accounts, no chat, no comments, and no ads. Nobody can send your child anything here. Only the church puts words on this page.",
    "It is for children and their parents, at home during the week. And it is for the children's leader, who changes the page once a week.",
    {"t": "There are no tabs. It is one page you scroll from top to bottom. At the top is the name, and your church's kids' group. In this example, Immanuel Kids.", "js": "try{document.body.classList.remove('ch-stale');}catch(e){} try{ window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
    {"t": "First comes a short hello from the kids' leaders, about what is happening this week.", "point": "#main > .card:nth-child(1)", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    {"t": "Next is This week at kids' church. It has the lesson title, a few words about the story, and what to bring on Sunday.", "point": "#main > .card:nth-child(2)", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    {"t": "Then the Verse of the week, a short piece of the Bible to learn by heart.", "point": "#main > .card:nth-child(3)", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    {"t": "Under it is a button, Read it to me. Tap it, and the phone reads the verse out loud. That helps children who cannot read well yet.", "point": "button.listen", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    {"t": "Then the Challenge of the week, one small thing to do at home. This week it is a secret kindness mission: do one kind thing without getting caught.", "point": "#main > .card:nth-child(4)", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    {"t": "When your child has done it, tap the big button, I did it. A star appears, and the button changes to Done, see you Sunday.", "point": "#doneBtn", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    "There is one star to earn each week. Tapping again changes nothing. When the church posts a new challenge, there is a new star.",
    "The stars stay only on your device. Not even the church can see them. They are just for your child.",
    {"t": "Below that are countdowns: big numbers showing how many days until fun events at church, like Trunk or Treat, the shoebox collection, and the Christmas pageant.", "point": ".count", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    "When an event's day has passed, its box goes away by itself.",
    {"t": "At the very bottom, a line repeats the promise: no accounts, no chat, no ads, nothing to sign up for.", "point": "footer", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
    "Your first two minutes: open the link your church gives you, read this week's card with your child, and tap Read it to me on the verse.",
    "Then add it to your Home Screen from the Share button, so it opens like any other app, full screen.",
    "For the leader, keeping it fresh means changing one short block of words each week: the hello, the lesson, the verse, the challenge, and the dates. Everything else draws itself.",
    "Nothing is collected from families. The only thing saved is your child's stars, on your own device.",
    "The Clubhouse comes with the Church membership. Families pay nothing and sign up for nothing.",
    {"t": "And the round question mark button has text size, the tour, and help, any time. Profits help students in Kenya stay in school.", "point": "#djDockToggle", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"}]} },
  train:[
   "Here is how a family uses The Clubhouse, one step at a time.",
   {"t": "Step one: open the link your church gives you. To keep it handy, add it to your Home Screen from the Share button.", "js": "try{document.body.classList.remove('ch-stale');}catch(e){} try{ window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
   {"t": "Step two: read the hello and This week at kids' church together. It says what the lesson is, and what to bring on Sunday.", "point": "#main > .card:nth-child(2)", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   {"t": "Step three: find the verse of the week and tap Read it to me. The phone reads it out loud. Say it together a few times.", "point": "button.listen", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   {"t": "Step four: read the challenge of the week. When your child has done it, tap I did it. A star appears, and the button says Done, see you Sunday.", "point": "#doneBtn", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   "There is one star per week. Tapping again changes nothing. When the church posts a new challenge, there is a new star to earn.",
   {"t": "Step five: check the countdowns for what is coming up. When an event's day has passed, its box goes away by itself.", "point": ".count", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   {"t": "Step six: for bigger words, tap the round question mark button, then Text size. The same panel has Take the tour again.", "point": "#djDockToggle", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   "For the leader: each week, change the one short block of words that holds the hello, the lesson, the verse, the challenge, and the countdown dates. Everything else draws itself."],
  lines:[
   "This is The Clubhouse, and it answers a question every children's ministry wrestles with: how do we stay with the kids all week without sending them to social media?",
   {"t": "The answer is one way, on purpose. The church posts, and the family reads. There are no accounts to make, no chat, no comments, no ads, and no strangers.", "js": "try{document.body.classList.remove('ch-stale');}catch(e){} try{ window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
   "Parents can relax, because nobody can send their child anything here. Only the church puts words on this page.",
   {"t": "It opens with a short hello from the kids' leaders.", "point": "#main > .card:nth-child(1)", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   {"t": "Then this week at kids' church: the lesson title, a line about the story, and what to bring on Sunday.", "point": "#main > .card:nth-child(2)", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   {"t": "The verse of the week has a Read it to me button, so even children who cannot read yet can learn it by heart.", "point": "button.listen", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   {"t": "There is a challenge of the week, like a secret kindness mission. When it is done, your child taps I did it, and earns a star. The stars stay on your device. Not even the church sees them.", "point": "#doneBtn", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   {"t": "And countdowns show how many days until the fun things coming up, like Trunk or Treat and the Christmas pageant.", "point": ".count", js:"try{document.body.classList.remove('ch-stale');}catch(e){}"},
   "So when a kid opens it on a Tuesday night, church is still with them, right there in the middle of the week. Kids come back for the stars, and parents know exactly what was taught on Sunday.",
   "Each week the leader changes one short block of words: the hello, the lesson, the verse, the challenge, and the dates. Everything else draws itself.",
   "It comes with the Church membership, and families sign up for nothing. Safer than social media, warmer than a flyer. Try it below."],
  name:'The Clubhouse', em:'🏠', sub:'church-to-kids, safely', cat:'church', mem:'Church membership', price:'$29 one-time', testing:true, video:true,
  tag:'Church-to-kids, one way — no accounts, no chat, no strangers, and no ads to kids or parents',
  try:'https://jerrywins1.github.io/daraja-apps/church-clubhouse/',
  },
 churchgameday: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    "This is GameDay. In the next few minutes you will see what it is for, who it is for, and how to read it.",
    "Here is the everyday problem. A church runs a basketball league for kids. Six teams, and maybe forty families.",
    "Every week the families ask the same questions. When is our game? Who do we play? When is practice? Which door of the gym do we use?",
    "And on a snow day, the league director phones forty families, one by one. Someone always hears too late and drives to an empty gym.",
    "GameDay puts all of it on one page. Every family keeps the same link. The league director writes the schedule once, and everyone reads it.",
    "It is for parents, players, and grandparents, who read it, and for the league director, who keeps it up to date.",
    "Families only read. There is nothing to sign up for, nothing to type, and nothing to save.",
    {"t": "There are no tabs. It is one page, top to bottom. At the top is the name, GameDay, and the name of the league.", "js": "try{ var b=document.getElementById('banner'); if(b && b.getAttribute('data-djx')){ b.textContent=''; b.classList.remove('show'); b.removeAttribute('data-djx'); } }catch(e){}try{ window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
    {"t": "This one is an example league with made-up teams, and a box with a dashed border says so. Your league director puts the real schedule in.", "point": "#main > .card.info:first-child"},
    "Just under the top is the spot for the red banner. Most days it is empty, so you do not see it.",
    {"t": "When games are cancelled, the league director puts a line there, like this example. It is the first thing every family sees. That one banner replaces forty phone calls.", "js": "try{ var b=document.getElementById('banner'); if(b && !b.classList.contains('show')){ b.setAttribute('data-djx','1'); b.textContent='❄️ SNOW — ALL SATURDAY GAMES CANCELLED (example)'; b.classList.add('show'); } window.scrollTo(0,0); }catch(e){}", "point": "#banner"},
    {"t": "Next comes Upcoming games, grouped by day. Each day has its own card with the date at the top.", "js": "try{ var b=document.getElementById('banner'); if(b && b.getAttribute('data-djx')){ b.textContent=''; b.classList.remove('show'); b.removeAttribute('data-djx'); } }catch(e){}", "point": "#main h2:nth-of-type(1) + .card"},
    "On each line you see the two teams, the gym, and on the right, the time of the game.",
    "Games already played drop off by themselves. So the first card is always the next game day.",
    {"t": "Then Standings. W means wins and L means losses. The team on top wears a crown. Teams with the same record show a T before their place, for tied.", "point": "#main table"},
    {"t": "Then Practice times. Each team has its evening of the week, with start and end times.", "point": "#main h2:nth-of-type(3) + .card"},
    {"t": "At the bottom is The gym: its name and address, which door to use, when the snack stand is open, and what to bring.", "point": "#main h2:nth-of-type(4) + .card"},
    "Your first two minutes: open the link, find your team's next game, and check its practice night.",
    "Then add it to your Home Screen from the Share button, so it is one tap away on game day.",
    "Make it a habit: open GameDay before you drive. No red banner means you are playing.",
    "For the league director: you fill in the teams, games, practices, and gym once, in one short block of the app's file. After each game day, you update the wins and losses.",
    "Nothing is collected from families. There are no accounts, no group texts, and no ads to your parents. The schedule still reads without a connection.",
    "GameDay comes with the Church membership, for every season of your league.",
    {"t": "And the round question mark button has text size, the tour, and help, any time. Profits help students in Kenya stay in school.", "point": "#djDockToggle"}]} },
  train:[
   "Here is how families and the league director use GameDay, one step at a time.",
   {"t": "Step one: open the link the league gives you, and add it to your Home Screen from the Share button.", "js": "try{ var b=document.getElementById('banner'); if(b && b.getAttribute('data-djx')){ b.textContent=''; b.classList.remove('show'); b.removeAttribute('data-djx'); } }catch(e){}try{ window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
   {"t": "Step two: look at the very top first. If the league has cancelled games, a red banner is here, like this example. No banner means the games are on.", "js": "try{ var b=document.getElementById('banner'); if(b && !b.classList.contains('show')){ b.setAttribute('data-djx','1'); b.textContent='❄️ SNOW — ALL SATURDAY GAMES CANCELLED (example)'; b.classList.add('show'); } window.scrollTo(0,0); }catch(e){}", "point": "#banner"},
   {"t": "Step three: scroll to Upcoming games. Find your team's name on the first date card to see who you play, and what time.", "js": "try{ var b=document.getElementById('banner'); if(b && b.getAttribute('data-djx')){ b.textContent=''; b.classList.remove('show'); b.removeAttribute('data-djx'); } }catch(e){}", "point": "#main h2:nth-of-type(1) + .card"},
   {"t": "Step four: check Standings for wins and losses. Tied teams show a T before their place.", "point": "#main table"},
   {"t": "Step five: find your team under Practice times.", "point": "#main h2:nth-of-type(3) + .card"},
   {"t": "Step six: the gym card has the address, which door to use, and what to bring.", "point": "#main h2:nth-of-type(4) + .card"},
   {"t": "Need bigger words? Tap the round question mark button, then Text size.", "point": "#djDockToggle"},
   "For the league director: fill in the teams, games, practices, and gym once, in one short block of the app's file. After each game day, update the wins and losses.",
   "To cancel games, type one line in the alert spot of that block. Once the page is updated, the red banner appears for every family who opens it. Clear the line, and the banner is gone."],
  lines:[
   "This is GameDay, for the church basketball league, and every gym ministry like it.",
   "Forty families, six teams, and the same questions every week. When is our game? Who do we play? When is practice? Which door of the gym?",
   "Usually the answers live in a paper schedule, a group text, and a phone tree, and somebody still drives to an empty gym.",
   {"t": "GameDay answers all of it on one page. Every family keeps the same link, and the league director keeps it up to date.", "js": "try{ var b=document.getElementById('banner'); if(b && b.getAttribute('data-djx')){ b.textContent=''; b.classList.remove('show'); b.removeAttribute('data-djx'); } }catch(e){}try{ window.scrollTo(0,0); }catch(e){}", "point": "header h1"},
   {"t": "Upcoming games come grouped by day: who plays who, where, and what time. Games already played drop off by themselves, so the next game day is always first.", "point": "#main h2:nth-of-type(1) + .card"},
   {"t": "The standings show wins and losses, and the leader wears the crown.", "point": "#main table"},
   {"t": "Every team's practice time is listed, and the gym card gives the address, which door to use, and what to bring.", "point": "#main h2:nth-of-type(3) + .card"},
   {"t": "And the big one: the red cancellation banner. Snow day? The league director adds one line, and it sits at the very top of the page, the first thing every family sees.", "js": "try{ var b=document.getElementById('banner'); if(b && !b.classList.contains('show')){ b.setAttribute('data-djx','1'); b.textContent='❄️ SNOW — ALL SATURDAY GAMES CANCELLED (example)'; b.classList.add('show'); } window.scrollTo(0,0); }catch(e){}", "point": "#banner"},
   "Open it before you drive. If there is no red banner, you are playing. That one banner replaces the whole phone tree, forty calls nobody has to make.",
   "The league director sets it up once at the start of the season, and updates the scores after each game day.",
   {"t": "Families never sign up and never type anything. No accounts, no group texts, and no ads to your parents.", "js": "try{ var b=document.getElementById('banner'); if(b && b.getAttribute('data-djx')){ b.textContent=''; b.classList.remove('show'); b.removeAttribute('data-djx'); } }catch(e){}"},
   "It comes with the Church membership, for every season. Try it below."],
  name:'GameDay', em:'🏀', sub:'the league, organized', cat:'church', mem:'Church membership', price:'$29 one-time', video:true,
  tag:'The league schedule that replaces the 40-family phone tree. No ads to your parents.',
  try:'https://jerrywins1.github.io/daraja-apps/church-gameday/',
  },
 churchkey: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This short video explains The Key, church edition. In about four minutes you will know what it is for and how to use it.", "js": "try{ window.scrollTo(0,0); }catch(e){}", "point": "#top"},
    "First, the problem. In many churches, one faithful person knows everything about the building. Where the water shutoff is. Who has keys. Which electrician knows the old wiring. Where the deed is kept.",
    "Then that person retires or moves away. A pipe bursts on a Sunday morning, and nobody knows where to turn off the water.",
    "The Key gets all of that out of one person's head and onto one printed page. You fill it in once, print it, and keep it in the church office.",
    "Who uses it? A pastor, a trustee, a treasurer, a church secretary, or the volunteer who looks after the building.",
    "One important rule. Never write a real password on this page. Only write where the password list is kept, for example, in a sealed envelope in the office safe.",
    {"t": "Now the screen. At the top is the name of the app and what it is for. Under it, a bar shows how many of the five sections you have started.", "point": "#djKeyMeter"},
    {"t": "Below that are the five sections. Tap a title to open it, and tap it again to fold it away. Each section has one writing box.", "js": "try{ document.getElementById('card_f1').open=true; }catch(e){}", "point": "#card_f1 > summary"},
    {"t": "Tap the box and type, one thing per line. The grey example words show the kind of thing to write. They disappear when you start typing.", "point": "#f1"},
    "There is no Save button. Every letter saves on the phone as you type, so you can stop any time and come back later.",
    {"t": "Section one is The building. The water shutoff, the breaker panels, the alarm, and where the keys are kept.", "point": "#card_f1"},
    {"t": "Section two is Accounts and services. The bank, the giving platform, the website, the utilities. Write who is on each account, and where the password list is kept.", "js": "try{ document.getElementById('card_f2').open=true; }catch(e){}", "point": "#card_f2"},
    {"t": "Section three is Papers and policies. The deed, the insurance, the van title, the bylaws, contracts. Write which drawer, safe or lawyer has each one.", "js": "try{ document.getElementById('card_f3').open=true; }catch(e){}", "point": "#card_f3"},
    {"t": "Section four is The people to call. The plumber, the electrician, the insurance agent, the member who fixes things. A name and a phone number for each.", "js": "try{ document.getElementById('card_f4').open=true; }catch(e){}", "point": "#card_f4"},
    {"t": "Section five is Anything else they should know. A wish, an instruction, or a thank you, in your own words.", "js": "try{ document.getElementById('card_f5').open=true; }catch(e){}", "point": "#card_f5"},
    {"t": "Under the sections is a safety reminder: never the passwords, only where they are kept.", "point": ".safety"},
    {"t": "Then the big button, Print my Key. It turns your five sections into one clean page with today's date. Print two copies: one for the office, one for the person you trust most.", "point": "button[onclick=\"printKey()\"]"},
    {"t": "Near the bottom, Start over empties all five boxes, after asking you first.", "point": "button[onclick=\"clearAll()\"]"},
    {"t": "Under that, Save a copy keeps a backup file of your Key, and Bring a copy back restores it, on a new phone for example.", "point": "#djBackup"},
    "How to start? Pick the section you know best and write three lines. That is your first two minutes. The bar at the top fills as you go, and the rest can wait for another evening.",
    "When you change something, like a new plumber or a new alarm company, open the app, fix the line, and print it again.",
    "Privacy: everything stays only on this phone. There is no account, and nothing is sent to anyone.",
    "The Key, church edition comes with the Church membership. Any profit helps orphans and students in Kenya.",
    {"t": "And the question mark button in the corner has the tour and help, any time you need them.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "This is the training for The Key, church edition: how to fill it in, print it, and keep it current.", "js": "try{ window.scrollTo(0,0); }catch(e){}", "point": "#top"},
   "Step one: the welcome card. The first time you open the app, it offers a short tour. Then choose Keep the examples to play with, or Start fresh with my own for five empty sections.",
   {"t": "Step two: tap the title The building to open it. Tap it again to fold it away. The grey line under the title says what belongs there.", "js": "try{ document.getElementById('card_f1').open=true; }catch(e){}", "point": "#card_f1 > summary"},
   {"t": "Step three: tap the box and type, one thing per line. Write where things are: the water shutoff, the breaker panels, the alarm keypad, the master keys.", "point": "#f1"},
   {"t": "Step four: Accounts and services. Write who is on each account, and where the password list is kept. Never the passwords themselves.", "js": "try{ document.getElementById('card_f2').open=true; }catch(e){}", "point": "#card_f2"},
   {"t": "Step five: Papers and policies. The deed, the insurance, the van title, the bylaws, and the drawer, safe or lawyer that has each one.", "js": "try{ document.getElementById('card_f3').open=true; }catch(e){}", "point": "#card_f3"},
   {"t": "Step six: The people to call. A name and a phone number for each: the plumber, the electrician, the insurance agent.", "js": "try{ document.getElementById('card_f4').open=true; }catch(e){}", "point": "#card_f4"},
   {"t": "Step seven: Anything else they should know. A wish, an instruction, or a thank you, in your own words.", "js": "try{ document.getElementById('card_f5').open=true; }catch(e){}", "point": "#card_f5"},
   {"t": "Step eight: watch the bar at the top. It counts the sections you have started, and a gold started mark appears beside each one. There is no Save button. It saves as you type.", "js": "try{ window.scrollTo(0,0); }catch(e){}", "point": "#djKeyMeter"},
   {"t": "Step nine: tap Print my Key. Your phone's print screen opens. Pick a printer, or save it as a PDF. Print two copies.", "point": "button[onclick=\"printKey()\"]"},
   {"t": "Start over empties all five boxes, after asking first. Only tap it if you really mean it.", "point": "button[onclick=\"clearAll()\"]"},
   {"t": "Step ten: once a year, open the app, change what has changed, and print it again. The question mark button has help, a backup copy, and the tour, any time.", "point": "#djDockToggle"}],
  lines:[
   {"t": "This is The Key, church edition: the page you hope you never need, and one day really will.", "js": "try{ window.scrollTo(0,0); }catch(e){}", "point": "#top"},
   "Where is the water shutoff? Who has keys? Which plumber knows the old pipes? Where is the alarm code kept?",
   "In most churches, all of that lives in one faithful person's head. When they move away or step down, it walks out the door with them.",
   {"t": "The Key gets it onto one printed page. Five short sections, a few lines each. About ten minutes, once, and you can stop and come back any time.", "point": "#djKeyMeter"},
   {"t": "The building: the shutoffs, the breaker panels, the alarm, and where the master keys are kept.", "js": "try{ document.getElementById('card_f1').open=true; }catch(e){}", "point": "#card_f1"},
   {"t": "Accounts and services: the bank, the giving platform, the website, and where the password list is kept. Never the passwords themselves.", "js": "try{ document.getElementById('card_f2').open=true; }catch(e){}", "point": "#card_f2"},
   {"t": "Papers and policies: the deed, the insurance, the bylaws, and which drawer or safe holds each one.", "js": "try{ document.getElementById('card_f3').open=true; }catch(e){}", "point": "#card_f3"},
   {"t": "The people to call: the plumber who knows the building, the insurance agent, the member who fixes the furnace. And a last box for anything else they should know.", "js": "try{ document.getElementById('card_f4').open=true; }catch(e){}", "point": "#card_f4"},
   {"t": "There is no Save button. Every word saves on this phone as you type, and this bar fills up as you go.", "js": "try{ window.scrollTo(0,0); }catch(e){}", "point": "#djKeyMeter"},
   {"t": "Then tap Print my Key. One clean page with today's date. Print two: one for the office cabinet, and one for the person you trust most.", "point": "button[onclick=\"printKey()\"]"},
   {"t": "It lives only on your own phone. Nothing is sent anywhere, there is no account to make, and it keeps working without a signal.", "point": ".safety"},
   "It comes with the Church membership, and the building stops depending on any one memory. Try it below."],
  name:'The Key · Church Edition', em:'🔑', sub:'the building’s memory, on paper', cat:'church', mem:'Church membership', price:'$19 one-time', video:true,
  tag:'The water shutoff, the alarm, who has keys, which plumber knows the pipes, all on one printed page, so the next trustee isn’t starting from zero.',
  try:'https://jerrywins1.github.io/daraja-apps/church-key/',
  },
 npgoodstanding: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    "This is Ahead of It, nonprofit edition. In the next few minutes you will see what it is for, who it is for, and how to use it.",
    "Here is the everyday problem. A nonprofit stays tax-exempt only if certain papers go in on time, every year.",
    "The big one is the IRS Form nine-ninety, the yearly report. Miss it three years in a row, and tax-exempt status is revoked automatically.",
    "Then there is the state charitable registration, the annual report, board meetings with minutes, insurance renewals, and year-end letters to donors.",
    "In a small nonprofit, two or three volunteers carry all of that, and nobody is in the office. So a date slips by quietly.",
    "Ahead of It is for that small team: the founder, the treasurer, or the board secretary who ends up holding the calendar.",
    "The big idea is simple. Every deadline lives on one calm page, and each one comes with its own reminder steps, starting thirty days before it is due.",
    {"t": "At the bottom are four tabs: Next, Year, Library, and Hand-off. The round orange plus button adds something of your own.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='next']"},
    {"t": "Start with Library. It holds seventeen things small nonprofits actually face, grouped as IRS, State, Donors, Board, Insurance, Money habits, and Practical.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-lib'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='lib'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='lib']"},
    {"t": "You will find Form nine-ninety, the state registration, donor letters, board minutes, and the monthly bank reconciliation. Tap one, and it goes on your list with a typical date.", "point": "#lib .lib button"},
    {"t": "Or tap the gold Quick setup button. It shows the whole library on one screen, with a tick box and a date beside each item.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ var q=document.getElementById('qsBtn'); if(q) q.click(); }catch(e){}", "point": "input[data-qs]"},
    {"t": "Tick what is yours, fix any date you know, and tap Save my list. Two or three is a fine start.", "point": "#qsOv div[style*='sticky'] button"},
    {"t": "Now the Next tab. This is your main page, sorted by what needs you first.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='next']"},
    {"t": "Overdue is at the top, then Do something now, then Next ninety days, then Later this year. When nothing is overdue, it simply says so.", "point": "#lOver"},
    "Each item shows how many days until it is due, and the one step to take right now, like Gather what you need.",
    "When you finish a step, tap step tick. When the whole filing is done, tap done tick, and the item moves to its next date by itself.",
    {"t": "Something not in the library, like a grant report? Tap the round plus button.", "point": ".fab"},
    {"t": "Give it a name and a next due date, choose how often it repeats, and pick how bad a miss would be: No big deal, A hassle, or Costs real money.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ openEdit(); setTimeout(function(){ try{ document.activeElement.blur(); }catch(e){} }, 120); }catch(e){}", "point": "#fSev"},
    {"t": "You can also note what happens if you miss it, who else needs to know, and where the papers or login are kept. Then tap Save.", "point": "#fWho"},
    {"t": "The Year tab shows the next twelve months on one page, colored by how costly each miss would be. Print it for the board, or add every date to your calendar.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-year'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='year'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='year']"},
    {"t": "The Hand-off tab is for when someone else steps in. It copies or prints one page: what is due, who to tell, and where things are.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-more'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='more'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='more']"},
    {"t": "It also has Save backup file, because everything lives on this one device. And here you write whose list this is.", "point": "button[onclick='exportJson()']"},
    {"t": "Your first two minutes: open Quick setup, tick Form nine-ninety and your state registration, and put in your real dates.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "#qsBtn"},
    "Then glance at the Next tab once a week. If it says Nothing overdue, you are ahead of it.",
    "Your list stays on this device. There is no account, no cloud, and nothing is sent to anyone.",
    "Ahead of It, nonprofit edition comes with the Small charity membership, or with the Church membership.",
    {"t": "And the round question mark button has the tour and help, any time. Profits help students in Kenya stay in school.", "point": "#djDockToggle"}]} },
  train:[
   "Here is how to set up Ahead of It, nonprofit edition, one step at a time.",
   {"t": "Step one: tap Library at the bottom. Tap each filing that applies to you, like Form nine-ninety or your state charitable registration. Each tap adds it to your list.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-lib'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='lib'); }); window.scrollTo(0,0); }catch(e){}", "point": "#lib .lib button"},
   {"t": "Or do step one the quick way: tap the gold Quick setup button, tick everything that is yours, fix the dates you know, and tap Save my list.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ var q=document.getElementById('qsBtn'); if(q) q.click(); }catch(e){}", "point": "input[data-qs]"},
   {"t": "Step two: tap Next. Tap the name of each item, put in its real due date, and tap Save.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "nav button[data-v='next']"},
   {"t": "Step three: for anything not in the library, like a grant report, tap the round plus button. Fill in what it is, when it is due, how often it repeats, and how bad a miss would be.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ openEdit(); setTimeout(function(){ try{ document.activeElement.blur(); }catch(e){} }, 120); }catch(e){}", "point": "#fName"},
   {"t": "Step four: write who else needs to know, like the board secretary, and where the papers or login are kept. Then tap Save.", "point": "#fWhere"},
   {"t": "Step five: open the Next tab each week. When a reminder step is due, do it and tap step tick. When the filing is done, tap done tick, and it moves to its next date.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-next'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='next'); }); window.scrollTo(0,0); }catch(e){}", "point": "#lNow"},
   {"t": "Step six: open Hand-off. Fill in whose list this is, and the default person to tell.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-more'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='more'); }); window.scrollTo(0,0); }catch(e){}", "point": "#owner"},
   {"t": "Step seven: tap Save backup file now and then, because everything lives on this one device.", "point": "button[onclick='exportJson()']"},
   {"t": "When someone else steps in, tap Print the hand-off page or Copy hand-off summary, and send it to them or to the board.", "point": "button[onclick='copyHandoff()']"},
   {"t": "Last, the Year tab. Print the year map for the board, or tap Add all to my calendar.", "js": "try{ if(window.closeSheet) closeSheet(); if(window.closeQS) closeQS(); }catch(e){} try{ document.querySelectorAll('.view').forEach(function(x){ x.classList.toggle('on', x.id==='v-year'); }); document.querySelectorAll('nav button').forEach(function(b){ b.classList.toggle('on', b.dataset.v==='year'); }); window.scrollTo(0,0); }catch(e){}", "point": "#v-year .row button"}],
  name:'Ahead of It · Nonprofit', em:'🕊', sub:'certifications and legal dates', cat:'work', mem:'Church membership, or Small charity $49 a year', price:'$29 one-time', testing:true, video:true,
  tag:'The filings that quietly end small nonprofits — now they can\'t',
  try:'https://jerrywins1.github.io/daraja-apps/np-goodstanding/',
  lines:[
   {t:"This is Ahead of It, nonprofit edition, built for the two-or-three-person nonprofit doing holy work with nobody in the office.", js:"try{go('next');}catch(e){}"},
   {t:"Here is the fact that keeps founders up at night: if a small nonprofit misses its IRS nine-ninety three years in a row, its tax-exempt status is revoked automatically, and that happens to thousands of good organizations every single year.", js:"try{go('next');}catch(e){}", point:"#lNow"},
   {t:"So it holds all of it in one place: the nine-ninety, your state registration, board minutes, the insurance renewal, and the donor letters, and it warns you weeks before anything is due.", js:"try{go('year');}catch(e){}"},
   {t:"It comes pre-loaded with the filings small nonprofits actually face, so you just tick what applies to you and enter your real dates.", js:"try{go('lib');}catch(e){}"},
   {t:"It comes with the Small charity membership, forty-nine dollars a year. It may be the cheapest insurance a mission ever bought. Try it below.", js:"try{go('next');}catch(e){}"}
  ]},
 npreceipts: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    "This is Receipt Maker. In the next few minutes you will see what it is for, who it is for, and exactly how to use it.",
    "Here is the everyday problem. A donor who gives two hundred fifty dollars or more to a church or charity needs a written receipt to claim that gift on their taxes.",
    "That receipt needs certain words the IRS asks for. Leave them out, and the donor's deduction can be at risk.",
    "So every January, a treasurer or a secretary sits down and writes those letters, one at a time. For a small church, that can take a whole weekend.",
    "Receipt Maker is for that person: the volunteer treasurer, the church secretary, or the one-person office of a small nonprofit.",
    "The big idea is simple. You type your organization's details once, list the gifts, and tap one button. It writes a proper letter for every gift, ready to print.",
    {"t": "Everything is on one page, from top to bottom. There are no tabs to learn. Section one is called Your organization.", "point": "#orgName", "js": "try{ if(document.getElementById('pasteWrap').style.display!=='none') togglePaste(); }catch(e){}"},
    {"t": "Type the organization name, the EIN, which is your federal tax number, the address, and the signer's name and title, like Treasurer. You do this once.", "point": "#orgEin"},
    {"t": "Section two is called The gifts. Each gift gets one row with three boxes: donor name, amount, and date received.", "point": "#giftRows"},
    "In the amount box, just type the number. You do not need a dollar sign. The date box opens a calendar.",
    "If someone gave a thing instead of money, like a desk or a computer, type in-kind, a colon, and what it was. For example: in-kind: used office desk. The letter describes the gift without putting a value on it.",
    {"t": "To add a row, tap Add another donor. To remove one, tap the small cross at the end of that row.", "point": "button[onclick=\"addGift()\"]"},
    {"t": "Have the gifts in a spreadsheet already? Tap Paste a list instead. Paste one gift per line: name, amount, date. Then tap Put these into the boxes.", "point": "#gifts", "js": "try{ if(document.getElementById('pasteWrap').style.display==='none') togglePaste(); }catch(e){}"},
    {"t": "Under the gifts are two tick boxes. No goods or services starts ticked. Untick it if donors received something, like a dinner, and each letter gets a blank for what they received and its value.", "point": "#noGoods", "js": "try{ if(document.getElementById('pasteWrap').style.display!=='none') togglePaste(); }catch(e){}"},
    {"t": "Tick We are a church if you are one. The letter then uses the IRS wording for churches, which mentions intangible religious benefits.", "point": "#isChurch"},
    {"t": "Then tap the big button, Make the letters. You get one letter for each gift, all at once.", "point": "button[onclick=\"makeLetters()\"]"},
    "If a row is missing a name or an amount, it is not quietly dropped. A note above the letters names every row it skipped, and why.",
    "Each letter has today's date, a warm thank you, the gift and its date, the right tax wording, and the signer's name.",
    "Tap any letter to change its words, perhaps to add a personal line.",
    "Then tap Print them all. Each letter prints on its own page, without the boxes and buttons. Sign them, and they are ready to mail.",
    "Your first two minutes: fill in Your organization, add one real gift, and tap Make the letters. Read that letter before you do the whole list.",
    {"t": "Your organization and gift rows stay saved on this device. The letters are made fresh each time, with one tap. Start fresh, at the very bottom, clears it all, and asks twice first.", "point": "footer"},
    "No account is needed, and donor names stay on your own device. It works without a connection, too.",
    "One honest note, printed right in the app: this is not tax advice. When in doubt, ask your accountant.",
    "Receipt Maker comes with the Small charity membership, or with the Church membership. Any profit helps orphans and students in Kenya.",
    {"t": "And the round question mark button has the tour and help, any time.", "point": "#djDockToggle"}]} },
  train:[
   "Here is how to set up Receipt Maker and make your first letters. Everything happens on one page, from top to bottom.",
   {"t": "Step one: under Your organization, type the organization name, the EIN, the address, and the signer's name and title. You do this once, and it is saved on this device.", "point": "#orgName", "js": "try{ if(document.getElementById('pasteWrap').style.display!=='none') togglePaste(); }catch(e){}"},
   {"t": "Step two: under The gifts, fill in one row for each gift: the donor name, the amount, and the date received.", "point": "#giftRows"},
   "For a gift of things instead of money, type in-kind, a colon, and what it was, in the amount box. For example: in-kind: used office desk.",
   {"t": "Step three: tap Add another donor for each new row. The small cross at the end of a row removes it.", "point": "button[onclick=\"addGift()\"]"},
   {"t": "Already have the gifts in a spreadsheet? Tap Paste a list instead. Paste one gift per line, name, amount, date, then tap Put these into the boxes.", "point": "#gifts", "js": "try{ if(document.getElementById('pasteWrap').style.display==='none') togglePaste(); }catch(e){}"},
   {"t": "Step four: check the two tick boxes. Leave No goods or services ticked unless donors got something back, like a dinner. Tick We are a church if you are one.", "point": "#noGoods", "js": "try{ if(document.getElementById('pasteWrap').style.display!=='none') togglePaste(); }catch(e){}"},
   {"t": "Step five: tap Make the letters. You get one letter for each gift, and a note naming any row it skipped, and why.", "point": "button[onclick=\"makeLetters()\"]"},
   "Step six: tap any letter to add a personal line. Then tap Print them all, and each letter prints on its own page, ready to sign.",
   {"t": "Your organization and gift rows stay saved on this device, and the letters are made fresh with one tap. To clear everything, use Start fresh at the very bottom.", "point": "footer"}],
  name:'Receipt Maker', em:'💌', sub:'donor letters, done', cat:'church', mem:'Church membership, or Small charity $49 a year', price:'$19 one-time', testing:true, video:true,
  tag:'January\'s donor letters in ten minutes',
  try:'https://jerrywins1.github.io/daraja-apps/np-receipts/',
  lines:[
   {t:"This is Receipt Maker — for the January job every small nonprofit dreads.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#orgName"},
   {t:"Donors need proper acknowledgment letters, with the exact IRS language, or their deduction is at risk — and your credibility with it.", point:"#noGoods"},
   {t:"Paste your donor list. Receipt Maker builds a proper letter for each one — right language, right layout, one page each.", point:"#pasteBtn"},
   {t:"Print the whole stack, sign, stamp, done. January in ten minutes instead of a lost weekend.", point:"#giftRows"},
   {t:"It comes with the Small charity membership, or with the Church membership. Your treasurer will hug you. Try it below.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#orgName"}]},
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
 flipkit: {
  name:'FlipKit', em:'💸', sub:'clutter into cash', cat:'home', price:'$9', testing:true, fresh:true, video:true,
  tag:'Turn your clutter into cash — your AI prices it, writes the listing, you pocket the money. Why not just ChatGPT? FlipKit asks it the right question, then keeps your floor price and your cash total.',
  try:'https://jerrywins1.github.io/daraja-apps/flipkit/',
  extra:{ firsttime:{title:"Explain it to me", sub:"About three minutes, for a first-timer: what it is for, who it helps, and how a flip works. Sound on.", lines:[
   {t:'Welcome. This video explains FlipKit: what it is for, and how one flip works start to finish.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"},
   'It is for the stuff you already own and do not want. The garage, the back of the closet, the corner of the basement.',
   'Most of that never gets sold, and it is not laziness. Selling is two separate chores: working out what a thing is worth, and then writing the listing. Either one is enough to put it off another year.',
   {t:'FlipKit takes both chores off you. Here is the whole loop.', js:"try{window.scrollTo(0,0);}catch(e){}"},
   {t:'You add a thing. A Weber grill, five years old, good condition. Brand and age matter, because they are what a price hangs on.', point:"#nm"},
   {t:'You pick the honest condition. Honest sells faster, and it stops the haggling when somebody turns up and sees a scratch you did not mention.', point:"#cond"},
   {t:'Then you tap Price it with my AI. FlipKit does not have its own AI and does not charge you for one. It writes the right question and copies it for you.', point:"#notes"},
   'You open whichever AI you already use, paste the question in, and attach a photo of the thing.',
   {t:'Copy the whole answer back into FlipKit, and it reads out three things: an asking price, a floor you will not go below, and a finished listing with a title and description.', point:"#notes"},
   {t:'The floor is the part that earns its keep. It is decided while you are calm, not while somebody is standing in your driveway offering you half.', point:"#notes"},
   {t:'Tap Copy the listing, paste it into Facebook Marketplace or wherever you sell, and that is the job. About ninety seconds.', point:"#notes"},
   {t:'At the top sits the number that makes this addictive: what everything you have added is worth together. Every time something sells, the cash line climbs.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"},
   {t:'When it sells, tap Sold and type what you actually got. Not the asking price — what landed in your hand.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"},
   'There is a selling-safely card too: meet in public, take cash, trust your gut. Read it once.',
   'Nothing leaves your phone. No account, no listing fees to us, and we never see what you sold or what you got for it.',
   {t:'That is FlipKit. Go and add the thing you almost sold last spring — it is still in the garage.', js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"}
  ]} },
  lines:[
   {t:"This is FlipKit, the only app in this store that pays for itself the very first time you use it.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"},
   "Because here is the truth: your garage, your closets, and your basement are hiding a few hundred dollars, and the only reason it never gets sold is that selling is two chores. You have to figure out what a thing is worth, and then you have to write the listing.",
   {t:"FlipKit removes both chores. You add a thing, say, a Weber grill, five years old, good condition, and tap one button.", point:"#nm"},
   {t:"That button hands your own AI, whichever one you already use, a smart pricing question. You attach a photo, and paste the answer back.", point:"#cond"},
   {t:"And just like that you have an asking price, a do-not-go-below floor, and a finished listing, title and description, written to get messages.", point:"#notes"},
   {t:"You tap copy, paste it into Facebook Marketplace, and the whole job took about ninety seconds.", point:"#notes"},
   {t:"Meanwhile the big number at the top shows what all of your stuff is worth together, and every time something sells, the cash line climbs. That number gets addictive in the best way.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"},
   "There is even a selling-safely card: meet in public, take cash, and trust your gut.",
   {t:"Your first flip shows you how it works, and everything after that is yours. Go add the thing you almost sold last spring.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"}
  ],
  train:[
   {t:"Let's flip your first thing — five minutes, real money.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"},
   {t:"Step one: think of one thing you'd sell if it weren't a hassle. Type it in — with the brand and how old it is.", point:"#nm"},
   {t:"Step two: pick the honest condition. Honest sells faster and stops the haggling later.", point:"#cond"},
   {t:"Step three: tap 'Price it with my AI.' The question is copied. Open ChatGPT or Claude, paste it, and attach a photo of the thing.", point:"#notes"},
   {t:"Step four: copy the AI's whole answer, come back, paste it in the box, tap 'Read the AI's answer.' Boom — price, floor, and a finished listing.", point:"#notes"},
   "Step five: tap 'Copy the listing' and paste it into Facebook Marketplace. That's the whole job.",
   {t:"When it sells, tap 'Sold!' and enter what you got. The cash line at the top starts adding up — and that number is very motivating.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"},
   {t:"Read the selling-safely card once. Then go find the next thing — the garage isn't empty yet.", js:"try{window.scrollTo(0,0);}catch(e){}", point:"#worthBig"}]},
 rafiki: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "This video explains Rafiki from the very beginning. If you have never seen it, that is fine.", "point": "#hello button[onclick=\"begin()\"]", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('hello'); window.scrollTo(0,0); }catch(e){}"},
    "The everyday problem: when you live alone, whole days go by with nobody asking how you are. And little things slip, like the dentist or a call you meant to make.",
    "Rafiki helps in two ways. It is company: it talks with you, learns your family's names, and tells a joke when you ask. And it is a memory helper: it keeps your list of things to do.",
    "It is for anybody who lives alone, especially older people. Often a grandchild helps with the first visit.",
    "The big idea: Rafiki is a friend who speaks first. It asks, and you answer.",
    {"t": "Every visit starts here. Tap Say hello, and your friend starts talking. Turn your sound on. If you hear nothing, Test the sound tells you what to fix.", "point": "#hello button[onclick=\"begin()\"]"},
    {"t": "Now the conversation, shown here with an example. Your friend's words are in the dark bubbles, read out loud. Your answers are in the blue bubbles.", "point": "#rfxQ", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('name'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "At the bottom is one box. Tap Talk and say your answer, or type it. Then tap Send. Nothing goes until you tap Send.", "point": "#rfxSend"},
    {"t": "The first visit is a getting-to-know-you chat. It asks what you would like to call it. You choose its name, for good.", "point": "#rfxMe"},
    {"t": "Then it offers voices. Tap a name to hear it, then tap Keep.", "point": "#rfxVoices", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('voice'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "It asks your name, how you like to be greeted, and about your family. Say how many children or grandchildren, and you get one box for each name. Then tap Save these names.", "point": "#rfxKids", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('family'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Tired of questions? That's enough for today is always there. It keeps everything you said.", "point": "#rfxEnough"},
    {"t": "It asks about pets, then you pick the face it wears on your screen.", "point": "#rfxFaces", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('faces'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "If you like, it learns your week: what you do every week, every month, and which doctors you see. One to a box, or tap none.", "point": "#rfxWeek", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('week'); window.scrollTo(0,0); }catch(e){}"},
    "All of that goes on your list. If you use our One Thing app too, it is the very same list.",
    {"t": "After that, every visit starts with a hello by name and the date. If you allow your rough location, it tells you the weather too.", "point": "#rfxGreet", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('menu'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Then it tells you what is waiting, and asks: so, what now? These buttons are your choices.", "point": "#rfxNowChips"},
    {"t": "Read me my list reads it out loud. Each thing has a done button. Tap it, and it is ticked off.", "point": "#rfxList", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('list'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "To add something, say it like you would to a friend: remind me to call Aaron on Sunday. It says it back, so you know it is kept.", "point": "#rfxGot", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('remember'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Ask for a joke and you get a clean one. Tap Another one for more.", "point": "#rfxJoke", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('joke'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Tell it you feel down, and it asks how your heart is today. It is a friend, not a doctor, and it says so.", "point": "#rfxCheck", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('checkin'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "If you tap Heavy, it stays with you, and offers a real person: 9-8-8, free, day or night, by call or text. If you are in danger right now, it says to call 9-1-1.", "point": "#rfx988", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('heavy'); window.scrollTo(0,0); }catch(e){}"},
    {"t": "Along the top: voice, the speaker to turn talking off and on, Aa for bigger words, and the brush to start over. It always asks before erasing anything.", "point": "header .pills", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('menu'); window.scrollTo(0,0); }catch(e){}"},
    "Your first two minutes: tap Say hello, give it a name, pick a voice, and tell it your name. You can stop there; it keeps everything.",
    {"t": "Privacy: everything you tell Rafiki stays on this phone. No account, no password, and nothing you tell it is sent anywhere. Only the weather uses the internet, and only if you say yes.", "point": "#hello .v", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('hello'); window.scrollTo(0,0); }catch(e){}"},
    "Rafiki comes with the Family membership.",
    {"t": "And the question mark button in the corner has the tour, bigger text and help, any time.", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('menu'); window.scrollTo(0,0); }catch(e){}"}]} },
  train:[
   {"t": "Here is how to get started with Rafiki. It takes about five minutes, and you can stop whenever you like.", "point": "#hello button[onclick=\"begin()\"]", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('hello'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step one: turn your sound on and tap Say hello. If you cannot hear it, tap Test the sound, and it tells you what to fix.", "point": "#hello button[onclick^=\"soundCheck\"]"},
   {"t": "Step two: give your friend a name. Type it in the box, or tap Talk and say it. Then tap Send. Nothing is sent until you tap Send.", "point": "#rfxSend", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('name'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step three: choose a voice. Tap a name to hear it, then tap Keep.", "point": "#rfxVoices", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('voice'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step four: tell it about your people. Your name, how you like to be greeted, your husband or wife, then your children or grandchildren, one name to a box. Tap Save these names.", "point": "#rfxKidsSave", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('family'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Had enough questions for one day? Tap That's enough for today. It keeps everything you said.", "point": "#rfxEnough"},
   {"t": "Step five: pick the face it wears on your screen.", "point": "#rfxFaces", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('faces'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Step six, if you like: tap Yes, let's do my week. Type one thing to a box for every week, then every month, then your doctors. Tap Save these, or tap none.", "point": "#rfxWeek", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('week'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "From then on, every visit starts with a hello by name, and the question: so, what now?", "point": "#rfxNowChips", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('menu'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Tap Read me my list to hear what is waiting. Each thing has a done button. Tap it when you have finished.", "point": "#rfxList", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('list'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "To add something, tap Put something on my list, or just say it in your own words, like remind me to call Aaron on Sunday.", "point": "#rfxGot", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('remember'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Along the top: voice changes the voice, the speaker turns talking off and on, Aa makes the words bigger, and the brush starts over. It always asks first.", "point": "header .pills", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('menu'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "You will know it is working when you come back tomorrow and it greets you by name. The question mark button has the tour and help any time.", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('menu'); window.scrollTo(0,0); }catch(e){}"}],
  lines:[
   {"t": "This is Rafiki, and it is not a to-do list. It is company.", "point": "#hello button[onclick=\"begin()\"]", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('hello'); window.scrollTo(0,0); }catch(e){}"},
   "There is a particular quiet that settles on a house when there is one person in it. The phone rings less. Whole days go by when nobody asks how you are.",
   {"t": "Rafiki asks. It does not have a name until you give it one, and once you do, that is its name forever.", "point": "#rfxMe", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('name'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Then it gets to know you the way a new friend would. Your name. Your husband or wife. Your children, one at a time. What you do on a Tuesday. Which doctors you see.", "point": "#rfxKids", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('family'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "You pick its face and its voice, and it reads everything out loud. Tap the microphone and talk, or type, whichever is easier.", "point": "#rfxFaces", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('faces'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "And after that it speaks first. Good morning by name, what is on your list today, and if you have been away a while, a note that it kept your seat warm.", "point": "#rfxGreet", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('menu'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Tell it what to remember, the way you would tell a friend, and it says it back to you and puts it on your list.", "point": "#rfxGot", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('remember'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Ask for a joke and you get a good clean one. Tell it you feel low, and it stays with you, and offers a real person to talk to.", "point": "#rfxJoke", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('joke'); window.scrollTo(0,0); }catch(e){}"},
   {"t": "Everything you tell it stays on your own phone. No account, nothing you tell it sent anywhere, nobody reading it. That is not a footnote. For a lot of people it is the whole reason they will answer honestly.", "point": "#hello .v", "js": "try{ if(!window.__rfx){ (window.DJ_TOUR&&DJ_TOUR.demo||[]).some(function(d){ if(d.go && d.go.indexOf('window.__rfx = function')===0){ eval(d.go); return true; } return false; }); } window.__rfx && __rfx('hello'); window.scrollTo(0,0); }catch(e){}"},
   "It comes with the Family membership, which costs rather less than one afternoon of company usually does.",
   "If you know somebody who lives alone, this is the one to show them. Try it below."],
  name:'Rafiki', em:'💛', sub:'a friend who knows your family', cat:'later', mem:'Family membership', price:'$19 one-time', testing:true, fresh:true, video:true,
  tag:'For anybody who lives alone — a friend that learns your family, remembers what you tell it, and speaks first. Why not just ChatGPT? Rafiki says good morning by name, and nothing you tell it leaves your phone.',
  try:'https://jerrywins1.github.io/daraja-apps/rafiki/',
  },
 porchlight: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Porchlight: what it is for, and how to use it.", "js": "try{porchTour.scene('welcome')}catch(e){}"},
    "First, the problem. Real notes from family get buried under adverts, and some emails are scams made to look urgent.",
    "Porchlight is a patient helper. It sorts your email, reads it out loud, and helps you write back.",
    "It is for anyone who dreads their inbox, especially older adults who want big words and plain language.",
    "Porchlight reads your real Gmail when you open it inside Claude, with your own Claude account. The try-it page uses example emails.",
    {"t": "It starts with easy questions, one at a time. Tap Let's get started. Read this to me reads any question aloud.", "js": "try{porchTour.scene('welcome')}catch(e){}", "point": ".btn-big"},
    {"t": "Type the name you'd like to be called, and tap Next. Then name your helper: Sunny, Grace, Buddy, Penny, or your own.", "js": "try{porchTour.scene('name')}catch(e){}", "point": "#f-name"},
    {"t": "What would you like help with? Sort my email, My calendar, My to-do list, Weather, a joke or Bible verse, and more. Tap all you want.", "js": "try{porchTour.scene('goals')}catch(e){}", "point": ".choices"},
    {"t": "Which email do you use? Gmail connects directly. For others, it shows how to send a copy to a free Gmail account.", "js": "try{porchTour.scene('provider')}catch(e){}", "point": ".choices"},
    {"t": "Tap Connect my Gmail, then Allow. If Google asks you to sign in, your password goes into Google, never into Porchlight.", "js": "try{porchTour.scene('connect')}catch(e){}", "point": ".steps-list"},
    {"t": "Whose emails should come first? Your children, your doctor, your church. Type a name, and tap Add this person.", "js": "try{porchTour.scene('vips')}catch(e){}", "point": "#f-vip"},
    {"t": "Last, pick a word size: Big, Bigger or Biggest. Then tap Take me to my Home page.", "js": "try{porchTour.scene('size')}catch(e){}", "point": ".sizes"},
    {"t": "Your Home page greets you by name and shows only what you asked for, in big cards.", "js": "try{porchTour.scene('home')}catch(e){}", "point": ".hello"},
    {"t": "Along the bottom are five buttons: Home, Mail, To-Do, Talk, and My Setup. Help sits at the top of every screen.", "point": "nav"},
    {"t": "Tap Go through my mail, and it sorts your newest emails into four groups.", "point": ".card .btn-big"},
    {"t": "Needs your answer comes first. Then Be careful, may be a scam. Then Good to know. Last, Can wait, for adverts and newsletters.", "js": "try{porchTour.scene('mail')}catch(e){}", "point": ".group-title"},
    {"t": "Each email says why it is there. Tap Read it to open one. Read it to me says it out loud. Explain it simply tells you what it wants.", "point": ".mail.reply"},
    {"t": "For a scam, tap Show me why. Here, Amazon is spelled with a zero. Porchlight says it plainly: be careful, and don't click.", "js": "try{porchTour.scene('scam')}catch(e){}", "point": ".note"},
    {"t": "To answer, tap Help me answer. Say what you mean in the top box, tap Write it for me, and change anything you like.", "js": "try{porchTour.scene('reply')}catch(e){}", "point": "#f-wish"},
    {"t": "Then tap Send my answer. It asks once more, and nothing goes until you tap Yes, send it. Or tap Save it as a draft instead.", "point": "#f-draft"},
    {"t": "Finished with one? Tap I'm done with this, and it moves out of the way.", "js": "try{porchTour.scene('mail')}catch(e){}", "point": ".mail.reply"},
    {"t": "On the To-Do page, type something to remember, tap Add to my list, and tap the big box when it's done.", "js": "try{porchTour.scene('todo')}catch(e){}", "point": "#f-task"},
    {"t": "On the Talk page, chat with your helper. Paste a text message you got, and it tells you if it looks like a scam.", "js": "try{porchTour.scene('talk')}catch(e){}", "point": "#chatlog .say"},
    {"t": "Next to it, Family notes is a board your invited family can write on too.", "js": "try{porchTour.scene('family')}catch(e){}"},
    {"t": "My Setup lets you redo the questions, change the word size, or erase everything and start fresh.", "js": "try{porchTour.scene('settings')}catch(e){}", "point": ".card .btn-big"},
    {"t": "To start, sit down once with someone you trust and answer the questions. Then each morning, open your Home page, go through your mail, and begin at the top.", "js": "try{porchTour.scene('home')}catch(e){}", "point": ".hello"},
    "Porchlight never asks for your passwords, and sends nothing unless you tap Send and say yes. Your answers stay on this device, or in your own Claude account.",
    "Any profit helps orphans and students in Kenya.",
    {"t": "Stuck? Tap Help at the top of any screen. It explains the page you are on, in plain words.", "js": "try{porchTour.scene('help')}catch(e){}"}]} },
  train:[
   "Let's set up Porchlight together. It takes about ten minutes, once.",
   {"t": "Step one: open Porchlight inside Claude, at claude dot A I, or in the Claude app. That is what lets it read your Gmail. Tap Let's get started.", "js": "try{porchTour.scene('welcome')}catch(e){}", "point": ".btn-big"},
   {"t": "Step two: type the name you'd like to be called, and tap Next. Then give your helper a name. Sunny, Grace, Buddy, Penny, or one of your own.", "js": "try{porchTour.scene('name')}catch(e){}", "point": "#f-name"},
   {"t": "Step three: tap everything you want help with. Tap again to undo. You can change these any time.", "js": "try{porchTour.scene('goals')}catch(e){}", "point": ".choices"},
   {"t": "Step four: pick your email. Gmail connects directly. For Outlook, Yahoo, AOL or iCloud, Porchlight shows the steps to send a copy to a free Gmail account. A family member can do it in five minutes.", "js": "try{porchTour.scene('provider')}catch(e){}", "point": ".choices"},
   {"t": "Step five: tap Connect my Gmail. Claude asks if Porchlight may use Gmail. Tap Allow. If Google asks you to sign in, you type your password into Google, never into Porchlight. When it works, a green note says it can see your mailbox.", "js": "try{porchTour.scene('connect')}catch(e){}", "point": ".steps-list"},
   {"t": "Step six: add the people whose emails should always come first. Type a name or an email address, and tap Add this person.", "js": "try{porchTour.scene('vips')}catch(e){}", "point": "#f-vip"},
   {"t": "Then answer the rest: your zip code for the weather, your favorite websites, a verse or a joke each day. Last, pick the word size that's comfortable, and tap Take me to my Home page.", "js": "try{porchTour.scene('size')}catch(e){}", "point": ".sizes"},
   {"t": "This is your Home page. Each morning, tap Go through my mail. The first time, Claude asks if Porchlight may use Claude to sort your mail. Tap Allow.", "js": "try{porchTour.scene('home')}catch(e){}", "point": ".card .btn-big"},
   {"t": "Start with the red pile: Needs your answer. Tap Read it to open an email. Inside, Read it to me says it out loud, and Explain it simply tells you what it wants from you.", "js": "try{porchTour.scene('mail')}catch(e){}", "point": ".mail.reply"},
   {"t": "To answer, tap Help me answer. In the top box, say what you mean, like: Yes, I'll be there Sunday. Tap Write it for me, and change anything you like. Then tap Send my answer, and Yes, send it. Or save it as a draft.", "js": "try{porchTour.scene('reply')}catch(e){}", "point": "#f-wish"},
   {"t": "Orange means be careful. Don't click links or call numbers in those emails. When you're finished with any email, tap I'm done with this, and it moves out of the way.", "js": "try{porchTour.scene('scam')}catch(e){}", "point": ".note"},
   {"t": "On the To-Do page, type something to remember and tap Add to my list. Tap the big box when it's done. From any email, Add to my to-do list puts it here too.", "js": "try{porchTour.scene('todo')}catch(e){}", "point": "#f-task"},
   {"t": "On the Talk page, ask your helper anything. Paste a text message you got, and it tells you if it looks like a scam. Say: remind me to call Sarah, and it adds that to your list.", "js": "try{porchTour.scene('talk')}catch(e){}", "point": "#chatlog .say"},
   {"t": "My Setup lets you change any answer, make the words bigger, or start fresh. And if you ever get stuck, tap Help at the top of any screen.", "js": "try{porchTour.scene('settings')}catch(e){}", "point": ".card .btn-big"},
   {"t": "That's it. One easy page, every morning, and your helper is always one tap away.", "js": "try{porchTour.scene('help')}catch(e){}"}],
  lines:[
   "This is Porchlight. It sorts your email for you, puts what matters on top, and warns you before you click on a scam.",
   {"t": "It starts by getting to know you. There are no videos to watch and nothing to install. A friendly helper asks a few easy questions, one at a time.", "js": "try{porchTour.scene('welcome')}catch(e){}", "point": ".btn-big"},
   {"t": "What should I call you? What would you like help with? Your email, your calendar, a to-do list, the weather, a Bible verse each morning. You tap what you want, and it builds your page around your answers.", "js": "try{porchTour.scene('goals')}catch(e){}", "point": ".choices"},
   {"t": "Then it asks whose emails should always come first. Your children, your doctor, your church.", "js": "try{porchTour.scene('vips')}catch(e){}", "point": ".chips"},
   {"t": "Here is the Home page it built. Good morning, by name, and only the things you asked for.", "js": "try{porchTour.scene('home')}catch(e){}", "point": ".hello"},
   {"t": "Tap Go through my mail, and it reads your newest emails and sorts them into four piles. Red needs your answer. Orange might be a scam. Blue is good to know. Gray can wait.", "js": "try{porchTour.scene('mail')}catch(e){}", "point": ".group-title"},
   {"t": "Look at this one. Amazon spelled with a zero, an urgent warning, and a request for your password. Porchlight says it in plain words: be careful, and don't click.", "js": "try{porchTour.scene('scam')}catch(e){}", "point": ".note"},
   {"t": "For the email from your daughter, tap Help me answer. Say what you mean in your own words, and it writes a kind reply. Nothing is sent until you tap Send, and then say yes.", "js": "try{porchTour.scene('reply')}catch(e){}", "point": "#f-draft"},
   {"t": "There is a to-do list with big check boxes, a place to talk with your helper, and a board where the family can leave notes. Every question can be read out loud, and the words come in three sizes.", "js": "try{porchTour.scene('todo')}catch(e){}", "point": ".todo"},
   {"t": "Sorting your real Gmail, talking with your helper and the family board all work when you open Porchlight inside Claude, with your own Claude account. The try-it page below shows example emails, so you can see how it works first.", "js": "try{porchTour.scene('home')}catch(e){}", "point": ".card .btn-big"},
   "If you know someone who dreads their inbox, show them this one. Try it below."],
  name:'Porchlight', em:'🏮', sub:'your mail sorted, scams caught', cat:'later', mem:'Family membership', price:'$29 one-time', testing:true, fresh:true, video:true,
  tag:'A patient helper that asks a few easy questions, then sorts your Gmail into what needs an answer, what can wait, and what looks like a scam. It reads mail aloud and helps you write back. The try-it page shows example mail; sorting your real Gmail works when you open it inside Claude.',
  try:BASE+'porchlight/',
  
  },
 duka: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what Duka is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains an app called Duka. In about four minutes you will know what it is for and how to use it.", "js": "try{closeSheet();}catch(e){} try{go('today');window.scrollTo(0,0);}catch(e){}"},
    {"t": "Duka means shop. It is for a small shop that sells phones and electronics: phones, chargers, earphones, TVs, solar lamps, and repairs.", "js": "try{closeSheet();}catch(e){} try{go('today');window.scrollTo(0,0);}catch(e){}"},
    {"t": "The problem: a busy shop owner sells all day, but in the evening does not know the profit, the cash is short and nobody knows why, and customers who owe are forgotten."},
    {"t": "Duka keeps all of it on the owner's phone. It works with no internet. Nothing is sent anywhere unless you send it."},
    {"t": "This is the example shop: Baraka Electronics in Nakuru, run by Wanjiru. At the bottom are six tabs: Today, Sell, Stock, Customers, Offers and Money.", "point": "#nav"},
    {"t": "Today shows sales today, the profit, the cash that should be in the drawer, and what should be on M-Pesa.", "point": "#kpiSales"},
    {"t": "Needs you is the to-do list the app makes by itself: items running low, a repair ready, a customer who owes money.", "point": "#needs"},
    {"t": "Now Sell. Find the item by typing a few letters, or tap one of the quick buttons.", "js": "try{closeSheet();}catch(e){} try{go('sell');window.scrollTo(0,0);}catch(e){}", "point": "#sSearch"},
    {"t": "Here is a Tecno Spark 20 and a screen protector. Plus and minus change how many. The price box lets you write the price you agreed with the customer.", "js": "try{closeSheet();}catch(e){} try{go('sell');addToCart(D.items.find(function(i){return /Spark/.test(i.name)}).id);addToCart(D.items.find(function(i){return /protector/.test(i.name)}).id);window.scrollTo(0,0);}catch(e){}", "point": "#cart"},
    {"t": "If the price is below what you paid, Duka warns you. No more selling at a loss by mistake.", "js": "try{closeSheet();}catch(e){} try{CART[0].price=14000;renderCart();window.scrollTo(0,0);}catch(e){}", "point": "#cart"},
    {"t": "Type the customer's name and phone. Ask if they want offers by WhatsApp. Kenya's law says they must agree first.", "js": "try{closeSheet();}catch(e){} try{CART[0].price=16500;renderCart();renderPay();window.scrollTo(0,0);}catch(e){}", "point": "#custBox"},
    {"t": "Paid by M-Pesa, cash, card, or deni, which means they pay later. For M-Pesa, paste the confirmation message, and Duka fills in the code and checks the amount.", "point": "#payBox"},
    {"t": "Save, and the receipt is ready, with the warranty date. Send it on WhatsApp so the customer keeps it.", "js": "try{closeSheet();}catch(e){} try{go('today');setTimeout(function(){showReceipt(D.sales.slice().sort(function(a,b){return b.at-a.at})[1].id)},300);window.scrollTo(0,0);}catch(e){}", "point": "#rcptText"},
    {"t": "Stock. Every sale takes the item out of stock. The coloured label shows what is left, and what is running low.", "js": "try{closeSheet();}catch(e){} try{go('stock');window.scrollTo(0,0);}catch(e){}", "point": "#stockList"},
    {"t": "When new stock comes in, open the item and tap Restock. It adds to the stock and records what you paid the supplier.", "point": "#addItemBtn"},
    {"t": "The reorder list writes the order for your supplier, ready for WhatsApp.", "js": "try{closeSheet();}catch(e){} try{go('stock','low');setTimeout(reorderSheet,300);window.scrollTo(0,0);}catch(e){}", "point": "#reorderText"},
    {"t": "Customers. Everyone you sold to is here, with what they bought.", "js": "try{closeSheet();}catch(e){} try{go('people','all');window.scrollTo(0,0);}catch(e){}", "point": "#custList"},
    {"t": "Owe me shows deni: who owes, how much, since when. Remind sends a polite message. Record payment when they pay.", "js": "try{closeSheet();}catch(e){} try{go('people','deni');window.scrollTo(0,0);}catch(e){}", "point": "#deniList"},
    {"t": "Repairs: write down what came in, mark it ready, tell the customer, and record the payment when they collect.", "js": "try{closeSheet();}catch(e){} try{go('people','repairs');window.scrollTo(0,0);}catch(e){}", "point": "#repairList"},
    {"t": "Offers is the marketing. Write one message, like new stock or a weekend offer, and choose who gets it: everyone, or only people who bought a phone.", "js": "try{closeSheet();}catch(e){} try{go('offers');window.scrollTo(0,0);}catch(e){}", "point": "#offerNew"},
    {"t": "Then tap each name. WhatsApp opens with their name already in the message. You press send. Duka shows who came back and bought.", "js": "try{closeSheet();}catch(e){} try{go('offers',D.offers[0].id);window.scrollTo(0,0);}catch(e){}", "point": "#ofPeople"},
    {"t": "Money. Every evening, count the cash in the drawer and check the M-Pesa balance. Duka says if it matches, or how much is short.", "js": "try{closeSheet();}catch(e){} try{go('money','cash');window.scrollTo(0,0);}catch(e){}", "point": "#countCard"},
    {"t": "Money out: rent, KPLC tokens, transport. Paste the M-Pesa message and it fills in by itself.", "js": "try{closeSheet();}catch(e){} try{go('money','out');window.scrollTo(0,0);}catch(e){}", "point": "#oMsg"},
    {"t": "Bills: rent, wages and internet each month. Paying a bill also records it as money out.", "js": "try{closeSheet();}catch(e){} try{go('money','bills');window.scrollTo(0,0);}catch(e){}", "point": "#billList"},
    {"t": "The report writes itself: sales, profit, money out, the cash count, deni, low stock and offers. Copy it to WhatsApp.", "js": "try{closeSheet();}catch(e){} try{go('money','report');window.scrollTo(0,0);}catch(e){}", "point": "#repText"},
    {"t": "That is Duka: sell, keep stock, count the cash, remember who owes, and bring customers back. Asante for watching.", "js": "try{closeSheet();}catch(e){} try{go('today');window.scrollTo(0,0);}catch(e){}"}
  ]} },
  name:'Duka', em:'📱', sub:'run a phone & electronics shop from your phone', fresh:true, cat:'work', price:'', testing:true,
  tag:'Sales with the M-Pesa paste and a warranty receipt, stock and the reorder list, the evening cash count, deni, repairs, bills, offers by WhatsApp to customers who said yes, and a weekly report that writes itself. Works with no signal. Made for Kenyan shops.',
  try:BASE+'duka/', video:true,
  lines:[
    {"t": "Duka. Your phone and electronics shop, run from your phone.", "js": "try{closeSheet();}catch(e){} try{go('today');window.scrollTo(0,0);}catch(e){}"},
    {"t": "Open it in the morning and you see today at a glance: sales, profit, the cash that should be in the drawer, and M-Pesa.", "js": "try{closeSheet();}catch(e){} try{go('today');window.scrollTo(0,0);}catch(e){}", "point": "#kpiSales"},
    {"t": "Needs you lists what to do: stock running low, a repair ready to collect, a customer who owes you.", "point": "#needs"},
    {"t": "Selling takes seconds. Tap the item, change the price if you agree a different one, pick how they paid.", "js": "try{closeSheet();}catch(e){} try{go('sell');addToCart(D.items.find(function(i){return /Spark/.test(i.name)}).id);addToCart(D.items.find(function(i){return /protector/.test(i.name)}).id);window.scrollTo(0,0);}catch(e){}", "point": "#cart"},
    {"t": "Paste the M-Pesa message and Duka fills the code, and checks the amount matches.", "point": "#payBox"},
    {"t": "The receipt has the warranty date. Send it on WhatsApp with one tap.", "js": "try{closeSheet();}catch(e){} try{go('today');setTimeout(function(){showReceipt(D.sales.slice().sort(function(a,b){return b.at-a.at})[1].id)},300);window.scrollTo(0,0);}catch(e){}", "point": "#rcptText"},
    {"t": "Stock goes down by itself. One tap makes the reorder list for your supplier.", "js": "try{closeSheet();}catch(e){} try{go('stock','low');window.scrollTo(0,0);}catch(e){}", "point": "#reorderBtn"},
    {"t": "Customers who owe you, deni, are in one list, with a polite reminder ready to send.", "js": "try{closeSheet();}catch(e){} try{go('people','deni');window.scrollTo(0,0);}catch(e){}", "point": "#deniList"},
    {"t": "Repairs: mark it ready, and tell the customer in one tap.", "js": "try{closeSheet();}catch(e){} try{go('people','repairs');window.scrollTo(0,0);}catch(e){}", "point": "#repairList"},
    {"t": "Offers: write one message, and send it to the right customers, with their name in it. Only people who said yes get offers.", "js": "try{closeSheet();}catch(e){} try{go('offers');window.scrollTo(0,0);}catch(e){}", "point": "#offerNew"},
    {"t": "Every evening, count the cash. Duka tells you if the drawer is short.", "js": "try{closeSheet();}catch(e){} try{go('money','cash');window.scrollTo(0,0);}catch(e){}", "point": "#countCard"},
    {"t": "Money out, bills and the M-Pesa paste keep every shilling recorded.", "js": "try{closeSheet();}catch(e){} try{go('money','out');window.scrollTo(0,0);}catch(e){}", "point": "#oMsg"},
    {"t": "And the weekly report writes itself. Copy it to WhatsApp. That's Duka.", "js": "try{closeSheet();}catch(e){} try{go('money','report');window.scrollTo(0,0);}catch(e){}", "point": "#repText"}
  ],
  train:[
    {"t": "Step by step: setting up Duka and using it every day.", "js": "try{closeSheet();}catch(e){} try{go('today');window.scrollTo(0,0);}catch(e){}"},
    {"t": "The first time you open Duka, choose: keep the example shop to play, or start fresh with your own. Fresh asks your shop name, your name, your town and your till number."},
    {"t": "Step one: add your stock. Stock, then Add item.", "js": "try{closeSheet();}catch(e){} try{go('stock');window.scrollTo(0,0);}catch(e){}", "point": "#addItemBtn"},
    {"t": "For each item: the name, the category, what you paid, what you sell at, how many you have, when to warn you, and the warranty.", "js": "try{closeSheet();}catch(e){} try{go('stock');setTimeout(function(){itemSheet('')},300);window.scrollTo(0,0);}catch(e){}", "point": "#iName"},
    {"t": "Step two: your bills. Money, Bills, then Add a bill: rent, wages, internet. Next month, one tap copies them.", "js": "try{closeSheet();}catch(e){} try{go('money','bills');window.scrollTo(0,0);}catch(e){}", "point": "#addBillBtn"},
    {"t": "Step three: the first cash count. Money, Cash. Count the drawer, read the M-Pesa balance, and save. From now on Duka knows what should be there.", "js": "try{closeSheet();}catch(e){} try{go('money','cash');window.scrollTo(0,0);}catch(e){}", "point": "#countCard"},
    {"t": "Every sale: Sell. Tap the items.", "js": "try{closeSheet();}catch(e){} try{go('sell');addToCart(D.items.find(function(i){return /Spark/.test(i.name)}).id);window.scrollTo(0,0);}catch(e){}", "point": "#sTop"},
    {"t": "Check the price, add the customer, choose how they paid, and paste the M-Pesa message.", "point": "#payBox"},
    {"t": "Save sale. Send the receipt on WhatsApp, or tap Next sale.", "js": "try{closeSheet();}catch(e){} try{go('today');setTimeout(function(){showReceipt(D.sales.slice().sort(function(a,b){return b.at-a.at})[0].id)},300);window.scrollTo(0,0);}catch(e){}", "point": "#rcptText"},
    {"t": "Deni: choose Deni as the payment. The customer's name and phone are needed.", "js": "try{closeSheet();}catch(e){} try{go('sell');addToCart(D.items.find(function(i){return /protector/.test(i.name)}).id);SELL.pay='Deni';renderPay();window.scrollTo(0,0);}catch(e){}", "point": "#paySeg"},
    {"t": "When they pay, Customers, Owe me, Record payment.", "js": "try{closeSheet();}catch(e){} try{go('people','deni');window.scrollTo(0,0);}catch(e){}", "point": "#deniList"},
    {"t": "A repair comes in: Customers, Repairs, Repair came in.", "js": "try{closeSheet();}catch(e){} try{go('people','repairs');window.scrollTo(0,0);}catch(e){}", "point": "#repairInBtn"},
    {"t": "When it is fixed: Mark ready, then Tell them. When they collect: Collected and paid.", "point": "#repairList"},
    {"t": "Stock arrives: open the item in Stock, tap Restock, type how many and what you paid.", "js": "try{closeSheet();}catch(e){} try{go('stock');setTimeout(function(){itemSheet(D.items[0].id)},300);window.scrollTo(0,0);}catch(e){}", "point": "#iRestock"},
    {"t": "Spending money: Money, Money out. Paste the M-Pesa message, choose what it was for, and save. Keep the receipt.", "js": "try{closeSheet();}catch(e){} try{go('money','out');window.scrollTo(0,0);}catch(e){}", "point": "#oMsg"},
    {"t": "Other money in, like a repair fee paid separately, goes under Money in.", "js": "try{closeSheet();}catch(e){} try{go('money','in');window.scrollTo(0,0);}catch(e){}", "point": "#iSaveBtn"},
    {"t": "Marketing: Offers, New offer. Pick a ready message, choose who gets it, and save.", "js": "try{closeSheet();}catch(e){} try{go('offers');setTimeout(function(){newOffer('stock')},300);window.scrollTo(0,0);}catch(e){}", "point": "#ofText"},
    {"t": "Then send it one person at a time. The tick shows who you already sent it to.", "js": "try{closeSheet();}catch(e){} try{go('offers',D.offers[0].id);window.scrollTo(0,0);}catch(e){}", "point": "#ofPeople"},
    {"t": "Every evening: Money, Cash, count the cash. If it is short, check today's sales and money out.", "js": "try{closeSheet();}catch(e){} try{go('money','cash');window.scrollTo(0,0);}catch(e){}", "point": "#cSaveBtn"},
    {"t": "Every Friday: Money, Report, Copy for WhatsApp.", "js": "try{closeSheet();}catch(e){} try{go('money','report');window.scrollTo(0,0);}catch(e){}", "point": "#repCopy"},
    {"t": "Once a week: Money, Settings, Download backup, and send it to yourself. Everything lives on this phone.", "js": "try{closeSheet();}catch(e){} try{go('money','settings');window.scrollTo(0,0);}catch(e){}", "point": "#bkDown"},
    {"t": "That is the whole routine. Karibu to Duka.", "js": "try{closeSheet();}catch(e){} try{go('today');window.scrollTo(0,0);}catch(e){}"}
  ]
 },
};
