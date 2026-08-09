import Link from 'next/link'
import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/data/user'
import { getTeams } from '@/lib/data/teams'
import { getVenues } from '@/lib/data/venues'
import { Settings as SettingsIcon, Share2 } from 'lucide-react'
import { VenueMiniCard } from '@/components/venue-mini-card'

export const metadata: Metadata = { title: 'Profile — HAFI' }

export default async function ProfilePage() {
  const [userProfile, allTeams, allVenues] = await Promise.all([getCurrentUser(), getTeams(), getVenues()])
  const favoriteTeams = allTeams.filter((t) => userProfile.favoriteTeams.includes(t.id))
  const followedVenues = allVenues.filter((v) => userProfile.followedVenues.includes(v.id))

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <section className="rounded-2xl bg-card border border-border p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-6">
          <img src={userProfile.avatar} alt={userProfile.name} className="h-24 w-24 rounded-full object-cover" />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{userProfile.name}</h1>
            <p className="text-muted-foreground">{userProfile.handle}</p>
            <p className="text-sm text-muted-foreground mt-2">{userProfile.bio}</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{userProfile.followers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{userProfile.following}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{userProfile.achievements.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </div>
        </div>
      </section>

      {/* Favorite Teams */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Favorite Teams</h2>
        {favoriteTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTeams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.slug}`}
                className="rounded-xl bg-card border border-border p-4 hover:border-accent transition-colors block"
              >
                <div className="flex gap-3 items-start mb-3">
                  <img src={team.logo} alt={team.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{team.name}</h3>
                    <p className="text-xs text-muted-foreground">{team.sport}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{team.followers.toLocaleString()} followers</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You haven't favorited any teams yet.{' '}
            <Link href="/matches" className="text-accent hover:underline">
              Browse teams
            </Link>
          </p>
        )}
      </section>

      {/* Favorite Sports */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Favorite Sports</h2>
        <div className="flex flex-wrap gap-2">
          {userProfile.favoriteSports.map((sport) => (
            <div key={sport} className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
              {sport}
            </div>
          ))}
        </div>
      </section>

      {/* Following (Venues) — following a venue carries the same weight as following a club */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Venues You Follow</h2>
        {followedVenues.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {followedVenues.map((venue) => (
              <VenueMiniCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You're not following any venues yet.{' '}
            <Link href="/watch" className="text-accent hover:underline">
              Discover venues
            </Link>
          </p>
        )}
      </section>

      {/* Achievements */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userProfile.achievements.map((achievement) => (
            <div key={achievement.id} className="rounded-xl bg-card border border-border p-4 text-center">
              <p className="text-4xl mb-2">{achievement.icon}</p>
              <h3 className="font-semibold text-foreground">{achievement.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
