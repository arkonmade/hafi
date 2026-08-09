import Link from 'next/link'
import type { Venue } from '@/lib/types'

export function VenueMiniCard({ venue }: { venue: Venue }) {
  const isActive = venue.currentFans > 0

  return (
    <Link
      href={`/venue/${venue.id}`}
      className="group block rounded-xl overflow-hidden border border-border bg-secondary/30 hover:border-accent/40 transition-colors"
    >
      <div className="relative aspect-[4/3]">
        <img
          src={venue.image}
          alt={venue.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ring-2 ring-black/20 ${
            isActive ? 'bg-accent' : 'bg-muted-foreground/60'
          }`}
          aria-label={isActive ? 'Active now' : 'Quiet now'}
        />
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium text-foreground truncate">{venue.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {venue.district ?? venue.city} · {venue.currentFans} people
        </p>
      </div>
    </Link>
  )
}
