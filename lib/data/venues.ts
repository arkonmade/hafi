// Data access layer for Venues.
//
// Every function here is async and shaped like a future Supabase query
// (`await supabase.from('venues').select(...)`) even though it currently
// reads from lib/constants.ts. When Supabase is connected (see
// supabase.md), only the function bodies in this file change — no
// component or page needs to change, because the call signatures already
// match what real async data fetching looks like.

import { VENUES, MATCHES, COMPETITIONS } from '@/lib/constants'
import type { Venue } from '@/lib/types'
import { slugify } from '@/lib/utils'

export interface VenueFilters {
  city?: string
  /** Free-text search against name/city. */
  query?: string
  /** Filter to venues currently active (currentFans > 0). Maps to `open=true` in the URL. */
  openNow?: boolean
  /** Filter to venues showing this sport right now or upcoming (by name, e.g. "Football"). */
  sport?: string
}

function matchesSport(venue: Venue, sport: string): boolean {
  const sportLower = sport.toLowerCase()
  const inScreenings = venue.upcomingScreenings.some((s) => s.sport.toLowerCase() === sportLower)
  const inCommonlyShown = venue.commonlyShows.some(
    (compId) => COMPETITIONS.find((c) => c.id === compId)?.sport.toLowerCase() === sportLower,
  )
  return inScreenings || inCommonlyShown
}

export async function getVenues(filters: VenueFilters = {}): Promise<Venue[]> {
  return VENUES.filter((venue) => {
    if (filters.city && venue.city.toLowerCase() !== filters.city.toLowerCase()) return false
    if (filters.openNow && venue.currentFans <= 0) return false
    if (filters.sport && !matchesSport(venue, filters.sport)) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const matches = venue.name.toLowerCase().includes(q) || venue.city.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}

export async function getVenueById(id: number): Promise<Venue | null> {
  return VENUES.find((v) => v.id === id) ?? null
}

export async function getVenueCities(): Promise<string[]> {
  return Array.from(new Set(VENUES.map((v) => v.city)))
}

/** All sport names currently shown across any venue — used to populate the sport filter. */
export async function getVenueSports(): Promise<string[]> {
  const sports = new Set<string>()
  for (const venue of VENUES) {
    venue.upcomingScreenings.forEach((s) => sports.add(s.sport))
    venue.commonlyShows.forEach((compId) => {
      const comp = COMPETITIONS.find((c) => c.id === compId)
      if (comp) sports.add(comp.sport)
    })
  }
  return Array.from(sports)
}

export async function getVenuesForMatch(matchId: number): Promise<Venue[]> {
  const match = MATCHES.find((m) => m.id === matchId)
  if (!match) return []
  return VENUES.filter((v) => match.waysToWatch.venues.includes(v.id))
}

/** All city slugs currently in use, e.g. "kigali", "musanze" — for /venues/[city]. */
export async function getVenueCitySlugs(): Promise<string[]> {
  return Array.from(new Set(VENUES.map((v) => slugify(v.city))))
}

export async function getVenuesByCitySlug(citySlug: string): Promise<Venue[]> {
  return VENUES.filter((v) => slugify(v.city) === citySlug)
}

/** Un-slugified display name for a city slug, e.g. "kigali" -> "Kigali". */
export async function getCityNameFromSlug(citySlug: string): Promise<string | null> {
  const venue = VENUES.find((v) => slugify(v.city) === citySlug)
  return venue?.city ?? null
}

/** Venues in a given city that commonly show a given competition — the "where to watch X in Y" query. */
export async function getVenuesByCompetitionAndCity(competitionId: number, citySlug: string): Promise<Venue[]> {
  return VENUES.filter((v) => slugify(v.city) === citySlug && v.commonlyShows.includes(competitionId))
}
