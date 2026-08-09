# HAFI - Sports, Together

A modern Rwandan sports platform built with Next.js 16, TypeScript, and Tailwind CSS. HAFI is not a livescore app — it's the platform that helps people discover, experience, and connect through sport: what's happening, where to experience it, who's there, and what to do next.

## Design System

### Brand Identity
- **Logo**: Official HAFI mark + wordmark (`public/brand/`)
- **Typography**: Manrope Variable, self-hosted via `@fontsource-variable/manrope`
- **Color Palette** (almost monochrome, teal accent):
  - Charcoal (Background): `#121212`
  - Surface: `#1C1C1C`
  - Warm White (Primary Text): `#F7F5F2`
  - Secondary Text: `#A8A8A8`
  - Deep Teal (Accent): `#0F766E`
  - Border: `#2A2A2A`

### Design Principles
Minimal, premium, human, warm, modern, calm, timeless. Whitespace over clutter, typography over decoration, consistency over trends. No gradients, no glassmorphism.

### Spacing & Radius
- 8px grid system for consistent spacing
- 16px rounded corners (`--radius: 1rem`) as the canonical scale

## Product Pillars

1. **Discover** — what's happening across every sport, not just football.
2. **Watch** — how to experience a match: tickets, venues, livestreams, streaming apps, TV broadcast. HAFI's core differentiator.
3. **Matches** — live scores and fixtures, sport-agnostic.
4. **News** — stories, club updates, transfers, community highlights (Rwandan sport, expanding to East Africa).
5. **Community** — first-class throughout: who's watching, who's going, who's checked in. Not a bolt-on feature.

## Navigation

HAFI uses **one nav system per breakpoint** — no duplicated navigation:

- **Desktop (md+)**: sticky top navbar — Discover · Watch · Matches · News, plus search, notifications, avatar, and share.
- **Mobile (< md)**: fixed bottom nav — Home · Watch · Matches · Profile.
- Settings is reached from Profile, not a global nav item.

There is intentionally no persistent desktop sidebar — the original design had none on Home, so a second nav system duplicating the same destinations was removed in favor of this single, consistent model across breakpoints.

## Architecture

### Route Structure
All primary screens live under a single route group so the app shell (`Navbar` + `BottomNav`) is defined once, not per-page:

```
app/
├── layout.tsx              # Root HTML shell, fonts, metadata, favicons
├── globals.css              # Design tokens (colors, radius, font-sans)
└── (app)/
    ├── layout.tsx            # Shared shell: Navbar + BottomNav
    ├── page.tsx              # Wraps home.tsx
    ├── home.tsx              # Homepage content
    ├── watch/page.tsx        # Venue directory ("how do I experience this?")
    ├── matches/page.tsx      # Sport-agnostic match list
    ├── match/[id]/page.tsx   # Match detail
    ├── news/page.tsx         # News placeholder (full build pending Article model)
    ├── profile/page.tsx      # User profile
    ├── settings/page.tsx     # Settings
    └── venue/[id]/page.tsx   # Venue detail
```

Route groups (`(app)`) don't affect the URL — `/watch` is still `/watch`. This exists purely to share layout without changing routing.

### Components

- `Navbar`, `BottomNav` — app shell, assembled once in `app/(app)/layout.tsx`
- `Panel` — the reusable bordered-container-with-header pattern (title/subtitle/leading/view-all) used across Home, Watch, Venue, and Match screens. New sections (notifications, community feed, ticketing) should build on this rather than reinventing the card pattern.
- `VenueCard`, `MatchCard`, `SectionHeader`, `FilterChips`, `LiveBadge` — existing, reused as-is
- `Button` (`components/ui/button.tsx`) — shadcn primitive

### Data Model
All data currently lives in `lib/constants.ts` as typed mock data (see implementation notes for the in-progress domain model expansion — `waysToWatch`, `Article`, `CommunityActivity` — designed for ticketing, reservations, livestreams, and social features, not just today's UI).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Manrope Variable (self-hosted, `@fontsource-variable/manrope`)

## Styling Guidelines

- **Color Usage**: Always use Tailwind classes from the design system (`bg-background`, `text-accent`, etc.)
- **Spacing**: Use 8px grid (`p-4`, `gap-6`, `mt-8`)
- **Radius**: Stay on the 16px scale already defined in `@theme inline`
- **Hover States**: Include on interactive elements
- **Responsive**: Mobile-first, test at 375px, 768px, 1280px viewports
- **Sport-agnostic**: Nothing in copy, icons, or layout should assume football is the only sport

## Region

Rwanda-first data and experience (Kigali, Huye, Musanze; APR FC, Rayon Sports, Police FC, REG; Rwanda Premier League, Rwanda Basketball League, etc.), on an architecture designed to scale to East Africa and beyond.

---

Built for the Rwandan sports community. HAFI brings people closer to the game — and to each other.

