import { TEAMS, MATCHES, ARTICLES, VENUES, COMPETITIONS } from '@/lib/constants'

export async function getTeams() {
  return TEAMS
}

export async function getTeamById(id: number) {
  return TEAMS.find((t) => t.id === id) ?? null
}

export async function getTeamBySlug(slug: string) {
  return TEAMS.find((t) => t.slug === slug) ?? null
}

export async function getTeamsBySport(sport: string) {
  return TEAMS.filter((t) => t.sport.toLowerCase() === sport.toLowerCase())
}

/** Matches (past or upcoming) involving this team, by name. */
export async function getMatchesForTeam(teamName: string) {
  return MATCHES.filter((m) => m.homeTeam.name === teamName || m.awayTeam.name === teamName)
}

/** Articles that mention this team, either explicitly tagged or by name in the title. */
export async function getArticlesForTeam(team: { id: number; name: string }) {
  return ARTICLES.filter(
    (a) => a.relatedTeamIds?.includes(team.id) || a.title.includes(team.name) || a.excerpt.includes(team.name),
  )
}

/** Venues likely to show this team's matches — those commonly showing a competition the team plays in. */
export async function getVenuesForTeam(teamName: string) {
  const competitionNames = new Set(
    MATCHES.filter((m) => m.homeTeam.name === teamName || m.awayTeam.name === teamName).map((m) => m.competition),
  )
  const competitionIds = COMPETITIONS.filter((c) => competitionNames.has(c.name)).map((c) => c.id)
  return VENUES.filter((v) => v.commonlyShows.some((id) => competitionIds.includes(id)))
}
