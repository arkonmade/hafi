import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronLeft, Users } from 'lucide-react'
import { getTeamBySlug, getTeams, getMatchesForTeam, getArticlesForTeam, getVenuesForTeam } from '@/lib/data/teams'
import { MatchCard } from '@/components/match-card'
import { ArticleCard } from '@/components/article-card'
import { VenueMiniCard } from '@/components/venue-mini-card'
import { SITE_URL } from '@/lib/seo'

interface TeamPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const teams = await getTeams()
  return teams.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params
  const team = await getTeamBySlug(slug)
  if (!team) return { title: 'Team not found — HAFI' }

  const title = `${team.name} — Fixtures, News & Where to Watch | HAFI`
  const description = `Follow ${team.name}: upcoming ${team.sport.toLowerCase()} fixtures, news, and the best venues in Rwanda to watch their matches.`

  return {
    title,
    description,
    openGraph: { title, description, images: [team.logo] },
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params
  const team = await getTeamBySlug(slug)
  if (!team) notFound()

  const [matches, articles, venues] = await Promise.all([
    getMatchesForTeam(team.name),
    getArticlesForTeam(team),
    getVenuesForTeam(team.name),
  ])

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.name,
    sport: team.sport,
    logo: team.logo,
    url: `${SITE_URL}/teams/${team.slug}`,
    ...(team.city ? { location: { '@type': 'Place', name: team.city } } : {}),
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Matches', item: `${SITE_URL}/matches` },
      { '@type': 'ListItem', position: 2, name: team.name },
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
      <section className="flex items-center gap-5 rounded-2xl bg-card border border-border p-6">
        <img src={team.logo} alt={team.name} className="h-20 w-20 rounded-2xl object-cover flex-shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{team.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {team.sport}
            {team.city ? ` · ${team.city}` : ''}
          </p>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {team.followers.toLocaleString()} followers
          </p>
        </div>
      </section>

      {/* Matches */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Fixtures & Results</h2>
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No fixtures found for {team.name} right now.</p>
        )}
      </section>

      {/* Venues watching this team */}
      {venues.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Where fans watch {team.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {venues.map((v) => (
              <VenueMiniCard key={v.id} venue={v} />
            ))}
          </div>
        </section>
      )}

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
