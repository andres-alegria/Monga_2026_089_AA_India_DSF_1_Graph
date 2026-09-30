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

- **New figures:** `python3 make_data.py path/to/spreadsheet.xlsx`. It warns when a state's shares don't add up to
  its total.
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
   - It's 1,256 px in Mongabay's 780 px desktop column and 2,165 px in the 335 px phone column.
   - The frame starts at 1,256 px, so desktop never jumps.
   - WordPress's own embed resizer is not used, because it caps iframes at 1,000 px.
3. **Spacing matches Mongabay's own captioned images.**
   - The wrapper has a 40 px margin, as `figure.wp-caption` does.
   - Inside the frame, the source line ends about 3 px above the bottom edge.
   - Measured on the test page, it's 45 px from the source line to the next paragraph, the same as an image caption on
     a live article.
4. **If only the iframe survives** (the script is stripped), the frame stays 1,256 px tall and the graphic scrolls
   inside it on phones.
5. **To test:** open `embed-snippet.html` in a browser. It mimics a Mongabay article column: 780 px wide, 20 px phone
   margins, Public Sans 16/24.

**Also:**
- Keep the static PNG for newsletters, apps and social posts, where iframes don't run.
- Public Sans loads from Google Fonts. Rowan is not on Google Fonts: the title uses a locally installed copy, else
  Georgia, so a hosted version needs a licensed Rowan webfont.

## Open questions for the reporter

- **Maharashtra:** the shares add up to ₹755.8 million, not ₹756 million. The beneficiary share is probably 3,408
  lakh, not 3,406.
- **Andaman and Nicobar Islands:** the centre and beneficiary each show ₹33.6 million, which is ₹4.8 million short of
  the ₹72 million total. One of the two is probably ₹38.4 million (384 lakh).

  Both gaps show as "Not broken down" in the hover card.
- **Puducherry:** the number of boats built is still awaited.
- **Daman and Diu:** it has no note in column K, so it has no info button.
