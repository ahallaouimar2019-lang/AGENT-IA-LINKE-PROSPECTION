/* ============================================================
   Authentique MA — global.js
   ============================================================ */
(function () {
  'use strict';

  var money = window.Authentique && window.Authentique.moneyFormat ? window.Authentique.moneyFormat : '{{amount}} MAD';

  /* ---------- Toast ---------- */
  function toast(message) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    setTimeout(function () {
      el.classList.remove('is-visible');
      setTimeout(function () { el.remove(); }, 400);
    }, 3200);
  }
  window.authToast = toast;

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var drawer = document.querySelector('[data-mobile-nav]');
    if (!toggle || !drawer) return;
    var close = drawer.querySelector('[data-nav-close]');
    function open() { drawer.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function shut() { drawer.classList.remove('is-open'); document.body.style.overflow = ''; }
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    drawer.addEventListener('click', function (e) { if (e.target === drawer) shut(); });
  }

  /* ---------- Product gallery ---------- */
  function initGallery() {
    var gallery = document.querySelector('[data-gallery]');
    if (!gallery) return;
    var mainImg = gallery.querySelector('[data-gallery-main] img');
    var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var full = thumb.getAttribute('data-full');
        if (mainImg && full) { mainImg.src = full; mainImg.srcset = ''; }
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });
  }

  /* ---------- Product tabs ---------- */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
      var tabs = wrap.querySelectorAll('[data-tab]');
      var panels = wrap.querySelectorAll('[data-panel]');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = tab.getAttribute('data-tab');
          tabs.forEach(function (t) { t.classList.remove('is-active'); });
          panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-panel') === target); });
          tab.classList.add('is-active');
        });
      });
    });
  }

  /* ---------- Quantity selectors ---------- */
  function initQty() {
    document.querySelectorAll('[data-qty]').forEach(function (wrap) {
      var input = wrap.querySelector('input');
      wrap.querySelectorAll('[data-qty-btn]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var step = parseInt(btn.getAttribute('data-qty-btn'), 10);
          var val = Math.max(1, (parseInt(input.value, 10) || 1) + step);
          input.value = val;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    });
  }

  /* ---------- Add to cart (AJAX) ---------- */
  function initAddToCart() {
    document.querySelectorAll('[data-product-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        var original = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = '...'; }
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(serializeForm(form))
        })
          .then(function (r) { return r.json(); })
          .then(function () { return fetch('/cart.js').then(function (r) { return r.json(); }); })
          .then(function (cart) {
            updateCartCount(cart.item_count);
            toast(form.getAttribute('data-success') || 'Ajouté au panier ✅');
          })
          .catch(function () { toast('Une erreur est survenue. Réessayez.'); })
          .finally(function () { if (btn) { btn.disabled = false; btn.innerHTML = original; } });
      });
    });
  }

  function serializeForm(form) {
    var id = form.querySelector('[name="id"]');
    var qty = form.querySelector('[name="quantity"]');
    var payload = { id: id ? id.value : null, quantity: qty ? parseInt(qty.value, 10) || 1 : 1, properties: {} };
    form.querySelectorAll('[name^="properties["]').forEach(function (el) {
      var key = el.name.replace('properties[', '').replace(']', '');
      if (el.value) payload.properties[key] = el.value;
    });
    return payload;
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  /* ---------- Add to cart button (inside COD form) ---------- */
  function initAddToCartButtons() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var form = btn.closest('form');
        if (!form) return;
        var original = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '...';
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(serializeForm(form))
        })
          .then(function (r) { return r.json(); })
          .then(function () { return fetch('/cart.js').then(function (r) { return r.json(); }); })
          .then(function (cart) {
            updateCartCount(cart.item_count);
            toast(form.getAttribute('data-success') || 'Ajouté au panier ✅');
          })
          .catch(function () { toast('Une erreur est survenue. Réessayez.'); })
          .finally(function () { btn.disabled = false; btn.innerHTML = original; });
      });
    });
  }

  /* ---------- COD form ---------- */
  function initCodForm() {
    document.querySelectorAll('[data-cod-form]').forEach(function (form) {
      var errorEl = form.querySelector('[data-cod-error]');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = form.querySelector('[name="properties[Nom]"]');
        var phone = form.querySelector('[name="properties[Téléphone]"]');
        var city = form.querySelector('[name="properties[Ville]"]');
        var address = form.querySelector('[name="properties[Adresse]"]');
        function showError(msg) { if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('is-visible'); } }
        if (errorEl) errorEl.classList.remove('is-visible');

        if (!name.value.trim() || !phone.value.trim() || !city.value.trim() || !address.value.trim()) {
          showError(form.getAttribute('data-error-required') || 'Merci de remplir tous les champs.');
          return;
        }
        var digits = phone.value.replace(/\D/g, '');
        if (digits.length < 9) {
          showError(form.getAttribute('data-error-phone') || 'Numéro de téléphone invalide.');
          return;
        }

        var btn = form.querySelector('[type="submit"]');
        var original = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = '...'; }

        var note = 'COMMANDE COD — ' + name.value + ' | Tél: ' + phone.value + ' | Ville: ' + city.value + ' | Adresse: ' + address.value;

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(serializeForm(form))
        })
          .then(function (r) { return r.json(); })
          .then(function () {
            return fetch('/cart/update.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ note: note })
            });
          })
          .then(function () { window.location.href = '/checkout'; })
          .catch(function () {
            if (btn) { btn.disabled = false; btn.innerHTML = original; }
            showError('Une erreur est survenue. Réessayez ou commandez via WhatsApp.');
          });
      });
    });
  }

  /* ---------- Newsletter / contact success handled by Shopify natively ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initGallery();
    initTabs();
    initQty();
    initAddToCart();
    initAddToCartButtons();
    initCodForm();
  });
})();
