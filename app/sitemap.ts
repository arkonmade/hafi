import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { getVenues, getVenueCitySlugs } from '@/lib/data/venues'
import { getMatches, getCompetitions } from '@/lib/data/matches'
import { getArticles } from '@/lib/data/articles'
import { getTeams } from '@/lib/data/teams'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [venues, matches, articles, teams, competitions, citySlugs] = await Promise.all([
    getVenues(),
    getMatches(),
    getArticles(),
    getTeams(),
    getCompetitions(),
    getVenueCitySlugs(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/watch`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/watch?venues`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/matches`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/news`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/help`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/support`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/careers`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/cookies`, changeFrequency: 'yearly', priority: 0.1 },
  ]

  const venueRoutes: MetadataRoute.Sitemap = venues.map((v) => ({
    url: `${SITE_URL}/venue/${v.id}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const matchRoutes: MetadataRoute.Sitemap = matches.map((m) => ({
    url: `${SITE_URL}/match/${m.id}`,
    changeFrequency: 'hourly',
    priority: m.status === 'live' ? 1 : 0.7,
  }))

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  const teamRoutes: MetadataRoute.Sitemap = teams.map((t) => ({
    url: `${SITE_URL}/teams/${t.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const competitionRoutes: MetadataRoute.Sitemap = competitions.map((c) => ({
    url: `${SITE_URL}/competitions/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  const cityRoutes: MetadataRoute.Sitemap = citySlugs.map((city) => ({
    url: `${SITE_URL}/venues/${city}`,
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  const whereToWatchRoutes: MetadataRoute.Sitemap = competitions.flatMap((c) =>
    citySlugs.map((city) => ({
      url: `${SITE_URL}/where-to-watch/${c.slug}/${city}`,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
  )

  return [
    ...staticRoutes,
    ...venueRoutes,
    ...matchRoutes,
    ...articleRoutes,
    ...teamRoutes,
    ...competitionRoutes,
    ...cityRoutes,
    ...whereToWatchRoutes,
  ]
}
