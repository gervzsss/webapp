// Lightweight products renderer and UI interactions
// Features: product array, render grid, search, filters, sort, skeletons, quick-view, wishlist (localStorage)

(function () {
    // sample product data — map to available images in /images
    const PRODUCTS = [
        { id: 1, title: 'Elegant Wedding Dress', price: 200, rating: 4.6, category: 'Women', img: 'images/wedding dress.jpg', desc: 'Elegant long-sleeve ball gown with delicate lace.' },
        { id: 2, title: 'Casual Fall Wedding Attire', price: 100, rating: 4.1, category: 'Men', img: 'images/casual fall wedding attire.png', desc: 'Comfortable yet stylish autumn outfit suitable for casual weddings.' },
        { id: 3, title: 'Bride & Groom Matching', price: 400, rating: 4.8, category: 'Accessories', img: 'images/Bride And Groom Matching Dress For Wedding.jpg', desc: 'Coordinated set for couple photos with premium finishing.' },
        { id: 4, title: 'Pretty Ball Gown', price: 150, rating: 4.2, category: 'Women', img: 'images/Pretty ball gown wedding dresses.jpg', desc: 'Classic ball gown silhouette with soft tulle.' },
        { id: 5, title: 'Cathedral Style Dresses', price: 180, rating: 3.9, category: 'Women', img: 'images/Cathedral style wedding dresses.jpg', desc: 'Dramatic train and cathedral veil options.' },
        { id: 6, title: 'Groom Sherwani', price: 199, rating: 4.3, category: 'Men', img: 'images/Groom Wear For Indian Wedding Indian Wedding Sherwani For Groom.jpg', desc: 'Traditional sherwani with modern tailoring.' }
    ];

    // state
    let state = {
        products: PRODUCTS.slice(),
        query: '',
        categories: new Set(),
        maxPrice: 1000,
        minRating: 0,
        sort: 'newest',
        view: 'grid', // 'grid' or 'list'
        wishlist: new Set(JSON.parse(localStorage.getItem('wishlist') || '[]'))
    };

    // elements
    const container = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const priceRange = document.getElementById('priceRange');
    const priceVal = document.getElementById('priceVal');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortSelect = document.getElementById('sortSelect');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');

    const qv = document.getElementById('quickView');
    const qvImg = document.getElementById('qvImg');
    const qvTitle = document.getElementById('qvTitle');
    const qvPrice = document.getElementById('qvPrice');
    const qvDesc = document.getElementById('qvDesc');
    const qvClose = document.getElementById('qvClose');
    const qvAdd = document.getElementById('qvAdd');
    const qvWishlist = document.getElementById('qvWishlist');

    // helpers
    function showSkeletons() {
        container.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const s = document.createElement('div');
            s.className = 'skeleton-card';
            container.appendChild(s);
        }
    }

    function formatPrice(n) { return '$' + Number(n).toFixed(2); }

    /* Cart integration (localStorage) */
    const CART_KEY = 'prototype_cart_v1';
    function loadCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } }
    function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
    function addToCart(p, qty = 1) {
        const cart = loadCart();
        const idx = cart.findIndex(c => c.id === p.id);
        if (idx > -1) { cart[idx].qty = (cart[idx].qty || 0) + qty; }
        else { cart.push({ id: p.id, title: p.title, price: p.price, qty: qty, img: p.img, meta: p.category }); }
        saveCart(cart);
        showToast(`${p.title} added to cart`);
    }

    function showToast(text) {
        const t = document.createElement('div');
        t.className = 'alert-success';
        t.textContent = text;
        Object.assign(t.style, { position: 'fixed', right: '18px', bottom: '18px', zIndex: 4000, opacity: '0', transition: 'opacity .2s ease' });
        document.body.appendChild(t);
        // force reflow
        void t.offsetWidth; t.style.opacity = '1';
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 1500);
    }

    function saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(Array.from(state.wishlist)));
    }

    function renderProducts(list) {
        container.innerHTML = '';
        // switch container class for list vs grid
        if (state.view === 'list') {
            container.classList.remove('products-grid');
            container.classList.add('products-list');
        } else {
            container.classList.remove('products-list');
            container.classList.add('products-grid');
        }
        if (!list.length) {
            container.innerHTML = '<div class="text-center text-muted">No products found.</div>';
            return;
        }

        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            if (state.view === 'list') card.classList.add('list');

            const wishBtn = document.createElement('button');
            wishBtn.className = 'btn-wish';
            wishBtn.innerHTML = state.wishlist.has(p.id) ? '♥' : '♡';
            if (state.wishlist.has(p.id)) wishBtn.classList.add('active');
            wishBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (state.wishlist.has(p.id)) { state.wishlist.delete(p.id); wishBtn.classList.remove('active'); wishBtn.innerHTML = '♡'; }
                else { state.wishlist.add(p.id); wishBtn.classList.add('active'); wishBtn.innerHTML = '♥'; }
                saveWishlist();
            });

            const media = document.createElement('a');
            media.className = 'product-media';
            const img = document.createElement('img');
            img.className = 'product-img';
            img.src = p.img;
            img.alt = p.title;
            media.appendChild(img);
            media.href = '#';
            media.addEventListener('click', (ev) => { ev.preventDefault(); openQuickView(p); });

            const body = document.createElement('div');
            body.className = 'card-body';
            const title = document.createElement('h5'); title.textContent = p.title;
            const price = document.createElement('div'); price.className = 'price'; price.textContent = formatPrice(p.price);
            const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `${p.category} • ${p.rating} ★`;
            const add = document.createElement('button'); add.className = 'btn btn-cart w-100 mt-2'; add.textContent = 'Add to Cart';

            // wire add-to-cart
            add.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); addToCart(p, 1); });

            body.appendChild(title); body.appendChild(price); body.appendChild(meta); body.appendChild(add);

            card.appendChild(wishBtn);
            card.appendChild(media);
            card.appendChild(body);

            container.appendChild(card);
        });
    }

    function applyFilters() {
        let out = state.products.slice();
        // search
        if (state.query) {
            const q = state.query.toLowerCase();
            out = out.filter(p => (p.title + ' ' + p.desc).toLowerCase().includes(q));
        }
        // categories
        if (state.categories.size) {
            out = out.filter(p => state.categories.has(p.category));
        }
        // price
        out = out.filter(p => p.price <= state.maxPrice);
        // rating
        out = out.filter(p => p.rating >= state.minRating);
        // sort
        if (state.sort === 'price-asc') out.sort((a, b) => a.price - b.price);
        else if (state.sort === 'price-desc') out.sort((a, b) => b.price - a.price);
        else if (state.sort === 'rating') out.sort((a, b) => b.rating - a.rating);
        else if (state.sort === 'newest') out = out; // data not time-based here

        renderProducts(out);
    }

    // quick view
    let activeQV = null;
    function openQuickView(p) {
        activeQV = p;
        qvImg.src = p.img;
        qvTitle.textContent = p.title;
        qvPrice.textContent = formatPrice(p.price);
        qvDesc.textContent = p.desc;
        qv.classList.add('open');
        qv.setAttribute('aria-hidden', 'false');
    }
    function closeQuickView() {
        qv.classList.remove('open');
        qv.setAttribute('aria-hidden', 'true');
        activeQV = null;
    }

    // wire events
    function wire() {
        // search
        let searchTimer = null;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => { state.query = e.target.value.trim(); applyFilters(); }, 180);
        });

        // price
        priceRange.addEventListener('input', (e) => { state.maxPrice = Number(e.target.value); priceVal.textContent = e.target.value; applyFilters(); });

        // rating
        ratingFilter.addEventListener('change', (e) => { state.minRating = Number(e.target.value); applyFilters(); });

        // categories
        document.querySelectorAll('#filterCategories .cat').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const v = e.target.value;
                if (e.target.checked) state.categories.add(v); else state.categories.delete(v);
                applyFilters();
            });
        });

        // sort
        sortSelect.addEventListener('change', (e) => { state.sort = e.target.value; applyFilters(); });

        // view toggles
        gridViewBtn.addEventListener('click', () => {
            state.view = 'grid';
            gridViewBtn.classList.add('active'); listViewBtn.classList.remove('active');
            applyFilters();
        });
        listViewBtn.addEventListener('click', () => {
            state.view = 'list';
            listViewBtn.classList.add('active'); gridViewBtn.classList.remove('active');
            applyFilters();
        });

        // clear
        clearFiltersBtn.addEventListener('click', () => {
            state.query = '';
            state.categories.clear();
            state.maxPrice = 1000;
            state.minRating = 0;
            state.sort = 'newest';
            // reset UI
            searchInput.value = '';
            priceRange.value = 1000; priceVal.textContent = '1000';
            ratingFilter.value = '0';
            document.querySelectorAll('#filterCategories .cat').forEach(c => c.checked = false);
            sortSelect.value = 'newest';
            applyFilters();
        });

        // quickview close
        qvClose.addEventListener('click', closeQuickView);
        qv.addEventListener('click', (e) => { if (e.target === qv) closeQuickView(); });

        // wishlist in quickview
        qvWishlist.addEventListener('click', () => {
            if (!activeQV) return;
            if (state.wishlist.has(activeQV.id)) state.wishlist.delete(activeQV.id); else state.wishlist.add(activeQV.id);
            saveWishlist();
        });

        // add to cart from quickview
        qvAdd.addEventListener('click', () => { if (!activeQV) return; addToCart(activeQV, 1); closeQuickView(); });
    }

    // init
    function init() {
        showSkeletons();
        wire();
        // initial view button state
        if (state.view === 'grid') { gridViewBtn.classList.add('active'); gridViewBtn.setAttribute('aria-pressed', 'true'); }
        else { listViewBtn.classList.add('active'); listViewBtn.setAttribute('aria-pressed', 'true'); }
        // simulate async load
        setTimeout(() => { applyFilters(); }, 600);
    }

    init();
})();
