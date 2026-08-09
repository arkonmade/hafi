import { Ticket, Tv, PlayCircle, Smartphone, MapPin } from 'lucide-react'
import type { Match, Venue } from '@/lib/types'
import { VenueMiniCard } from '@/components/venue-mini-card'

interface WaysToWatchProps {
  match: Match
  /** Venues resolved from match.waysToWatch.venues by the caller (via lib/data/venues), since this component doesn't touch the data layer itself. */
  venues?: Venue[]
  /** Hide the "venues showing it" section — useful when the caller (e.g. a venue's own page) already shows this context another way. */
  hideVenues?: boolean
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        {children}
      </div>
    </div>
  )
}

/**
 * Answers "how do I experience this match?" — HAFI's core Watch
 * differentiator. Renders only the sections that actually apply to this
 * match; a friendly fallback appears if nothing is configured yet.
 */
export function WaysToWatch({ match, venues = [], hideVenues = false }: WaysToWatchProps) {
  const { waysToWatch } = match

  const hasAnything =
    waysToWatch.tickets?.available ||
    (!hideVenues && venues.length > 0) ||
    waysToWatch.livestream ||
    (waysToWatch.streamingApps && waysToWatch.streamingApps.length > 0) ||
    (waysToWatch.broadcast && waysToWatch.broadcast.length > 0)

  if (!hasAnything) {
    return <p className="text-sm text-muted-foreground">No viewing information available for this match yet.</p>
  }

  return (
    <div className="space-y-5">
      {waysToWatch.tickets?.available && (
        <Row icon={<Ticket className="h-4 w-4" />} label="Attend in person">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">
              Tickets from{' '}
              <span className="font-semibold">
                {waysToWatch.tickets.priceFrom?.toLocaleString()} {waysToWatch.tickets.currency}
              </span>
            </p>
            <button className="flex-shrink-0 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/90 transition-colors">
              Get tickets
            </button>
          </div>
        </Row>
      )}

      {!hideVenues && venues.length > 0 && (
        <Row icon={<MapPin className="h-4 w-4" />} label={`${venues.length} venue${venues.length > 1 ? 's' : ''} showing it`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {venues.map((venue) => (
              <VenueMiniCard key={venue.id} venue={venue} />
            ))}
          </div>
        </Row>
      )}

      {waysToWatch.livestream && (
        <Row icon={<PlayCircle className="h-4 w-4" />} label="Livestream">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">{waysToWatch.livestream.provider}</p>
            <button className="flex-shrink-0 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-colors">
              Watch stream
            </button>
          </div>
        </Row>
      )}

      {waysToWatch.streamingApps && waysToWatch.streamingApps.length > 0 && (
        <Row icon={<Smartphone className="h-4 w-4" />} label="Streaming apps">
          <div className="flex flex-wrap gap-2">
            {waysToWatch.streamingApps.map((app) => (
              <span key={app.name} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                {app.name}
              </span>
            ))}
          </div>
        </Row>
      )}

      {waysToWatch.broadcast && waysToWatch.broadcast.length > 0 && (
        <Row icon={<Tv className="h-4 w-4" />} label="TV broadcast">
          <div className="space-y-1">
            {waysToWatch.broadcast.map((b, i) => (
              <p key={i} className="text-sm text-foreground">
                {b.channel} <span className="text-muted-foreground">· {b.region}</span>
              </p>
            ))}
          </div>
        </Row>
      )}
    </div>
  )
}
