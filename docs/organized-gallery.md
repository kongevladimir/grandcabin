# Organized gallery

The gallery uses 66 owner photographs from GRAND CABIN Pictures: 15 from Hytta utvendig 1, 41 from Living space 1, and 10 from Bedroom 1. All preserves that group order. Within each folder, numbered filenames sort naturally (including comma decimals); other filenames sort alphabetically.

Full-screen viewing uses exact copies of the source files without resizing or recompression, except for the owner-requested sunny ski edit described below. Only grid previews are generated separately at up to 1600 pixels per edge, WebP quality 96. Full-screen images use contain so the complete photo remains visible. Filters follow the site language: Alle, Hytta, Oppholdsrom, Soverom in Norwegian; All, Cabin, Living space, Bedrooms in English.

## Sunny ski photo

The owner requested clearer sunny weather and a blue sky for `8,5.jpg` (cabin-11). The built-in imagegen tool produced `public/images/organized-gallery/cabin-11-sunny.png`, saved without further resizing or compression. Its output is 1448 × 1086; the unchanged 4032 × 3024 source remains locally preserved as cabin-11.jpg. The preparation script retains this explicit edit when rebuilding the manifest and previews.

Final prompt (built-in tool):

> Use case: lighting-weather. Edit target: the attached original skiing photograph for a premium cabin website gallery. Replace the grey overcast foggy weather with clear sunny winter weather and a natural blue sky. Remove mist to make existing trees and snow clearer; add realistic sunlight and restrained soft blue snow shadows. Keep the same skier, exact airborne pose, face, helmet, goggles, blue-black jacket, orange trousers, skis, distant people, trees, slope, snow tracks, poles and their positions. Preserve the original 4:3 framing with no crop. Photographic realism, crisp natural detail, no excessive HDR, no new mountains or objects, no text. Deliver the highest supported resolution, ideally 4032x3024, to retain detailed high-quality gallery viewing.

Regenerate the local copies, previews and manifest with:

```powershell
node scripts/prepare-organized-gallery.mjs 'C:\Users\kalaj\OneDrive\Desktop\GRAND CABIN Pictures'
```

The original copies total about 2.43 GB. Several individual images exceed GitHub's 100 MB file limit and Cloudflare static asset limits. They remain locally available and are excluded from Git; previews and the manifest are tracked. Before publishing this gallery with unchanged original quality, upload the original files to suitable photo/object storage and update the manifest original URLs. Do not silently resize or recompress the originals to meet deployment limits.
