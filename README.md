# 2026_089 · India deep-sea fishing scheme, interactive report card

A responsive, embeddable version of the static report card. It has one row per coastal state or union territory:
- **Dots:** one per boat approved in 2020–2025, coloured by whether it had been ordered (built or under construction)
  by September 2026.
- **Funds bar:** the amount approved, split into central, state and beneficiary shares.

Numbers show on hover, keyboard focus or tap.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page skeleton |
| `content.js` | All editorial text: title, deck, legend, hover text, notes, source, row order, display names |
| `data.js` | Figures in ₹ million. **Generated.** Don't edit by hand |
| `make_data.py` | Rebuilds `data.js` from the reporter's spreadsheet, which stays out of this repo |
| `style.css` | Mongabay Design System colours, type and layout. Tweak points are commented |
| `app.js` | Drawing and hover cards. Dot size and funds scale are in `CFG` at the top |
| `embed-height.js` | Inside an iframe, reports the graphic's height to the article |
| `embed-shortcode.txt` | **The WordPress shortcode to paste into the story** (built by `dev/embed_shortcode.py`) |
| `embed-snippet.html` | Alternative with a resize script, for editors that allow `<script>` |
| `dev/` | `measure.html` (heights at every column width), `heights.json`, `embed_shortcode.py` (checks the height formula and writes the shortcode), `shortcode-test.html` (a stand-in Mongabay article) |

## Updating

- **New figures:** `python3 make_data.py path/to/spreadsheet.xlsx`. The current source is
  `PMMSY DEEP SEA FISHING VESSEL SCHEME 2020-2025_Update.xlsx` (sheet "final cleaned data sheet", 30 Sep 2026), in the
  project's `Data` folder, outside this repo. It warns when a state's shares don't add up to its total.
- **Text:** edit `content.js`.
- **Publishing:** push to `main`, and Vercel redeploys https://monga2026089aaindiadsf1graph.vercel.app

## Embedding in a Mongabay story

**Use the shortcode in `embed-shortcode.txt`.** Mongabay's editor accepts only an `[iframe …][/iframe]` shortcode: no
`<div>`, no `<script>`. Paste the file's single line where the graphic goes.

**How it sizes itself without a script:**
- The `style` works out the article column's width from the screen width, using the theme's own rule
  (`min(780px, 100vw − 2 × clamp(20px, 1px + 5vw, 40px))`, read from news.mongabay.com on 30 Sep 2026).
- From that width it gives a height at least as tall as the graphic needs (`dev/heights.json`).
- The `?fill=1` in the URL makes the graphic stretch to fill the frame. The formula's few spare pixels go into the row
  spacing: up to about 6 px per row on phones and tablets, and under 1 px on desktop. They never show as a gap under
  the source line.
- The frame has a 40 px margin, the same as Mongabay's own images, so the next paragraph starts about 44 px below the
  source line.
- Checked for every screen width from 320 to 1,600 px, and in the browser at 320, 375, 412, 600, 768 and 1,280 px:
  no overflow, no gap (6 Oct 2026).

**When the content changes** (new figures or text change the graphic's height), re-measure and rebuild:
1. Serve the repo root with `python3 -m http.server`, open `/dev/measure.html`, and save its JSON as
   `dev/heights.json`.
2. Run `python3 dev/embed_shortcode.py`. It reports any width where the formula would fall short, and rewrites
   `embed-shortcode.txt` and `dev/shortcode-test.html`.

**Limits:**
- It relies on Mongabay's column rule. If the theme changes it, re-check with `dev/shortcode-test.html`.
- On Windows browsers with classic scrollbars, `100vw` includes the scrollbar, so the formula sees a column about
  17 px wider than the real one. A few window-width bands come up short, and the frame then scrolls rather than
  hiding content (`scrolling="auto"`):
  - 714–732 px: the formula gives the three-column height, but the graphic has already switched to one column, so
    the frame scrolls by up to about 600 px.
  - 824–840 px: the formula expects the callout beside the deck, but it has already dropped below it, so the frame
    is up to about 50 px short.
  - 558–565 px: up to 5 px short.

**If Mongabay's web team can add a script to a post:** `embed-snippet.html` resizes the frame exactly, using
`embed-height.js`, without fill mode.

**Also:**
- Keep the static PNG for newsletters, apps and social posts, where iframes don't run.
- Public Sans loads from Google Fonts. Rowan is not on Google Fonts: the title uses a locally installed copy, else
  the webfont Mongabay's own theme serves (news.mongabay.com, CORS-open), so every reader gets the same title
  height.

## Open questions for the reporter

- **Andaman and Nicobar Islands:** the centre and beneficiary shares (₹33.6 million each) are ₹4.8 million short of
  the ₹72 million total. The update flags this as a possible error in the source Lok Sabha document. The graphic
  footnotes it, and its bar shows the two shares only.
- **Puducherry:** the boats ordered and the beneficiary share are not available.
- **Odisha and Daman and Diu:** no figures at all ("Data not available").
