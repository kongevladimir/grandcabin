# Three floor plans

Shown directly below the introduction on `/3d-tour`, before Matterport.
`FloorPlans.tsx` has three floor buttons, starts on the main floor, shows the
whole image with `object-fit: contain`, and links to the full original-size PNG.
Norwegian and English labels follow the existing language setting.

## Assets and sources

- `public/images/floor-plan-main.png` (1897 × 1200): unchanged owner attachment
  `codex-clipboard-6cea7f2a-28f1-4fb5-873f-257c573abe72.png`.
- `public/images/floor-plan-lower.png` (1723 × 913): built-in imagegen restyle of
  `codex-clipboard-6e5e2b3c-0e36-4800-9034-aaf8e01105ee.png`, retained as
  `floor-plan-lower-source.png`.
- `public/images/floor-plan-loft.png` (1523 × 1033): built-in imagegen restyle of
  `floor-plan-loft-source.png`, captured from the public Matterport tour
  `https://my.matterport.com/show/?m=Cni4Ctd7QSV`, View Floor Plan, 3.Etasje.

The main plan is the style reference for the other two: muted natural wood,
charcoal walls, grey bathrooms, white background and top-down architectural
rendering. No API/CLI fallback, resizing or recompression was used. These are
presentation illustrations, not measured construction drawings. The loft source
is a textured scan with gaps; no dimensions are inferred from those gaps.

Visual review compared the room arrangement, door/window positions, stairs,
bed groups, sanitary fixtures, kitchen, sauna, dining table, terrace, and loft
furniture against the supplied sources. A correction pass restored the long
table's seating and removed invented windows and flooring in the loft scan gaps.
Small rendering details are interpretive; retain these source images for review.

## Final lower-floor correction prompt

Precise correction, existing floor-plan rendering edit. IMAGE1 is the attractive muted warm wood rendering to correct. IMAGE2 is original lower-floor geometry/content authority. Preserve image1's style and plan. Correct the dining table seating to match source: THIRTEEN chairs along EACH long side, one chair at each short end, TOTAL TWENTY EIGHT, all separate and countable. Extend table only within the existing open dining-room footprint if needed, never move walls or openings. Bedroom sleeping furniture must retain exact number and footprints from original IMAGE2, do not reinterpret bunk-bed rectangles as a different number of beds. Windows, doors, stairs, fixtures, kitchen cabinets, sauna, terrace and all labels remain exactly as existing source layout. No new fixtures or room changes. Keep whole drawing, white background, original same aspect and natural muted materials. This is a real property plan, preserve all architectural details.

## Final loft correction prompt

Precise correction to illustrated loft floor plan IMAGE1, matching real Matterport layout IMAGE2. Preserve image1 style and main left volume, furniture and all visible plan positions. CRITICAL isolated upper right lounge in IMAGE2 has an UNOBSERVED/EMPTY DIAGONAL TRIANGULAR REGION across its right half plus a small bottom-right notch. Image1 wrongly filled that entire region with wood flooring. Remove that invented flooring: show empty WHITE in the exact diagonal gap and notch of IMAGE2. Keep two beanbags, animal rug and visible wood floor in their exact original positions. Do NOT enclose or fill scanned gaps. Also remove windows invented by IMAGE1 at top of bedrooms, left of bathroom, bottom of living room and top of isolated lounge unless actually shown in IMAGE2; original source should control. Preserve exact walls and openings from IMAGE2. Do not add decor, furnishings, stairs, rails or room contents. Labels remain two Soverom, one Bad, three Loft. Preserve full complete floor plan and same relative scale and isolated placement. White outside and within unobserved gaps.
