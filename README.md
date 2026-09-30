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
| `make_data.py` | Rebuilds `data.js` from `../Data/PMMSY DEEP SEA FISHING VESSEL SCHEME 2020-2025.xlsx` |
| `style.css` | Mongabay Design System colours, type and layout. Tweak points are commented |
| `app.js` | Drawing and hover cards. Dot size and funds scale are in `CFG` at the top |

## Updating

- **New figures:** edit the spreadsheet, then run `python3 make_data.py`. It warns when a state's shares don't add up
  to its total.
- **Text:** edit `content.js`.
- **Preview:** open `index.html` in any browser. No server is needed.

## Embedding

- The page is responsive:
  - four columns above 640 px wide;
  - on phones, the name and info button on one line, with the dots and the bar below it.
- Approximate heights: 1,180 px at 1,100 px wide, 1,370 px at 700 px, 2,200 px at 375 px. An iframe needs
  auto-height (pym.js or Mongabay's own embed script) or a fixed height per breakpoint.
- Public Sans loads from Google Fonts. Rowan is not on Google Fonts: the title uses the locally installed font and falls
  back to Georgia. A hosted version needs a licensed Rowan webfont.

## Open questions for the reporter

- **Maharashtra:** the shares add up to ₹755.8 million, not ₹756 million. The beneficiary share is probably 3,408
  lakh, not 3,406.
- **Andaman and Nicobar Islands:** the centre and beneficiary each show ₹33.6 million, which is ₹4.8 million short of
  the ₹72 million total. One of the two is probably ₹38.4 million (384 lakh).

  Both gaps show as "Not broken down" in the hover card.
- **Puducherry:** the number of boats built is still awaited.
- **Daman and Diu:** it has no note in column K, so it has no info button.
