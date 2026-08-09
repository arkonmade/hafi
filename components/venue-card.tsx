import Link from 'next/link'
import { Star, Users, MapPin } from 'lucide-react'

interface VenueCardProps {
  venue: {
    id: number
    name: string
    city: string
    country: string
    image: string
    rating: number
    atmosphere: string
    capacity: number
    currentFans: number
  }
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venue/${venue.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-2xl bg-card transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-secondary">
          <img
            src={venue.image}
            alt={venue.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
          
          {/* Badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 backdrop-blur">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-semibold">{venue.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">{venue.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {venue.city}, {venue.country}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Atmosphere</span>
              <span className="font-medium text-foreground">{venue.atmosphere}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current fans</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="font-medium">{venue.currentFans.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full mt-2 rounded-lg bg-accent py-2 px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
            View Venue
          </button>
        </div>
      </div>
    </Link>
  )
}
