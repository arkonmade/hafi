'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { Competition, Match } from '@/lib/types'

interface MatchesPanelProps {
  matches: Match[]
  competitions: Competition[]
}

function LiveMatchTile({ match }: { match: Match }) {
  return (
    <Link
      href={`/match/${match.id}`}
      className="rounded-xl border border-border bg-secondary/30 p-3 hover:border-accent/40 transition-colors"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-[11px] font-medium text-accent">{match.time}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <img src={match.homeTeam.logo} alt="" className="h-4 w-4 rounded-full object-cover flex-shrink-0" />
            <span className="truncate text-xs font-medium text-foreground">{match.homeTeam.name}</span>
          </div>
          <span className="text-xs font-bold text-foreground flex-shrink-0">{match.score?.home ?? '-'}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <img src={match.awayTeam.logo} alt="" className="h-4 w-4 rounded-full object-cover flex-shrink-0" />
            <span className="truncate text-xs font-medium text-foreground">{match.awayTeam.name}</span>
          </div>
          <span className="text-xs font-bold text-foreground flex-shrink-0">{match.score?.away ?? '-'}</span>
        </div>
      </div>
    </Link>
  )
}

function UpcomingMatchRow({ match }: { match: Match }) {
  return (
    <Link
      href={`/match/${match.id}`}
      className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 hover:border-accent/40 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img src={match.homeTeam.logo} alt="" className="h-5 w-5 rounded-full object-cover flex-shrink-0" />
        <span className="truncate text-sm font-medium text-foreground">{match.homeTeam.name}</span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground flex-shrink-0 px-1">{match.time}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
        <span className="truncate text-sm font-medium text-foreground text-right">{match.awayTeam.name}</span>
        <img src={match.awayTeam.logo} alt="" className="h-5 w-5 rounded-full object-cover flex-shrink-0" />
      </div>
    </Link>
  )
}

export function MatchesPanel({ matches, competitions }: MatchesPanelProps) {
  const [liveOnly, setLiveOnly] = useState(true)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return matches.filter((m) => {
      if (liveOnly && m.status !== 'live') return false
      if (!q) return true
      return (
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.competition.toLowerCase().includes(q)
      )
    })
  }, [matches, liveOnly, query])

  const groups = useMemo(() => {
    return competitions
      .map((comp) => ({
        competition: comp,
        matches: filtered.filter((m) => m.competition === comp.name),
      }))
      .filter((g) => g.matches.length > 0)
  }, [competitions, filtered])

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header: live toggle, search, count */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setLiveOnly((prev) => !prev)}
          className={`flex-shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
            liveOnly ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          live
        </button>
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-8 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex-shrink-0 flex items-center justify-center h-8 min-w-8 px-2 rounded-full border border-border text-xs font-semibold text-foreground">
          {matches.length}
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No matches match your search.</p>
        )}
        {groups.map(({ competition, matches: compMatches }) => {
          const isLiveGroup = compMatches.every((m) => m.status === 'live')
          return (
            <div key={competition.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
                  {competition.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{competition.name}</p>
                  <p className="text-xs text-muted-foreground">{competition.region}</p>
                </div>
              </div>

              {isLiveGroup ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {compMatches.map((m) => (
                    <LiveMatchTile key={m.id} match={m} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {compMatches.map((m) => (
                    <UpcomingMatchRow key={m.id} match={m} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
