import type { Metadata } from 'next'
import { getVenues, getVenueCities, getVenueSports, getVenuesForMatch } from '@/lib/data/venues'
import { getMatches } from '@/lib/data/matches'
import { VenueCard } from '@/components/venue-card'
import { SectionHeader } from '@/components/section-header'
import { MatchWatchCard } from '@/components/match-watch-card'
import { WatchFilters } from '@/components/watch-filters'
import { MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Watch — HAFI',
  description: 'Find every way to experience a match in Rwanda: tickets, venues, livestreams, and TV broadcasts.',
}

interface WatchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function WatchPage({ searchParams }: WatchPageProps) {
  const params = await searchParams
  const isVenuesMode = 'venues' in params
  const city = typeof params.city === 'string' ? params.city : undefined
  const sport = typeof params.sport === 'string' ? params.sport : undefined
  const query = typeof params.q === 'string' ? params.q : undefined
  const openOnly = params.open === 'true'

  const [cities, sports] = await Promise.all([getVenueCities(), getVenueSports()])

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <section>
        <SectionHeader title="Watch" subtitle="How do you want to experience the game?" />
      </section>

      {/* Filters (mode toggle + venue filters, URL-synced) */}
      <section>
        <WatchFilters cities={cities} sports={sports} />
      </section>

      {isVenuesMode ? (
        <VenuesResults city={city} sport={sport} query={query} openOnly={openOnly} />
      ) : (
        <MatchesResults />
      )}
    </div>
  )
}

async function MatchesResults() {
  const [live, scheduled] = await Promise.all([
    getMatches({ status: 'live' }),
    getMatches({ status: 'scheduled' }),
  ])
  const relevantMatches = [...live, ...scheduled]
  const defaultExpandedId = live[0]?.id ?? relevantMatches[0]?.id ?? null
  const venuesByMatch = await Promise.all(relevantMatches.map((m) => getVenuesForMatch(m.id)))

  return (
    <section className="space-y-3">
      {relevantMatches.map((match, idx) => (
        <MatchWatchCard
          key={match.id}
          match={match}
          venues={venuesByMatch[idx]}
          defaultExpanded={match.id === defaultExpandedId}
        />
      ))}
    </section>
  )
}

async function VenuesResults({
  city,
  sport,
  query,
  openOnly,
}: {
  city?: string
  sport?: string
  query?: string
  openOnly?: boolean
}) {
  const venues = await getVenues({ city, sport, query, openNow: openOnly })

  return (
    <section>
      {venues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No venues found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </section>
  )
}
