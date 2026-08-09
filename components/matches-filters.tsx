'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Sport } from '@/lib/types'

interface MatchesFiltersProps {
  sports: Sport[]
}

const tabs = [
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'results', label: 'Results' },
] as const

export function MatchesFilters({ sports }: MatchesFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get('status') ?? 'live'
  const sport = searchParams.get('sport') ?? ''

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

  return (
    <>
      {/* Tabs */}
      <section className="flex gap-2 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateParams({ status: tab.value === 'live' ? null : tab.value })}
            className={`px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              status === tab.value
                ? 'border-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Sport Filter */}
      <section className="flex flex-wrap gap-2">
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
            key={s.id}
            onClick={() => updateParams({ sport: sport === s.name ? null : s.name })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              sport === s.name ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </section>
    </>
  )
}
