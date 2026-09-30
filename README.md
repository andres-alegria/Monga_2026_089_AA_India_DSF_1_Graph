# 2026_089 · India deep-sea fishing scheme, interactive report card

A responsive, embeddable version of the static report card. It has one row per coastal state or union territory:
- **Dots:** one per boat sanctioned in 2020–2025, coloured by whether the boat was built or under construction by
  September 2026.
- **Funds bar:** the amount sanctioned, split into central, state and beneficiary shares.
- **Info button:** the reporter's note.

Numbers show on hover, keyboard focus or tap.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page skeleton |
| `content.js` | All editorial text: title, deck, legend, notes, source, row order, display names, the notes behind the info buttons |
| `data.js` | Figures in ₹ million. **Generated.** Don't edit by hand |
| `make_data.py` | Rebuilds `data.js` from the reporter's spreadsheet, which stays out of this repo |
| `style.css` | Mongabay Design System colours, type and layout. Tweak points are commented |
| `app.js` | Drawing and hover cards. Dot size and funds scale are in `CFG` at the top |
| `embed-height.js` | Inside an iframe, reports the graphic's height to the article |
| `embed-snippet.html` | The code to paste into the story, set in a stand-in article column for testing |

## Updating

- **New figures:** `python3 make_data.py path/to/spreadsheet.xlsx`. The current source is
  `PMMSY DEEP SEA FISHING VESSEL SCHEME 2020-2025_Update.xlsx` (sheet "final cleaned data sheet", 30 Sep 2026), in the
  project's `Data` folder, outside this repo. It warns when a state's shares don't add up to its total.
- **Text:** edit `content.js`.
- **Publishing:** push to `main`, and Vercel redeploys https://monga2026089aaindiadsf1graph.vercel.app

## Embedding in a Mongabay story

1. **Paste the snippet.** Copy the block between the COPY markers in `embed-snippet.html` into a **Custom HTML** block
   where the graphic goes.
   - WordPress keeps `<iframe>` and `<script>` only for roles with the "unfiltered HTML" permission. If the block comes
     back stripped, ask Mongabay's web team to paste it.
   - Keep the snippet's shape: one wrapper `<div>`, with no line break between `</iframe>` and `<script>`. The classic
     editor otherwise wraps the frame in `<p>` or adds a `<br>`, which puts a blank line under the graphic.
2. **How the height works.**
   - `embed-height.js` reports the graphic's real height, and the snippet sets the frame to fit it, on load and on
     every width change.
   - It's 1,254 px in Mongabay's 780 px desktop column and 2,262 px in the 335 px phone column.
   - The frame starts at 1,254 px, so desktop never jumps.
   - WordPress's own embed resizer is not used, because it caps iframes at 1,000 px.
3. **Spacing matches Mongabay's own captioned images.**
   - The wrapper has a 40 px margin, as `figure.wp-caption` does.
   - Inside the frame, the source line ends about 3 px above the bottom edge.
   - Measured on the test page, it's 45 px from the source line to the next paragraph, the same as an image caption on
     a live article.
4. **If only the iframe survives** (the script is stripped), the frame stays 1,254 px tall and the graphic scrolls
   inside it on phones.
5. **To test:** open `embed-snippet.html` in a browser. It mimics a Mongabay article column: 780 px wide, 20 px phone
   margins, Public Sans 16/24.

**Also:**
- Keep the static PNG for newsletters, apps and social posts, where iframes don't run.
- Public Sans loads from Google Fonts. Rowan is not on Google Fonts: the title uses a locally installed copy, else
  Georgia, so a hosted version needs a licensed Rowan webfont.

## Open questions for the reporter

- **Andaman and Nicobar Islands:** the centre and beneficiary shares (₹33.6 million each) are ₹4.8 million short of
  the ₹72 million total. The update flags this as a possible error in the source Lok Sabha document. The graphic
  footnotes it and shows the gap as "Not broken down".
- **Puducherry:** the boats ordered and the beneficiary share are not available.
- **Odisha and Daman and Diu:** no figures at all ("Data not available").
- **Notes behind the info buttons:** the update has no notes column. They are still edited from the original sheet's
  column K. The Goa and Tamil Nadu notes were written when those states had no boats approved, so check they still
  hold with 20 and 50 approved and none ordered. Puducherry's note came from the old "awaiting response" cell and was
  removed.
