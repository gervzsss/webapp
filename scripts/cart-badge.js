/* cart-badge.js
   Renders a small badge near elements with class .cart-link that shows
   the total item count from localStorage key `prototype_cart_v1`.
   Listens for `cart:updated` custom events and storage events to update
   across tabs. Adds a small pulse animation when the count changes.
*/
(function () {
  const CART_KEY = 'prototype_cart_v1';

  function readCartCount() {
    try {
      const raw = localStorage.getItem(CART_KEY) || '[]';
      const cart = JSON.parse(raw);
      if (!Array.isArray(cart)) return 0;
      return cart.reduce((s, i) => s + (Number(i.qty) || 0), 0);
    } catch (e) { return 0; }
  }

  function findOrCreateBadge() {
    // find the first .cart-link in the navbar area
    const cartLink = document.querySelector('.cart-link');
    if (!cartLink) return null;
    let badge = cartLink.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.setAttribute('aria-label', 'Cart items count');
      badge.setAttribute('role', 'status');
      cartLink.appendChild(badge);
    }
    return badge;
  }

  let lastCount = null;

  function renderBadge() {
    const badge = findOrCreateBadge();
    if (!badge) return;
    const count = readCartCount();
    if (!count) {
      badge.classList.remove('show');
      badge.textContent = '';
    } else {
      badge.textContent = String(count);
      // if count changed, pulse
      if (lastCount !== null && lastCount !== count) {
        badge.classList.remove('pulse');
        // force reflow
        void badge.offsetWidth;
        badge.classList.add('pulse');
      }
      badge.classList.add('show');
    }
    lastCount = count;
  }

  // Update when the custom event is dispatched within the page
  window.addEventListener('cart:updated', renderBadge);

  // Update when localStorage changes in other tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) renderBadge();
  });

  // initial render on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    renderBadge();
  });

  // expose a small helper to dispatch update events when scripts do local changes
  window.CartBadge = { render: renderBadge };
})();
