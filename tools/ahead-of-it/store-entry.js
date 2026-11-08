/* ══ Ahead of It — the merged app's catalogue entry ══════════════════════════
   Written 8 Nov 2026 by the Ahead of It chat
   (https://claude.ai/code/session_01SneDTayY6SKz2GrGKzqqSp).

   shop/apps_data.js belongs to the house layer + store chat, so this chat does
   not edit it. This file is the entry, ready to drop in, and it is the ONLY
   copy — change it here and nowhere else.

   WHAT CHANGES IN shop/apps_data.js

   1 · Replace the whole `ahead:` entry with the one below.
   2 · Delete the `churchsteward:` and `npgoodstanding:` entries. Their apps are
       now redirect pages pointing at ahead-of-it/, so their cards would sell
       something that no longer exists.
   3 · Remove 'churchsteward' and 'npgoodstanding' from the ordering array near
       the top (the line that reads: /* Group 2, the rest *​/ 'ahead',
       'churchsteward','npgoodstanding','compass',…). Leave 'ahead' where it is.

   THE SHELVES. This app now belongs on three shelves — 🏠 Your household,
   ⛪ Your church, and 💼 Your business or nonprofit — because it is genuinely
   all three. `cat:'home'` below is a single-shelf placeholder. The store chat
   already has two-shelf support as a job from Jerry; when it lands, this is the
   first app that wants more than one, and the household shelf is the one to
   lead with.

   THE RECORDINGS ARE ALREADY DONE, AND THEY ARE AHEAD OF THE CATALOGUE.
   shop/voice/ahead-overview.m4a, ahead-train.m4a and ahead-firsttime.m4a on
   this branch were recorded against the exact text below, and all three pass
   `node shop/checkvideos.js ahead`. Until the entry below is pasted in,
   `python3 shop/voicemaker.py --check` will report those three as out of date.
   That is expected — the recordings are the new ones and apps_data.js is still
   the old entry. Pasting the entry unchanged clears it. Do not re-record to
   silence it; that would throw away the new audio and record the old words.

   AND ONE WARNING, FOUND THE HARD WAY WHILE RECORDING THESE. `--check` matches
   a recording to its line with vkey40, which is the first FORTY CHARACTERS of
   the line (shop/voicemaker.py line 73, and the same function in
   shop/watch.html line 2251). So a reword that leaves the opening forty
   characters alone is invisible to it: `--check` says "current", the player
   accepts the cue, and the video speaks the OLD words under the NEW caption.
   It happened on this app's firsttime video on 8 Nov and was only caught by
   reading the diff. If a line changes after its fortieth character, re-record
   that video by name — `python3 shop/voicemaker.py ahead firsttime` — because
   `--all` will skip it. The blind spot itself is in shop/, which this chat does
   not own; it is reported to the Store Manager and is worth fixing for every
   app, not just this one.

   STILL TO DO, AND NOT THIS CHAT'S: shop/kenya/ahead.json, churchsteward.json
   and npgoodstanding.json are the testers' scripts for three apps that are now
   one. They belong to the tester pack chat
   (https://claude.ai/code/session_01EPPiddho9jmdtB6N6bkQbf).
   ═══════════════════════════════════════════════════════════════════════════ */

 ahead: {
  extra:{ firsttime:{title:"Explain it to me", sub:"About four minutes, for a first-timer: what it is for, who it helps, and every main screen. Sound on.", lines:[
    {"t": "Welcome. This short video explains Ahead of It: what it is for, and how to use it.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
    "First, the problem. Every household, every church and every small nonprofit has dates that cost money if you forget them. Insurance to renew. A tax to pay. An inspection. A filing.",
    "They come once a year, at different times, and they all live in one person's head. And heads forget.",
    "Ahead of It holds those dates for you. It shows what is coming next, and what it costs you to miss each one.",
    {"t": "The first thing it asks is who the list is for. Household, church, or nonprofit. It sits at the top of the Library, so you can see at a glance which list you are looking at.", "point": "#modeLib", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('lib');window.scrollTo(0,0)}catch(e){}"},
    "You can change that later, or keep more than one on at the same time. So if you run a household and sit on a church board, this is still one app.",
    {"t": "At the top is the name, and a small word that says empty, all clear, or how many things are overdue.", "point": "#calm"},
    {"t": "The main page is called Next. It has four groups: Overdue, Do something now, Next ninety days, and Later this year.", "point": "#lOver", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
    "Each line shows a name, how many days away it is, and a colour. Red means missing it costs real money. Yellow means a hassle. Green means no big deal.",
    {"t": "The fastest way to begin is the gold button, Quick setup. When the list is empty it says tick what's yours.", "point": "#qsBtn"},
    {"t": "It opens every common item on one screen, for whichever list you chose. Tick what you really have, fix the date on that line if you know it, and tap Save my list at the bottom. Two is plenty to start.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');setTimeout(function(){var q=document.getElementById('qsBtn');if(q)q.click();},150)}catch(e){}"},
    {"t": "To add something of your own, tap the orange button with the plus sign.", "point": ".fab", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
    "A form opens. Write what it is, the next due date, how often it repeats, and how bad it is to miss. Add the amount and where the papers are kept. Then tap Save.",
    "Never type a password into it. Write where the login is kept, not the login itself.",
    "Every item has three reminder steps: thirty days out, seven days, and one day. When a step is due, it shows under Do something now.",
    "When a bill is paid, tap done on its line. The item moves to its next date, ready for next year. There is an Undo if you tap it by mistake.",
    {"t": "Near the top is the money strip. Put amounts on your bills, and it adds up what is due this month, and what is paid.", "point": "#ahMoney"},
    {"t": "The Year tab shows twelve months on one page. Print the year map for the fridge, or add every date to your phone's calendar in one go.", "point": "nav button[data-v='year']", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('year');window.scrollTo(0,0)}catch(e){}"},
    {"t": "The Library has sixty-five ready-made items across the three lists: taxes, renewals and pets for a household, inspections and the van for a church, the 990 and the board for a nonprofit.", "point": "#lib .card", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('lib');window.scrollTo(0,0)}catch(e){}"},
    {"t": "The Hand-off tab is the list someone else would need if you were ever not around. Copy it into a note or an email, or print it. It is the page to print when a trustee or a treasurer hands over.", "point": "#v-more .card", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('more');window.scrollTo(0,0)}catch(e){}"},
    {"t": "Further down the same tab you can turn a second list on at any time. Turning one on adds its ready-made items beside the ones you already have, and nothing you ticked is ever removed.", "point": "#modeSet"},
    {"t": "Here is how to start. Tap Quick setup, tick three real things that are actually yours, and save. Then look at the Next page. That is your first two minutes.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
    "Everything stays on this phone. There is no account and no bank login, and nothing is sent anywhere.",
    "Ahead of It is nineteen dollars, once. Nothing renews. Any profit helps orphans and students in Kenya.",
    {"t": "The round question mark button in the corner has the tour, help and settings, any time.", "point": "#djDockToggle"}]} },
  train:[
   {"t": "Setting up Ahead of It takes about five minutes, once. Then nothing catches you off guard again.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Step one: say who this list is for. Household, church, or nonprofit. The library changes to match.", "point": "#modeLib", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('lib');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Step two: tap the gold Quick setup button. Every common item for that list is on one screen, in groups.", "point": "#qsBtn"},
   {"t": "Step three: tick the ones you really have, fix the date on each line if you know it, and tap Save my list at the bottom.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');setTimeout(function(){var q=document.getElementById('qsBtn');if(q)q.click();},150)}catch(e){}"},
   {"t": "Step four: for anything else, tap the orange plus. Write what it is, the next due date, how often it repeats, and how bad it is to miss. Add the amount and where the papers are kept, then Save.", "point": ".fab", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Step five: read the Next page from the top. Overdue, then Do something now, then the next ninety days, then later. Red costs real money, yellow is a hassle, green is no big deal.", "point": "#lOver"},
   "Step six: each item has three reminder steps — thirty days out, seven days, and one day. When one comes due, it shows under Do something now. Tick it off with the step button.",
   "Step seven: when the bill is paid, tap done on its line. It moves to its next date, ready for next time, and there is an Undo.",
   {"t": "Step eight: put amounts on your bills, and the money strip at the top adds up what is due this month and what is paid.", "point": "#ahMoney"},
   {"t": "Step nine: on the Year tab, print the year map, or tap Add all to my calendar.", "point": "nav button[data-v='year']", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('year');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Step ten: fill in the Hand-off. Copy it into a note or an email for the person who would take over, or print it. And save a backup file now and then.", "point": "#v-more .card", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('more');window.scrollTo(0,0)}catch(e){}"},
   {"t": "You'll know you're set when the Next page shows your real dates, in order, and nothing on it surprises you.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"}],
  lines:[
   {"t": "This is Ahead of It — for whoever carries the household, the church building, or the small nonprofit.", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   "Every one of them has the same problem: dates that cost real money if they slip, arriving once a year, living in one person's head.",
   {"t": "So the first thing it asks is which list this is for. Household, church, or nonprofit — and you can keep more than one on at once.", "point": "#modeLib", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('lib');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Then you tick what is yours from a library of sixty-five ready-made items. Each one already knows its usual date, what happens if you miss it, and what to do thirty days out.", "point": "#lib .card", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('lib');window.scrollTo(0,0)}catch(e){}"},
   {"t": "The Next page is the whole app really. Overdue on top, then the one step that is due now, then the next ninety days.", "point": "#lOver", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Put amounts on your bills and the strip at the top tells you what this month actually costs, and what is still to pay.", "point": "#ahMoney"},
   {"t": "There is a year map, the whole calendar on one page, which is the bit people print for the fridge or the office wall.", "point": "nav button[data-v='year']", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('year');window.scrollTo(0,0)}catch(e){}"},
   "And it can add every date to your phone's calendar in one go, so they sit right beside the rest of your week.",
   {"t": "And there is a hand-off list, so nothing lives in only one person's head any more — print it when a trustee or a treasurer hands over.", "point": "#v-more .card", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('more');window.scrollTo(0,0)}catch(e){}"},
   {"t": "Nothing catches you off guard. No late fees, no lapsed insurance, no failed inspection, no 'I thought you renewed it.'", "js": "try{var o=document.getElementById('qsOv');if(o&&o.offsetWidth){var b=[].find.call(o.querySelectorAll('button'),function(x){return /Close/.test(x.textContent)});if(b)b.click();else o.style.display='none';}}catch(e){} try{go('next');window.scrollTo(0,0)}catch(e){}"},
   "Nineteen dollars, once. No account, no cloud, no bank login, ever. Try it below — put three real dates of your own in and see how it feels."],
  name:'Ahead of It', em:'🧾', sub:'never miss a deadline', fresh:true, cat:'home', price:'$19', testing:true,
  tag:'Taxes, renewals, inspections, filings: every date that costs money if you miss it, on one calm page, with the next 30 days always in view. One app for a household, a church or a nonprofit. No bank login, ever.',
  try:BASE+'ahead-of-it/', video:true,

  },
