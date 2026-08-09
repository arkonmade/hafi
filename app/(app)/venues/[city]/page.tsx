import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronLeft, MapPin } from 'lucide-react'
import { getVenuesByCitySlug, getVenueCitySlugs, getCityNameFromSlug } from '@/lib/data/venues'
import { VenueCard } from '@/components/venue-card'
import { SITE_URL } from '@/lib/seo'

interface CityPageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  const slugs = await getVenueCitySlugs()
  return slugs.map((city) => ({ city }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params
  const cityName = await getCityNameFromSlug(city)
  if (!cityName) return { title: 'City not found — HAFI' }

  const title = `Where to Watch Sports in ${cityName} | HAFI`
  const description = `Find the best bars and venues to watch live football, basketball, and more in ${cityName}, Rwanda — atmosphere, screenings, and reviews on HAFI.`

  return { title, description, openGraph: { title, description } }
}

export default async function VenuesByCityPage({ params }: CityPageProps) {
  const { city } = await params
  const cityName = await getCityNameFromSlug(city)
  if (!cityName) notFound()

  const venues = await getVenuesByCitySlug(city)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Sports venues in ${cityName}`,
    itemListElement: venues.map((v, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'LocalBusiness',
        name: v.name,
        url: `${SITE_URL}/venue/${v.id}`,
        image: v.image,
      },
    })),
  }

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Link href="/watch?venues" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all text-sm font-medium">
        <ChevronLeft className="h-4 w-4" />
        All Venues
      </Link>

      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="h-6 w-6 text-accent" />
          Where to Watch Sports in {cityName}
        </h1>
        <p className="text-muted-foreground mt-2">
          {venues.length} venue{venues.length === 1 ? '' : 's'} in {cityName} showing live matches, tracked by HAFI.
        </p>
      </section>

      <section>
        {venues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No venues found in {cityName} yet.</p>
        )}
      </section>
    </div>
  )
}
