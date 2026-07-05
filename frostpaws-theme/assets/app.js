/* FrostPaws Premium v2 — vanilla JS, no dependencies */
(function () {
  'use strict';
  var FP = window.FP || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- money (uses the shop's real money format) ---------- */
  var moneyFormat = FP.moneyFormat || '${{amount}}';
  function formatMoney(cents) {
    var m = moneyFormat.match(/\{\{\s*(\w+)\s*\}\}/);
    var key = m ? m[1] : 'amount';
    function fmt(p, thou, dec) {
      var parts = (cents / 100).toFixed(p).split('.');
      var whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thou);
      return parts[1] ? whole + dec + parts[1] : whole;
    }
    var val;
    switch (key) {
      case 'amount_no_decimals': val = fmt(0, ',', '.'); break;
      case 'amount_with_comma_separator': val = fmt(2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': val = fmt(0, '.', ','); break;
      case 'amount_with_apostrophe_separator': val = fmt(2, "'", '.'); break;
      default: val = fmt(2, ',', '.');
    }
    return moneyFormat.replace(/\{\{\s*\w+\s*\}\}/, val);
  }

  /* ---------- fade-up reveal on scroll ---------- */
  var fxEls = document.querySelectorAll('.fx:not(.in)');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fxEls.forEach(function (el) { io.observe(el); });
  } else {
    fxEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- snowflakes (hero only, 9 elements, GPU-cheap) ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-flakes]').forEach(function (zone) {
      for (var i = 0; i < 9; i++) {
        var f = document.createElement('span');
        f.className = 'flake';
        f.textContent = '❄';
        f.style.left = Math.random() * 100 + '%';
        f.style.fontSize = 8 + Math.random() * 10 + 'px';
        f.style.animationDuration = 9 + Math.random() * 10 + 's';
        f.style.animationDelay = -Math.random() * 12 + 's';
        f.style.opacity = 0.25 + Math.random() * 0.35;
        zone.appendChild(f);
      }
    });
  }

  /* ---------- cart count ---------- */
  function refreshCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (c) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = c.item_count; });
      })
      .catch(function () {});
  }

  /* ---------- FAQ: buttery-smooth accordion ---------- */
  document.querySelectorAll('[data-faq]').forEach(function (d) {
    var summary = d.querySelector('summary');
    var body = d.querySelector('.a');
    if (!summary || !body) return;
    summary.addEventListener('click', function (e) {
      if (reduceMotion) return; /* native instant toggle */
      e.preventDefault();
      if (d.classList.contains('animating')) return;
      d.classList.add('animating');
      function done() { body.style.height = ''; d.classList.remove('animating'); }
      if (d.open) {
        body.style.height = body.scrollHeight + 'px';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { body.style.height = '0px'; });
        });
        setTimeout(function () { d.open = false; done(); }, 320);
      } else {
        d.open = true;
        var h = body.scrollHeight;
        body.style.height = '0px';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { body.style.height = h + 'px'; });
        });
        setTimeout(done, 320);
      }
    });
  });

  /* ---------- reviews carousel (scroll-snap + arrows) ---------- */
  document.querySelectorAll('[data-rev-track]').forEach(function (track) {
    var wrap = track.parentElement;
    var prev = wrap.querySelector('[data-rev-prev]');
    var next = wrap.querySelector('[data-rev-next]');
    function step() {
      var card = track.querySelector('.rev');
      return card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.9;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  });

  /* ---------- buy box ---------- */
  document.querySelectorAll('[data-buybox]').forEach(initBuyBox);

  function initBuyBox(box) {
    var jsonEl = box.querySelector('[data-product-json]');
    if (!jsonEl) return;
    var data, variants;
    try { data = JSON.parse(jsonEl.textContent); variants = data.variants; } catch (e) { return; }
    if (!variants || !variants.length) return;

    var state = { variantId: +box.dataset.selected || variants[0].id, qty: 1, off: 0 };
    var preselected = box.querySelector('.bundle.on');
    if (preselected) {
      state.qty = +preselected.dataset.qty || 1;
      state.off = (+preselected.dataset.off || 0) / 100;
    }

    var form = box.querySelector('[data-buy-form]') || box.querySelector('.atc-form');
    var sticky = document.querySelector('[data-sticky]');
    var atcLabel = box.dataset.atcLabel || 'Add to Cart';
    var soldoutLabel = box.dataset.soldoutLabel || 'Sold Out';

    function cur() {
      for (var i = 0; i < variants.length; i++) if (variants[i].id === state.variantId) return variants[i];
      return variants[0];
    }
    function q(sel) { return box.querySelector(sel); }
    function qa(sel) { return box.querySelectorAll(sel); }

    function render() {
      var v = cur();
      var unit = v.price;
      var cmp = v.compare_at_price || 0;

      var priceEl = q('[data-price]');
      if (priceEl) priceEl.textContent = formatMoney(unit);
      var cmpEl = q('[data-compare]');
      if (cmpEl) {
        if (cmp > unit) { cmpEl.textContent = formatMoney(cmp); cmpEl.hidden = false; }
        else cmpEl.hidden = true;
      }
      var offB = q('[data-off-badge]');
      if (offB) {
        if (cmp > unit) { offB.textContent = '-' + Math.round((1 - unit / cmp) * 100) + '%'; offB.hidden = false; }
        else offB.hidden = true;
      }

      qa('.bundle').forEach(function (b) {
        var bq = +b.dataset.qty || 1;
        var boff = (+b.dataset.off || 0) / 100;
        var base = (cmp > unit ? cmp : unit) * bq;
        var total = Math.round(unit * bq * (1 - boff));
        var on = bq === state.qty;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        var pe = b.querySelector('[data-b-price]');
        if (pe) pe.textContent = formatMoney(total);
        var we = b.querySelector('[data-b-was]');
        if (we) {
          if (base > total) { we.textContent = formatMoney(base); we.hidden = false; }
          else we.hidden = true;
        }
        var se = b.querySelector('[data-b-save]');
        if (se) {
          if (base > total) { se.textContent = 'Save ' + formatMoney(base - total); se.classList.remove('muted'); }
          else { se.textContent = formatMoney(unit) + ' / mat'; se.classList.add('muted'); }
        }
      });

      var total = Math.round(unit * state.qty * (1 - state.off));
      var base = (cmp > unit ? cmp : unit) * state.qty;
      var save = base - total;

      var cta = q('[data-cta-text]');
      var atc = q('[data-atc]');
      if (!v.available) {
        if (cta) cta.textContent = soldoutLabel;
        if (atc) atc.disabled = true;
      } else {
        if (atc) atc.disabled = false;
        if (cta) cta.textContent = (state.qty > 1 ? 'Add ' + state.qty + ' — ' : atcLabel + ' — ') + formatMoney(total);
      }

      var line = q('[data-save-line]');
      if (line) {
        if (save > 0 && v.available) { line.textContent = "You're saving " + formatMoney(save) + ' ✓'; line.hidden = false; }
        else line.hidden = true;
      }

      var idIn = q('[data-form-id]'); if (idIn) idIn.value = state.variantId;
      var qtyIn = q('[data-form-qty]'); if (qtyIn) qtyIn.value = state.qty;

      if (sticky) {
        var st = sticky.querySelector('[data-sticky-title]');
        if (st) st.textContent = (state.qty > 1 ? state.qty + ' × ' : '') + data.title;
        var ss = sticky.querySelector('[data-sticky-save]');
        if (ss) ss.textContent = save > 0 ? 'You save ' + formatMoney(save) : formatMoney(total);
      }
    }

    /* variant pills */
    qa('.pill[data-variant]').forEach(function (p) {
      p.addEventListener('click', function () {
        if (p.classList.contains('soldout')) return;
        qa('.pill').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
        p.classList.add('on');
        p.setAttribute('aria-pressed', 'true');
        state.variantId = +p.dataset.variant;
        render();
      });
    });

    /* bundles */
    qa('.bundle').forEach(function (b) {
      b.addEventListener('click', function () {
        state.qty = +b.dataset.qty || 1;
        state.off = (+b.dataset.off || 0) / 100;
        render();
      });
    });

    /* quantity stepper fallback */
    var qtyInput = q('[data-qty-input]');
    if (qtyInput) {
      var setQty = function (n) {
        n = Math.max(1, Math.floor(+n) || 1);
        qtyInput.value = n;
        state.qty = n;
        render();
      };
      var minus = q('[data-qty-minus]');
      var plus = q('[data-qty-plus]');
      if (minus) minus.addEventListener('click', function () { setQty(+qtyInput.value - 1); });
      if (plus) plus.addEventListener('click', function () { setQty(+qtyInput.value + 1); });
      qtyInput.addEventListener('change', function () { setQty(qtyInput.value); });
    }

    /* gallery thumbs (with fade) */
    var mainImg = document.querySelector('[data-gallery-main]');
    document.querySelectorAll('[data-thumb]').forEach(function (t) {
      t.addEventListener('click', function () {
        if (!mainImg) return;
        document.querySelectorAll('[data-thumb]').forEach(function (x) { x.classList.remove('on'); });
        t.classList.add('on');
        var pre = new Image();
        mainImg.style.opacity = '0';
        pre.onload = function () {
          mainImg.removeAttribute('srcset');
          mainImg.src = t.dataset.full;
          mainImg.style.opacity = '1';
        };
        pre.src = t.dataset.full;
      });
    });

    /* add to cart (AJAX, graceful errors) */
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = cur();
        if (!v.available) return;
        var btn = q('[data-atc]');
        var cta = q('[data-cta-text]');
        var err = q('[data-form-error]');
        if (err) err.hidden = true;
        if (btn) btn.classList.add('loading');
        if (cta) cta.textContent = 'Adding… ❄️';
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: state.variantId, quantity: state.qty })
        }).then(function (r) {
          if (!r.ok) return r.json().then(function (j) { throw new Error(j.description || 'Could not add to cart. Please try again.'); });
          return r.json();
        }).then(function () {
          if (cta) cta.textContent = 'Added ✓';
          refreshCartCount();
          if (btn) btn.classList.remove('loading');
          if (box.dataset.redirect === '1') {
            setTimeout(function () { window.location.href = (FP.routes && FP.routes.cart) || '/cart'; }, 450);
          } else {
            setTimeout(render, 1400);
          }
        }).catch(function (ex) {
          if (btn) btn.classList.remove('loading');
          if (err) { err.textContent = ex.message; err.hidden = false; }
          render();
        });
      });
    }

    /* sticky ATC — visible whenever the buy form is off-screen */
    if (sticky && form) {
      if ('IntersectionObserver' in window) {
        var sio = new IntersectionObserver(function (entries) {
          var visible = entries[0].isIntersecting;
          sticky.classList.toggle('show', !visible);
          sticky.setAttribute('aria-hidden', visible ? 'true' : 'false');
        }, { rootMargin: '0px 0px -70px 0px' });
        sio.observe(form);
      }
      var sbtn = sticky.querySelector('[data-sticky-submit]');
      if (sbtn) {
        sbtn.addEventListener('click', function () {
          if (typeof form.requestSubmit === 'function') form.requestSubmit();
          else form.dispatchEvent(new Event('submit', { cancelable: true }));
        });
      }
    }

    render();
  }

  refreshCartCount();
})();
