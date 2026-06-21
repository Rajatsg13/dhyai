# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

DHYAI is a static HTML/CSS website for a luxury linen and brass-objects brand, deployed on Hostinger. No build step, no package manager, no framework — plain `.html` files served directly. The one dynamic piece is a PHP contact form backed by SMTP via PHPMailer.

## Running locally

```bash
php -S localhost:8000
```

The contact form (`contact.html` → `contact.php`) requires a PHP server with SMTP credentials set in `config.php`.

## Deployment

Pushes to `main` automatically deploy via `.github/workflows/deploy.yml` (FTPS using `lftp`). Required GitHub secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.

Files excluded from deployment: `.git*`, `README.md`, `CLAUDE.md`, `node_modules`, `dist`, `.astro`, `.DS_Store`. **`config.php` is deployed** — set `SMTP_PASSWORD` in it before pushing to main.

For manual upload, copy folder contents (not the folder itself) into `public_html/` via Hostinger File Manager or FTP.

## Architecture: V5 unified codebase

All pages — including `index.html` — share a single stylesheet (`assets/css/styles.css`) and a single script (`assets/js/main.js`). There is no longer a separate inline-style homepage; the V3/V4 split described in older notes is gone.

Every page `<head>` loads three Google Fonts via CDN: `Marcellus`, `Petrona` (300 weight, italic variant), and `Source Sans 3` (300/400/600). Copy this block verbatim when creating a new page.

`process.html` is a redirect stub (`<meta http-equiv="refresh">`) pointing to `material.html` — it contains no styles or content.

`dhyai_v4.html` is an archived predecessor, not linked or deployed.

## Styling (V5)

Design tokens in `:root`:
- `--dark:#1a100a`, `--dark2:#241710`, `--brown:#2a170e` (dark beds)
- `--warm2:#b49b78` (warm tan — studies/enquiry section backgrounds)
- `--text:#f0e6d2`, `--muted:#d4c5a8`, `--dim:#ab9577` (text hierarchy)
- `--brass:#be8233` (accent — labels, links)
- `--serif:'Marcellus'` (display headings), `--body:'Petrona'` (body italic), `--sans:'Source Sans 3'` (UI/labels)
- `--nav:72px`, `--pad:72px` (collapses to 40px at 1024px, 24px at 900px)

Layout helpers: `.w` (max-width 1120px, centered), `.pg` (page padding-top accounting for fixed nav). No card components — images sit directly on background.

Z-index: cookie banner `1500`, nav `1000`.

Breakpoints: `1024px` (pad shrinks), `900px` (nav collapses, grids stack), `768px` (hero height), `600px` (single-column image grids).

## JavaScript (V5)

`assets/js/main.js` (vanilla IIFE, 72 lines):

1. **Mobile nav** — targets `#burg` (hamburger button) and `#nl` (nav list); toggles `.open` class on both. Closes on outside click or nav link click.
2. **Active nav highlighting** — matches `location.pathname` filename against `a[href]` in `#nl`; sets `aria-current="page"`.
3. **Cookie consent** — injected if `localStorage('dhyai_cookie_consent')` absent; banner slides up via `.is-visible`; dismissed to `'all'` or `'essential'`.
4. **Scroll-reveal** — `IntersectionObserver` on `.fd` elements; adds `.lit` at 10% threshold. Fallback: adds `.lit` immediately if no IO support.

## Nav markup (all pages)

```html
<nav id="nav">
  <button class="burg" id="burg" aria-label="Toggle menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <ul class="nl" id="nl">
    <li><a href="index.html">HOME</a></li>
    <li><a href="about.html">STUDIO</a></li>
    <li><a href="material.html">MATERIAL</a></li>
    <li><a href="studies.html">STUDIES</a></li>
    <li><a href="objects.html">OBJECTS</a></li>
    <li><a href="contact.html">ENQUIRY</a></li>
  </ul>
</nav>
```

## Pages

**Primary (in nav):** `index.html`, `about.html`, `material.html`, `studies.html`, `objects.html`, `contact.html`

**Study detail pages** (`sthna.html`, `sthiti.html`, `punar.html`) — identical structure: cover image → text + image grid. Background `var(--warm2)`. Each has its own `.ig-*` image grid class in styles.css.

**Object detail pages** (`kalash.html`, `pebble.html`) — `.odp-page` layout with `.od-g` two-column grid (text left, image stack right).

**Supporting:** `commissions.html` (dark overlay + two-column process layout), `404.html` (`.pg-center` fullscreen), `thank-you/index.html` (post-form redirect), `overview.html` (design QA quick-links, not in nav).

## Contact form flow

`contact.html` → POST → `contact.php` → PHPMailer (SMTP) → redirect to `thank-you/` on success, or `contact.html?error=<code>` on failure.

- SMTP config in `config.php` (constants: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAIL_FROM_NAME`, `MAIL_TO`, `MAIL_TO_NAME`)
- PHPMailer vendored in `lib/PHPMailer/src/` (no Composer)
- Spam protection: honeypot fields `bot-field` and `company` — if filled, returns fake success redirect
- Error codes: `missing` (empty required fields), `email` (invalid email format), `send` (SMTP failure)

## .htaccess

Single line: `ErrorDocument 404 /404.html`. Nothing else — no rewrites, no redirects beyond the `process.html` meta-refresh stub.

## Untracked / archived files

- `node_modules/`, `dist/`, `.astro/` — remnants of an abandoned Astro experiment. Not deployed, no effect on the site.
- `assets/brick.mp4`, `assets/kriya.mp4` — video assets referenced only in `dhyai_v4.html` (archived). Not used in any live page.
- `dhyai_mobile.html` — local prototype, not tracked or deployed.
