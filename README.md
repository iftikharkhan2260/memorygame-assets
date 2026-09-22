# Memory Match — public site & card host

This is a static site to publish on GitHub Pages. It does two jobs:

1. **Hosts `manifest.json` and the card images** the app's background sync reads from
   (see `services/sync.ts` in the app project) — this is what lets you update pics
   roughly 3×/month without shipping a new app build.
2. **A public landing page + privacy policy** for spreading the game and for app
   store submissions (most stores, including free ones, require a reachable privacy
   policy URL).

## Files

```
MemoryGameSite/
├── index.html            landing page
├── privacy.html           privacy policy (needed for app store listings)
├── manifest-admin.html     browser-only tool to build/edit manifest.json (no server)
├── manifest.json           the live card list the app syncs from
├── style.css
├── favicon.png
└── images/                 sample card art (circle, square, star, heart, diamond, hexagon, app-icon)
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

## 3. Updating cards (~3×/month)

Two ways, same result — the app doesn't care which one you used:

**A. From the app's own admin screen** — add/edit/delete cards directly on-device.
This only affects that one device/install, not other players.

**B. From this site (updates everyone)** — this is the one for "spread to public
users":
1. Add your new image(s) into `images/` in the repo (or anywhere public — Imgur,
   another bucket, etc. — as long as the URL is a direct link to the image file).
2. Open `manifest-admin.html` (either locally by double-clicking it, or at
   `https://YOUR_GITHUB_USERNAME.github.io/memorygame-assets/manifest-admin.html`)
   to add/edit rows without hand-writing JSON, then **Download manifest.json**.
   - It has a **Load existing manifest.json** button so you can pull in what's
     already live, tweak it, and re-download rather than starting from scratch.
   - Use **↻** on a row (or **Bump all "updatedAt"**) whenever you replace that
     card's picture — the app only re-downloads an image when `updatedAt` changes.
3. Commit the downloaded `manifest.json` over the one in the repo, push.
4. Every installed app picks up the change automatically in the background within
   ~15 minutes of being open (see the app's README for the exact sync behavior),
   or immediately if someone taps **Sync Now** in admin.

`manifest-admin.html` has `<meta name="robots" content="noindex">` so it won't show
up in search — it's not linked from the public nav either, but the URL still works
for anyone who has it, so don't put anything sensitive in it.

## 4. Before you submit to an app store

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

- This site has zero backend — everything, including the manifest builder, is plain
  HTML/CSS/JS, so it deploys as-is to GitHub Pages with no build step.
- `images/*.png` are simple placeholder shapes (generated, not photos) so you have a
  working example end-to-end. Swap them for your own product photos whenever you're
  ready — same filenames or new ones, your call, just keep each card's `id` stable.
