import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'

interface MatchCardProps {
  match: {
    id: number
    homeTeam: { name: string; logo: string }
    awayTeam: { name: string; logo: string }
    score?: { home: number; away: number }
    status: 'live' | 'scheduled' | 'finished'
    sport: string
    competition: string
    time: string
    venue?: string
  }
}

const statusStyles = {
  live: 'bg-red-500/10 text-red-500',
  scheduled: 'bg-blue-500/10 text-blue-500',
  finished: 'bg-muted text-muted-foreground',
}

const statusLabels = {
  live: 'LIVE',
  scheduled: 'UPCOMING',
  finished: 'FINISHED',
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Link href={`/match/${match.id}`}>
      <div className="group cursor-pointer rounded-2xl bg-card p-4 transition-colors hover:bg-secondary border border-border hover:border-accent">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase">{match.competition}</span>
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[match.status]}`}>
            {statusLabels[match.status]}
          </span>
        </div>

        {/* Teams */}
        <div className="mb-4 grid grid-cols-3 items-center gap-3">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2">
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="h-12 w-12 rounded-lg object-cover" />
            <span className="text-xs font-medium text-center line-clamp-2">{match.homeTeam.name}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            {match.score ? (
              <>
                <div className="text-2xl font-bold">
                  {match.score.home}
                  <span className="text-lg text-muted-foreground mx-2">-</span>
                  {match.score.away}
                </div>
                <span className="text-xs text-muted-foreground">{match.time}</span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-muted-foreground">vs</span>
                <span className="text-xs text-muted-foreground">{match.time}</span>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2">
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="h-12 w-12 rounded-lg object-cover" />
            <span className="text-xs font-medium text-center line-clamp-2">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
          {match.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{match.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{match.sport}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
