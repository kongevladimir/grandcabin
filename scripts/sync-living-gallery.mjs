import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

// Refresh this category only; reuse unchanged originals already hosted by the site.
const source = process.argv[2];
if (!source) throw new Error('Pass the sorted Living space 1 folder.');
const manifestPath = 'src/content/organized-gallery.json';
const photos = JSON.parse(await readFile(manifestPath, 'utf8'));
const existing = new Map(photos.filter(photo => photo.category === 'living').map(photo => [photo.originalSha256, photo]));
const files = (await readdir(source)).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
files.sort((a, b) => a.localeCompare(b, 'nb', { numeric: true }));
if (!files.length) throw new Error('No photos found; gallery was not changed.');
const living = [];
const pieceSize = 20 * 1024 * 1024;
for (const file of files) {
  const bytes = await readFile(path.join(source, file));
  const hash = createHash('sha256').update(bytes).digest('hex');
  const previous = existing.get(hash);
  if (previous) {
    living.push({ ...previous, file });
    continue;
  }
  const id = `living-${hash.slice(0, 12)}`;
  const extension = path.extname(file).toLowerCase();
  const preview = `/images/organized-gallery/${id}-preview.webp`;
  const metadata = await sharp(bytes, { limitInputPixels: false }).metadata();
  const info = await sharp(bytes, { limitInputPixels: false }).autoOrient()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 96 }).toFile(`public${preview}`);
  const originalParts = [];
  let original = `/images/gallery-originals/${id}${extension}`;
  if (bytes.length <= pieceSize) {
    await writeFile(`public${original}`, bytes);
  } else {
    for (let offset = 0, index = 0; offset < bytes.length; offset += pieceSize, index++) {
      const url = `/images/gallery-originals/${id}-${String(index).padStart(2, '0')}.bin`;
      await writeFile(`public${url}`, bytes.subarray(offset, offset + pieceSize));
      originalParts.push(url);
    }
    original = preview;
  }
  const saved = originalParts.length
    ? Buffer.concat(await Promise.all(originalParts.map(url => readFile(`public${url}`))))
    : await readFile(`public${original}`);
  if (createHash('sha256').update(saved).digest('hex') !== hash) throw new Error(`Original changed: ${file}`);
  living.push({ id, category: 'living', file, original, preview, width: info.width, height: info.height,
    originalWidth: metadata.width, originalHeight: metadata.height,
    originalMime: metadata.format === 'png' ? 'image/png' : metadata.format === 'webp' ? 'image/webp' : 'image/jpeg',
    originalSha256: hash, originalParts });
  console.log(`Added ${file}: original ${metadata.width} × ${metadata.height}, ${bytes.length} bytes preserved`);
}
const updated = [...photos.filter(photo => photo.category === 'cabin'), ...living, ...photos.filter(photo => photo.category === 'bedrooms')];
await writeFile(manifestPath, JSON.stringify(updated, null, 2) + '\n');
console.log(`Living space: ${living.length} photos in filename order; other categories unchanged.`);
