/* Mokay Group of Companies — site behaviour */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector('[data-burger]');
  if (burger) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('[data-menu] a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ---------- sticky header ---------- */
  var header = document.querySelector('.header');
  var headerOffset = header ? header.offsetTop : 0;
  var spacer = null;
  var toTop = document.querySelector('[data-to-top]');

  var onScroll = function () {
    if (header) {
      var shouldStick = window.scrollY > headerOffset;
      if (shouldStick && !header.classList.contains('sticky')) {
        spacer = document.createElement('div');
        spacer.style.height = header.offsetHeight + 'px';
        header.parentNode.insertBefore(spacer, header);
        header.classList.add('sticky');
      } else if (!shouldStick && header.classList.contains('sticky')) {
        header.classList.remove('sticky');
        if (spacer) { spacer.remove(); spacer = null; }
      }
    }
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
  };

  var ticking = false;
  var frame = function () { onScroll(); ticking = false; };
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (header && !header.classList.contains('sticky')) headerOffset = header.offsetTop;
    frame();
  }, { passive: true });
  // a rAF queued while the tab was hidden never runs, which would leave `ticking`
  // stuck true and freeze scroll handling on return — recover on visibility change
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    ticking = false;
    frame();
  });
  frame();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- hero slider ---------- */
  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var slides = [].slice.call(slider.querySelectorAll('.slide'));
    var dotWrap = slider.querySelector('[data-dots]');
    var slideIndex = 0;
    var timer = null;
    var DELAY = 6500;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', function () { go(i); });
      if (dotWrap) dotWrap.appendChild(b);
      return b;
    });

    function go(i) {
      slideIndex = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('active', n === slideIndex); });
      dots.forEach(function (d, n) { d.classList.toggle('on', n === slideIndex); });
      restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduced && slides.length > 1) timer = setInterval(function () { go(slideIndex + 1); }, DELAY);
    }

    var prev = slider.querySelector('[data-prev]');
    var next = slider.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { go(slideIndex - 1); });
    if (next) next.addEventListener('click', function () { go(slideIndex + 1); });

    slider.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') restart();
      else if (timer) clearInterval(timer);
    });

    go(0);
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- count-up ---------- */
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var pad = el.getAttribute('data-pad') === 'true';
    var suffix = el.getAttribute('data-suffix') || '';
    var fmt = function (v) { return (pad && v < 10 ? '0' : '') + v + suffix; };
    if (reduced) { el.textContent = fmt(target); return; }
    var start = performance.now(), dur = 1500;
    var tick = function (now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCount(e.target);
        co.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  /* ---------- forms (front-end only) ---------- */
  /* ============================================================
     ENQUIRY FORMS

     >>> TO GO LIVE: put your form provider's URL in FORM_ENDPOINT below. <<<

     Formspree needs no server and works on any static host: create a form
     at formspree.io, then paste its URL here, e.g.
         var FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
     Any endpoint that accepts a JSON POST and answers 2xx will work just as
     well (Netlify Forms, Web3Forms, Getform, your own handler).

     While FORM_ENDPOINT is empty the forms open the visitor's mail client
     with their answers pre-filled. That is the whole point of the fallback:
     the form must never report success for something it did not send.
     ============================================================ */
  var FORM_ENDPOINT = '';
  var FORM_MAILTO = 'info@mokaygroup.co.za';

  var fieldOf = function (el) { return el && el.closest ? el.closest('.field') : null; };

  var unflag = function (wrap) {
    if (!wrap) return;
    wrap.classList.remove('invalid');
    var note = wrap.querySelector('.field-err');
    if (note) note.parentNode.removeChild(note);
  };

  var clearErrors = function (form) {
    form.querySelectorAll('.field.invalid').forEach(unflag);
  };

  var flag = function (el, message) {
    var wrap = fieldOf(el);
    if (!wrap || wrap.classList.contains('invalid')) return;
    wrap.classList.add('invalid');
    var note = document.createElement('span');
    note.className = 'field-err';
    note.textContent = message;
    wrap.appendChild(note);
  };

  /* The forms carry `novalidate` so we own the reporting — the browser's own
     bubbles are inconsistent across engines and cannot be styled. */
  var validate = function (form) {
    clearErrors(form);
    var first = null;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.type === 'hidden' || el.name === '_gotcha' || el.disabled) return;
      if (el.checkValidity()) return;
      flag(el, !el.value.trim() ? 'This field is required.'
        : el.type === 'email' ? 'Enter a valid email address.'
        : 'Please check this value.');
      if (!first) first = el;
    });
    if (first) {
      first.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      first.focus({ preventScroll: true });
    }
    return !first;
  };

  var collect = function (form) {
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });
    return data;
  };

  var openMailClient = function (data) {
    var lines = [];
    Object.keys(data).forEach(function (key) {
      if (key.charAt(0) === '_') return;
      var value = String(data[key]).trim();
      if (!value) return;
      lines.push(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value);
    });
    window.location.href = 'mailto:' + FORM_MAILTO +
      '?subject=' + encodeURIComponent(data._subject || 'Website enquiry') +
      '&body=' + encodeURIComponent(lines.join('\n'));
  };

  document.querySelectorAll('[data-form]').forEach(function (form) {
    var btn = form.querySelector('[type="submit"]');
    var ok = form.querySelector('.form-ok');
    var okText = form.querySelector('[data-ok-msg]');
    var err = form.querySelector('[data-err-msg]');
    var okDefault = okText ? okText.textContent : '';
    var btnIdle = btn ? btn.innerHTML : '';
    var sending = false;

    var hide = function () {
      if (ok) ok.classList.remove('show');
      if (err) err.classList.remove('show');
    };
    var announceResult = function (el, message) {
      if (!el) return;
      if (message) el.textContent = message;
      var box = el.classList.contains('form-ok') || el.classList.contains('form-err') ? el : el.parentNode;
      box.classList.add('show');
      box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    };
    var setSending = function (on) {
      sending = on;
      if (!btn) return;
      btn.disabled = on;
      btn.innerHTML = on ? 'Sending…' : btnIdle;
    };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (sending) return;
      hide();
      if (!validate(form)) return;

      var data = collect(form);
      if (data._gotcha) { form.reset(); return; }  // a bot filled the honeypot

      if (!FORM_ENDPOINT) {
        openMailClient(data);
        announceResult(okText, 'Opening your email app with these details so you can send them to us. ' +
          'If nothing opens, email ' + FORM_MAILTO + ' directly.');
        return;
      }

      setSending(true);
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        setSending(false);
        form.reset();
        clearErrors(form);
        announceResult(okText, okDefault);
      })['catch'](function () {
        setSending(false);
        announceResult(err, 'We could not send that just now. Please try again, or email us ' +
          'directly at ' + FORM_MAILTO + '.');
      });
    });

    /* Clear a field's error as soon as the visitor starts correcting it. */
    form.addEventListener('input', function (ev) {
      var wrap = fieldOf(ev.target);
      if (wrap && wrap.classList.contains('invalid')) unflag(wrap);
    });
    form.addEventListener('change', function (ev) {
      var wrap = fieldOf(ev.target);
      if (wrap && wrap.classList.contains('invalid')) unflag(wrap);
    });
  });

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ============================================================
     COOKIE CONSENT
     The site currently sets no analytics or marketing cookies. This
     records the visitor's choice and exposes a gate so anything added
     later (analytics, embeds) only loads once consent is given.
     ============================================================ */
  var STORE = 'mokay-consent';
  var VERSION = 1;

  var read = function () {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return null;
      var v = JSON.parse(raw);
      return v && v.version === VERSION ? v : null;
    } catch (e) { return null; }
  };
  var write = function (prefs) {
    var record = {
      version: VERSION,
      date: new Date().toISOString(),
      necessary: true,
      analytics: !!prefs.analytics,
      functional: !!prefs.functional
    };
    try { localStorage.setItem(STORE, JSON.stringify(record)); } catch (e) {}
    return record;
  };

  // public gate — window.mokayConsent.allows('analytics')
  var consent = read();
  window.mokayConsent = {
    get: function () { return consent; },
    allows: function (category) {
      if (category === 'necessary') return true;
      return !!(consent && consent[category]);
    },
    reopen: function () { openBanner(true); }
  };
  var announce = function () {
    try {
      document.dispatchEvent(new CustomEvent('mokay:consent', { detail: consent }));
    } catch (e) {}
  };

  var banner = document.querySelector('[data-cookie]');
  function openBanner(showPrefs) {
    if (!banner) return;
    banner.classList.add('show');
    banner.removeAttribute('hidden');
    var panel = banner.querySelector('[data-cookie-prefs]');
    if (panel) panel.classList.toggle('show', !!showPrefs);
    if (showPrefs) syncBoxes();
  }
  function closeBanner() {
    if (!banner) return;
    banner.classList.remove('show');
    var panel = banner.querySelector('[data-cookie-prefs]');
    if (panel) panel.classList.remove('show');
  }
  function syncBoxes() {
    if (!banner) return;
    banner.querySelectorAll('input[data-cat]').forEach(function (box) {
      var cat = box.getAttribute('data-cat');
      if (cat === 'necessary') { box.checked = true; return; }
      box.checked = !!(consent && consent[cat]);
    });
  }
  function save(prefs) {
    consent = write(prefs);
    announce();
    closeBanner();
  }

  if (banner) {
    if (!consent) {
      // let the page settle before interrupting, and re-check on firing in case
      // the visitor already answered via the footer link in the meantime
      setTimeout(function () { if (!consent) openBanner(false); }, 900);
    }
    banner.addEventListener('click', function (ev) {
      var act = ev.target.closest('[data-consent]');
      if (!act) return;
      ev.preventDefault();
      var kind = act.getAttribute('data-consent');
      if (kind === 'accept') return save({ analytics: true, functional: true });
      if (kind === 'reject') return save({ analytics: false, functional: false });
      if (kind === 'prefs') {
        var panel = banner.querySelector('[data-cookie-prefs]');
        var opening = panel && !panel.classList.contains('show');
        if (panel) panel.classList.toggle('show');
        if (opening) syncBoxes();
        return;
      }
      if (kind === 'save') {
        var prefs = {};
        banner.querySelectorAll('input[data-cat]').forEach(function (box) {
          prefs[box.getAttribute('data-cat')] = box.checked;
        });
        return save(prefs);
      }
    });
  }

  // "Cookie settings" links anywhere on the site
  document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
    el.addEventListener('click', function (ev) { ev.preventDefault(); openBanner(true); });
  });
})();
