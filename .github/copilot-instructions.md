<!--
Guidance for AI coding agents working in this repository.
Generated: 2025-09-20
-->

# Copilot instructions for webapp

This repo is a small static Bootstrap-based storefront. Keep suggestions tightly scoped, concrete, and safe for static sites.

Key facts
- Static site: primary entry is `home.html` (uses `dist/styles.css`). No server code.
- Styles are authored in `styles.css` and built with PostCSS into `dist/styles.css`.
- Build scripts live in `package.json`:
  - `npm run build:css` → produces `dist/styles.css`
  - `npm run watch:css` → watches `styles.css` and rebuilds on change
- PostCSS config: `postcss.config.js` uses `postcss-import` and `autoprefixer`.

What to do first
- When editing CSS, update `styles.css` and run `npm run build:css` (or `watch:css`) so `home.html` references the updated `dist/styles.css`.
- Respect the project's asset paths: images are in `images/` and referenced relatively from `home.html`.

Project conventions and patterns
- Single-page static layout: UI is built directly in `home.html` using Bootstrap classes rather than JS frameworks.
- Keep markup changes minimal and predictable: use existing Bootstrap utility classes and CSS variables (none present) rather than introducing global resets.
- CSS imports: `styles.css` imports Bootstrap at the top — avoid duplicating bootstrap imports in other files.
- Filenames sometimes contain spaces (e.g., `wedding dress.jpg`); preserve exact names when editing or moving assets.

What to avoid
- Do not introduce a backend or server runtime unless the user asks — this repository is intentionally static.
- Avoid changing `package.json` scripts or dependency versions unless patching a build issue and include a short explanation in the commit message.

Examples of common tasks
- Add a new product card: copy an existing `.card` block in `home.html`, update the `img` src to a file placed under `images/`, and optionally add price text.
- Update styling: edit `styles.css`, then run `npm run build:css` and verify `dist/styles.css` is produced and `home.html` reflects the change.

Files to inspect for changes
- `home.html` — main UI and layout. Keep anchor/href paths relative (e.g., `/home.html` used in nav).
- `styles.css` — source styles (imports Bootstrap and Google fonts).
- `postcss.config.js` and `package.json` — build tooling for CSS.
- `README.md` — contains setup steps; use as canonical quick-start.

Pull request guidance
- Keep PRs small and focused: one UI change or one build change per PR.
- Include before/after screenshots for visual tweaks.
- If adding/removing images, ensure filenames are URL-safe or update references in `home.html`.

Search hints for maintainers
- To find where CSS classes are defined, open `styles.css`.
- To find build scripts, open `package.json`.

If unsure, ask the maintainer for:
- preferred image filename conventions (spaces vs dashes)
- whether adding JS or a build pipeline is acceptable

End of instructions.
