# Checks on the shared house block

    node tools/house/test.cjs            all of it
    node tools/house/test.cjs back       one group, named:
                                         back, mic, tell, beta, hello, filekind, door, guard, guide, fresh, same

Needs Playwright, which a cloud container already has.

## Where the block lives (since 25 Nov 2026)

The block is ONE file, `house/house-v88.js` (the number follows the house version). A page carries only
`<script id="dj-house-v88" src="../house/house-v88.js" charset="utf-8"></script>` in the place the
pasted copy used to be: a plain script tag, never `defer` or `async`, because the block patches
globals at load and must run before the app's own script.

- **Change the block by editing that one file.** Then bump each app's sw.js cache name, or a phone
  keeps the old file. (The workers are network-first, so this only matters offline.)
- `python3 tools/house/sweep.py` moves a page's inline copy out, adds the file to the app's sw.js
  pre-cache list, bumps its cache name and its footer stamp. Dry run by default, `--write` to do it,
  safe to run twice. Anything it cannot do cleanly it prints under NEEDS A HAND.
- A beta copy sits one folder deeper, so `tools/rollout.js` adds one `../` on `start` and takes it
  off on `promote`.
- `familydash/` and `shop/watch.html` carry their own copies, moved out unchanged to
  `house/house-v88-familydash.js` and `house/house-v65-watch.js`. Family Dash's has its own AI-sheet
  options and no donate mode; folding it into the shared file would change what that app does.

## Why it is here

On 20 November the back-stack, the microphone and the tell box were each fixed
and each verified by a throwaway script in a container that then went away, and
the Ahead of It chat lost its Start fresh harness the same way. A check nobody
can re-run is a check that only happened once.

## Four traps that made earlier runs lie

All three are guarded against in the file, and all three are worth knowing
before you add a check of your own. Each one fails silently, which is what makes
them worth writing down: two hide a broken fix, the third hides a working one.

- **A service worker's own `fetch()` is not intercepted by Playwright routes.**
  Any reload then grades the deployed site instead of your working copy, and
  everything passes. Every context here sets `serviceWorkers: 'block'`.
- **`file://` is not what a phone loads.** Some apps boot differently there.
  Everything here is served over http from the repo root.
- **`addInitScript` runs again on every navigation, including the reload a page
  does to itself.** `startFresh` ends with `location.replace`, so a seeding
  script that puts test data in localStorage writes all of it straight back
  afterwards — the erase worked, and the run reads as though nothing happened.
  Measured on 20 November: remove a key, reload, and it is there again. This is
  what made the house-layer chat report Start fresh as not erasing anything when
  it was erasing correctly. Seed by hand on the page instead, or re-read through
  a context whose init script has been cleared.

- **The server reads the files off disk as the run goes, so DO NOT TOUCH THE
  WORKING TREE WHILE IT IS RUNNING.** `git checkout`, `git stash`, a sweep, an
  edit: any of them and the later groups grade different code from the earlier
  ones, with nothing in the output to say so. Measured 25 November: a full run
  started on a branch at house v88 was still going when that branch was swapped
  for `main` at v87, and the nine checks that had not run yet failed. They looked
  exactly like a broken feature — the client was not sending its token — and the
  only thing that gave it away was the posted body in the failure text carrying a
  field from the older version. Half an hour nearly went into a bug that was not
  there. The run takes about twelve minutes; wait it out, or run it on a second
  checkout.

A note, not a trap: the house claims `window.djStartFresh` at 0 ms, then again
at 300 ms and 1500 ms, because an older erase layer at the end of the page
assigns after it. Measured on `ahead-of-it` at 0, 200, 400, 1000, 1400, 1500,
1600 and 2200 ms, the house owns the name at every one of them, so there is no
window there to lose on this app. Waiting is still the safe default on an app
nobody has measured.

## Start fresh

The `fresh` group drives it in Ahead of It, which is the hardest case in the
house — four storage keys, three of them from apps the merge replaced, plus a
papers pocket in IndexedDB. Seven checks: the list of names it says it would
erase, that it names nothing belonging to another app, that no saved list
survives, that the three old lists really went so the next open cannot migrate
them back, that the page comes back to a true first open, that the two other
apps seeded alongside are untouched, and that the scanned papers went too.

Two things that make it work, both worth copying if you add a check here. The
first is the third trap above: do not let a seeding init script survive the
reload, or it will refill everything the erase just removed. The second is
simply to accept the dialogs; it asks twice on purpose.
`p.on('dialog', d => d.accept())`.

And one thing not to mistake for a failure: after Start fresh the saved list is
`null`, not `[]`. Ahead of It's merge deliberately writes nothing on a cold open
with nothing to bring over, because an empty record made the house read the app
as one the person had already used. Absent is the strongest pass there is.

Checked against the fault it was written for: with Ahead of It's registry entry
put back to its v71 form, five of the seven fail, naming the three old keys left
behind and the paper still in the pocket. A check that cannot fail is not a
check.

## Not covered yet

Nothing in this file's reach. The gaps left are the ones a container cannot
reach at all: whether a recorded voice actually plays (no AAC and no speech
voice here), and anything behind a blocked host.
