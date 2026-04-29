# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

DHYAI is a static HTML/CSS website for a luxury linen brand, built for deployment on Hostinger. There is no build step, no package manager, and no framework — all pages are plain `.html` files served directly. The one dynamic piece is a PHP contact form backed by SMTP via PHPMailer.

## Running locally

Open any `.html` file directly in a browser, or use a local static server:

```bash
php -S localhost:8000
```

The contact form (`contact.html` → `contact.php`) requires a PHP server with SMTP credentials set in `config.php`.

## Deployment

Pushes to `main` automatically deploy to Hostinger via `.github/workflows/deploy.yml` (FTP using `SamKirkland/FTP-Deploy-Action`). Three GitHub repository secrets must be set:

| Secret | Value |
|---|---|
| `FTP_SERVER` | Hostinger FTP hostname (e.g. `ftp.dhyai.studio`) |
| `FTP_USERNAME` | FTP username from Hostinger hPanel |
| `FTP_PASSWORD` | FTP password from Hostinger hPanel |

Files excluded from deployment: `.git*`, `README.md`, `CLAUDE.md`.

For a manual upload, copy the entire folder contents (not the folder itself) into `public_html/` via Hostinger File Manager or FTP. Before going live, set `SMTP_PASSWORD` in `config.php` to the `contact@dhyai.studio` mailbox password.

## Contact form flow

`contact.html` → POST → `contact.php` → PHPMailer (SMTP) → redirect to `thank-you/` on success, or `contact.html?error=<code>` on failure.

- SMTP config lives entirely in `config.php`
- PHPMailer is vendored in `lib/PHPMailer/src/` (no Composer)
- Spam protection uses two honeypot fields (`bot-field`, `company`) — bots that fill them get a fake success redirect

## Styling

All styles are in `assets/css/styles.css`. There are two `:root` blocks — the first defines the canonical design tokens (colors, typography, spacing), the second is a leftover "luxury design" block that partially duplicates them. The canonical tokens are:

- `--bg-primary: #e2dccf`, `--bg-alt: #d8d0c2`, `--accent: #9e6821`
- `--font-heading: "EB Garamond"`, `--font-body: "Inter"`
- Layout is single-column sections with `.grid-2` / `.grid-3` helpers; no cards, no boxed UI — images sit directly on background

The white colour theme overrides `--bg-primary` and related tokens via `[data-theme="white"]` on `<html>`.

## JavaScript

`assets/js/main.js` (vanilla, IIFE) handles five things:

1. **Theme toggle** — injects colour-swatch buttons into `.header-inner`; persists choice to `localStorage('dhyai_theme')`. Two themes: `''` (warm, default) and `'white'`. Every page also has an inline `<script>` in `<head>` that applies the saved theme before render to prevent FOUC.
2. **Mobile nav toggle** — `[data-nav-toggle]` / `[data-nav]`; toggles `.is-open` and `aria-expanded`.
3. **Active nav highlighting** — matches `location.pathname` against `[data-nav-link]` and `[data-subnav-link]` href attributes; sets `aria-current="page"`.
4. **Cookie consent banner** — injected once if `localStorage('dhyai_cookie_consent')` is absent; dismissed to `'all'` or `'essential'`.
5. **Scroll-reveal** — `IntersectionObserver` on `.reveal` elements; adds `.is-visible` at 12% threshold. Falls back to immediate `.is-visible` if `IntersectionObserver` is unsupported.

## Pages

Each HTML page is self-contained with its own `<head>`. The three study pages (`sthna.html`, `sthiti.html`, `punar.html`) share the same section structure: cover image → description → format grid. `overview.html` is a quick-links review page, not linked in the main nav. `404.html` is served via `.htaccess` (`ErrorDocument 404 /404.html`).
