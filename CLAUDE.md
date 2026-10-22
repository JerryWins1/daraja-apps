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

> Hit **Done** when it's finished, or **Ask a question** if anything looks
> different from what I described.

**Then wait.** Don't send the next step until he replies. Don't batch them, don't
run ahead.

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
