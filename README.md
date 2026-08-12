# Mokay Group of Companies — Website

Static marketing site. No build step, no dependencies — plain HTML, one stylesheet, one script.

Layout system referenced from [Techor](https://techor-html.netlify.app/), rebuilt in Montserrat with Mokay's brand colours, logo and copy.

## Run locally

```bash
npx -y serve mokay-website -l 5180
```

Then open http://localhost:5180

## Structure

```
index.html      Home — hero slider, feature strip, about, services, systems,
                process, counters, appointment CTA, footer
about.html      About Us — origin, mission band, values, approach, CTA
systems.html    Services & Systems — services, GeoCorelytics, SiteSafety, systems, process
contact.html    Contact — contact cards, enquiry form
assets/
  styles.css    Design system (all tokens in :root at the top)
  app.js        Nav, sticky header, hero slider, reveals, counters, forms, back-to-top
  logo.svg      Brand logo, navy wordmark — used on white headers
  logo-white.svg  Wordmark knocked out to white — used on the navy footer
  favicon.svg   Logo cropped to the orange mark
  img/          Photography (see below)
_archive/clearstreet-version/   Previous design direction, kept for reference
```

## Images — final

All 10 images are in place in `assets/img/` as JPEG. Source PNGs (~20 MB total) were crop-to-fill resized and encoded at quality 82, bringing the set to **1.5 MB**.

| File | Dimensions | Ratio | Subject | Used on |
|---|---|---|---|---|
| `hero-1.jpg` | 1920 × 900 | 32:15 | Open-pit mine, haul trucks, engineer with tablet | Home slide 1, Contact banner |
| `hero-2.jpg` | 1920 × 900 | 32:15 | Processing plant at golden hour, engineers walking | Home slide 2, About banner |
| `hero-3.jpg` | 1920 × 900 | 32:15 | Control room operator at plant dashboards | Home slide 3, Services banner |
| `about-1.jpg` | 840 × 600 | 7:5 | Engineers reviewing data in a site office | Home, About, Contact |
| `about-2.jpg` | 840 × 1000 | 21:25 | Engineer with tablet, processing plant behind | Home, About |
| `system-1.jpg` | 840 × 1000 | 21:25 | Drill rig on a mine site at first light | Home, Services |
| `system-2.jpg` | 840 × 1000 | 21:25 | HSE officer inspecting a processing plant | Home, Services |
| `system-3.jpg` | 840 × 1000 | 21:25 | Site office, SCADA and plant dashboards | Home, Services |
| `cta-bg.jpg` | 1920 × 1200 | 8:5 | Mine and processing plant at dusk | CTA band |
| `counter-bg.jpg` | 1920 × 600 | 16:5 | Conveyor gantry steelwork against sky | Counter / mission bands |

The `about-*` and `system-*` files are exported at 2× their layout size because the large Services and Contact placements render them around 500 px wide — 420 px sources would have looked soft there.

The generation prompts that produced these are kept in [`image-brief.md`](image-brief.md) for re-rolls or future additions.

### Replacing an image later

Keep the same filename and aspect ratio, drop it into `assets/img/`, and nothing else needs to change — every `<img>` carries explicit `width`/`height`, so the layout reserves the right space before the image loads. If you change the ratio, update those attributes too.

To re-run the conversion from a folder of fresh PNGs, the crop-and-encode script (built on .NET `System.Drawing`, no dependencies) is worth keeping alongside your source files.

## Design system

### Colour

| Role | Techor | Mokay | Token |
|---|---|---|---|
| Dark brand — footer, overlays, team band | `#0A165E` | `#2E3192` | `--navy` |
| Deepest shade | — | `#1B1D66` | `--navy-deep` |
| Accent — CTAs, eyebrows, icons, ticks | `#2B4DFF` | `#E95A29` | `--orange` |
| Heading text | `#0F313A` | `#1A1C4A` | `--heading` |
| Body text | `#585B6F` | `#5A5E75` | `--body` |
| Gray band | `#F5F6F7` | `#F5F6FA` | `--gray-bg` |

Techor's accent is a blue; Mokay's orange takes that role, so the navy stays structural and the orange does all the pointing.

### Type

**Montserrat** throughout (Google Fonts), replacing Techor's Outfit + Inter pairing. Headings 700 and capitalized (matching Techor's `text-transform: capitalize`), body 400 at 16px/1.75.

### Layout

- Container **1140px**, section padding up to **130px** — both matched to Techor.
- Signature asymmetric card corner: `border-radius: 50px 0 50px 0` on cards, buttons and images.
- Service cards measure 258px wide against Techor's 257px; system cards are 420px tall against Techor's 420px.
- Top bar → sticky header → hero slider → feature strip (overlapping the hero by -60px) → alternating white/gray sections → navy team band → counters → CTA with appointment form → navy footer.

### Behaviour

- **Hero slider** — 3 slides, 6.5s autoplay, arrows + dots, pauses on hover and when the tab is hidden, wraps both directions.
- **Sticky header** — swaps to fixed past the top bar and inserts a spacer so the page doesn't jump.
- Scroll reveals, count-ups, back-to-top. All respect `prefers-reduced-motion`.

## Notes before going live

- **Forms are front-end only.** They validate and show a success state but send nothing. Point them at Formspree / Netlify Forms / your own endpoint, or rely on the `mailto:` link. Both the home appointment form and the contact form need this.
- **Contact details are live**: `+27 60 569 3080` (linked as `tel:+27605693080`) and 16 L'Breeze Estate, Olympus, Pretoria East. They appear in the top bar, the footer of every page, and the Contact page cards — update all of them together if anything changes.
- **Social links** in the top bar and footer point at `#` — add real URLs or remove.
- **Counters** are limited to verifiable facts (established 2023, two systems, four-stage engagement). Add performance figures only once verified.
- No testimonials section was included — the source copy has no verified client quotes.

Source copy: `mokay-group-website-copy.md` (draft v2).
