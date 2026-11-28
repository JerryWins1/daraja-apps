# How a Daraja app works: the design, from Family Money

Learned on Family Money Dashboard, 26–28 Nov 2026, mostly by Jerry walking through it screen by screen.
This is a design draft. It gets finished when Family Money is finished, and only then is applied to the other
apps, so that each app is changed once and tested once.

Each rule says what to do, and in brackets what went wrong without it.

## 1 · Levels: start simple

- If an app does a lot, it comes in levels. Level 1 does the one job most people came for. Each level up adds to it.
  (Family Money had 55 screens open to everyone from day one; Jerry: "you made this app really way too complicated".)
- One screen picks the level. It is used at first open and again in Settings. Each level is one button with its
  explanation written on it, and one tap chooses it: no separate explanation, no Next, no Save.
- Moving down a level hides screens and keeps everything entered. Anyone already using the app starts at the top
  level, so nothing disappears on them.
- Moving up a level starts that level's questions in the AI chat right away.
- Settings only shows the questions for the chosen level.

## 2 · The AI chat walks people through it

- Any job with steps (setting up, a new month, checking things) runs as a chat: one question at a time, tap
  answers, plus a box to type in or ask anything. The shared engine is `djGuide` in the house layer.
- A step whose answer is already known is ticked off and skipped. A step above the person's level is skipped silently.
- A box for typing a number sits right under its question, with the cursor in it, not down in the bottom bar.
  (Jerry: "It was hard to find that box. It was buried.")
- The answer buttons follow right under the conversation. They only stay at the bottom of the screen once the
  conversation fills it. (Jerry: "Do you think that big gap should be there?")
- **‹ Back** is on every question. It rewinds the chat, removing everything from that answer on, rather than adding lines.
- Every answer shows what was chosen ("Just me", "Jerry and Diane"), never "— done".
- **Skip for now** is allowed. Whatever was skipped is listed at the end with a ↩ button back to it, and stays
  under "Needs you" on the main screen until it is done. ("I just want to make sure it doesn't get skipped.")
- **Done** goes back to the app. A chat never starts another job by itself. (It looped once.)
- **⏸ Pause** keeps the place. Coming back offers ▶ Continue where we left off.
- Each job starts on a clean screen, not under the last job's conversation.
- Lists of tools start with a ✨ AI row that opens the same job as a chat.

## 3 · One look for the AI

- One mark for everything the AI does: a dark-blue pill that reads **✨ AI** in white. Never a bare ✨, which is too
  faint to see on white.
- The first page's AI button stands out: the pill, a gold ring, and "recommended".

## 4 · Getting around

- **A bar always at the bottom** holds the four or five places used most. In Family Money that is
  ＋ Statements · 🔎 Check · 📝 Reports · 📊 Budget · 🏡 Household. Nothing important lives at the foot of a long page.
- **Every screen has a one-tap way back to the main screen:** Close, Done or Looks right at the bottom. ← Back steps
  back one screen. ("You could have had one button to close, and you got to hit back, then close.")
- **The most direct way:** a button never opens a screen with only one thing on it. Open that thing instead.
- **No helper boxes that follow you.** The "First time here?" and "New screen" pop-ups are off. The chat explains instead.
- Small "✓ saved" messages show at the top and go when the screen changes. Never over the buttons.

## 5 · Words and numbers

- Money always shows as money ($2,150), including inside boxes being edited.
- Never show $0 for something not entered yet. Say what's missing and offer it: "— tap to enter", "add your balances".
  Totals leave out what isn't known, and every screen agrees.
- Never a negative "set aside". Say it plainly: "$400 more paid than was set aside so far".
- Names read like a person wrote them ("Lakeside Mortgage Servicing"), not the bank's capitals.
- Dates already past don't appear in "coming up".
- A warning is said once per screen, not in two sections.
- Explain the setup (where files go, what the app does) on the first page, before it's needed, not at the step that needs it.

## 6 · Testing, before Jerry sees it

- Test the way a person does. The walk-through tester (`familydash/test/walk.js`) starts on the real first page and
  taps only visible buttons by their words. It takes a screenshot at every step, and Claude reads the screenshots.
  It flags loops, repeated lines, floating boxes, taps that change nothing, and screens with no way out.
  (Old tests called functions directly and passed while the real app looped.)
- iPad and phone sizes, two clean runs in a row.
- Videos are recorded once, at the end, from the walk-through's own screenshots (app only, the pretend family).

## Still to settle before this is final

- The remaining Family Money items, and Jerry's last walk-through.
- Whether every app gets levels, or only apps with more than a few screens.
- Moving Family Money's own chat onto the shared `djGuide`, so the other apps share the same, tested engine.
