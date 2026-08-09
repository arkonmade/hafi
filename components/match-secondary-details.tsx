'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Match } from '@/lib/types'

interface MatchSecondaryDetailsProps {
  match: Match
}

/**
 * Timeline and lineups are real information people sometimes want, but
 * HAFI's philosophy is community before statistics — so this is collapsed
 * by default rather than given hero placement, and only renders at all if
 * the match actually has timeline/lineup data.
 */
export function MatchSecondaryDetails({ match }: MatchSecondaryDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasTimeline = match.timeline && match.timeline.length > 0
  const hasLineups = match.lineups

  if (!hasTimeline && !hasLineups) return null

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">Match details</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border-t border-border p-5 space-y-8">
          {hasTimeline && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Timeline</h3>
              <div className="space-y-2">
                {match.timeline!.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-4 rounded-lg bg-secondary/30 p-3">
                    <div className="flex-shrink-0 w-12 text-center">
                      <p className="font-bold text-accent text-sm">{event.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{event.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.player} ({event.team === 'home' ? match.homeTeam.name : match.awayTeam.name})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasLineups && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lineups</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-secondary/30 p-4">
                  <h4 className="font-semibold text-foreground text-sm mb-3">{match.homeTeam.name}</h4>
                  <div className="space-y-2">
                    {match.lineups!.home.map((player, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                        {player}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-secondary/30 p-4">
                  <h4 className="font-semibold text-foreground text-sm mb-3">{match.awayTeam.name}</h4>
                  <div className="space-y-2">
                    {match.lineups!.away.map((player, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                        {player}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
