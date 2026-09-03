/* Injects the shared header, footer and cookie banner into every page.
   Pages are plain static HTML — this only keeps the repeated blocks in step.
   Run:  node _sync-shared.js
*/
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

const ARROW = '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const MAIL = '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>';
const PIN  = '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
const TEL  = '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>';
const ico = (s) => `<span class="ico">${s.replace('class="arw"', 'width="16" height="16"')}</span>`;

const HEADER = `
<div class="topbar">
  <div class="container topbar-inner">
    <ul>
      <li>${MAIL}<a href="mailto:info@mokaygroup.co.za">info@mokaygroup.co.za</a></li>
      <li>${PIN}Olympus, Pretoria East</li>
      <li>${TEL}<a href="tel:+27605693080">+27 60 569 3080</a></li>
    </ul>
    <ul class="socials"><li>Data Analytics &amp; Operational Intelligence</li></ul>
  </div>
</div>

<header class="header">
  <div class="container header-inner">
    <a class="logo" href="index.html" aria-label="Mokay Group of Companies — home">
      <img src="assets/logo.svg" alt="Mokay Group of Companies" width="168" height="42">
    </a>
    <ul class="menu" data-menu>
      <li><a href="index.html" data-nav="home">Home</a></li>
      <li><a href="about.html" data-nav="about">About</a></li>
      <li><a href="solutions.html" data-nav="solutions">Solutions</a></li>
      <li><a href="systems.html" data-nav="systems">Systems</a></li>
      <li><a href="industries.html" data-nav="industries">Industries</a></li>
      <li><a href="contact.html" data-nav="contact">Contact</a></li>
    </ul>
    <div class="header-right">
      <a href="contact.html" class="btn btn-orange">Book a Discovery Call ${ARROW}</a>
      <button class="burger" data-burger aria-label="Toggle menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;

const FOOTER = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo"><img src="assets/logo-white.svg" alt="Mokay Group of Companies" width="184" height="46"></div>
        <p>A data analytics and operational intelligence company. We make operational data meaningful — so organisations can decide better, perform better and manage risk.</p>
        <div class="socials-row">
          <a href="#" aria-label="LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.2 8.4h4.6V24H.2V8.4Zm7.7 0h4.4v2.1h.06c.61-1.1 2.1-2.3 4.34-2.3 4.64 0 5.5 3 5.5 6.9V24h-4.6v-7.9c0-1.9-.03-4.3-2.7-4.3-2.7 0-3.1 2-3.1 4.2V24H7.9V8.4Z"/></svg></a>
          <a href="#" aria-label="Facebook"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.2c0-.9.2-1.4 1.6-1.4H18V.8C17.6.8 16.3.7 14.8.7c-3.2 0-5.4 2-5.4 5.6v2.2H6v4.3h3.4V24H14V12.8h3.5l.5-4.3H14Z"/></svg></a>
          <a href="#" aria-label="X"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.2h3.7l-8.1 9.2 9.5 12.4h-7.4l-5.8-7.6-6.7 7.6H.4l8.6-9.9L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.2h-2.2l13.3 17.4Z"/></svg></a>
        </div>
      </div>
      <div>
        <h5>Solutions</h5>
        <ul>
          <li><a href="solutions.html#analytics">Data Analytics &amp; BI</a></li>
          <li><a href="solutions.html#operational">Operational Intelligence</a></li>
          <li><a href="solutions.html#performance">Performance Monitoring</a></li>
          <li><a href="solutions.html#safety">Safety &amp; Risk Analytics</a></li>
          <li><a href="solutions.html#asset">Asset Data Management</a></li>
          <li><a href="solutions.html#platforms">Platforms &amp; Dashboards</a></li>
          <li><a href="solutions.html#integration">Integration &amp; Automation</a></li>
        </ul>
      </div>
      <div>
        <h5>Company</h5>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="about.html#approach">Our Approach</a></li>
          <li><a href="systems.html">Our Systems</a></li>
          <li><a href="industries.html">Industries</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h5>Legal</h5>
        <ul>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="data-protection.html">Data Protection Notice</a></li>
          <li><a href="cookie-policy.html">Cookie Policy</a></li>
          <li><a href="terms-of-use.html">Terms of Use</a></li>
          <li><a href="disclaimer.html">Disclaimer</a></li>
          <li><a href="#" data-cookie-settings>Cookie Settings</a></li>
        </ul>
      </div>
      <div>
        <h5>Get In Touch</h5>
        <ul>
          <li class="contact-li">${ico(MAIL)}<a href="mailto:info@mokaygroup.co.za">info@mokaygroup.co.za</a></li>
          <li class="contact-li">${ico(PIN)}16 L’Breeze Estate, Olympus, Pretoria East</li>
          <li class="contact-li">${ico(TEL)}<a href="tel:+27605693080">+27 60 569 3080</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-legal">
      <p>Mokay Group of Companies is a data analytics and operational intelligence company serving mining and resources, industrial and manufacturing, energy and utilities, infrastructure and construction, and logistics and transport operations. GeoCorelytics and SiteSafety are in final development and testing ahead of full deployment.</p>
      <div class="foot-bot">
        <span>Copyright © <span data-year>2026</span> Mokay Group of Companies. All rights reserved.</span>
        <span>Established 2023 · Pretoria East, South Africa</span>
      </div>
    </div>
  </div>
</footer>

<button class="to-top" data-to-top aria-label="Back to top">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>`;

const COOKIE = `
<div class="cookie" data-cookie role="dialog" aria-label="Cookie preferences" aria-live="polite" hidden>
  <div class="container">
    <div class="cookie-inner">
      <div>
        <h4>Cookies on this website</h4>
        <p>We use a strictly necessary cookie to remember this choice. We do not currently run advertising or
        third-party tracking. If we introduce analytics to understand how the site is used, it will only load
        with your consent. See our <a href="cookie-policy.html">Cookie Policy</a> and
        <a href="privacy-policy.html">Privacy Policy</a>.</p>
      </div>
      <div class="cookie-actions">
        <button type="button" class="btn btn-outline-dark" data-consent="prefs">Preferences</button>
        <button type="button" class="btn btn-outline-dark" data-consent="reject">Reject non-essential</button>
        <button type="button" class="btn btn-orange" data-consent="accept">Accept all</button>
      </div>
    </div>
    <div class="cookie-prefs" data-cookie-prefs>
      <label class="cookie-opt">
        <input type="checkbox" data-cat="necessary" checked disabled>
        <span><b>Strictly necessary <span class="locked">Always on</span></b>
        <span>Required for the site to function and to remember your cookie choice. Cannot be switched off.</span></span>
      </label>
      <label class="cookie-opt">
        <input type="checkbox" data-cat="analytics">
        <span><b>Analytics</b>
        <span>Helps us understand which pages are useful so we can improve them. Not currently in use — this setting applies if we add it.</span></span>
      </label>
      <label class="cookie-opt">
        <input type="checkbox" data-cat="functional">
        <span><b>Functional</b>
        <span>Enables optional conveniences such as embedded media or remembering form details between visits.</span></span>
      </label>
      <div style="padding-top:16px">
        <button type="button" class="btn btn-orange" data-consent="save">Save preferences</button>
      </div>
    </div>
  </div>
</div>`;

const BLOCKS = { HEADER, FOOTER, COOKIE };

const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let report = [];

for (const file of pages) {
  const p = path.join(DIR, file);
  let s = fs.readFileSync(p, 'utf8');
  const applied = [];

  for (const [name, block] of Object.entries(BLOCKS)) {
    const re = new RegExp(`<!-- #${name} -->[\\s\\S]*?<!-- /#${name} -->`);
    if (re.test(s)) {
      s = s.replace(re, `<!-- #${name} -->${block}\n<!-- /#${name} -->`);
      applied.push(name.toLowerCase());
    }
  }

  // mark the active nav item from the page's own data-page value
  const pageKey = (s.match(/<body[^>]*data-page="([^"]+)"/) || [])[1];
  if (pageKey) {
    s = s.replace(/(<a href="[^"]*" data-nav="([^"]+)")( class="active")?/g,
      (m, head, key) => head + (key === pageKey ? ' class="active"' : ''));
  }

  fs.writeFileSync(p, s);
  report.push(`${file.padEnd(22)}${applied.length ? applied.join(' + ') : 'no markers'}${pageKey ? '   nav=' + pageKey : ''}`);
}
console.log(report.join('\n'));
