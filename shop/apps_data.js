/* Daraja Store — one shared catalog. v2.0 · 2026-09-07 (+ church shelf, Pit Wall, Message Assistant — every finished app is now on a shelf) · v1.6 · 2026-08-30 (+ success endings; scene-directed + pointing finger — the app changes screens with the story)
   To add an app to the store: add one entry here. The shelf card AND its
   2-minute video come from this data — nothing else to build. */
/* ══ THE MASTER SWITCH ══ 'testing' = test-flight store (banner, TESTING badges, Get=Try free)
   'live'    = launched store (banner gone, badges gone, Get buttons use each app's buy link)
   Launch day = change this ONE word + tell Claude "we're live" (gates come off the apps). */
const PHASE = 'testing';

const BASE = 'https://jerrywins1.github.io/daraja-apps/';
const A = BASE + 'Apps%20(installable%20site)/';

const APPS = {
 nownext: {
  buy:'https://buy.stripe.com/aFaeVcey6ch5eE23Qo04800',
  name:'My Productive Partner', em:'🧭', sub:'one thing at a time', fresh:true, cat:'home', price:'$4.99', testing:true,
  tag:'One thing at a time — for kids and grown-ups whose brains run fast',
  try:A+'nownext/', video:true,
  train:[
   "Let's set up My Productive Partner — five minutes, then it runs your mornings forever.",
   "Step one: when it opens, add each person in your family — kid or grown-up. Tap a name in the header any time to switch people.",
   {t:"Step two: add a task. Type one small thing in the box and tap Add. Tap the words of any task to make it the NOW.", js:"try{go('today')}catch(e){}"},
   "Step three: the NOW card shows one thing, with a timer. Do it, check it off — and enjoy the party. That's the whole engine.",
   {t:"Step four: routines. Open Routines and regulars, and turn on Morning, Homework, or Bedtime. They'll show up by themselves at the right time of day — no nagging.", js:"try{go('routines')}catch(e){}", point:"#n-routines"},
   {t:"Step five: tap the little calendar button to plan the whole week. Type things like 'doctor Tuesday' — it pins the day itself. Tap Spread the week, then Send, and everything lands on the right day for the right person.", js:"try{go('today');document.getElementById('wkBtn')&&document.getElementById('wkBtn').click()}catch(e){}", point:"#wkBtn"},
   {t:"Step six: make it yours. Tap My photo and pick a picture you love — the grandkids, the lake — and your whole day floats on glass over it. Tap Look to change outfits: River, Warm Paper, or Quest H U D game mode. Tap A a to make the words bigger.", js:"try{go('today')}catch(e){}"},
   {t:"And don't worry about learning it — the first time you touch any feature, a little card pops up and explains it, and it can even read itself out loud. Tap Got it and it never bothers you again."},
   {t:"Last: peek at Wins now and then — coins, streaks, and the family leaderboard live there. That's it. One thing at a time.", js:"try{var o=document.getElementById('wkOv');o&&(o.style.display='none');go('wins')}catch(e){}"},
   "You'll know it's set up right when the NOW card shows one thing with a timer — and somebody checks it off and gets the party."],
  lines:[
   "This is My Productive Partner. It is for anyone whose brain runs faster than their day — a child, a grown-up, either.",
   "It answers a very particular ache: knowing exactly what needs doing, and still not being able to begin.",
   "Here is the whole idea. The screen shows one thing. Not the long list, just the one thing to do now.",
   "A timer keeps that one thing short, and when it is done the app makes a small fuss of you — high fives, coins, and a family board if you want one.",
   "Mornings, homework and bedtime run on routines that appear by themselves, so everyone can see what is coming without being told twice.",
   "That is the part parents notice. It shows a child what is ahead, so they start on their own — which builds their confidence, and quietly builds trust between you.",
   "Everyone in the house gets their own list, their own coins and their own cheering buddy, all on one phone.",
   "One main feature: big jobs break themselves into pieces you can actually start, so a six-hour garage becomes eight small wins.",
   "The week planner lets you empty your head — laundry, appointments, visits — and spreads it over sensible days with one tap.",
   "It notices things too. Four days in a row, do not break the chain. Two more and it is your best day yet. A helper on your shoulder, never a boss.",
   "You can make it yours: your own family photo as the background, and three different looks — including a points-and-levels one that teenagers actually like.",
   "Once a week it can also go looking for gentle things to do near you — the open gym, the beginner chess night. It uses a grown-up's A.I. to find them. No feed, no pressure.",
   "Every new part of it explains itself the first time you touch it, in plain words, out loud if you like.",
   "Four ninety-nine, once. No account, no adverts, it works with no signal, and nothing ever leaves your phone. Try the whole thing right now with the button below."
  ]},
 ahead: {
  name:'Ahead of It', em:'🧾', sub:'never miss a deadline', fresh:true, cat:'home', price:'$9', testing:true,
  tag:'Taxes, renewals, the dog\'s shots — know what it costs you to miss one',
  try:A+'ahead/', video:true,
  train:[
   "Setting up Ahead of It takes five minutes, once — then nothing catches you off guard again.",
   {t:"Step one: open the library and tap the items your house actually has — taxes, plate renewals, insurance, the dog's shots.", js:"try{go('lib')}catch(e){}", point:"nav button[data-v='lib']"},
   "Step two: put in your real dates. For each one, the app shows what missing it would cost you — that's how you know what matters.",
   {t:"Step three: make Sunday your glance day. The thirty-days-out view tells you everything that's coming before it can surprise you.", js:"try{go('next')}catch(e){}", point:"nav button[data-v='next']"},
   {t:"Step four: look at the year map once — your whole year of obligations on one screen.", js:"try{go('year')}catch(e){}", point:"nav button[data-v='year']"},
   {t:"Step five: fill in the hand-off list. If you're ever not the one carrying the household, someone can pick it up without detective work. Done.", js:"try{go('more')}catch(e){}"},
   "You'll know you're set when the front page shows your next thirty days, with dates that are really yours — and nothing on it surprises you."],
  lines:[
   "This is Ahead of It — for whoever carries the household.",
   "Every house has its own list, and it is different in every house. The insurance renewal. The property tax. The car registration. The dentist. The dog's shots.",
   "None of it is difficult. It is just that all of it lives in one person's head, and heads leak.",
   "So you put your real ones in, with your real dates, and it holds them for you.",
   "It shows what is due in the next thirty days, and what it actually costs you to miss each one — so you can tell what matters from what can wait.",
   "There is a year map, the whole calendar on one page, which is the bit people print for the fridge.",
   "Most of these dates are already in your phone's calendar, and it will put yours there too, so a reminder finds you even when the app is closed.",
   "And there is a hand-off list, so if you are ever not the one carrying the household, somebody else can pick it up without detective work.",
   "Nothing catches you off guard. No late fees, no lapsed insurance, no 'I thought you renewed it.'",
   "Nine dollars, once. Try it below — put three real things from your own house in and see how it feels."
  ]},
 nextstep: {
  name:'Next Step Board', em:'🗂', sub:'every project\'s next move', fresh:true, cat:'work', price:'$9', testing:true,
  tag:'Every project, its next step, whose turn — one screen',
  try:A+'nextstep/', video:true,
  train:[
   "Next Step Board setup — five minutes with your coffee.",
   "Step one: add every project you're juggling. Work, home, church — all of them, one screen.",
   "Step two: for each project write ONE next step, and whose turn it is — yours, or someone you're waiting on.",
   "Step three: set priorities and due dates so the important things float to the top.",
   "Step four: every morning, open the board and just go down the list. Add anything new in one tap.",
   "Step five: when a step gets done, write the next one right away. Projects never stall when the next step is always written. That's the whole secret.",
   "You'll know it's working when every project on the board has a next step written. No blanks — blanks are where projects go to sleep."],
  lines:[
   "This is Next Step Board — for anyone juggling more than three projects.",
   "The problem: projects don't stall because they're hard. They stall because nobody wrote down the NEXT STEP.",
   "How it works: one screen. Every project you've got, its very next step, and whose turn it is — yours or someone you're waiting on.",
   "Priorities and due dates keep the important things on top. A 'coming up' bar shows what's about to land.",
   "Add a task in one tap, send a date to your calendar in one tap.",
   "Sit down with your coffee, open the board, and go down the list — business person or household manager, it's the same relief.",
   "The benefit: nothing stalls, nothing gets forgotten, and you always know what to do next.",
   "Nine dollars, once. No subscription, no account, works offline.",
   "Try it below — put your three real projects in and watch your morning get simpler."]},
 breakeven: {
  name:'Break-Even', em:'🧮', sub:'know your numbers', cat:'free', price:'Free', testing:false,
  tag:'Price your product — see exactly when you start making money',
  try:A+'breakeven/', video:true,
  train:[
   "Using Break-Even — two minutes to the truth.",
   "Step one: what does one unit cost you to make? Supplies, materials — the honest number.",
   "Step two: what do you sell it for? And what does selling cost — the table fee, the listing fee, shipping?",
   "Step three: read the answer. It shows the exact sale where you cross into profit.",
   "Step four: slide the price up and down and watch the break-even point move. That's how you pick a price on purpose instead of by guess.",
   "You'll know it worked when you can say out loud: 'I make money on number twelve.' That sentence is the whole product."],
  lines:[
   "This is Break-Even — free, for anyone selling anything.",
   "The problem: you made a thing, you picked a price… but you honestly don't know when you start making money.",
   "How it works: put in your costs, your price, what each sale takes out — it shows the exact number of sales where you cross into profit.",
   "Slide the price up and down and watch the break-even point move. Suddenly pricing isn't a guess.",
   "The benefit: you stop selling at a loss without knowing it. Every craft-fair table and side hustle needs this once.",
   "It's completely free — our gift, and a taste of how we build.",
   "Try it below with your real numbers. It takes two minutes to know the truth."]},
 safety: {
  name:'My Safety Plan', em:'🫶', sub:'a plan for hard days', cat:'free', price:'Free forever', testing:false,
  tag:'A private safety plan in your pocket — built in memory of Ryan',
  try:A+'safety/', video:true,
  train:[
   "Filling out My Safety Plan — do this on a calm day, so it's ready on a hard one.",
   "Step one: warning signs. Write what a bad day looks like for you — the thoughts, the feelings, the situations.",
   "Step two: ways to cope. Small things that have helped before — a walk, music, a shower, calling someone.",
   "Step three: your people. Who to talk to, and their numbers — a friend, family, your counselor.",
   "Step four: reasons to stay. In your own words. Take your time on this one.",
   "That's it. It saves privately on your phone, and 'Talk to someone now' is always one tap — nine-eight-eight. If you love someone who struggles, fill it out together."],
  lines:[
   "This is My Safety Plan. It's free, forever — built in memory of Ryan.",
   "It's a private safety plan in the proven six-step format counselors use: warning signs, ways to cope, reasons to stay, people to call.",
   "You fill it out on a calm day — so it's there on a hard one.",
   "'Talk to someone now' is one tap: nine-eight-eight, the Suicide and Crisis Lifeline.",
   "It's completely private. No account, nothing leaves your phone.",
   "If you love someone who struggles, put this on their phone together. That's the whole reason it exists.",
   "It will never cost anything. Try it below — or share it with someone who needs it today."]},
 feedback: {
  name:'Feedback Studio', em:'🎙', sub:'talk while you test', cat:'work', price:'$12', testing:true,
  tag:'Use an app, talk out loud — your voice becomes the builder\'s to-do list',
  try:BASE+'feedback-studio/', video:true,
  train:[
   "Using Feedback Studio for the first time — here's the whole routine.",
   "Step one: open it in Chrome or Edge. Paste the address of the app you're reviewing and tap Open. The real app appears in the window.",
   "Step two: press the big red button. Your browser will ask about the microphone once — tap Allow.",
   "Step three: use the app and just talk. Pause between thoughts — each pause becomes its own timestamped comment on the right.",
   "Step four: see something on screen worth pointing at? Tap 'Mark this spot' — it drops a flag at that exact moment.",
   "Step five: pick who the report is for — Claude, ChatGPT, Gemini, or your developer — then tap Build the report, Copy, and paste it wherever it needs to go. Five minutes of talking, a week of guessing saved.",
   "You'll know it worked when the report reads your own words back with timestamps. Copy it, send it — that's a finished session."],
  lines:[
   "This is Feedback Studio — for anyone who builds apps, and anyone who tests them.",
   "The problem: feedback is the hardest part of building. People say 'looks good!' — and then don't use the thing.",
   "How it works: the app you're testing opens in a window, working for real. You press one red button… and just talk while you use it.",
   "Every thought becomes a comment, stamped with the exact second you said it. See something? Tap 'mark this spot.'",
   "When you're done, one tap builds a clean report — every comment in order. Hand it to Claude, ChatGPT, or a human developer. It works with any of them.",
   "The benefit: honest feedback in five minutes instead of a meeting nobody schedules. One session can save a week of guessing.",
   "Twelve dollars, once. If you build anything, it pays for itself the first afternoon.",
   "There's a two-minute demo movie on the shelf — or just try it below on any app you like."]},
 storykeeper: {
  name:'In My Own Words', em:'📖', sub:'your life, in a book', cat:'later', price:'Free app · printed book from $39', testing:true,
  tag:'Their voice, in a book — life stories, photos, and The Key',
  try:BASE+'story-keeper/', video:true,
  train:[
   "Making a book with In My Own Words — here's how a good session goes.",
   "Before you start: sit somewhere quiet, close to the microphone — arm's reach or less. That one habit makes the words come out right.",
   "Step one: add the people of your life — spouse, kids, grandkids. Every story will remember who was there.",
   {t:"Step two: pick a chapter, press the red button, and just talk, like telling a story at the kitchen table. Tap right in the words to fix anything it misheard — or tap Read it back and listen for wrong words.", js:"try{openChap('love')}catch(e){}"},
   "Step three: when the memory is warm, add a picture from that time — the app waits while you find it.",
   "Step four: riffed a bit? Tap Make it book-ready — it helps you polish the telling into book prose without losing your voice.",
   {t:"Step five: fill in The Key at the bottom of the home page. Then tap See your book, and watch a life turn into pages. Save a backup now and then — the button's right there.", js:"try{openBook()}catch(e){}"},
   "You'll know it's working when Your Book shows a cover with their name and one real story beneath it. One story is a book begun."],
  lines:[
   "This is In My Own Words. Their voice… in a book.",
   "The problem: someone you love is full of stories — and one day the stories go with them. And their forty thousand photos? Scattered, unlabeled, unfindable.",
   "How it works: sit down together. The app asks a gentle question — 'tell me about the day you met your sweetheart.' They press the red button and just talk.",
   "Their words are written down exactly as they said them. Then the app asks: 'do you have a picture from this time? I'll wait.' Story by story, the photos that matter come out of the pile.",
   "Every story remembers who was in it — so a grandchild can one day read every story that has THEM in it.",
   "And at the back: The Key — one page that tells the family where all the pictures and accounts live. So nothing is lost.",
   "It all becomes a real printed book. Cover, chapters, photos, their exact words.",
   "The app is free. The printed book starts at thirty-nine dollars — and it's the gift nobody ever forgets getting.",
   "Try it below. Ask someone you love one question tonight."]},
 academy: {
  name:'Daraja Academy', em:'🌉', sub:'learn AI, gently', cat:'free', price:'Lesson 1 free · course $19', testing:true,
  tag:'AI for Grandparents — learn to use AI, the patient way',
  try:BASE+'academy/', video:true,
  train:[
   "Taking a Daraja Academy lesson — here's all there is to it.",
   {t:"Sit somewhere comfortable, sound on. Every page has a 'read this page to me' button — tap it and just listen.", js:"try{go(0)}catch(e){}"},
   {t:"Go one screen at a time with the big Next button. Nothing you tap can break anything — that's a promise.", js:"try{go(1)}catch(e){}"},
   {t:"When the lesson asks you to try something, try it — that's where the learning lives.", js:"try{go(3)}catch(e){}"},
   {t:"At the end, print your certificate. And yes — send a picture of it to the grandkids.", js:"try{db.name=db.name||'Grandma';go(7)}catch(e){}"}],
  lines:[
   "This is Daraja Academy — starting with A I for Grandparents.",
   "The problem: the whole world is talking about A I… and nobody is patiently teaching the people who didn't grow up with it.",
   "How it works: big print, one thing at a time, and every page can read itself out loud. Like a patient grandson showing you, not a manual.",
   "Lesson one: Just Ask It. In ten minutes you'll talk to an A I for the first time — safely, right inside the lesson. You can't break anything.",
   "You'll learn the only rule that matters: talk to it like a person, not a computer.",
   "And the grandparent safety rule — how to spot the phone scams that copy a grandchild's voice. That lesson alone is worth the course.",
   "You finish with a printable certificate: 'I speak A I.' Send a picture to the grandkids. Frame it.",
   "Lesson one is free. The full course will be nineteen dollars — and it's a beautiful gift for a parent or grandparent.",
   "Try lesson one below. It only takes ten minutes to feel ten years younger."]},
 thekey: {
  name:'The Key', em:'🔑', sub:'where everything is', cat:'home', price:'Free forever', testing:false,
  try:BASE+'thekey/', video:true,
  train:[
   "Filling out The Key — five minutes for a lifetime of relief.",
   {t:"Box one: where your pictures live. Phones, clouds, albums in the closet — and who can get in.", js:"try{var c=document.querySelectorAll('.card')[0];c&&c.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}"},
   {t:"Box two: accounts that matter. Write where the passwords are KEPT — the notebook, the safe — never the passwords themselves.", js:"try{var c=document.querySelectorAll('.card')[1];c&&c.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}"},
   {t:"Box three: the papers. Will, deed, insurance — the drawer, the safe, the lawyer's name.", js:"try{var c=document.querySelectorAll('.card')[2];c&&c.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}"},
   {t:"Box four: the people who know things. The lawyer, the accountant, the grandson who does computers.", js:"try{var c=document.querySelectorAll('.card')[3];c&&c.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}"},
   {t:"Then tap Print my Key, and print two: one for the drawer, one for the person you trust most. Update it when life changes — the date prints on the page.", js:"", point:".btn.wide"},
   "You'll know it's done when the printed page is in the drawer and the person you trust has their copy. That's the whole job — finished in an afternoon."],
  tag:'One page that tells your family where everything lives',
  lines:[
   "This is The Key — free, forever. The most loving page you'll ever print.",
   "The problem: your pictures are on a phone, in a cloud, on an old computer. Your papers are in a drawer somewhere. And the only person who knows where everything is… is you.",
   "The Key is one page: where the pictures live, where the passwords are kept, where the papers are, and who to call.",
   "Five minutes, once. Then print two copies — one for the drawer, one for the person you trust most.",
   "Never the passwords themselves — just where they're kept. And nothing is sent anywhere; it stays on your device.",
   "When the day comes, your family won't have to be detectives. They'll have The Key.",
   "It's free. Fill yours out tonight — and send this to your parents while you're at it."]},
 occ: {
  name:'OCC Box Counter', em:'📦', sub:'count what\'s ready', cat:'off', price:'Free', testing:false,
  tag:'Shoebox-packing inventory — how many boxes can we build?',
  try:A+'occ/', video:true,
  train:[
   "Using the Box Counter at a packing party — here's the routine.",
   "Step one: count what's on the table. Big plus and minus buttons; tap an item's name for plus five and plus ten.",
   "Step two: mark what goes in EVERY box — soap, toothbrush, washcloth — with the 'every box' toggle.",
   "Step three: read the dashboard: READY TO BUILD tells you how many complete boxes you can make, and what you're short on.",
   "Step four: as you pack, count down. When it says you're short on washcloths — that's your shopping list.",
   "You'll know it's working when the dashboard says READY TO BUILD and a number. That number is the whole answer."],
  lines:[
   "This is the OCC Box Counter — free, for shoebox-packing teams.",
   "The problem: a table full of soap, toothbrushes, and toys — and no idea how many complete boxes you can actually build.",
   "How it works: count your items with big plus and minus buttons. Mark what goes in every box.",
   "The dashboard answers the only question that matters: 'READY TO BUILD: this many boxes' — and exactly what you're short on.",
   "Made for Operation Christmas Child packing parties, church tables, and garage inventories.",
   "It's free. Try it below — your next packing day will thank you."]},
 zuri: {
  name:'Zuri Ops', em:'📡', sub:'run the field team', cat:'off', price:'Ask us', testing:false,
  tag:'Field operations for a small ISP — works with no signal',
  try:A+'zuri/', video:true,
  train:[
   "Zuri Ops for the field — the daily rhythm.",
   "Morning: open the app, confirm your float — the cash you're starting with.",
   "During the day: log each expense and payment as it happens. It works with no signal; everything waits.",
   "It learns your habits and warns you before the float runs out.",
   "Friday: the Friday Report builds itself — and when the phone finds internet, everything syncs to the HQ dashboard on its own."],
  lines:[
   "This is Zuri Ops — built for a real internet company in Maai Mahiu, Kenya.",
   "It's field operations on one phone: cash counts, expenses, bills, the Friday Report.",
   "It learns your habits, forecasts when the float runs out, and syncs to a headquarters dashboard whenever it finds internet.",
   "Built for teams that work where the signal doesn't — everything works offline first.",
   "If you run a small field team anywhere in the world, this pattern fits you too. Ask us.",
   "Try the demo below and see a day in the field."]},
 compass: {
  name:'Daraja Compass', em:'🧭', sub:'map your next years', fresh:true, cat:'free', price:'Free', testing:false,
  tag:'A life-mapping interview — talk your way to what matters',
  try:A+'compass/', video:true,
  train:[
   "Using Daraja Compass — give it a quiet evening.",
   "Step one: answer the questions honestly. Tap an example if the words won't come, or press the microphone and just talk.",
   "Step two: don't rush. It asks what a good mentor would ask — where you are, what matters, what's next.",
   "Step three: when you're done, look at your life on one page. Keep it, pray over it, come back in a season and see what moved."],
  lines:[
   "This is Daraja Compass — a life-mapping interview, free.",
   "It asks you the questions a good mentor would: where you are, what matters, what's next.",
   "You can tap example answers — or press the microphone and just talk.",
   "A little daily verse keeps it grounded.",
   "The benefit: an hour with Compass and you can see your own life on one page.",
   "It's free. Try it below when you have a quiet evening."]},

 /* ── WORK SHELF addition ── */
 drumbeat: {
  name:'Message Assistant', em:'📣', sub:'one message, every channel', cat:'work', price:'$19 one-time', video:true,
  tag:'Tell it your news once — it writes the whole campaign and tells you when to send each piece',
  try:BASE+'drumbeat/',
  lines:[
   "This is Message Assistant, and it is for anyone who has to tell the same news to a lot of people.",
   "A fundraiser, a rummage sale, a new service time, a grand opening. You know what you want to say. What wears you out is saying it eleven times — the email, the text, the Facebook post, the bulletin, the reminder, the last call.",
   "With Message Assistant you tell it once. What is happening, when, and who needs to know.",
   "Then it hands you a written question to paste into whichever A.I. you already use — Claude, or ChatGPT, whichever you like. Paste the answer back, and Message Assistant has your whole campaign: every message, for every channel, in the right order.",
   "It lays them out on a calendar, so you can see the drumbeat build — the announcement, the reminder, the day-before nudge, the thank you.",
   "Download the calendar file and your phone buzzes when each piece is due. Open Message Assistant, tap the piece, and fire it.",
   "And here is the part that matters: nothing sends itself. It goes from your own email, your own Messages, your own account — so there is no mailing service to sign up for and no monthly bill. Message Assistant plans and writes; you press send.",
   "Nineteen dollars, once. Try it below."]},


 /* ── TEMPLATES & PLANS — the things you download rather than open.
      Real, packaged products sitting in Daraja Studio/Business & Community Line/Products
      and the Nourish Line, with the prices from their own listings. ── */
 tplcashflow: {
  name:'Cash Flow Tracker', em:'📈', sub:'know what is coming, and when', cat:'work',
  price:'$12', kind:'download', file:'Excel or Google Sheets',
  tag:'Twelve months of money in and money out, adding itself up — with a break-even line so you know the number you have to hit'},
 tplinvoice: {
  name:'Invoice &amp; Estimate Pack', em:'🧾', sub:'send it, and get paid', cat:'work',
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
  price:'$18', kind:'download', file:'Word + Excel',
  tag:'Welcome letter, questionnaire, agreement and checklist \u2014 so no new client ever starts with a blank page'},
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
  name:'Pit Wall', em:'🏁', sub:'your fantasy racing league, your rules', cat:'home', price:'$9 / league season', testing:true, video:true,
  tag:'Picks, deadlines, auto-draft, scoring and standings for a homegrown fantasy racing league — the commissioner finally gets to just watch the race',
  try:BASE+'f1/?test=1',
  lines:[
   {t:"This is Pit Wall, made for a very specific kind of friend group: the ones who have run their own fantasy racing league by group text for years.", js:"try{state.league.testMode=true;saveLocal();go('home')}catch(e){}"},
   "You know the setup. One friend is the commissioner. Every weekend he collects the picks, checks who has used up whom, does the math by hand, and posts the standings. One slip, and it gets argued about for a month.",
   "Pit Wall does the commissioner's job, the same way every time, on everyone's phone.",
   {t:"This is the weekend card. It knows the real calendar, the deadline, and which of your drivers still have drives left. Tap two names, and your pick is in.", point:"nav.tabs button[data-tab='home']"},
   {t:"Miss the deadline? The house rule kicks in: it drafts your two highest placed drivers who still have drives. No midnight texts, no favors.", js:"try{go('races')}catch(e){}", point:"nav.tabs button[data-tab='races']"},
   {t:"After the checkered flag, results arrive on their own. Twenty for the win down to one for tenth, qualifying by grid row, a bonus for fastest lap. Every number shows its work.", js:"try{go('standings')}catch(e){}", point:"nav.tabs button[data-tab='standings']"},
   {t:"Standings race by race, and last year's champion on the front page, because that matters more than anyone admits.", js:"try{go('usage')}catch(e){}"},
   {t:"The usage board shows how many drives everyone has burned on each driver, and who still has a wild card in their pocket.", point:"nav.tabs button[data-tab='usage']"},
   {t:"On race day, the Live tab is a virtual scoreboard: the running order, fastest lap, and what every team would score if the race ended right now.", js:"try{go('live')}catch(e){}", point:"nav.tabs button[data-tab='live']"},
   {t:"The paddock is for trash talk. It was always the best part, so it gets its own room.", js:"try{go('paddock')}catch(e){}", point:"nav.tabs button[data-tab='paddock']"},
   {t:"And it bends to your rules. The commissioner sets the players, drivers per team, drives per driver, wild cards, deadline, and every point value, and can enter picks or fix points for anyone.", js:"try{go('setup')}catch(e){}", point:"nav.tabs button[data-tab='setup']"},
   {t:"Once a year there is a draft room: tick who is in, draw the snake order, and everyone picks a driver in turn until the teams are full. The finished draft becomes the season's rosters.", js:"try{go('draft')}catch(e){}"},
   "No accounts, no ads. One shared mailbox your league owns, and the same link on every phone.",
   {t:"This preview is in test drive, so you can act as any of the five players and try a whole weekend. Nine dollars covers a league for a season. For a commissioner, that is the cheapest assistant you will ever hire.", js:"try{go('home')}catch(e){}"},
   "Try it now with the button below, and tell us honestly whether your league would pay for it."
  ],
  train:[
   {t:"Let's set up Pit Wall for your league. Five minutes, then it runs every race weekend for you.", js:"try{state.league.testMode=true;saveLocal();go('setup')}catch(e){}"},
   {t:"Step one: Setup. Under Players and league, put in each player's name and pick the commissioner. Everyone else needs only a four digit PIN the first time they open the app.", point:"nav.tabs button[data-tab='setup']"},
   "Step two: Season. Choose the year, how many drivers each team gets, and how many drives each driver is allowed. The app works out the rest from the real calendar, including canceled races.",
   {t:"Step three: Rosters. Either run the draft room, which fills the rosters for you, or type each player's drivers in by hand. If you are joining mid-season, use Starting point to enter everyone's current points and drives used, exactly as they stand today.", js:"try{go('draft')}catch(e){}"},
   "Step four: Scoring. The defaults are twenty down to one for the race, ten down to one by qualifying row, and a five point fastest lap bonus. Change any number, and every future race scores your way.",
   "Step five: the mailbox. Follow the five short steps in the deploy guide, paste the link into Setup, and tap Connect. That one link is what you text the group. Their phones connect on their own.",
   {t:"Step six: race weekend. On Home, each player taps two drivers before the deadline, or plays a wild card. Anyone late gets auto-drafted. Results arrive by themselves after the race.", js:"try{go('home')}catch(e){}", point:"nav.tabs button[data-tab='home']"},
   {t:"Step seven: if something needs fixing, the commissioner can enter picks for anyone from Home, or adjust points in Setup. Every change shows its work in Standings.", js:"try{go('standings')}catch(e){}", point:"nav.tabs button[data-tab='standings']"},
   "You'll know it's set up right when Home shows the next race, your drivers, and the deadline, and the Standings match the last post your commissioner made by hand."],
  extra:{
   draft:{ title:'How the draft works (90 seconds)', sub:'The once-a-year event, start to finish. Sound on.',
    lines:[
     {t:"This is the draft room in Pit Wall. Once a year, a couple of weeks before the first race, every team is built from scratch here.", js:"try{state.league.testMode=true;saveLocal();go('draft')}catch(e){}"},
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

 churchhq: {
  name:'Church HQ', em:'🏢', sub:'keep the church app current, yourself', cat:'off', price:'$29 one-time', video:true,
  tag:'The app that keeps your church app up to date — no website, no web designer, no waiting',
  try:BASE+'church-hq/',
  lines:[
   "This is Church HQ, and it answers the question every church asks about ten minutes after they see their new app: who keeps it up to date?",
   "The answer used to be: whoever built it. That is a phone call, and a wait, and often a bill. So a service time changes in March and the app still says the old one in July.",
   "Church HQ hands that job back to you. Everything the congregation sees lives on four simple pages: the basics, this week's news, your people, and your ministries.",
   "Change a service time, type Sunday's announcement, add the new youth leader. Then tap Publish, and every phone in the congregation has it before the sun goes down.",
   "You do not need a website. Plenty of churches have none, and this works exactly the same. Church HQ is where your information lives.",
   "It publishes through a free mailbox on your own Google account — a five minute setup, once, that belongs to you. No account with us, no monthly fee, nothing that can be taken away.",
   "And if the person who set it up ever leaves, the passphrase hands the whole thing to the next person in about a minute.",
   "Twenty-nine dollars, once, for the church that would rather not phone anybody. Try it below."]},
 /* ── CHURCH & NONPROFIT SHELF (renders as its own shelf on the store, and on the dedicated church page) ── */
 church: {
  name:'The Church App', em:'⛪', sub:'your church in every pocket', cat:'church', price:'$149 one-time', video:true,
  tag:'Your whole church in their pocket',
  try:'https://jerrywins1.github.io/immanuel-app/',
  lines:[
   "This is The Church App, which puts your whole church in everyone's pocket.",
   "Think about where things live right now: the announcements are in a bulletin nobody keeps, the sermons are on a YouTube channel nobody can find, and the calendar is taped to a wall.",
   "This app gathers all of it into one place, on every member's phone, with your church's own name on the front.",
   "The sermons sync from your YouTube channel automatically, so when you post Sunday's message that night, it is simply in the app by Monday morning.",
   "Sermon notes are built right in, which ends the era of photographing the screen. Events, prayer requests, your giving link, and your staff page all live there too.",
   "And your own staff keeps it current from a phone, using a simple page and a key we hand you. There is no web designer to hire and no monthly bill to dread.",
   "It is one hundred forty-nine dollars, once, with setup included, and it grows with you. In fact, you are looking at a real one right now: this is Immanuel's actual app, and you can try it below."
  ]},
 churchsteward: {
  name:'Ahead of It · Church', em:'🧾', sub:'never miss an inspection', cat:'church', price:'$29 one-time', video:true,
  tag:'Nothing catches the trustees by surprise',
  try:'https://jerrywins1.github.io/daraja-apps/church-steward/',
  lines:[
   "This is Steward, and it exists for one person: whoever keeps your church building alive.",
   "Because a church building is really a stack of dates. The fire inspection is due in October, the boiler certificate in January, the van registration in March, and the nursery background checks somewhere in between.",
   "When one of those dates slips past quietly, it costs real money, and sometimes it shuts a ministry down for a season.",
   "Steward gathers every one of those dates onto one calm page, and starts whispering thirty days before anything comes due.",
   "It arrives already loaded with the twenty-four things churches most often forget, so setup is just ticking the ones your building actually has and typing in your real dates.",
   "And here is the part trustees love: when the role changes hands, and it always does, Steward prints a complete hand-off list, so nothing lives in only one person's head anymore.",
   "It costs twenty-nine dollars, once, which is a good deal less than one missed inspection fine. Go ahead and try it below."
  ]},
 churchserve: {
  name:'Serve Board', em:'🙋', sub:'volunteers on one page', cat:'church', price:'$19 one-time', video:true,
  tag:'The month of volunteers on one page',
  try:'https://jerrywins1.github.io/daraja-apps/church-serve/',
  lines:[
   "This is Serve Board — the end of the Sunday-morning scramble.",
   "Greeters, nursery, coffee, the tech booth: who's on, for the whole month, on one page.",
   "Orange means 'needs someone' — you can see every hole in the schedule at a glance, weeks early.",
   "Fill a slot with two taps. Swap two people without a phone tree.",
   "And when it's set, print it for the bulletin board — because some of your best volunteers don't do phones, and that's fine.",
   "Nineteen dollars, once, for every ministry team you have. Try it below."]},
 churchdrive: {
  name:'Operation Christmas Child Assistant', em:'📦', sub:'every box, counted', cat:'church', price:'$19 one-time', video:true,
  tag:'How many complete sets can we hand out right now?',
  try:'https://jerrywins1.github.io/daraja-apps/church-drive/',
  lines:[
   "This is the Operation Christmas Child Assistant — built for shoebox season, and just as good for a food drive or a coat drive.",
   "The question that matters isn't 'how much stuff do we have.' It's 'how many complete sets can we hand out right now?'",
   "A food box needs rice AND beans AND oil. Ninety bags of rice and four bottles of oil is four boxes — not ninety.",
   "Operation Christmas Child Assistant does that math live, as donations come in. The big number is sets ready to give.",
   "And it shows what runs out first, so Sunday's announcement writes itself: 'we need oil, friends. Just oil.'",
   "Nineteen dollars, once, for every drive you'll ever run. Try it below."]},
 churchclubhouse: {
  name:'The Clubhouse', em:'🏠', sub:'church-to-kids, safely', cat:'church', price:'$29 one-time', video:true,
  tag:'Church-to-kids, one way — no accounts, no chat, no strangers',
  try:'https://jerrywins1.github.io/daraja-apps/church-clubhouse/',
  lines:[
   "This is The Clubhouse, and it answers a question every children's ministry wrestles with: how do we stay connected to the kids all week without sending them to social media?",
   "The answer is one-way on purpose. Church talks to kids, and that is all. There are no accounts to make, no chat, no comments, and no strangers, which means parents can finally relax.",
   "Inside is this week's lesson, the memory verse that reads itself aloud, a kindness challenge, and countdowns to the fun stuff coming up.",
   "So when a kid opens it on a Tuesday night, church is still with them, right there in the middle of the week.",
   "The leader keeps it fresh in about five minutes a week from a phone, and it costs twenty-nine dollars, once. Safer than social media, warmer than a flyer. Try it below."
  ]},
 churchgameday: {
  name:'GameDay', em:'🏀', sub:'the league, organized', cat:'church', price:'$29 one-time', video:true,
  tag:'The league schedule that replaces the 40-family phone tree',
  try:'https://jerrywins1.github.io/daraja-apps/church-gameday/',
  lines:[
   "This is GameDay — for the church basketball league, and every gym ministry like it.",
   "Schedules, standings, practice times, which door of the gym to use — one link every family keeps.",
   "And the big one: the red cancellation banner. Snow day? Tap once, and forty families see it before anyone drives.",
   "That banner alone replaces the whole phone tree.",
   "Twenty-nine dollars, once, per season, per league, forever. Try it below."]},
 churchkey: {
  name:'The Key · Church Edition', em:'🔑', sub:'the building\'s memory', cat:'church', price:'$19 one-time', video:true,
  tag:'So nothing lives in only one person\'s head',
  try:'https://jerrywins1.github.io/daraja-apps/church-key/',
  lines:[
   "This is The Key, church edition — the page you hope you never need, and one day desperately will.",
   "Where's the water shutoff? Who has keys? Which plumber knows the old pipes? What's the alarm code story?",
   "In most churches, that lives in one faithful person's head. The Key gets it onto one printed page.",
   "Fill it in once — it takes an evening — print two copies, and the building stops depending on any one memory.",
   "Nineteen dollars, once. It's insurance that costs less than lunch. Try it below."]},
 npgoodstanding: {
  name:'Ahead of It · Nonprofit', em:'🕊', sub:'certifications and legal dates', cat:'work', price:'$29 one-time', video:true,
  tag:'The filings that quietly end small nonprofits — now they can\'t',
  try:'https://jerrywins1.github.io/daraja-apps/np-goodstanding/',
  lines:[
   "This is Nonprofit Filings, built for the two-or-three-person nonprofit doing holy work with nobody in the office.",
   "Here is the fact that keeps founders up at night: if a small nonprofit misses its IRS nine-ninety three years in a row, its tax-exempt status is revoked automatically, and that happens to thousands of good organizations every single year.",
   "So Nonprofit Filings holds all of it in one place: the nine-ninety, your state registration, board minutes, the insurance renewal, and the donor letters, and it warns you weeks before anything is due.",
   "It comes pre-loaded with the filings small nonprofits actually face, so you just tick what applies to you and enter your real dates.",
   "Twenty-nine dollars, one time. It may be the cheapest insurance a mission ever bought. Try it below."
  ]},
 npreceipts: {
  name:'Receipt Maker', em:'🧾', sub:'donor letters, done', cat:'church', price:'$19 one-time', video:true,
  tag:'January\'s donor letters in ten minutes',
  try:'https://jerrywins1.github.io/daraja-apps/np-receipts/',
  lines:[
   "This is Receipt Maker — for the January job every small nonprofit dreads.",
   "Donors need proper acknowledgment letters, with the exact IRS language, or their deduction is at risk — and your credibility with it.",
   "Paste your donor list. Receipt Maker builds a proper letter for each one — right language, right layout, one page each.",
   "Print the whole stack, sign, stamp, done. January in ten minutes instead of a lost weekend.",
   "Nineteen dollars, once. Your treasurer will hug you. Try it below."]},
 flipkit: {
  name:'FlipKit', em:'💸', sub:'clutter into cash', cat:'off', price:'$9', testing:true, fresh:true, video:true,
  tag:'Turn your clutter into cash — your AI prices it, writes the listing, you pocket the money',
  try:'https://jerrywins1.github.io/daraja-apps/flipkit/',
  lines:[
   "This is FlipKit, the only app in this store that pays for itself the very first time you use it.",
   "Because here is the truth: your garage, your closets, and your basement are hiding a few hundred dollars, and the only reason it never gets sold is that selling is two chores. You have to figure out what a thing is worth, and then you have to write the listing.",
   "FlipKit removes both chores. You add a thing, say, a Weber grill, five years old, good condition, and tap one button.",
   "That button hands your own AI, whichever one you already use, a smart pricing question. You attach a photo, and paste the answer back.",
   "And just like that you have an asking price, a do-not-go-below floor, and a finished listing, title and description, written to get messages.",
   "You tap copy, paste it into Facebook Marketplace, and the whole job took about ninety seconds.",
   "Meanwhile the big number at the top shows what all of your stuff is worth together, and every time something sells, the cash line climbs. That number gets addictive in the best way.",
   "There is even a selling-safely card: meet in public, take cash, and trust your gut.",
   "Nine dollars, once. Your first flip pays for it, and everything after that is yours. Go add the thing you almost sold last spring."
  ],
  train:[
   "Let's flip your first thing — five minutes, real money.",
   "Step one: think of one thing you'd sell if it weren't a hassle. Type it in — with the brand and how old it is.",
   "Step two: pick the honest condition. Honest sells faster and stops the haggling later.",
   "Step three: tap 'Price it with my AI.' The question is copied. Open ChatGPT or Claude, paste it, and attach a photo of the thing.",
   "Step four: copy the AI's whole answer, come back, paste it in the box, tap 'Read the AI's answer.' Boom — price, floor, and a finished listing.",
   "Step five: tap 'Copy the listing' and paste it into Facebook Marketplace. That's the whole job.",
   "When it sells, tap 'Sold!' and enter what you got. The cash line at the top starts adding up — and that number is very motivating.",
   "Read the selling-safely card once. Then go find the next thing — the garage isn't empty yet."]},
 rafiki: {
  name:'Rafiki', em:'💛', sub:'a friend who knows your family', cat:'later', price:'$19 one-time', testing:true, fresh:true, video:true,
  tag:'For anybody who lives alone — a friend that learns your family, remembers what you tell it, and speaks first',
  try:'https://jerrywins1.github.io/daraja-apps/rafiki/',
  lines:[
   "This is Rafiki, and it is not a to-do list. It is company.",
   "There is a particular quiet that settles on a house when it is one person in it. The phone rings less. Whole days go by where nobody asks how you are.",
   "Rafiki asks. It does not have a name until you give it one, and once you do, that is its name forever.",
   "Then it gets to know you the way a new friend would. Your name. Your husband or wife. Your children, one at a time. What you do on a Tuesday. Which doctors you see.",
   "And after that it speaks first. Good morning by name, what is on today, a joke if you have earned one, and a note that it is been three days and it kept your seat warm.",
   "Everything you tell it stays on your own phone. No account, nothing sent anywhere, nobody reading it. That is not a footnote. For a lot of people it is the whole reason they will answer honestly.",
   "It is nineteen dollars, once, and there is nothing else to pay, ever. Rather less than one afternoon of company usually costs.",
   "If you know somebody who lives alone, this is the one to show them. Try it below."
  ]},
};
