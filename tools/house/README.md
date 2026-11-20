# Checks on the shared house block

    node tools/house/test.cjs            all of it
    node tools/house/test.cjs back       one group: back, mic, tell, fresh, same

Needs Playwright, which a cloud container already has.

## Why it is here

On 20 November the back-stack, the microphone and the tell box were each fixed
and each verified by a throwaway script in a container that then went away, and
the Ahead of It chat lost its Start fresh harness the same way. A check nobody
can re-run is a check that only happened once.

## Two traps that made earlier runs lie

Both are guarded against in the file, and both are worth knowing before you add
a check of your own:

- **A service worker's own `fetch()` is not intercepted by Playwright routes.**
  Any reload then grades the deployed site instead of your working copy, and
  everything passes. Every context here sets `serviceWorkers: 'block'`.
- **`file://` is not what a phone loads.** Some apps boot differently there.
  Everything here is served over http from the repo root.

A third, from the Ahead of It chat: the house claims `window.djStartFresh` at
0 ms, then again at 300 ms and 1500 ms, because an older erase layer at the end
of the page assigns after it. Call it earlier than that and you drive the old
layer, whose key names are guesses.

## Start fresh

The `fresh` group drives it in Ahead of It, which is the hardest case in the
house — four storage keys, three of them from apps the merge replaced, plus a
papers pocket in IndexedDB. Seven checks: the list of names it says it would
erase, that it names nothing belonging to another app, that no saved list
survives, that the three old lists really went so the next open cannot migrate
them back, that the page comes back to a true first open, that the two other
apps seeded alongside are untouched, and that the scanned papers went too.

Two things that make it work, both worth copying if you add a check here. The
first is the third trap above: wait past 1500 ms before calling
`window.djStartFresh`, or you drive the old erase layer, whose key names for
Ahead of It do not include the merged one — nothing is erased and the run looks
like a pass of the wrong thing. The second is simply to accept the dialogs; it
asks twice on purpose. `p.on('dialog', d => d.accept())`.

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
