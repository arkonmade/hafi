# HAFI — Supabase Setup & Schema

This document is the complete guide to standing up HAFI's backend on Supabase and connecting it to the existing Next.js application. It's written against the domain model already defined in `lib/types.ts` and the data access layer in `lib/data/*.ts` — read those two first if you haven't; every table below maps directly to a TypeScript interface already in the codebase, plus the additional tables needed for the social, gamification, and admin features specified but not yet backed by real data.

---

## 1. Project Setup

1. Create a project at [supabase.com](https://supabase.com) (choose a region close to Rwanda/East Africa — `eu-west` or `af-south-1` if available, to minimize latency).
2. From **Project Settings → API**, collect:
   - `Project URL`
   - `anon` public key
   - `service_role` key (server-only, never exposed to the client)
3. From **Project Settings → Database**, collect the connection string if you'll run migrations via the CLI or an ORM.

## 2. Environment Variables

Create `.env.local` (never commit this):

```bash
# Public — safe to expose to the browser
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxx

# Server-only — used in Server Actions / Route Handlers for privileged operations
# (e.g. awarding fan points, admin actions). Never import this in a Client Component.
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxx

# Already used by the app for metadata/sitemap/canonical URLs
NEXT_PUBLIC_SITE_URL=https://hafi.rw
```

Add `@supabase/supabase-js` and `@supabase/ssr` (the latter handles cookie-based auth sessions correctly in Next.js App Router):

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 3. Supabase Client Setup (not yet in the codebase — first Phase 2 step)

Three clients are needed, matching Supabase's Next.js App Router guidance:

```
lib/supabase/client.ts   — browser client, for Client Components
lib/supabase/server.ts   — server client, for Server Components/Actions (reads cookies)
lib/supabase/admin.ts    — service-role client, for privileged server-only operations
```

None of these exist yet. They're the first thing to add when Phase 2 begins — every function in `lib/data/*.ts` will then call one of these instead of reading `lib/constants.ts`, with the function signatures unchanged (that's the entire point of the data-access-layer refactor already done).

---

## 4. Database Schema

Run these in the Supabase SQL Editor, in order (or as sequential migration files — see §7).

### 4.1 Extensions

```sql
create extension if not exists "uuid-ossp";
create extension if not exists postgis; -- for venue geo-coordinates
```

### 4.2 Core content tables

These map directly to `lib/types.ts` and are public-read, admin-write.

```sql
-- Sports catalogue
create table sports (
  id serial primary key,
  slug text unique not null,
  name text not null,
  icon text
);

-- Teams
create table teams (
  id serial primary key,
  slug text unique not null,
  name text not null,
  short_name text,
  logo_url text,
  sport_id int references sports(id),
  city text,
  followers_count int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_teams_sport on teams(sport_id);

-- Competitions
create table competitions (
  id serial primary key,
  slug text unique not null,
  name text not null,
  sport_id int references sports(id),
  region text,
  created_at timestamptz not null default now()
);
create index idx_competitions_sport on competitions(sport_id);

-- Standings (normalized out of the mock data's inline array)
create table standings (
  id serial primary key,
  competition_id int not null references competitions(id) on delete cascade,
  team_id int references teams(id),
  rank int not null,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  points int not null default 0,
  updated_at timestamptz not null default now(),
  unique (competition_id, team_id)
);
create index idx_standings_competition on standings(competition_id);

-- Venues
create table venues (
  id serial primary key,
  name text not null,
  city text not null,
  country text not null default 'Rwanda',
  district text,
  image_url text,
  rating numeric(2,1) not null default 5.0,
  atmosphere text,
  capacity int,
  current_fans int not null default 0,
  followers_count int not null default 0,
  opening_hours text,
  location geography(point, 4326),
  created_by uuid references auth.users(id), -- venue owner/claimant, for future venue-side management
  is_verified boolean not null default false, -- admin-approved before listing (see review defaults, §4.5)
  created_at timestamptz not null default now()
);
create index idx_venues_city on venues(city);
create index idx_venues_location on venues using gist(location);

create table venue_photos (
  id serial primary key,
  venue_id int not null references venues(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create table venue_facilities (
  id serial primary key,
  venue_id int not null references venues(id) on delete cascade,
  facility text not null
);

-- Which competitions a venue commonly shows
create table venue_commonly_shows (
  venue_id int not null references venues(id) on delete cascade,
  competition_id int not null references competitions(id) on delete cascade,
  primary key (venue_id, competition_id)
);

-- Matches
create table matches (
  id serial primary key,
  sport_id int references sports(id),
  competition_id int references competitions(id),
  status text not null check (status in ('live', 'scheduled', 'finished')),
  home_team_id int references teams(id),
  away_team_id int references teams(id),
  score_home int,
  score_away int,
  display_time text, -- e.g. "72:34", "20:00", "Full Time" — kept for the existing UI's display string
  kickoff_at timestamptz, -- real timestamp, for sorting/filtering once matches have real schedules
  venue_name text, -- stadium/arena display name (distinct from venues showing it — see match_venues)
  created_at timestamptz not null default now()
);
create index idx_matches_status on matches(status);
create index idx_matches_competition on matches(competition_id);
create index idx_matches_kickoff on matches(kickoff_at);

create table match_lineups (
  id serial primary key,
  match_id int not null references matches(id) on delete cascade,
  team_side text not null check (team_side in ('home', 'away')),
  player_name text not null,
  position text
);

create table match_timeline_events (
  id serial primary key,
  match_id int not null references matches(id) on delete cascade,
  minute text not null,
  event_type text not null,
  team_side text not null check (team_side in ('home', 'away')),
  player_name text
);

-- Ways to watch
create table match_tickets (
  match_id int primary key references matches(id) on delete cascade,
  available boolean not null default false,
  price_from numeric,
  currency text default 'RWF',
  url text
);

create table match_livestreams (
  match_id int primary key references matches(id) on delete cascade,
  provider text not null,
  url text
);

create table match_streaming_apps (
  id serial primary key,
  match_id int not null references matches(id) on delete cascade,
  app_name text not null,
  app_logo_url text
);

create table match_broadcasts (
  id serial primary key,
  match_id int not null references matches(id) on delete cascade,
  channel text not null,
  region text
);

-- Venues showing a given match (the "waysToWatch.venues" array)
create table match_venues (
  match_id int not null references matches(id) on delete cascade,
  venue_id int not null references venues(id) on delete cascade,
  screening_time text,
  primary key (match_id, venue_id)
);
create index idx_match_venues_venue on match_venues(venue_id);

-- Articles
create table articles (
  id serial primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content jsonb, -- array of paragraph strings, matching Article.content in lib/types.ts
  image_url text,
  category text not null check (category in ('Club News','Transfers','Interview','Community','Analysis','Match Report')),
  author text not null,
  sport_id int references sports(id),
  published_at timestamptz not null default now()
);
create index idx_articles_category on articles(category);
create index idx_articles_published on articles(published_at desc);

create table article_related_teams (
  article_id int not null references articles(id) on delete cascade,
  team_id int not null references teams(id) on delete cascade,
  primary key (article_id, team_id)
);
```

### 4.3 Users & Auth

Supabase Auth owns `auth.users`. Everything else — profile data, roles — lives in `public.profiles`, linked 1:1.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  name text not null,
  bio text,
  avatar_url text,
  city text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, handle, name)
  values (new.id, split_part(new.email, '@', 1), coalesce(new.raw_user_meta_data->>'name', 'New Fan'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 4.4 Social — follows, friendships, favorites

```sql
-- Generic user-to-user follow. A row here means "follower_id follows following_id".
create table user_follows (
  follower_id uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
create index idx_user_follows_following on user_follows(following_id);

-- Mutual friendship is computed, not stored: A and B are friends iff both
-- follow rows exist. This view is the canonical way to query it —
-- don't duplicate the logic elsewhere.
create view friendships as
  select a.follower_id as user_a, a.following_id as user_b, a.created_at as became_friends_at
  from user_follows a
  join user_follows b
    on a.follower_id = b.following_id and a.following_id = b.follower_id
  where a.follower_id < a.following_id; -- avoid duplicate rows (A,B) and (B,A)

create table team_follows (
  user_id uuid not null references profiles(id) on delete cascade,
  team_id int not null references teams(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, team_id)
);

create table venue_follows (
  user_id uuid not null references profiles(id) on delete cascade,
  venue_id int not null references venues(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, venue_id)
);

create table favorite_sports (
  user_id uuid not null references profiles(id) on delete cascade,
  sport_id int not null references sports(id) on delete cascade,
  primary key (user_id, sport_id)
);
```

### 4.5 Venues — check-ins, reservations, reviews

```sql
create table checkins (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  venue_id int not null references venues(id) on delete cascade,
  match_id int references matches(id),
  created_at timestamptz not null default now()
);
create index idx_checkins_venue on checkins(venue_id, created_at desc);
create index idx_checkins_user on checkins(user_id, created_at desc);

create table venue_reservations (
  id bigserial primary key,
  venue_id int not null references venues(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  match_id int references matches(id),
  party_size int not null default 1,
  requested_at timestamptz not null default now(),
  reservation_time timestamptz,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  notes text
);
create index idx_reservations_venue on venue_reservations(venue_id, status);

create table venue_reviews (
  id bigserial primary key,
  venue_id int not null references venues(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (venue_id, user_id) -- one review per user per venue
);
create index idx_reviews_venue on venue_reviews(venue_id);

-- Recompute a venue's real rating once actual reviews exist. Before any
-- reviews, venues keep their admin-set default (5.0, per your "verified
-- venue" starting state) — this function only touches venues that have
-- at least one real review, so the placeholder default never gets
-- overwritten by a rating of zero.
create function public.recalculate_venue_rating(target_venue_id int)
returns void as $$
begin
  update venues
  set rating = (
    select round(avg(rating)::numeric, 1)
    from venue_reviews
    where venue_id = target_venue_id
  )
  where target_venue_id in (select venue_id from venue_reviews where venue_id = target_venue_id);
end;
$$ language plpgsql security definer;

create trigger on_review_change
  after insert or update or delete on venue_reviews
  for each row execute function public.recalculate_venue_rating(coalesce(new.venue_id, old.venue_id));
```

### 4.6 Community activity feed

```sql
create table community_activity (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  activity_type text not null check (
    activity_type in ('watching', 'checked_in', 'going', 'followed_team', 'followed_venue', 'reviewed_venue')
  ),
  target_type text not null check (target_type in ('venue', 'match', 'team', 'competition')),
  target_id int not null,
  message text not null, -- precomposed display text, matching CommunityActivity.action in lib/types.ts
  created_at timestamptz not null default now()
);
create index idx_activity_created on community_activity(created_at desc);
create index idx_activity_target on community_activity(target_type, target_id);
```

### 4.7 Gamification — fan points, leaderboards, achievements

```sql
-- Append-only ledger. Never update/delete rows — totals are always
-- computed by summing, so the leaderboard logic can't be gamed by
-- editing history, and you get a full audit trail for free.
create table fan_points_ledger (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  points int not null,
  source text not null check (
    source in ('checkin', 'watched_match', 'followed_team', 'followed_fan', 'review', 'community_activity')
  ),
  related_type text,
  related_id int,
  created_at timestamptz not null default now()
);
create index idx_points_user on fan_points_ledger(user_id);
create index idx_points_created on fan_points_ledger(created_at);

-- Daily/weekly/monthly/all-time leaderboards are queries against this
-- ledger, not separate tables — e.g. "weekly leaders":
--   select user_id, sum(points) from fan_points_ledger
--   where created_at > now() - interval '7 days'
--   group by user_id order by sum(points) desc limit 50;

-- Team fan competition: same ledger pattern, scoped to a team, answering
-- "which team has the strongest HAFI fan community" (not sporting performance).
create table team_fan_points_ledger (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  team_id int not null references teams(id) on delete cascade,
  points int not null,
  source text not null,
  created_at timestamptz not null default now()
);
create index idx_team_points_team on team_fan_points_ledger(team_id);

create table achievements (
  id serial primary key,
  slug text unique not null,
  name text not null,
  description text,
  icon text
);

create table user_achievements (
  user_id uuid not null references profiles(id) on delete cascade,
  achievement_id int not null references achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);
```

### 4.8 Notifications

```sql
create table notifications (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (
    type in ('match_reminder', 'friend_activity', 'venue_activity', 'checkin', 'team_update', 'admin_announcement')
  ),
  title text not null,
  body text,
  related_type text,
  related_id int,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on notifications(user_id, read_at);

create table notification_preferences (
  user_id uuid not null references profiles(id) on delete cascade,
  category text not null,
  enabled boolean not null default true,
  primary key (user_id, category)
);
```

### 4.9 Admin content

```sql
create table admin_announcements (
  id bigserial primary key,
  title text not null,
  body text not null,
  created_by uuid references profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

## 5. Row Level Security (RLS)

Enable RLS on every table, then apply policies. Pattern used throughout: **public content is world-readable, write access is admin-only or owner-only.**

```sql
-- Enable RLS everywhere
alter table sports enable row level security;
alter table teams enable row level security;
alter table competitions enable row level security;
alter table standings enable row level security;
alter table venues enable row level security;
alter table venue_photos enable row level security;
alter table venue_facilities enable row level security;
alter table venue_commonly_shows enable row level security;
alter table matches enable row level security;
alter table match_lineups enable row level security;
alter table match_timeline_events enable row level security;
alter table match_tickets enable row level security;
alter table match_livestreams enable row level security;
alter table match_streaming_apps enable row level security;
alter table match_broadcasts enable row level security;
alter table match_venues enable row level security;
alter table articles enable row level security;
alter table article_related_teams enable row level security;
alter table profiles enable row level security;
alter table user_follows enable row level security;
alter table team_follows enable row level security;
alter table venue_follows enable row level security;
alter table favorite_sports enable row level security;
alter table checkins enable row level security;
alter table venue_reservations enable row level security;
alter table venue_reviews enable row level security;
alter table community_activity enable row level security;
alter table fan_points_ledger enable row level security;
alter table team_fan_points_ledger enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table notifications enable row level security;
alter table notification_preferences enable row level security;
alter table admin_announcements enable row level security;

-- Helper: is the current user an admin?
create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;
```

```sql
-- Public content: readable by anyone (including anon, for SEO pages
-- rendered without a logged-in session), writable only by admins.
create policy "public read" on sports for select using (true);
create policy "admin write" on sports for insert with check (is_admin());
create policy "admin update" on sports for update using (is_admin());
create policy "admin delete" on sports for delete using (is_admin());
-- Repeat the same four-policy pattern for: teams, competitions, standings,
-- venues, venue_photos, venue_facilities, venue_commonly_shows, matches,
-- match_lineups, match_timeline_events, match_tickets, match_livestreams,
-- match_streaming_apps, match_broadcasts, match_venues, articles,
-- article_related_teams, achievements, admin_announcements.

-- Profiles: anyone can read (social discovery), users can only edit their own.
create policy "profiles are public" on profiles for select using (true);
create policy "users update own profile" on profiles for update using (auth.uid() = id);

-- Follows / favorites: users manage their own edges, everyone can read
-- (so follower counts and "who's going" are visible without auth).
create policy "read follows" on user_follows for select using (true);
create policy "manage own follows" on user_follows for insert with check (auth.uid() = follower_id);
create policy "remove own follows" on user_follows for delete using (auth.uid() = follower_id);
-- Same pattern for team_follows, venue_follows, favorite_sports (owner = user_id).

-- Check-ins: public read (community activity), owner-only write.
create policy "read checkins" on checkins for select using (true);
create policy "create own checkins" on checkins for insert with check (auth.uid() = user_id);

-- Reservations: private — only the requester and admins can see them.
create policy "own reservations" on venue_reservations for select using (auth.uid() = user_id or is_admin());
create policy "create own reservations" on venue_reservations for insert with check (auth.uid() = user_id);
create policy "admin manage reservations" on venue_reservations for update using (is_admin());

-- Reviews: public read, owner-only write, one per user per venue (enforced by the unique constraint above).
create policy "read reviews" on venue_reviews for select using (true);
create policy "create own review" on venue_reviews for insert with check (auth.uid() = user_id);
create policy "update own review" on venue_reviews for update using (auth.uid() = user_id);

-- Community activity: public read (it's a feed), inserts happen via a
-- server-side function (see below), never directly from the client —
-- this stops users from fabricating fake activity.
create policy "read activity" on community_activity for select using (true);

-- Fan points: public read for leaderboards, but NEVER insertable directly
-- by users — only via SECURITY DEFINER functions triggered by real
-- actions (a check-in, a follow), so points can't be self-awarded.
create policy "read points" on fan_points_ledger for select using (true);
create policy "read team points" on team_fan_points_ledger for select using (true);

create policy "own achievements read" on user_achievements for select using (true);

-- Notifications: strictly private to the owner.
create policy "own notifications" on notifications for select using (auth.uid() = user_id);
create policy "update own notifications" on notifications for update using (auth.uid() = user_id);
create policy "own notification prefs" on notification_preferences for all using (auth.uid() = user_id);
```

**Important**: fan points and community activity should be written by `SECURITY DEFINER` Postgres functions (e.g. `award_checkin_points(user_id, venue_id)`) called from a Server Action, not directly inserted by the client — this is what prevents users from granting themselves points or fabricating activity. Scaffold these functions when Phase 4 begins.

---

## 6. Authentication Setup

1. **Email/password**: enabled by default in Supabase Auth. Configure email templates under **Auth → Email Templates** (confirmation, magic link, password reset) — brand them with HAFI's colors/logo before launch.
2. **OAuth (Google, Apple)**: under **Auth → Providers**, enable Google and Apple, and supply their respective OAuth client credentials. The codebase doesn't call these yet, but `lib/data/user.ts`'s `getCurrentUser()` is already the single seam where a real session lookup will replace the current mock return — no other file needs to change when this lands.
3. **Session handling in Next.js**: use `@supabase/ssr`'s `createServerClient`/`createBrowserClient` pair so sessions work correctly across Server Components, Client Components, and middleware. Add `middleware.ts` at the project root to refresh the session cookie on every request (standard Supabase + Next.js App Router pattern — see Supabase's official Next.js guide for the exact boilerplate, since it changes between Supabase SSR package versions).
4. **Roles**: `profiles.role` (`'user' | 'admin'`) is the source of truth. Route protection for `/admin/*` (once built) should check this server-side via `getCurrentUser()`, not trust a client-side flag.

---

## 7. Storage

Create three buckets under **Storage**:

| Bucket | Access | Used for |
|---|---|---|
| `avatars` | Public read, authenticated write (own file only) | Profile pictures |
| `venue-media` | Public read, admin write | Venue hero images + photo galleries |
| `article-media` | Public read, admin write | Article hero images |

Suggested path convention: `avatars/{user_id}.jpg`, `venue-media/{venue_id}/{index}.jpg`, `article-media/{article_id}.jpg` — predictable paths make cache invalidation and cleanup straightforward.

Storage RLS policy pattern (avatars example):

```sql
create policy "public read avatars" on storage.objects for select
  using (bucket_id = 'avatars');

create policy "users upload own avatar" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 8. Migration Steps

1. Run §4's SQL in order (extensions → core content → auth → social → venues → activity → gamification → notifications → admin).
2. Run §5's RLS policies.
3. Run §6's auth trigger.
4. Seed data (§9).
5. Point `lib/supabase/*.ts` clients at the project (once created — see §3).
6. Migrate `lib/data/*.ts` functions one file at a time, swapping the `lib/constants.ts` read for a Supabase query, **keeping every exported function signature identical**. Suggested order (lowest to highest risk):
   1. `lib/data/teams.ts`, `lib/data/matches.ts` (competitions, sports) — pure read, no auth dependency
   2. `lib/data/articles.ts`
   3. `lib/data/venues.ts`
   4. `lib/data/community.ts` — once `community_activity` has real rows
   5. `lib/data/user.ts` — last, since it's the one that depends on auth actually working end-to-end
7. Because every page already calls only `lib/data/*`, no page or component needs to change during this migration — verify this by running `grep -rln "from '@/lib/constants'" app components` after each swap; it should only ever show `lib/data/*.ts` files, same as today.

## 9. Seed Data Instructions

The existing `lib/constants.ts` **is** your seed data — every value in it should become an `insert` statement. Two approaches:

- **Quick**: write a one-off Node script using `@supabase/supabase-js` with the service-role key that imports `lib/constants.ts` and inserts each array into its corresponding table, preserving the same numeric IDs so foreign keys line up (`TEAMS[0].id` → `teams.id = 1`, etc.).
- **Proper**: convert `lib/constants.ts`'s arrays into `.sql` seed files (one per table) checked into a `supabase/seed.sql`, so `supabase db reset` reproduces the same known-good dataset for every developer and in CI.

Either way, seed in dependency order: `sports` → `teams`/`competitions` → `standings` → `venues` → `venue_photos`/`venue_facilities`/`venue_commonly_shows` → `matches` → `match_*` tables → `articles`/`article_related_teams`. `profiles`/`community_activity`/`fan_points_ledger` can't be meaningfully seeded until real auth users exist — leave those empty until Phase 3.

## 10. Connecting the Existing App

Once §3's clients exist and at least one `lib/data/*.ts` file has been migrated:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

```bash
npm run dev
```

Every page already fetches through `lib/data/*` — there is no other wiring needed. This is the direct payoff of the data-access-layer work done in Wave 1: the UI layer was built to be backend-agnostic from the start, specifically so this step would be this small.

## 11. Future Backend Recommendations

- **Realtime**: use Supabase Realtime on `matches` (score updates), `community_activity` (live feed), and `notifications` (push-style in-app alerts) once those become genuinely live rather than static mock data.
- **Edge Functions**: good fit for the `SECURITY DEFINER`-adjacent logic that shouldn't live in the client — awarding fan points, sending push notifications, admin-triggered announcements/challenges.
- **Full-text search**: Postgres `tsvector` columns on `venues.name`/`teams.name`/`articles.title` once search needs to go beyond simple `ilike` matching (the current `getVenues({ query })` filter).
- **Materialized views**: once `fan_points_ledger` has real volume, materialize the daily/weekly/monthly leaderboard queries instead of computing them live on every page load.
- **Cron (`pg_cron`)**: for the "Daily Fan Winner" / "Weekly Top Fans" rollups mentioned in the brief — compute and snapshot these on a schedule rather than live-querying the ledger on every leaderboard page view.

---

## Known Limitations at Handoff

- No Supabase project has actually been created — this document describes what to build, not something already running.
- `lib/supabase/*.ts` clients don't exist yet; they're the literal first file to add.
- Social/gamification/admin tables above have **no corresponding UI yet** — Phase 3–5 features described in the original brief still need building on top of this schema once it's live.
- `match_venues.screening_time` and similar per-row fields are simplified compared to fully modeling recurring vs. one-off screenings — revisit if venues need to schedule the same competition differently week to week.
