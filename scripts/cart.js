// cart UI script: update subtotals and order summary when quantity inputs change (static prototype)
(function () {
    function toNumber(str) { return Number(str.replace(/[^0-9.-]+/g, '')) || 0; }
    function formatPrice(n) { return '$' + Number(n).toFixed(2); }

    const qtyInputs = document.querySelectorAll('.qty');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');
    const shipping = 25.00; // static estimate

    function recalc() {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const priceEl = item.querySelector('.price');
            const qtyEl = item.querySelector('.qty');
            const subtotalEl = item.querySelector('.subtotal');
            const price = toNumber(priceEl.textContent);
            const qty = Number(qtyEl.value) || 1;
            const s = price * qty;
            subtotalEl.textContent = formatPrice(s);
            subtotal += s;
            item.classList.toggle('is-highlight', qty > 0);
        });
        summarySubtotal.textContent = formatPrice(subtotal);
        summaryShipping.textContent = formatPrice(shipping);
        summaryTotal.textContent = formatPrice(subtotal + shipping);
    }

    // wire events
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.qty').forEach(inp => inp.addEventListener('input', () => recalc()));
        recalc();
    });
})();
