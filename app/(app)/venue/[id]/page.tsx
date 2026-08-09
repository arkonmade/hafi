import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Star, MapPin, Wifi, UtensilsCrossed, ParkingCircle, Crown, ChevronLeft } from 'lucide-react'
import { getVenueById } from '@/lib/data/venues'
import { getMatchById, getCompetitionById } from '@/lib/data/matches'
import { Panel } from '@/components/panel'
import { FollowButton } from '@/components/follow-button'
import { CheckInButton } from '@/components/check-in-button'
import { ActivityRow } from '@/components/activity-row'

const facilityIcons: Record<string, React.ReactNode> = {
  'Food Court': <UtensilsCrossed className="h-5 w-5" />,
  'VIP Lounge': <Crown className="h-5 w-5" />,
  Parking: <ParkingCircle className="h-5 w-5" />,
  WiFi: <Wifi className="h-5 w-5" />,
  Bar: <UtensilsCrossed className="h-5 w-5" />,
  Kitchen: <UtensilsCrossed className="h-5 w-5" />,
  'Full Kitchen': <UtensilsCrossed className="h-5 w-5" />,
  Screens: <Star className="h-5 w-5" />,
  'Big Screens': <Star className="h-5 w-5" />,
  'Multiple Screens': <Star className="h-5 w-5" />,
  Balcony: <Star className="h-5 w-5" />,
  'Rooftop Terrace': <Star className="h-5 w-5" />,
  'Lake View Terrace': <Star className="h-5 w-5" />,
  'Premium Seating': <Crown className="h-5 w-5" />,
  Restaurant: <UtensilsCrossed className="h-5 w-5" />,
  Lounge: <Crown className="h-5 w-5" />,
  'Valet Parking': <ParkingCircle className="h-5 w-5" />,
  'Outdoor Seating': <Star className="h-5 w-5" />,
  'Pool Table': <Star className="h-5 w-5" />,
}

interface VenuePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { id } = await params
  const venue = await getVenueById(parseInt(id))
  if (!venue) return { title: 'Venue not found — HAFI' }

  const location = venue.district ? `${venue.district}, ${venue.city}` : venue.city
  const title = `${venue.name} — ${location} | HAFI`
  const description = `${venue.name} in ${location}: ${venue.atmosphere} atmosphere, ${venue.rating}★ rated. See upcoming screenings, facilities, and reviews on HAFI.`

  return {
    title,
    description,
    openGraph: { title, description, images: [venue.image] },
  }
}

export default async function VenueDetailsPage({ params }: VenuePageProps) {
  const { id } = await params
  const venue = await getVenueById(parseInt(id))

  if (!venue) notFound()

  const commonCompetitions = (
    await Promise.all(venue.commonlyShows.map((cid) => getCompetitionById(cid)))
  ).filter(Boolean) as NonNullable<Awaited<ReturnType<typeof getCompetitionById>>>[]

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Watch', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hafi.rw'}/watch?venues` },
      { '@type': 'ListItem', position: 2, name: venue.name },
    ],
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: venue.name,
    image: venue.image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: venue.district ?? venue.city,
      addressRegion: venue.city,
      addressCountry: venue.country,
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: venue.rating, reviewCount: Math.max(venue.followers, 1) },
    openingHours: venue.openingHours,
    ...(venue.location ? { geo: { '@type': 'GeoCoordinates', latitude: venue.location.lat, longitude: venue.location.lng } } : {}),
  }

  const screeningMatches = await Promise.all(venue.upcomingScreenings.map((s) => getMatchById(s.id)))

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      {/* Back Button */}
      <Link href="/watch" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all text-sm font-medium">
        <ChevronLeft className="h-4 w-4" />
        Back to Venues
      </Link>

      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
        <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/50" />
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 backdrop-blur">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-semibold">{venue.rating}</span>
        </div>
      </div>

      {/* Venue Info */}
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{venue.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {venue.district ? `${venue.district}, ` : ''}
            {venue.city}, {venue.country}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl bg-card p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Atmosphere</p>
            <p className="font-semibold text-foreground">{venue.atmosphere}</p>
          </div>
          <div className="rounded-xl bg-card p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Capacity</p>
            <p className="font-semibold text-foreground">{venue.capacity.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-card p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Here now</p>
            <p className="font-semibold text-foreground">{venue.currentFans.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-card p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Hours</p>
            <p className="font-semibold text-foreground text-sm">{venue.openingHours}</p>
          </div>
        </div>

        {/* CTA — Follow is primary: following a venue carries the same weight as following a club */}
        <div className="flex gap-3">
          <FollowButton initialFollowers={venue.followers} className="flex-1" />
          <CheckInButton className="flex-1" />
        </div>
      </section>

      {/* Upcoming Screenings */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Upcoming Screenings</h2>
        {venue.upcomingScreenings.length > 0 ? (
          <div className="space-y-3">
            {venue.upcomingScreenings.map((screening, idx) => {
              const fullMatch = screeningMatches[idx]
              return (
                <Link
                  key={screening.id}
                  href={fullMatch ? `/match/${fullMatch.id}` : '#'}
                  className="flex items-center justify-between gap-4 rounded-xl bg-card border border-border p-4 hover:border-accent/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{screening.teams}</p>
                    <p className="text-sm text-muted-foreground">{screening.sport}</p>
                  </div>
                  <p className="text-sm font-medium text-accent shrink-0">{screening.time}</p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-secondary/50 p-6 text-center">
            <p className="text-muted-foreground">No screenings scheduled at this time — check back soon</p>
          </div>
        )}
      </section>

      {/* Commonly Shows */}
      {commonCompetitions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Commonly Shows</h2>
          <div className="flex flex-wrap gap-2">
            {commonCompetitions.map((comp) => (
              <Link
                key={comp.id}
                href={`/competitions/${comp.slug}`}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
              >
                {comp.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Photos */}
      {venue.photos.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Photos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {venue.photos.map((photo, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                <img src={photo} alt={`${venue.name} photo ${idx + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Facilities */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {venue.facilities.map((facility) => (
            <div key={facility} className="flex items-center gap-3 rounded-lg bg-card p-3 border border-border">
              {facilityIcons[facility] || <Star className="h-5 w-5" />}
              <span className="text-sm font-medium text-foreground">{facility}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Location Details */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Location Details</h2>
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium text-foreground mt-1">
              {venue.district ? `${venue.district}, ` : ''}
              {venue.city}, {venue.country}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Opening Hours</p>
            <p className="font-medium text-foreground mt-1">{venue.openingHours}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Capacity</p>
            <p className="font-medium text-foreground mt-1">{venue.capacity.toLocaleString()} people</p>
          </div>
        </div>
      </section>

      {/* Recent Activity — real community activity, not placeholder reviews */}
      <Panel title="Recent activity" subtitle={`What's happening at ${venue.name}`}>
        {venue.recentActivity.length > 0 ? (
          <div className="divide-y divide-border">
            {venue.recentActivity.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            No activity yet — be the first to check in or follow this venue.
          </p>
        )}
      </Panel>
    </div>
  )
}
