# Checks on the shared house block

    node tools/house/test.cjs            all of it
    node tools/house/test.cjs back       one group: back, mic, tell, same

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

## Not covered yet

**Start fresh.** It belongs here and it is the one thing in this file's reach
that is not in it. The Ahead of It chat has a harness that drives it properly —
the list of keys it would erase, the reopen afterwards, and whether the papers
pocket went — and is welcome to land it alongside these.

Note for an assertion on that: after Start fresh the saved list is `null`, not
`[]`. Ahead of It's merge deliberately writes nothing on a cold open with
nothing to bring over. Absent is the strongest pass, not a failure.
