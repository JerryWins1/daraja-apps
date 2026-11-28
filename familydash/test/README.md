# Walk-through tester

It tests Family Money the way Jerry does: it taps only the buttons a person can see, by their words, starting from the real first page. It takes a screenshot at every step for Claude to read.

It also flags what a person would notice on their own:
- a screen that keeps coming back (a loop)
- the same line twice in a row
- a helper box floating on screen
- a tap that changes nothing
- an expected word that never shows up

```
python3 -m http.server 8731            # from the repo root
node familydash/test/walk.js familydash/test/walk_jerry.json /tmp/walk ipad    # or: phone, mac
```

The script for Jerry's walk-through of 28 Nov is `walk_jerry.json`. It covers:
1. Level 1 setup
2. Check the books
3. Level 2 budget
4. the month chat
5. Level 3 balances

To read the screenshots in a few looks, put six on a sheet:

```
montage /tmp/walk/0[1-6].png -tile 3x2 -geometry 900x+8+8 sheet.jpg
```

Each step is one of:
- `{"tap": "words on the button"}`
- `{"type": "text", "into": "#css"}`
- `{"click": "#css"}`
- `{"tap": "...", "until": "regex", "max": 20}`

Any step can also carry `expect` (a regex that must show up), `never` (a regex that must not), and `same: true` (the tap isn't expected to change the screen).
