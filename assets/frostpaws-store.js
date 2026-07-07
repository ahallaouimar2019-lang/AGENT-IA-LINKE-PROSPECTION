/* ============================================================
   FrostPaws™ — Storefront interactions
   Cart AJAX + drawer, variants, sticky ATC, quantity, predictive
   search, wishlist, recently viewed. Progressive enhancement.
   ============================================================ */
(function () {
  'use strict';
  var FP = window.FrostPaws || {};
  var routes = FP.routes || { cart_add: '/cart/add', cart_change: '/cart/change', cart: '/cart', predictive: '/search/suggest' };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function money(cents) {
    try {
      return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: (FP.currency || 'USD') });
    } catch (e) { return '$' + (cents / 100).toFixed(2); }
  }

  /* ---------------- Cart ---------------- */
  function refreshCartUI() {
    return Promise.all([
      fetch(routes.cart + '.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }),
      fetch('?sections=cart-drawer', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); })
    ]).then(function (res) {
      var cart = res[0], sections = res[1];
      updateBubble(cart.item_count);
      if (sections && sections['cart-drawer']) {
        var doc = new DOMParser().parseFromString(sections['cart-drawer'], 'text/html');
        var fresh = doc.querySelector('[data-fp-cart-drawer]');
        var current = $('[data-fp-cart-drawer]');
        if (fresh && current) current.innerHTML = fresh.innerHTML;
      }
      document.dispatchEvent(new CustomEvent('fp:cart:updated', { detail: cart }));
      return cart;
    });
  }

  function updateBubble(count) {
    $$('[data-fp-cart-bubble]').forEach(function (b) {
      b.textContent = count;
      if (count > 0) b.removeAttribute('hidden'); else b.setAttribute('hidden', '');
    });
  }

  function addToCart(form, openDrawer) {
    var btn = form.querySelector('[data-fp-atc]') || form.querySelector('[type="submit"]');
    var label = btn && btn.querySelector('[data-fp-atc-text]');
    var prev = label ? label.textContent : '';
    if (btn) { btn.setAttribute('aria-busy', 'true'); btn.classList.add('is-loading'); }
    if (label) label.textContent = 'Adding…';
    var data = new FormData(form);
    return fetch(routes.cart_add + '.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) { throw res.body; }
        return refreshCartUI().then(function () {
          if (label) label.textContent = 'Added ✓';
          if (openDrawer) openCartDrawer();
          setTimeout(function () { if (label) label.textContent = prev; }, 1400);
        });
      })
      .catch(function (err) {
        if (label) label.textContent = prev;
        toast((err && err.description) || 'Could not add to cart.');
      })
      .finally(function () { if (btn) { btn.removeAttribute('aria-busy'); btn.classList.remove('is-loading'); } });
  }

  function changeLine(line, quantity) {
    return fetch(routes.cart_change + '.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    }).then(function () { return refreshCartUI(); });
  }

  /* ---------------- Drawers ---------------- */
  function openDrawer(el) {
    if (!el) return;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('fp-no-scroll');
    var focusable = el.querySelector('input, button, a, [tabindex]');
    if (focusable) focusable.focus();
  }
  function closeDrawer(el) {
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.fp-drawer.is-open')) document.documentElement.classList.remove('fp-no-scroll');
  }
  function openCartDrawer() { openDrawer($('[data-fp-cart-drawer]')); }

  /* ---------------- Quantity steppers (delegated) ---------------- */
  function stepQty(input, delta) {
    var v = parseInt(input.value, 10) || 0;
    var min = parseInt(input.min, 10); if (isNaN(min)) min = 1;
    v = Math.max(min, v + delta);
    input.value = v;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* ---------------- Variant picker ---------------- */
  function initVariantPicker(root) {
    $$('[data-fp-variant-picker]', root).forEach(function (picker) {
      var dataEl = picker.querySelector('[data-fp-variant-data]');
      if (!dataEl) return;
      var variants;
      try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }
      var section = picker.closest('[data-fp-product]');
      var idInput = section ? section.querySelector('[data-fp-variant-id]') : null;
      var priceEl = section ? section.querySelector('[data-fp-price]') : null;
      var stickyPrice = section ? section.querySelector('[data-fp-sticky-price]') : null;
      var atcBtn = section ? section.querySelector('[data-fp-atc]') : null;
      var atcText = section ? section.querySelector('[data-fp-atc-text]') : null;

      function selectedOptions() {
        return $$('.fp-variant-input:checked', picker).sort(function (a, b) {
          return (+a.dataset.optionIndex) - (+b.dataset.optionIndex);
        }).map(function (i) { return i.value; });
      }
      function update() {
        var opts = selectedOptions();
        $$('[data-option-selected]', picker).forEach(function (span) {
          var idx = +span.getAttribute('data-option-selected');
          if (opts[idx] != null) span.textContent = opts[idx];
        });
        var match = variants.find(function (v) {
          return v.options.every(function (o, i) { return o === opts[i]; });
        });
        if (!match) return;
        if (idInput) idInput.value = match.id;
        var url = new URL(window.location.href);
        url.searchParams.set('variant', match.id);
        window.history.replaceState({}, '', url);
        if (priceEl) priceEl.innerHTML = priceHTML(match);
        if (stickyPrice) stickyPrice.textContent = money(match.price);
        if (atcBtn) {
          atcBtn.disabled = !match.available;
          if (atcText) atcText.textContent = match.available ? (atcBtn.getAttribute('data-label') || atcText.textContent) : 'Sold out';
        }
        document.dispatchEvent(new CustomEvent('fp:variant:changed', { detail: match }));
      }
      function priceHTML(v) {
        var html = '<span class="fp-price">';
        if (v.compare_at_price > v.price) {
          html += '<span class="fp-price__amount fp-tabular">' + money(v.price) + '</span>';
          html += '<s class="fp-price__was fp-tabular">' + money(v.compare_at_price) + '</s>';
        } else {
          html += '<span class="fp-price__amount fp-tabular">' + money(v.price) + '</span>';
        }
        return html + '</span>';
      }
      picker.addEventListener('change', function (e) {
        if (e.target.classList.contains('fp-variant-input')) update();
      });
    });
  }

  /* ---------------- Product media gallery ---------------- */
  function initGallery(root) {
    $$('[data-fp-gallery]', root).forEach(function (g) {
      g.addEventListener('click', function (e) {
        var thumb = e.target.closest('.fp-product-gallery__thumb');
        if (!thumb) return;
        var id = thumb.getAttribute('data-media-id');
        $$('.fp-product-gallery__thumb', g).forEach(function (t) { t.classList.toggle('is-active', t === thumb); });
        $$('.fp-product-gallery__slide', g).forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-media-id') === id); });
      });
    });
  }

  /* ---------------- Sticky ATC visibility ---------------- */
  function initStickyATC(root) {
    var bar = $('[data-fp-sticky-atc]', root);
    var anchor = $('[data-fp-product] .fp-buy-actions', root) || $('[data-fp-product]', root);
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { bar.hidden = e.isIntersecting; });
    }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(anchor);
  }

  /* ---------------- Predictive search ---------------- */
  function initPredictive(root) {
    var input = $('[data-fp-predictive-input]', root);
    var results = $('[data-fp-predictive-results]', root);
    if (!input || !results) return;
    var t, controller;
    input.addEventListener('input', function () {
      var q = input.value.trim();
      clearTimeout(t);
      if (q.length < 2) { return; }
      t = setTimeout(function () {
        if (controller) controller.abort();
        controller = new AbortController();
        var url = routes.predictive + '?q=' + encodeURIComponent(q) +
          '&section_id=predictive-search&resources[type]=product,collection,query&resources[limit]=6';
        fetch(url, { signal: controller.signal, headers: { 'Accept': 'text/html' } })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var content = doc.querySelector('.fp-predictive') || doc.body;
            results.innerHTML = content ? content.outerHTML : html;
            input.setAttribute('aria-expanded', 'true');
          }).catch(function () {});
      }, 220);
    });
  }

  /* ---------------- Wishlist (localStorage, wishlist-ready) ---------------- */
  var WKEY = 'fp_wishlist';
  function getWishlist() { try { return JSON.parse(localStorage.getItem(WKEY)) || []; } catch (e) { return []; } }
  function setWishlist(a) { localStorage.setItem(WKEY, JSON.stringify(a)); document.dispatchEvent(new CustomEvent('fp:wishlist:changed', { detail: a })); }
  function initWishlist(root) {
    var list = getWishlist();
    $$('[data-fp-wishlist]', root).forEach(function (btn) {
      var id = btn.getAttribute('data-fp-wishlist');
      var on = list.indexOf(id) > -1;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-active', on);
    });
  }

  /* ---------------- Recently viewed ---------------- */
  var RKEY = 'fp_recently_viewed';
  function trackRecentlyViewed() {
    var el = $('[data-fp-product-summary]');
    if (!el) return;
    var data; try { data = JSON.parse(el.textContent); } catch (e) { return; }
    var list; try { list = JSON.parse(localStorage.getItem(RKEY)) || []; } catch (e) { list = []; }
    list = list.filter(function (p) { return p.id !== data.id; });
    list.unshift(data);
    list = list.slice(0, 12);
    localStorage.setItem(RKEY, JSON.stringify(list));
  }
  function renderRecentlyViewed(root) {
    var sec = $('[data-fp-recently-viewed]', root);
    if (!sec) return;
    var grid = sec.querySelector('[data-fp-recently-viewed-grid]');
    var current = sec.getAttribute('data-current');
    var limit = parseInt(sec.getAttribute('data-limit'), 10) || 4;
    var list; try { list = JSON.parse(localStorage.getItem(RKEY)) || []; } catch (e) { list = []; }
    list = list.filter(function (p) { return String(p.id) !== String(current); }).slice(0, limit);
    if (!list.length) return;
    grid.innerHTML = list.map(function (p) {
      var img = p.image
        ? '<img class="fp-media__img fp-product__img" src="' + p.image + '" alt="' + esc(p.title) + '" loading="lazy">'
        : '';
      return '<article class="fp-product fp-card fp-card--interactive">' +
        '<a class="fp-product__link" href="' + p.url + '"><div class="fp-product__media"><div class="fp-media" style="aspect-ratio:1/1;">' + img + '</div></div></a>' +
        '<div class="fp-product__info"><h3 class="fp-product__title"><a href="' + p.url + '">' + esc(p.title) + '</a></h3>' +
        '<div class="fp-product__row"><span class="fp-price"><span class="fp-price__amount fp-tabular">' + (p.price || '') + '</span></span></div></div></article>';
    }).join('');
    sec.hidden = false;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  /* ---------------- Toast ---------------- */
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'fp-toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-in'); });
    setTimeout(function () { t.classList.remove('is-in'); setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  /* ---------------- Global delegated events ---------------- */
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-fp-cart-open]');
    if (open) { e.preventDefault(); openCartDrawer(); return; }
    if (e.target.closest('[data-fp-drawer-close]')) { closeDrawer($('[data-fp-cart-drawer]')); return; }
    if (e.target.closest('[data-fp-search-open]')) { e.preventDefault(); openDrawer($('[data-fp-search-drawer]')); var i = $('[data-fp-predictive-input]'); if (i) setTimeout(function(){ i.focus(); }, 50); return; }
    if (e.target.closest('[data-fp-search-close]')) { closeDrawer($('[data-fp-search-drawer]')); return; }

    var minus = e.target.closest('[data-qty-minus],[data-line-minus]');
    var plus = e.target.closest('[data-qty-plus],[data-line-plus]');
    if (minus) { var im = minus.parentElement.querySelector('input'); if (im) stepQty(im, -1); return; }
    if (plus) { var ip = plus.parentElement.querySelector('input'); if (ip) stepQty(ip, 1); return; }

    var rem = e.target.closest('[data-line-remove]');
    if (rem) { e.preventDefault(); changeLine(parseInt(rem.getAttribute('data-line-remove'), 10), 0); return; }

    var wish = e.target.closest('[data-fp-wishlist]');
    if (wish) {
      e.preventDefault();
      var id = wish.getAttribute('data-fp-wishlist');
      var list = getWishlist(); var idx = list.indexOf(id);
      if (idx > -1) list.splice(idx, 1); else list.push(id);
      setWishlist(list);
      var on = list.indexOf(id) > -1;
      wish.setAttribute('aria-pressed', on ? 'true' : 'false');
      wish.classList.toggle('is-active', on);
      return;
    }

    var toggle = e.target.closest('[data-fp-toggle]');
    if (toggle) {
      e.preventDefault();
      var show = $(toggle.getAttribute('data-fp-toggle'));
      var hide = toggle.getAttribute('data-fp-hide') ? $(toggle.getAttribute('data-fp-hide')) : null;
      if (show) show.hidden = false;
      if (hide) hide.hidden = true;
      return;
    }
    var addrToggle = e.target.closest('[data-fp-address-toggle]');
    if (addrToggle) { var box = $(addrToggle.getAttribute('data-fp-address-toggle')); if (box) box.hidden = !box.hidden; return; }
  });

  document.addEventListener('change', function (e) {
    var lineInput = e.target.closest('[data-line-qty-input]');
    if (lineInput) {
      var line = parseInt(lineInput.getAttribute('data-line'), 10);
      var qty = parseInt(lineInput.value, 10);
      if (!isNaN(line) && !isNaN(qty)) changeLine(line, qty);
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.matches('#fp-product-form') || form.getAttribute('action') === routes.cart_add) {
      e.preventDefault();
      addToCart(form, true);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { $$('.fp-drawer.is-open').forEach(closeDrawer); }
  });

  /* ---------------- Init ---------------- */
  function initAll(root) {
    initVariantPicker(root);
    initGallery(root);
    initStickyATC(root);
    initPredictive(root);
    initWishlist(root);
    renderRecentlyViewed(root);
  }
  function boot() { trackRecentlyViewed(); initAll(document); }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('fp:cart:updated', function () { initWishlist(document); });
})();
