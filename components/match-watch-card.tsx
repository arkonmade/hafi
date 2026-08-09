'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Match, Venue } from '@/lib/types'
import { WaysToWatch } from '@/components/ways-to-watch'

interface MatchWatchCardProps {
  match: Match
  venues: Venue[]
  defaultExpanded?: boolean
}

export function MatchWatchCard({ match, venues, defaultExpanded = false }: MatchWatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={() => setIsExpanded((prev) => !prev)} className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-secondary/30 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground">{match.competition}</span>
            {match.status === 'live' && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img src={match.homeTeam.logo} alt="" className="h-6 w-6 rounded-full object-cover flex-shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">{match.homeTeam.name}</span>
              {match.score && <span className="text-sm font-bold text-foreground ml-auto">{match.score.home}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img src={match.awayTeam.logo} alt="" className="h-6 w-6 rounded-full object-cover flex-shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">{match.awayTeam.name}</span>
              {match.score && <span className="text-sm font-bold text-foreground ml-auto">{match.score.away}</span>}
            </div>
          </div>
          {!match.score && <p className="text-xs text-muted-foreground mt-2">{match.time}</p>}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-5">
          <WaysToWatch match={match} venues={venues} />
        </div>
      )}
    </div>
  )
}
