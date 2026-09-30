#!/usr/bin/env python3
"""
Builds the WordPress [iframe] shortcode for the report card, and checks it.

The shortcode can't run a script, so the frame's height comes from a CSS formula in its style attribute:
  - it works out the article column's width from the screen width (Mongabay's theme rule, below);
  - it gives a height at least as tall as the graphic needs at that column width (dev/heights.json).
The ?fill=1 in the URL makes the graphic stretch to the frame, so the formula's spare pixels are shared out between
the rows instead of showing as a gap at the bottom.

    python3 dev/embed_shortcode.py

It checks every screen width from 320 to 1,600 px. Then it writes embed-shortcode.txt (paste its contents into the
post) and dev/shortcode-test.html (a stand-in Mongabay article for testing).

If the graphic's content changes:
  1. Re-measure: serve the repo root, open /dev/measure.html, and save its JSON as dev/heights.json.
  2. Re-run this script. If it reports a shortfall, raise the numbers in FORMULA until it doesn't.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
URL = "https://monga2026089aaindiadsf1graph.vercel.app/?fill=1"
TITLE = "Few takers for India’s deep-sea fishing scheme: boats and funds approved by state (interactive)"

# Mongabay's article column (news.mongabay.com theme CSS, 30 Sep 2026): the container has
# `.ph--40 { padding: 0 clamp(20px, 1px + 5vw, 40px) }` and the text column inside it has max-width 780px.
COL = "min(780px, 100vw - 2 * clamp(20px, 1px + 5vw, 40px))"


def col(vw):
    return min(780, vw - 2 * min(40, max(20, 1 + 0.05 * vw)))


# The height formula, in px (see css_height below). Fitted by hand to dev/heights.json with a margin of at least 6 px:
#   - four-column layout (column over 640 px): 1,290 px, plus 54 below a 749 px column;
#   - one-column phone layout (up to 640 px): the higher of two falling lines, a steep one for small phones and a
#     gentle one for larger screens.
FORMULA = {
    "desk_base": 1290, "desk_step_below": 749, "desk_step": 54,
    "steep": (2774.1, 1.457), "gentle": (2378.1, 0.572),
    "switch_at": 640.5,   # the graphic's own layout switch is at 640 px
}


def css_height(f=FORMULA):
    (a0, a1), (b0, b1) = f["steep"], f["gentle"]
    desk = f"{f['desk_base']}px + clamp(0px, ({f['desk_step_below']}px - {COL}) * 1000, {f['desk_step']}px)"
    phone = f"max({a0}px - {a1} * {COL}, {b0}px - {b1} * {COL})"
    return f"max({desk}, min({phone}, ({f['switch_at']}px - {COL}) * 100000))"


def height(c, f=FORMULA):
    (a0, a1), (b0, b1) = f["steep"], f["gentle"]
    desk = f["desk_base"] + min(max((f["desk_step_below"] - c) * 1000, 0), f["desk_step"])
    phone = max(a0 - a1 * c, b0 - b1 * c)
    return max(desk, min(phone, (f["switch_at"] - c) * 100000))


LAYOUT_SWITCH = 640  # style.css: the phone layout applies up to a 640 px wide frame


def needed(c, heights):
    """The graphic's natural height at column width c: the taller of the two measurements around it, taken on the
    same side of the layout switch as c."""
    ws = sorted(w for w in heights if (w <= LAYOUT_SWITCH) == (c <= LAYOUT_SWITCH))
    if c < ws[0]:
        return max(heights[w] for w in ws)
    lo = max((w for w in ws if w <= c), default=ws[0])
    hi = min((w for w in ws if w >= c), default=lo)
    return max(heights[lo], heights[hi])


def main():
    heights = {int(k): v for k, v in json.load(open(os.path.join(HERE, "heights.json"))).items()}
    style = (f"display:block; width:100%; height:{css_height()}; margin:40px 0; border:0;")

    # check every screen width
    bands = [(320, 359, "small phones"), (360, 430, "phones"), (431, 714, "large phones, small tablets"),
             (715, 859, "tablets, small windows"), (860, 1600, "desktop")]
    worst = None
    print("spare height (formula minus graphic), px")
    for lo, hi, label in bands:
        spare = [height(col(vw)) - needed(col(vw), heights) for vw in range(lo, hi + 1)]
        worst = min(spare) if worst is None else min(worst, min(spare))
        print(f"  {label:28s} {lo}–{hi}: {min(spare):6.1f} to {max(spare):6.1f}  (up to {max(spare) / 13:.1f} per row)")
    if worst < 0:
        print(f"  ! the formula is up to {-worst:.1f} px short somewhere: raise the numbers in FORMULA")
        raise SystemExit(1)

    shortcode = (f'[iframe src="{URL}" title="{TITLE}" style="{style}" scrolling="auto" loading="lazy"][/iframe]')
    with open(os.path.join(ROOT, "embed-shortcode.txt"), "w", encoding="utf-8") as fh:
        fh.write(shortcode + "\n")

    test = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>2026_089 shortcode · test page</title>
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400&display=swap" rel="stylesheet">
  <style>
    /* a stand-in for a Mongabay article: the theme's .ph--40 container and 780 px column, Public Sans 16/24 */
    body {{ margin: 0; background: #ffffff; color: #092f29; font: 16px/24px "Public Sans", sans-serif; }}
    .ph--40 {{ max-width: 1280px; margin: 0 auto; padding: 24px clamp(20px, 1px + 5vw, 40px); }}
    .inner {{ max-width: 780px; margin: 0 auto; }}
    .inner p {{ margin: 0 0 24px; }}
  </style>
</head>
<body>
<div class="ph--40"><div class="inner">
  <p>Article text before the graphic. This paragraph stands in for the story text above the embed.</p>
  <!-- the shortcode's output, with src pointing at this local copy -->
  <iframe src="../?fill=1" title="{TITLE}" style="{style}" scrolling="auto"></iframe>
  <p>Article text after the graphic. This paragraph shows the gap a reader sees below the embed.</p>
</div></div>
</body>
</html>
"""
    with open(os.path.join(HERE, "shortcode-test.html"), "w", encoding="utf-8") as fh:
        fh.write(test)
    print(f"\nwrote embed-shortcode.txt ({len(shortcode)} characters) and dev/shortcode-test.html")


if __name__ == "__main__":
    main()
