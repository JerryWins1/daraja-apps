# CLAUDE.md

Notes for Claude sessions working in this repo.

## Working with Jerry

**One step at a time.** Never hand over a list of five things to do. Give step one,
stop, and wait. Jerry is usually on a phone or in a browser that Claude cannot see,
so a wall of steps turns into a guessing game about where he actually is.

**Everything the step needs goes inside the step.** The exact text to paste, the
whole URL, the precise button name. He should never have to scroll back up to find
a value.

**Say how far along he is.** Head each one "Step 2 of 4" so the end is in sight.

**End every step with these two options:**

> Reply **done** when it's finished, or **ask a question** if anything looks
> different from what I described.

Word it as replying, not as hitting a button. An ordinary chat message has no
buttons in it, and "Hit Done" sends Jerry hunting the screen for one that
isn't there. Only an AskUserQuestion prompt renders real tappable options, so
save that for genuine forks in the road, not for routine step confirmations.

**Then wait.** Don't send the next step until he replies. Don't batch them, don't
run ahead.

## One app, one chat

Jerry works on one app at a time, so every app gets exactly one chat and no chat
collects several apps. `control/apps.json` is the list: one entry per app, naming
the chat that owns it, its status, and what it is waiting for.

**Read your app's entry before you start.** This is the whole point of the file. A
chat does not inherit anything from the chat that spawned it — a new session starts
blank, however it was created. The entry is what tells it where this app stands, so
read it rather than asking Jerry to recap.

**Write your entry back when you stop.** Set `status`, rewrite `next` in plain words
Jerry can act on, and put today's date in `touched`. A stale entry is worse than an
empty one, because the panel will show it as current.

**Stay inside your own app.** If something turns up that belongs to another app, do
not fix it here. Say which chat owns it — `apps.json` has the name — and leave it.
Work that spans every app, like the shared house layer or the store catalogue, has
its own entry and its own chat; it is the one exception, not a licence to widen.

**Don't work an app whose entry names a different chat.** Tell Jerry which chat owns
it and stop there. Two chats editing one app is how the same change gets made twice.

The statuses, and nothing else:

| status | means |
| --- | --- |
| `needs` | waiting on Jerry — `next` is the question or the tap |
| `review` | finished work for him to look at when convenient |
| `open` | work still outstanding on Claude's side |
| `clear` | nothing waiting |
| `no-chat` | no chat owns this app yet |

`control/apps.html` renders the file as a panel: the apps waiting on Jerry first,
each with a button through to its chat. The page only reads — the chats write.

## Secrets

Never ask for a secret in chat, and never accept one: client secrets, API keys,
access tokens, passwords. Public identifiers such as a client ID or app ID are fine.

Secrets go straight from Jerry into the hosting platform's own secret store, for
example `wrangler secret put` for a Cloudflare Worker. Never into this repo, never
into the conversation.

If a secret does land in chat or inside a screenshot, say so plainly, explain the
real risk without drama, and walk him through rotating it.

## What a cloud session cannot reach

Outbound network from the Claude container is heavily restricted. Verified blocked:
every ESPN host and every Yahoo host, including their developer and API domains.

So Claude cannot read his fantasy leagues, open a link he pastes, or fill in a web
form. Anything happening on a website is his hands on the keyboard. Pasting page
text into chat works fine, and is the way to get page content to Claude.

A chat also dies with the computer it runs on. A chat running through Remote Control
on the Mac is archived the moment that host exits — laptop closed, Claude quit, Mac
asleep. Nothing is lost and it can be unarchived, but it stops answering. So anything
holding a question Jerry owes an answer to belongs in a cloud chat, and anything worth
keeping belongs in this repo rather than in a chat's memory.
