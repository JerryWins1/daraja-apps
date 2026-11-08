# Setting up The Church App for a church

The checklist for turning the demo into a church's own app. Jerry does this *with* the
church, usually on a call — that sitting-together is a real part of what the first year
buys, because creating a GitHub account is the one step a church office will not get
through on its own.

Work top to bottom. Nothing later works if something earlier is skipped.

## What they are buying

- **$149 the first year.** Setup, and the first year kept current.
- **$49 a year after that**, optional. It buys updates, new features, and help when the
  person who ran it leaves.
- **If they stop paying, the app keeps working**, with everything it already has. The
  renewal is a reminder, not a shutoff.

There is **no licence check, no phone-home and no kill switch**, and none is ever to be
built. The product's promise is no accounts and no passwords, so there is nothing to
check a licence against. Jerry decided this twice on 8 November 2026 — here and for Duka.

## Before the call

- [ ] Ask the church for: their name as they write it, their logo, their brand colour,
      their address and office phone, the office email that should receive prayer
      requests, their giving link, their website, their socials, and their YouTube
      channel.
- [ ] Ask who will post the Sunday sermon each week, and get that person on the call
      too. They are the one who ends up holding the church key.

## 1 · Start from the demo

- [ ] Copy `church-demo/index.html` to a new file. That is the whole app — one file.
- [ ] Read `church-demo/README.md` first. It lists every spot that holds invented
      content, which is the same list of spots that now needs the church's own.

## 2 · Brand it

- [ ] `<title>`, the `apple-mobile-web-app-title` meta, and the logo `<img>` at the top
      of `<body>`.
- [ ] The icons: `apple-touch-icon`, `icon`, and the `manifest` — all three are data
      URIs near the top of the file.
- [ ] `--brand`, `--brand-deep`, `--brand-tint` in `:root`, and again in the two dark
      mode blocks below it. The `theme-color` meta too.
- [ ] Check it in dark mode before moving on. A dark brand colour and a light one need
      different things from the same design, and the Give banner is where that shows up
      first.

## 3 · Fill in the content

Everything the church sees is data near the top of the script section:

- [ ] `MESSAGES` — their sermons. `{id, date, series, title, ref, who}`, `id` is the
      YouTube video id.
- [ ] `EVENTS` — their calendar. Delete `DEMO_SUNDAY` and `DAY()` and write plain dates
      like `d:"2026-11-15"`.
- [ ] `TEAM` — their staff, as `[name, role]` pairs.
- [ ] `THUMBS` — delete the demo's artwork. With real YouTube ids the app falls back to
      YouTube's own thumbnails, which is what a church wants.
- [ ] `SEED_PRAYERS` — empty it: `const SEED_PRAYERS = [];`. A church starts with an
      empty wall, and real requests only ever live on the phone that typed them.
- [ ] `NOTES` at the bottom — this week's outline.

## 4 · Fill in the links

Every outward link in the demo is left unset as `href="#"`. Search the file for `href="#"`
and give each one the church's own address: website, giving, live stream, directions,
socials, the sermon archive. Also:

- [ ] the office phone, in both the `tel:` links and the words beside them
- [ ] the address, in the footer and in the "By mail" box on Give
- [ ] the prayer-team email — the demo's `#p-submit` handler has the real `mailto:` line
      commented out directly above the demo toast. Put it back and set the address.
- [ ] the version stamp in both footers, which is what a tester's pass counts against

Filling these in is also what switches the demo notice off: the block at the bottom of
the file only catches links that are still unset. Delete the demo banner at the top of
Home when you are done.

## 5 · Put it in a repository

- [ ] Create the repository **on Jerry's account first**, so the setup can be finished
      without waiting on the church: https://github.com/new — public, named for the
      church.
- [ ] Add the file as `index.html` at the root.
- [ ] Add a copy of `church-demo/README.md` rewritten as their Owner's Kit, or copy
      Immanuel's (`JerryWins1/immanuel-app/README.md`), which is written for both the
      staff and whatever AI assistant they ask for help.

## 6 · Turn on GitHub Pages

- [ ] In the repository: **Settings → Pages**.
- [ ] Under *Build and deployment*, set **Source** to **Deploy from a branch**.
- [ ] Set **Branch** to **main** and the folder to **/ (root)**. Save.
- [ ] Wait a minute, then open the address it shows and walk the whole app on a phone.

## 7 · The church's GitHub account

This is the slow step. Do it on the call, screen shared, and expect it to take longer
than everything above.

- [ ] They create an account at https://github.com/signup, using an **office** email
      address, not a personal one. Whoever set it up will leave one day.
- [ ] They turn on two-factor authentication when GitHub asks. GitHub requires it.
- [ ] Write down, in the church's own password manager or safe, which email the account
      is under. Not in a chat, not in this repository.

## 8 · Transfer the repository to them

- [ ] In the repository: **Settings → General**, scroll to the bottom, **Danger Zone**.
- [ ] **Transfer ownership** → type their GitHub username → confirm.
- [ ] They accept the transfer from their email.
- [ ] Check Pages is still on afterwards — the address changes to their username, so
      the link in the store card, the test script and `control/apps.json` all change
      with it.

The church now owns the app outright. That is the product promise, and it is also why
there is nothing to switch off if they stop renewing.

## 9 · Their church key

The "church key" is a GitHub fine-grained token that lets the Weekly Update page publish
to their repository. Made by **them**, on **their** account, while Jerry watches the
screen.

- [ ] **Settings → Developer settings → Personal access tokens → Fine-grained tokens →
      Generate new token.**
- [ ] **Resource owner:** their account.
- [ ] **Repository access:** *Only select repositories* → their church app repository,
      and nothing else.
- [ ] **Permissions → Repository permissions → Contents → Read and write.** Nothing
      else. Leave every other permission at *No access*.
- [ ] **Expiration:** the longest GitHub offers. Write the date in the church calendar —
      the day it expires, publishing stops working with no warning, and the fix is to
      make a new key the same way.
- [ ] They paste the key straight into the Weekly Update page's key box, which saves it
      in that browser and nowhere else.

**The key never comes to Jerry and never goes into a chat.** Not into Claude, not into a
text message, not into email, not into a screenshot. The app's own words set the standard
and they are the right ones to say out loud on the call: *"If Google asks you to sign in,
your password goes into Google, never into Porchlight."* Same here — the key goes into
GitHub's page and into their own browser, and into nothing else.

If a key does land somewhere it should not, say so plainly and have them delete it on
that same Fine-grained tokens page. A deleted key stops working immediately, and making
another takes two minutes.

## 10 · Their Weekly Update page

**The Weekly Update page is not inside the app.** It is a separate page in this
repository — `immanuel-update/` — and it is hardcoded to one church:

```
const REPO='JerryWins1/immanuel-app', FILE='index.html';
let TOK=localStorage.getItem('immanuel_key')||'';
```

So each church needs their own copy:

- [ ] Copy `immanuel-update/` to `<church>-update/`.
- [ ] Change `REPO` to their repository.
- [ ] Change the `localStorage` key from `immanuel_key` to something of their own. Every
      page on `jerrywins1.github.io` shares one browser storage, so two churches with the
      same key name would overwrite each other's.
- [ ] Change the title, the heading and the version line.
- [ ] Send the person who posts the sermon the link to their page, and walk them through
      one real Sunday on the call before hanging up.

## 11 · Hand over

- [ ] Show them **Add to Home Screen** on their own phone, and watch them do it. An app
      that lives in a browser tab gets forgotten.
- [ ] Show them the three ways to update it: the Weekly Update page, asking an AI with
      the Owner's Kit in front of it, or editing `index.html` on GitHub directly.
- [ ] Tell them the renewal date and what it buys, and that the app keeps working either
      way.
- [ ] Update `control/apps.json` and the store card with their live address.
