# Daraja Apps — how to put these online as installable apps (one time, ~10 minutes)

This folder is a complete website. Host it once and every app inside installs like a real app (Install button on Android/Chrome; Share → Add to Home Screen on iPhone), works offline, and updates itself when you re-upload.

## The free way (same as the church app): GitHub Pages
1. Go to github.com → sign in (JerryWins1) → **New repository** → name it `daraja-apps` → Public → Create.
2. Click **uploading an existing file** → drag EVERYTHING inside this folder (index.html + the app folders) into the page → Commit.
3. Repository **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. Wait ~1 minute. Your apps are live at **https://jerrywins1.github.io/daraja-apps/** (and each app at …/daraja-apps/nextstep/ , /zuri/ , /breakeven/ , /store/).
5. Later: point **darajastudio.com** at it (Settings → Pages → Custom domain).

To update an app: upload the changed files again. Phones pick up the new version next time they open it online.

## What's in each app folder
- `index.html` — the app, with the Install button + iPhone tip built in
- `manifest.webmanifest` — name, icon, colors (what makes it "installable")
- `sw.js` — the offline cache
- `icon-192.png`, `icon-512.png` — the home-screen icon

## For selling
Buyers get either the ZIP (file) or a link to the hosted app — or both. The hosted version is the "install from a button" experience you asked for.
