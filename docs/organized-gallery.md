# Organized gallery

The gallery uses 67 owner photographs from GRAND CABIN Pictures: 15 from Hytta utvendig 1, 42 from Living space 1, and 10 from Bedroom 1. All preserves that group order. Within each folder, numbered filenames sort naturally (including comma decimals); other filenames sort alphabetically. On 16 October 2026, Living space 1 was refreshed to match the owner's numbered selection, from 01.jpg through 38.jpg including numbered variants. Unchanged photos retain their existing asset IDs and original bytes; removed selections no longer appear in the gallery.

Full-screen viewing uses exact copies of the source files without resizing or recompression, except for the owner-requested sunny ski edit described below. Only grid previews are generated separately at up to 1600 pixels per edge, WebP quality 96. Full-screen images use contain so the complete photo remains visible. Filters follow the site language: Alle, Hytta, Oppholdsrom, Soverom in Norwegian; All, Cabin, Living space, Bedrooms in English.

## Sunny ski photo

The owner requested clearer sunny weather and a blue sky for `8,5.jpg` (cabin-11). The built-in imagegen tool produced `public/images/organized-gallery/cabin-11-sunny.png`, saved without further resizing or compression. Its output is 1448 × 1086; the unchanged 4032 × 3024 source remains locally preserved as cabin-11.jpg. The preparation script retains this explicit edit when rebuilding the manifest and previews.

Final prompt (built-in tool):

> Use case: lighting-weather. Edit target: the attached original skiing photograph for a premium cabin website gallery. Replace the grey overcast foggy weather with clear sunny winter weather and a natural blue sky. Remove mist to make existing trees and snow clearer; add realistic sunlight and restrained soft blue snow shadows. Keep the same skier, exact airborne pose, face, helmet, goggles, blue-black jacket, orange trousers, skis, distant people, trees, slope, snow tracks, poles and their positions. Preserve the original 4:3 framing with no crop. Photographic realism, crisp natural detail, no excessive HDR, no new mountains or objects, no text. Deliver the highest supported resolution, ideally 4032x3024, to retain detailed high-quality gallery viewing.

Refresh only the owner's sorted living-space selection without rebuilding the other categories:

```powershell
node scripts/sync-living-gallery.mjs 'C:\Users\kalaj\OneDrive\Desktop\GRAND CABIN Pictures\Living space 1'
```

This reuses hosted originals by SHA-256, preserves the new originals byte for byte, and generates only the new grid previews. It updates both Oppholdsrom and that category's section in Alle.

For a deliberate complete rebuild of all three categories, regenerate local copies, previews and manifest with:

```powershell
node scripts/prepare-organized-gallery.mjs 'C:\Users\kalaj\OneDrive\Desktop\GRAND CABIN Pictures'
node scripts/prepare-gallery-static-originals.mjs
```

## Publishing without R2

The original copies total about 2.43 GB. Several individual images exceed GitHub's 100 MB file limit and Cloudflare's 25 MiB static asset limit. `prepare-gallery-static-originals.mjs` copies small originals directly to `public/images/gallery-originals` and divides larger originals into pieces of at most 20 MiB. Every byte is preserved. SHA-256 hashes verify the assembled pieces against the source file. This folder is tracked and deployed using the existing Cloudflare static hosting; no R2 subscription is needed.

The full-screen viewer downloads these pieces only when a visitor opens that photograph, joins them into an image Blob of the original file type, and releases it when the viewer closes or changes photos. A preview remains visible while loading. The original resolution, embedded color profile and compression are untouched. Very large originals can take longer to load and use more browser memory. No original is silently resized or recompressed.

GitHub limits each push to 2 GiB. Publish the asset commits in batches to a temporary staging branch, then push the completed main branch after the assets are present remotely. Monitor the existing Workers Builds: grandcabin check for the final main commit.
