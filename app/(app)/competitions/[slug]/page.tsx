import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import {
  getCompetitionBySlug,
  getCompetitions,
  getMatches,
  getTeamsInCompetition,
  getArticlesForCompetition,
} from '@/lib/data/matches'
import { MatchCard } from '@/components/match-card'
import { ArticleCard } from '@/components/article-card'
import { SITE_URL } from '@/lib/seo'

interface CompetitionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const competitions = await getCompetitions()
  return competitions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: CompetitionPageProps): Promise<Metadata> {
  const { slug } = await params
  const competition = await getCompetitionBySlug(slug)
  if (!competition) return { title: 'Competition not found — HAFI' }

  const title = `${competition.name} — Fixtures, Standings & Where to Watch | HAFI`
  const description = `${competition.name} (${competition.region}): live scores, fixtures, standings, and where to watch every match in Rwanda.`

  return { title, description, openGraph: { title, description } }
}

export default async function CompetitionPage({ params }: CompetitionPageProps) {
  const { slug } = await params
  const competition = await getCompetitionBySlug(slug)
  if (!competition) notFound()

  const [allMatches, teams, articles] = await Promise.all([
    getMatches({ competition: competition.name }),
    getTeamsInCompetition(competition.name),
    getArticlesForCompetition(competition.name),
  ])
  // Standings rows only carry a team display name — resolve the real slug via
  // the actual Team records (already fetched as `teams`) rather than deriving
  // one from the string, so this never silently links to a nonexistent page.
  const teamSlugByName = new Map(teams.map((t) => [t.name, t.slug]))

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: competition.name,
    sport: competition.sport,
    url: `${SITE_URL}/competitions/${competition.slug}`,
    areaServed: competition.region,
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Matches', item: `${SITE_URL}/matches` },
      { '@type': 'ListItem', position: 2, name: competition.name },
    ],
  }

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <Link href="/matches" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all text-sm font-medium">
        <ChevronLeft className="h-4 w-4" />
        Back to Matches
      </Link>

      {/* Header */}
      <section className="rounded-2xl bg-card border border-border p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{competition.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {competition.sport} · {competition.region}
        </p>
      </section>

      {/* Standings */}
      {competition.standings.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Standings</h2>
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            {competition.standings.map((row) => {
              const teamSlug = teamSlugByName.get(row.team)
              return (
                <div key={row.team} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-semibold text-muted-foreground w-4 flex-shrink-0">{row.rank}</span>
                    {teamSlug ? (
                      <Link href={`/teams/${teamSlug}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors truncate">
                        {row.team}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-foreground truncate">{row.team}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                    <span>P {row.played}</span>
                    <span>W {row.won}</span>
                    <span className="font-semibold text-foreground">{row.points} pts</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Teams */}
      {teams.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Teams</h2>
          <div className="flex flex-wrap gap-3">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.slug}`}
                className="flex items-center gap-2 rounded-full bg-secondary pl-1.5 pr-4 py-1.5 hover:bg-secondary/70 transition-colors"
              >
                <img src={team.logo} alt={team.name} className="h-7 w-7 rounded-full object-cover" />
                <span className="text-sm font-medium text-foreground">{team.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Matches */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Matches</h2>
        {allMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No matches scheduled right now.</p>
        )}
      </section>

      {/* Articles */}
      {articles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
