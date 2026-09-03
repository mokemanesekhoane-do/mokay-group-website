/* Generates the Mokay Group website QR codes as SVG.
   Usage: node gen-qr.js <site-dir> [url]
*/
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const DIR = process.argv[2];
const URL = process.argv[3] || 'https://www.mokaygroup.co.za/';

const NAVY = '#2E3192';
const ORANGE = '#E95A29';
const QZ = 4;            // quiet zone, in modules — 4 is the spec minimum
const R = 0.30;          // module corner radius, as a fraction of a module

const qr = QRCode.create(URL, { errorCorrectionLevel: 'H' });
const N = qr.modules.size;
const data = qr.modules.data;
const SIZE = N + QZ * 2;
const at = (x, y) => data[y * N + x] === 1;

// the three finder patterns occupy 7x7 at these origins; we draw them ourselves
const finders = [[0, 0], [N - 7, 0], [0, N - 7]];
const inFinder = (x, y) => finders.some(([fx, fy]) =>
  x >= fx && x < fx + 7 && y >= fy && y < fy + 7);

// centre logo footprint — kept small; error correction H tolerates ~30% loss
const LOGO = 9;
const L0 = Math.floor((N - LOGO) / 2);
const inLogo = (x, y) => x >= L0 && x < L0 + LOGO && y >= L0 && y < L0 + LOGO;

function modules({ skipFinders = true, skipLogo = true, radius = R, colour = NAVY }) {
  let d = '';
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!at(x, y)) continue;
      if (skipFinders && inFinder(x, y)) continue;
      if (skipLogo && inLogo(x, y)) continue;
      const px = x + QZ, py = y + QZ;
      d += radius
        ? `<rect x="${px}" y="${py}" width="1" height="1" rx="${radius}"/>`
        : `<rect x="${px}" y="${py}" width="1" height="1"/>`;
    }
  }
  return `<g fill="${colour}">${d}</g>`;
}

function finderMarks() {
  return finders.map(([fx, fy]) => {
    const x = fx + QZ, y = fy + QZ;
    return `<g>
      <rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" rx="1.9"
            fill="none" stroke="${NAVY}" stroke-width="1"/>
      <rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="0.95" fill="${ORANGE}"/>
    </g>`;
  }).join('');
}

// the real brand mark, nested from favicon.svg (logo cropped to the mark)
function markSVG(x, y, size) {
  const src = fs.readFileSync(path.join(DIR, 'assets', 'favicon.svg'), 'utf8');
  const viewBox = (src.match(/viewBox="([^"]+)"/) || [])[1];
  const inner = src
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
  // no overflow="visible" — the nested viewport must clip to the viewBox so only
  // the mark shows. Browsers clip by default, but print RIPs and vector editors
  // will honour an explicit visible and bleed the wordmark across the symbol.
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${viewBox}">${inner}</svg>`;
}

function branded() {
  const pad = 0.9;
  const lx = L0 + QZ, ly = L0 + QZ;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"
     width="1000" height="1000" shape-rendering="geometricPrecision"
     role="img" aria-label="QR code linking to ${URL}">
  <title>Mokay Group of Companies — ${URL}</title>
  <rect width="${SIZE}" height="${SIZE}" rx="2" fill="#FFFFFF"/>
${modules({})}
${finderMarks()}
  <rect x="${lx - pad}" y="${ly - pad}" width="${LOGO + pad * 2}" height="${LOGO + pad * 2}"
        rx="2.2" fill="#FFFFFF"/>
  ${markSVG(lx + 0.6, ly + 0.6, LOGO - 1.2)}
</svg>
`;
}

function plain() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"
     width="1000" height="1000" shape-rendering="crispEdges"
     role="img" aria-label="QR code linking to ${URL}">
  <title>Mokay Group of Companies — ${URL}</title>
  <rect width="${SIZE}" height="${SIZE}" fill="#FFFFFF"/>
${modules({ skipFinders: false, skipLogo: false, radius: 0, colour: '#000000' })}
</svg>
`;
}

fs.writeFileSync(path.join(DIR, 'assets', 'qr-code.svg'), branded());
fs.writeFileSync(path.join(DIR, 'assets', 'qr-code-plain.svg'), plain());

let dark = 0;
for (let i = 0; i < data.length; i++) if (data[i] === 1) dark++;
console.log(`URL           ${URL}`);
console.log(`version       ${qr.version}  (${N}x${N} modules, EC level H)`);
console.log(`quiet zone    ${QZ} modules`);
console.log(`logo covers   ${LOGO}x${LOGO} = ${(LOGO * LOGO / (N * N) * 100).toFixed(1)}% of the symbol (H tolerates ~30%)`);
console.log(`dark modules  ${dark}`);
console.log(`written       assets/qr-code.svg, assets/qr-code-plain.svg`);
