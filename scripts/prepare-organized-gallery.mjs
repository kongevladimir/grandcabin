import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source = process.argv[2];
if (!source) throw new Error('Pass the GRAND CABIN Pictures source directory.');
const destination = path.resolve('public/images/organized-gallery');
await mkdir(destination, { recursive: true });
const groups = [['cabin', 'Hytta utvendig 1'], ['living', 'Living space 1'], ['bedrooms', 'Bedroom 1']];
const photos = [];
for (const [category, folder] of groups) {
  const files = (await readdir(path.join(source, folder))).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  files.sort((a, b) => {
    const numberA = Number.parseFloat(a.replace(',', '.'));
    const numberB = Number.parseFloat(b.replace(',', '.'));
    return Number.isFinite(numberA) && Number.isFinite(numberB) ? numberA - numberB : a.localeCompare(b, 'nb', { numeric: true });
  });
  for (const [index, file] of files.entries()) {
    const id = `${category}-${String(index + 1).padStart(2, '0')}`;
    const original = `${id}${path.extname(file).toLowerCase()}`;
    const preview = `${id}-preview.webp`;
    const input = path.join(source, folder, file);
    await copyFile(input, path.join(destination, original));
    const metadata = await sharp(input, { limitInputPixels: false }).metadata();
    const { info } = await sharp(input, { limitInputPixels: false }).autoOrient().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 96 }).toFile(path.join(destination, preview)).then(info => ({ info }));
    photos.push({ id, category, file, original: `/images/organized-gallery/${original}`, preview: `/images/organized-gallery/${preview}`, width: info.width, height: info.height, originalWidth: metadata.width, originalHeight: metadata.height });
  }
  console.log(`${category}: ${files.length} original photos preserved`);
}
await writeFile('src/content/organized-gallery.json', JSON.stringify(photos, null, 2) + '\n');
console.log(`Prepared ${photos.length} photos. Full-screen files are unchanged originals.`);
