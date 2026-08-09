import type { Metadata } from 'next'
import Link from 'next/link'
import { getMatches, getSportsInUse, getCompetitions } from '@/lib/data/matches'
import { MatchCard } from '@/components/match-card'
import { SectionHeader } from '@/components/section-header'
import { MatchesFilters } from '@/components/matches-filters'

export const metadata: Metadata = {
  title: 'Matches — HAFI',
  description: 'Live scores and fixtures across football, basketball, volleyball, and more in Rwanda.',
}

interface MatchesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const statusMap = { live: 'live', upcoming: 'scheduled', results: 'finished' } as const

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const params = await searchParams
  const statusParam = typeof params.status === 'string' ? params.status : 'live'
  const status = statusMap[statusParam as keyof typeof statusMap] ?? 'live'
  const sport = typeof params.sport === 'string' ? params.sport : undefined

  const [matches, sportsInUse, competitions] = await Promise.all([
    getMatches({ status, sport }),
    getSportsInUse(),
    getCompetitions(),
  ])
  const competitionsWithStandings = competitions.filter((c) => c.standings.length > 0)

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <section>
        <SectionHeader title="Matches" subtitle="Follow every sport, not just football" />
      </section>

      <MatchesFilters sports={sportsInUse} />

      {/* Matches Grid */}
      <section>
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No matches found</p>
            <p className="text-muted-foreground">Try selecting a different filter or check back later</p>
          </div>
        )}
      </section>

      {/* Competitions Section */}
      {competitionsWithStandings.length > 0 && (
        <section className="space-y-6">
          <SectionHeader title="Standings" subtitle="Current league tables" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitionsWithStandings.map((comp) => (
              <div key={comp.id} className="rounded-2xl bg-card p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    <Link href={`/competitions/${comp.slug}`} className="hover:text-accent transition-colors">
                      {comp.name}
                    </Link>
                  </h3>
                  <span className="text-xs text-muted-foreground">{comp.region}</span>
                </div>
                <div className="space-y-2">
                  {comp.standings.map((row) => (
                    <div key={row.team} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-semibold text-muted-foreground w-4 flex-shrink-0">{row.rank}</span>
                        <span className="text-sm font-medium text-foreground truncate">{row.team}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground flex-shrink-0">{row.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
