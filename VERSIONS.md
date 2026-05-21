# DHYAI — Version & Checkpoint Log

Live site: test.dhyai.studio
Repo: github.com/Rajatsg13/dhyai

---

## V1 — Original (git tag: `original`)
**Commit:** 2e2a74f  
Multi-page site. Standard layout, light theme, basic nav. Pre-redesign baseline.

---

## V2 — Glassmorphism + Themes (git tag: `v2`)
**Commit:** b2aa931  
Glassmorphism UI, 7 colour themes, Cormorant + Inter fonts, animated hamburger menu.

---

## V3 — Dark Redesign, Inner Pages
**Commit:** 71a15a8  
Full shift to dark cinematic style based on `dhyai_mobile.html` reference.  
- Background: `#1D1914` (ink), permanently dark  
- Palette: `--cream`, `--dim`, `--faint`, `--ochre`  
- Fonts: Cormorant Display + Jost  
- Film grain overlay, dark glassmorphism header  
- Applies to: `about.html`, `process.html`, `studies.html`, `contact.html`, `sthna.html`, `sthiti.html`, `punar.html`, `404.html`  
- Shared via `assets/css/styles.css` + `assets/js/main.js`

---

## V4 — Single-File Homepage
**Initial commit:** 8b77b42  
`index.html` becomes a self-contained single-page app. All CSS + JS inline. Does not use `styles.css` or `main.js`.

### V4 Checkpoints

| # | Commit | Description |
|---|--------|-------------|
| 4.0 | 8b77b42 | V4 becomes homepage — entry animation, video sections, carousels |
| 4.1 | a66fdf0 | Warm architectural palette, shorter entry, removed Kriya + JS-01 sections |
| 4.2 | 8dba1a5 | Palette: warm dark brown ground `#201610` |
| 4.3 | 3197eea | Refine palette, entry timing, spacing, typography |
| 4.4 | e566177 | Refine palette, typography, gradient, nav legibility |
| 4.5 | — | *(planned — remove intro text/wordmark, keep jaali loader)* — superseded by V5 |

---

## V5 — Astro Rebuild (current)
**Tech stack:** Astro (static site generator) + plain CSS + vanilla JS  
**Architecture:** Component-based — shared `Base.astro` layout with `Nav.astro` + `Footer.astro`  
**Build:** `npm run build` → `dist/` → FTP to Hostinger  
**URL format:** `page.html` (Apache-compatible, no rewrites needed)

### V5 Design system
- Background: `#1a1612` (deepest ink)
- Palette: `--cream #ede3cc`, `--ivory #f5ede0`, `--dim #b8a898`, `--faint #786860`, `--ochre #c4882a`
- Fonts: Cormorant Display (headings) + Cormorant (body) + Jost (UI)
- Film grain overlay, scroll-reveal, interval carousels, collections dropdown nav

### V5 Pages
- `index.html` — homepage: jaali hero, 3-col collections grid, brand statement, process teaser, metal section, founder, CTA
- `sthiti.html` — Collection I: Sthiti
- `sthna.html` — Collection II: Sthana
- `punar.html` — Collection III: Punar
- `about.html` — brand story, material, founder
- `process.html` — 4-step process, material notes
- `contact.html` — split layout: contact info + enquiry form
- `thank-you.html` — post-form redirect
- `404.html` — error page

### V5 Checkpoints

| # | Description |
|---|-------------|
| 5.0 | Initial Astro build — all pages, component architecture, luxury CSS, deploy workflow ← **current** |

---

## Architecture note
As of V5, the deployed site is always `dist/` (Astro build output). The legacy HTML files at the repo root (`index.html`, `about.html`, etc.) are historical V3/V4 artifacts — not deployed.
