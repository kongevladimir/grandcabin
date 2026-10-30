# Three floor plans

## Mattresses against wall and loft typography reference, 30 October 2026

The four shortened alcove mattresses now meet the upper inner wall, leaving free floor at their feet. Both languages updated. Main and lower floor labels now use the lighter, smaller lettering of the loft bedroom labels as the explicit reference. All room names, sleeping counts, ceiling annotations and furniture were visually checked. Built-in imagegen edit mode used for all six assets.

Final files and generated sources:
- `public/images/floor-plan-loft.png`: `exec-031a7066-ff24-4985-8705-eae7b2802c42.png`
- `public/images/floor-plan-loft-en.png`: `exec-c01b518e-b26a-485a-9554-9e14e2cc7b24.png`
- `public/images/floor-plan-main.png`: `exec-92a135f9-1760-4faf-9acb-e6820ee59688.png`
- `public/images/floor-plan-main-en.png`: `exec-532896d6-13b9-4f69-8769-c6b9aab9c8b4.png`
- `public/images/floor-plan-lower.png`: `exec-87fc714c-5858-4b01-bf9c-515387036179.png`
- `public/images/floor-plan-lower-en.png`: `exec-d377548f-fd7d-450b-886d-ce13042db88a.png`

Final prompts:

### wallMattressNbPrompt

```text
Use case: precise-object-edit. Image1 is the full loft floor-plan EDIT TARGET. Only move the FOUR existing single mattresses in sleeping alcove10 UPWARD as a group until their upper/head ends touch the INSIDE of the upper horizontal wall directly below the long staircase (inner wall edge around y442 in this 1522px-wide full image). Eliminate the strip of empty wooden floor BETWEEN the mattress head ends and that upper wall. Keep current SHORT mattress lengths unchanged, widths, four distinct mattresses, ordering, bedding and pillows unchanged. Translation only: do NOT stretch or lengthen mattresses. Leave resulting free floor space BELOW mattress feet towards the lower alcove wall. Do NOT move walls, windows, staircase, glass railing, coffee tables, sofa, pingpong table, bathroom, bedrooms or separate Hems/mezzanine. Preserve all labels exactly, font and size, full canvas/framing/dimensions, materials and room geometry. Do not add red marks or new objects. Norwegian labels must remain: Soverom 9 (2 soveplasser), Soverom 8 (2 soveplasser), Bad, Loftstua, Alkove 10 (4 soveplasser), Hems. Keep the alcove label centered and legible.
```

### wallMattressEnPrompt

```text
Use case: precise-object-edit. Image1 is the full loft floor-plan EDIT TARGET. Only move the FOUR existing single mattresses in sleeping alcove10 UPWARD as a group until their upper/head ends touch the INSIDE of the upper horizontal wall directly below the long staircase (inner wall edge around y442 in this 1522px-wide full image). Eliminate the strip of empty wooden floor BETWEEN the mattress head ends and that upper wall. Keep current SHORT mattress lengths unchanged, widths, four distinct mattresses, ordering, bedding and pillows unchanged. Translation only: do NOT stretch or lengthen mattresses. Leave resulting free floor space BELOW mattress feet towards the lower alcove wall. Do NOT move walls, windows, staircase, glass railing, coffee tables, sofa, pingpong table, bathroom, bedrooms or separate Hems/mezzanine. Preserve all labels exactly, font and size, full canvas/framing/dimensions, materials and room geometry. Do not add red marks or new objects. English labels must remain: Bedroom 9 (Sleeps 2), Bedroom 8 (Sleeps 2), Bathroom, Loft lounge, Sleeping alcove 10 (Sleeps 4), Mezzanine. Keep the alcove label centered and legible.
```

### fontMatch-mainPrompt

```text
Use case: text-localization. Image1 is the EDIT TARGET floor plan. Image2 is the LOFT TYPOGRAPHY REFERENCE ONLY. Change ONLY typography of ALL existing labels in Image1 to match the regular-weight narrow white sans-serif in 'Soverom 8'/'Bedroom 8' on Image2, same subtle dark shadow and same letter height. Current Image1 labels are too large and too bold. Reduce ALL label lettering by approximately 25percent, use regular weight, consistent size everywhere (room names, sleeping counts, bathrooms, storage, sauna, terrace, ceiling descriptions). Target capital-letter height roughly16pixels in this full-resolution image, font nominally22px. Keep every label's EXACT wording, numbers, sleeping counts, language and location; don't add/remove text. Preserve ALL furniture, beds, 26 dining chairs on lower floor if present, table, walls, windows, stairs, doors, textures, dimensions, canvas and framing EXACTLY. NO changes to floor plan or objects. Image2 is style reference only; never import its rooms/furniture into Image1. Main floor: preserve bedroom5 sleeps2, bedroom6 sleeps3, BOTH hallway labels and FOUR ceiling annotations (English exact 'Vaulted Ceiling'; Norwegian exact 'åpen himling').
```

### fontMatch-main-enPrompt

```text
Use case: text-localization. Image1 is the EDIT TARGET floor plan. Image2 is the LOFT TYPOGRAPHY REFERENCE ONLY. Change ONLY typography of ALL existing labels in Image1 to match the regular-weight narrow white sans-serif in 'Soverom 8'/'Bedroom 8' on Image2, same subtle dark shadow and same letter height. Current Image1 labels are too large and too bold. Reduce ALL label lettering by approximately 25percent, use regular weight, consistent size everywhere (room names, sleeping counts, bathrooms, storage, sauna, terrace, ceiling descriptions). Target capital-letter height roughly16pixels in this full-resolution image, font nominally22px. Keep every label's EXACT wording, numbers, sleeping counts, language and location; don't add/remove text. Preserve ALL furniture, beds, 26 dining chairs on lower floor if present, table, walls, windows, stairs, doors, textures, dimensions, canvas and framing EXACTLY. NO changes to floor plan or objects. Image2 is style reference only; never import its rooms/furniture into Image1. Main floor: preserve bedroom5 sleeps2, bedroom6 sleeps3, BOTH hallway labels and FOUR ceiling annotations (English exact 'Vaulted Ceiling'; Norwegian exact 'åpen himling').
```

### fontMatch-lowerPrompt

```text
Use case: text-localization. Image1 is the EDIT TARGET floor plan. Image2 is the LOFT TYPOGRAPHY REFERENCE ONLY. Change ONLY typography of ALL existing labels in Image1 to match the regular-weight narrow white sans-serif in 'Soverom 8'/'Bedroom 8' on Image2, same subtle dark shadow and same letter height. Current Image1 labels are too large and too bold. Reduce ALL label lettering by approximately 25percent, use regular weight, consistent size everywhere (room names, sleeping counts, bathrooms, storage, sauna, terrace, ceiling descriptions). Target capital-letter height roughly16pixels in this full-resolution image, font nominally22px. Keep every label's EXACT wording, numbers, sleeping counts, language and location; don't add/remove text. Preserve ALL furniture, beds, 26 dining chairs on lower floor if present, table, walls, windows, stairs, doors, textures, dimensions, canvas and framing EXACTLY. NO changes to floor plan or objects. Image2 is style reference only; never import its rooms/furniture into Image1. Lower floor: preserve bedroom1&2 sleeps3, bedroom3 sleeps2, bedroom4&5 sleeps4, two storages, two bathrooms, sauna, toilet, hallway, utilityroom, terrace and EXACTLY26chairs (12 per long side and1each end).
```

### fontMatch-lower-enPrompt

```text
Use case: text-localization. Image1 is the EDIT TARGET floor plan. Image2 is the LOFT TYPOGRAPHY REFERENCE ONLY. Change ONLY typography of ALL existing labels in Image1 to match the regular-weight narrow white sans-serif in 'Soverom 8'/'Bedroom 8' on Image2, same subtle dark shadow and same letter height. Current Image1 labels are too large and too bold. Reduce ALL label lettering by approximately 25percent, use regular weight, consistent size everywhere (room names, sleeping counts, bathrooms, storage, sauna, terrace, ceiling descriptions). Target capital-letter height roughly16pixels in this full-resolution image, font nominally22px. Keep every label's EXACT wording, numbers, sleeping counts, language and location; don't add/remove text. Preserve ALL furniture, beds, 26 dining chairs on lower floor if present, table, walls, windows, stairs, doors, textures, dimensions, canvas and framing EXACTLY. NO changes to floor plan or objects. Image2 is style reference only; never import its rooms/furniture into Image1. Lower floor: preserve bedroom1&2 sleeps3, bedroom3 sleeps2, bedroom4&5 sleeps4, two storages, two bathrooms, sauna, toilet, hallway, utilityroom, terrace and EXACTLY26chairs (12 per long side and1each end).
```


## Vaulted Ceiling and consistent typography, 30 October 2026

Built-in imagegen updated `public/images/floor-plan-main.png`,
`public/images/floor-plan-main-en.png`, `public/images/floor-plan-lower.png`,
and `public/images/floor-plan-lower-en.png`. Main and lower-floor labels use
larger white sans-serif lettering, with the loft as the font/relative-size
reference. English main-floor annotations now read Vaulted Ceiling in all four
original positions. Both Hallway labels are retained. Norwegian åpen himling
wording remains. Room numbers and sleeping counts were visually checked; raw
pixel checks still count 12 chairs on each dining-table side in both languages,
plus the two end chairs (26 total).

Norwegian main-floor typography prompt:

Use case: typography-only image edit. IMAGE1 is the plan to edit. IMAGE2 is the LOFT FONT REFERENCE ONLY, never copy room layouts. Match its clean white sans-serif font, regular/medium weight, subtle restrained dark outline/shadow and uniform letter height. Existing small labels are currently visibly smaller: ENLARGE them so all room names and descriptions match the loft's relative size when plans are displayed at equal width. All words including room names and parenthetical sleeping counts should use the SAME size and font, not small captions. Keep every original room/annotation label in its correct place, wrap on two or three lines as needed inside room boundaries. No new or omitted labels. ONLY text/typography changes; preserve all architecture, fixtures, furniture, bed footprints, doors, windows, stairs, material colors, framing and original complete canvas. No crop, zoom, resize, decorative additions or geometry changes. Main-floor canvas is1577px wide: use about26–28px label font, equivalent in relative size to loft24px on1522px. Preserve ALL exact Norwegian wording, room numbers and capacities: Soverom5(2soveplasser),Soverom6(3soveplasser),Bad,Sauna,WC,Skibod/Garasjebod,Gang,Bod,Spisestue,Stue/Kjøkken,Terrasse,allåpenhimling. Keep all annotations including duplicated åpen himling locations; only font size/family changes.

English main-floor typography prompt:

Use case: typography-only image edit. IMAGE1 is the plan to edit. IMAGE2 is the LOFT FONT REFERENCE ONLY, never copy room layouts. Match its clean white sans-serif font, regular/medium weight, subtle restrained dark outline/shadow and uniform letter height. Existing small labels are currently visibly smaller: ENLARGE them so all room names and descriptions match the loft's relative size when plans are displayed at equal width. All words including room names and parenthetical sleeping counts should use the SAME size and font, not small captions. Keep every original room/annotation label in its correct place, wrap on two or three lines as needed inside room boundaries. No new or omitted labels. ONLY text/typography changes; preserve all architecture, fixtures, furniture, bed footprints, doors, windows, stairs, material colors, framing and original complete canvas. No crop, zoom, resize, decorative additions or geometry changes. Main-floor canvas1577px: use about26–28px font. Replace EVERY occurrence of 'Open to above' with EXACT 'Vaulted Ceiling' (capital V and C), including hallway, dining room annotations and living/kitchen. No 'Open to above' must remain. All other English wording remains exact:Bedroom5(Sleeps2),Bedroom6(Sleeps3),Bathroom,Sauna,Toilet,Ski storage/Garage storage,Hallway,Storage,Dining room,Living room/Kitchen,Terrace. Use same larger letter size for Vaulted Ceiling as other descriptions, not tiny subtitles. Keep all nontext contents unchanged.

Final English main-floor label completion prompt:

Precise text-only completion. Keep the supplied main-floor English plan exactly as is, including the enlarged matching white sans-serif typography. Add back ONLY TWO labels omitted in previous typography pass: (1) 'Hallway' centered in the small upper-right grey corridor room, to the RIGHT of Bedroom6 and ABOVE Storage (roughly x1465,y137). (2) 'Vaulted Ceiling' in the empty floor strip BELOW the dining table, inside the dining room above terrace (roughly x940,y613). Match the SAME font family, weight, visible size and subtle dark shadow as current 'Vaulted Ceiling' under Dining room heading. Keep the other three Vaulted Ceiling labels (under main Hallway, under Dining room, under Living room/Kitchen) unchanged. There should now be FOUR Vaulted Ceiling annotations, and TWO Hallway labels, in their original zones. Do not move any other labels, change any wording, furniture, wall, door, window, stair, object, image dimensions or framing. No other edits. Add only these2missingtextlabels.

Norwegian lower-floor typography prompt:

Use case: typography-only image edit. IMAGE1 is the plan to edit. IMAGE2 is the LOFT FONT REFERENCE ONLY, never copy room layouts. Match its clean white sans-serif font, regular/medium weight, subtle restrained dark outline/shadow and uniform letter height. Existing small labels are currently visibly smaller: ENLARGE them so all room names and descriptions match the loft's relative size when plans are displayed at equal width. All words including room names and parenthetical sleeping counts should use the SAME size and font, not small captions. Keep every original room/annotation label in its correct place, wrap on two or three lines as needed inside room boundaries. No new or omitted labels. ONLY text/typography changes; preserve all architecture, fixtures, furniture, bed footprints, doors, windows, stairs, material colors, framing and original complete canvas. No crop, zoom, resize, decorative additions or geometry changes. Lower-floor canvas1721px: use about28–30px label font, equivalent to loft24px on1522px. Keep every Norwegian word/number/count exact:Teknisk rom,Soverom1(3soveplasser),Soverom2(3soveplasser),Soverom3(2soveplasser),Soverom4(4soveplasser),Soverom5(4soveplasser),Bod in BOTH storage rooms,Bad in BOTH actual bathrooms,Sauna,Toalett,Gang,Terrasse. CRITICAL dining table and ALL26CHAIRS are unchanged:12left+12right+1top+1bottom. Do not redraw/move/add/remove any chair or alter wider table shape and kitchen-island clearance. Only enlarge and match text.

English lower-floor typography prompt:

Use case: typography-only image edit. IMAGE1 is the plan to edit. IMAGE2 is the LOFT FONT REFERENCE ONLY, never copy room layouts. Match its clean white sans-serif font, regular/medium weight, subtle restrained dark outline/shadow and uniform letter height. Existing small labels are currently visibly smaller: ENLARGE them so all room names and descriptions match the loft's relative size when plans are displayed at equal width. All words including room names and parenthetical sleeping counts should use the SAME size and font, not small captions. Keep every original room/annotation label in its correct place, wrap on two or three lines as needed inside room boundaries. No new or omitted labels. ONLY text/typography changes; preserve all architecture, fixtures, furniture, bed footprints, doors, windows, stairs, material colors, framing and original complete canvas. No crop, zoom, resize, decorative additions or geometry changes. Lower-floor canvas1721px: use about28–30px label font, equivalent to loft24px on1522px. Keep English wording exact:Utility room,Bedroom1(Sleeps3),Bedroom2(Sleeps3),Bedroom3(Sleeps2),Bedroom4(Sleeps4),Bedroom5(Sleeps4),Storage at BOTH storage rooms,Bathroom at BOTH actual bathrooms,Sauna,Toilet,Hallway,Terrace. CRITICAL keep ALL26DININGCHAIRS in exact positions:12left+12right+1top+1bottom; don't redraw table or chairs, no added/missing chairs and no change in table/island gap. No Norwegian wording. Only enlarge and match text.

## English plan labels and slightly larger table, 29 October 2026

`FloorPlans.tsx` now chooses both its plan image and full-image link from the
active site language. English PNGs are `public/images/floor-plan-main-en.png`,
`public/images/floor-plan-lower-en.png`, and `public/images/floor-plan-loft-en.png`.
Norwegian PNGs retain the corresponding names without `-en`. Built-in imagegen
translated the image labels, including Bathroom, Bedroom, Sleeps, Storage,
Hallway, Terrace, Sleeping alcove and Mezzanine.

The lower-floor table is slightly wider while keeping its shorter length and
island clearance. The final Norwegian AND English versions were visually checked
and raw-pixel sampled: 12 white chair groups on each long side plus one chair at
each end = 26. Rejected longer-table drafts changed the chair count and are unused.

Final table size prompt:

Use case: precise-object-edit. The supplied plan already has EXACTLY12chairs each long side plus1each end=26, which is correct. Make ONLY the dining TABLETOP a little WIDER, about12percent wider horizontally, keeping its LENGTH and TOP/BOTTOM END POSITIONS EXACTLY UNCHANGED. Do not make table longer; that incorrectly adds chairs. Keep all24existing sidechairs, exactly12left and12right, in their SAME y positions; only shift the left row slightly LEFT and the right row slightly RIGHT to accommodate wider tabletop, without adding or deleting any chair. Keep both endchairs, centered. Result is a visibly slightly larger WIDER table, SAME26chairs. Never add a13th sidechair. Keep all12existing sidechairs per side at their same heights. Keep kitchen-island clearance unchanged and generous. Retain centered plant and rug, widening rug slightly only if needed. All room labels, capacities, geometry, walls, fixtures, kitchen, beds, stairs, doors/windows, fireplace, terrace, colors, materials and whole image/framing remain unchanged. Only horizontal tabletop width and corresponding tiny horizontal chair-row offsets change. No crop, no resize, no annotations.

Main-floor English prompt:

Use case: text-localization ONLY. Translate all Norwegian text in supplied MAIN FLOOR plan to English, leaving all non-text pixels, room geometry, walls, doors, windows, furniture, beds, stairs, layout, colors and full framing unchanged. Exact replacements: 'Soverom 5' -> 'Bedroom 5'; '(2 soveplasser)' -> '(Sleeps 2)'; 'Soverom 6' -> 'Bedroom 6'; '(3 soveplasser)' -> '(Sleeps 3)'; 'Bad' -> 'Bathroom'; 'Sauna' stays 'Sauna'; 'WC' -> 'Toilet'; 'Skibod/Garasjebod' -> 'Ski storage / Garage storage' wrapping inside same room; 'Gang' -> 'Hallway' (both occurrences); 'Bod' -> 'Storage'; 'Spisestue' -> 'Dining room'; 'Stue/Kjøkken' -> 'Living room / Kitchen'; 'Terrasse' -> 'Terrace'; all 'åpen himling' -> 'Open to above'. Preserve all labels in corresponding exact original positions, clean white sans-serif same visible size and subtle dark shadow, wrap longer English labels where necessary without covering walls or changing objects. No Norwegian text should remain. No changes to architecture or furnishings, no crop or resize, full original drawing.

Loft English prompt:

Use case: text-localization ONLY. Translate room labels in supplied complete LOFT floor plan to English. Exact replacements: 'Soverom 9' -> 'Bedroom 9'; 'Soverom 8' -> 'Bedroom 8'; both '(2 soveplasser)' -> '(Sleeps 2)'; 'Bad' -> 'Bathroom'; 'Alkove 10' -> 'Sleeping alcove 10'; '(4 soveplasser)' -> '(Sleeps 4)'; living-room 'Loft' -> 'Loft lounge'; separate upper-right 'Hems' -> 'Mezzanine'. Same clean white sans-serif size and subtle dark shadow, wrap labels so they fit safely. Absolutely no other modifications: preserve full room/wall geometry, four window groups, all beds, doors, bathroom, sofa, table tennis, main stair and short glass railing; preserve separate upper-right mezzanine with completed room and HORIZONTALLY RUNNING stair (vertical tread lines) and OPEN LEFT STAIR ENTRANCE (no short blocking wall). Keep room contents, scale, colors, exact full framing. No added/removed furniture or features, no crop or resize. All labels in English, unchanged plan.

Lower-floor English prompt:

Use case: text-localization ONLY. Translate ALL labels in the supplied LOWER FLOOR plan from Norwegian to English with no changes to any other details. Exact replacements: 'Teknisk rom' -> 'Utility room'; 'Soverom 1' -> 'Bedroom 1', '(3 soveplasser)' -> '(Sleeps 3)'; 'Soverom 2' -> 'Bedroom 2', '(3 soveplasser)' -> '(Sleeps 3)'; 'Soverom 3' -> 'Bedroom 3', '(2 soveplasser)' -> '(Sleeps 2)'; 'Soverom 4' -> 'Bedroom 4', '(4 soveplasser)' -> '(Sleeps 4)'; 'Soverom 5' -> 'Bedroom 5', '(4 soveplasser)' -> '(Sleeps 4)'; BOTH 'Bod' labels -> 'Storage'; BOTH actual 'Bad' labels -> 'Bathroom'; 'Sauna' stays 'Sauna'; 'Toalett' -> 'Toilet'; 'Gang' -> 'Hallway'; 'Terrasse' -> 'Terrace'. Keep same clear white sans-serif lettering size and subtle shadow, original room positions, use line breaks to fit safely. Preserve full drawing, exact walls/windows/doors/stairs, every bed/fixture/furniture, kitchen island and dining table size/position. CRITICAL table currently has exactlyTWELVEchairs each long side plusONEtop+ONEbottom=26; keep every existing chair in exact position, DO NOT redraw table or add/remove/resize any chair, translation is the only task. Keep wider table and generous island gap unchanged. No Norwegian words remain, all room labels English. Same dimensions/full framing, no crop/resize, no new features or annotations.

## Shorter lower-floor table with 26 seats, 29 October 2026

Built-in imagegen updated `public/images/floor-plan-lower.png` from the owner's
reference `codex-clipboard-e673bf30-181a-4fa2-b675-c32e0b086782.png`.
The table is shortened at its kitchen end, with more clearance to the island.
The final image has 12 chairs on each long side and one on each short end (26).
Visual inspection and raw pixel sampling found 12 separate white chair groups
on both sides. Two rejected drafts had 13 and 11 chairs per side; neither is used.
The prior 28-seat source instructions below are historical and superseded.

Initial edit prompt:

Use case: precise-object-edit. IMAGE1 is the complete current lower-floor plan edit target. IMAGE2 is owner's circled table reference only. Change ONLY the dining table and its chairs in the large RIGHT room. Required EXACT chair count: TWELVE separate countable chairs along LEFT long side, TWELVE along RIGHT long side, ONE at TOP short end facing kitchen, ONE at BOTTOM short end facing windows = EXACTLY TWENTY SIX TOTAL. No extra chairs or stools. Shorten the table ONLY FROM THE TOP / KITCHEN-ISLAND SIDE so the top end moves DOWNWARD, leaving visibly MORE OPEN FLOOR GAP between island and dining table. Keep table centerline and width unchanged, and keep its BOTTOM / WINDOW-SIDE end at its existing position. Keep chair size consistent, remove surplus chairs, distribute exactly12 each side at sensible even spacing; do not squeeze more chairs into unchanged length. Keep rug appropriately aligned with shorter table, plant centerpiece remains. Do not move the kitchen island or kitchen cabinetry. Absolutely preserve every other part of full plan, walls, staircases, windows, door swings, fireplace, beds and all room labels/sleep capacities exactly: Soverom1(3soveplasser),2(3),3(2),4(4),5(4), Bod by middle-left stair, Bad bathrooms, Sauna, Toalett, Gang, Teknisk rom, Terrasse. Keep current white label typography and all natural-material colors. Same full framing/scale, no cropping, no added annotation or red circle. Before finalizing count all26 chairs:12left+12right+1top+1bottom. Table's top end must be farther from kitchen island than before; bottom end remains anchored.

Final count correction prompt:

EXACT COUNT CORRECTION. This current supplied draft has ELEVEN sidechairs on the left and ELEVEN on the right, plus the two endchairs =24. Target is26. ADD EXACTLY ONE CHAIR TO EACH LONG SIDE, directly ABOVE the current first chair on each side. Existing11sidechairs on each side must remain fixed. Add the single new left chair centered approximately x1280,y404 and the single new right chair centered approximately x1380,y404, leaving all existing sidechairs at y425,446,468,489,510,531,552,574,596,619,642 untouched. Thus final each side has12centers:404,425,446,468,489,510,531,552,574,596,619,642. Extend the TABLETOP TOP edge upward about22pixels (from y415 to y393) to serve just these two new chairs. Move the single TOP ENDCHAIR upward22pixels to remain at new table head. Keep bottom table edge and bottom endchair fixed. Final exact count:12left+12right+1top+1bottom=26. Do not add2chairs per side or remove any existing chair. Do not redistribute/redraw current11chairs, only append one above. This still leaves much more kitchen-island clearance than the original long table. Preserve ALL other full-plan content and dimensions, every label and sleeping capacity, rooms, kitchen island, walls, furniture, windows, materials. No crop or annotations. Count carefully: there must be TWELVE separate white chairs on EACH side of table, not11 and not13.

## Sleeping capacities and matching labels, 29 October 2026

Updated all three plan PNGs with built-in imagegen. The small stair-side wall
in the Hems is removed, leaving the left stair entrance open. Main-floor rooms
are Soverom 5 (2 soveplasser) and Soverom 6 (3 soveplasser). Lower-floor rooms
1–5 respectively show 3, 3, 2, 4 and 4 soveplasser. The small room beside the
middle-left stair is now Bod; actual bathroom labels remain Bad. Main/lower
descriptions use clear white sans-serif lettering with the loft as size/style
reference. Owner references are `codex-clipboard-b8a8f6ee-a879-4a90-ae86-06610a6e83d1.png`,
`codex-clipboard-4488021b-b508-4c32-bad3-99a1d6366b20.png` and
`codex-clipboard-f350ad2d-4698-43d7-bdd2-ebfd061df645.png`.

Saved assets: `public/images/floor-plan-main.png`,
`public/images/floor-plan-lower.png`, `public/images/floor-plan-loft.png`.

Final hems wall-removal prompt:

Precise object removal edit. IMAGE1 is full current floor plan. IMAGE2 is owner reference: the RED CIRCLE marks the SHORT VERTICAL CHARCOAL WALL IMMEDIATELY LEFT OF THE SMALL STAIR IN THE ISOLATED UPPER-RIGHT HEMS. Remove that wall completely, from its top end to bottom junction (approximately x1298–1330, y277–354 in IMAGE1). Fill its former footprint with matching warm timber floor so the horizontally running small staircase opens freely at its LEFT end directly into the Hems. No post or dark wall remnant should block that left stair entrance. Keep the horizontal bottom exterior wall below the room; remove ONLY the short vertical internal stair-side obstruction. Keep all staircase treads VERTICAL on the page, same footprint, direction, count and material as now. Keep all other details exactly unchanged: isolated room outer top/left/right/bottom walls, Hems label, beanbags and rug; the entire main left connected plan, long stair and glass railing, all numbered bedroom and alcove labels, windows, furniture, doors, bathroom, floors. Same full image/canvas, no crop or zoom, no red marks. Only remove the circled small vertical stair-side wall and fill its footprint with wood floor.

Final main-floor labels prompt:

Use case: text-localization / precise typography edit. IMAGE1 is the MAIN FLOOR plan edit target. IMAGE2 is the LOFT PLAN TYPOGRAPHY REFERENCE ONLY; never copy any room geometry from it. IMAGE3 is owner red numbered location reference for the two main-floor bedrooms. Make TEXT-ONLY changes to IMAGE1. Replace bedroom label in large double-bed room at center-left marked5 with exact two-line 'Soverom 5' / '(2 soveplasser)'. Replace small bedroom label 'Sov' in top-right bunk room marked6 with exact two-line 'Soverom 6' / '(3 soveplasser)'. All other existing descriptions must remain verbatim but use the SAME clear sans-serif type and SAME RELATIVE VISIBLE FONT SIZE as room labels in IMAGE2. Since IMAGE1 is wider, use about 30–33px letter height on its roughly1900px canvas, so text is same visible size when plans are displayed at equal page width. Use legible white lettering with restrained dark outline/shadow like IMAGE2. Apply consistently to Bad, Sauna, WC, Skibod/Garasjebod, Gang, Bod, Spisestue, Stue/Kjøkken, Terrasse and all 'åpen himling' labels. Keep existing text positioning within original rooms, wrapping into lines where needed; don't add duplicate/new labels. Preserve every existing non-bedroom wording, including all åpen himling annotations. Critical: preserve original complete building, furniture, room layout, all walls/door swings/windows, stairs, bed shapes/counts, sauna/bathrooms, kitchen, dining seats, terrace, colors, materials, image framing and scale EXACTLY. No repainting or redesign. Only room label replacements and matching existing label typography. No red annotations in output. Full complete image, no crop.

Final lower-floor labels prompt:

Use case: text-localization / typography only. IMAGE1 is the LOWER FLOOR plan edit target. IMAGE2 is owner circled location reference only. IMAGE3 is loft plan TYPOGRAPHY STYLE reference only, do not copy layout. Update only text on IMAGE1: 'Soverom 1' gets a second line '(3 soveplasser)'; 'Soverom 2' second line '(3 soveplasser)'; 'Soverom 3' second line '(2 soveplasser)'; 'Soverom 4' second line '(4 soveplasser)'; 'Soverom 5' second line '(4 soveplasser)'. In the SMALL ROOM UNDER/ADJACENT TO THE MIDDLE-LEFT STAIR marked circled red in IMAGE2, replace label 'Bad' with 'Bod'. This is the tiny room directly above the hall corridor near x405,y265 in IMAGE1, NOT the actual large bathroom beside sauna and NOT the upper-center bathroom. Keep the other Bad labels unchanged. Match ALL plan descriptions and room labels to the same clearly readable white sans-serif lettering with subtle dark outline/shadow as IMAGE3. On the1723px-wide target use about27–28px label lettering so visible size is equivalent to reference loft when both shown at same page width. Apply this consistently to all existing labels Teknisk rom, Soverom1–5, Bod (both existing top-right storage and newly renamed small room), Bad (actual bathrooms), Sauna, Toalett, Gang, Terrasse and added parenthetical counts. Use line breaks to fit text safely inside each original room, no overlaps over walls. Absolutely preserve all geometry, beds and furniture footprints/counts, walls, door swings, windows, stairs, fixtures, kitchen/island, fireplace, sauna, terrace, all28diningchairs and materials/colors exactly as IMAGE1. No new labels or rooms, no resize/crop/zoom, full complete canvas. Red circle is a guide only, never show it.

## Stair entrance and hems direction, 29 October 2026

Built-in imagegen updated `public/images/floor-plan-loft.png` using owner marks
`codex-clipboard-9e74bca0-434d-4de7-ae2a-0364278bac05.png` and
`codex-clipboard-7b85c12d-f99a-4fdd-a23a-dc58b25655d3.png`.
Removed the short vertical wall at the long stair's left entrance, added two
matching treads in its former landing, retained the glass rail, and turned the
small hems stair's treads by 90 degrees to match the owner's reference.

Long stair correction prompt:

Use case: precise-object-edit. IMAGE1 is complete current loft floor plan edit target. IMAGE2 is owner red-marked cropped reference. Change ONLY the LEFT END OF THE LONG HORIZONTAL STAIR ABOVE ALKOVE 10. Remove the short CHARCOAL VERTICAL WALL SEGMENT marked red at its left entrance (roughly x468–493, y350–449 in IMAGE1), opening that end directly into the main hall. Replace the now-open left entrance/flat timber landing area with EXACTLY TWO ADDITIONAL wooden STAIR TREADS, extending the existing horizontal stair run leftward into that former entrance/landing area. These two added treads must have the same spacing, depth, wood material, top-down shading and vertical tread-line direction as the rest of the long stair. Existing stair treads must stay, so the completed long stair has two more treads than before. Do not add steps anywhere else. Keep the SHORT CLEAR GLASS RAIL at the bottom edge of this entrance/landing unchanged and visible; it is not the red-marked wall. Keep the long wall below the main stair/above the alcove unchanged. Preserve all remaining plan contents exactly: top bedrooms labelled 'Soverom 9 (2 soveplasser)' left and 'Soverom 8 (2 soveplasser)' right, four window groups, bathroom, doors, beds, sofa, table-tennis, 'Loft', 'Alkove 10 (4 soveplasser)', and complete separate upper-right 'Hems' with its walls and small stair. Same full canvas and framing, no crop, no scale change, no new marks. Owner red stroke is guide only, never render it. Only remove that short stair-entrance wall and add those two matching entrance treads.

Final hems stair direction prompt:

Use case: precise-object-edit. IMAGE1 is the complete current floor-plan image edit target. IMAGE2 is owner reference marking the correct TREAD DIRECTION of the SMALL STAIR IN THE ISOLATED UPPER-RIGHT HEMS. Change ONLY that small Hems stair: rotate its tread orientation NINETY DEGREES so tread lines run VERTICALLY on the page, side by side from left to right, exactly as owner's red strokes. The stair flight therefore runs HORIZONTALLY from the outside RIGHT toward the LEFT into the Hems, instead of running upward from bottom to top. Keep this stair within its SAME LOWER-RIGHT NOTCH footprint, same size/material. Its LEFT end must open naturally into Hems: remove only the blocking part of the short inner left notch wall if needed for that entrance, keeping the outer room perimeter otherwise unchanged. Preserve the Hems name, completed wood floor, two grey beanbags and white rug. Preserve the ENTIRE LARGE LEFT MAIN PLAN EXACTLY: the newly open wall-free left entrance and two extra treads of the LONG HORIZONTAL STAIR above Alkove 10, its short glass railing, Soverom 9 (2 soveplasser), Soverom 8 (2 soveplasser), Alkove 10 (4 soveplasser), all four window groups, bathroom, doorways, beds, sofa, table-tennis, and all other walls/text/floors. Absolutely do not rotate or change the long stair in the main plan. Only change the small Hems stair direction to match the owner reference. Keep full canvas and framing, same scale, no crop. No red marks in output.

## Completed hems and main stair, 29 October 2026

Updated `public/images/floor-plan-loft.png` with built-in imagegen, using the
owner's two additional marked references:
`codex-clipboard-18ca3275-8e36-47fa-8e09-043e1ae677df.png` and
`codex-clipboard-c0665675-fab0-42e2-b082-d36db889add0.png`.
The isolated upper-right room now has a complete floor, the marked right wall,
an access stair at its lower-right notch, and the label Hems. The main loft now
has the marked horizontal stair above Alcove 10 and a short glass landing rail.
Top bedrooms are labelled Soverom 9 (2 soveplasser), left, and Soverom 8
(2 soveplasser), right. The four window groups and alcove label are retained.
These owner corrections supersede the earlier interpretation of the scan gap.

Hems edit prompt:

Use case: precise-object-edit. IMAGE1 is the complete current loft floor-plan image to edit. IMAGE2 is the owner's enlarged red-marked reference of ONLY the isolated UPPER-RIGHT room. Correct ONLY that upper-right room according to the owner's marks. This room was incompletely reconstructed: replace its white diagonal missing interior wedge with continuous matching warm timber floor, completing the room interior. Complete the charcoal RIGHT exterior wall vertically downward exactly along the red vertical line, from the existing short top-right wall down to the red horizontal line at the top of the lower-right notch. Add the short horizontal charcoal wall segment at that red horizontal line, retaining an opening for access from the stairs. Add a neat realistic short STRAIGHT wooden staircase in the LOWER-RIGHT NOTCH where the red stair treads are drawn, visibly leading UP INTO the room and attached to its entrance, not floating; follow the marked stair footprint and tread direction, top-down architectural style, matching the warm wood and charcoal wall style. Retain the lower-right notch and existing bottom/left/top perimeter rather than making a bigger arbitrary room. Keep both grey beanbag chairs and the white animal-hide rug in their existing positions. Replace ONLY the label 'Loft' in this isolated upper-right room with 'Hems'. Absolutely no other changes: do not change the main left connected plan, any bedroom, bathroom, sofa, table tennis table, windows, walls, doorways, any labels there including 'Loft' and 'Alkove 10 (4 soveplasser)'. Keep all FOUR current window groups intact. Keep isolated room in the SAME place and scale relative to full image. Preserve full canvas framing, white outside background, no cropping. Red marks are guides only, must not be visible in output. Complete the walls, floor and stairs as requested; do not preserve the earlier erroneous diagonal scan gap.

Final main stair and bedroom label prompt:

Use case: precise-object-edit and text-localization. IMAGE1 is the complete latest plan edit target, already containing the corrected isolated UPPER-RIGHT Hems with its completed floor, walls and small stair. KEEP that Hems untouched. IMAGE2 is owner's red marked cropped reference for the MAIN LEFT connected plan only. Make these precise additional corrections: 1) Add a straight WOODEN STAIR FLIGHT in the white horizontal band DIRECTLY ABOVE the projecting Alcove 10, following the row of red vertical stair treads drawn in IMAGE2. The stair runs horizontally left/right above that alcove's upper wall, with its left end joining the existing hall/landing below the two top bedrooms. The treads are vertical lines across the horizontal stair run, matching red sketch. In IMAGE1 this footprint is approximately x490–880, y345–415. Do not put these stairs inside the alcove beds or inside either bedroom. 2) The SHORT LOWER HORIZONTAL RED LINE in IMAGE2 near the left end of that stair flight is a GLASS BALUSTRADE, not a solid wall. Render a clear glass safety railing with slim posts and pale subtle blue reflections along exactly that marked short landing edge (approximately x490–580 around y420 in IMAGE1), so floor behind it remains visible. Do not replace the entire alcove exterior wall or the bedroom partition with glass. 3) Replace label in LEFT TOP BEDROOM with exact two-line 'Soverom 9' / '(2 soveplasser)'. Replace label in RIGHT TOP BEDROOM with exact two-line 'Soverom 8' / '(2 soveplasser)'. Clean readable matching type. Preserve room contents, doorways, walls, all four current window groups, bed count and positions, bathroom fixtures, sofa, table-tennis, 'Loft' in living room, 'Alkove 10 (4 soveplasser)' unchanged. Preserve isolated upper-right Hems including its new small stair and room label completely. Same warm wood/grey realistic top-down architectural rendering. Full complete image, same framing/scale/canvas, no crop and no red drawing marks. The only changes are the additional horizontal stair above alcove, short clear-glass landing railing, and the two bedroom labels.

## Additional alcove window and room label, 29 October 2026

The owner marked an additional window on the upper part of the sleeping alcove's
right exterior wall in `codex-clipboard-326ad7a4-fcdf-4bdd-a4cb-d23db52a0cc6.png`.
Built-in imagegen added that window and replaced the alcove's Loft label with
`Alkove 10 (4 soveplasser)`, while retaining the three earlier window groups.
The updated complete plan is saved at `public/images/floor-plan-loft.png`.

Final edit prompt:

Use case: precise-object-edit and text-localization. IMAGE1 is the current complete loft floor plan edit target. IMAGE2 is the owner's red-marked location reference only. Make ONLY TWO changes: (1) Add ONE small window in the RIGHT EXTERIOR VERTICAL WALL of the projecting sleeping alcove at middle right of the main left plan volume, near the UPPER end of that wall as marked red in IMAGE2 (roughly x855–880, y455–505 in IMAGE1). The window must be on the vertical RIGHT wall, not the top horizontal wall. Match existing slim white/light grey frames and pale blue glazing. (2) Replace ONLY the word 'Loft' inside that projecting alcove containing the four sleeping places with the exact readable dark/white outlined label 'Alkove 10' on line one and '(4 soveplasser)' on line two. Use small clean sans serif matching existing room labels, centered so bed shapes remain legible. Do not change 'Loft' in the living/table-tennis room or the isolated upper-right lounge. CRITICAL KEEP ALL THREE EXISTING WINDOW GROUPS: two windows on top bedroom walls and wide three-pane window along bottom loft living room wall. Preserve entire image, full framing, scale and dimensions, all wall outlines, doors, beds, bathroom fixtures, sofa, table tennis, upper-right isolated lounge, triangle white gap, all other text, colors and materials. Do not add/remove any other features or crop anything. Remove reference red circle; it is only a guide. Output the full complete plan with only this extra small right-wall window and this alcove label change.

## Owner window correction, 29 October 2026

Updated `public/images/floor-plan-loft.png` using built-in imagegen and the
owner's red-marked reference `codex-clipboard-34d4596e-2a4a-43b7-9304-5a1ff4892c8b.png`.
Added two separate windows in the top bedroom exterior walls near the central
partition, plus one broad three-pane window in the bottom loft living-room wall.
The full plan and isolated upper-right lounge are retained. The previous image
is recoverable from Git. No API/CLI fallback was used.

Final edit prompt:

Use case: precise-object-edit. IMAGE1 is the full loft floor-plan image to edit. IMAGE2 is the owner's cropped red-marked location reference ONLY. Add windows ONLY at the THREE indicated positions. (1) In the TOP exterior wall of the LEFT top bedroom, close to the central bedroom dividing wall, roughly x245–305 at y95–120 in IMAGE1. (2) In the TOP exterior wall of the RIGHT top bedroom, close to the central dividing wall on that room's left side, roughly x335–400 at y95–120. These are TWO SEPARATE windows, with the solid central partition between. (3) A broad horizontal glazed window assembly in the BOTTOM exterior wall of the long LEFT loft living room, roughly x210–495 at y865–890 in IMAGE1. Use realistic slim white/light-grey frames and subtle pale blue glass in top-down architectural cutaway style, integrated into those wall thicknesses. Bottom broad glazing may have vertical mullions, keep all panes inside that single marked wide opening. VERY IMPORTANT: preserve the entire complete IMAGE1 including the separate upper-right lounge exactly as is. Do not crop, zoom, resize the canvas, change plan scale, repaint floors, move walls or doors, add/remove furniture, change beds, change bathroom fixtures, change text, change rug, change triangle gap, add any other windows or alter any other details. Keep original image dimensions and framing. IMAGE2 red marks are guides only and must NOT appear in output. The only intended differences from IMAGE1 are the two top bedroom windows and one bottom wide window.

## Initial three-floor implementation

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

## Loftstua, shorter mattresses and sofa clearance, 30 October 2026

Updated `public/images/floor-plan-loft.png` and `public/images/floor-plan-loft-en.png` using the built-in image-generation edit tool. Both coffee tables now have a small strip of floor separating them from the sofa. Four alcove mattresses are shorter, with their foot ends retained. Norwegian living-room label is now `Loftstua`; English remains `Loft lounge`. Inspected both complete output images for preserved rooms, windows, stairs and labels.

Norwegian output: `exec-99030dc5-5c3c-482a-81e1-4220cd32f39c.png`.
English output: `exec-4065cd8c-ae5d-458e-8bf3-9306db58799f.png`.

Exact Norwegian prompt:

```text
Use case: precise-object-edit. IMAGE1 is the complete current loft plan edit target. IMAGE2 is owner red outline reference for SHORTER MATTRESSES in Alcove10. IMAGE3 is owner reference for TWO COFFEE TABLES TOO CLOSE TO SOFA. Make ONLY these requested edits: A) In projecting sleeping Alcove10, keep exactlyFOURdistinct single mattress shapes, same widths and side-by-side order, but shorten all four by about15–20percent to match owner's red outlines. Keep their bottom/foot ends anchored at existing position near lower wall (aroundy653 in full plan), pull their upper/head ends DOWNWARD about25pixels (fromaroundy498 toaroundy523), exposing more wood floor at upper side of alcove. Retain bedding/pillows and4sleepingplaces, do not alter alcove walls/windows/label. B) Move BOTH small square wood coffee tables beside the long sofa horizontally RIGHT by onlyabout18–22pixels in the full plan. Same table sizes, same vertical positions and spacing between tables; create a small clear strip of visible floor between sofa edge and table edges, enough for sitting comfortably, not a wide gap. Do NOT move or resize sofa, table-tennis, walls or any other furniture. Keep tables well clear of table-tennis. C) Replace only living-room label 'Loft' with 'Loftstua'. Position this label in nearby clear floor space slightly above the upper coffee table if necessary so it does not overlap sofa/tables/table-tennis. Preserve exact other Norwegian labels 'Soverom 9 (2 soveplasser)', 'Soverom 8 (2 soveplasser)', 'Bad', 'Alkove 10 (4 soveplasser)', 'Hems'. Keep currentfontfamily/size. All other full-plan geometry, room dimensions, numbered rooms, beds outside alcove, bathroom fixtures, four window groups, both staircases, short clear glass railing, complete isolated upper-right room with open left stair entrance and horizontally running small stair, labels and materials remain unchanged. Same full canvas/framing, no crop/zoom/resize, no red marks, no new objects. Only shorter alcove mattresses, small rightward coffee-table offsets and indicated living-room label change.
```

Exact English prompt:

```text
Use case: precise-object-edit. IMAGE1 is the complete current loft plan edit target. IMAGE2 is owner red outline reference for SHORTER MATTRESSES in Alcove10. IMAGE3 is owner reference for TWO COFFEE TABLES TOO CLOSE TO SOFA. Make ONLY these requested edits: A) In projecting sleeping Alcove10, keep exactlyFOURdistinct single mattress shapes, same widths and side-by-side order, but shorten all four by about15–20percent to match owner's red outlines. Keep their bottom/foot ends anchored at existing position near lower wall (aroundy653 in full plan), pull their upper/head ends DOWNWARD about25pixels (fromaroundy498 toaroundy523), exposing more wood floor at upper side of alcove. Retain bedding/pillows and4sleepingplaces, do not alter alcove walls/windows/label. B) Move BOTH small square wood coffee tables beside the long sofa horizontally RIGHT by onlyabout18–22pixels in the full plan. Same table sizes, same vertical positions and spacing between tables; create a small clear strip of visible floor between sofa edge and table edges, enough for sitting comfortably, not a wide gap. Do NOT move or resize sofa, table-tennis, walls or any other furniture. Keep tables well clear of table-tennis. C) Keep living room English label 'Loft lounge', placing it in nearby clear floor space slightly above upper coffee table only if needed to avoid overlap after table shift. Preserve exact English labels 'Bedroom 9 (Sleeps 2)', 'Bedroom 8 (Sleeps 2)', 'Bathroom', 'Sleeping alcove 10 (Sleeps 4)', 'Mezzanine'. Keep currentfontfamily/size. All other full-plan geometry, room dimensions, numbered rooms, beds outside alcove, bathroom fixtures, four window groups, both staircases, short clear glass railing, complete isolated upper-right room with open left stair entrance and horizontally running small stair, labels and materials remain unchanged. Same full canvas/framing, no crop/zoom/resize, no red marks, no new objects. Only shorter alcove mattresses, small rightward coffee-table offsets and indicated living-room label change.
```
