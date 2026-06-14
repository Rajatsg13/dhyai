# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

DHYAI is a static HTML/CSS website for a luxury linen brand, deployed on Hostinger. No build step, no package manager, no framework — plain `.html` files served directly. The one dynamic piece is a PHP contact form backed by SMTP via PHPMailer.

## Running locally

```bash
php -S localhost:8000
```

The contact form (`contact.html` → `contact.php`) requires a PHP server with SMTP credentials set in `config.php`.

## Deployment

Pushes to `main` automatically deploy via `.github/workflows/deploy.yml` (FTP using `SamKirkland/FTP-Deploy-Action`). Required GitHub secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.

Files excluded from deployment: `.git*`, `README.md`, `CLAUDE.md`. **`config.php` is deployed** — set `SMTP_PASSWORD` in it before pushing to main.

For manual upload, copy folder contents (not the folder itself) into `public_html/` via Hostinger File Manager or FTP.

## Critical architecture: two separate codebases in one repo

The site is split into two distinct implementations that share no CSS or JS:

### `index.html` (V4 — the homepage)
Self-contained single file with extensive **inline `<style>` and inline `<script>`**. It does not load `assets/css/styles.css` or `assets/js/main.js`. Changes to those files have no effect on the homepage.

Extended palette specific to index.html (differs from styles.css):
- `--ink: #221d1a`, `--ink-2: #2c2622` (warm darks — hero/video beds)
- `--mid-1: #4a4038`, `--mid-2: #726459` (mineral mids)
- `--ivory: #f6efe2` (brightest surface — headings, product names)
- `--dim: #b7aa98` (secondary text — warmer than styles.css `#9A9080`)
- `--faint: #726459` (tertiary — differs from styles.css `#524840`)
- `--serif-h: 'Instrument Serif'` (additional heading font not used in V3)

The V4 entry animation: inline JS cycles `data-s` attribute (`0–3`) on `#entry` to drive CSS opacity transitions on `.bg-jaali` and `.bg-veil` layers; `.es` slide children toggle `.on` class (not `data-hold` — that's main.js's separate, unused pattern). The nav uses `#nav` (not `.site-header`) and toggles `.on` class (not `.is-open`). Product carousels are driven by `setInterval` with drag support.

### All other pages (V3)
`about.html`, `process.html`, `studies.html`, `contact.html`, `sthna.html`, `sthiti.html`, `punar.html`, `404.html` — each loads `assets/css/styles.css` and `assets/js/main.js` at the bottom of `<body>`. All share identical nav markup.

## Styling (V3 pages)

`assets/css/styles.css` (~648 lines). Design tokens:

- `--ink: #1D1914`, `--cream: #EDE3CC`, `--dim: #9A9080`, `--faint: #524840`, `--ochre: #C4882A`
- `--serif: 'Cormorant Display'` (headings), `--serif-b: 'Cormorant'` (italic body), `--sans: 'Jost'` (UI/labels)
- `--header-h: 64px`, `--pad-x: 40px`, `--max-page: 1120px`, `--max-text: 680px`
- Layout uses `.grid-2` / `.grid-3`; no cards, no boxed UI — images sit directly on background
- Mobile breakpoints: `860px` (nav collapses), `980px` (grids stack), `760px` (footer/cookie), `640px` (form button full-width)

Z-index layers: film grain overlay `3000`, cookie banner `1500`, header `1000`, subnav `900`.

## JavaScript (V3 pages)

`assets/js/main.js` (vanilla IIFE, ~112 lines) handles:

1. **Mobile nav toggle** — `[data-nav-toggle]` / `[data-nav]`; toggles `.is-open` and `aria-expanded`. Closes on outside click or any nav link click.
2. **Active nav highlighting** — matches `location.pathname` against `[data-nav-link]` and `[data-subnav-link]` href attributes; sets `aria-current="page"`.
3. **Cookie consent banner** — injected once if `localStorage('dhyai_cookie_consent')` is absent; dismissed to `'all'` or `'essential'`.
4. **Scroll-reveal** — `IntersectionObserver` on `.reveal` elements; adds `.is-visible` at 12% threshold. Grid children inside `.reveal` animate with staggered `transition-delay`.

The `.es` / `data-hold` / `.active` entry animation block in main.js (lines 5–37) is dead code — no V3 page has an `#entry` element. The homepage (index.html V4) has its own separate inline JS animation using `data-s` states and `.on` class instead.

## Pages

- **Study detail pages** (`sthna.html`, `sthiti.html`, `punar.html`) share identical structure: cover image → description → format grid (`.format-list`). They include a `.subnav` with `[data-subnav-link]` for cross-navigation.
- `overview.html` — quick-links review page, not in the main nav, useful for design QA.
- `404.html` — served via `.htaccess` (`ErrorDocument 404 /404.html`).
- `dhyai_v4.html` — archived predecessor to the current index.html; not linked or deployed.
- `dhyai_mobile.html` — untracked standalone prototype with its own inline styles; not part of the deployed site.

## Untracked directories

`node_modules/`, `dist/`, and `.astro/` are present locally but untracked by git — remnants of an abandoned Astro migration experiment. They are not part of the deployed site and have no effect on it. The `dist/` directory contains a compiled Astro build that mirrors the V3 pages but is not wired into the FTP deploy workflow.

## Contact form flow

`contact.html` → POST → `contact.php` → PHPMailer (SMTP) → redirect to `thank-you/` on success, or `contact.html?error=<code>` on failure.

- SMTP config in `config.php` (constants: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAIL_TO`)
- PHPMailer vendored in `lib/PHPMailer/src/` (no Composer)
- Spam protection: two honeypot fields (`bot-field`, `company`) — if filled, returns fake success redirect
- Error codes: `missing` (empty required fields), `email` (invalid email format), `send` (SMTP failure)
