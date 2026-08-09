import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import { getCompetitionBySlug, getCompetitions, getMatches } from '@/lib/data/matches'
import { getVenuesByCompetitionAndCity, getVenueCitySlugs, getCityNameFromSlug } from '@/lib/data/venues'
import { VenueCard } from '@/components/venue-card'
import { MatchCard } from '@/components/match-card'
import { SITE_URL } from '@/lib/seo'

interface WhereToWatchPageProps {
  params: Promise<{ competition: string; city: string }>
}

export async function generateStaticParams() {
  const [competitions, citySlugs] = await Promise.all([getCompetitions(), getVenueCitySlugs()])
  const params: { competition: string; city: string }[] = []
  for (const comp of competitions) {
    for (const city of citySlugs) {
      params.push({ competition: comp.slug, city })
    }
  }
  return params
}

export async function generateMetadata({ params }: WhereToWatchPageProps): Promise<Metadata> {
  const { competition: competitionSlug, city: citySlug } = await params
  const [competition, cityName] = await Promise.all([
    getCompetitionBySlug(competitionSlug),
    getCityNameFromSlug(citySlug),
  ])
  if (!competition || !cityName) return { title: 'Page not found — HAFI' }

  const title = `Where to Watch ${competition.name} in ${cityName} | HAFI`
  const description = `Find bars and venues showing ${competition.name} matches in ${cityName}, Rwanda. Live listings, atmosphere, and screening times on HAFI.`

  return { title, description, openGraph: { title, description } }
}

export default async function WhereToWatchPage({ params }: WhereToWatchPageProps) {
  const { competition: competitionSlug, city: citySlug } = await params
  const [competition, cityName] = await Promise.all([
    getCompetitionBySlug(competitionSlug),
    getCityNameFromSlug(citySlug),
  ])
  if (!competition || !cityName) notFound()

  const [venues, matches] = await Promise.all([
    getVenuesByCompetitionAndCity(competition.id, citySlug),
    getMatches({ competition: competition.name }),
  ])

  const question = `Where can I watch ${competition.name} in ${cityName}?`
  const answer =
    venues.length > 0
      ? `You can watch ${competition.name} at ${venues.length} venue${venues.length === 1 ? '' : 's'} in ${cityName}, including ${venues
          .slice(0, 3)
          .map((v) => v.name)
          .join(', ')}. HAFI tracks live screening times and atmosphere for each venue.`
      : `HAFI doesn't currently have venues confirmed for ${competition.name} in ${cityName}. Check ${competition.name}'s match pages for ticket, livestream, and broadcast options instead.`

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      },
    ],
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: competition.name, item: `${SITE_URL}/competitions/${competition.slug}` },
      { '@type': 'ListItem', position: 2, name: `Watch in ${cityName}` },
    ],
  }

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <Link
        href={`/competitions/${competition.slug}`}
        className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all text-sm font-medium"
      >
        <ChevronLeft className="h-4 w-4" />
        {competition.name}
      </Link>

      {/* This H1 + paragraph pairing is the direct, human-readable answer AI search engines can lift */}
      <section className="rounded-2xl bg-card border border-border p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{question}</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">{answer}</p>
      </section>

      {venues.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            Venues showing {competition.name} in {cityName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </section>
      )}

      {matches.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Upcoming {competition.name} matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
