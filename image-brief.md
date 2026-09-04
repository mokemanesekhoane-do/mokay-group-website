# Mokay Group — Website Image Brief

Two parts: **what is already in place**, and **what the repositioning now needs**.

The company is presented as a **data analytics and operational intelligence** company serving six sectors. The photography now covers all six, plus the page banners and the capability strip.

---

## Part 1 — In place

**23 images** in `assets/img/`, JPEG quality 82, 3.0 MB total. Every slot the brief called for is now filled.

| File | Dimensions | Subject | Used on |
|---|---|---|---|
| `hero-1.jpg` | 1920 × 900 | Open-pit mine, haul trucks, engineer with tablet | Home slide 1 |
| `hero-2.jpg` | 1920 × 900 | Processing plant at golden hour, engineers walking | Home slide 3 |
| `hero-3.jpg` | 1920 × 900 | Control room operator at plant dashboards | Home slide 2 · Solutions banner |
| `banner-about.jpg` | 1920 × 900 | About page banner | About |
| `banner-systems.jpg` | 1920 × 900 | Systems page banner | Systems |
| `banner-industries.jpg` | 1920 × 900 | Industries page banner | Industries |
| `banner-contact.jpg` | 1920 × 900 | Contact page banner | Contact |
| `sector-mining.jpg` | 1200 × 1000 | Mining & Resources panel | Industries |
| `sector-industrial.jpg` | 1200 × 1000 | Industrial & Manufacturing panel | Industries |
| `sector-energy.jpg` | 1200 × 1000 | Energy & Utilities panel | Industries |
| `sector-infrastructure.jpg` | 1200 × 1000 | Infrastructure & Construction panel | Industries |
| `sector-agriculture.jpg` | 1200 × 1000 | Agriculture panel | Industries |
| `sector-health.jpg` | 1200 × 1000 | Health panel | Industries |
| `capability-analytics.jpg` | 840 × 1000 | Analyst at a multi-screen workstation | Solutions |
| `capability-field.jpg` | 840 × 1000 | Engineer with a rugged tablet above a pit | Solutions |
| `capability-integration.jpg` | 840 × 1000 | Engineer at a network cabinet | Solutions |
| `about-1.jpg` | 840 × 600 | Engineers reviewing data in a site office | Home · About · Contact |
| `about-2.jpg` | 840 × 1000 | Engineer with tablet, plant behind | Home · About |
| `system-1.jpg` | 840 × 1000 | Drill rig at first light | Home · Systems |
| `system-2.jpg` | 840 × 1000 | HSE officer inspecting a plant | Home · Systems |
| `system-3.jpg` | 840 × 1000 | Site office, SCADA dashboards | Home · Systems |
| `cta-bg.jpg` | 1920 × 1200 | Site at dusk | CTA bands · footer CTA |
| `counter-bg.jpg` | 1920 × 600 | Band texture | Counter bands · mission bands · legal banners |

Sector panels and page banners are **decorative** (`alt=""`, `aria-hidden`): they sit under a gradient beside a heading that already names the subject. The three capability images display at full opacity and carry real alt text.

## Part 2 — Still open

Only two optional items remain from the original brief:

| File | Dimensions | Purpose |
|---|---|---|
| `about-team.jpg` | 1200 × 800 | A real working session for the About page — the one place a genuine team photograph would outperform stock-style imagery. |
| `og-image.jpg` | 1200 × 630 | Social sharing card. Logo plus strapline on the navy grid. Without it, links shared on LinkedIn or WhatsApp show no preview image. |

A dedicated `band-mission.jpg` would also be nice — the mission bands currently reuse `counter-bg`, which works because it renders at 20% opacity, but a purpose-shot texture would be better.

---

## Generation notes

House style, unchanged: photorealistic editorial photography, South African settings, Black South African professionals in correct PPE where the setting calls for it, natural light, no text, no logos, no watermarks.

**What changed in the brief:** the emphasis has moved from *heavy industry* to *people working with data in operational settings*. Where the earlier set favoured machinery and scale, this set should favour screens, tablets, control rooms and analysis — the mine or plant as context rather than subject. That is what the repositioning is asking the imagery to say.

ChatGPT outputs `1024×1024`, `1024×1536` (portrait) or `1536×1024` (landscape). Generate at the nearest shape, then crop and encode with the bundled script:

```powershell
powershell -File assets/img/_convert-images.ps1 -SrcDir "C:\path\to\pngs" -OutDir assets\img
```

Add the new filenames to the `$jobs` array in that script with their target dimensions before running it.

### Composition rules that the layout depends on

- **Sector panels** — subject anywhere; it sits at 34% opacity under a gradient with the sector name bottom-left. Avoid busy edges.
- **Hero images** — copy overlays the left, so keep subjects right of centre and the left third clear.
- **Portrait 840 × 1000** — bottom 40% may be covered by a caption gradient; keep the subject in the upper two-thirds.
- **Background bands** — render at 16–22% opacity. Treat as texture, keep the centre calm.

---

## Wiring a new image in

1. Drop the JPEG into `assets/img/`.
2. For a sector, replace the `<img>` inside that sector's `.sector-visual` in `industries.html` (or add one — the panel is designed to look complete without a photograph, so nothing breaks while you wait).
3. Keep `width` and `height` attributes matching the file's real dimensions so the layout reserves the right space before load.
