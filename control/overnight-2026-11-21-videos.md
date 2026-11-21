# Overnight, 21 Nov 2026 — every video says it is AI-powered

Jerry: *"Make sure all the videos have reference to being an AI application that helps
you manage and do your job better."*

**Listen to one on your phone:** One Thing, the 2-minute video —
https://jerrywins1.github.io/daraja-apps/shop/watch.html?app=nownext
The new line is the second-to-last one: *"One Thing is AI-powered: when you ask, its AI
can break your one thing into three small pieces, or pull the tasks out of a message, so
your day gets started instead of stuck."*

## What changed

- **103 videos** got one new line, each in Jerry's ElevenLabs voice. It goes just before
  each video's closing line, and it says what that app's AI really does:
  - Business Manager: prices a job, reads a receipt or statement, polishes a message.
  - One Thing: breaks your one thing into three pieces, pulls tasks out of a message.
  - Quick Quote: suggests a price for the job.
  - Apps whose ✨ button asks a question built for that app name it: Our Table brings in a
    recipe, Serve Board suggests a fair rotation, Receipt Maker writes the thank-you note,
    Shoebox Counter says what to buy first, The Key suggests what you forgot to write
    down, Pit Wall suggests who to pick, and so on.
  - Every other app: the ✨ button explains the screen and the next thing to do.
  - Business videos say "your work", church ones "your ministry", family and personal
    ones "your day" or "your family". The line says "when you want help" or "when you
    ask", so it does not contradict lines that say nothing leaves the phone.
- That is 81 videos in `shop/apps_data.js` (overview, training, first-time, extras) and
  22 Kenya explainers in `shop/kenya/`.
- **`shop/voicemaker.py --splice`** is new. It keeps the audio of every unchanged line,
  cut from the old recording at its cue times, and records only the new line. A line
  used in several of one app's videos is recorded once. This run sent **31 lines** to
  ElevenLabs, about 6,000 characters, not the 235,000 a full re-record would have cost.
  It refuses to splice a recording in a different voice.
- The tester explainer ("How to be a tester") was in an older 16 kHz voice, not Jerry's,
  so it was recorded **whole** in his voice instead of spliced.
- The store catalogue stamp is now v3.5 · 2026-11-21.

## Skipped, and why

The house layer hides the ✨ and 🎤 buttons on these pages, so saying "AI" would be untrue:

| video | why |
| --- | --- |
| My Safety Plan — overview, training, first-time, Kenya explainer | the crisis tool: nothing may be sent to an AI (`crisisPage()`) |
| The Clubhouse — overview, training, first-time, Kenya explainer | a children's page (`kidsPage()`) |
| Daraja HQ — "How the apps get made" | the private control panel (`/control/`) |

## What was and was not checked

- **Checked:** `voicemaker.py --check` says 145 of 145 recorded and current, whole line
  checked. For all 102 spliced videos: there is exactly one more cue than before, every
  kept line is the same length to the millisecond, the gaps are 0.4 s, and the file length
  equals the last cue. On the test video the kept audio lines up with the old recording at
  zero offset. The player loads the new One Thing file, with 15 cues for 15 lines.
  `checkvideos.js` passed 18 of 18 (Business Manager, One Thing, Our Table, The Key,
  Who's Coming, Receipt Maker).
- **Not checked:** how it sounds. A cloud chat cannot play audio. Whether the new line
  sounds natural next to the old ones needs listening on a real phone.
- **Not done:** the new lines cannot point at the ✨ button. The player only points inside
  the app frame, and apps leave out their corner buttons when they run inside the player.
  So each new line keeps the screen from the line before it.
- **Not changed:** app version stamps. Earlier video-only changes did not bump them either,
  and bumping them would reset every tester pass. No tester script names a video line,
  so none needed changing.
