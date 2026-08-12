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
    var current = 0;
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
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('active', n === current); });
      dots.forEach(function (d, n) { d.classList.toggle('on', n === current); });
      restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduced && slides.length > 1) timer = setInterval(function () { go(current + 1); }, DELAY);
    }

    var prev = slider.querySelector('[data-prev]');
    var next = slider.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { go(current - 1); });
    if (next) next.addEventListener('click', function () { go(current + 1); });

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
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = form.querySelector('.form-ok');
      if (ok) {
        ok.classList.add('show');
        ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      }
      form.reset();
    });
  });

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
