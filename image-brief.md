# Mokay Group — Website Image Brief

**Status: all 10 images generated and live in `assets/img/`.** This file is kept as the reference for re-rolls, replacements and any future additions.

The team-portrait prompts that were originally here (`team-1` … `team-4`) have been removed along with the team section.

## Re-rolling or replacing an image

1. Paste the relevant prompt below into ChatGPT (image generation), one at a time.
2. Ask for the **orientation** stated with the prompt — ChatGPT only outputs `1024×1024`, `1024×1536` (portrait) or `1536×1024` (landscape), so generate at the nearest shape and crop after.
3. Convert to the final size with `assets/img/_convert-images.ps1`, which crop-fills to the target ratio and encodes JPEG at quality 82 using built-in .NET imaging — no install needed:

```powershell
powershell -File assets/img/_convert-images.ps1 -SrcDir "C:\path\to\pngs" -OutDir assets\img
```

4. Keep the same filename. Nothing else needs to change — every `<img>` carries explicit `width`/`height`, so the layout reserves the right space before load. If you change an aspect ratio, update those attributes too.

### House style (already baked into each prompt)

Photorealistic editorial/documentary photography — not illustration, not glossy stock. South African mining and industrial settings. Black South African professionals in correct PPE (hard hat, hi-vis, safety glasses, steel-toe boots). Natural light. Orange hi-vis sits naturally alongside the brand orange `#E95A29`; navy `#2E3192` is the site's structural colour. No text, no logos, no watermarks in any frame.

---

## 1. `hero-1.jpg` — 1920 × 900 — **landscape**
*Home slide 1 · Contact page banner. Copy overlays the left side.*

```
Photorealistic editorial photograph, wide landscape. A large open-pit mine in South Africa: terraced benches, haul trucks working the ramps, dust haze in the distance. In the right third of the frame, a Black South African mining engineer in an orange hi-vis vest, white hard hat and safety glasses stands in three-quarter view reviewing operational data on a rugged tablet. Early morning light, clear sky. The left two-thirds of the frame is open pit and sky with no clutter, so text can be overlaid. Natural documentary style, sharp subject, no text, no logos, no watermarks.
```

## 2. `hero-2.jpg` — 1920 × 900 — **landscape**
*Home slide 2 · About page banner. Copy overlays the left side.*

```
Photorealistic editorial photograph, wide landscape. An industrial mineral processing plant at golden hour: conveyor gantries, steel structure, storage silos and pipework. In the right third of the frame, two Black South African engineers — one woman, one man — in hi-vis vests and hard hats walk through the plant in conversation, one carrying a rugged tablet. Warm low sun, long shadows, light atmospheric haze. The left two-thirds is open sky and plant structure with no clutter, so text can be overlaid. Natural documentary style, no text, no logos, no watermarks.
```

## 3. `hero-3.jpg` — 1920 × 900 — **landscape**
*Home slide 3 · Services page banner. Copy overlays the left side.*

```
Photorealistic editorial photograph, wide landscape. A modern industrial control room. A Black South African control room operator sits at a curved desk facing a bank of large monitors showing production dashboards, trend charts and plant schematics in blue and orange tones. Cool screen glow against a darker room, the operator lit by the screens. Operator positioned in the right third; the left side of the frame is darker and uncluttered so text can be overlaid. Natural documentary style, no readable text on the screens, no logos, no watermarks.
```

## 4. `about-1.jpg` — 840 × 600 — **landscape**
*Home "About" block · About page · Contact page. Sits beside `about-2` with a circular badge overlapping the inner edge — keep the right side of the frame simple.*

```
Photorealistic editorial photograph, landscape. Two Black South African engineers — a woman and a man in hi-vis vests, hard hats resting on the desk beside them — reviewing operational data together on a laptop in a clean, modern site office. Through the window behind them an industrial processing plant and stockpiles are visible, softly out of focus. Bright natural daylight. Natural documentary style, no readable text on the screen, no logos, no watermarks.
```

## 5. `about-2.jpg` — 840 × 1000 — **portrait**
*Home "About" block · About page. Paired with `about-1`; a circular badge overlaps the inner edge.*

```
Photorealistic editorial photograph, portrait orientation. A Black South African woman engineer in an orange hi-vis vest, white hard hat and safety glasses stands capturing field data on a rugged tablet. Behind her an industrial processing plant with conveyors and steel structure, softly out of focus. Soft overcast daylight. Subject occupies the upper two-thirds of the frame. Natural documentary style, no text, no logos, no watermarks.
```

## 6. `system-1.jpg` — 840 × 1000 — **portrait**
*GeoCorelytics card (Home + Services) and the large Services image. Bottom 40% is covered by a navy gradient and caption — keep the subject in the upper two-thirds.*

```
Photorealistic editorial photograph, portrait orientation. A drilling rig operating on a mine site at first light, mast raised, drill rods stacked alongside. In the foreground a Black South African field technician in hi-vis and hard hat logs data on a rugged tablet beside a row of core sample trays. Cool early-morning light, low sun, light dust. Main subject in the upper two-thirds of the frame. Natural documentary style, no text, no logos, no watermarks.
```

## 7. `system-2.jpg` — 840 × 1000 — **portrait**
*SiteSafety card (Home + Services) and the large Services image. Bottom 40% covered by caption gradient.*

```
Photorealistic editorial photograph, portrait orientation. A Black South African HSE officer in hi-vis, hard hat and safety glasses carries out a safety inspection walk-through of an industrial processing plant, holding a tablet with a gas monitor clipped to the belt, checking a guarded conveyor and pipework. Industrial daylight, steel and concrete. Main subject in the upper two-thirds of the frame. Natural documentary style, no text, no logos, no watermarks.
```

## 8. `system-3.jpg` — 840 × 1000 — **portrait**
*Systems Integration card (Home + Services). Bottom 40% covered by caption gradient.*

```
Photorealistic editorial photograph, portrait orientation. A Black South African data engineer stands in a site office reviewing several wall-mounted and desk monitors displaying SCADA plant schematics, production dashboards and trend charts in blue and orange tones. Mixed daylight and screen glow. Main subject in the upper two-thirds of the frame. Natural documentary style, no readable text on the screens, no logos, no watermarks.
```

## 9. `cta-bg.jpg` — 1920 × 1200 — **landscape**
*Full-width band behind the CTA and appointment form on every page. Renders at ~20% opacity under a navy overlay — keep it low-contrast and keep the centre calm.*

```
Photorealistic wide landscape photograph. A working mine and adjacent processing plant at dusk during blue hour: haul trucks with headlights moving along a ramp, plant structure picked out by work lighting, stockpiles and conveyors, deep blue sky with the last warm light low on the horizon. Elevated wide viewpoint, no people in the foreground. Moody and cinematic but realistic, low overall contrast so it can sit behind text at low opacity. No text, no logos, no watermarks.
```

## 10. `counter-bg.jpg` — 1920 × 600 — **landscape**
*Texture band behind the statistics strip and mission bands. Renders at ~16% opacity — treat as pure texture.*

```
Photorealistic wide landscape photograph. An abstract close view of industrial steelwork: a conveyor gantry and truss structure crossing the frame against an overcast sky, with strong repeating geometry and bold diagonal lines. No people. Muted, desaturated and low-contrast so it can sit behind text at low opacity. No text, no logos, no watermarks.
```

---

## Coverage check

The set deliberately spans the whole mining-and-industrial picture rather than only the two launch systems:

| Setting | Images |
|---|---|
| Open-pit mining | `hero-1`, `cta-bg` |
| Processing plant / industrial | `hero-2`, `about-2`, `system-2`, `counter-bg` |
| Control room / data | `hero-3`, `system-3` |
| Site office / analysis | `about-1`, `system-3` |
| Drilling / exploration | `system-1` |

Only one of the ten is drilling-specific and one is HSE-specific; the rest read as general mining and industrial operations, so the site does not look like a single-product business.

## Consistency tips


- If a frame comes back with garbled text on a screen or a sign, re-run with "no readable text anywhere in the image" appended.
- If PPE looks wrong (missing chin strap, wrong vest), append "correct industrial PPE, hi-vis vest fastened, hard hat worn properly".
- Ask for a re-roll rather than editing — consistency across a set is easier to get from fresh generations with the same prompt.
