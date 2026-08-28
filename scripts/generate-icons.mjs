import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const OUT_DIR = fileURLToPath(new URL('../public/icons/', import.meta.url));
mkdirSync(OUT_DIR, { recursive: true });

// Standard icon: rounded-square background, mark scaled to fill most of it.
// Mirrors the favicon's "ledger smile + coin" mark, at icon scale.
function standardSvg(size) {
  const r = size * 0.22;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="${r}" fill="#372B3F"/>
  <circle cx="256" cy="208" r="72" fill="#F3E1E1"/>
  <circle cx="256" cy="208" r="72" fill="none" stroke="#B9707E" stroke-width="6"/>
  <path d="M146 300c22 34 64 54 110 54s88-20 110-54" stroke="#B9707E" stroke-width="22" fill="none" stroke-linecap="round"/>
</svg>`;
}

// Maskable icon: the OS crops this to a circle/rounded-shape at render time,
// so all meaningful content must sit inside the ~80% "safe zone" — background
// goes edge-to-edge with no baked-in corner radius.
function maskableSvg() {
  return `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#372B3F"/>
  <circle cx="256" cy="228" r="58" fill="#F3E1E1"/>
  <circle cx="256" cy="228" r="58" fill="none" stroke="#B9707E" stroke-width="5"/>
  <path d="M172 306c18 27 51 43 88 43s70-16 88-43" stroke="#B9707E" stroke-width="18" fill="none" stroke-linecap="round"/>
</svg>`;
}

async function main() {
  await sharp(Buffer.from(standardSvg(512))).png().toFile(OUT_DIR + 'icon-512.png');
  await sharp(Buffer.from(standardSvg(192))).resize(192, 192).png().toFile(OUT_DIR + 'icon-192.png');
  await sharp(Buffer.from(maskableSvg())).png().toFile(OUT_DIR + 'icon-512-maskable.png');
  await sharp(Buffer.from(standardSvg(180))).resize(180, 180).png().toFile(OUT_DIR + 'apple-touch-icon.png');
  console.log('Icons generated in public/icons/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
