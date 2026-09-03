# Mokay Group — Website Image Brief

Two parts: **what is already in place**, and **what the repositioning now needs**.

The company is no longer presented as a mining and industrial supplier. It is a **data analytics and operational intelligence** company serving six sectors. The existing photography is mining- and plant-heavy, which now under-represents four of those six.

---

## Part 1 — Already in place

Ten images in `assets/img/`, JPEG quality 82, ~1.5 MB total. These stay.

| File | Dimensions | Subject | Used on |
|---|---|---|---|
| `hero-1.jpg` | 1920 × 900 | Open-pit mine, haul trucks, engineer with tablet | Home slide 1 · Systems banner · Mining sector card |
| `hero-2.jpg` | 1920 × 900 | Processing plant at golden hour, engineers walking | Home slide 3 · About/Industries banner · Industrial sector card |
| `hero-3.jpg` | 1920 × 900 | Control room operator at plant dashboards | Home slide 2 · Solutions banner |
| `about-1.jpg` | 840 × 600 | Engineers reviewing data in a site office | Home · About · Contact |
| `about-2.jpg` | 840 × 1000 | Engineer with tablet, processing plant behind | Home · About |
| `system-1.jpg` | 840 × 1000 | Drill rig at first light with technician logging data | Home · Systems · Infrastructure sector card |
| `system-2.jpg` | 840 × 1000 | HSE officer inspecting a processing plant | Home · Systems |
| `system-3.jpg` | 840 × 1000 | Site office, SCADA and plant dashboards | Home · Systems · Energy sector card |
| `cta-bg.jpg` | 1920 × 1200 | Mine and processing plant at dusk | CTA band, all pages |
| `counter-bg.jpg` | 1920 × 600 | Conveyor gantry steelwork against sky | Counter / mission bands |

---

## Part 2 — What the new positioning needs

### Priority 1 — Sector images (6) · **1200 × 1000** · 6:5 · **landscape**

These fill the visual panel on each sector card on `industries.html`. The panel is roughly 440 × 520 on desktop and the image sits at ~34% opacity beneath a navy gradient, so it reads as texture behind the sector name — **mid-tone, uncluttered, no fine detail needed**.

Four sectors currently borrow an existing image and two have none. Purpose-shot images for all six would make the page consistent.

| File | Sector | Subject brief | Status |
|---|---|---|---|
| `sector-mining.jpg` | Mining & Resources | Open-pit bench with haul truck, wide, mid-morning | *currently borrows `hero-1`* |
| `sector-industrial.jpg` | Industrial & Manufacturing | Production line or plant interior, machinery in depth | *currently borrows `hero-2`* |
| `sector-energy.jpg` | Energy & Utilities | Substation, transmission towers or water treatment works | *currently borrows `system-3`* |
| `sector-infrastructure.jpg` | Infrastructure & Construction | Bridge, roadworks or structure under construction | *currently borrows `system-1`* |
| `sector-agriculture.jpg` | Agriculture | Irrigated field with a centre pivot, or a packhouse line | **needed** |
| `sector-health.jpg` | Health | Hospital corridor, laboratory bench or medical equipment | **needed** |

For health, avoid identifiable patients entirely — equipment, corridors, laboratory settings, or staff photographed from behind. Patient imagery raises consent issues you do not need.

### Priority 2 — Capability images (3) · **840 × 1000** · 21:25 · **portrait**

The Solutions page is currently all text. Three images would break it up without needing one per capability.

| File | Subject brief |
|---|---|
| `capability-analytics.jpg` | Analyst at a multi-screen desk, charts visible but not readable |
| `capability-field.jpg` | Supervisor using a rugged tablet on site, mid-task |
| `capability-integration.jpg` | Server rack, network cabinet or engineer at a control panel |

### Priority 3 — Optional additions

| File | Dimensions | Purpose |
|---|---|---|
| `about-team.jpg` | 1200 × 800 | A working session — people around a screen. Warms up the About page. |
| `og-image.jpg` | 1200 × 630 | Social sharing card. Logo plus the strapline on the navy grid background. |

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
