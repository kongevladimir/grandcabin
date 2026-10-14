import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const source = process.argv[2];
if (!source) throw new Error('Pass the original sauna photograph.');
const original = await readFile(source);
const metadata = await sharp(source, { limitInputPixels: false }).metadata();
const base = '/images/suites-updated/private-sauna-original';
const originalParts = [];
const hash = createHash('sha256');
const pieceSize = 20 * 1024 * 1024;
for (let offset = 0, index = 0; offset < original.length; offset += pieceSize, index++) {
  const url = `${base}-${String(index).padStart(2, '0')}.bin`;
  await writeFile(`public${url}`, original.subarray(offset, offset + pieceSize));
  hash.update(await readFile(`public${url}`));
  originalParts.push(url);
}
const originalSha256 = createHash('sha256').update(original).digest('hex');
if (hash.digest('hex') !== originalSha256) throw new Error('Original photo bytes changed.');
const preview = '/images/suites-updated/private-sauna-preview.webp';
// A separate loading preview; the displayed original is never resized or re-encoded.
await sharp(source, { limitInputPixels: false }).autoOrient().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 96 }).toFile(`public${preview}`);
await writeFile('src/content/private-sauna-photo.json', JSON.stringify({ original: preview, preview, originalParts, originalMime: 'image/jpeg', originalSha256, originalWidth: metadata.width, originalHeight: metadata.height }, null, 2) + '\n');
console.log(`Original preserved: ${metadata.width} x ${metadata.height}, ${original.length} bytes, ${originalParts.length} pieces.`);
