# HAFI — Sports, Together

HAFI is a Rwandan sports platform built around one belief: sport means more when it's shared. It's not a livescore app — it helps people discover matches, find where to experience them (in person, at a venue, or streamed), and connect with the community around them.

Rwanda-first, Africa-ready: every club, competition, venue, and city in the current dataset is Rwandan (APR FC, Rayon Sports, Amahoro Stadium, BK Arena, the CECAFA Kagame Cup), on an architecture designed to scale beyond it.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui primitives
- **Icons**: Lucide React
- **Fonts**: Manrope Variable, self-hosted via `@fontsource-variable/manrope`
- **Backend (designed, not yet connected)**: Supabase — Postgres, Auth, Storage, Realtime. See [`supabase.md`](./supabase.md).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs entirely on typed mock data today — no environment variables or backend are required to run it locally.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint     # eslint
```

---

## Design System

**Palette** (almost monochrome, one accent — see `app/globals.css` for the full token set):

| Token          | Value     | Use                                     |
| -------------- | --------- | --------------------------------------- |
| Background     | `#121212` | App background                          |
| Surface        | `#1C1C1C` | Cards, panels                           |
| Primary text   | `#F7F5F2` | Body text                               |
| Secondary text | `#A8A8A8` | Muted/supporting text                   |
| Accent         | `#0F766E` | Primary actions, live indicators, links |
| Border         | `#2A2A2A` | Dividers, card borders                  |

**Principles**: minimal, premium, human, warm, calm, timeless. No gradients, no glassmorphism. 16px corner radii throughout. Whitespace over clutter, typography over decoration. Dark-first by design — this isn't a "dark mode option," it's the identity.

**Navigation**: one nav system per breakpoint, not two. Desktop uses a sticky top bar (**Discover · Matches · News**); mobile uses a fixed bottom bar (**Home · Watch · Matches · Profile**). There's no persistent sidebar — an earlier prototype had one, but it duplicated the top nav's destinations and was removed.

---

## Architecture

### Route structure

Every primary screen lives under one route group so the app shell (navbar, footer, mobile nav) is defined once:

```
app/
├── layout.tsx              Root HTML shell — fonts, metadata, sitewide JSON-LD
├── sitemap.ts               Dynamic sitemap, generated from real data
├── robots.ts
└── (app)/
    ├── layout.tsx            Shared shell: Navbar + Footer + BottomNav
    ├── loading.tsx           Route-group loading skeleton
    ├── error.tsx             Route-group error boundary
    ├── not-found.tsx         Styled 404 (noindex — see note below)
    ├── page.tsx / home.tsx    Home
    ├── watch/                 "How do I experience this match" — tickets, venues, streams, TV
    ├── matches/                Live scores & fixtures, sport-agnostic
    ├── match/[id]/              Match detail
    ├── news/                    Article listing
    ├── news/[slug]/              Single article
    ├── teams/[slug]/             Team hub — fixtures, news, where fans watch
    ├── competitions/[slug]/       Standings, teams, fixtures, news
    ├── venues/[city]/             Programmatic city page ("sports bars in Kigali")
    ├── where-to-watch/[competition]/[city]/   "Where can I watch X in Y" — direct-answer SEO/AEO page
    ├── venue/[id]/               Venue detail (a living community hub, not a listing)
    ├── profile/, settings/
    └── about/, careers/, contact/, help/, support/, terms/, privacy/, cookies/
```

Route groups (`(app)`) don't affect the URL — they exist purely to share layout.

### Data access layer

**No page or component reads `lib/constants.ts` directly.** Every read goes through `lib/data/*.ts` — one module per entity (`venues`, `matches`, `teams`, `articles`, `community`, `user`), each exporting `async` functions shaped exactly like a future Supabase query would be:

```ts
export async function getVenues(filters?: VenueFilters): Promise<Venue[]>;
```

Today, these functions filter an in-memory array. When Supabase is connected, only the function bodies change — call sites across the entire app stay identical. This is deliberate: it's what makes "swap the backend" a data-layer change, not an application rewrite.

### URL-driven filtering (Watch, Matches, News)

Filters live in the URL, not component state — `/watch?venues&city=Kigali&sport=Football&open=true` is real, shareable, and works with back/forward navigation. The pattern: a Server Component page reads `searchParams` and renders already-filtered results server-side (crawlable, no client JS required to see correct content); a small Client Component owns only the filter _controls_ and pushes URL updates via `useRouter`. See `components/watch-filters.tsx` for the reference implementation.

### Domain model

`lib/types.ts` defines the full model — additive by design, built for where the product is going (ticketing, streaming, following, community activity) rather than only today's screens. Highlights:

- `Match.waysToWatch` — tickets, venues showing it, livestream, streaming apps, broadcast. This is what makes Watch answer "how do I experience this" instead of listing a single venue.
- `CommunityActivity` — one shape shared by `Venue.recentActivity`, `Match.attendance`, and the Home activity feed, so "someone did something" is modeled once, not per-screen.
- `Venue` — followers, photo gallery, upcoming screenings, commonly-shown competitions. A venue is a living hub, not a directory row.

---

## SEO / GEO / AEO

- **Technical SEO**: per-route `generateMetadata` (dynamic titles/descriptions), a fully dynamic `sitemap.xml` generated from real data (~140 URLs, grows automatically as content grows), `robots.txt`, canonical `metadataBase`, Open Graph + Twitter card defaults.
- **Structured data**: `Organization` + `WebSite` (sitewide), `SportsEvent` + `BreadcrumbList` (match detail), `LocalBusiness` + `BreadcrumbList` (venue detail), `SportsTeam` (team pages), `SportsOrganization` (competition pages), `Article` (news), `ItemList` (city pages), **`FAQPage`** (where-to-watch pages).
- **Programmatic SEO**: `/teams/[slug]`, `/competitions/[slug]`, `/venues/[city]`, `/where-to-watch/[competition]/[city]` are all generated from live data via `generateStaticParams`, not hand-authored pages.
- **AEO (AI search engines)**: `/where-to-watch/[competition]/[city]` is purpose-built for this — it states the question as an `<h1>` ("Where can I watch Rwanda Premier League in Kigali?") and answers it in the very next paragraph, backed by `FAQPage` schema, specifically so AI engines can lift a direct answer.

## Known Limitation: `notFound()` and HTTP Status

Because `(app)/loading.tsx` streams a skeleton immediately, that locks the HTTP response at `200` before a page's `notFound()` call can run — a documented Next.js App Router limitation, not a bug here. The mitigation applied (per Next's own docs): `(app)/not-found.tsx` sets `noindex` so search engines don't index these pages despite the `200`, even though the raw status code isn't a true `404`.

---

## What's Built vs. What's Designed

**Fully working today** (real logic, real data, no fakes): Home, Watch (by-match and by-venue modes), Matches, Match Detail, Venue Detail, Team/Competition/Article pages, programmatic city and where-to-watch pages, News, Profile, Settings, footer + legal/support pages, all URL-based filtering, full SEO/schema layer.

**Designed but not built** (deliberately — see [`supabase.md`](./supabase.md) for the full schema and reasoning): real authentication, persistent user sessions, the mutual-follow friendship system, fan points / leaderboards, venue reservations, push notifications, the admin dashboard, and light mode. None of these exist as convincing-looking fakes — a login form with no real session, or an admin dashboard nobody's role actually gates, would look done while being hollow. They're modeled in the schema and intentionally left unbuilt until a real Supabase project exists to back them.

## Project Structure

```
app/                  Routes (see Architecture above)
components/           Reusable UI — Panel, VenueCard, MatchCard, WaysToWatch,
                       AttendancePanel, FollowButton, filter controls, etc.
components/ui/        shadcn/ui primitives
lib/
  types.ts             Full domain model
  constants.ts         Typed Rwanda-first mock data (the seed data for Supabase, per supabase.md)
  data/                Data access layer — the only thing pages import from
  seo.ts               Shared site constants (URL, name, description)
  utils.ts             cn(), slugify()
public/
  brand/                Official HAFI logo assets
supabase.md            Complete backend setup guide — schema, RLS, auth, storage, migration
```

---

Built for the Rwandan sports community. HAFI brings people closer to the game — and to each other.
