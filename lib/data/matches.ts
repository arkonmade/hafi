import { MATCHES, COMPETITIONS, SPORTS, TEAMS, ARTICLES } from '@/lib/constants'
import type { Match } from '@/lib/types'

export interface MatchFilters {
  status?: Match['status']
  sport?: string
  competition?: string
  query?: string
}

export async function getMatches(filters: MatchFilters = {}): Promise<Match[]> {
  return MATCHES.filter((match) => {
    if (filters.status && match.status !== filters.status) return false
    if (filters.sport && match.sport.toLowerCase() !== filters.sport.toLowerCase()) return false
    if (filters.competition && match.competition.toLowerCase() !== filters.competition.toLowerCase()) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const matches =
        match.homeTeam.name.toLowerCase().includes(q) ||
        match.awayTeam.name.toLowerCase().includes(q) ||
        match.competition.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}

export async function getMatchById(id: number): Promise<Match | null> {
  return MATCHES.find((m) => m.id === id) ?? null
}

export async function getMatchSports(): Promise<string[]> {
  return Array.from(new Set(MATCHES.map((m) => m.sport)))
}

/** Full Sport objects (name + icon) for sports currently in use by at least one match. */
export async function getSportsInUse() {
  const names = new Set(MATCHES.map((m) => m.sport))
  return SPORTS.filter((s) => names.has(s.name))
}

export async function getCompetitions() {
  return COMPETITIONS
}

export async function getCompetitionById(id: number) {
  return COMPETITIONS.find((c) => c.id === id) ?? null
}

export async function getCompetitionBySlug(slug: string) {
  return COMPETITIONS.find((c) => c.slug === slug) ?? null
}

export async function getCompetitionByName(name: string) {
  return COMPETITIONS.find((c) => c.name === name) ?? null
}

/** Teams that appear in matches under this competition, resolved to full Team records where possible. */
export async function getTeamsInCompetition(competitionName: string) {
  const names = new Set<string>()
  for (const m of MATCHES) {
    if (m.competition === competitionName) {
      names.add(m.homeTeam.name)
      names.add(m.awayTeam.name)
    }
  }
  return TEAMS.filter((t) => names.has(t.name))
}

export async function getArticlesForCompetition(competitionName: string) {
  return ARTICLES.filter((a) => a.title.includes(competitionName) || a.excerpt.includes(competitionName))
}
