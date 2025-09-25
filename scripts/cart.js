// cart UI script: update subtotals and order summary when quantity inputs change (static prototype)
(function () {
  // cart prototype with persistence in localStorage
  const STORAGE_KEY = 'prototype_cart_v1';
  const shipping = 25.00;
  let lastTotalString = null;

  const sample = [
    { id: 1, title: 'Elegant Wedding Dress', price: 200.00, qty: 1, img: 'images/wedding dress.jpg', meta: 'Size: S • Color: Ivory' },
    { id: 2, title: 'Pretty Ball Gown', price: 150.00, qty: 2, img: 'images/Pretty ball gown wedding dresses.jpg', meta: 'Size: M • Color: White' },
    { id: 3, title: 'Groom Sherwani', price: 199.00, qty: 1, img: 'images/Groom Wear For Indian Wedding Indian Wedding Sherwani For Groom.jpg', meta: 'Size: L • Color: Gold' }
  ];

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return sample.slice();
      return JSON.parse(raw);
    } catch (e) { return sample.slice(); }
  }

  function saveCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

  // dispatch helper to notify badge and other UI parts
  function notifyCartUpdated() { try { window.dispatchEvent(new Event('cart:updated')); } catch (e) { } }

  function formatPrice(n) { return '$' + Number(n).toFixed(2); }

  // render
  const cartList = document.getElementById('cartList');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryTotal = document.getElementById('summaryTotal');

  function render() {
    const cart = loadCart();
    cartList.innerHTML = '';
    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item d-flex align-items-center p-3 rounded-3 mb-3';
      el.dataset.id = item.id;

      el.innerHTML = `
        <div class="form-check">
          <input class="form-check-input select-item" type="checkbox" />
        </div>
        <div class="cart-media me-3"><img src="${item.img}" alt="${item.title}" /></div>
        <div class="flex-fill">
          <h5 class="mb-1">${item.title}</h5>
          <div class="meta text-light mb-2">${item.meta}</div>
          <div class="d-flex align-items-center gap-3">
            <div class="text-light">${formatPrice(item.price)}</div>
            <div class="quantity qty-control d-flex align-items-center">
              <button class="btn btn-qty btn-decrease" type="button" aria-label="Decrease">−</button>
              <label class="visually-hidden">Quantity</label>
              <input class="form-control form-control-sm qty qty-input text-center" type="number" min="1" value="${item.qty}" />
              <button class="btn btn-qty btn-increase" type="button" aria-label="Increase">+</button>
            </div>
            <div class="subtotal ms-auto fw-bold">${formatPrice(item.price * item.qty)}</div>
            <button class="btn btn-outline-light btn-sm ms-2 btn-remove">Remove</button>
          </div>
        </div>
      `;

      cartList.appendChild(el);
    });
    wireUI();
    recalc();
    updateSelectionSummary();
  }

  function recalc() {
    const cart = loadCart();
    let subtotal = 0;
    document.querySelectorAll('.cart-item').forEach(itemEl => {
      const id = Number(itemEl.dataset.id);
      const cartItem = cart.find(c => c.id === id) || { price: 0, qty: 0 };
      const subtotalEl = itemEl.querySelector('.subtotal');
      const s = cartItem.price * cartItem.qty;
      subtotalEl.textContent = formatPrice(s);
      subtotal += s;
    });
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryShipping.textContent = formatPrice(shipping);
    summaryTotal.textContent = formatPrice(subtotal + shipping);
    saveCart(cart);
    notifyCartUpdated();
  }

  // compute totals for only selected items and update the order summary UI + checkout button state
  function updateSelectionSummary() {
    const selectedEls = Array.from(document.querySelectorAll('.cart-item')).filter(el => el.querySelector('.select-item') && el.querySelector('.select-item').checked);
    const checkoutBtn = document.getElementById('checkoutBtn');
    // update checkout button label with count
    if (checkoutBtn) {
      const base = 'Proceed to Checkout';
      if (selectedEls.length) checkoutBtn.textContent = `${base} (${selectedEls.length} items)`;
      else checkoutBtn.textContent = base;
    }
    if (!selectedEls.length) {
      // disable order summary interactions
      document.querySelector('.order-summary').classList.add('disabled');
      summarySubtotal.textContent = '-';
      summaryShipping.textContent = '-';
      summaryTotal.textContent = '-';
      if (checkoutBtn) checkoutBtn.disabled = true;
      // remove selected visual state
      document.querySelectorAll('.cart-item').forEach(el => el.classList.remove('selected'));
      return;
    }

    document.querySelector('.order-summary').classList.remove('disabled');
    if (checkoutBtn) checkoutBtn.disabled = false;

    // compute subtotal for selected items only
    const cart = loadCart();
    let subtotal = 0;
    selectedEls.forEach(el => {
      const id = Number(el.dataset.id);
      const cartItem = cart.find(c => c.id === id);
      if (cartItem) {
        subtotal += cartItem.price * cartItem.qty;
        el.classList.add('selected');
      }
    });

    summarySubtotal.textContent = formatPrice(subtotal);
    summaryShipping.textContent = formatPrice(shipping);
    summaryTotal.textContent = formatPrice(subtotal + shipping);
  }

  // small toast helper that auto-fades (visuals in CSS)
  function showToast(message, timeout = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast-notice';
    t.innerText = message;
    container.appendChild(t);
    // entrance using CSS class
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 420);
    }, timeout);
  }

  function wireUI() {
    // quantity changes
    // input changes
    document.querySelectorAll('.qty').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const itemEl = e.target.closest('.cart-item');
        const id = Number(itemEl.dataset.id);
        let cart = loadCart();
        const idx = cart.findIndex(c => c.id === id);
        const val = Math.max(1, Math.floor(Number(e.target.value) || 1));
        e.target.value = val; // sanitize
        if (idx > -1) cart[idx].qty = val;
        saveCart(cart);
        // update subtotal for this row
        const price = cart[idx].price;
        itemEl.querySelector('.subtotal').textContent = formatPrice(price * val);
        recalc();
        flashTotalsIfChanged();
        updateSelectionSummary();
      });
    });

    // +/- buttons
    document.querySelectorAll('.btn-decrease').forEach(btn => btn.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.cart-item');
      const input = itemEl.querySelector('.qty');
      const cur = Math.max(1, Number(input.value) || 1);
      const next = Math.max(1, cur - 1);
      input.value = next;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }));

    document.querySelectorAll('.btn-increase').forEach(btn => btn.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.cart-item');
      const input = itemEl.querySelector('.qty');
      const cur = Math.max(1, Number(input.value) || 1);
      const next = cur + 1;
      input.value = next;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }));

    // press-and-hold support (mouse + touch) for continuous increment/decrement
    function attachHoldRepeater(btn, step) {
      let holdTimeout = null;
      let holdInterval = null;
      const INITIAL_DELAY = 420; // ms before repeating starts
      const REPEAT_RATE = 120; // ms between repeats

      function startHold() {
        // start repeating after initial delay
        holdTimeout = setTimeout(() => {
          // first tick immediately when repeating starts
          const itemEl = btn.closest('.cart-item');
          const input = itemEl.querySelector('.qty');
          const cur = Math.max(1, Number(input.value) || 1);
          const next = Math.max(1, cur + step);
          input.value = next;
          input.dispatchEvent(new Event('input', { bubbles: true }));

          holdInterval = setInterval(() => {
            const itemEl2 = btn.closest('.cart-item');
            const input2 = itemEl2.querySelector('.qty');
            const cur2 = Math.max(1, Number(input2.value) || 1);
            const next2 = Math.max(1, cur2 + step);
            input2.value = next2;
            input2.dispatchEvent(new Event('input', { bubbles: true }));
          }, REPEAT_RATE);
        }, INITIAL_DELAY);
      }

      function stopHold() {
        if (holdTimeout) { clearTimeout(holdTimeout); holdTimeout = null; }
        if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
      }

      // mouse
      btn.addEventListener('mousedown', (e) => { if (e.button === 0) startHold(); });
      btn.addEventListener('mouseup', stopHold);
      btn.addEventListener('mouseleave', stopHold);

      // touch
      btn.addEventListener('touchstart', (e) => { startHold(); }, { passive: true });
      btn.addEventListener('touchend', stopHold);
      btn.addEventListener('touchcancel', stopHold);
    }

    // attach to existing qty buttons
    document.querySelectorAll('.btn-decrease').forEach(btn => attachHoldRepeater(btn, -1));
    document.querySelectorAll('.btn-increase').forEach(btn => attachHoldRepeater(btn, +1));

    // remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => btn.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.cart-item');
      const id = Number(itemEl.dataset.id);
      let cart = loadCart();
      cart = cart.filter(c => c.id !== id);
      saveCart(cart);
      // animate removal
      itemEl.style.transition = 'opacity .24s ease, height .24s ease, margin .24s ease';
      itemEl.style.opacity = 0; itemEl.style.height = 0; itemEl.style.margin = 0;
      setTimeout(() => { render(); }, 260);
      // update badge
      notifyCartUpdated();
    }));

    // checkout modal
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);

    // selection checkboxes
    document.querySelectorAll('.select-item').forEach(chk => chk.addEventListener('change', (e) => {
      // keep aria and selected class in sync
      const itemEl = chk.closest('.cart-item');
      if (itemEl) {
        itemEl.setAttribute('aria-checked', chk.checked ? 'true' : 'false');
      }
      updateSelectionSummary();
    }));

    // make the entire cart-item clickable and keyboard-accessible to toggle selection
    document.querySelectorAll('.cart-item').forEach(itemEl => {
      // ensure keyboard focusable and announceable as a checkbox
      itemEl.tabIndex = 0;
      itemEl.setAttribute('role', 'checkbox');
      const chk = itemEl.querySelector('.select-item');
      if (chk) itemEl.setAttribute('aria-checked', chk.checked ? 'true' : 'false');

      // click handler toggles selection unless an interactive control was the target
      itemEl.addEventListener('click', (e) => {
        // ignore clicks on form controls or buttons so normal interactions still work
        if (e.target.closest('input, button, a, label, select, textarea')) return;
        if (!chk) return;
        chk.checked = !chk.checked;
        chk.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // keyboard (space/enter) toggles selection
      itemEl.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
          // prevent page scroll on space
          e.preventDefault();
          if (!chk) return;
          chk.checked = !chk.checked;
          chk.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });

    // select all checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
      selectAll.addEventListener('change', () => {
        const all = document.querySelectorAll('.select-item');
        all.forEach(i => i.checked = selectAll.checked);
        updateSelectionSummary();
      });
    }
  }

  // brief flash if total string changed
  function flashTotalsIfChanged() {
    const current = summaryTotal ? summaryTotal.textContent : null;
    if (!current) return;
    if (lastTotalString && lastTotalString !== current) {
      const container = document.querySelector('.order-summary');
      if (container) {
        container.classList.add('summary-flash');
        setTimeout(() => container.classList.remove('summary-flash'), 520);
      }
    }
    lastTotalString = current;
  }

  // simple modal (DOM-inserted)
  function openCheckout() {
    const modal = document.createElement('div');
    modal.className = 'quick-view-overlay open';
    modal.innerHTML = `
            <div class="quick-view-card">
                <div class="quick-view-body">
                    <h4>Checkout</h4>
                    <div class="mb-2"><input class="form-control form-control-sm" placeholder="Name" /></div>
                    <div class="mb-2"><input class="form-control form-control-sm" placeholder="Email" /></div>
                    <div class="mb-2"><input class="form-control form-control-sm" placeholder="Address" /></div>
                    <div class="d-flex gap-2 mt-3"><button id="confirmBtn" class="btn btn-cart">Confirm</button><button id="cancelBtn" class="btn btn-outline-light">Cancel</button></div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.getElementById('cancelBtn').addEventListener('click', () => modal.remove());
    document.getElementById('confirmBtn').addEventListener('click', () => {
      // On confirm: remove only selected items from cart and persist the remainder
      const cart = loadCart();
      const selectedIds = Array.from(document.querySelectorAll('.cart-item')).filter(el => el.querySelector('.select-item') && el.querySelector('.select-item').checked).map(el => Number(el.dataset.id));
      const newCart = cart.filter(c => !selectedIds.includes(c.id));
      saveCart(newCart);
      // show success and close modal, then re-render the page cart to show remaining items
      const count = selectedIds.length;
      modal.querySelector('.quick-view-card').innerHTML = `<div class="quick-view-body"><h4>Checkout successful</h4><p>${count} item(s) were checked out.</p><div class="mt-3"><button id="closeOk" class="btn btn-cart">Close</button></div></div>`;
      document.getElementById('closeOk').addEventListener('click', () => { modal.remove(); render(); if (count) showToast(`${count} item(s) have been checked out`); notifyCartUpdated(); });
    });
  }

  // init
  document.addEventListener('DOMContentLoaded', () => {
    // ensure initial cart exists
    if (!localStorage.getItem(STORAGE_KEY)) saveCart(sample.slice());
    render();
  });
})();
