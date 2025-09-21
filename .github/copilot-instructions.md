<!--
Guidance for AI coding agents working in this repository.
Merged/updated: 2025-09-21
-->

# Copilot instructions for webapp (static storefront)

This repository is a small, static Bootstrap-based storefront. The site is served by plain HTML files and styles are compiled from `styles.css` into `dist/styles.css` using PostCSS. JavaScript is minimal and intentionally dependency-free. Keep suggestions tightly scoped, safe for a static site, and avoid introducing a backend unless explicitly requested.

Core facts (quick)
- Primary pages: `home.html` (main), `products.html` (catalog). Both reference `dist/styles.css`.
- Source styles: `styles.css` (imports Bootstrap + Google fonts). Build target: `dist/styles.css`.
- CSS build scripts (package.json):
  - `npm run build:css` — compile `styles.css` to `dist/styles.css`.
  - `npm run watch:css` — same, with watch mode for iterative edits.
- PostCSS config: `postcss.config.js` uses `postcss-import` and `autoprefixer`.
- Static assets: `images/` (image filenames may contain spaces; preserve exact names).

Why this structure
- Intentionally static: low friction for hosting (GitHub Pages, Netlify). Styles are authored in a single source file to keep the build minimal.
- Minimal JS: interactive enhancements (catalog filtering, quick-view) are implemented in `scripts/products.js` and are single-file, vanilla JS to avoid introducing frameworks.

What to do first when you edit code
- CSS: edit `styles.css` and run `npm run build:css` to produce `dist/styles.css`. Use `watch:css` for fast feedback.
- Images: place new images in `images/` and reference them relatively (e.g., `images/my-photo.jpg`). Preserve spaces if present in filenames.
- JS: add or update `scripts/*.js` files. Keep them dependency-free and avoid changing the page delivery model.

Key files and their purpose (explicit)
- `home.html` — main landing page; contains layout and uses Bootstrap classes.
- `products.html` — products catalog page. Contains filter UI and a JS-driven products renderer. See `#productsContainer` and `#quickView` markup.
- `styles.css` — single source of styles. Imports Bootstrap; avoid re-importing Bootstrap elsewhere.
- `dist/styles.css` — generated file used by pages. Do not edit directly; update `styles.css` and rebuild.
- `scripts/products.js` — vanilla JS renderer for products: data array, search/filter/sort, skeleton loading, quick-view modal, wishlist (localStorage), list/grid toggle.
- `postcss.config.js` — PostCSS plugins config used by build scripts.
- `package.json` — npm scripts and dependencies (Bootstrap + PostCSS toolchain).

Conventions and small-but-important patterns
- Keep UI changes minimal and Bootstrap-based: prefer Bootstrap utilities and classes for spacing, layout, and responsiveness.
- CSS entry point: always edit `styles.css`. Run `npm run build:css` to update `dist/styles.css` so pages reflect changes.
- Image filenames: sometimes include spaces (e.g., `wedding dress.jpg`). Preserve filenames or normalize both file and references when renaming.
- JS behavior: `scripts/products.js` renders into `#productsContainer`. If replacing with dynamic data, keep the same container and markup structure or update both HTML and JS together.
- Accessibility: quick-view modal is lightweight; keep modal open/close handlers and `aria-hidden` updates intact when changing modal behavior.

Common tasks and concrete examples
- Add product images: drop the file into `images/` and update product entries in `scripts/products.js` (the PRODUCTS array) or wire a fetch to a JSON file (create `data/products.json` and update the loader).
- Change styles: edit `styles.css` and run `npm run build:css`. Example:
  - Edit `.product-card` rules in `styles.css` → `npm run build:css` → reload `products.html`.
- Add a new page: create `newpage.html`, reference `dist/styles.css`, and follow Bootstrap markup patterns used in `home.html`.

What to avoid
- Do not introduce a backend server, Node app, or framework unless the maintainer requests it—this repo is explicitly static.
- Don't edit `dist/styles.css` by hand. Changes should be made in `styles.css` and compiled.
- Avoid adding new package.json scripts or dependencies unless necessary; when you do, leave a short rationale in the commit/PR.

<!--
Repository-specific guidance for AI coding agents working on this static storefront.
Updated: 2025-09-22
-->

# Copilot instructions — webapp (static storefront)

This is a small, intentionally static Bootstrap storefront. The site pages are plain HTML and styles are authored in `styles.css` and compiled into `dist/styles.css` with PostCSS. JavaScript is vanilla and split per-page under `scripts/`.

What matters (quick)
- Entry pages: `home.html`, `products.html`, `cart.html`, `about.html`.
- Styles: source is `styles.css`. Never edit `dist/styles.css` directly — run `npm run build:css` to regenerate.
- JS: `scripts/products.js`, `scripts/cart.js`, `scripts/about.js` — all dependency-free, browser-first code.

Local build & dev
- npm scripts in `package.json`:
  - `npm run build:css` — compile `styles.css` → `dist/styles.css` (PostCSS + autoprefixer).
  - `npm run watch:css` — watch and rebuild on change.

Key patterns & conventions (project-specific)
- Single CSS entry: edit `styles.css` (global rules, components, and page-specific sections live here). Keep selectors scoped where appropriate (e.g., `.cart-list .form-check`).
- Vanilla JS modules: keep behavior in `scripts/*.js`. Prefer small, focused changes; reuse DOM containers already used by the renderer (for example `#productsContainer`, `#cartList`, `#quickView`).
- Persistence keys: localStorage is used for client-side demo state. Important keys:
  - `prototype_cart_v1` — cart contents (array of {id,title,price,qty,img,meta}).
  - `wishlist` — wishlist state (array of ids).
- No backend assumption: features like contact forms or checkout are mock/demo only unless the maintainer requests a backend integration.

Files to inspect first (fast-trace)
- `styles.css` — style patterns, variables, and important component classes (product cards, quick-view, cart, toasts).
- `products.html` + `scripts/products.js` — product data, renderer, filters, quick-view, wishlist, add-to-cart integration.
- `cart.html` + `scripts/cart.js` — cart rendering, qty/remove, select-for-checkout, checkout modal, and localStorage persistence.

Behavioral conventions and gotchas
- Keep UI changes Bootstrap-friendly: prefer utilities + small component classes rather than big framework shifts.
- Image filenames sometimes contain spaces (e.g., `wedding dress.jpg`). Preserve exact filenames when editing references or rename both file and usages.
- Avoid global CSS overrides; scope changes carefully to avoid breaking other pages (we use global `styles.css` but prefer scoped rules like `.sticky-sidebar` or `.cart-list`).
- Modals and toasts are DOM-inserted by JS; style them in `styles.css` (no inline styles) and use classes like `.quick-view-overlay`, `.quick-view-card`, `.toast-notice`.

Quick-edit checklist (for common tasks)
- Add/modify styles: edit `styles.css` → run `npm run build:css` → test `products.html` / `home.html`.
- Add a new product image: place in `images/` and update the product data in `scripts/products.js` (or add a JSON data file and modify the loader).
- Tweak product rendering: update `scripts/products.js` and keep the same container markup so filters and quick-view keep working.

Debugging & validation
- Use the browser DevTools console on the target page (`products.html`, `cart.html`) to inspect runtime state (localStorage keys listed above) and JS errors.
- After style edits, confirm `dist/styles.css` was updated and the page loads the new CSS.

PR & collaboration rules
- Keep PRs focused and small; visual changes should include before/after screenshots.
- When adding a dependency or changing the build chain, add a short rationale in the PR body.

If anything is unclear
- Ask the maintainer about image filename policy (spaces vs dashes), and whether adding runtime dependencies or additional build steps is acceptable.

End of repo instructions.
