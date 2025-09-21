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

Testing, build & debugging tips
- Build CSS locally: `npm run build:css`. On Windows PowerShell use exactly that command.
- Watch during edits: `npm run watch:css` (recommended while working on styles).
- Debugging JS: open the browser DevTools console on `products.html` to inspect `scripts/products.js` behavior and localStorage wishlist.

Pull request guidance (repo-specific)
- Keep PRs small and focused: one visual or one behavioral change per PR.
- Include before/after screenshots for CSS/visual changes.
- If adding or renaming images, update references in HTML/JS and prefer URL-safe filenames (replace spaces with dashes) unless the maintainer says otherwise.

Search tips (where things live)
- Styles: `styles.css`
- Generated CSS: `dist/styles.css`
- Product logic: `scripts/products.js` (rendering, filtering, wishlist)
- Page entry points: `home.html`, `products.html`

If unclear, ask the maintainer about
- Preferred image filename policy (spaces vs dashes).
- Whether adding build steps or client-side dependencies (CDN vs npm) is acceptable.

End of instructions.
