# Organized gallery

The gallery uses 66 owner photographs from GRAND CABIN Pictures: 15 from Hytta utvendig 1, 41 from Living space 1, and 10 from Bedroom 1. All preserves that group order. Within each folder, numbered filenames sort naturally (including comma decimals); other filenames sort alphabetically.

Full-screen viewing uses exact copies of the source files without resizing, recompression or image edits. Only grid previews are generated separately at up to 1600 pixels per edge, WebP quality 96. Full-screen images use contain so the complete photo remains visible.

Regenerate the local copies, previews and manifest with:

```powershell
node scripts/prepare-organized-gallery.mjs 'C:\Users\kalaj\OneDrive\Desktop\GRAND CABIN Pictures'
```

The original copies total about 2.43 GB. Several individual images exceed GitHub's 100 MB file limit and Cloudflare static asset limits. They remain locally available and are excluded from Git; previews and the manifest are tracked. Before publishing this gallery with unchanged original quality, upload the original files to suitable photo/object storage and update the manifest original URLs. Do not silently resize or recompress the originals to meet deployment limits.
