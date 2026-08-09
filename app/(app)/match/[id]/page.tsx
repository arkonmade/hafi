import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronLeft, Calendar } from 'lucide-react'
import { getMatchById, getCompetitionByName } from '@/lib/data/matches'
import { getVenuesForMatch } from '@/lib/data/venues'
import { WaysToWatch } from '@/components/ways-to-watch'
import { AttendancePanel } from '@/components/attendance-panel'
import { MatchSecondaryDetails } from '@/components/match-secondary-details'

const statusColor = {
  live: 'bg-accent/10 text-accent',
  scheduled: 'bg-blue-500/10 text-blue-400',
  finished: 'bg-muted text-muted-foreground',
}

interface MatchPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params
  const match = await getMatchById(parseInt(id))
  if (!match) return { title: 'Match not found — HAFI' }

  const title = `${match.homeTeam.name} vs ${match.awayTeam.name} — ${match.competition} | HAFI`
  const description = `Where to watch ${match.homeTeam.name} vs ${match.awayTeam.name} (${match.competition}): tickets, venues, livestream, and TV broadcast in Rwanda.`

  return {
    title,
    description,
    openGraph: { title, description, images: [match.homeTeam.logo] },
  }
}

export default async function MatchDetailsPage({ params }: MatchPageProps) {
  const { id } = await params
  const match = await getMatchById(parseInt(id))

  if (!match) notFound()

  const venues = await getVenuesForMatch(match.id)
  const competition = await getCompetitionByName(match.competition)

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Matches', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hafi.rw'}/matches` },
      { '@type': 'ListItem', position: 2, name: `${match.homeTeam.name} vs ${match.awayTeam.name}` },
    ],
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    sport: match.sport,
    startDate: undefined,
    eventStatus:
      match.status === 'live'
        ? 'https://schema.org/EventScheduled'
        : match.status === 'finished'
          ? 'https://schema.org/EventCompleted'
          : 'https://schema.org/EventScheduled',
    location: match.venue
      ? { '@type': 'Place', name: match.venue, address: 'Rwanda' }
      : undefined,
    competitor: [
      { '@type': 'SportsTeam', name: match.homeTeam.name },
      { '@type': 'SportsTeam', name: match.awayTeam.name },
    ],
    organizer: { '@type': 'Organization', name: match.competition },
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      {/* Back Button */}
      <Link href="/matches" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all text-sm font-medium">
        <ChevronLeft className="h-4 w-4" />
        Back to Matches
      </Link>

      {/* What's happening — Score Hero */}
      <section className="rounded-2xl bg-linear-to-br from-card to-secondary p-6 sm:p-8 border border-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
              {competition ? (
                <Link href={`/competitions/${competition.slug}`} className="hover:text-accent transition-colors">
                  {match.competition}
                </Link>
              ) : (
                match.competition
              )}
            </h1>
            <p className="text-sm text-muted-foreground">{match.sport}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold shrink-0 ${statusColor[match.status]}`}>
            {match.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-3 items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-3">
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover" />
            <span className="font-semibold text-center text-sm sm:text-base">{match.homeTeam.name}</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            {match.score ? (
              <>
                <div className="text-4xl sm:text-5xl font-bold text-foreground">
                  {match.score.home}
                  <span className="text-xl sm:text-2xl text-muted-foreground mx-3 sm:mx-4">-</span>
                  {match.score.away}
                </div>
                <span className="text-sm text-accent font-semibold">{match.time}</span>
              </>
            ) : (
              <>
                <span className="text-2xl sm:text-3xl text-muted-foreground">vs</span>
                <span className="text-sm font-medium text-foreground">{match.time}</span>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover" />
            <span className="font-semibold text-center text-sm sm:text-base">{match.awayTeam.name}</span>
          </div>
        </div>

        {match.venue && (
          <div className="mt-8 flex items-center gap-2 pt-6 border-t border-border">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">{match.venue}</span>
          </div>
        )}
      </section>

      {/* Where to experience it */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5">Where to experience it</h2>
        <WaysToWatch match={match} venues={venues} />
      </section>

      {/* Who's there */}
      <section>
        <AttendancePanel goingCount={match.attendance.goingCount} friendsGoing={match.attendance.friendsGoing} />
      </section>

      {/* What's next — secondary detail, collapsed */}
      <section>
        <MatchSecondaryDetails match={match} />
      </section>
    </div>
  )
}
