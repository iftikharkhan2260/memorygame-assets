# Memory Match — public site & card host

This is a static site to publish on GitHub Pages. It does three jobs:

1. **Hosts `manifest.json` and the card images** the app's background sync reads from
   (see `services/sync.ts` in the app project) — this is what lets you update pics,
   descriptions, and visibility limits without shipping a new app build.
2. **Lets you upload/manage cards from a browser** (`admin.html`) — no git commands,
   no manual JSON editing. It commits images and `manifest.json` straight to your
   repo via the GitHub API, and shows flip/match/territory stats if you've set up the
   free analytics backend.
3. **A public landing page + privacy policy** for spreading the game and for app
   store submissions (most stores, including free ones, require a reachable privacy
   policy URL).

## Files

```
MemoryGameSite/
├── index.html               landing page
├── privacy.html              privacy policy (needed for app store listings)
├── admin.html                 upload cards, edit manifest, view stats — via the GitHub API
├── manifest-admin.html        manual, token-free fallback: build/download manifest.json by hand
├── manifest.json               the live card list the app syncs from
├── analytics-backend/           free Google Apps Script backend for cross-device stats
│   ├── Code.gs
│   └── README.md
├── style.css
├── favicon.png
└── images/                     sample card art (circle, square, star, heart, diamond, hexagon, app-icon)
```

## 1. Deploy to GitHub Pages

1. Create a public repo (e.g. `memorygame-assets`) and push everything in this
   folder to its root (or to a `/docs` folder — either works, just set that in the
   next step).
2. In the repo: **Settings → Pages → Build and deployment → Deploy from a branch**,
   pick `main` and the root (or `/docs`), save.
3. Your site is live at `https://YOUR_GITHUB_USERNAME.github.io/memorygame-assets/`.
4. Replace every `YOUR_GITHUB_USERNAME` placeholder in `manifest.json` and in
   `index.html`'s meta/links with your real GitHub Pages URL.

## 2. Point the app at it

In the app, open **Admin → Settings** and set the manifest URL to:
```
https://YOUR_GITHUB_USERNAME.github.io/memorygame-assets/manifest.json
```
Tap **Sync Now** once to confirm it pulls the sample cards (circle/square/star/
heart/diamond/hexagon) — that confirms the whole pipeline works end to end before
you swap in your own art.

## 3. Uploading and managing cards

**A. From the app's own admin screen** — add/edit/delete cards directly on-device.
This only affects that one device/install, not other players.

**B. From `admin.html` on this site (updates everyone — this is the main one):**
1. Open `https://YOUR_GITHUB_USERNAME.github.io/memorygame-assets/admin.html`.
2. Create a **fine-grained GitHub personal access token** scoped to just this repo
   (Contents: Read and write) — the page links straight to the token creation page
   and explains exactly what to grant.
3. Enter your username, repo name, and the token → **Connect**. This is stored only
   in your browser's local storage; it's sent only to `api.github.com`.
4. **Add a card**: title, description, an optional visibility limit, and an image
   file. Saving uploads the image to `images/` and updates `manifest.json` in one
   commit — no git required.
5. Edit or delete existing cards the same way, any time, from any browser.
6. The **Stats** tab reads the free analytics backend (see below) and shows the same
   flip/match/territory breakdown the app's own Stats screen shows.

Every change lands on GitHub Pages within about a minute, then every installed app
picks it up automatically on its next background sync — without interrupting a game
in progress.

**C. `manifest-admin.html`** — a manual, token-free fallback if you'd rather not use
a GitHub token: build/edit `manifest.json` in the browser, download it, and commit it
yourself alongside your images.

Both `admin.html` and `manifest-admin.html` have `<meta name="robots" content="noindex">`
so they won't show up in search, but the URLs still work for anyone who has them —
don't share them publicly, and use a token scoped to only this one repo.

## 4. Cross-device statistics (flips, matches, territory)

The app tracks flips/matches locally on each device by default — genuinely free and
private, no setup needed. To see **aggregated totals across every install**,
including a territory breakdown (e.g. "Sindh — 99 flips"), set up the free backend
in `analytics-backend/` (a Google Apps Script + Sheet, ~10 minutes, no cost):

1. Follow `analytics-backend/README.md` to deploy it and get a Web App URL.
2. Paste that URL into the app's **Admin → Settings → Analytics endpoint URL**.
3. Paste the same URL into `admin.html`'s **Stats** tab.

This is entirely optional and off by default — see `privacy.html` for exactly what
it does and doesn't collect (no names, no accounts, no GPS, just card ids, event
type, a coarse region, and a device model string).

## 5. Before you submit to an app store

Most free app stores (Google Play, Amazon Appstore, APKPure, Aptoide, F-Droid, etc.)
ask for a **privacy policy URL** and sometimes a **support/contact URL** during
submission. Once this site is live you can use:
- Privacy policy: `https://YOUR_GITHUB_USERNAME.github.io/memorygame-assets/privacy.html`
- Support/contact: the same page, or `mailto:` link in the footer

Things worth doing before you submit:
- Swap the placeholder `hello@example.com` in `index.html` and `privacy.html` for a
  real contact address.
- Fill in the "Last updated" date at the top of `privacy.html`.
- Once you have a real Google Play (or other store) listing link, replace the `#`
  hrefs on the store badges in `index.html`'s "Get the app" section.
- If you rename the app from "Memory Match", update the `<title>`/`<meta>` tags and
  the `brand` text in both HTML files, plus `app-icon.png`/`favicon.png` in `images/`.

## Notes

- This site has no server of its own — `admin.html` and `manifest-admin.html` are
  plain HTML/CSS/JS that talk directly to the GitHub API (and, optionally, the Apps
  Script analytics endpoint) from the browser, so the whole site still deploys as-is
  to GitHub Pages with no build step and no hosting bill beyond GitHub/Google's free
  tiers.
- `images/*.png` are simple placeholder shapes (generated, not photos) so you have a
  working example end-to-end. Swap them for your own product photos whenever you're
  ready — same filenames or new ones, your call, just keep each card's `id` stable.
