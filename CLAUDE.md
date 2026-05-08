# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

DHYAI is a static HTML/CSS website for a luxury linen brand, built for deployment on Hostinger. There is no build step, no package manager, and no framework — all pages are plain `.html` files served directly. The one dynamic piece is a PHP contact form backed by SMTP via PHPMailer.

## Running locally

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

For manual upload, copy the entire folder contents (not the folder itself) into `public_html/` via Hostinger File Manager or FTP. Before going live, set `SMTP_PASSWORD` in `config.php` to the `contact@dhyai.studio` mailbox password.

## Contact form flow

`contact.html` → POST → `contact.php` → PHPMailer (SMTP) → redirect to `thank-you/` on success, or `contact.html?error=<code>` on failure.

- SMTP config lives entirely in `config.php`
- PHPMailer is vendored in `lib/PHPMailer/src/` (no Composer)
- Spam protection uses two honeypot fields (`bot-field`, `company`) — bots that fill them get a fake success redirect
- SMTP error codes: `missing` (empty fields), `email` (invalid email), `send` (SMTP failure)

## Styling

All styles are in `assets/css/styles.css` (V3, ~648 lines). The canonical design tokens are:

- `--ink: #1D1914`, `--cream: #EDE3CC`, `--dim: #9A9080`, `--faint: #524840`, `--ochre: #C4882A`
- `--serif: 'Cormorant Display'` (headings), `--serif-b: 'Cormorant'` (italic body text), `--sans: 'Jost'` (UI/labels)
- `--header-h: 64px`, `--pad-x: 40px`, `--max-page: 1120px`, `--max-text: 680px`
- Layout uses `.grid-2` / `.grid-3` helpers; no cards, no boxed UI — images sit directly on background
- Mobile breakpoints: `860px` (nav), `980px` (grids), `760px` (footer/cookie), `640px` (form button)

All three fonts load from Google Fonts on every page via the same `<link>` tag in `<head>`.

## JavaScript

`assets/js/main.js` (vanilla, IIFE, ~112 lines) handles five things:

1. **Entry animation** (`index.html` only) — full-screen sequence of `.es` slides; each has a `data-hold` ms attribute. Auto-advances through slides then fades out. Skippable via click anywhere or the `.entry-skip` button. Blocks scroll while running.
2. **Mobile nav toggle** — `[data-nav-toggle]` / `[data-nav]`; toggles `.is-open` and `aria-expanded`. Closes on outside click or any nav link click.
3. **Active nav highlighting** — matches `location.pathname` against `[data-nav-link]` and `[data-subnav-link]` href attributes; sets `aria-current="page"`.
4. **Cookie consent banner** — injected once if `localStorage('dhyai_cookie_consent')` is absent; dismissed to `'all'` or `'essential'`.
5. **Scroll-reveal** — `IntersectionObserver` on `.reveal` elements; adds `.is-visible` at 12% threshold. Grid children inside `.reveal` animate in with staggered `transition-delay`. Falls back to immediate `.is-visible` if `IntersectionObserver` is unsupported.

## Pages

Each HTML page is self-contained with its own `<head>`, nav, and footer. All pages share the same nav markup (`[data-nav]`, `[data-nav-toggle]`, `data-nav-link`) and must include the main.js script at the bottom of `<body>`.

- The three study detail pages (`sthna.html`, `sthiti.html`, `punar.html`) share the same section structure: cover image → description → format grid (`.format-list`). They use `[data-subnav-link]` on the sub-navigation links.
- `overview.html` is a quick-links review page not linked in the main nav.
- `404.html` is served via `.htaccess` (`ErrorDocument 404 /404.html`).
- `dhyai_mobile.html` is an untracked standalone prototype with its own inline styles (dark `#1D1914` background, different palette) — not part of the deployed site.
