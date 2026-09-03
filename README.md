# Mokay Group of Companies — Website

Static site for a **data analytics and operational intelligence** company. No build step, no dependencies — plain HTML, one stylesheet, one script.

**Central message:** We make operational data meaningful — enabling organisations to make better decisions, improve performance, manage risk and optimise critical operations.

## Run locally

```bash
npx -y serve mokay-website -l 5180
```

Then open http://localhost:5180

## Structure

```
index.html            Home — hero, pillars, who we are, 7 capabilities,
                      central message, 6 industries, systems, process, CTA
about.html            About — origin, mission, values, approach, data governance
solutions.html        The 7 core capabilities in detail
systems.html          GeoCorelytics & SiteSafety, full 8-part showcase each
industries.html       The 6 target sectors in detail
contact.html          Contact cards + discovery-call enquiry form

privacy-policy.html   POPIA-aligned privacy policy (website visitors)
data-protection.html  Data Protection Notice (client operational data)
cookie-policy.html    Cookie Policy
terms-of-use.html     Terms of Use
disclaimer.html       Website Disclaimer

assets/
  styles.css          Design system — tokens in :root at the top
  app.js              Nav, sticky header, slider, reveals, counters,
                      forms, back-to-top, cookie consent
  logo.svg / logo-white.svg / favicon.svg / geocorelytics-logo.png
  img/                Photography + the conversion script
_sync-shared.js       Keeps header, footer and cookie banner identical across pages
_archive/             Superseded design direction (gitignored)
```

## Positioning

| | |
|---|---|
| **What we are** | A data analytics and operational intelligence company |
| **Footer** | Closing CTA band · brand + contact · Solutions · Company · Industries · legal row |
| **Sectors** | Mining & Resources · Industrial & Manufacturing · Energy & Utilities · Infrastructure & Construction · Agriculture · Health |
| **Capabilities** | Data Analytics & BI · Operational Intelligence · Performance Monitoring & Reporting · Safety & Risk Analytics · Asset & Equipment Data Management · Custom Digital Platforms & Dashboards · Data Integration & Automation |

Each system on `systems.html` follows the same eight-part structure: operational challenge → solution → how it works → key features → dashboard preview → data captured → business benefits → industry applications.

## Editing shared blocks

The header, footer and cookie banner live **once**, in `_sync-shared.js`. Edit them there and run:

```bash
node _sync-shared.js
```

It rewrites the content between the `<!-- #HEADER -->`, `<!-- #FOOTER -->` and `<!-- #COOKIE -->` markers on every page, and sets the active nav item from each page's `<body data-page="...">`. Pages remain plain static HTML — this is a one-off helper, not a runtime build step.

## Cookie consent

`app.js` implements a preference centre with three categories (strictly necessary, analytics, functional). The choice is stored in `localStorage` under `mokay-consent`.

**The site currently sets no analytics or marketing cookies.** The banner says so, and the two optional categories are declared as not in use. The gate is ready for when you add something:

```js
if (window.mokayConsent.allows('analytics')) {
  // load your analytics here
}
// or react to changes
document.addEventListener('mokay:consent', e => { /* e.detail */ });
```

If you add analytics, update the table in `cookie-policy.html` to list the actual cookies.

> **Note on the slider:** `app.js` is a single IIFE. Keep variable names distinct across its sections — an earlier `var current` collision between the slider index and the stored consent object silently broke the hero for any visitor who had already answered the cookie banner.

## ⚠️ Before going live

**Legal pages need a qualified review.** They are substantive drafts written against POPIA, PAIA, the ECT Act and the Consumer Protection Act, but they have not been reviewed by an admitted attorney. Have them checked against your actual operations before publishing.

**Fill in the visible placeholders.** These render as highlighted text so they cannot ship unnoticed:

| Placeholder | Where |
|---|---|
| Company registration number | `privacy-policy.html`, `terms-of-use.html` |
| Information Officer name | `privacy-policy.html` |

Health is now a served sector, so `data-protection.html` carries a **special personal information** section (POPIA s26–27). Confirm the lawful ground you intend to rely on before taking on any health engagement.

Under POPIA the Information Officer defaults to the head of the organisation, and must be registered with the Information Regulator.

**Also outstanding:**

- **Forms are front-end only.** They validate and show a success state but send nothing. Connect Formspree / Netlify Forms / your own endpoint. Both the home page and contact page forms need this.
- **Social links point at `#`.** Add real URLs or remove them.
- **Verify the Information Regulator's current contact details** before relying on the reference in the privacy policy — the page links to inforegulator.org.za rather than hardcoding an address, but confirm it is still correct.
- **Counters** state only verifiable facts (established 2023, 7 capabilities, 6 sectors). Add performance figures only once verified.
- **Development status wording has been removed** from the marketing pages — GeoCorelytics and SiteSafety are now presented as available platforms. `terms-of-use.html` and `disclaimer.html` still carry conditional clauses ("where this site describes a system as being in development or testing"), which are harmless but no longer describe anything. Remove them if you want the legal pages tightened.

## Images

10 photographs in `assets/img/`, JPEG at quality 82, 1.5 MB total.

**The repositioning has outgrown the current set** — it is mining- and plant-heavy, which under-represents four of the six sectors. [`image-brief.md`](image-brief.md) lists what is needed: 6 sector images at 1200×1000, 3 capability images at 840×1000, and two optional additions. Four sector cards currently borrow an existing photograph; Agriculture and Health run on the designed gradient panel alone, which is intentional — the panel looks complete without one.

To re-cut from fresh PNGs:

```powershell
powershell -File assets/img/_convert-images.ps1 -SrcDir "C:\path\to\pngs" -OutDir assets\img
```

## Design system

Montserrat throughout. Brand navy `#2E3192`, orange `#E95A29`, body `#5A5E75`, grey band `#F5F6FA`. Container 1140px. Cards use the asymmetric `border-radius: 50px 0 50px 0`. Layout referenced from [Techor](https://techor-html.netlify.app/).

Mobile is held to a 44px minimum touch target and a 13px minimum font size; inline links inside prose are the one deliberate exception.
