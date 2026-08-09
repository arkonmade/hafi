'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'

interface WatchFiltersProps {
  cities: string[]
  sports: string[]
}

/**
 * Reads/writes the URL directly (?city=&sport=&open=&q=&venues) rather than
 * local component state. This is what makes filtered Watch URLs shareable,
 * bookmarkable, and back/forward-navigable — the filtered result set is
 * rendered server-side from these same params in page.tsx, not recomputed
 * client-side from local state.
 */
export function WatchFilters({ cities, sports }: WatchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isVenuesMode = searchParams.has('venues')
  const city = searchParams.get('city') ?? ''
  const sport = searchParams.get('sport') ?? ''
  const query = searchParams.get('q') ?? ''
  const openOnly = searchParams.get('open') === 'true'

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function setMode(mode: 'matches' | 'venues') {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === 'venues') {
      params.set('venues', '')
    } else {
      params.delete('venues')
      params.delete('city')
      params.delete('sport')
      params.delete('open')
      params.delete('q')
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('matches')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !isVenuesMode ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          By Match
        </button>
        <button
          onClick={() => setMode('venues')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isVenuesMode ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          All Venues
        </button>
      </div>

      {isVenuesMode && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search venues by name or city..."
              defaultValue={query}
              onChange={(e) => updateParams({ q: e.target.value || null })}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 pl-12 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* City filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParams({ city: null })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !city ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              All Cities
            </button>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => updateParams({ city: city === c ? null : c })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  city === c ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sport + Open now filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParams({ sport: null })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !sport ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              All Sports
            </button>
            {sports.map((s) => (
              <button
                key={s}
                onClick={() => updateParams({ sport: sport === s ? null : s })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  sport === s ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => updateParams({ open: openOnly ? null : 'true' })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                openOnly ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              Open Now
            </button>
          </div>
        </>
      )}
    </div>
  )
}
