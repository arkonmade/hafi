import { getVenues } from '@/lib/data/venues'
import { getMatches, getCompetitions } from '@/lib/data/matches'
import { getCommunityActivity } from '@/lib/data/community'
import { FeaturedCarousel } from '@/components/featured-carousel'
import { StatCard } from '@/components/stat-card'
import { MatchesPanel } from '@/components/matches-panel'
import { Panel } from '@/components/panel'
import { AvatarCluster } from '@/components/avatar-cluster'
import { ActivityRow } from '@/components/activity-row'
import { VenueMiniCard } from '@/components/venue-mini-card'

export default async function HomePage() {
  const [venues, liveMatches, scheduledMatches, allMatches, competitions, activity] = await Promise.all([
    getVenues(),
    getMatches({ status: 'live' }),
    getMatches({ status: 'scheduled' }),
    getMatches(),
    getCompetitions(),
    getCommunityActivity(),
  ])
  const featuredVenues = venues.filter((v) => v.currentFans > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left / wide column */}
        <div className="space-y-6 min-w-0">
          <FeaturedCarousel venues={featuredVenues} />

          <div className="grid grid-cols-3 gap-4">
            <StatCard variant="minimal" label="Live matches" value={String(liveMatches.length).padStart(2, '0')} />
            <StatCard variant="minimal" label="Today matches" value={String(scheduledMatches.length).padStart(2, '0')} />
            <StatCard variant="minimal" label="Venues open" value={String(venues.length).padStart(2, '0')} />
          </div>

          <Panel title="Trending venues" subtitle="Where the atmosphere is right now" viewAllHref="/watch?venues">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {venues.map((venue) => (
                <VenueMiniCard key={venue.id} venue={venue} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Right / narrow column */}
        <div className="space-y-6 min-w-0">
          <MatchesPanel matches={allMatches} competitions={competitions} />

          <Panel
            leading={<AvatarCluster avatars={activity.slice(0, 3).map((a) => a.user.avatar)} extraLabel="+1.2k" />}
            title="Friends activity"
            subtitle="What your community is up to"
          >
            <div className="divide-y divide-border">
              {activity.map((item) => (
                <ActivityRow key={item.id} activity={item} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
