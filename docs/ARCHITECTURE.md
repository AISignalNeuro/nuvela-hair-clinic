# Architecture

## Overview

```
Browser ──► GitHub Pages (static React build)
              │
              │  VITE_API_URL set?  no ─► demo mode (localStorage)
              │                     yes
              ▼
           Express API (/api/v1) ──► PostgreSQL (Prisma)
```

The frontend is fully usable on its own. All content is bundled at build time, and the
service layer (`frontend/src/services/clinicService.js`) switches between the real API and a
browser-only demo store depending on `VITE_API_URL`.

## Frontend

### Routing and languages

- Every page lives under a language prefix: `/:lang/...` with `lang ∈ {en, tr, ar}`.
- `/` redirects to the visitor's saved or browser language. A path without a prefix
  (`/services`) is redirected to the same path with a prefix.
- `LocaleLayout` validates the prefix, wraps the tree in `I18nProvider` and renders the header,
  footer, floating contact dock, booking modal and toasts.
- `index.html` sets `lang`/`dir` before the first paint so Arabic never flashes left-to-right.
- On GitHub Pages, `404.html` is a copy of `index.html`, so deep links such as
  `/tr/services/dhi-hair-transplant` load the app, which then routes client-side.

### Content model

| Layer | Location | Contains |
|---|---|---|
| Shared data | `src/content/shared/*.js` | slugs, prices, facts, categories, case parameters, team, packages |
| Localized copy | `src/locales/<lang>/*.js` | UI strings, treatment pages, journal posts, FAQ, reviews, page copy |
| Merge | `src/content/index.js` | joins both by slug, falls back to English for anything missing |

English is bundled with the main chunk because it is also the fallback; Turkish and Arabic are
separate chunks loaded on demand. `t("path.to.key", { vars })` resolves UI strings with the same
fallback.

### UI system

- Design tokens in `styles/tokens.css` (turquoise / gold palette, radii, shadows, type scale).
- CSS logical properties (`margin-inline-start`, `inset-inline-end`, …) so one stylesheet works for
  LTR and RTL. Directional icons are mirrored automatically in RTL.
- Framer Motion variants in `config/motion.js` (reveal, stagger, float, modal, page transition).
- `ScalpArt` draws before/after visuals in SVG from a seed, a severity level and a variant
  (scalp, female part line, beard, eyebrow). Strands are merged into one `<path>` per layer to keep
  the DOM small.

### SEO

`<Seo>` uses React 19's built-in head hoisting for `<title>`, meta tags, canonical and
`hreflang` links, and emits JSON-LD. `scripts/postbuild.mjs` writes a sitemap with alternates for
every page in every language.

## Backend

### Layers

```
routes ─► middlewares (locale, auth, roles, validation, rate limit) ─► controllers ─► services ─► Prisma
```

- **routes**: URL → handler wiring only.
- **controllers**: translate HTTP to service calls and shape responses (`core/apiResponse.js`).
- **services**: business rules (OTP lifecycle, booking references, localization, admin updates).
- **validators**: Zod schemas shared by body and query validation.
- **middlewares**: `resolveLocale`, `requireAuth` / `optionalAuth`, `roleGuard`, `validate`,
  rate limiters, upload handling, error handling.

### Data model

Content tables hold language-neutral fields; translations live in `*_translations` tables keyed by
`(entity, locale)`. FAQ and testimonials are stored as one row per locale. Bookings (`appointments`)
and contact `leads` carry a unique human-readable reference.

Main tables: `users`, `otp_codes`, `refresh_tokens`, `services` (+ translations), `gallery_cases`
(+ translations), `team_members` (+ translations), `blog_posts` (+ translations), `packages`
(+ translations), `faqs`, `testimonials`, `appointments`, `leads`, `media`, `site_settings`.

### Authentication

- **Phone OTP**: 6-digit code, stored as an HMAC, 5-minute expiry, 5 attempts, max 3 codes per
  phone per 10 minutes, plus IP rate limiting. In development the code is echoed in the response.
- **Google**: ID token from Google Identity Services verified with `google-auth-library`.
- **Staff**: email + bcrypt password.
- **Sessions**: 15-minute JWT access token and a 30-day refresh token stored hashed. Refresh tokens
  are single-use and rotated on every refresh; disabling a user revokes all of their tokens.

### Roles

| Role | Access |
|---|---|
| ADMIN | everything, including users and roles |
| EDITOR | content (FAQ, reviews, journal, uploads) and bookings |
| DOCTOR, RECEPTIONIST | bookings, leads and dashboard stats |
| PATIENT | own profile and requests |
