# Analytics backend (free, ~10 minutes to set up)

This gives you **A3 — cross-device statistics by card and by territory** ("Balochistan
— 86 flips, Sindh — 99 flips", etc.) without renting a server. It's a Google Sheet
plus a small script Google hosts for you, at no cost.

## What you get

- Every flip and match, from every install, lands as one row in a Sheet you can open
  any time (`timestamp, cardId, cardTitle, event, region, deviceModel`).
- The same script also answers `?action=summary` with ready-aggregated JSON — totals
  per card and totals per region — which is what the app's Stats screen and the
  site's `admin.html` "Stats" tab both display.

## Setup

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet.
   Name it something like "Memory Game Analytics".
2. **Extensions → Apps Script.** A code editor opens in a new tab.
3. Delete the placeholder `function myFunction() {...}` and paste in the entire
   contents of `Code.gs` (in this folder).
4. Click **Save** (the floppy disk icon), then **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Fill in:
   - Description: anything, e.g. "Memory Game analytics"
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**. The first time, Google will ask you to authorize the script —
   click through the "Google hasn't verified this app" warning (it's your own
   script, running under your own account) and allow it.
8. Copy the **Web app URL** it gives you — it ends in `/exec`. That's your
   **Analytics endpoint URL**.

## Wire it up

- **In the app:** Admin → Settings → paste the URL into "Analytics endpoint URL" →
  Save. That's it — flip/match events start posting silently in the background.
  Leave it blank on any install where you don't want analytics running at all.
- **In `admin.html`** on this site: open the **Stats** tab, paste the same URL, and
  it'll pull the same aggregated summary so you can check territory/card totals from
  a browser without opening the app.

## Notes

- **Region** comes from a free IP-geolocation lookup done on-device (never GPS, no
  permission prompt) — it's a coarse guess (state/province-level), not exact.
- **Nothing personally identifying** is sent — just a card id/title, the event type,
  the coarse region, and the device model string.
- If you ever redeploy the script (not just re-save — an actual **New deployment**),
  you'll get a new URL and need to update it in both places above. Editing the code
  and using **Manage deployments → Edit → Deploy** on the *same* deployment keeps the
  URL stable, so prefer that once it's live.
- Apps Script's free quota is generous (tens of thousands of requests/day) — more
  than enough for a shop-scale card game. If you ever outgrow it, the same `Code.gs`
  logic ports easily to Firebase/Supabase later.
- Want to see the raw rows instead of the summary? Just open the Sheet directly —
  every event is a plain row you can filter, pivot-table, or chart however you like.
