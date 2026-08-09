/**
 * HAFI domain model.
 *
 * Design intent (see implementation notes for full rationale):
 * - Additive, not destructive: every field the current UI reads still exists
 *   under its original name, so existing screens keep working unchanged.
 * - Modeled around the *experience* (what's happening / where / who's there /
 *   what's next), not a scoreboard.
 * - Community is first-class: `CommunityActivity` is a shared shape used by
 *   Venue.recentActivity, Match.attendance, and the home Friends Activity
 *   panel — not a one-off feed type bolted onto Home.
 * - Sport-agnostic throughout: nothing assumes football. `sport` is always a
 *   plain string key against the `Sport` catalogue below, so the same shapes
 *   serve basketball, volleyball, rugby, athletics, cycling, tennis,
 *   motorsports, and esports without special-casing.
 * - Region-flexible: `Venue`/`Competition` carry `region`/`country`/`city`
 *   fields rather than hardcoding Rwanda into the shape itself. The *data*
 *   in lib/constants.ts is Rwanda-first; the *model* is Africa-ready.
 * - Forward-looking optional fields (ticketing, streaming, follower counts,
 *   photo galleries) are included now even though no screen fully uses them
 *   yet, because retrofitting a scoreboard-shaped Match to support "how do I
 *   experience this" later would mean breaking every consumer at once.
 */

// ---------------------------------------------------------------------------
// Sports catalogue
// ---------------------------------------------------------------------------

export interface Sport {
  id: number
  /** Stable machine key (e.g. for future /matches/[sport] routes or filters). Display name may localize; this shouldn't. */
  slug: string
  name: string
  icon: string
}

// ---------------------------------------------------------------------------
// Teams & Competitions
// ---------------------------------------------------------------------------

export interface Team {
  id: number
  /** URL-safe identifier for /teams/[slug], e.g. "apr-fc". */
  slug: string
  name: string
  shortName?: string
  logo: string
  /** Sport display name (matches Sport.name) — kept as a plain string so existing filter logic (`match.sport === selectedSport`) keeps working. */
  sport: string
  city?: string
  followers: number
}

export interface StandingRow {
  rank: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  points: number
}

export interface Competition {
  id: number
  /** URL-safe identifier for /competitions/[slug], e.g. "rwanda-premier-league". */
  slug: string
  name: string
  sport: string
  /** e.g. "Rwanda", "East Africa", "International" — lets Home group fixtures by region without assuming any one country. */
  region: string
  standings: StandingRow[]
}

// ---------------------------------------------------------------------------
// Community — first-class, shared across venues, matches, and the home feed
// ---------------------------------------------------------------------------

export type CommunityActionType =
  | 'watching'
  | 'checked_in'
  | 'going'
  | 'followed_team'
  | 'followed_venue'
  | 'reviewed_venue'

export interface CommunityUser {
  id: number
  name: string
  avatar: string
}

export interface CommunityTarget {
  type: 'venue' | 'match' | 'team' | 'competition'
  id: number
  name: string
}

export interface CommunityActivity {
  id: number
  user: CommunityUser
  type: CommunityActionType
  target: CommunityTarget
  time: string
  /** Precomposed, human-readable action text (e.g. "is watching at"), kept so the existing ActivityFeed component (and anything else expecting a flat string) needs no changes yet. */
  action: string
  /** Kept for backward compatibility with the current ActivityFeed component, which renders a venue line directly. Mirrors target.name for venue-typed activity. */
  venue: string
}

// ---------------------------------------------------------------------------
// Venue — a living community hub, not a directory listing
// ---------------------------------------------------------------------------

export interface VenueScreening {
  /** References Match.id. Named `id` (not `matchId`) to preserve the field name the existing Venue Detail page already reads. */
  id: number
  teams: string
  time: string
  sport: string
}

export interface GeoPoint {
  lat: number
  lng: number
}

export interface Venue {
  id: number
  name: string
  city: string
  country: string
  /** Rwanda-specific granularity (e.g. a Kigali sector like Kimihurura); optional so the shape still fits venues elsewhere. */
  district?: string
  image: string
  /** Photo gallery beyond the hero image — atmosphere shots, event photos. */
  photos: string[]
  rating: number
  atmosphere: string
  capacity: number
  currentFans: number
  /** People following this venue for updates — following a venue should carry the same weight as following a club. */
  followers: number
  openingHours: string
  facilities: string[]
  location?: GeoPoint
  /** Kept for backward compatibility — screenings currently showing/scheduled at this venue. */
  matches: VenueScreening[]
  /** Same shape as `matches`, explicit name for the "what's coming up here" use case. */
  upcomingScreenings: VenueScreening[]
  /** Competition ids this venue is known for showing. */
  commonlyShows: number[]
  recentActivity: CommunityActivity[]
}

// ---------------------------------------------------------------------------
// Match — modeled as an experience: what / where / who / what next
// ---------------------------------------------------------------------------

export interface TeamRef {
  name: string
  logo: string
}

export interface TicketInfo {
  available: boolean
  url?: string
  priceFrom?: number
  currency?: string
}

export interface StreamInfo {
  provider: string
  url?: string
}

export interface StreamingApp {
  name: string
  logo: string
}

export interface BroadcastInfo {
  channel: string
  region: string
}

/** Answers "how do I experience this match?" — the core of the Watch pillar. */
export interface WaysToWatch {
  tickets?: TicketInfo
  /** Venue ids showing this match. */
  venues: number[]
  livestream?: StreamInfo
  streamingApps?: StreamingApp[]
  broadcast?: BroadcastInfo[]
}

export interface MatchAttendance {
  goingCount: number
  friendsGoing: CommunityUser[]
}

export interface TimelineEvent {
  time: string
  event: string
  team: 'home' | 'away'
  player: string
}

export interface Match {
  id: number
  sport: string
  competition: string
  status: 'live' | 'scheduled' | 'finished'
  homeTeam: TeamRef
  awayTeam: TeamRef
  score?: { home: number; away: number }
  time: string
  /** Kept for backward compatibility — display name of the primary/host venue. */
  venue?: string
  lineups?: { home: string[]; away: string[] }
  timeline?: TimelineEvent[]
  waysToWatch: WaysToWatch
  attendance: MatchAttendance
}

// ---------------------------------------------------------------------------
// News — a pillar, not an afterthought
// ---------------------------------------------------------------------------

export type ArticleCategory =
  | 'Club News'
  | 'Transfers'
  | 'Interview'
  | 'Community'
  | 'Analysis'
  | 'Match Report'

export interface Article {
  id: number
  /** URL-safe identifier for /news/[slug]. */
  slug: string
  title: string
  excerpt: string
  /** Full article body (paragraphs), used on the single-article page. Optional so summary-only articles still validate. */
  content?: string[]
  image: string
  category: ArticleCategory
  author: string
  publishedAt: string
  sport?: string
  relatedTeamIds?: number[]
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
}

export interface UserProfile {
  id: number
  name: string
  handle: string
  bio: string
  avatar: string
  city?: string
  followers: number
  following: number
  favoriteTeams: number[]
  favoriteSports: string[]
  /** Kept for backward compatibility with the current Profile page ("Saved Venues"). */
  savedVenues: number[]
  /** Following a venue is community, not a bookmark — surfaced separately from savedVenues going forward. */
  followedVenues: number[]
  achievements: Achievement[]
}
