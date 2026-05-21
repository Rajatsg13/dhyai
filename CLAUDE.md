# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Behavioral guidelines

**1. Think before coding — state assumptions, surface tradeoffs.**
Before implementing anything, name your assumptions explicitly. If multiple interpretations exist, present them — don't pick silently. If something is unclear, stop and ask. The two-codebase split (Astro src/ vs. public/) is a common source of confusion in this project.

**2. Simplicity first — minimum code that solves the problem.**
No features beyond what was asked. No abstractions for single-use code. No "flexibility" that wasn't requested. If you write 200 lines and it could be 50, rewrite it. Ask: would a senior engineer say this is overcomplicated?

**3. Surgical changes — touch only what you must.**
When editing existing code, don't improve adjacent things, don't refactor what isn't broken, match existing style. Every changed line should trace directly to the request. For UI changes: run `npm run dev`, open the browser, and verify before reporting done.

**Project-specific rule:** Always confirm whether you're editing an Astro source file (`src/`) or a static asset (`public/`). CSS lives in `src/styles/global.css` — changes there affect all pages. PHP files live in `public/` — they're deployed verbatim.

---

## What this is

DHYAI is a luxury linen brand website, deployed on Hostinger. **V5** uses Astro (static site generator) with plain CSS and vanilla JS. The contact form is PHP/PHPMailer, vendored in `public/lib/`.

## Project structure

```
src/
  layouts/Base.astro          ← shared <head>, Nav, Footer, all scripts
  components/Nav.astro        ← fixed navigation with collections dropdown
  components/Footer.astro     ← footer with social links
  pages/                      ← one .astro file per page
    index.astro               ← homepage
    sthiti.astro              ← Collection I
    sthna.astro               ← Collection II (Sthana)
    punar.astro               ← Collection III
    about.astro
    process.astro
    contact.astro
    thank-you.astro
    404.astro
  styles/global.css           ← ALL styles — design tokens, components, layout
public/
  assets/images/              ← all images (.webp, .jpg, .png)
  assets/brick.mp4
  contact.php                 ← form handler (PHP + PHPMailer)
  config.php                  ← SMTP credentials (deployed to server)
  lib/PHPMailer/              ← vendored PHPMailer
  .htaccess                   ← ErrorDocument 404 /404.html
dist/                         ← Astro build output (gitignored, FTP-deployed)
```

## Running locally

```bash
npm run dev
```

Runs Astro dev server at `localhost:4321`. The PHP contact form requires a separate PHP server — it won't work in dev mode. To test the form, deploy to Hostinger or run `php -S localhost:8000` alongside.

## Building

```bash
npm run build
```

Outputs static HTML/CSS/JS/images to `dist/`. With `build.format: 'file'`, each page generates as `page.html` (not `page/index.html`). PHP files from `public/` are copied verbatim to `dist/`.

## Deployment

Pushes to `main` automatically:
1. `npm ci` → installs Astro
2. `npm run build` → generates `dist/`
3. FTP upload of `dist/` contents to Hostinger root

Required GitHub secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.

**`config.php` is deployed** — set `SMTP_PASSWORD` in `public/config.php` before pushing to main.

## Design system (`src/styles/global.css`)

Design tokens:
- `--ink: #1a1612`, `--ink-2: #221d1a`, `--cream: #ede3cc`, `--ivory: #f5ede0`
- `--dim: #b8a898`, `--faint: #786860`, `--ochre: #c4882a`
- `--serif: 'Cormorant Display'`, `--serif-b: 'Cormorant'`, `--sans: 'Jost'`
- `--max-w: 1200px`, `--pad-x: clamp(1.5rem, 5vw, 5rem)`, `--section-y: clamp(6rem, 10vw, 10rem)`

Key CSS classes:
- `.wrap` — max-width container with horizontal padding
- `.section` — max-width + vertical padding combined
- `.reveal` / `.visible` — scroll-reveal (IntersectionObserver adds `.visible`)
- `.d1`–`.d4` — transition-delay utilities for staggered reveals
- `.two-col` / `.two-col.reverse` — two-column responsive grid
- `.cols-grid` — 3-column collection card grid (hairline-gap)
- `.col-card` — full-bleed image card with layered text overlay
- `.products-grid` — 2-column product grid with carousels
- `.product-carousel` / `.carousel-track` / `.carousel-dot` — JS-driven carousels

## JavaScript (in Base.astro `<script>`)

1. **Nav scroll** — adds `.scrolled` class to `#site-nav` after 50px scroll
2. **Mobile nav toggle** — `#nav-toggle` / `#nav-links` toggle `.open`; body gets `.nav-open`
3. **Scroll reveal** — `IntersectionObserver` on `.reveal` at 8% threshold → adds `.visible`
4. **Carousels** — `querySelectorAll('.product-carousel')`, interval-based at 3800ms, touch swipe support

## Navigation structure

```
[Dhyai wordmark]    [Collections ▾] [About] [Process] [Enquire]
                         ↓
                  [Sthiti] [Sthana] [Punar]
```

Mobile: hamburger → full-screen overlay with all links.

## Contact form flow

`contact.html` → POST → `contact.php` → PHPMailer (SMTP) → redirect to `/thank-you.html` on success, or `/contact.html?error=<code>` on failure.

- SMTP config in `public/config.php` (constants: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAIL_TO`)
- Spam protection: two honeypot fields (`bot-field`, `company`) — if filled, redirects to `/thank-you.html`
- Error codes: `missing`, `email`, `send` — displayed via Astro `Astro.url.searchParams.get('error')`

## Pages

- `index.astro` — home: jaali hero → 3-column collections grid → brand statement → process teaser → metal section → founder → CTA
- `sthiti.astro`, `sthna.astro`, `punar.astro` — collection pages: cover hero → description → products grid → format reference → related collections
- `about.astro` — studio image → brand narrative → founder section → values statement
- `process.astro` — hero → intro → 4-step process grid → material section
- `contact.astro` — two-col: contact info left, form right; error handling via URL params
- `404.astro` — oversized 404 numeral with centered text and home link

## Legacy files (not deployed in V5)

The old `index.html`, `about.html`, `studies.html`, etc. at the repo root are V3/V4 source files — historical artifacts. They are NOT deployed (deploy workflow only uploads `dist/`). Do not edit them.

`dhyai_v4.html`, `dhyai_mobile.html` — archived prototypes. Not in the site.
