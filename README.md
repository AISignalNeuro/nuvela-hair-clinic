# Nuvela Hair Clinic

A full-stack, multilingual website for a (fictional) hair transplant clinic in Istanbul, Turkey.

**Live demo:** https://aisignalneuro.github.io/nuvela-hair-clinic/

| | |
|---|---|
| **Languages** | English, Türkçe, العربية (full RTL) |
| **Frontend** | React 19, Vite 7, React Router 7, Framer Motion |
| **Backend** | Node.js, Express, Prisma ORM, PostgreSQL |
| **Auth** | Phone OTP, Google Sign-In, staff email/password, JWT + rotating refresh tokens |
| **Hosting** | Frontend on GitHub Pages (static), API via Docker on any Node host |

> Nuvela, its doctors, reviews, prices and contact details are fictional and exist only for this portfolio project.

---

## Features

**Website**
- Home, treatments, treatment detail pages, packages & prices, before/after gallery, journal, about, FAQ, contact
- 5-step consultation wizard, quick booking modal, patient sign-in (OTP / Google) and profile with request history
- Language-prefixed URLs (`/en`, `/tr`, `/ar`), automatic language detection, RTL layout for Arabic
- Before/after visuals are SVG illustrations drawn in code from each case's graft count and hair-loss pattern, so no patient photos are needed
- SEO: per-page titles and descriptions, canonical + `hreflang` alternates, Open Graph, JSON-LD (`MedicalClinic`, `MedicalProcedure`, `Article`, `FAQPage`, `BreadcrumbList`) and a generated multilingual `sitemap.xml`
- Code-split routes and lazily loaded locale bundles; vendor libraries in separate long-cache chunks
- Accessible components: keyboard-friendly slider, focus-managed modals, skip link, reduced-motion support

**API**
- Localized content endpoints with English fallback (`?lang=` or `Accept-Language`)
- Consultation requests and contact leads with human-readable references (`NV-26K7Q2M`)
- OTP with hashed codes, expiry, attempt limits and per-phone throttling; rate limiting on public forms
- Role-based admin endpoints (ADMIN, EDITOR, DOCTOR, RECEPTIONIST) for bookings, leads, users, FAQ, reviews, journal posts and image uploads
- Zod validation, consistent JSON errors, Helmet, CORS allow-list, compression, graceful shutdown

---

## Project structure

```
├── frontend/                 React app (deployed to GitHub Pages)
│   ├── src/
│   │   ├── app/              App shell, routes, locale layout
│   │   ├── components/       layout, home, services, gallery, booking, blog, ui …
│   │   ├── content/shared/   language-neutral data (services, cases, posts, team, packages)
│   │   ├── locales/en|tr|ar  translated copy: UI strings, treatments, journal, pages
│   │   ├── i18n/             language config + provider (t(), formatters, localePath)
│   │   ├── pages/            one folder per route
│   │   ├── services/         API client with demo-mode fallback
│   │   └── styles/           design tokens, base, components, layout, pages
│   └── scripts/postbuild.mjs 404.html for SPA routing, sitemap.xml, robots.txt
├── backend/                  Express API
│   ├── prisma/               schema, migrations, seed (reads frontend content)
│   ├── src/api/v1/           routes · controllers · services · validators · middlewares
│   ├── src/config|core|utils
│   └── test/                 node:test API tests
├── docs/ARCHITECTURE.md
├── docker-compose.yml        PostgreSQL + API
└── .github/workflows/        Pages deploy + backend CI
```

Content lives once in `frontend/src/content` and `frontend/src/locales`. The website bundles it directly, and the backend seed loads the same files into PostgreSQL, so both stay in sync.

---

## Getting started

Requirements: Node.js 20+ and, for the API, PostgreSQL 14+ (or Docker).

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Without `VITE_API_URL` the site runs in **demo mode**: bookings, contact messages and sign-in work entirely in the browser (demo OTP code `123456`). This is how the GitHub Pages version runs.

To use the real API, create `frontend/.env.local`:

```
VITE_API_URL=http://localhost:4000/api/v1
```

### Backend

```bash
cd backend
cp .env.example .env         # set DATABASE_URL and secrets
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev                  # http://localhost:4000/api/v1/health
```

Or with Docker:

```bash
docker compose up --build
docker compose exec api npm run db:seed
```

### Tests

```bash
cd backend
npm test                                     # checks that need no database
TEST_DATABASE_URL=postgresql://… npm test    # full flow against a seeded database
```

---

## API overview

Base URL: `/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Service and database status |
| GET | `/services`, `/services/:slug` | Treatments (filter: `category`, `featured`) |
| GET | `/gallery/cases`, `/gallery/cases/:slug` | Before/after cases (filter, search, pagination) |
| GET | `/blog/posts`, `/blog/posts/:slug`, `/blog/categories` | Journal |
| GET | `/team`, `/faqs`, `/testimonials`, `/packages`, `/settings/public` | Other content |
| POST | `/appointments` | Consultation request (optionally linked to the signed-in user) |
| GET | `/appointments/my` | Signed-in patient's requests |
| POST | `/contact` | Contact message |
| POST | `/auth/request-otp`, `/auth/verify-otp` | Phone sign-in |
| POST | `/auth/google`, `/auth/login` | Google sign-in, staff sign-in |
| POST | `/auth/refresh`, `/auth/logout` | Token rotation, sign-out |
| GET/PATCH | `/auth/me` | Current user |
| * | `/admin/...` | Stats, bookings, leads, users, FAQ, reviews, posts, uploads (role-protected) |

All content endpoints accept `?lang=en|tr|ar`. Responses use `{ status: "ok", data, meta? }`; errors use `{ status: "error", message, errors? }`.

---

## Deployment

- **Frontend:** every push to `main` builds `frontend/` and publishes it to GitHub Pages (`.github/workflows/deploy-pages.yml`). `BASE_PATH` and `VITE_SITE_URL` are set from the repository name automatically.
- **Backend:** build the Docker image from the repository root (`docker build -f backend/Dockerfile .`) and run it anywhere Node and PostgreSQL are available. Migrations run on container start. Set strong `JWT_ACCESS_SECRET` and `OTP_SECRET` values in production.

## Customizing for a real clinic

1. Update `frontend/src/content/shared/site.js` (name, phone, WhatsApp, address, map, hours, socials).
2. Edit treatments, prices and cases in `frontend/src/content/shared/*` and the copy in `frontend/src/locales/*`.
3. Replace the demo disclaimer in the footer strings and add real photos where appropriate.
4. Configure `VITE_API_URL`, `GOOGLE_CLIENT_ID` and an SMS provider in `backend/src/utils/smsProvider.js`.

## License

MIT
