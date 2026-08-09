import { FRIEND_ACTIVITIES, USER_PROFILE } from '@/lib/constants'

export async function getCommunityActivity() {
  return FRIEND_ACTIVITIES
}

export async function getActivityForVenue(venueId: number) {
  return FRIEND_ACTIVITIES.filter((a) => a.target.type === 'venue' && a.target.id === venueId)
}
