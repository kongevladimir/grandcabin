import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Byte pieces preserve every original byte while fitting static-host file limits.
const pieceSize = 20 * 1024 * 1024;
const manifestPath = 'src/content/organized-gallery.json';
const photos = JSON.parse(await readFile(manifestPath, 'utf8'));
const output = 'public/images/gallery-originals';
await mkdir(output, { recursive: true });
let total = 0;
for (const photo of photos) {
  const extension = path.extname(photo.original);
  const input = photo.id === 'cabin-11' ? 'cabin-11-sunny.png' : `${photo.id}${extension}`;
  const bytes = await readFile(path.join('public/images/organized-gallery', input));
  photo.originalMime = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
  photo.originalSha256 = createHash('sha256').update(bytes).digest('hex');
  if (bytes.length <= pieceSize) {
    await writeFile(path.join(output, input), bytes);
    photo.original = `/images/gallery-originals/${input}`;
    photo.originalParts = [];
  } else {
    photo.originalParts = [];
    const reconstructed = createHash('sha256');
    for (let offset = 0, index = 0; offset < bytes.length; offset += pieceSize, index++) {
      const name = `${photo.id}-${String(index).padStart(2, '0')}.bin`;
      await writeFile(path.join(output, name), bytes.subarray(offset, offset + pieceSize));
      reconstructed.update(await readFile(path.join(output, name)));
      photo.originalParts.push(`/images/gallery-originals/${name}`);
    }
    if (reconstructed.digest('hex') !== photo.originalSha256) throw new Error(`Original changed: ${photo.id}`);
    photo.original = photo.preview;
  }
  total += bytes.length;
  console.log(`${photo.id}: ${bytes.length} bytes preserved, ${photo.originalParts.length || 1} static files`);
}
await writeFile(manifestPath, JSON.stringify(photos, null, 2) + '\n');
console.log(`Verified ${photos.length} photos, ${total} exact original bytes.`);
