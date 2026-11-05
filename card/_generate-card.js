/* Generates the digital business cards from card/_people.json.

   For each person it writes three files:
     card/<slug>.html          the page, from card/_template.html
     assets/qr-<slug>.svg      a QR encoding the person's vCard
     assets/<slug>.vcf         the same contact as a downloadable file

   Usage:
     npm install qrcode        (in a scratch folder — not in the site)
     node card/_generate-card.js

   Add someone by adding an entry to card/_people.json and running it again.
   Existing cards are rewritten, so the manifest stays the source of truth.

   Why the QR and the .vcf differ: the QR deliberately omits the postal
   address. Including it pushes the symbol from 61 to 69 modules, and the
   address is the least useful field to carry into a phone's contacts — it is
   on the card as copyable text instead. The downloadable .vcf has no size
   constraint, so it carries everything.
*/
const fs = require('fs');
const path = require('path');

let QRCode;
try {
  QRCode = require('qrcode');
} catch (e) {
  console.error('Missing dependency. Run:  npm install qrcode\n' +
                '(install it in a scratch folder, not in the site)');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '_people.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, '_template.html'), 'utf8');
const ORG = manifest.org;

const NAVY = '#2E3192';
const ORANGE = '#E95A29';
const QZ = 4;      // quiet zone in modules — 4 is the spec minimum
const RX = 0.3;    // module corner radius

/* ---- vCard ---------------------------------------------------------- */
/* RFC 2426 requires CRLF line endings; some importers are strict about it. */
function vcard(person, withAddress) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${person.last};${person.first};;;`,
    `FN:${person.first} ${person.last}`,
    `ORG:${ORG.name}`,
    `TITLE:${person.role}`,
    `TEL;TYPE=CELL,VOICE:${e164(person.phone)}`,
    `EMAIL;TYPE=WORK,INTERNET:${person.email}`,
    `URL:${ORG.url}`
  ];
  if (withAddress) {
    lines.push(`ADR;TYPE=WORK:;;${ORG.street};${ORG.city};;;${ORG.country}`);
  }
  lines.push('END:VCARD');
  // No trailing CRLF here — it is two wasted bytes inside the QR, and it would
  // stop the QR payload matching the .vcf line-for-line. The file write adds it.
  return lines.join('\r\n');
}

const e164 = phone => phone.replace(/[^\d+]/g, '');

/* ---- QR ------------------------------------------------------------- */
function qrSvg(payload, label) {
  const qr = QRCode.create(payload, { errorCorrectionLevel: 'M' });
  const N = qr.modules.size;
  const data = qr.modules.data;
  const SIZE = N + QZ * 2;
  const at = (x, y) => data[y * N + x] === 1;

  const finders = [[0, 0], [N - 7, 0], [0, N - 7]];
  const inFinder = (x, y) => finders.some(([fx, fy]) =>
    x >= fx && x < fx + 7 && y >= fy && y < fy + 7);

  let rects = '';
  let dark = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!at(x, y) || inFinder(x, y)) continue;
      dark++;
      rects += `<rect x="${x + QZ}" y="${y + QZ}" width="1" height="1" rx="${RX}"/>`;
    }
  }

  /* Finder patterns: navy ring, orange centre — matching the site's own QR. */
  let eyes = '';
  for (const [fx, fy] of finders) {
    const X = fx + QZ, Y = fy + QZ;
    eyes += `<rect x="${X + 0.5}" y="${Y + 0.5}" width="6" height="6" rx="1.8" fill="none" stroke="${NAVY}" stroke-width="1"/>`;
    eyes += `<rect x="${X + 2}" y="${Y + 2}" width="3" height="3" rx="0.9" fill="${ORANGE}"/>`;
  }

  const svg =
    `<svg class="qr" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg" ` +
    `role="img" aria-label="QR code containing ${label}'s contact details">` +
    `<rect width="${SIZE}" height="${SIZE}" fill="#FFFFFF"/>` +
    `<g fill="${NAVY}" shape-rendering="geometricPrecision">${rects}</g>${eyes}</svg>`;

  return { svg, version: qr.version, modules: N, dark };
}

/* ---- page ----------------------------------------------------------- */
function page(person) {
  const name = `${person.first} ${person.last}`;
  const values = {
    NAME: name,
    FIRST_NAME: person.first,
    ROLE: person.role,
    SLUG: person.slug,
    EMAIL: person.email,
    PHONE_DISPLAY: person.phone,
    PHONE_E164: e164(person.phone),
    VCF_NAME: `${person.first}-${person.last}`
  };

  let out = template;
  for (const [key, value] of Object.entries(values)) {
    out = out.split(`{{${key}}}`).join(value);
  }

  const leftover = out.match(/\{\{[A-Z_]+\}\}/g);
  if (leftover) {
    throw new Error(`${person.slug}: template placeholder never filled: ${[...new Set(leftover)].join(', ')}`);
  }
  return out;
}

/* ---- run ------------------------------------------------------------ */
const report = [];
for (const person of manifest.people) {
  if (!/^[a-z0-9-]+$/.test(person.slug)) {
    throw new Error(`Bad slug "${person.slug}" — lowercase letters, digits and hyphens only.`);
  }
  const name = `${person.first} ${person.last}`;

  const qr = qrSvg(vcard(person, false), name);
  fs.writeFileSync(path.join(ROOT, 'assets', `qr-${person.slug}.svg`), qr.svg);
  fs.writeFileSync(path.join(ROOT, 'assets', `${person.slug}.vcf`), vcard(person, true) + '\r\n', 'utf8');
  fs.writeFileSync(path.join(ROOT, 'card', `${person.slug}.html`), page(person));

  report.push(
    `${name}\n` +
    `  page    card/${person.slug}.html  ->  /card/${person.slug}\n` +
    `  qr      assets/qr-${person.slug}.svg  (version ${qr.version}, ${qr.modules} modules, ECC M, ${qr.dark} dark)\n` +
    `  vcard   assets/${person.slug}.vcf  (includes the postal address)`
  );
}

console.log(report.join('\n\n'));
console.log(`\n${manifest.people.length} card(s) written. ` +
            `Check a QR actually scans before handing the link out.`);
