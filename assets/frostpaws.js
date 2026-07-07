/* ============================================================
   FrostPaws™ — Theme interactions
   Progressive enhancement: everything degrades gracefully.
   ============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  function initReveals(root) {
    var els = Array.prototype.slice.call((root || document).querySelectorAll('.fp-reveal:not(.is-in)'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    // subtle stagger for siblings that reveal together
    els.forEach(function (el) {
      var i = 0, sib = el;
      while ((sib = sib.previousElementSibling)) { if (sib.classList && sib.classList.contains('fp-reveal')) i++; }
      if (i > 0) el.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero auto slider ---------- */
  function initHeroSliders(root) {
    (root || document).querySelectorAll('[data-fp-hero-slider]').forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('.fp-slide'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('.fp-hero__dot'));
      if (slides.length < 2) return;
      var i = 0, timer = null;
      var interval = parseInt(slider.getAttribute('data-interval'), 10) || 5000;
      function go(n) {
        i = (n + slides.length) % slides.length;
        slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
        dots.forEach(function (d, k) {
          d.classList.toggle('is-active', k === i);
          d.setAttribute('aria-selected', k === i ? 'true' : 'false');
        });
      }
      function start() { if (!reduceMotion) { stop(); timer = setInterval(function () { go(i + 1); }, interval); } }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); start(); }); });
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
      slider.addEventListener('focusin', stop);
      slider.addEventListener('focusout', start);
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
      go(0); start();
    });
  }

  /* ---------- Size guide <-> product selector sync ---------- */
  function initSizeGuide(root) {
    (root || document).querySelectorAll('[data-fp-size-guide]').forEach(function (guide) {
      var cards = Array.prototype.slice.call(guide.querySelectorAll('.fp-size-card'));
      var chips = Array.prototype.slice.call(guide.querySelectorAll('.fp-size-chip'));
      function select(size) {
        cards.forEach(function (c) {
          var on = c.getAttribute('data-size') === size;
          c.classList.toggle('is-selected', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        chips.forEach(function (ch) {
          var on = ch.getAttribute('data-size') === size;
          ch.classList.toggle('is-selected', on);
          ch.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }
      cards.forEach(function (c) {
        c.addEventListener('click', function () { select(c.getAttribute('data-size')); });
        c.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(c.getAttribute('data-size')); }
        });
      });
      chips.forEach(function (ch) {
        ch.addEventListener('click', function () {
          var size = ch.getAttribute('data-size');
          select(size);
          var card = guide.querySelector('.fp-size-card[data-size="' + size + '"]');
          if (card && card.scrollIntoView) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
        });
      });
    });
  }

  /* ---------- Color variants ---------- */
  function initColorVariants(root) {
    (root || document).querySelectorAll('[data-fp-colors]').forEach(function (block) {
      var swatches = Array.prototype.slice.call(block.querySelectorAll('.fp-swatch'));
      var layers = Array.prototype.slice.call(block.querySelectorAll('.fp-colors__stage .fp-media'));
      function select(idx) {
        swatches.forEach(function (s, k) {
          s.classList.toggle('is-selected', k === idx);
          s.setAttribute('aria-pressed', k === idx ? 'true' : 'false');
        });
        layers.forEach(function (l, k) { l.classList.toggle('is-active', k === idx); });
      }
      swatches.forEach(function (s, k) { s.addEventListener('click', function () { select(k); }); });
      if (swatches.length) select(0);
    });
  }

  /* ---------- Before / After slider ---------- */
  function initBeforeAfter(root) {
    (root || document).querySelectorAll('[data-fp-before-after]').forEach(function (ba) {
      var range = ba.querySelector('.fp-ba__range');
      if (!range) return;
      function set(v) { ba.style.setProperty('--fp-ba-pos', v + '%'); }
      range.addEventListener('input', function () { set(range.value); });
      set(range.value || 50);
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu(root) {
    (root || document).querySelectorAll('[data-fp-menu-toggle]').forEach(function (btn) {
      var target = document.getElementById(btn.getAttribute('aria-controls'));
      if (!target) return;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        target.hidden = open;
      });
    });
  }

  /* ---------- Sticky header scroll state ---------- */
  function initHeaderScroll() {
    var header = document.querySelector('.fp-header');
    if (!header) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initAll(root) {
    initReveals(root);
    initHeroSliders(root);
    initSizeGuide(root);
    initColorVariants(root);
    initBeforeAfter(root);
    initMenu(root);
  }

  if (document.readyState !== 'loading') { initAll(document); initHeaderScroll(); }
  else document.addEventListener('DOMContentLoaded', function () { initAll(document); initHeaderScroll(); });

  /* Re-init sections edited in the Shopify Theme Editor */
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
})();
