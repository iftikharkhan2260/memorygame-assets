/**
 * Memory Game — free analytics backend.
 *
 * What this is: a Google Apps Script "Web App" bound to a Google Sheet. It has no
 * cost, no card required, and no server to maintain — Google hosts it.
 *
 * - doPost(e): the app calls this once per flip/match event and it appends a row.
 * - doGet(e):  with ?action=summary, returns aggregated JSON — totals per card and
 *              totals per territory — which both the app's Stats screen and the
 *              site's admin.html "Stats" tab read.
 *
 * SETUP (see the README.md in this folder for the full walkthrough):
 *   1. Create a new Google Sheet.
 *   2. Extensions -> Apps Script, delete the placeholder code, paste this whole file.
 *   3. Deploy -> New deployment -> type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Copy the resulting URL (ends in /exec). That's your "Analytics endpoint URL" —
 *      paste it into the app's Admin -> Settings, and into admin.html's Stats tab.
 */

const SHEET_NAME = 'Events';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['timestamp', 'cardId', 'cardTitle', 'event', 'region', 'deviceModel']);
  }
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    sheet.appendRow([
      body.timestamp || Date.now(),
      body.cardId != null ? body.cardId : '',
      body.cardTitle || '',
      body.event || '',
      body.region || 'unknown',
      body.deviceModel || 'unknown',
    ]);
    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const action = e.parameter && e.parameter.action;
  if (action === 'summary') {
    return jsonOutput_(buildSummary_());
  }
  return jsonOutput_({ ok: true, message: 'Memory Game analytics endpoint is live.' });
}

function buildSummary_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();

  const cardMap = {}; // cardId -> { cardId, title, flips, matches }
  const regionMap = {}; // region -> flips

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const cardId = row[1];
    const cardTitle = row[2] || String(cardId);
    const event = row[3];
    const region = row[4] || 'unknown';

    if (cardId !== '' && cardId !== undefined && cardId !== null) {
      if (!cardMap[cardId]) {
        cardMap[cardId] = { cardId: cardId, title: cardTitle, flips: 0, matches: 0 };
      }
      if (event === 'flip') cardMap[cardId].flips += 1;
      if (event === 'match') cardMap[cardId].matches += 1;
      cardMap[cardId].title = cardTitle; // keep the most recently seen title
    }

    if (event === 'flip') {
      regionMap[region] = (regionMap[region] || 0) + 1;
    }
  }

  const cards = Object.keys(cardMap).map(function (k) {
    return cardMap[k];
  });
  cards.sort(function (a, b) {
    return b.flips - a.flips;
  });

  const regions = Object.keys(regionMap).map(function (k) {
    return { region: k, flips: regionMap[k] };
  });
  regions.sort(function (a, b) {
    return b.flips - a.flips;
  });

  return { cards: cards, regions: regions };
}
